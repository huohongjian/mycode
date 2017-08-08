var {redis, db} = require('./requires');


//redis.set('cnms', {name: 'hhj'}, 1000*60*60);


redis.get('cnms', function(r){
	console.log(r);
});

db.articles.findOne().exec(function(err, doc){
	console.log(doc);
})
