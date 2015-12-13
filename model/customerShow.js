var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;

var CustomerShow = function(customerShow){
	this.title = customerShow.title;
	this.img = customerShow.img;
	this.description = customerShow.description;
	this.ownerName = customerShow.ownerName;
	this.uploadTime = customerShow.uploadTime;
}

CustomerShow.prototype.create = function create(){
	
	var customerShow = {
		title: this.title,
		img: this.img,
		description: this.description,
		ownerName: this.ownerName,
		uploadTime: this.uploadTime
	};
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('customerShows').insert(customerShow, function(err, customerShows){
		db.close();
		if(err) console.log(err)
	});
	console.log('last line in create function');
}

CustomerShow.get = function(showTitle, callback){
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('customerShows').find({title:showTitle}).sort({'uploadTime': -1}).toArray(function(err, customerShows){
		if(err) console.log(err);
		db.close();
		if(!customerShows) {
			callback(err,null);
			return;
		}
		if(customerShows.length > 0){
			callback(err, customerShows[0]);
		}
		else{
			callback(err, null);
		}		
	})
}

CustomerShow.deleteItem = function(uploadTime, callback){
	var db = mongoskin.db(settings.dbhost,{native_parser: true});
	db.collection('customerShows').remove({'uploadTime': parseFloat(uploadTime)}, function(err, customerShows){
		//console.log('item.delete callback is real..I guess');
		if(err) console.log(err);
		db.close();
		//console.log('the item:');
		//console.dir(items);
		//callback();
	});
}

module.exports = CustomerShow;
