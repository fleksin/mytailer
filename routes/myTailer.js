var express = require('express');
var router = express.Router();
var settings = require('../settings');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var user = require('../model/user');
var Item = require('../model/item');
var Tailer = require('../model/tailer');
var Orders = require('../model/orders');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/' + req.session.user.id)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})
var upload = multer({storage: storage});
var fs = require('fs');
var util = require('util');
var toolkit = require('../myModules/toolkit');
var gm = require('gm');
var wechatAPI = require('wechat-api');
var appid = 'wxaaa2eb5129f710a5';
var appsecret = 'd15fb1721506a73cd77ca23e1060170a';
var paypal = require('paypal-rest-sdk');
paypal.configure({
	'mode': 'sandbox',
	'client_id': 'AeSxKOP_HokaYoGNm3PyxJ9oY6RcHEPq0pVbhSEtJk43t_sAF9WfgCoFPWGsuZMEF4OGgd2BgLnzwgBu',
	'client_secret': 'EIuD8v62A381GjGmDe4qitKqf3uXnFDn4QWk1IwY_cdhnrtxAmlIsn81uPjPU9JKxoa92QNymBgZ8CUW'
});

function checkFields(model) {
	for(var key in model){
		if(model[key] == ''){
			console.log('field missing');
 			return false;
	    }
	}
	return true;	
};

/* GET all store listing. */
router.get('/',function(req, res) {		
	Tailer.get(null, function(err, stores){
		if(err) {
			console.log('Error at myTailer/->item.get: '+err);
		}	
		res.render('plaza', { data: stores });		
	});	
});

router.post('/loginM', function(req,res,next){
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/loginM');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');
	
	Tailer.get(req.body.wechat, function(err, user){
		if(user.length>0){			
			if(password == user[0].password){
			   req.session.user = user[0];
			   req.flash('success', 'Log in successfully');
		  	   res.redirect('/privateStore');
				
			}
			else{				
			   req.flash('error', 'Invalid Password');
			   res.redirect('/loginM');			
			}
			
		}
		else{				
			req.flash('error', "Email doesn't exist, Sign Up?");
			res.redirect('/signupM');
		}		
	});	
});

router.get('/loginM', function(req, res, next){ 
	if(req.session.user) res.redirect('/privateStore');		
	else res.render('LoginM');
});

router.get('/signupM', function(req, res){
	// var username = 'Hey New Guy!';
	// if(req.session.user) username = user.name;
	res.render('registerM');
});

router.post('/signupM', function(req, res){
	if(!checkFields(req.body)){
		res.json({success:false, error: '请填入所有信息！'});
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	if(req.body.password !== req.body.pwrepeat){
		console.log('not the same pw');
		res.json({success:false, error: '密码不匹配'});
	}
	else{
		//console.log('will add new user');
		var tailer = {};
		for(var field in req.body){
			if(field != 'pwrepeat')
				tailer[field]= req.body[field];
			if(field == 'password')
				tailer[field] = password;
		}
		
		var newTailer = new Tailer(tailer);
		newTailer.save(function(duplicated){	
			if(duplicated)
				res.json({success:false, error: '用户名重复'});
			else{	
				req.session.user = newTailer;
				req.flash('success', 'You are good to go!');
				res.json({success:true});
			}
		});
		// req.flash('success', 'You are good to go!');
		// req.session.email = null;
		// res.redirect('/');
		//res.end();
	}
	
});

router.get('/logout', function(req, res){
	if(req.session){
		req.session.user = null;
	}
	res.redirect('/loginM');
});

router.get('/upload', function(req, res){
	if(!req.session.user) res.redirect('/login');
	res.render('upload');
});

router.post('/upload', upload.single('itemImage'),function(req, res, next){
	if(!checkFields(req.body)){
		req.flash('error', '请填写所有信息！');
		res.redirect('/upload');
		return;
	}
	if(!req.session.user) {res.redirect('/login'); return;};
	var fabricPlus = JSON.parse(req.body.fabricPlus);
	var price = (parseFloat(req.body.price) * 1.2).toFixed(2);
	if(req.file){ 
		var item = {
			title: req.body.title,
			//img: '/uploads/' + req.session.user.id + '/' + req.file.filename,
			img: '/uploads/'+req.session.user.id +'/'+ req.file.filename,
			description: req.body.description,
			// ownerName: req.session.user.id,
			// ownerEmail: req.session.user.email,
			uploadTime: Date.now(),
			price: price,
			fabricPlus:fabricPlus,
			catag: req.body.catag,
			fabric: req.body.fabric,
			style: JSON.parse(req.body.style)
			};
			
		// var canvasImg = req.body.canvasImg;
		// //console.log('the length of dataURL: ' + canvasImg.length);
		// var data = canvasImg.replace(/^data:image\/\w+;base64,/, "");
		// var buf = new Buffer(data, 'base64');
		var preview = '/resize_'+Date.now() + '.png';
		console.log(req.file.destination);
		// fs.writeFile(req.file.destination + preview, buf);	
		gm('public/uploads/'+ req.session.user.id +'/'+ req.file.filename).resize(480)
		  .write('public/uploads/'+ req.session.user.id +'/' + preview, function(err){
			if(err) console.log(err);
			else console.log('resize done!');
		})

		item.preview = '/uploads/'+ req.session.user.id + preview;
		Tailer.pushItem(req.session.user.wechat,item, function(){
			req.flash('success', 'Post done!');
			res.redirect('/privateStore');
		});
		
	}	
	else{
		req.flash('error', 'Post failed!');
		res.redirect('/upload');
	}
});

router.get('/privateStore', function(req, res){
	if(!req.session.user) {res.redirect('/loginM'); return;}
	Tailer.get(req.session.user.wechat, function(err, userprofile){
		req.session.user = userprofile[0];
		res.render('privateStore', {private:true});
	})
});

router.get('/store/:tailer', function(req, res){
	var wechat = req.params.tailer;
	Tailer.get(wechat, function(err, user){
		res.render('store', {private:false, items: user[0].store.items, wechat: user[0].wechat});
	});
	
});

router.get('/delete/:uploadTime',function(req, res){
	var uploadTime = req.params.uploadTime;
	if(!req.session.user) {res.redirect('/login'); return}
	//r items = vareq.sessions.user.items;
	Tailer.getItem({name:req.session.user.wechat, uploadTime: uploadTime},
		function(err, item){
			if(err) console.log(err);
			fs.unlinkSync('public'+ item.img);
			fs.unlinkSync('public'+ item.preview);
		}
	);

	Tailer.deleteItem({wechat: req.session.user.wechat, uploadTime: uploadTime}, function(){
		//fs.unlinkSync('/tmp/hello');
		req.flash('success', 'Delete successfully');
		res.redirect('/privateStore');
	});
	
});

router.get('/reset',function(req,res){
	res.render('reset');
})

router.post('/reset',function(req,res){
    var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');
	var userModel = {
		email: req.body.email,
		password: password
	}
	user.reset(userModel,function(){
		req.flash('success', 'reset done');
		res.redirect('/');
	});
})

router.get('/cata/:catag',function(req, res) {		
	var catag = req.params.catag;
	Tailer.getCatag(catag, function(err, stores){
		if(err) {
			console.log('Error at myTailer/->item.get: '+err);
		}	
		var hint ='欢迎来到';
		switch(catag){
			case 'sweater': hint += '羊毛衫区' ;break;
			case 'suit': hint += '西装区'; break;
			case 'cheongsam': hint += '旗袍区'; break;
		}
		req.flash('success', hint);
		res.render('plaza', { data: stores });		
	});	
});

router.get('/checkName/:name', function(req, res){
	var wechat = req.params.name;
	toolkit.checkDuplicate('wechat', wechat, 'tailers', function(duplicated){	
		if(duplicated) res.send('its duplicated');
		else res.send('its available');
	});	
});

router.post('/updateStore', function(req,res){
	var profile = req.body;		
	profile.wechat = req.session.user.wechat;
	//console.log(profile);	
	Tailer.updateStore(profile, function(success){
		Tailer.get(profile.wechat, function(err, users){
			req.session.user = users[0];
			if(success) res.send('done!');
			else res.send('error!');
		});		
	});
});

router.get('/myorders',function(req,res){
	if(!req.session.user){
		req.session.dest = '/myorders';
		res.redirect('/loginM');
		return;
	}
	var wechat = req.session.user.wechat;
	//console.log(wechat);
	Orders.getByWechat(wechat, function(err,orders){
		//console.dir(orders);
		res.render('myOrders', {orders: orders});
	});
})

router.get('/testTem', function(req, res){
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
	var api = new wechatAPI(appid, appsecret);
	api.sendTemplate('fleksin', templateId, url, data,   
		function(err, result){
			if(err) res.send(err);
			else res.send(result);
		}
	);	
});

router.get('/items/:name/:uploadTime', function(req, res){	
	var name = req.params.name;
	var uploadTime = req.params.uploadTime;
	console.log('/items:')
    console.log(name);	
	var query={
		name: name,
		uploadTime: uploadTime
	}
	Tailer.getItem(query, function(err, item){
		res.render('item', {item: item});
	});	
})

router.post('/placeOrder', function(req, res){
	var name = req.params.name;
	var uploadTime = req.params.uploadTime;
	if(!req.session.customer){
		req.session.dest = null;
		req.session.dest = '/placeOrder';
		res.redirect('/mycustomer/login');
		return;
	}
	var order = {};
	for(var key in req.body){
		order[key] = req.body[key];
	}
	console.log(order);
	res.end();
});

router.get('/testPay', function(req, res){
	var create_payment_json = {
    "intent": "authorize",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://return.url",
        "cancel_url": "http://cancel.url"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "item",
                "sku": "item",
                "price": "1.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "1.00"
        },
        "description": "This is the payment description."
    }]
};

var paymentId;


paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
            if (payment.links[index].rel === 'approval_url') {
                console.log(payment.links[index].href);
            }
        }
        console.log(payment);
		paymentId = payment.id;
		res.redirect(payment[1].href);
    }
});

// var execute_payment_json = {
    // "payer_id": "Appended to redirect url",
    // "transactions": [{
        // "amount": {
            // "currency": "USD",
            // "total": "1.00"
        // }
    // }]
// };


// paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    // if (error) {
        // console.log(error.response);
        // throw error;
    // } else {
        // console.log("Get Payment Response");
        // console.log(JSON.stringify(payment));
    // }
// });
});

router.get('/returnUrl', function(req, res){
	res.send(req.query.paymentId);
});

module.exports = router;
