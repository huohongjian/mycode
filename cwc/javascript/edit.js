function upload(){	//上传附件
	if (article.articleid == -1) {
		alert('请先添加文章,再上传附件!');
	} else {
		openWindow('upload.html?articleid='+article.articleid, 700, 420, 'location=no');
	}
}


function insertValue(content){
	 tinyMCE.activeEditor.insertContent(content);
}


function selectTXT(){
	return tinymce.activeEditor.selection.getContent();
}










/********************************************************************/


/*获取地址栏参数值*/
function getLocationQuery(location, name){
	if(name==undefined) name='id';
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = location.substr(location.indexOf("\?")+1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}

function getQuery(str, id){
	var r = '';
	try { r = getLocationQuery(str, id).replace(/(<br \/>)*$/,""); }
	catch (e) { }
	return r;
}

function login(){
	openWindow('login.html', 260, 180, 'location=no');
}
//居中打开窗口
function openWindow(url, width, height, state){
	var left = screen.width/2 - width/2;
	var top = screen.height/2 - height*0.618;
	window.open(url,'','width='+width+'px, height='+height+'px, left='+left+', top='+top + ',' + state);
}



article = {
	"articleid" : getLocationQuery(window.location.href) || -1,
	"categoryid": 12,
	"hidetitle"	: 0,
	"published"	: 1,
	"isreply"	: 0
};

function setCategory(id) {
	article.categoryid = id;
	var cats = new Array();
	cats[11] = '公告信息';
	cats[12] = '最新通知';
	cats[13] = '领导讲话';
	cats[14] = '行业文件';
	cats[15] = '行业信息';
	cats[30] = '政策法规';
	cats[50] = '学习交流';
	cats[70] = '电脑知识';
	cats[90] = '网络文摘';
	cats[110] = '软件下载';
	document.getElementById('lbxz').innerHTML= cats[id];
}

function setPublished(i) {
	var arr = new Array();
	arr[0] = '　取消发表';
	arr[1] = '　已经发表';
	article.published = i;
	document.getElementById('sffb').innerHTML= arr[i];
}

function setHideTitle(i) {
	var arr = new Array();
	arr[0] = '　显示标题';
	arr[1] = '　隐藏标题';
	article.hidetitle = i;
	document.getElementById('xsbt').innerHTML= arr[i];
}

function setIsReply(i) {
	var arr = new Array();
	arr[0] = '　不可回复';
	arr[1] = '　可以回复';
	article.isreply = i;
	document.getElementById('kfhf').innerHTML= arr[i];
}

/*******************************************************************************/
tinymce.init({
	selector: 'textarea',
	language: 'zh_CN',
	height: 500,
	forced_root_block : '',		//去掉换行<p>标签
	image_advtab: true,
	menubar: true,
	toolbar_items_size: 'small',
	save_enablewhendirty: false,
	save_onsavecallback: saveArticle, 
//	content_style: "div {margin: 10px 20px; font-size:16px; line-height:25px; letter-spacing:3px;}",

	plugins: 'save charmap print preview hr anchor pagebreak \
			  searchreplace wordcount  visualblocks visualchars \
			  code fullscreen insertdatetime media image nonbreaking table \
			  colorpicker textpattern imagetools code ',
	menu : {
	    file    : {title : 'File'  , items : 'tjwz | scfj print | wzsy llwz | code'},
		edit    : {title : 'Edit'  , items : 'undo redo | cut copy paste pastetext | selectall | searchreplace'},
		insert  : {title : 'Insert', items : 'link image link media | charmap hr anchor pagebreak insertdatetime nonbreaking'},
		view    : {title : 'View'  , items : 'visualblocks visualchars visualaid | preview fullscreen'},
		format  : {title : 'Format', items : 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
		table   : {title : 'Table' , items : 'inserttable tableprops deletetable | cell row column'},
//		tools   : {title : 'Tools' , items : 'wzsy llwz | spellchecker code'},
		property: {title : '属性'   , items : 'fbwz qxfb | xsbt ycbt | kyhf bkhf'},
	    category: {title : '类别',    items : 'ggxx zxtz ldjh xywj xyxx | zcfg xxjl dnzs wlwz rjxz | gdlb'}
	},
    toolbar1: 'save | bold italic | cut copy paste | fontselect | fontsizeselect | \
    		  alignleft aligncenter alignright alignjustify | \
    		  bullist numlist | outdent indent | removeformat',
    

	setup : function(editor) {
		
		editor.addMenuItem('tjwz', { text: '添加文章', context: 'file', onclick: function () { window.location = 'edit.html'; }});
		editor.addMenuItem('wzsy', { text: '网站首页', context: 'file', onclick: function () { open("./"); }});
		editor.addMenuItem('llwz', { text: '浏览文章', context: 'file', onclick: function () { 
			if(article.articleid===-1){
				alert("请先添加文章,再预览!")
			}else{
				open("browse.php?id="+article.articleid);
			}
		}});
	
		editor.addMenuItem('scfj', { text: '上传附件', context: 'file',	  onclick: function () { upload(); }});
		editor.addMenuItem('fbwz', { text: '发表文章', context: 'property', onclick: function () { setPublished(1); }});
		editor.addMenuItem('qxfb', { text: '取消发表', context: 'property', onclick: function () { setPublished(0); }});
		editor.addMenuItem('xsbt', { text: '显示标题', context: 'property', onclick: function () { setHideTitle(0); }});
		editor.addMenuItem('ycbt', { text: '隐藏标题', context: 'property', onclick: function () { setHideTitle(1); }});
		editor.addMenuItem('kyhf', { text: '可以回复', context: 'property', onclick: function () { setIsReply(1); }});
		editor.addMenuItem('bkhf', { text: '不可回复', context: 'property', onclick: function () { setIsReply(0); }});
		
		editor.addMenuItem('ggxx', { text: '公告信息', context: 'category', onclick: function () { setCategory(11); }});
		editor.addMenuItem('zxtz', { text: '最新通知', context: 'category', onclick: function () { setCategory(12); }});
		editor.addMenuItem('ldjh', { text: '领导讲话', context: 'category', onclick: function () { setCategory(13); }});
		editor.addMenuItem('xywj', { text: '行业文件', context: 'category', onclick: function () { setCategory(14); }});
		editor.addMenuItem('xyxx', { text: '行业信息', context: 'category', onclick: function () { setCategory(15); }});
        editor.addMenuItem('zcfg', { text: '政策法规', context: 'category', onclick: function () { setCategory(30); }});
		editor.addMenuItem('xxjl', { text: '学习交流', context: 'category', onclick: function () { setCategory(50); }});
		editor.addMenuItem('dnzs', { text: '电脑知识', context: 'category', onclick: function () { setCategory(70); }});
		editor.addMenuItem('wlwz', { text: '网络文摘', context: 'category', onclick: function () { setCategory(90); }});
		editor.addMenuItem('rjxz', { text: '软件下载', context: 'category', onclick: function () { setCategory(110); }});
		editor.addMenuItem('gdlb', { text: '更多类别', context: 'category', onclick: function () { alert('建设中...'); }});
		
		
		editor.on('init', function() {
			with (this.getDoc().body.style) {
				fontSize 		= '16px';
				lineHeight 		= '25px';
				letterSpacing 	= '3px';
				padding			= '10px 20px';
			}
			
			
			if (article.articleid>0) {
				$.when(ajax('func=getInfo&articleid='+article.articleid))
				 .pipe(function (obj) {
					 if (obj.articleid>0) {
						 return obj;
					 } else {
						 return $.Deferred().reject(obj);
					 }})
				 .done(ajaxGetArticle)
				 .fail(ajaxFail)
				 .always()
			}
			
			setTimeout(timeout, 3);   
	        
	});}
});
	

function timeout() {
	document.getElementById('mceu_40').innerHTML
	= '<span id="wzsx">文章属性：</span>'
	+ '<span id="lbxz">最新通知</span>'
	+ '<span id="sffb">　已经发表</span>'
	+ '<span id="xsbt">　显示标题</span>'
	+ '<span id="kfhf">　不可回复</span>';
    
}

/***************************************************************/

function ajax(data) {
	return $.ajax({
		url 	 : './action/edit.php',
		type	 : 'POST',
		dataType : 'json',
		data	 : data
	})
}

function ajaxGetArticle(obj) {
	var content = '[标题]：' + obj.title  + '<br />' + '[作者]：' + obj.author + '<br />' + '[文号]：' + obj.number + '<hr id="con_G98Z5" />' + obj.content;
	tinymce.activeEditor.setContent(content);
	article.articleid	= obj.articleid;
	setCategory( obj.categoryid );
	setHideTitle( obj.hidetitle );
	setPublished( obj.published );
	setIsReply( obj.isreply );
}

function ajaxFail(obj) {
	switch (obj.articleid) {
		case -1 : if(confirm('您尚未登录!\n\n现在是否登录?')) login(); break;
		case -2 : if(confirm('您没有权限!\n\n现在是否登录?')) login(); break;
		default : alert('未知错误,请与系统管理员联系!');
	}
}

/*** 获取字符串片断 (字符串, 统一分隔符, 标识) ***/
function getStringSlice(str, seperator, id) {
	if (str.indexOf(seperator+id) === -1) {
		return '';
	}
	var myString = str.split(seperator+id)[1];
	var index = myString.indexOf(seperator);
	if (index === -1) {
		return myString.replace(/(<br.*>)$/, '').replace(/(^\s+)|(\s+$)/g,'');	//代替trim();
	} else {
		return myString.substring(0, index).replace(/(<br.*>)$/, '').replace(/(^\s+)|(\s+$)/g,'');
	}
}


function saveArticle() {
	var sep  = '|~!_HHJ_#@_';
	var data = tinyMCE.activeEditor.getContent()
					.replace(/&nbsp;&nbsp;/gi,'　')
					.replace(/&nbsp;/gi,' ')
					.split('<hr id="con_G98Z5" />');
	data[0]  = data[0]
			  .replace('[标题]：',	sep+'title')
			  .replace('[别名]：',	sep+'caption')
			  .replace('[作者]：',	sep+'author')
			  .replace('[文号]：',	sep+'number');

	if (getStringSlice(data[0], sep, "title") == '') {
		alert('请添加文章标题!');
		return false;
	}

	$.ajax({ url 	 : './action/edit.php',
			 type	 : 'POST',
			 dataType: 'json',
			 data	 : { "func"			: "saveArticle",
						 "articleid"	: article.articleid,
						 "categoryid"	: article.categoryid,
						 "title"		: getStringSlice(data[0], sep, "title"),
						 "number"		: getStringSlice(data[0], sep, "number"),
						 "caption"		: getStringSlice(data[0], sep, "caption"),
						 "author"		: getStringSlice(data[0], sep, "author"),
						 "content"		: data[1].replace(/\s+$/,''),						 
						 "hidetitle"	: article.hidetitle,
						 "published"	: article.published,
						 "isreply"		: article.isreply
						},
			success  : function (obj) {
				if (obj.articleid > 0) {
					article.articleid = obj.articleid;
					if (confirm('文章保存成功!　　是否更新首页?\n\n注:标题内容未变更可不用更新首页.')) {
						refreshHomePage();
					}
				} else if (obj.articleid === -1) {
					if(confirm('您尚未登录!\n\n现在是否登录?')) login(); 
				} else if (obj.articleid === -2) {
					if(confirm('您没有权限!\n\n现在是否登录?')) login();
				} else {
					alert('未知错误,请与系统管理员联系!');
				}
				
			}
			
		});
 		
 		

}




