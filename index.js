const https = require('https');
const CryptoJS = require('crypto-js');

// 1.アクセストークンの取得
// 現在時刻の取得
function getTime(){
    const timestamp = new Date().getTime();
    return timestamp;
}

// アクセスに必要な部分をまとめる
function calcSign(clientId,access_token,secret,timestamp){
    const str = clientId + access_token + timestamp;
    const hash = CryptoJS.HmacSHA256(str, secret);
    const hashInBase64 = hash.toString();
    const signUp = hashInBase64.toUpperCase();
    return signUp;
}

// アクセストークン用
function access_calcSign(clientId,secret,timestamp){
    const str = clientId + timestamp;
    const hash = CryptoJS.HmacSHA256(str, secret);
    const hashInBase64 = hash.toString();
    const signUp = hashInBase64.toUpperCase();
    return signUp;
}

// データの取得
const data_headers = {
    client_id: "mnytrtcna0j4uh0urkur",
    access_token: "",//最新のアクセストークンで行うこと
    sign: "",
    t: 0,
    sign_method: "HMAC-SHA256"
};
// アクセストークンの取得
const headers = {
    client_id: "mnytrtcna0j4uh0urkur",
    sign: "",
    t: 0,
    sign_method: "HMAC-SHA256"
};

const timestamp = getTime();
const secret = "117ffe6d7b25413d8dad20f262c1a197";
const clientId = headers.client_id;
const access_token = headers.access_token;
const sign = access_calcSign(clientId,secret,timestamp);
headers.sign = sign;
headers.t = timestamp;


const options = {
    protocol: 'https:',
    host: 'openapi.tuyaus.com',
    path: '/v1.0/token?grant_type=1',
    method: 'GET',
    headers: headers
};

// 叩いて取得したアクセストークンを変数にいれる
const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
})

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();

// 2時間に一回、refresh tokeを取得する
