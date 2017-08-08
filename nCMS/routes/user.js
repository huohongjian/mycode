var {express, url, db, shortid, settings, moment, gm} = require('../libs/requires');
var router  = express.Router();

var shortid = require('shortid');

//判断是否登录中间件
router.get('/*', function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        let method = url.parse(req.url, true).query.method || 'GET';
        if (method.toUpperCase()=='POST') {
            res.end('{"state": 500, "msg": "未登陆"}');
        } else {
            let path = req.url;
            res.redirect('/login?target=/user' + path);
        }
    }
});

router.post('/*', function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        let method = req.body.method || 'POST';
        if (method.toUpperCase() == 'GET') {
            let path = req.url;
            res.redirect('/login?target=/user' + path);
        } else {
            res.end('{"state": 500, "msg": "未登陆"}');
        }
    }
});


router.get('/', function(req, res) {
    var params = url.parse(req.url, true).query,
        page   = params.page || 1,
        query  = {
            user: req.session.user._id,
            status: {$lt: 7},
        };
    res.render('default/user/index', {
        user: req.session.user,
        articles  : db.articles.getNewly(query, page),
        recommends: db.articles.getNewly(query),
        items: {total: db.articles.count(query), per: 10},
    });
});

router.get('/ebooks', function(req, res) {
    var id = req.session.user._id;
    db.articles.find({user:id, category:'电子书'}).select('title').sort('-date').limit(10).exec(function(err, doc){
        console.log(doc);
        res.json(doc);
    });
});

router.post('/appendToBook', function(req, res) {
    var user            = req.session.user,
        bookid          = req.body.bookid,
        appendContent   = req.body.appendContent;
    console.log(req.body);

    if (!user) {
        res.end('请登录!');
        return false;
    }
    db.articles.findById(req.body.bookid).exec(function(err, doc) {
        if (err) {
            res.end('系统错误，添加失败!');
            return;
        }
        if (!doc) {
            res.end('无此电子书，请确认!');
            return;
        }
        if (doc.user !== user._id) {
            res.end('您没有修改电子书的权限!');
            return;
        }
        db.articles.update({_id: bookid}, {$set: {content: doc.content + appendContent}}, function(err) {
            if (err) {
                res.end('系统错误，添加失败!');
            } else {
                res.end('添加至电子书，操作成功!');
            }
        })

    });
});

router.get('/manage', function(req, res) {
    var query = {user: req.session.user._id},
        params= url.parse(req.url, true).query,
        page  = params.page || 1;

    res.render('default/user/manage', {
        articles: db.articles.getNewly(query, page),
        items: {total: db.articles.count(query), per: 10},
    });
});
router.get('/info/', function(req, res) {
    res.render('default/user/info', {
        user: req.session.user,
    });
});
router.post('/info/modifyPwd', function(req, res){
    db.users.update({_id: req.session.user._id}, {$set:{pwd: req.body.pwd}}, function(err) {
        if (err) {
            res.end(err);
        } else {
            res.end('密码修改成功！');
        }
    });
});
router.post('/info/modifyInfo', function(req, res) {
    db.users.findOneAndUpdate({_id: req.session.user._id}, {$set: req.body}, {new: true}, function(err, doc) {
        if (err) {
            res.end(err);
        } else {
            req.session.user = doc;
            res.end('用户信息修改成功！');
        }
    });
});


router.get('/tasks', function(req, res) {
    res.render('default/user/tasks', {
        tasks: db.tasks.find(),
        items: {total: db.tasks.count(), per: 10},
    })
});
router.post('/addTask', function(req, res) {
    var ps   = req.body,
        data = {
            time:       ps.time,
            name:       ps.name,
            remind:     ps.remind,
            frequency:  ps.frequency,
            autoRemove: ps.autoRemove,
            user:       req.session.user._id,
        };
    db.tasks.create(data, function(err, doc) {
        if (err) {
            res.json({status:500, msg:err});
        } else {
            res.json({status:200, task:doc});
        }
    });
});




router.get('/gimp', function(req, res) {
    res.render('default/user/gimp', {

    });
});


router.get('/edit/:id?', function(req, res) {
	var rs 	 = {},
		id 	 = req.params.id,
		user = req.session.user;
	if (!user) {
		res.redirect('/login');
	}

	if (id) {
		if (shortid.isValid(id)) {
			db.articles.findById(id).exec(function(err, doc) {
				if (doc) {
					if (doc.user==user._id || user.role<3) {
                        if (doc.status<8) {
    						res.render('default/user/edit', {
                                mycats : user.categories,
    							article: doc,
    						});
                        } else {
                            res.render('message', {msg: '请先在文章管理中更改状态级别，再修改'});
                        }
					} else {
						res.render('message', {msg: '您没有修改此文章的权限'});
					}
				} else {
					res.render('message', {msg: '查无此文'});
				}
			});
		} else {
			res.render('message', {msg: '文档ID无效'});
		}
	} else {
		res.render('default/user/edit', {
            mycats : user.categories,
			article: {
                status: 4,
                image: '/images/thumb/1.jpg',
            },
		});
	}
});


router.post('/save', function(req, res, next){
    var user = req.session.user;
    if (!user) {
        res.json({state: 500, msg: '请登录'});
        return false;
    }

    var id = req.body._id,
    	q  = req.body,
        s  = '',
        d  = {
			title   : q.title,
			abstract: q.abstract,
			category: q.category,
			status  : q.status,
			content : q.content,
			image   : q.image,
		};

    if (user.role>2) {
        if (q.old_status && q.old_status<3) {
        	if (d.status!=q.old_status){ //
        		d.status = q.old_status;
            	s = '<br>你没有更改状态等级的权限!';
        	}
        } else {
        	if (q.status<3) {
        		d.status = 3;
            	s = '<br>你没设定为"首推/显"的权限!';
        	}
        }
    }

    if (shortid.isValid(id)) { // 如果使用upsert, 则属性默认值不能添加。
		db.articles.findOneAndUpdate({_id:id}, {$set: d}, {new:true}, function(err,doc) {
			if (err) {
				res.json({status:500, msg:err});
			} else {
				res.json({status:200, msg:'保存成功!'+s, _st:d.status, _id:id});
			}
		});
	} else {
		d.user = user._id;
		console.log(d)
		db.articles.create(d, function(err, doc){
			if (err) {
				res.json({status:500, msg:err});
			} else {
				res.json({status:200, msg:'添加成功!'+s, _st:d.status,  _id:doc._id});
			}
		});
	}
});



router.post('/uploadFile', function(req, res, next) {
    var file = req.files.file,
        path = file.path,
        name = file.originalFilename,
        size = file.size;

    var date = new Date();
    var ms = moment(date).format('YYYY-MM-DD_HH:mm:ss_').toString();

    var output   = settings.upload.PATH + ms + name,
        fileName = settings.upload.path + ms + name;
    var size = req.files.file.size;
    if (size>1024 * 1024 * 10) {    //10M
        res.json({state: 500, msg: 'This file is too large(>10M)!'});
        console.log('This file is too large(>10M)!');
        return;
    }

    console.log(output);

    var source = fs.createReadStream(path);
    var dest = fs.createWriteStream(output);
    source.pipe(dest);

    source.on('end', function() {
        res.json({state: 200, id: fileName, msg: 'File upload success!'});
        fs.unlinkSync(path);
    });
    source.on('error', function(err) {
        res.json({state: 500, msg: err});
        console.log(err);
    });
});


/* GET users listing. */
router.post('/uploadImage', function(req, res, next) {
    console.log(req.files);

    var input  = req.files.file.path;

    var date = new Date();
    var ms = moment(date).format('YYYYMMDDHHmmss').toString();
    
    var output = settings.thumb.path + date.toISOString();// req.files.file.originalFilename;
    var size = req.files.file.size;

    let width = settings.thumb.width;

    console.log(input, output, width);
//    gm(input).resize(width).autoOrient().write(output + '.jpeg', function(err) {

    gm(input).autoOrient().write(output + '.jpeg', function(err) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            console.log('ok')
            res.end('ok');
        }
    })
//    获取传入参数
    // var params = url.parse(req.url,true);
    // var fileType = params.query.type;
    // var fileKey = params.query.key;
    // var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];
    // console.log('start upload');

    // //存放目录
    // var updatePath = "public/upload/images/";
    // var smallImgPath = "public/upload/smallimgs/";
    // var newFileName = "";
    // form.uploadDir = updatePath;

    // form.on('field', function(field, value) {
    //     fields.push([field, value]);
    // }).on('file', function(field, file) {
    //     files.push([field, file]);
    //     docs.push(file);

    //     //校验文件的合法性
    //     var realFileType = system.getFileMimeType(file.path);
    //     var contentType  = mime[realFileType.fileType] || 'unknown';
    //     if(contentType == 'unknown'){
    //         res.end('typeError');
    //     }

    //     var typeKey = "others";
    //     var thisType = file.name.split('.')[1];
    //     var date = new Date();
    //     var ms = moment(date).format('YYYYMMDDHHmmss').toString();

    //     if(fileType == 'images'){
    //         typeKey = "img"
    //     }
    //     newFileName = typeKey + ms + "."+thisType;

    //     if(fileType == 'images'){
    //         if(realFileType.fileType == 'jpg' || realFileType.fileType == 'jpeg' || realFileType.fileType == 'png'  || realFileType.fileType == 'gif'){
    //             if(settings.imgZip){
    //                 fs.rename(file.path,updatePath + newFileName,function(err){
    //                     if(err){
    //                         console.log(err)
    //                     }else{
    //                         // 图片缩放
    //                         var input =  updatePath + newFileName;
    //                         var out = smallImgPath + newFileName;

    //                         if(fileKey == 'ctTopImg'){
    //                             gm(input).resize(270,162,'!').autoOrient().write(out, function (err) {
    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     console.log('done');
    //                                 }
    //                             });
    //                         }else if(fileKey == 'plugTopImg'){ // 插件主题图片
    //                             gm(input).resize(270,162,'!').autoOrient().write(out, function (err) {
    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     console.log('done');
    //                                 }
    //                             });
    //                         }else if(fileKey == 'userlogo'){ // 用户头像
    //                             gm(input).resize(100,100,'!').autoOrient().write(out, function (err) {
    //                                 if (err) {
    //                                     console.log(err);
    //                                 } else {
    //                                     console.log('done');
    //                                 }
    //                             });
    //                         }
    //                     }
    //                 })
    //             }else{
    //                 fs.rename(file.path,updatePath + newFileName,function(err){
    //                     if(err){
    //                         console.log(err)
    //                     }
    //                 })
    //             }
    //         }else{
    //             res.end('typeError');
    //         }

    //     }

    // }).on('end', function() {

    //     // 返回文件路径
    //     if(settings.imgZip && (fileKey == 'ctTopImg' || fileKey == 'plugTopImg' || fileKey == 'userlogo')){
    //         res.end('/upload/smallimgs/'+newFileName);
    //     }else{
    //         res.end('/upload/images/'+newFileName);
    //     }

    // });

    // form.parse(req, function(err, fields, files) {
    //     err && console.log('formidabel error : ' + err);
    //     console.log('parsing done');
    // });
});








module.exports = router;


