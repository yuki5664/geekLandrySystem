// const https = require('https');
const fetch = require('node-fetch');
const CryptoJS = require('crypto-js');

// アクセストークンの取得
const headers = {
    client_id: "mnytrtcna0j4uh0urkur",
    sign: "",
    access_token: "",
    t: 0,
    sign_method: "HMAC-SHA256"
};

// TODO: 2時間に一回、アクセストークンを取得する
// 1.アクセストークンの取得
// 現在時刻の取得
function getTime(){
    const timestamp = new Date().getTime();
    return timestamp;
}


// アクセストークン用
function access_calcSign(clientId, secret, timestamp){
    const str = clientId + timestamp;
    const hash = CryptoJS.HmacSHA256(str, secret);
    const hashInBase64 = hash.toString();
    const signUp = hashInBase64.toUpperCase();
    return signUp;
}

    const timestamp = getTime();
    const secret = "117ffe6d7b25413d8dad20f262c1a197";
    const clientId = headers.client_id;
    const access_token = headers.access_token;
    const sign = calcSign(clientId, access_token, secret, timestamp);
    headers.sign = sign;
    headers.t = timestamp;


// 電流データの取得用
function calcSign(clientId, access_token, secret, timestamp){
    const str = clientId + access_token + timestamp;
    const hash = CryptoJS.HmacSHA256(str, secret);
    const hashInBase64 = hash.toString();
    const signUp = hashInBase64.toUpperCase();
    return signUp;
}


async function getAccesstokenApi() {
    let AccessTokenUrl = 'https://openapi.tuyaus.com/v1.0/token?grant_type=1';
    let options = {
        method: 'GET',
        headers: headers,
    }
    
    var res = await fetch(AccessTokenUrl, options);
    var responseBody = await res.json();
    const access_token = await responseBody.result.access_token;
    const sign = calcSign(clientId, access_token, secret, timestamp)

    console.log(`このAPIから帰ってきたトークンは${access_token}です`)
}

getAccesstokenApi();


async function getDateApi() {
    let AccessTokenUrl = 'https://openapi.tuyaus.com/v1.0/devices/eb81d3d6ba9e2fbc75hdyr';
    let options = {
        method: 'GET',
        headers: headers,
    }
    
    var res = await fetch(AccessTokenUrl, options);
    var responseBody = await res.json();
    const access_token = await responseBody.result.access_token;
    const sign = calcSign(clientId, access_token, secret, timestamp)

    console.log(`このAPIから帰ってきたトークンは${access_token}です`)
}



