var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;
var toolkit = require('../myModules/toolkit');

var Tailer = function(tailer){
	for(var field in tailer){
		this[field]=tailer[field];
	}
	this.model = tailer;
};

Tailer.prototype.save = function save(callback){	  
	var doc = this.model;
	doc.store = {};
	doc.store.name='暂无';
	doc.store.description = '暂无';	
	toolkit.checkDuplicate('wechat', this.model.wechat, 'tailers', function(duplicated){
		if(duplicated) {
			callback(duplicated);
		}
		else{
			var db = mongoskin.db(url, {native_parser: true});
			db.collection('tailers').insert(doc,function(err,user){
				db.close();
				if(err) console.log(err);
				callback(duplicated);
			});	
		}
	})
	

}

Tailer.pushItem = function push(wechat, item, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('tailers').update(
		{wechat: wechat}, 
		{$push:{'store.items': item}},
	    function(err, user){
			if(err) console.dir(err);
			db.close();
            callback();
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
		query.wechat = username;
	}
	db.collection('tailers').find(query).toArray(function(err, users){
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
	db.collection('users').update({wechat:user.wechat}, {$set:{password: user.password}}, function(err,result){db.close();callback();});		
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

Tailer.updateStore = function(profile, callback){
	var db = mongoskin.db(url, {native_parser: true});	
	db.collection('tailers').update(
		{wechat: profile.wechat},
		{$set:{'store.name':profile.name, 'store.description': profile.description}},
		function(err,result){
			db.close();
			if(err) callback(false);
			else callback(true);
		}
	);
}

module.exports = Tailer;
