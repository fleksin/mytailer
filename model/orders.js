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
	db.collection('orders').find({seller: wechat, status:{$gt:0}}).sort({_id:-1}).toArray(function(err, orders){
		db.close();
		callback(err, orders);		
	});
}

Orders.getByID = function(ID, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').find({orderID: ID}).toArray(function(err, orders){
		db.close();
		callback(err, orders[0]);		
	});
}

Orders.getByBuyer = function(email, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').find({buyer: email}).toArray(function(err, orders){
		db.close();
		callback(err, orders);		
	});
}

Orders.create = function(order, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').insert(order, function(err, result){
		db.close();
		callback(err, result);		
	});
}

Orders.update = function(query, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').update({orderID:query.orderID}, {$set:{status:Number(query.status)}}, 
		function(err, result){
			db.close();
			callback(err, result);		
	});
}

//Orders.createList = function(query, callback){
//	var db = mongoskin.db(url, {native_parser: true});
//	db.collection('orders').update({orderID:query.orderID}, {$set:{list:query.list}}, 
//		function(err, result){
//			db.close();
//			callback(err, result);		
//	});
//}

Orders.updateList = function(query, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').update({orderID:query.orderID}, {$set:{list:query.list}}, 
		function(err, result){
			db.close();
			callback(err, result);		
	});
}

Orders.addTrackingNum = function(query, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').update({orderID:query.orderID}, {$set:{trackingNum: query.trackingNum}}, 
		function(err, result){
			db.close();
			callback(err, result);		
	});
}

module.exports = Orders;


