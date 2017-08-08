
var hot = {},
	url		= "action/structure.php",
	taskId  = $my.getLocationQuery(window.location.href, 'taskid') || -1,
	struId 	= -1,
	struIds	= [],
	tableName = '全部',
	tabIndex= 0;




window.onload = function() {
	_init();
	
	//** 左侧选项卡 **
	$tab().run({moveBtn:false,items:['报表']}).appendTo('dtab1').onclick(function(i){alert(i)});
	
	//** 左侧任务名称 **
	$xhr.run({
		url	: "action/task.php",
		data: { fn:"getTaskName", taskid:taskId },
		onload : function(obj) {
			document.getElementById('taskName').innerHTML = '当前任务:' + obj;
		}
	});
	
	//** 左侧报表列表 **
	showLeftTables();
	
	//** 右侧工具栏 **
	hotImgBar('imgbar'); // in _init.js
	
	/** 右侧选项卡 **/
	$xhr.run({
		url	: "action/structure.php",
		data: {fn:"getNames", taskid:2},
		onload : function(obj) {
			$tab().run({items:obj}).appendTo('dtab').onclick(function(i){
				if (tabIndex != i) {
			    	tabIndex = i;
			    	document.getElementById('tableName').innerText = i===0 ? '全部' : tableName;
			    	showGrid();
	}})}});
	
	/** 呈现右侧数据表 **/
	showGrid();
	
} // window.onload end.

// 呈现左侧列表
function showLeftTables() {
	$xhr.run({
		url	: "action/structure.php",
		data: {fn: 'getTableList', taskid: taskId},
		onload: function(obj){
			struIds = dataFrame(obj).getCol(0);
			briefTable().create([], dataFrame(obj).delCol(0).val(), {id:'stru'}).onclick(
				function(x, y, h, t, o){
					struId = struIds[x];
					tableName = h;
					if(tabIndex>0) {
						document.getElementById('tableName').innerText=h;
						showGrid();
			}}).appendTo('tableList', true);
	}});
}




/** 呈现右侧数据表 **/
function showGrid() {
	var data = {}
	switch (tabIndex) {
		case 0: // 表
			data = {fn:"getRow", struid: 11};break;
		case 1: // 横表头
			data = {fn:"getRow", struid: 12};break;
		case 2:	// 纵表头
			data = {fn:"getRow", struid: 13};break;
		case 3: // 列样式
			data = {fn:"getRow", struid: 14};break;
		case 4:
			data = {fn:"getRow", struid: 15};break;
		case 5:
			data = {fn:"getRow", struid: 16};break;
		case 6:
			data = {fn:"getRow", struid: 17};break;
		case 7:
			data = {fn:"getRow", struid: 18};break;
		case 8: // 预览
			data = {fn:"getRow", struid: struId};break;
		default: alert('尚在建设中...');return;
	}
	
	$xhr.run({
		"url"	 : "action/structure.php",
		"data"	 : data,
		"onload" : function(obj) {
			if(obj){
				if(hot && hot.ins)hot.ins.destroy();
				hot = renderHot('grid', obj);	// in _init.js
				if(struId>0 || tabIndex==0) setData();
	}}});
}


/** 刷新右侧数据表数据 **/
function setData() {
	switch (tabIndex) {
		case 0:
			$xhr.run({
				url	: "action/structure.php",
				data: {fn: 'getByTaskid', taskid: taskId},
				onload: function(obj) {
					hot.ins.loadData(obj);
				}
			}); break;
		case 1:	// 横表头
			$xhr.run({
				url	: "action/structure.php",
				data: {fn:'getCHeaders', struid: struId},
				onload: function(obj){
					hot.ins.loadData(obj);
				}
			}); break;
		case 2:	// 纵表头
			$xhr.run({
				url	: "action/structure.php",
				data: {fn: 'getRHeaders', struid: struId},
				onload: function(obj){
					hot.ins.loadData(JSON.parse(obj.rheaders));
					hot.ins.updateSettings({
						colWidths:	JSON.parse(obj.widths)});
				}
			}); break;
		case 3:	// 样式表
			$xhr.run({
				url	: "action/structure.php",
				data: {fn: 'getColumns', struid: struId},
				onload: function(obj) {
					var widths = JSON.parse(obj.widths),
						columns= JSON.parse(obj.columns),
						df = [],
						N = Math.max(widths.length, columns.length);
					for(var n=0; n<N; n++){
						df[n] = [];
						df[n][0] = widths[n];
						df[n][1] = columns[n]['className'];
						df[n][2] = columns[n]['readOnly'] ? true : false;
						df[n][3] = columns[n]['type'];
						df[n][4] = columns[n]['source'];
					}
					hot.ins.loadData(dataFrame(df).kvc(hot.kvs).df);
				}
			}); break;
		default: break;
	}
	
	
}





//****************** hotImgBar click event ************************
function hotImgBarNew(){
	
	if (tabIndex>0) {
		struId = -1;
		document.getElementById('tableName').innerHTML = '新建';
		hot.ins.clear();
	}
}


function hotImgBarSave(){
	if(tabIndex!=0 && struId===-1){alert('请先选择表'); return}
	switch (tabIndex) {
		case 0 : saveA();break;
		case 1 : saveB();break;
		case 2 : saveC();break;
		case 3 : saveD();break;
		case 4 : saveE();break;
		case 5 : saveF();break;
		case 6 : saveG();break;
		default:alert('尚未定义!');
}}
// 报表
function saveA(){
	var df = dataFrame(hot.ins.getData()).delRowsAtEmptyCols(1).val();
	
	$xhr.run({
		url	 : "action/structure.php",
		data : {	fn	: 'saveRows',
				taskid	: taskId,
				rows 	: JSON.stringify(df)
		},
		onload: function(obj) {
			df = dataFrame(df).setCol(0, obj.ids).val();
			hot.ins.loadData(df);
			struIds = obj.ids;
			showLeftTables();
			if (obj.msg){alert(obj.msg)}
	}});
	
	
}


// 横表头
function saveB(){
	var DF=dataFrame(hot.ins.getData()).delEmptyRCS();
	var df = DF.df;
	$xhr.run({
		url	 : "action/structure.php",
		data : {
				fn		: 'saveCHeaders',
				struid 	: struId,
				cheaders: JSON.stringify(df)
		},
		onload: function(obj) {
			if (obj.msg) { alert(obj.msg); }
		}
	})
}

// 纵表头
function saveC(){
	var df=dataFrame(hot.ins.getData()).delEmptyRCS().df;
	$xhr.run({
		url	: "action/structure.php",
		data : {
				fn		: 'saveRHeaders',
				struid 	: struId,
				rheaders: JSON.stringify(df)
		},
		onload: function(obj) {
			if (obj.msg){alert(obj.msg)}
		}
	})
}

// 样式表
function saveD(){
	var df=hot.ins.getData();
	alert(df)
	
	
	
}









