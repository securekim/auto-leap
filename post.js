
const request = require("request");

let A_ID = 1000;
let A_tokenId = 1;

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
