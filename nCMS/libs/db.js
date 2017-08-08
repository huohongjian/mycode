/*
* fileName = db.js
* descript = mongoose操作类
*     date = 2017-1-20
*   author = HuoHongJian
*/

'use strict';
var mongoose = require('mongoose'),
	schemas  = require('./schemas'),
	settings = require('./settings');

mongoose.connect(settings.mongodb);
mongoose.Promise = global.Promise;

var conn = mongoose.connection;
conn.on('connected', function(err){
	if(err){
		console.log('Mongoose connection failure!');
	}else{
		console.log('Mongoose connection succes!');
	}
});
conn.on('error', function(err){
	console.log('Mongoose connected error: ' + err);
});
conn.on('disconnected', function(){
	console.log('Mongoose disconnected!');
});
process.on('SIGINT', function(){
	conn.close(function(){
		console.log('Mongoose disconnected through app termination');
		process.exit(0);
	});
});

// ****** create Schema ******
var db = {};
for(var k in schemas){
	var schema = new mongoose.Schema(schemas[k]);
	db[k] = mongoose.model(k, schema);
}


// add static method : Schema.static.method = function(){}
db.articles.getNewly = function(query={}, page=1, limit=10) {
	return db.articles.find(query).sort('-date').limit(limit).skip((page-1)*limit).populate('status user');
}

db.articles.getAndIncClick = function(id) {
	return db.articles.findByIdAndUpdate(id, {$inc: {click: 1}}, {new: true}).populate('status user');
}
db.articles.updateCommentNum = function(contentId, key, callBack) {
    db.articles.findOne({'_id' : contentId},'commentNum',function(err, doc){
        if(err){
            res.end(err)
        }
        if(key === 'add'){
            doc.commentNum = doc.commentNum + 1;
        }else if(key === 'del'){
            doc.commentNum = doc.commentNum - 1;
        }
        doc.save(function(err){
            if(err) throw err;
            callBack();
        })
    })
}


db.users.hasAccess = function(userid, accessName) {
	return Promise.all([
		db.users.findById(userid).select('access'),
		db.access.findOne({name: accessName})
	]).then(function(r) {
		var user = r[0],
			accs = r[1].ids;
		if(!user || !accs) return false;
		for(var i=0; i<accs.length; i++) {
			if(accs[i] in user.access) return true;
		}
		return false;
	});
}




module.exports = db;