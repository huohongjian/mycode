

var hot,
	taskIds	= [],
	taskId	= -1,
	taskName= '全部',
	tabIndex	= 0;
	

function next() {
	if (taskId == -1) {
		alert('请选择任务!');
	} else {
		window.location.href = 'structure.html?taskid=' + taskId;
	}
}



window.onload=function(){
	_init();
	
	//** 左侧选项卡 **
	$tab().run({moveBtn:false,items:['任务列表']}).appendTo('dtab1').onclick(function(i){alert(i)});
	
	//** 左侧任务列表 **
	showLeftTasks();
	//******************** left aside end **************************/
	
	// ** 右侧图标工具栏  **
	hotImgBar('imgbar'); // in _init.js
	
	
	//** 右侧选项卡 **
	$xhr.run({
		url	: "action/structure.php",
		data: {fn:"getNames", taskid:1},
		onload : function(obj) {
			$tab().run({items:obj}).appendTo('dtab').onclick(function(i){
				if (tabIndex != i) {
			    	tabIndex = i;
			    	document.getElementById('taskName').innerText = i===0 ? '全部' : taskName;
			    	showGrid();
	}})}});
	
	//** 呈现数据表框架 **
	showGrid();

} // ************************* window.onload end ********************************

function showLeftTasks(){
	$xhr.run({
		url	  : 'action/task.php',
		data  : {fn:'getTaskList'},
		onload: function(obj){
			taskIds = dataFrame(obj).getCol(0);
			briefTable().create([], dataFrame(obj).delCol(0).val(), {id:'task'}).onclick(
					function(x, y, h, t, o){
						taskId = taskIds[x];
						taskName = h;
						if(tabIndex>0) {
							document.getElementById('taskName').innerText=taskName;
							showGrid();
			}}).appendTo('taskList', true);
	}});
}




//** 呈现数据表框架 **
function showGrid() {
	$xhr.run({
		url	  : 'action/structure.php',
		data  : {fn:'getRow', struid:1+tabIndex},
		onload: function(obj) {
			if(obj){
				if(hot && hot.ins) hot.ins.destroy();
				hot = renderHot('grid', obj);	// in _init.js
				if(taskId>0 || tabIndex==0) setData();

}}})}


//** 刷新右侧数据表 **
function setData() {
	switch (tabIndex) {
	case 0:
		$xhr.run({
			url		: 'action/task.php',
			data	: {fn:'getAll'},
			onload	: function(obj){
				var df = dataFrame(obj).k2v(hot.kvs).val();
				hot.ins.loadData(df);
			}
		}); break;
	case 9:
		$xhr.run({
			url		: 'action/task.php',
			data	: {fn:'getInfo', taskid:taskId},
			onload	: function(o){
				var df = dataFrame(o).cross().kvc(hot.kvs).val();
				console.log(hot.dataArea)
				hot.ins.populateFromArray(hot.dataArea.x, hot.dataArea.y, df);
			}
		}); break;
	default : break;
	}
}


//****************** hotImgBar click event ************************
function hotImgBarNew(){
	taskId = -1;
	document.getElementById('taskName').innerHTML = '新建';
	hot.ins.clear();
}


// function hotImgBarAudit(){} 	// in _init.js



function hotImgBarSave(){
	switch(tabIndex){
		case 0: saveA();break;
		case 1: break;
		default:
			alert('尚未定义!');
		
	}
	
}

function saveA(){
	var df = dataFrame(hot.ins.getData()).delRowsAtEmptyCols(1).v2k(hot.kvs).val();
	
	$xhr.run({
		"url":"action/task.php",
		data : {fn	 : 'saveTasks',
				tasks: JSON.stringify(df)
		},
		onload: function(obj) {
				df = dataFrame(df).setCol(0, obj.ids).k2v(hot.kvs).val();
				hot.ins.loadData(df);
				taskIds = obj.ids;
				showLeftTasks();
				if (obj.msg){alert(obj.msg)}
	}});
}

function img_save_B(){
	
	
}










