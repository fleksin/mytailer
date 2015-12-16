var mongoskin = require('mongoskin');
var settings = require('../settings');
var url = settings.dbhost;



var Customer = function(customer){
	this.email = customer.email;
	this.password = customer.password;
	this.id = customer.id;
};

Customer.prototype.save = function save(){
	var customer = {
		email: this.email,
		password: this.password,
		id: this.id
	};
	
	console.log('in customer.js:');
	
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('customers').insert(customer,function(err,customer){
		db.close();
		if(err) console.log(err);
	});	

}

Customer.edit = function(data){
    var db = mongoskin.db(url, {native_parser: true});
    db.collection('customers').update(
	    {email: data.email},
        {
            $set:{
                weChat: data.weChat,
                apt: data.apt,
                street: data.street,
                city: data.city,
                state: data.state,
                country: data.country
            }
        }
    );
}

Customer.prototype.pushItem = function push(item){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('customers').update(
		{email: this.email}, 
		{$push:{items: item}},
           function(err, customer){
		if(err) console.dir(err);
		db.close();
	   }
	);
	 
}

Customer.prototype.addShow = function push(show){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('customers').update(
		{email: this.email}, 
		{$push:{myShows: show}},
        function(err, customer){
		    if(err) console.dir(err);
		    db.close();
	    }
	);
	 
}

Customer.deleteItem = function deleteItem(info, callback){
	var db = mongoskin.db(url, {native_parser: true});
	console.log('inside customer.deleteitem'); 
	db.collection('customers').update(
		{email: info.email},
		{$pull:{ items: {'uploadTime': parseFloat(info.uploadTime)}}},
		function(err, customer){
			if(err) console.dir(err);
			db.close();
			//callback();
		}
	);
}

Customer.get = function(username, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('customers').find({email:username}).toArray(function(err, customers){
		console.log('the query is ' + username);
		db.close();
		if(!customers) {
			callback(err,null);
			return;
		}
		if(customers.length > 0){
			callback(err, customers[0]);
		}
		else{
			callback(err, null);
		}
	});
}

Customer.addWechat = function(query, callback){
	var db = mongoskin.db(url, {native_parser: true});
	db.collection('customers').find({email:query.email}).toArray(function(err, result){
		if(result.length > 0){
			db.collection('customers').update(
				{email:query.email},
				{$set:{
					wechatNick:query.wechatNick,
					openid : query.openid, 
					verified: query.verified,
					headimgurl: query.headimgurl}
				}, {upsert:false}, function(err, result){
					db.close();
					callback(err, result);
			});
		}
		else{
			callback('useName not found!', result);
		}
	});
	
}

module.exports = Customer;
