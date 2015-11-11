var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;



var User = function(user){
	this.email = user.email;
	this.password = user.password;
	this.id = user.id;
};

User.prototype.save = function save(){
	var user = {
		email: this.email,
		password: this.password,
		id: this.id
	};
	
	console.log('in user.js:');
	//console.dir(user);
	
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('users').insert(user,function(err,user){
		db.close();
		if(err) console.log(err);
	});	

}

User.prototype.pushItem = function push(item){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('users').update(
		{email: this.email}, 
		{$push:{items: item}},
           function(err, user){
		if(err) console.dir(err);
		db.close();
	   }
	);
	 
}

User.deleteItem = function deleteItem(info, callback){
	var db = mongoskin.db(url, {native_parser: true});
	console.log('inside user.deleteitem'); 
	db.collection('users').update(
		{email: info.email},
		{$pull:{ items: {'uploadTime': parseFloat(info.uploadTime)}}},
		function(err, user){
			if(err) console.dir(err);
			db.close();
			//callback();
		}
	);
}

User.get = function(username, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	if(username){
		query.email = username;
	}
	db.collection('users').find(query).toArray(function(err, users){
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

User.getStores = function(username, callback){
	var db = mongoskin.db(url, {native_parser: true});
	var query ={};
	if(username){
		query.email = username;
	}
	db.collection('users').find(query).toArray(function(err, users){
		console.log('the query is ' + username);
		db.close();
		if(!users) {
			callback(err,null);
			return;
		}
		console.dir(users);
		callback(err, users);		
	});
}


module.exports = User;
