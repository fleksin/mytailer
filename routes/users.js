var express = require('express');
var router = express.Router();
var wechat = require('node-wechat')('LALALA');
var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var http = require('http');
var api = new wechatAPI(appid, appsecret);

/* GET users listing. */


router.get('/test', function(req, res){
	console.log('found it!');
	var templateId = '9lZRf9WlDz9mgcChIna8fZDBfbSBZPKVlRAy0jY0Meo';
	var url = 'http://thirdtry.cloudapp.net/myorders';
	var data = {
	   "first": {
	     "value":"Dear tailer, you have a new order placed",
	     "color":"#173177"
	   },
	   "OrderSn":{
	     "value":"111111",
	     "color":"#173177"
	   },
	   "OrderStatus": {
	     "value":"The buyer has placed an order",
	     "color":"#173177"
	   },
	   "remark":{
	     "value":"let's try",
	     "color":"#173177"
	   }
	};
	//var api = new wechatAPI(appid, appsecret);
	api.sendTemplate('OPENID', templateId, url, data,   
		function(err, result){
			if(err) res.send(err);
			else res.send(result);
		}
	);	
});

module.exports = router;
