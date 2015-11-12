var express = require('express');
var router = express.Router();
var settings = require('../settings');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var user = require('../model/user');
var Item = require('../model/item');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/' + file.fieldname)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
var upload = multer({storage: storage});
var util = require('util');



/* GET users listing. */

function checkFields(model) {
	for(var key in model){
		if(model[key] == ''){
			console.log('field missing');
 			return false;
                }
	}
	return true;	
};


router.get('/',function(req, res) {
	
	// Item.get(null, function(err, items){
		// //console.log('inside item.get callback: ' + Date());
		// if(err) {
			// console.log('Error at myTailer/->item.get: '+err);
			// item = [];
		// }		
		
		// //var Items = [];
		// //if(item) Items = items
		// res.render('plaza', { data: items });
		
	// });	
	user.get(null, function(err, stores){
		//console.log('inside item.get callback: ' + Date());
		if(err) {
			console.log('Error at myTailer/->item.get: '+err);
		}		
		
		//var Items = [];
		//if(item) Items = items
		//console.dir(stores);
		res.render('plaza', { data: stores });
		
	});	
});

router.post('/login', function(req,res,next){
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/login');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');
	
	user.get(req.body.email, function(err, user){
		if(user){			
			if(password == user[0].password){
			   req.session.user = user;
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
			req.session.email = req.body.email;
			res.redirect('/signup');
			// res.end();
		}		
	});	
});

router.get('/login', function(req, res, next){ 		
	res.render('Login');
});

router.get('/signup', function(req, res){
	// var username = 'Hey New Guy!';
	// if(req.session.user) username = user.name;
	res.render('register');
});

router.post('/signup', function(req, res){
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/signup');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');

	console.log('in myTailer.js: ');
	
	if(req.body.pw !== req.body.pwrepeat){
		console.log('not the same pw');
		
		req.flash('error', 'Repeat Password is not the same as the other one');
		//req.session.email = req.body.email;
		res.redirect('/signup');
	}
	else{
		console.log('will add new user');
		var newUser = new user({
			email: req.body.email,
			password: password,
                        id: req.body.id
		});
		req.session.user = newUser;
		newUser.save();
		
		req.flash('success', 'You are good to go!');
		req.session.email = null;
		res.redirect('/');
	}
	
});

router.get('/logout', function(req, res){
	if(req.session){
		req.session.user = null;
		
		// req.session= null;
	}
	res.redirect('/login');
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
	console.log(util.inspect(req.file));
	if(req.file){ 
		var item = {
			title: req.body.title,
			img: '/uploads/' + req.file.fieldname + '/' + req.file.filename,
			description: req.body.description,
			ownerName: req.session.user.id,
			ownerEmail: req.session.user.email,
			uploadTime: Date.now()
			};
		var newItem = new Item(item);
		newItem.create(null);
		console.log('in myTailer.js after create function');
		var User = new user(req.session.user);
		User.pushItem(newItem);
		req.flash('success', 'Post done!');
		res.redirect('/');
		//res.render('upload', {img: item.img});
	}	
	else{
		req.flash('error', 'Post failed!');
		res.redirect('/upload');
	}
});

router.get('/store', function(req, res){
	if(!req.session.user) {res.redirect('/login'); return;}
	user.get(req.session.user.email, function(err, userprofile){
		res.render('plaza', {data: userprofile.items, private:true});
	})
});

router.get('/delete/:uploadTime',function(req, res){
	var uploadTime = req.params.uploadTime;
	if(!req.session.user) {res.redirect('/login'); return}
	//r items = vareq.sessions.user.items;
	
	Item.deleteItem(uploadTime, null);
	user.deleteItem({email: req.session.user.email, uploadTime: uploadTime}, null);
	req.flash('success', 'Delete successfully');
	res.redirect('/store');
});

module.exports = router;
