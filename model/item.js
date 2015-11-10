var mongoskin = require('mongoskin');
var settings = require('../settings');

var Item = function(item){
	this.title = item.title;
	this.img = item.img;
	this.description = item.description;
	this.ownerName = item.ownerName;
	this.ownerEmail = item.ownerEmail;
	this.uploadTime = item.uploadTime;
}

Item.prototype.create = function create(){
	
	console.log('first line in create function');
	var Item = {
		title: this.title,
		img: this.img,
		description: this.description,
		ownerName: this.ownerName,
		ownerEmail: this.ownerEmail,
		uploadTime: this.uploadTime
	};
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('items').insert(Item, function(err, items){
		db.close();
		if(err) console.log(err)
	});
	console.log('last line in create function');
}

Item.get = function(storeName, callback){
	var query = {};
	if(storeName){
		query.name = storeName;
	}
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('items').find(query).sort({'uploadTime': -1}).toArray(function(err, items){
		if(err) console.log(err);
		db.close();
		callback(null, items);		
	})
}

Item.deleteItem = function(uploadTime, callback){
	console.log('inside item.delete');
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('items').remove({'uploadTime': parseFloat(uploadTime)}, function(err, items){
		//console.log('item.delete callback is real..I guess');
		if(err) console.log(err);
		db.close();
		//console.log('the item:');
		//console.dir(items);
		//callback();
	});
}

module.exports = Item;
