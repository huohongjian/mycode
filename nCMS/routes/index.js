
var {db, url, shortid, express, multipart, settings} = require('../libs/requires');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let params = url.parse(req.url, true).query,
        page   = params.page || 1,
        query  = {status: {$lt: 3}};
	res.render('default/index', {
        user: req.session.user,
        articles  : db.articles.getNewly(query, page),
        recommends: db.articles.getNewly({status: 1}),
        ebooks    : db.articles.getNewly({status: {$lt: 3}, category: "电子书"}),
		items: {total: db.articles.count(query), per: 10},
	});
});





/* 用户登录 */
var PW = require('png-word');
var RW = require('../util/randomWord');
var rw = RW('abcdefghijklmnopqrstuvwxyz23456789');
var pngword = new PW(PW.GRAY);

//刷新验证码
router.get('/vnum',function(req, res){
    var word = rw.random(4);
    req.session.vnum = word;
    pngword.createPNG(word,function(word){
        res.end(word);
    });
    
});

router.get('/login', function(req, res) {
    res.render('default/login', {
        user: req.session.user,
//        layout: settings.template.default,
    });
});


router.post('/doLogin', multipart, function(req, res) {
    if (req.body.vnum != req.session.vnum) {
        req.session.vnum = rw.random(4);
        res.end('验证码有误！');
    } else {
		db.users.findOne({'login':req.body.login, 'pwd':req.body.pwd}).exec(function(err, user) {
			if (err) {
				res.end(err);
			} else {
				if (user) {
					req.session.user = user;
					res.end("success");
				} else {
					res.end("用户名或密码错误");
				}
			}
		});
	}
});


router.get('/loginOut', function(req, res) {
    req.session.user = null;
    res.redirect('/');
});


/* 用户注册 */
router.get('/regist', function(req, res) {
    res.render('default/regist', {
        user: req.session.user,
    });
});

router.post('/doRegist', multipart, function(req, res) {
    if (req.body.vnum != req.session.vnum) {
        req.session.vnum = rw.random(4);
        res.end('验证码有误!');
        return false;
    }
    db.users.findOne({login: req.body.login}).exec(function(err, doc){
        if (doc) {
            res.end('有重名用户!');
        } else {
            delete req.body.pwd2;
            delete req.body.vnum;
            db.users.create(req.body, function(err, doc){
                if (err) {
                    res.end(err);
                } else {
                    res.end('注册成功!');
                }
            });
        }
    });
});

router.get('/search', function(req, res) {
    let user   = req.session.user;
        params = url.parse(req.url, true).query,
        status = params.status || 0,
        range  = params.range || 'title',
        key    = params.key || '',
        page   = params.page || 1,
    	query  = {};

    if (key!='') query[range] = {$regex: new RegExp(key, 'gi')};
    if (user) {
        query.user = user._id;
        if (status==0) {
            query.status = {$lt: 7};
        } else if(status<7) {
            query.status = status;
        } else {
            query.status = -1;
        }
    } else {
        if (status==0) {
            query.status = {$lt: 5};
        } else if (status<5) {
            query.status = status;
        } else {
            query.status = -1;
        }
    }

	res.render('default/search', {
		user: user,
		articles: db.articles.getNewly(query, page),
		items: {
            total: db.articles.count(query), 
            per: 10,
        },
	});
});

module.exports = router;