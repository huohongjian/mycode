var db = require('../libs/db');

// db.users.findOne({login: 'hhj'}).exec(function(err, user) {
// 	console.log(user);

// 	var id = user._id;

// 	db.users.hasAccess(id, '文章管理').then(function(r) {
// 		console.log(r);
// 	})
// })




db.users.hasAccess('BJzgW5YK5x', '文章管理').then(function(r) {
		console.log(r);
})