var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;



var Tailer = function(tailer){
	this.password = tailer.password;
	this.id = tailer.id;
	this.wechat = tailer.wechat;
	this.model = tailer;
};

Tailer.prototype.save = function save(callback){	
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('tailers').insert(this.model,function(err,user){
		db.close();
		if(err) console.log(err);
		callback();
	});	

}

Tailer.prototype.pushItem = function push(item){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('tailers').update(
		{wechat: this.wechat}, 
		{$push:{items: item}},
	    function(err, user){
			if(err) console.dir(err);
			db.close();
	   }
	);
	 
}

Tailer.deleteItem = function deleteItem(info, callback){
	var db = mongoskin.db(url, {native_parser: true});
	console.log('inside user.deleteitem'); 
	db.collection('tailers').update(
		{wechat: info.wechat},
		{$pull:{ items: {'uploadTime': parseFloat(info.uploadTime)}}},
		function(err, user){
			if(err) console.dir(err);
			db.close();
			//callback();
		}
	);
}

Tailer.get = function(username, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	if(username){
		query.email = username;
	}
	db.collection('tailers').find(query).toArray(function(err, users){
		console.log('the query is ' + username);
		db.close();
		if(!users) {
			callback(err,null);
			return;
		}
		//console.dir(users);
		callback(err, users);		
	});
}

Tailer.getStores = function(username, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	if(username){
		query.wechat = username;
	}
	db.collection('tailers').find(query).toArray(function(err, users){
		db.close();
		if(!users) {
			callback(err,null);
			return;
		}
		callback(err, users);		
	});
}

Tailer.reset = function(user, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('users').update({email:user.email}, {$set:{password: user.password}}, function(err,result){db.close();callback();});		
}

Tailer.getCatag = function(cata, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={catag:{$elemMatch:{$eq:cata}}};
	db.collection('tailers').find(query).toArray(function(err, stores){
		db.close();
		if(!stores) {
			callback(err,null);
			return;
		}
		//console.dir(tailers);
		callback(err, stores);		
	});
}

module.exports = Tailer;
