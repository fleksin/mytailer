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
		res.redirect('/login');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');
	
	Tailer.get(req.body.wechat, function(err, user){
		if(user){			
			if(password == user[0].password){
			   req.session.user = user[0];
			   req.flash('success', 'Log in successfully');
		  	   res.redirect('/');
				
			}
			else{				
			   req.flash('error', 'Invalid Password');
			   res.redirect('/login');			
			}
			
		}
		else{				
			req.flash('error', "Email doesn't exist, Sign Up?");
			res.redirect('/signupM');
		}		
	});	
});

router.get('/loginM', function(req, res, next){ 		
	res.render('LoginM');
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
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/profile');
		return;
	}
	if(!req.session.user) {res.redirect('/login'); return;};
	//console.log(util.inspect(req.body));
	if(req.file){ 
		var item = {
			title: req.body.title,
			//img: '/uploads/' + req.session.user.id + '/' + req.file.filename,
			img: '/uploads/'+req.session.user.id +'/'+ req.file.filename,
			description: req.body.description,
			// ownerName: req.session.user.id,
			// ownerEmail: req.session.user.email,
			uploadTime: Date.now(),
			price: req.body.price
			};
			
		var canvasImg = req.body.canvasImg;
		//console.log('the length of dataURL: ' + canvasImg.length);
		var data = canvasImg.replace(/^data:image\/\w+;base64,/, "");
		var buf = new Buffer(data, 'base64');
		var preview = '/resize_'+Date.now() + '.png';
		//console.log(req.file.destination);
		fs.writeFile(req.file.destination + preview, buf);		
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
	if(!req.session.user) {res.redirect('/login'); return;}
	Tailer.get(req.session.user.wechat, function(err, userprofile){
		req.session.user = userprofile[0];
		res.render('store', {private:true});
	})
});

router.get('/store/:tailer', function(req, res){
	var wechat = req.params.tailer;
	Tailer.get(wechat, function(err, user){
		res.render('store', {private:false});
	});
});

router.get('/delete/:uploadTime',function(req, res){
	var uploadTime = req.params.uploadTime;
	if(!req.session.user) {res.redirect('/login'); return}
	//r items = vareq.sessions.user.items;
	
	user.deleteItem({email: req.session.user.email, uploadTime: uploadTime}, null);
	req.flash('success', 'Delete successfully');
	res.redirect('/privateStore');
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
	user.getCatag(catag, function(err, stores){
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
	var wechat = req.session.user.wechat;
	//console.log(wechat);
	Orders.getByWechat(wechat, function(err,orders){
		//console.dir(orders);
		res.render('myOrders', {orders: orders});
	});
})

module.exports = router;
