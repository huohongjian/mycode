var myEditor, DOC={}, _id = R.url()._id || 'kong';


function tip(msg) {
	$('#options').hide();
	$('.message div:eq(1)').html(msg);
	$('.message:first').toggle();
	setTimeout(function(){
		$('.message:first').toggle('slow');
		$('#options').show('slow');
	}, 1000);
}


function saveArticle() {

	var category = $('#categoryName').text();
	if (category == '类别') {
		tip('请选择类别!')
		return false;
	}

	var title = $('#data-title').val();
	if (title == '') {
		tip('请添加标题!')
		return false;
	}

	$.post("/user/save", {
		_id: 		_id,
		title:  	title,
		category: 	category,
		content: 	myEditor.getMarkdown(),
		tags: 		$('#data-tags').val().trim().replace(/^　|　$/, ''),
		abstract: 	$('#data-abstract').val(),
		state: 		$("input[name='data-state']:checked").val(),
		recommend: 	$("input[name='data-recommend']").is(":checked") //$('input[name=recommend]:checked').val() || false,	
	}, function(result){
		if (result.state == 200) {
			_id = result._id;
		}
		$('.message div:eq(1)').html(result.msg);
		var obj = $('.message:first').show();
		setTimeout(function(){
			obj.toggle('slow');
		}, 800);
	})
	return true;  
}





$.get('/user/getArtForEdit/'+_id, function(r) {
	var doc = r.article;
	
	myEditor = editormd("myEditormd", {
		"markdown": doc.content,
		syncScrolling: "single",
		path: "/plugins/editormd/lib/",
		// saveHTMLToTextarea : true,
		// emoji       : true,
	 	// taskList    : true,
	 	// tex         : true,  // 默认不解析
	 	// flowChart   : true,  // 默认不解析
		// imageUpload : true,
	 	// imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
	 	// imageUploadURL : "/upload/image",
	 	fullscreen: true,
		toolbarIcons: function() {
			return [
				"home", "new", "save", "|", 
				"search", "undo", "redo", "|",
            	"bold", "del", "italic", "quote", "|", //"ucwords", "uppercase", "lowercase", "|", 
        		"h3", "h4", "h5", "list-ul", "list-ol", "|",
        		"link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "|",
        		"preview",  "watch", "help", "info", "|",
        		"options"
    		];
		},
 		toolbarIconsClass : {
   	 		save: "fa-save",
   	 		home: "fa-home",
   	 		new: "fa-file-text-o"
		},
		toolbarIconTexts: {
			options: "<span id='categoryName'>类别</span>",
		},
	 	// 自定义工具栏按钮的事件处理
		toolbarHandlers : {
			options: function(){
				this.executePlugin("optDialog", "opt-dialog/opt-dialog");
			},
			home: function(){
				window.location.href='/'
			},
			new : function(){
				window.location.href='/edit.html'
			},
	    	save: function(cm, icon, cursor, selection){
	    		saveArticle()
	    	}
		},
		onload : function() {
	        $('#categoryName').text(doc.category);

	        this.executePlugin("optDialog", "opt-dialog/opt-dialog")
	        
			window.optDialogInitFunction = function(){
				//** 添加类别
				addCats(r.categories.categories);
				addCats(r.myCats || []);

				//** 初始化数据
				$('#data-title').val(doc.title);
				$('#data-tags').val(doc.tags.join(' '));
				$('#data-abstract').val(doc.abstract);
				$("input[name='data-recommend']").attr("checked",doc.recommend);
				$("input[name='data-state'][value='"+doc.state+"']").attr("checked",'checked');
				$("#data-categories li:contains('"+doc.category+"')").addClass('selected');
			
				/* 添加类别点击事件 */
				$('#data-categories li').click(function() {
					var oldCat = $('#categoryName').text();
			        $("#data-categories li:contains("+oldCat+")").removeClass('selected');
			        $(this).addClass('selected');

			        $('#categoryName').text( this.textContent );
			    });
			}
	
	    },


	});
});



function addCats(cats) {
	cats.forEach(function(c) {
		var li = R.ce('LI');
		li.innerHTML = c;
		R('#data-categories').appendChild(li);
	});
}


