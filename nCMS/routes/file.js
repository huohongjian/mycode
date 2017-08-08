
var db		= require('../libs/db'),
	shortid = require('shortid'),
	express = require('express'),
	router 	= express.Router(),
//	formidable = require('formidable'),
//	multiparty = require('multiparty'),
//	mul = require('connect-multiparty')(),
//	util 	= require('util'),
//	sharp 	= require('sharp'),
	gm		= require('gm').subClass({imageMagick: true}); // sudo apt-get instll imagemagick
	fs 		= require('fs');


var templatePath = process.cwd() + '/views/default/public/template';

router.get('/', function(req, res, next) {
	res.render('default/file', {
		"user"		: req.session.user,
		"layout"	: templatePath,
	});
	
});

router.post('/upload', function(req, res, next) {
	var path = req.files.file.path;
	var output = process.cwd() + '/public/images/' + req.files.file.originalFilename;
	var size = req.files.file.size;
if (size>1024 * 1024 * 10) {	//10M
	console.log('too large');
	return;
}
//    console.log(req.body,req.files,req.files.file.path);
var source = fs.createReadStream(path);
var dest = fs.createWriteStream(output);
source.pipe(dest);
//source.on('end', function() { fs.unlinkSync(path);});   //delete
source.on('error', function(err) { console.log(err); });
	
});




router.post('/upload1', function(req, res, next) {
	var path = req.files.file.path;
	var output = process.cwd() + '/public/images/' + req.files.file.originalFilename;
	var size = req.files.file.size;
	console.log(req.files);
	gm(path).resize(600,null).autoOrient().write(output, function(err) {
		if (err) {
			console.log(err);
			res.end(err);
		} else {
			console.log('ok')
			res.end('ok');
		}
	})

})
module.exports = router;