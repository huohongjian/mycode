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
			"id" 		: 1082,
			"categoryid": -1,
			"title"		: "",
			"caption"	: "",
			"author"	: "",
			"number"	: "",
			"content"	: "[标题]： <br />[作者]： <br />[文号]： <hr id='seperator' /><br />"
	}


var editor;
KindEditor.lang({
    save : '保存'
});
KindEditor.plugin('save', function(K) {
	var self = this, name = 'save';
	self.clickToolbar(name, function() {
		alert(editor.html());
	});
});






KindEditor.ready(function(K) {
	
	editor = K.create('textarea[name="content"]', {
		newlineTag		 : "br",
		allowFileManager : true,
		items : ['save', 'source', 'preview', '|', 'undo', 'redo', '|', 
		         'cut', 'copy', 'paste', 'plainpaste', 'wordpaste', '|', 
		         'selectall', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
		         'insertorderedlist', 'insertunorderedlist',
		         'indent', 'outdent', 'subscript', 'superscript', 
		         'fontname', 'fontsize', 'forcolor', 'hilitecolor', 
		         'bold', 'italic', 'underline', 'strikethrough', 'removeformat', 
		         'table', 'hr', 'emoricons', 'link', 'unlink', 'fullscreen', 
		         'print', 'code', 'lineheight', 'clearhtml', 'pagebreak']
	});
	
	
	if (article.id === -1) {
		editor.html(article.content);
	} else {
		K.ajax("action/edit.php", function(data) {
			getArticle(data);
		}, 'POST', {
			"func"		: "getInfo",
			"articleid"	: article.id
		});
	}
	
	
});


function getArticle(json){
	switch(json.msg){
		case 'nologin': 
			if (confirm('您尚未登录!\n\n现在是否登录?')) {
				login();
			}
			break;
		case 'nopower': 
			alert('您没有修改此文权限,请与此文添加者联系!');
			break;
		case 'article':
			content = "[标题]： " + json.title 	+ "<br />"
					+ "[作者]： " + json.author	+ "<br />"
					+ "[文号]： " + json.number	+ "<br />"
					+ "<hr id='seperator' /><br />" + json.content;
			editor.html(content);
			article.categoryid 	= parseInt(json.categoryid);
			
			break;
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
