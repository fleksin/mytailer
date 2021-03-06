var express = require('express');
var router = express.Router();
var settings = require('../settings');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var customer = require('../model/customer');
var Orders = require('../model/orders');
var Item = require('../model/item');
var CustomerShow = require('../model/customerShow');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/' + file.fieldname)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
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
    if(req.session.customer == null){
        res.redirect('/myCustomer/login');
	}
	Orders.getByBuyer(req.session.customer.email, function(err, order){
        var data = {
            customer: req.session.customer,
            orders: order
        };		
		req.session.Data = data;
		console.log("this customer");
		console.dir(req.session.Data.customer);
		console.log("this data");
	    console.dir(req.session.Data);
		console.log("this myShows");
	    console.dir(req.session.Data.customer.myShows);
        res.render('customerHome', {Data : data});
	});		
});

router.post('/login', function(req,res,next){
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/myCustomer/login');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');
	
	customer.get(req.body.email, function(err, Customer){
		if(Customer){			
			if(password == Customer.password){
			   req.session.customer = Customer;
				var dest = req.session.dest;
				console.log(dest);
			   if(dest){
					req.session.dest = null;
					res.redirect(String(dest));
				}
		  	   else res.redirect('/myCustomer');				
			}
			else{				
			   req.flash('error', 'Invalid Password');
			   res.redirect('/myCustomer/login');			
			}			
		}
		else{				
			req.flash('error', "Email doesn't exist, Sign Up?");
			req.session.email = req.body.email;
			res.redirect('/myCustomer/signup');
			// res.end();
		}		
	});	
});

router.get('/login', function(req, res, next){ 		
	res.render('Login');
});

router.get('/customerEntry', function(req, res, next){ 		
	res.render('customerEntry');
});

router.get('/chooseType', function(req, res, next){ 		
	res.render('chooseType');
});

router.get('/customerDataInput', function(req, res, next){
	Orders.getByID(req.query.orderID, function(err, order){
		customer.get(req.query.email, function(err, Customer){
			var data = {
				customer: Customer,
				order: order
			};
			console.log(req.query.orderID);
			console.log(req.query.email);
			console.dir(data);
			res.render('customerDataInput', {Data : data});
		});
	});
});

router.get('/showOrderForCustomer', function(req, res, next){
	Orders.getByID(req.query.orderID, function(err, order){
        res.render('showOrderForCustomer', {Order : order});
	});
});

router.get('/delivered', function(req, res, next){
	Orders.getByID(req.query.orderID, function(err, order){
        req.session.curOrderID = order.orderID;
        res.render('delivered');
	});	
});

router.get('/customerHomeEdit', function(req, res, next){ 		
	res.render('customerHomeEdit', {Customer : req.session.customer});
});

router.get('/myShow', function(req, res, next){ 		
	res.render('myShow', {Data : req.session.Data});
});

router.get('/signup', function(req, res){
	res.render('register');
});

router.post('/signup', function(req, res){
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/myCustomer/signup');
		return;
	}
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.pw).digest('base64');

	console.log('in myTailer.js: ');
	
	if(req.body.pw !== req.body.pwrepeat){
		console.log('not the same pw');		
		req.flash('error', 'Repeat Password is not the same as the other one');
		//req.session.email = req.body.email;
		res.redirect('/myCustomer/signup');
	}
	else{
		console.log('will add new customer');
		customer.get(req.body.email, function(err, Customer){
			if(Customer){
			    console.log('haha');
				req.flash('error', '用户名重复');
				res.redirect('/myCustomer/signup');	
			}
			else{
				var newCustomer = new customer({
					email: req.body.email,
					password: password,
					id: req.body.id
				});
				req.session.customer = newCustomer;
				newCustomer.save();
				
				//req.flash('success', 'You are good to go!');
				req.session.email = null;
				res.redirect('/myCustomer');
			}
		});	
	}
	
});

router.post('/customerHomeEdit', function(req, res){
	var add = '';
	if(req.body.apt != ''){
		console.log("1, apt: " + req.body.apt);
		add += req.body.city +" "+ req.body.street +" "+ req.body.apt +", "+ req.body.state +", "+ req.body.country +", 邮编: "+ req.body.zipcode;
	}
	console.log("add: " + add);
	customer.edit({
        email: req.session.customer.email,
		weChat: req.body.weChat,
        address: add	
    });	
	customer.get(req.session.customer.email, function(err, CustomerInDB){
		req.session.customer = CustomerInDB;
		req.session.customer.weChat = CustomerInDB.weChat;
		req.session.customer.address = CustomerInDB.address;
        res.redirect('/myCustomer');	
	});		
});

router.get('/logout', function(req, res){
	if(req.session){
		req.session.customer = null;
	}
	res.redirect('/myCustomer/login');
});

router.post('/delivered', function(req, res){
    var temp = {
		orderID: req.session.curOrderID,
		status: 4
	}
	Orders.update(temp, function(err, order){
		res.redirect('/myCustomer');
	});
});

router.post('/myShow', upload.single('itemImage'),function(req, res, next){
    console.log(req.body.eva1);
	if(!checkFields(req.body)){
		req.flash('error', 'Please fill out the fields!');
		res.redirect('/myCustomer');
		return;
	}
	console.log(util.inspect(req.file));
	if(req.file){ 
		var show = {
			title: req.body.showImgTitle,
			img: '/uploads/itemImage/' + req.file.filename,
			description: req.body.showDescription,
			ownerName: req.session.customer.id,
			uploadTime: Date.now()
        };		
		var newShow = new CustomerShow(show);
		newShow.create(null);
		var newCustomer = new customer(req.session.customer);
		newCustomer.addShow(newShow);
		req.session.customer.myShows = newCustomer.myShows;
		res.redirect('/myCustomer');
		//res.render('upload', {img: item.img});
	}	
	else{
		req.flash('error', 'Post failed!');
		res.redirect('/myCustomer/myShow');
	}
});

router.post('/pushAddress', function(req, res){
	var query = {
		email: req.session.customer.email,
		address: req.body.address
	};
	customer.pushAddress(query, function(err, result){
		customer.get(req.session.customer.email,function(err, customer){
			req.session.customer = customer;
			res.send(result);
		});		
	});
});

router.get('/test', function(req,res){
	res.render('EntryNew');
})

module.exports = router;
