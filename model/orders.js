var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;
var toolkit = require('../myModules/toolkit');

var Orders = function(order){
	this.model = order;
};

Orders.getAll = function(callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('orders').find(query).toArray(function(err, users){
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

module.exports = Orders;


