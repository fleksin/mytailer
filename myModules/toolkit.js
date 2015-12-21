var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;
var wechatCorp = require('wechat-enterprise');
var corpConfig={
	token: 'LALALA',
	encodingAESKey:'niRwBrABzeNlfgMnoaU5ALvqWM7zm9etXfr6EJ7y3OI',
	corpId: settings.corpid	
};
var wechatAPI = require('wechat-api');
var appid = settings.appid;
var appsecret = settings.appsecret;
var api = new wechatAPI(appid, appsecret);
var wechat = require('wechat');
var fuwuConfig = {
  token: 'LALALA',
  appid: settings.appid,
  encodingAESKey: 'drZMgDCwGPkdxz8d3yqlnW4YZUm3d3ZilwnELxryA6R'
};
var https = require('https');

function getAccessToken(callback){
	var url = 
	'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid='
	+ settings.corpid +'&corpsecret='
	+ settings.corpsecret;
	https.get(url, function(result){
		result.setEncoding('utf8');
		result.on('data', function(chunk){
		  var accessToken = (JSON.parse(chunk)).access_token;
	      console.log('data: ' + accessToken);
		  callback(accessToken);
		});
	}).on('error', function(e){
		console.log("Got error in GAT: " + e.message);
		callback('errorAT');
	});
}

exports.getToken = getAccessToken;

exports.checkDuplicate = function(field, value, collection, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	query[field]= value;
	db.collection(collection).find(query).toArray(function(err, res){
		db.close();
		var duplicated = '';
		if(res.length >0) duplicated = true;
		else duplicated = false;
		callback(duplicated);
	});
}

exports.corpMsg = function(callback){	
  getAccessToken(function(accessToken){
	if(accessToken == 'errorAT') {callback('errorAT'); return}
	var post_data={
		"touser": "HZF",
   		//"toparty": " PartyID1 | PartyID2 ",
		//"totag": " TagID1 | TagID2 ",
		"msgtype": "text",
		"agentid": 1,
		"text": {
			"content": "Holiday Request For Pony(http://xxxxx)"
		},
		"safe":"0"
	};
	var options = {
		hostname: 'qyapi.weixin.qq.com',//send?access_token=' + accessToken,
		port: 80,
		path: '/cgi-bin/message/send?access_token=' + accessToken,
		method: 'POST',
		headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
		}
	};
	https.request(options, function(result){
		result.setEncoding('utf8');
		result.on(data, function(chunk){
			callback(chunk);
		});
	}).on('error', function(e){
		console.log("Got error in MSG: " + e.message);
		callback('error when sending message');
	});
  });
	//callback('done');
}


function tailerTem_newOrder(){
	var data = {
	"first": {
		"value":"有一位买家下单啦",
		"color":"#173177"
	},
	"OrderSn":{
		"value":"请进入企业号登入个人主页查看",
	 	"color":"#173177"
 	},
 	"OrderStatus": {
	  	"value":"买家下单啦",
	  	"color":"#173177"
 	},
 	"remark":{
	   	"value":"",
	  	"color":"#173177"
	}
 	};
	return data;
};

exports.tailerTem_newOrder = tailerTem_newOrder;

function customerTem_newOrder(){
	var data = {
	"first": {
		"value":"亲爱的用户你已经下单了",
		"color":"#173177"
	},
	"OrderSn":{
		"value":"请通过买家入口登录来查看",
	 	"color":"#173177"
 	},
 	"OrderStatus": {
	  	"value":"订单已生成",
	  	"color":"#173177"
 	},
 	"remark":{
	   	"value":"",
	  	"color":"#173177"
	}
 	};
	return data;
};

exports.customerTem_newOrder = customerTem_newOrder;

exports.sendCusTem = function(openid){
		var templateId = settings.orderTem;
		//var url = 'http://thirdtry.cloudapp.net:3100/myorders';
		var url = '';
		var data_cus = customerTem_newOrder();
		//verify here
		if(openid){
		  api.sendTemplate(openid, templateId, url, 
			data_cus,   
			function(err, result){
				if(err) console.log(err);
				//else res.send(result);
		  });
		}
};

exports.sendTaiTem = function(openid){
		var templateId = settings.orderTem;
		var url = 'http://thirdtry.cloudapp.net:3100/myorders';
		var data_tai = tailerTem_newOrder();
		//verify here
		if(openid){
		  api.sendTemplate(openid, templateId, url, 
			data_tai,   
			function(err, result){
				if(err) console.log(err);
				//else res.send(result);
		  });
		}
};

exports.OrderStatus = ['买家未付款','买家已付款','卖家正在制作','卖家已发货','买家确认收货','买家已评价']
exports.sellerOpt = ['','开始制作','发货','','','']
exports.catag_enToch = {'suit': '西装', 'sweater':'羊毛衫', 'cheongsam':'旗袍', 'fashion':'时装', 'coat':'大衣'}

