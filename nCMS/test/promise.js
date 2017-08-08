
var Models = require('../libs/Models');

var names = ['hhj', 'wyh'];

new Promise(function(resolve, reject) {
	resolve();
})
.then(function(n) {
	var rs = []
	names.forEach(function(name) {
		console.log(name);
		var m = Models['users1'].findOne({login: name});
		rs.push(m);
	})
	return Promise.all(rs);
})
.then(console.log)
.catch(console.log)

console.log('end')


// var rs = [];

// Models['users'].findOne({login: 'hhj'}).exec(function(err, doc) {
// 	rs.push(doc);
// //	return Promise.all(rs);
// })
// .then(function(){

// })

// .then(function(){
// 	console.log(rs);
// });





