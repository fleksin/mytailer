var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;
var toolkit = require('../myModules/toolkit');

var Orders = function(order){
	this.model = order;
};

Orders.getAll = function(callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').find({}).toArray(function(err, users){
		db.close();
		callback(err, users);		
	});
}

Orders.getByWechat = function(wechat,callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').find({seller: wechat}).toArray(function(err, orders){
		db.close();
		callback(err, orders);		
	});
}

Orders.getByID = function(ID, callback){
	var db = mongoskin.db(url, {native_parser: true});o
	db.collection('orders').find({orderID: ID}).toArray(function(err, orders){
		db.close();
		callback(err, orders);		
	});
}

Orders.create = function(order, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').insert(order).toArray(function(err, orders){
		db.close();
		//callback(err, orders);		
	});
}

Orders.update = function(query, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').update({orderID:query.orderID}, {$set:{status:query.status}}, 
		function(err, result){
			db.close();
			callback(err, result);		
	});
}

module.exports = Orders;


