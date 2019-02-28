
// CHANGE THIS /////////////////////////////////////////////////

let A_METAMASK = "0x9C73363B89C0Eda0dbA1B4a5250E891F60723378";

////////////////////////////////////////////////////////////////


var Web3 = require("web3");
const fs = require('fs');
const request = require("request");

const C_URL = "http://localhost:8545";
const C_MINT = "0x40c10f19000000000000000000000000"; //MINT 에 붙는 접두어
const C_APPROVE = "0x095ea7b3000000000000000000000000"; //APPROVE 에 붙는 접두어
const C_ZERO = "000000000000000000000000000000000000000000000000000000000000000"; // 사이에 들어가는 0들

let A_TRUFFLE = "";
let A_TOKEN = "";
let A_ExitHandler = "";
let A_ID = 1000;
let A_tokenId = 1;
//const C_GAS = "0x22d56";

//const web3 = new Web3(Web3.givenProvider || 'ws://localhost:9545');//, options); //FOR CONSOLE
const web3 = new Web3(Web3.givenProvider || C_URL);//, options); //FOR TEST RPC


function sendRPC(jsonMethod, params, callback) {
    //console.log(params);
	request({
		url: C_URL,
		method: "POST",
		headers: {
			"content-type": "application/json",
			},
		json: {
			"jsonrpc":"2.0",
			"method":jsonMethod,
			"params":[params],
			"id":A_ID++
		}
	//  body: JSON.stringify(requestData)
		}, function (err, res, body) {
	  //console.log(JSON.stringify(body));
	  callback(body);
	});
}
 
web3.eth.getAccounts((error, result) => {
    A_TRUFFLE = result[0];
    var auto_leap = fs.readFileSync('auto-leap.log', 'UTF8');
    
    var idx = auto_leap.indexOf('NaiveStorageToken');
    A_TOKEN = auto_leap.slice(idx+19,idx+61);
    
    idx = auto_leap.indexOf('ExitHandler');
    A_ExitHandler = auto_leap.slice(idx+19,idx+61);

    var result_hash = "";
    
    //"0xC0f6557cbC7F0B9f1f41b0BB203350dcf391836d"
    web3.eth.sendTransaction(
        {from:A_TRUFFLE,
        to:A_METAMASK, //CHANGE IT (METAMASK)
        value:  "10000000000000000000", 
        data: "0xdf"
            }, (err, transactionHash) => {
      if (!err){
        console.log(transactionHash + " success"); 
        sendRPC("eth_estimateGas",
        {
            data: C_MINT+A_METAMASK.slice(2)+C_ZERO+A_tokenId // A_TRUFFLE
            ,from: A_TRUFFLE //TRUFFLE 계정
            ,to: A_TOKEN
            ,value: "0x0"
        }, (gas)=>{
            console.log(gas.result);
            sendRPC("eth_sendTransaction", 
            {
                data: C_MINT+A_METAMASK.slice(2)+C_ZERO+A_tokenId // A_TRUFFLE
                ,from: A_TRUFFLE //TRUFFLE 계정
                ,gas: gas.result
                ,to: A_TOKEN
                ,value: "0x0"},
                (body)=>{
                    console.log(JSON.stringify(body));
                    result_hash = body.result;
                    //{"id":1169,"jsonrpc":"2.0","result":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"}

                    // id: 1171
                    // jsonrpc: "2.0"
                    // method: "eth_getTransactionReceipt"
                    // params: ["0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"]
                    
                    // {"id":1171,"jsonrpc":"2.0","result":{"transactionHash":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42","transactionIndex":"0x00","blockHash":"0xd5d854c4889556a3358166b871be4d4b5d162a94162ea915ee300b01688935b9","blockNumber":"0x1a","gasUsed":"0x022d56","cumulativeGasUsed":"0x022d56","contractAddress":null,"logs":[{"logIndex":"0x00","transactionIndex":"0x00","transactionHash":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42","blockHash":"0xd5d854c4889556a3358166b871be4d4b5d162a94162ea915ee300b01688935b9","blockNumber":"0x1a","address":"0x02428e6cfffab34102e86318fea4de61330c17b8","data":"0x0","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000000000000000000000000000000000000000000000","0x00000000000000000000000028467c88a719011617267b1fc47222a1c310b868","0x0000000000000000000000000000000000000000000000000000000000000004"],"type":"mined"}],"status":1}}
                    
                    
                    // method: "eth_getTransactionByHash"
                    // params: ["0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"]
                    // 0: "0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42" // 이거생략함

                    sendRPC("eth_getTransactionReceipt", result_hash, (body) =>{
                        //////////////////////////APPROVE ////////////////////////
                        sendRPC("eth_estimateGas",
                        {
                            data: C_APPROVE+A_ExitHandler.slice(2)+C_ZERO+A_tokenId
                            ,from: A_TRUFFLE //TRUFFLE 계정
                            ,to: A_TOKEN
                            ,value: "0x0"
                        }, (gas)=>{
                            console.log(gas.result);
                            sendRPC("eth_sendTransaction", 
                            {
                                data: C_MINT+A_ExitHandler.slice(2)+C_ZERO+A_tokenId
                                ,from: A_TRUFFLE //TRUFFLE 계정
                                ,gas: gas.result
                                ,to: A_TOKEN
                                ,value: "0x0"},
                                (body)=>{
                                    
                                    console.log(JSON.stringify(body));
                            });
                        });
                    })
            });
        });
      }
    });

    fs.appendFile('auto-leap.log', '\nTruffle Account :\n  ' + A_TRUFFLE + '\n', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });

    fs.appendFile('auto-leap.log', '\nMetamask Account :\n  ' + A_METAMASK + '\n', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});





/*
"eth_estimateGas"
data: "0x40c10f1900000000000000000000000028467c88a719011617267b1fc47222a1c310b8680000000000000000000000000000000000000000000000000000000000000002"
from: "0x28467c88a719011617267b1fc47222a1c310b868"
gas: "0x22d56"
to: "0x02428e6CfFfab34102E86318FEa4De61330c17b8"
value: "0x0"

data: "0x40c10f1900000000000000000000000028467c88a719011617267b1fc47222a1c310b8680000000000000000000000000000000000000000000000000000000000000003"
from: "0x28467c88a719011617267b1fc47222a1c310b868"
to: "0x02428e6CfFfab34102E86318FEa4De61330c17b8"
value: "0x0"

data: "0x40c10f1900000000000000000000000028467c88a719011617267b1fc47222a1c310b8680000000000000000000000000000000000000000000000000000000000000004"
from: "0x28467c88a719011617267b1fc47222a1c310b868"
to: "0x02428e6CfFfab34102E86318FEa4De61330c17b8"
value: "0x0"


{"id":1059,"jsonrpc":"2.0","result":"0x22d56"}

{"id":1167,"jsonrpc":"2.0","result":"0x22d56"}

"eth_sendTransaction"
data: "0x40c10f1900000000000000000000000028467c88a719011617267b1fc47222a1c310b8680000000000000000000000000000000000000000000000000000000000000004"
from: "0x28467c88a719011617267b1fc47222a1c310b868"
gas: "0x22d56"
to: "0x02428e6CfFfab34102E86318FEa4De61330c17b8"
value: "0x0"

{"id":1169,"jsonrpc":"2.0","result":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"}

id: 1171
jsonrpc: "2.0"
method: "eth_getTransactionReceipt"
params: ["0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"]

{"id":1171,"jsonrpc":"2.0","result":{"transactionHash":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42","transactionIndex":"0x00","blockHash":"0xd5d854c4889556a3358166b871be4d4b5d162a94162ea915ee300b01688935b9","blockNumber":"0x1a","gasUsed":"0x022d56","cumulativeGasUsed":"0x022d56","contractAddress":null,"logs":[{"logIndex":"0x00","transactionIndex":"0x00","transactionHash":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42","blockHash":"0xd5d854c4889556a3358166b871be4d4b5d162a94162ea915ee300b01688935b9","blockNumber":"0x1a","address":"0x02428e6cfffab34102e86318fea4de61330c17b8","data":"0x0","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000000000000000000000000000000000000000000000","0x00000000000000000000000028467c88a719011617267b1fc47222a1c310b868","0x0000000000000000000000000000000000000000000000000000000000000004"],"type":"mined"}],"status":1}}


method: "eth_getTransactionByHash"
params: ["0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"]
0: "0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42"

{"id":1172,"jsonrpc":"2.0","result":{"hash":"0x6972cbbfbdbd75f0f126e1097213c392c859e1b68ac2a3daa57080807932ff42","nonce":"0x11","blockHash":"0xd5d854c4889556a3358166b871be4d4b5d162a94162ea915ee300b01688935b9","blockNumber":"0x1a","transactionIndex":"0x00","from":"0x28467c88a719011617267b1fc47222a1c310b868","to":"0x02428e6cfffab34102e86318fea4de61330c17b8","value":"0x0","gas":"0x022d56","gasPrice":"0x01","input":"0x40c10f1900000000000000000000000028467c88a719011617267b1fc47222a1c310b8680000000000000000000000000000000000000000000000000000000000000004"}}

*/


/*
data: "0x40c10f190000000000000000000000009c73363b89c0eda0dba1b4a5250e891f607233780000000000000000000000000000000000000000000000000000000000000001"
from: "0x0e9229c1359a71d91a74ef5035c0e0993a088f3c"
to: "0xEc3c05f51a934Bb620E42aC328B8beA6d2c06bd0"
value: "0x0"

*/