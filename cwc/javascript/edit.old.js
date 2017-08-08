<!--
var $articleid = -1;
var $categoryid = -1;
var enterTabOrder = new Array ('title','author','number','caption','e_save');	//aEvent();即可	设置回车顺序


window.onload = Init;

function Init(){
	
	$articleid = parseInt(window.location.href.getQuery('id') || -1);
	menuFix();
	
	select_menu_item("editors", 0);
	select_menu_item("published",0);
	select_menu_item("levels", 0);
	select_menu_item("hidetitle",0);
	select_menu_item("isreply",0);
	create_tree(document.getElementById('tree'));
	
	
	CreateEditor();
	
	
//	aEvent();
	if($articleid!=-1){
		
		var params = 'func=getInfo&articleid='+$articleid;
		$.ajax({
			url:		'./action/edit.php',
			type:		'post',
			dataType:	'json',
			data:		params,
			success:	getInfo_back
		});
	}
}
function getInfo_back(json){
	switch(json.msg){
		case 'nologin': if(confirm('您尚未登录!\n\n现在是否登录?')) login(); break;
		case 'nopower': alert('您没有修改此文权限,请与此文添加者联系!'); break;
		case 'article':
			$categoryid = parseInt(json.categoryid);
			var content = encode(json.content, 'htm->txt');
			$("#number").val(json.number);
			$("#caption").val(json.caption);
			$("#title").val(json.title);
			$("#author").val(json.author);
			$("#DataTextarea").val(content);
			select_menu_item('published', json.published);
			select_menu_item('hidetitle', json.hidetitle);
			select_menu_item('isreply', json.isreply);
			select_menu_item('levels', json.readlevel);
			break;
		default: alert('未知错误,请与系统管理员联系!');
	}
}



function add_article(){
	$articleid = -1;
	$categoryid = -1;
	if (document.getElementById('Textarea').style.display == 'none') {
		FCKeditorAPI.GetInstance('DataFCKeditor').EditorDocument.body.innerHTML='';
		FCKeditorAPI.GetInstance('DataFCKeditor').EditorDocument.body.focus();
	} else {
		document.getElementById('DataTextarea').value='';
		document.getElementById('DataTextarea').focus();
	}
	with(document){
		getElementById('caption').value='';
		getElementById('title').value='';
		getElementById('author').value='';
		getElementById('number').value='';
	}
	select_menu_item("published",0);
	select_menu_item("hidetitle",0);
	select_menu_item("levels",0);
	select_menu_item("isreply",0);
}




var isopen = false;
function clicknode(treeid,categoryid,categoryname){
	$categoryid = -1;
	if(treeid==0){
		if(isopen){
			d.closeAll();
			isopen = false;
		}else{
			d.openAll();
			isopen = true;
		}
	}else{
		d.o(treeid);
	}
}
function clickleaf(treeid,categoryid,categoryname){
	$categoryid = categoryid;
}



function save_article(){
	if ($categoryid == -1) { alert('请选择类别!'); return; }
	var title = getElementValue("title"); if (title.trim() == "") { alert('标题不得为空!'); return; }
	var number = getElementValue("number");
	var caption = getElementValue("caption");
	var author = getElementValue("author");
	var content = getElementValue("DataTextarea");
	$.post(
		'./action/edit.php',
		{
			func: 'save_article',
			articleid: $articleid,
			categoryid: $categoryid,
			number: $('#number').val(),
			caption: $('#caption').val(),
			title: $('#title').val(),
			author: $('#author').val(),
			content: content
		},
		function(back){
			eval("json="+back);
			switch(json.msg){
				case "nologin":	alert('您尚未登录,请先登录!'); login(); break;
				case "nopower":	alert('您没有添加此类文章的权限,请与系统管理员联系!'); break;
				case "addOK":
					$articleid = json.articleid; 
					alert('文章添加成功!');
					if(confirm('此文尚未发表,只能从<我的文章>中查看,首页及他人不可见!\n\n现在是否发表?\n')) published(1);
					break;
				case "updateOK":
					alert('文章更新成功!');
					break;
				default: 
					alert('出现未知错误,请与系统管理员联系!');
					break;
			}
		}
	);
}


function getElementValue(id){
	var value;
	var obj = document.getElementById(id);
	var oType = obj.type;
	if (oType == 'checkbox') {
		return obj.checked;
	} else if (oType == 'text') {
		value = obj.value;
	} else if (oType == 'textarea') {
		if (id == "DataTextarea") {
			value = document.getElementById('Textarea').style.display == 'none' ? 
					FCKeditorAPI.GetInstance('DataFCKeditor').EditorDocument.body.innerHTML.replace("/_upload/cwc/","../_upload/cwc/") : 
					obj.value.replace(/\r\n|\n/g,'<br/>');
		}
	}
//	value = value.replace(/&/g,"%26");	//POST时,需将&转换成%26,不必转换回来,否则无法正确区分键值对。
	return value;
}


/*******************************************************************/







/****************　在光标插入处添加文字:开始 ****************/
function setCaret(textObj){
	if (textObj.createTextRange) {			//for ie
		textObj.caretPos = document.selection.createRange().duplicate();
	}
}


function insertAtCaret(textObj, textFeildValue){
	if(document.all){
		if(textObj.createTextRange && textObj.caretPos){
			var caretPos = textObj.caretPos;
			caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == ' ' ? textFeildValue + ' ' : textFeildValue;
		}else{
//			textObj.value = textFeildValue;
		}
	}else{
		if(textObj.setSelectionRange){
			var rangeStart = textObj.selectionStart;
			var rangeEnd = textObj.selectionEnd;
			var tempStr1 = textObj.value.substring(0,rangeStart);
			var tempStr2 = textObj.value.substring(rangeEnd);
			textObj.value = tempStr1 + textFeildValue + tempStr2;
		}else{
			alert("This version of Mozilla based browser does not support setSelectionRange");
		}
	}
//	alert(document.body.innerHTML)
}

function insert_value(value){
	if (document.getElementById('Textarea').style.display == 'none') {	// for FCKeditor
		FCKeditorAPI.GetInstance('DataFCKeditor').InsertHtml(value);
	} else {															// for TXTeditor
		insertAtCaret(document.getElementById('DataTextarea'), value);
	}
}


function selectTXT(){
	var textObj = document.getElementById('DataTextarea');
	if (textObj.createTextRange) {			//for ie
		textObj.caretPos = document.selection.createRange().duplicate();
		return textObj.caretPos.text.trim();
	} else if (textObj.setSelectionRange){	//for firefox
		var rangeStart = textObj.selectionStart;
		var rangeEnd = textObj.selectionEnd;
		var rangeText = textObj.value.substring(0, rangeEnd).substring(rangeStart);
		return rangeText.trim();
	}
}
/****************　在光标插入处添加文字:结束 ****************/

function center(){
	var value = "<p style='text-align:center;'>"+selectTXT()+"</p>";
	insert_value(value);
}

function heiti(){
	var value = "<b>"+selectTXT()+"</b>";
	insert_value(value);
}

function center_heiti(){
	var value = "<p style='text-align:center;'><b>"+selectTXT()+"</b></p>";
	insert_value(value);
}

function center_heiti_kh(){
	var value = "<br/><p style='text-align:center;'><b>"+selectTXT()+"</b></p>";
	insert_value(value);
}



/****************　FCKeditor:start ****************/
function Toggle() {
	var oEditor;																// Try to get the FCKeditor instance, if available.
	if ( typeof( FCKeditorAPI ) != 'undefined' ) oEditor = FCKeditorAPI.GetInstance('DataFCKeditor');
	
	var eTextareaDiv	= document.getElementById('Textarea');					// Get the _Textarea and _FCKeditor DIVs.
	var eFCKeditorDiv	= document.getElementById('FCKeditor');
	
	if ( eTextareaDiv.style.display != 'none' ) {								// If the _Textarea DIV is visible, switch to FCKeditor.
		if ( !oEditor ) { CreateEditor(); }										// If it is the first time, create the editor.
		else {
			var txt = document.getElementById('DataTextarea').value.replace("../_upload/cwc/","/_upload/cwc/")
			oEditor.SetData( txt );	//原版 Set the current text in the textarea to the editor.
//			oEditor.EditorDocument.body.innerHTML = document.getElementById('DataTextarea').value; //为了可以focus() 但src href 会自动加上主机名,不可用相对路径了
		}
		if ( oEditor && !document.all ) {										// This is a hack for Gecko 1.0.x ... it stops editing when the editor is hidden.
			if ( oEditor.EditMode == FCK_EDITMODE_WYSIWYG )
				oEditor.MakeEditable() ;
		}		
		eTextareaDiv.style.display = 'none' ;									// Switch the DIVs display.
		eFCKeditorDiv.style.display = '' ;
//		oEditor.EditorDocument.body.focus();				//for ie			//只能用oEditor.EditorDocument.body.innerHTML = ；不可用oEditor.SetData();
	} else {
		
		document.getElementById('DataTextarea').value = oEditor.GetXHTML().replace("/_upload/cwc/","../_upload/cwc/") ;	// Set the textarea value to the editor value.
		eTextareaDiv.style.display = '' ;										// Switch the DIVs display.
		eFCKeditorDiv.style.display = 'none' ;
		document.getElementById('DataTextarea').focus();
	}
}

function CreateEditor(width, height, toolbarset)
{
	// Copy the value of the current textarea, to the textarea that will be used by the editor.
	document.getElementById('DataFCKeditor').value = document.getElementById('DataTextarea').value;	//.replace(/[\r]/g,'<br>');

	// Automatically calculates the editor base path based on the _samples directory.
	// This is usefull only for these samples. A real application should use something like this:
	// oFCKeditor.BasePath = '/fckeditor/' ;	// '/fckeditor/' is the default value.
	// var sBasePath = document.location.pathname.substring(0,document.location.pathname.lastIndexOf('_samples')) ;
	var sBasePath = document.location.pathname;
	var fileName = sBasePath.substring(sBasePath.lastIndexOf('/') + 1);
	sBasePath = sBasePath.substring(0, sBasePath.indexOf('/cwc'));
	sBasePath += '/_include/fckeditor/';
	
	// Create an instance of FCKeditor (using the target textarea as the name).
	var oFCKeditor = new FCKeditor( 'DataFCKeditor' );
	oFCKeditor.BasePath = sBasePath ;
	oFCKeditor.Width = width ? width : 611;
	oFCKeditor.Height = height ? height : 414;
	oFCKeditor.ToolbarSet = toolbarset ? toolbarset : 'cwc';
	oFCKeditor.Config['ImageUpload'] = false;
	oFCKeditor.ReplaceTextarea() ;	
}
/****************　FCKeditor:end ****************/





function upload(){	//上传附件
	if (document.getElementById('Textarea').style.display != 'none') {
		document.getElementById('DataTextarea').focus();	//没有此句,回传值时,位置不对,在<body>中,没在<textarea>中。
	}
	if ($articleid == -1) {
		alert('尚未添加文章!\n\n先添加文章,再上传附件!');
	}
	openWindow('upload.html?articleid='+$articleid, 700, 420, 'location=no');
}


function refreshHomePage(){
	var width = 260;
	var height = 180;
	var left = screen.width/2 - width/2;
	var top = screen.height/2 - height*0.618;
	var newwin = window.open('index_refresh.php','','width='+width+'px, height='+height+'px, left='+left+', top='+top+', location=no');
}


/****************** 隐藏标题/显示标题 *************************/
function hidetitle(bool){
	if($articleid == -1) {alert("请先添加文章,再隐藏标题!"); return;}
	$.get('./action/edit.php',
		{
			func:		'hidetitle',
			articleid:	$articleid,
			hidetitle:	bool
		},
		function(back){
			select_menu_item('hidetitle',bool);
			if(back==1){
				alert('首页不显示此文标题!');
			}else{
				alert('首页显示此文标题!');
			}
			if(confirm('现在是否更新首页?')) refreshHomePage();
		}
	);
	
}

/****************** 发表文章/取消发表 *************************/
function published(bool){
	if ($articleid == -1) {alert("请先添加文章,再审核发表!"); return;}
	$.get('./action/edit.php',
		{
			func:		'published',
			articleid:	$articleid,
			published:	bool
		},
		function(back){
			select_menu_item('published', bool);
			if(back==1){
				alert('文章已成功发表!');
			}else{
				alert('文章已取消发表!');
			}
			if(confirm('现在是否更新首页?')) refreshHomePage();
		}
	);
}


/****************** 设置可否回复 *************************/
function isreply(bool){
	if($articleid == -1) {alert("请先添加文章,设置阅读权限!"); return;}
	$.post('./action/edit.php',
		{
			func:		'isreply',
			articleid:	$articleid,
			isreply:	bool
		},
		function(back){
			select_menu_item('isreply',bool);
			if(back==1){
				alert('此文可回复!');
			}else{
				alert('此文不可回复!');
			}
		}
	);
}


/****************** 设置阅读权限 *************************/
function set_readlevel(index){
	if($articleid == -1) {alert("请先添加文章,设置阅读权限!"); return;}
	$.post('./action/edit.php',
		{
			func:		'set_readlevel',
			articleid:	$articleid,
			readlevel:	index
		},
		function(back){
			if(back>=0){
				select_menu_item('levels', index);
				alert('阅读权限已设置成功!');
			}
		}
	);
}








function browse(){
	if($articleid==-1){
		alert("请先添加文章,再预览!")
	}else{
		open("browse.php?id="+$articleid);
	}
}






//-->





function menuFix() {
	var sfEls = document.getElementById("nav").getElementsByTagName("li");
	for (var i=0; i<sfEls.length; i++) {
		sfEls[i].onmouseover=function() {
			this.className+=(this.className.length>0? " ": "") + "sfhover";
		}
		sfEls[i].onMouseDown=function() {
			this.className+=(this.className.length>0? " ": "") + "sfhover";
		}
		sfEls[i].onMouseUp=function() {
			this.className+=(this.className.length>0? " ": "") + "sfhover";
		}
		sfEls[i].onmouseout=function() {
			this.className=this.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
		}
	}
}


function select_menu_item(name,index){
	var objs = document.getElementsByName(name);
	for(var i=0; i<objs.length; i++){
		objs[i].className = "";
	}
	objs[index].className = 'jsset';
}









var $hidetitle = false;
var $readlevel = 0;
var $editor = 0;	//0:TXT文本编辑器  1:TXT源码编辑器  2:FCK在线编辑器

function select_editor(index){
	select_menu_item("editors", index);
	var editor_old = $editor;
	$editor = index;
	if (editor_old==0 && $editor==1) {
		var obj = document.getElementById("DataTextarea");
		obj.value = encode(obj.value, "txt->htm");
	} else if (editor_old==0 && $editor==2) {
		var obj = document.getElementById("DataTextarea");
		obj.value = encode(obj.value, "txt->htm");
		Toggle();
	} else if (editor_old==1 && $editor==0) {
		var obj = document.getElementById("DataTextarea");
		obj.value = encode(obj.value, "htm->txt");
	} else if (editor_old==1 && $editor==2) {
		Toggle();
	} else if (editor_old==2 && $editor==0) {
		Toggle();
		var obj = document.getElementById("DataTextarea");
		obj.value = encode(obj.value, "htm->txt");
	} else if (editor_old==2 && $editor==1) {
		Toggle();
	}
	
}



function encode(val, alt){
	if (alt=="txt->htm"){
		val = val.replace(/&/g,'&amp;').replace(/\"/g,'&quot;');
		val = val.replace(/</g,'&lt;').replace(/>/g,'&gt;');
		val = val.replace(/ /g,'&nbsp;');
		val = val.replace(/(\r\n)|\n/g,'<br \/>');  		//ie:\r\n  ff:\n
	} else if (alt=="htm->txt"){
		val = val.replace(/(\r\n)|\n/g,'');
		val = val.replace(/<br>|<br\/>/ig,'<br \/>');		//规范<br />
		val = val.replace(/<br \/>/ig,'\n');
		val = val.replace(/&amp;/g,'&').replace(/&quot;/g,'"');
		val = val.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
		val = val.replace(/&nbsp;/g,' ');
		val = val.replace(/&ldquo;/g,'“').replace(/&rdquo;/g,'”');
		val = val.replace(/&middot;/g,'·')
	}
	return val;
}




function spaceOperate(flag){
//	alert($editor)

	if ($editor!=0) {alert("此操作只能在'TXT文本编辑器'中使用!"); return;}
		var obj = document.getElementById("DataTextarea");
		var value = obj.value;
		switch(flag){
			case 'delHalf': val = confirm('将删除所有半角空格,是否继续?'); if(!val) return;  value = value.replace(/ /g,''); break;	//删除全部半角
			case 'delWhole': value = value.replace(/　/g,''); break;//删除全部全角
			case 'delRowHalf': value = value.replace(/^ /g,''); value = value.replace(/\n /g,'\n'); break;//删除段首半角
			case 'delRowWhole': value = value.replace(/^　/g,''); value = value.replace(/\n　/g,'\n'); break;//删除段首全角
			case 'bIndentH': value = value.replace(/\n/g,'\n '); value = ' ' + value; break;//增加段首半角
			case 'bIndentW': value = value.replace(/\n/g,'\n　'); value = '　' + value; break;//增加段首全角
			
			case 'halfWhole': value = value.replace(/ /g,'　'); break;//半角转全角
			case 'wholeHalf': value = value.replace(/　/g,' '); break;//全角转半角
			case 'cloneHalf': value = value.replace(/ /g,'  '); break;//克隆半角
			case 'cloneWhole': value = value.replace(/　/g,'　　'); break;//克隆全角
			case 'uniteHalf': value = value.replace(/  /g,' '); break;//合并半角
			case 'uniteWhole': value = value.replace(/　　/g,'　'); break;//合并全角
			
			case 'nTo0': val = confirm('将删除所有回车,是否继续?'); if(!val) return; value = value.replace(/[\r\n]+/g,''); break;//删除所有回车
			case 'nTo1': value = value.replace(/[\r\n]+/g,'\n'); break;//删除所有空行
			case 'nTo2': value = value.replace(/[\r\n]+/g,'\n\n'); break;
			case 'nTo3': value = value.replace(/[\r\n]+/g,'\n\n\n'); break;
			case 'nTo4': value = value.replace(/[\r\n]+/g,'\n\n\n\n'); break;
		}
		obj.value = value;
}


function login(){
	openWindow('login.html', 260, 180, 'location=no');
}

