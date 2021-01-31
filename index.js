const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');
const clientId = process.env.IOT_CLIENT_ID;
const secret = process.env.IOT_SECRET;
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION_NAME // DynamoDBのリージョン
});


// TODO: 2時間に一回、アクセストークンを取得する
// アクセストークンの取得

// headersを定義する
const headers = {
    client_id: clientId,
    sign: "",
    access_token: "",
    t: 0,
    sign_method: "HMAC-SHA256"
};

// 現在時刻の取得
function getTime(){
    const timestamp = new Date().getTime();
    return timestamp;
}

// headerの値を取得する
function getHeaders1() {
    const timestamp = getTime();
    const clientId = headers.client_id;
    const access_token = "";
    const sign = calcSign(clientId, access_token, secret, timestamp);
    headers.sign = sign;
    headers.t = timestamp;
    return headers
}

function getHeaders2(access_token) {
    const timestamp = getTime();
    const clientId = headers.client_id;
    const sign = calcSign(clientId, access_token, secret, timestamp);
    headers.access_token = access_token;
    headers.sign = sign;
    headers.t = timestamp;
    return headers
}

// 電流データの取得用
function calcSign(clientId, access_token, secret, timestamp){
    const str = clientId + access_token + timestamp;
    const hash = CryptoJS.HmacSHA256(str, secret);
    const hashInBase64 = hash.toString();
    const signUp = hashInBase64.toUpperCase();
    return signUp;
}

// アクセストークン用のAPIを叩き,access_tokenを取得
async function getAccesstokenApi() {
    let AccessTokenUrl = 'https://openapi.tuyaus.com/v1.0/token?grant_type=1';
    let options = {
        method: 'GET',
        headers: getHeaders1(),
    }
    var res = await fetch(AccessTokenUrl, options);
    var responseBody = await res.json();
    const access_token = await responseBody.result.access_token;
    // const sign = calcSign(clientId, access_token, secret, timestamp)
    return access_token
}

// 電流データ用のAPIを叩き電流データを取得
async function getDateApi() {
    const access_token = await getAccesstokenApi();
    let AccessTokenUrl = 'https://openapi.tuyaus.com/v1.0/devices/eb81d3d6ba9e2fbc75hdyr';
    let options = {
        method: 'GET',
        headers: getHeaders2(access_token),
    }
    
    let res = await fetch(AccessTokenUrl, options);
    let responseBody = await res.json();
    let status = await responseBody.result.status[3].value
    console.log(status);
    return status;
}

exports.handler = async event => {
  // 一意な値を作るためにタイムスタンプを取得
    const created_at = Number(Date.now());
    const { message } = event;
    const status = await getDateApi();

    const params = {
        TableName: "geekLaundrySystem",
        Item: {
            "id": created_at,
            "data": status, //電流のデータ
            },
    };
    try {
        const result = await dynamoDB.put(params).promise();
        return {
        statusCode: 200,
        body: JSON.stringify(result),
        };
    } catch (error) {
        return {
        statusCode: error.statusCode,
        body: error.message,
        };
    }
};