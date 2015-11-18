var express = require('express');
var router = express.Router();
var wechat = require('node-wechat')('LALALA');
var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var http = require('http');

/* GET users listing. */
router.use('/', function(req, res, next) {
 	wechat.checkSignature(req,res);
	wechat.handler(req,res);
//		res.send('work!!');
	var api = new wechatAPI(appid, appsecret);	
	wechat.text(function(data){
		var msg = {
      		FromUserName : data.ToUserName,
      		ToUserName : data.FromUserName,
      		//MsgType : "text",
      		Content : "click 'Go to Demo' to see the Demo",
      		//FuncFlag : 0
		}		
    //回复信息
   		 wechat.send(msg);
	});
		
});

module.exports = router;
