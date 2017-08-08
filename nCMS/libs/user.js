var mongoose = require('mongoose');
var uri = 'mongodb://localhost:27017/myblog';
mongoose.connect(uri);
mongoose.Promise = global.Promise; //require('bluebird');
var db = mongoose.connection;

// 
// var opt = { promiseLibrary: require('bluebird') };
// var db  = mongoose.createConnection(uri, opt);

// db.on('connected', function(){
// 	console.log('Mongoose connection success!')
// });

// db.on('error', function(err){
// 	console.log('Mongoose connection error!');
// });

// db.on('desconnected', function(){
// 	console.log('Mongoose connection desconnected!');
// });

var UserSchema = new mongoose.Schema({
	name: String,
	pwd: String,
	age: Number
});

var User = mongoose.model('users', UserSchema);

var user = new User({
	name: 'wyh',
	pwd: '1234',
	age: 42
});

user.save(function(err, res){
	if(err){
		console.log('Error:' + err);
	} else {
		console.log('Res:' + res);
	}

});

db.close();