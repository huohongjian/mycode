
var db 	= require('../libs/db');

//installUsers();
//installAccess();
//installStatus();
//installRoles();


///////////////////////////////////////////////////////////////////////////

function installRoles(){
	var collection = 'roles';
	var data = [
		[1, '超级用户'],
		[2, '高级用户'],
		[3, '普通用户'],
		[4, '匿名用户']
	];

	db[collection].remove();
	data.forEach(function(a, i){
		db[collection].create({
			_id:  a[0],
			name: a[1],
		}, function(err, result){
			if (err) {
				console.log(err);
			} else {
				console.log(i + '. A document has been appended to status collection.');
			}
		});
	});
}



function installStatus() {
	db.status.remove({}, function(err){if(err)console.log(err)});
	var data = [
		[1, '首推'],
		[2, '首显'],
		[3, '推荐'],
		[4, '公开'],
		[5, '隐藏'],
		[6, '私藏'],
		[7, '深藏'],
		[8, '雪藏'],
		[9, '删除']
	];
	data.forEach(function(a, i){
		db.status.create({
			_id:  a[0],
			name: a[1],
		}, function(err, result){
			if (err) {
				console.log(err);
			} else {
				console.log(i + '. A document has been appended to status collection.');
			}
		});
	});
}




// function installUsers() {
// 	db.users.remove({}, function(err){});
// 	var users = [
// 		['admin', 		'admin;',		'administrator',[1],	[]],
// 		['anon', 		'anon;',		'anonymous',	[],
// ['综合','历史','文学','法规','工作','生活','学习']],
// 		['huohongjian',	'huohongjian;',	'霍宏建', 		[1],	[]],
// 		['hhj',			'hhj;',			'HHJ',			[100],	['os','js','db','html']],
// 		['wyh',			'wyh;',			'WYH',			[100],	[]]
// 	]

// 	users.forEach(function(user){
// 		db.users.create({
// 			login: 		user[0],
// 			pwd: 		user[1],
// 			name: 		user[2],
// 			access: 	user[3], 
// 			categories: user[4]
// 		}, function(err, result){
			
// 		});
// 	});
// 	console.log('create users table is ok');
// }


function installAccess() {
	db.access.remove({}, function(err){});
	var access = [
		[1,  '全部',		[0,1],			false],
		[10, '系统管理',	[1,10],			false],
		[11, '维护权限表',[1,10,11],		true],
		[12, '维护用户表',[1,10,12],		true],
		[13, '维护文章表',[1,10,13],		true],
		[50, '用户管理',	[1,50], 		false],
		[51, '添加用户',	[1,50,51], 		true],
		[52, '修改用户',	[1,50,52], 		true],
		[53, '删除用户',	[1,50,53], 		true],
		[100,'文章管理',	[1,100], 		false],
		[101,'添加文章',	[1,100,101], 	true],
		[102,'修改文章',	[1,100,102], 	true],
		[103,'删除文章',	[1,100,103], 	true],
		[150,'报表管理',	[1,150],		false]
	];
	access.forEach(function(acc){
		db.access.create({
			id: 	acc[0],
			name: 	acc[1],
			ids: 	acc[2],
			isleaf: acc[3] 
		}, function(err, result){
			
		})
	});
	console.log('create access table is ok');
}

