var {express, session, path, favicon, cookieParser, bodyParser, logger,
     compression, settings, partials, marked, db, redis} = require('./libs/requires');
var app = express(),
    RedisStore = require('connect-redis')(session);

// view engine setup
//静态压缩
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.set('view cache', true);
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




var multipart = require('connect-multiparty');
app.use(multipart({uploadDir:'/tmp'}));





app.use(express.static(path.join(__dirname, 'public')));


/* 对session的处理要放在/拦截器和/users拦截器的前面 */
app.use(cookieParser('nCMS'));
app.use(session({
    secret: 'nCMS',
    store: new RedisStore({
    	"host": settings.redis.host,
        "port": settings.redis.port,
        "db"  : settings.redis.db,
        "ttl" : settings.redis.ttl
    }),
    cookie: {maxAge: 1000*60*60*24*30},
    resave: true,
    saveUninitialized: true
}));

app.use(require('express-promise')());
app.use('/',         require('./routes/index'));
app.use('/ebook/',   require('./routes/ebook'));
app.use('/user/', 	 require('./routes/user'));
app.use('/details/', require('./routes/details'));
app.use('/admin/',   require('./routes/admin'));
app.use('/file/',    require('./routes/file'));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
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
app.locals.mdToHtml = function(md){
    return marked(md);
};

db.users.findOne({login: 'anon'}).select('categories').exec(function(err, doc) {
    if(!err && doc) {
        app.locals.cats = doc.categories;
    }
});



// setInterval(function(){
//     db.status.find().exec(function(err, doc){
//         console.log(doc);
//     });
// },10000);


module.exports = app;
