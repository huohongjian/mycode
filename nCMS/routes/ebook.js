
var {db, url, express, shortid, multipart, settings} = require('../libs/requires');
var router  = express.Router();

router.get('/', function(req, res, next) {
	res.render('default/search', {
		user: req.session.user,
		articles: db.articles.find({category: '电子书'}).sort('-date'),
		items: {
            total: db.articles.count({category: '电子书'}), 
            per: 10,
        },
	});
});



router.get('/:id', function(req, res) {
	res.render('default/ebook', {
		user : req.session.user,
		article: db.articles.getAndIncClick(req.params.id),
	});
});


module.exports = router;