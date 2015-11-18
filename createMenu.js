var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var api = new wechatAPI(appid, appsecret);	
	
var menu = 
	{
 	"button":[
   	   {
	     "type":"view",
	     "name":"Go to Demo",
	     "url":"http://thirdtry.cloudapp.net/"
	   },
	   {
	     "name":"opt",
	     "sub_button":[
	       {
	         "type":"click",
	         "name":"scarlet",
	         "key":"V1001_GOOD"
	       },
	       {
	         "type":"click",
	         "name":"GG",
	         "key":"V1001_GOOD"
	       }]
	   }]
	};

api.createMenu(menu, function(err, res){if(err) console.log(err); console.log(res)});
