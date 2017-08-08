

module.exports = {
    bodyParser: 	require('body-parser'),
    compression: 	require('compression'),
    cookieParser: 	require('cookie-parser'),
	express: 		require('express'),
	favicon: 		require('serve-favicon'),
	fs: 			require('fs'),
	gm: 			require('gm').subClass({imageMagick: true}),
    logger: 		require('morgan'),
	path: 			require('path'),
    partials: 		require('express-partials'),
    marked:         require('marked'),
	mime: 			require('mime').types,
	moment: 		require('moment'),
    multipart: 		require('connect-multiparty')(),
    router: 		require('express').Router(),
    session: 		require('express-session'),
    shortid: 		require('shortid'),
	url: 			require('url'),


    db: 		require('./db'),
    settings: 	require('./settings'),
	system: 	require('../util/system'),
    redis:      require('./redis'), 
}