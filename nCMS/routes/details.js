
var {db, express, shortid, marked} = require('../libs/requires'),
	router 	= express.Router();


router.get('/:id', function(req, res, next) {

	res.render('default/details', {
		user	: req.session.user,
		article	: db.articles.getAndIncClick(req.params.id),
	});
	
});



marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});


router.get('/doc/:id', function(req, res) {
	var user = req.session.user;
	db.articles.getAndIncClick(req.params.id).exec(function(err, doc) {
		var sid = doc.status._id;
		if (sid<6 || sid==7 || (sid==6 && user && (doc.user._id==user._id || user.role<3))) {
			res.json({
				_id: 		doc._id,
				content: 	marked(doc.content),
				date: 		doc.date.toLocaleDateString(),
				title: 		doc.title,
				click: 		doc.click,
				user: 		doc.user.name,
				editable: 	(user && (user._id==doc.user._id || user.role<3)) ? true : false,
			});
		} else {
			res.json({
				_id: 		'',
				content: 	'你没有浏览此文档的权限',
				date: 		doc.date.toLocaleDateString(),
				title: 		doc.title,
				click: 		doc.click,
				user: 		doc.user.name,
				editable: 	false,
			});
		}
	});

});

module.exports = router;