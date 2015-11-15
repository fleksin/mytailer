var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;

exports.checkDuplicate = function(field, value, collection, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	query[field]= value;
	db.collection(collection).find(query).toArray(function(err, res){
		db.close();
		var duplicated = '';
		if(res.length >0) duplicated = true;
		else duplicated = false;
		callback(duplicated);
	});
}