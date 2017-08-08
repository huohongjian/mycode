var attachPanel={}, bookPanel={}, oID = R.id('articleid');

R.enterMove();



function save() {
	if (R('[name=title]').value == '') {
		message('请添加标题!', 1000);
		return false;
	}

	R.post("/user/save", R.fd('#editForm',{
		image: R.id('thumb').src.match(/\/images.*/),
	}), function(r){
		if (r.status == 200) {
			oID.value = r._id;
			R('[name=status]').value = r._st;
		}
		message(r.msg, 1000);
	}, 'JSON');
}

function saveBook() {
	if (bookPanel.panel) {
		bookPanel.show();
	} else {
		R.get('/user/ebooks', function(r) {
			var html = '<select id="booksName">';
			for(var i=0; i<r.length; i++){
				html += '<option value="' + r[i]._id + '">' + r[i].title + '</option>';
			}
			html += '</select><button onclick="saveBookNext()">确定</button>';
			bookPanel = new Panel({
				id: 'ebook',
				width: 300,
				height: 200,
				title: '选择电子书',
				html: html,
			});
		}, 'JSON');
	}
}
function saveBookNext(){
	bookPanel.hide();

	var id = oID.value,
		title = R('input[name=title]').value;
	if (id=='') {
		message('请先保存，再添加至电子书', 1000);
	} else if (title=='') {
		message('标题不能为空', 1000);
	} else {
		R.post('/user/appendToBook', {
			bookid: R.id('booksName').value,
			appendContent: '\r\n['+ title + '](#doc/' + id + ')',
		}, function(r) {
			message(r, 1000);
		});
		if (R('[name=status]').value!='7') {
			message('"状态"建议选择"雪藏"', 2000);
		}
	}
}


function uploadAttach() {
	alert('hi')
}




function replace(reg, text) {
	sInput = R('textarea[name=content]');
	var content = sInput.value,
		rangeStart = sInput.selectionStart,
    	rangeEnd = sInput.selectionEnd;
    if (rangeEnd>rangeStart) {
    	sInput.value = content.substring(0, rangeStart)
    				 + content.substring(rangeStart, rangeEnd).replace(reg, text)
    				 + content.substring(rangeEnd);
    } else {
    	sInput.value = content.replace(reg, text);
    }

}
function insert(sText) {
	insertChar(R('textarea[name=content]'), sText);
	return false;
}

/* 
 * 向表单中插入字符 
 * @param HTMLObject sInput 输入框DOM对象 
 * @param string sText 要插入的字符 
 * @return void 
*/  
function insertChar(sInput,sText)  
{  
    if(document.all)  
    {  
        if(sInput.createTextRange && sInput.caretPos)  
        {  
            var caretPos = sInput.caretPos;  
            caretPos.text = caretPos.text.charAt(caretPos.text.length -1) == '' ? sText + '':sText;  
        }  
        else{sInput.value += sText}  
    }  
    else  
    {  
        if(sInput.setSelectionRange)  
        {  
            var rangeStart = sInput.selectionStart,
            	rangeEnd = sInput.selectionEnd;  
            sInput.value = sInput.value.substring(0,rangeStart) + sText + sInput.value.substring(rangeEnd);  
            //处理连续插入 这个是重点  
            sInput.focus();  
            var l = sText.length;  
            sInput.setSelectionRange(rangeStart + l , rangeStart + l);  
            sInput.blur();  
        }  
        else{sInput.value += sText}  
    }
	sInput.focus();
}

// addEventListener to header > i
(function(header) {

	function more(){
		var h = header.clientHeight;
		header.style.height = h<45 ? '60px' : '30px';
		R.id('editForm').style.marginTop = h<45 ? '75px' : '45px';
	}

	function showAttach() {
		if (attachPanel.panel) {
			attachPanel.show();
		} else {
			attachPanel = new Panel({
				width: 390,
				background: '#fff',
				title: '上传附件',
				html: '\
					<input type="file" id="attach">\
					<button onclick="uploadAttach()">确定</button>\
					<button onclick="attachPanel.hide()">取消</button>',
			});
		}
	}

	var os = R.all('i,a', header),
		es = {
		'更多'			: more,
		'保存'			: save,
		'上传附件'		: showAttach,
		'添加至电子书'	: saveBook,
		'预览': function(){window.open('/details/' + oID.value + '/')},
		'新建': function(){window.location='/user/edit/'},
		'图片': function(){window.open('/user/gimp')},
		'表格': function(){insert('|  |  |\n|---|---|\n|  |  |\n|  |  |\n')},
		'缩进': function(){replace(/\n/g, '\n　');replace(/\n[ 　]+\n/g, '\n\n')},
		'伸出': function(){replace(/\n　/g, '\n')},

		'3号标题': function(){insert('### ')},
		'4号标题': function(){insert('#### ')},
		'5号标题': function(){insert('##### ')},
		'合并段间空行'	:function(){replace(/\n\n/g, '\n')},
		'段间插入空行'	:function(){replace(/\n/g, '\n\n')},
		'插入全角空格'	:function(){insert('　')},
		'插入4个空格'	:function(){insert('    ')},
		'半角空格转全角':function(){replace(/ /g, '　')},
		'全角空格转半角':function(){replace(/　/g, ' ')},
		'合并全角空格'	:function(){replace(/　　/g, '　')},
		'合并半角空格'	:function(){replace(/  /g, ' ')},
		'插入字符#'	:function(){insert('#')},
		'插入字符*'	:function(){insert('*')},
		'插入字符-'	:function(){insert('-')},
		'插入字符`'	:function(){insert('`')},
		'插入字符|'	:function(){insert('|')},
	};
	for(var i=0; i<os.length; i++) {
		os[i].addEventListener('click', es[os[i].title], false);
	}



	R.id('thumb').addEventListener('click', function() {
		window.open('/user/gimp?isThumb=true');
	}, false);


})(R('header'));


function getTitle(){
	getValue(R('[name=title]'));
}
function getAbstract(){
	getValue(R('[name=abstract]'));
}
function getValue(o) {
	var c = R('[name=content]');
	if (o.value==='') {
		c.value = c.value.replace(/(.*)\n/, '');
		o.value = RegExp.$1;
	} else {
		c.value = o.value +'\n' + c.value;
		o.value = '';
	}
}