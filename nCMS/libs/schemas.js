/*
* fileName = collections.js
* descript = 集合定义
* author = HuoHongJian
* date = 2017-1-20
*/
'use strict';
var shortid = require('shortid');

module.exports = {

"articles": {
	_id: {type: String, unique: true, default: shortid.generate},
	title: String,
	category: String,
	image: String,
	abstract: String,
	content: String,
	date: {type: Date, default: Date.now, index: true},
	click: {type: Number, default: 0},
	comments : [],
	commentNum: {type: Number, default: 0},
	status: {type: Number, index: true, ref: 'status'},
	user: {type: String, index: true, ref: 'users'}, // ref: Model
},

"status" : {
	_id: {type: Number, unique: true},
	name: String,
},

"users": {
	_id: {type: String, unique: true, default: shortid.generate},
	login: String,
	pwd:   String,
	name: String,
	nick: String,
	logo: String,
	sex: {type: String, enum: ['男', '女', '未知'], default: '未知'},
	email : String,
	phone : String,
	qq: String,
	role: {type: Number, default: 3},
	categories: [String],
	introduce : String,
	date: { type: Date, default: Date.now },
},

"roles": {
	_id: {type: Number, unique: true},
	name: String,
},

"tasks": {
	_id: {type: String, unique: true, default: shortid.generate},
	time: {type:Date, index:true},
	name: String,
	remind: Date,
	frequency: Number,
	autoRemove: Boolean,
	date: {type: Date, default: Date.now },
	user: {type: String, index: true, ref: 'users'},
},



"notes": {
	_id: {type: String, unique: true, default: shortid.generate},
	url: String,
	title: String,
	date: {type: Date, default: Date.now, index: true},
},

"links": {
	_id: {type:String, unique:true, default:shortid.generate},
	url: String,
	title: String,
	order: {type:Number, default:0},
},

/////////////////////////////////////////////////////////





"access": {
	_id: {type: String, unique: true, default: shortid.generate},
	id: Number,
	ids: [Number],
	name: {type: String, index: true},
	isleaf: {type: Boolean, default: false},
	remark: String,
},

"categories": {
	_id: {type: String, unique: true, default: shortid.generate},
	name: String,
	alias: String,
	hasArt: {type: Number, default: 0},
	state: {type: String, default: '1'},
	order: {type: Number, default: 0, index: true},
	comments : String,
},

"uploads": {
	_id: {type: String, unique: true, default: shortid.generate},
	name: String,
	cate: {type: String, enum: ['image', 'audio', 'video', 'file']},
	size: Number,
	date: { type: Date, default: Date.now, index: true },
	remark: String,
},

}