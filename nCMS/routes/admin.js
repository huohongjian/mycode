
var {express, db, url} = require('../libs/requires'),
	router 	= express.Router();



router.get('/*', function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		let params = url.parse(req.url, true),
			method = params.query.method || 'GET';
		if (method.toUpperCase()=='POST') {
			res.end('{"state": 500, "msg": "未以管理员身份登陆"}');
		} else {
			let path = req.url;
            res.redirect('/login?target=/admin' + path);
		}
	}
});

router.post('/*', function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		let params = url.parse(req.url, true),
			method = params.query.method || 'POST';
		if (method.toUpperCase() == 'GET') {
			let path = req.url;
            res.redirect('/login?target=/admin' + path);
		} else {
			res.end('{"state": 500, "msg": "未以管理员身份登陆"}');
		}
	}
});


router.get('/', function(req, res){
	res.redirect('/admin/articleList');
});


router.get('/userList', function(req, res) {
	res.render('default/admin/userList', {
		users: db.users.find(),
		userInfo: req.session.userInfo,
	});
});


router.get('/articleList', function(req, res) {
	var param  = url.parse(req.url, true).query,
		status = param.status || 0,
		range  = param.range,
		key    = param.key || '',
		page   = parseInt(param.page) || 1,
		per	   = 10,
		query  = {};

	if (key!='') query[range] = new RegExp(key, 'gi');
	if (status>0) query.status = status;

	console.log(query)

	res.render('default/admin/articleList', {
		articles: db.articles.getNewly(query, page).populate('user').populate('status'),
		items: {total: db.articles.count(query), per: 10},
	});
});


router.post('/setStatus', function(req, res) {
	var _ids   = req.body._ids,
		status = req.body.status;

	db.articles.update({_id: {$in: _ids}}, {$set: {status: req.body.status}}, {multi: true}, function(err, a) {
		if (err) {
			req.end('内部错误' + err);
		} else {
			res.end('成功更新 ' + a.nModified + ' 个文档!');
		}
	})

});


module.exports = router;
