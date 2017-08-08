var {system, mime, moment, db}
	= require('../libs/requires');

// var r = system.getFileMimeType('DSC_6579.JPG');
// var m = mime[r.fileType];
// console.log(r);
// console.log(m);

var date = new Date();
var ms = moment(date).format('YYYYMMDDHHmmss').toString();

console.log(ms);

console.log(date.toISOString());


