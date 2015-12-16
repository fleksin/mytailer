var express = require('express');
var router = express.Router();
//var wechat = require('node-wechat')('LALALA');
var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var api = new wechatAPI(appid, appsecret);
var wechat = require('wechat');
var config = {
  token: 'LALALA',
  appid: 'wxaaa2eb5129f710a5',
  encodingAESKey: 'drZMgDCwGPkdxz8d3yqlnW4YZUm3d3ZilwnELxryA6R'
};
var Customer = require('../model/customer');
var Tailer = require('../model/tailer');
function emailCheck(email){
	if(!email) return false;
	for(var i =0; i < email.length; i++){
		if(email[i] == '@'){
			for(;i<email.length;i++)
				if(email[i] == '.') return true;
			return false;
		}
	}
	return false;
}

router.use('/', wechat(config, function (req, res, next) {
	var message = req.weixin;
	var openid = message.FromUserName;
	var content = message.Content;
	
	api.getUser(openid, function(err, result){	
		var wechatNick = result.nickname;
		var headimgurl = result.headimgurl;
		var query={
			wechatNick:wechatNick, 
			openid: openid,
			verified: false,
			headimgurl: headimgurl
		};
		if(!emailCheck(content)) {
			query.username = content;
			Tailer.addWechat(query,function(err, result){
				if(err) res.reply(err);
				else res.reply('You have submit the request of binding wechat with account: '+ content + ' please log in to finish binding');			
			});
		}
		else{
		  query.email = content;
		  Customer.addWechat(query,function(err, result){
				if(err) res.reply(err);
				else res.reply('You have submit the request of binding wechat with account: '+ content + ' please log in to finish binding');
					
		  });
		}
	});
			
}));



module.exports = router;
