/*
**
**
*/
'use strict';

let cwd = process.cwd();

module.exports = {
	mongodbPath: '/var/lib/mongodb/',
	mongodb: 'mongodb://127.0.0.1:27017/nCMS',

	template: {
		default: cwd + '/views/default/public/template.ejs',
	},

	page: {
		itemsPerPage: 10,
		
	},

	redis: {
		host: '127.0.0.1',
		port: 6379,
		db  : 0,
		ttl : 60*60, // 1 hours
	},

	upload: {
		PATH: cwd + '/public/upload/files/',
		path: '/upload/files/',
		maxSize: 1024*1024*10, //10M
	},

	// 微缩图
	thumb: {
		width: 175,
		height: 100,
		maxSize: 1024*100, //100K
		path: cwd + '/public/upload/image/',
	},


	image: {
		zip: true,
		width: 600,
		height: 300,
		path: cwd + '/public/upload/image/',
	},

	

	login: {
		success: {state: 200, msg: '登录成功!'},
		failure: {state: 600, msg: '登录失败!'},
		error:   {state: 620, msg: '用户名或密码错误!'},
		sameName:{state: 660, msg: '用户重名!'},
	},


	
}