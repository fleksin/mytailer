var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var api = new wechatAPI(appid, appsecret);	
	
var menu = {
 	"button":[
   	   {
	     "type":"view",
	     "name":"随便逛逛",
	     "url":"http://thirdtry.cloudapp.net:3100/mycustomer/customerEntry"
	   },
	   {
	     "type":"view",
	     "name":"买家入口",
	     "url":"http://thirdtry.cloudapp.net:3100/mycustomer/login"
	   }]
	   
	};

api.createMenu(menu,function(err, result){
	if(err) console.log(err);
	else console.log(result);
});

//var templateId = '9lZRf9WlDz9mgcChIna8fZDBfbSBZPKVlRAy0jY0Meo';
//	var url = 'http://thirdtry.cloudapp.net/myorders';
//	var data = {
//	   "first": {
//	     "value":"Dear tailer, you have a new order placed",
//	     "color":"#173177"
//	   },
//	   "OrderSn":{
//	     "value":"111111",
//	     "color":"#173177"
//	   },
//	   "OrderStatus": {
//	     "value":"The buyer has placed an order",
//	     "color":"#173177"
//	   },
//	   "remark":{
//	     "value":"let's try",
//	     "color":"#173177"
//	   }
//	};
//	//var api = new wechatAPI(appid, appsecret);
//	api.sendTemplate('fleksin', templateId, url, data,   
//		function(err, result){
//			if(err) console.log(err);
//			else console.log(result);
//		}
//	);


