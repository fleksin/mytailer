var express = require('express');
var router = express.Router();
var wechat = require('wechat-enterprise');
var config={
	token: 'LALALA',
	encodingAESKey:'niRwBrABzeNlfgMnoaU5ALvqWM7zm9etXfr6EJ7y3OI',
	corpId:'wxee7600b11c54b6c4'	
};
var toolkit = require('../myModules/toolkit');

router.use('/',wechat(config,function(req, res, next) {
	if(req.weixin) console.dir(req.weixin);
	res.reply('under construction');
}));

//router.get('/test',function(req, res){
//	toolkit.corpMsg(function(result){res.send(result)});
//	//toolkit.getToken(function(result){res.send(result)});
//});

module.exports = router;
