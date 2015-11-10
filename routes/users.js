var express = require('express');
var router = express.Router();
var wechat = require('node-wechat')('LALALA');

/* GET users listing. */
router.use('/', function(req, res, next) {
 	wechat.checkSignature(req,res);
	wechat.handler(req,res);
//		res.send('work!!');
	wechat.text(function(data){
		var msg = {
      		FromUserName : data.ToUserName,
     		ToUserName : data.FromUserName,
	      //MsgType : "text",
		Content : "nihao a sb",
	      //FuncFlag : 0
    		}
		wechat.send(msg);
	});		
});

module.exports = router;
