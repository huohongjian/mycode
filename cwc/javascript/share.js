/******** readme ********


**************************/

load_file("css/share.css");
load_file("../_include/encrypt/md5.js");


var Div = {
	path:'./',
	
	header : function(){
		var jsHeader = "\
		<div id='peak'><ul>\
			<li style='width:70px;'><a id='homepage' href='javascript:sethomepage()'>设为首页</a></li>\
			<li style='width:70px;'><a id='help' href='javascript:constructiong()'>使用帮助</a></li>\
			<li style='padding-left:30px;'>用户名：</li>\
			<li><input type='text' id='UserName' onkeypress='loginEnter(this,event)'/></li>\
			<li style='padding-left:15px;'>密码：</li>\
			<li><input type='password' id='UserPwd' onkeypress='loginEnter(this,event)'/></li>\
			<li style='width:30px; padding-left:15px;'><a href='javascript:login()'>登录</a></li>\
			<li style='width:30px;'><a href='./register.html'>注册</a></li>\
			<li id='timer'><span id='date'></span> (<span id='wday' style='color:red'></span>)<span id='time'></span></li>\
		</ul></div>\
		<div id='title_image'></div>\
		<div id='navigation'>\
			<ul style='padding-right:8px; float:right;'>\
				<li><a href='./'>首页</a></li>\
				<li><a href='httP://10.16.0.201' style='color:yellow;'>用友软件</a></li>\
                <li><a href='httP://10.3.9.14' style='color:yellow;'>管控平台</a></li>\
                <li><a href='../ajax_im/' style='color:yellow;'>在线交流</a></li>\
				<li><a href='browse.php?id=8';>数据下载</a></li>\
				<li><a href='browse.php?id=9'>软件下载</a></li>\
				<li><a href='browse.php?id=10'>联系方式</a></li>\
				<li><a href='list.html'>文章查询</a></li>\
				<li><a href='myarticle.html'>我的文章</a></li>\
				<li><a href='edit.html'>添加文章</a></li>\
			</ul>\
			<STRONG style='margin-left:8px;'>导航:</STRONG>\
		</div>";
		document.write(jsHeader);
	},
	
	footer : function(){
		var jsFooter = "\
			<div id='footer'></div>\
			<div style='margin:5px; text-align:center; clear:both;'>\
				关于我们 －\
				版权声明 －\
				联系我们 －\
				<a href='/cwc/admin/'>系统管理</a> -\
				<a href='javascript:refreshHomePage()'>更新首页</a>\
			</div>\
			<div style='text-align:center; clear:both;'>\
				Copyright <span style='font-family:Arial;'>&copy;</span> 2016-2020 All Rights Reserved\
				<br/>\
			</div>\
			";
		document.write(jsFooter);
	}
}

$(function(){	//===$(document).ready(function() {
	$.ajax(
	{
		url:		"./action/gettime.php?randnum=" + Math.random(),
		dataType:	'json',
		success:	gettime_back
	});
}
)
function gettime_back(json){
	showtime(json.hours, json.minutes, json.seconds);
	var wd = ['日','一','二','三','四','五','六'];
	var html = "时间："+json.year+"年"+json.mon+"月"+json.mday+"日";
	$("#date").html(html);
	$("#wday").html(wd[json.wday]);
}
function showtime(h, m, s){
	s++;
	if (s==60) {m+=1;s=0;};
	if (m==60) {h+=1;m=0;};
	if (h==24) {h=0;};
	hstr = h < 10 ? ' 0'+h : ' '+h;
	istr = m < 10 ? ':0'+m : ':'+m;
	sstr = s < 10 ? ':0'+s : ':'+s;
	$('#time').html(hstr+istr+sstr);
	setTimeout(function(){showtime(h,m,s)},1000);
}


function login(){
	var oUserName = document.getElementById('UserName');
	var oUserPwd = document.getElementById('UserPwd');
	var username = oUserName.value.replace(/&/g,"%26");
	var password = oUserPwd.value.replace(/&/g,"%26");
	if(username==''){alert('请输入用户名!'); oUserPwd.value=''; oUserName.focus(); return;}
	if(password==''){alert('请输入密码!'); oUserPwd.focus(); return;}
	$.post("action/login.php",
	{
		usr:	username,
		pwd:	hex_md5(password)
	},
	function(data){
		$('#UserPwd').val('');
		if(data=="1"){
			alert('登录成功');
			if(window.location.href.indexOf('login.html')!=-1) window.close();
			$('#UserPwd').blur();
		}else{
			alert('用户名与密码不正确,请重新登录!');
			$('#UserName').focus();
		}
	}
	);
}
	
function loginEnter(obj,e){
    var e=(typeof event!='undefined')?window.event:e;// IE : Moz
    if(e.keyCode==13){
    	var id = obj.getAttribute('id');
    	if (id=='UserName') document.getElementById('UserPwd').focus();
    	if (id=='UserPwd') login();
        return true;
    }
}



function constructiong(){
	alert('正在建设中...');
}

function refreshHomePage(){
	var width = 260;
	var height = 180;
	var left = screen.width/2 - width/2;
	var top = screen.height/2 - height*0.618;
	var newwin = window.open('index_refresh.php','','width='+width+'px, height='+height+'px, left='+left+', top='+top+', location=no');
}

/*************** 若页中有两个及以上PageBar,则每次调之前先指定pageBarId ********************************/
var PageBar = {
	pages: 1,	//总页数
	page: 1,	//当前页数
	rows: 0,	//总记录数
	row: 10,	//每页记录数
	pageBarId : "page_bar",
	
	Html: function(id){
		if(typeof(id)!='undefined') this.pageBarId = id;
		
		var jsPages = "\
						<div id='"+this.pageBarId+"' class='page_bar'>\
							第<span onclick='PageBar.SetPage()' style='padding:5px; cursor:pointer;'>1</span>页\
							<span style='padding:5px;'>/</span>\
							共<span onclick='PageBar.SetPage(4)' style='padding:5px; cursor:pointer;'>1</span>页\
							<input type='text' id='pageX'/>\
							<a href='javascript:PageBar.SetPage(0)' style='margin-left:0px;'>Go</a>\
							<a href='javascript:PageBar.SetPage(1)'>首页</a>\
							<a href='javascript:PageBar.SetPage(2)'>上一页</a>\
							<a href='javascript:PageBar.SetPage(3)'>下一页</a>\
							<a href='javascript:PageBar.SetPage(4)'>末页</a>\
						</div>";
		return jsPages;
	},
	
	SetPage: function(index){
		switch (index){
			case 0:
					var o = document.getElementById('pageX')
					var x = o.value;
					o.value = '';
					if(isNaN(x)){alert("输入的字符不是数字,请重新输入!"); o.value = ''; return;}
					if(x<1 || x>this.pages){ alert("请输入[1,"+this.pages+"]之间的数字!"); o.focus(); return; }
					this.page = parseInt(x);
					break;
			case 1: if(this.page==1) return; this.page = 1; break;
			case 2: this.page -= 1; break;
			case 3: this.page += 1; break;
			case 4: if(this.page==this.pages) return; this.page = this.pages; break;
		}
		if(this.page>this.pages) {this.page=this.pages; return;}
		if(this.page<1) {this.page=1; return;}
		var objs = document.getElementById(this.pageBarId).getElementsByTagName('span');
		objs[0].innerHTML = this.page;
		setpagedo(this.page);
		
	},
	
	CalculatePages: function(rows, row){
		if(typeof(rows)!='undefined') this.rows = rows;
		if(typeof(row)!='undefined') this.row = row;
		if(isNaN(this.rows)) this.rows = 0;
		this.pages = Math.round(this.rows/this.row + 0.49);
		if(this.pages<1) this.pages=1;
		var objs = document.getElementById(this.pageBarId).getElementsByTagName('span');
		objs[0].innerHTML = this.page = 1;
		objs[2].innerHTML = this.pages;
		return this.pages;
	}
}
/*********************************************************************************/




function sethomepage(){
	var URL = "http://10.16.0.129/cwc/";
	if (document.all) {
		homepage.style.behavior='url(#default#homepage)';
		homepage.sethomepage(URL);
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		}  
		catch (e) {
			alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage',URL);
	}
}




//居中打开窗口
function openWindow(url, width, height, state){
	var left = screen.width/2 - width/2;
	var top = screen.height/2 - height*0.618;
	window.open(url,'','width='+width+'px, height='+height+'px, left='+left+', top='+top + ',' + state);
}




//动态加载外部文件
function load_file(filename){
	var ft = filename.substring(filename.lastIndexOf("."));
	if (ft==".js"){ //判断文件类型 
	  var tag = document.createElement('script')
	  tag.setAttribute("type","text/javascript")
	  tag.setAttribute("src", filename)
	} else if (ft==".css"){
	  var tag = document.createElement("link") 
	  tag.setAttribute("rel", "stylesheet") 
	  tag.setAttribute("type", "text/css")  
	  tag.setAttribute("href", filename) 
	} 
	if (typeof tag!="undefined") 
	  document.getElementsByTagName("head")[0].appendChild(tag);
}

//获取地址栏参数值
String.prototype.getQuery = function(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = this.substr(this.indexOf("\?")+1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}

//去除字符串左右空格
String.prototype.trim = function(){ return this.replace(/(^\s+)|\s+$|^　+|　+$/g,""); }
//String.prototype.trim = function(){ return this.replace(/(^\s+)|\s+$/g,""); }

//获取元素值
function getValue(id, type){
	var value;
	if(type=='radio'){	//id值指定name
		var objs = document.getElementsByName(id);
		for(i=0; i<objs.length; i++){
			if(objs[i].checked){ value = objs[i].value; }
		}
	}else{
		var obj = document.getElementById(id);
		switch(obj.type){
			case 'text': value = obj.value; break;
			case 'password': value = obj.value; break;
			case 'textarea': value = obj.value; break;
			case 'select-one': value = obj.value; break;
			case 'checkbox': return obj.checked; break;
			default:
				if(obj.tagName=='SPAN') value = obj.innerHTML; break;
				if(obj.tagName=='DIV') value = obj.innerHTML; break;
		}
	}
	value = value.replace(/&/g,"%26");	//POST时,需将&转换成%26,不必转换回来,否则无法正确区分键值对。
	return value;
}

function setValue(id, value, type){
	if(typeof(value)=='undefined') value='';
	if(type=='radio'){
		var objs = document.getElementsByName(id);
		for(i=0; i<objs.length; i++){
			if(objs[i].value == value){
				objs[i].checked=true;
				return;
			}
		}
	}else{
		var obj = document.getElementById(id);
		var tag = obj.tagName;
		if(tag=='DIV' || tag=='SPAN'){
			obj.innerHTML = value;
		}
		else if(tag=='SELECT' || tag=='TEXTAREA'){
			obj.value = value;
		}
		else if(tag=='INPUT'){
			if(obj.type=='checkbox') obj.checked = value;
			else obj.value = value;
		}
	}
}

function setFocus(id){
	document.getElementById(id).focus();
}

function getObj(id){
	return document.getElementById(id);
}





/**************************************************************************************************************
	*动态创建表格
*/
var Table = {
	create: function(){
		var table = document.createElement("table");
		
		var thead = document.createElement("thead");
		var tr = document.createElement("tr");
		for(var i=0; i<5; i++){
			var td = document.createElement("td");
			td.innerHTML = i;
			tr.appendChild(td);
		}
		thead.appendChild(tr);
		
		var tbody = document.createElement("tbody");
		for(var j=0; j<5; j++){
			var tr = document.createElement("tr");
			for(var i=0; i<5; i++){
				var td = document.createElement("td");
				td.innerHTML = i;
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		
		table.appendChild(thead);
		table.appendChild(tbody);
		return table;
	}
}







/**************************************************************************************************************
	* XMLHttpRequest Object Pool
	* @author legend <legendsky@hotmail.com> & huohongjian -> add XHR for firefox
	* @link http://www.ugia.cn/?p=85
	* @Copyright www.ugia.cn
	*/ 


var XmlHttpRequest = {
	_objPool: [],
	
	_getInstance: function(){
		for(var i=0; i<this._objPool.length; i++){
			if(this._objPool[i].readyState==0 || this._objPool[i].readyState==4) return this._objPool[i];
		}
		return this._createObj();
	},
	
	_createObj: function(){
		var objXMLHttp = null;
		if(window.ActiveXObject){
			var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
			for(var n = 0; n < MSXML.length; n ++) {
				try{
					objXMLHttp = new ActiveXObject(MSXML[n]);
					break;
				}catch(e){alert(e);}
			}
		}else if(window.XMLHttpRequest){
			objXMLHttp = new XMLHttpRequest();
		}
		// mozilla某些版本没有readyState属性
		if(objXMLHttp.readyState == null){
			objXMLHttp.readyState = 0;
			objXMLHttp.addEventListener("load", function(){
				objXMLHttp.readyState = 4;
				if (typeof objXMLHttp.onreadystatechange == "function"){
					objXMLHttp.onreadystatechange();
				}
			}, false);
		}
		if(objXMLHttp) this._objPool.push(objXMLHttp);
		return objXMLHttp;
	},
　　
	Send: function(method, url, data, callback, returnType){	// 发送请求(方法[post,get], 地址, 数据, 回调函数)
		if(typeof(method)=='undefined' || method=='') method = 'POST';
		if(typeof(callback)=='undefined' || callback=='') callback = this.Success;
		var objXMLHttp = this._getInstance();
		with(objXMLHttp) {
			try {
				// 加随机数防止缓存
				if(url.indexOf("?")>0) url += "&randnum=" + Math.random();
				else url += "?randnum=" + Math.random();
				open(method, url, true);
				// 设定请求编码方式
				setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				send(data);
				onreadystatechange = function(){
					if (objXMLHttp.readyState == 4 && (objXMLHttp.status == 200 || objXMLHttp.status == 304)) {
						if (returnType == 'JSON' || returnType == 'json') {
							callback(eval( "("+objXMLHttp.responseText+")"));
						} else {
							callback(objXMLHttp)
						}
					}
				}
			}catch(e){alert(e);}
		}
	},
	Success: function (obj) {
		eval(obj.responseText);
	}
};


function XHR(method, url, data, callback, returnType){
	//firefox不用连续共用XMLHttp对象,增加setTimeout就可以了.
	setTimeout(function(){XmlHttpRequest.Send(method, url, data, callback, returnType);}, 0);
}
/**************************************************************************************************************/




function XML(){
	
	this.oXML;
	
	this.LoadXmlObject = function(oXml){
		this.oXML = oXml;
	}
	
	this.LoadXmlTxt = function(text){
		if(window.ActiveXObject){
			this.oXML = new ActiveXObject("Microsoft.XMLDOM");
			this.oXML.async = false;
			this.oXML.loadXML(text);
		}else if(document.implementation && document.implementation.createDocument){
			this.oXML = document.implementation.createDocument('', '', null);
			this.oXML.async = false;
			var oParser = new DOMParser();
			this.oXML = oParser.parseFromString(text, "text/xml");
		} else {
			alert("Your browser can not operate xml-data!");
		}
	}

	this.LoadXmlFile = function(filename){
		if(window.ActiveXObject){
			this.oXML = new ActiveXObject("Microsoft.XMLDOM");
			this.oXML.async = false;
			this.oXML.load(filename);
		}else if(document.implementation && document.implementation.createDocument){
			this.oXML = document.implementation.createDocument('', '', null);
			this.oXML.async = false;
			this.oXML.load(filename);
		} else {
			alert("Your browser can not operate xml-data!");
		}
	}
	
	
	/******************************************************************************/
	this.SelectNode = function(tagName, index){
		index = typeof(index)=='undefined' ? 0 : index;
		var oNode = this.oXML.getElementsByTagName(tagName)[index];
		return oNode;
	}
	
	/******************************************************************************/
	this.GetTextByTagName = function(tagName, index) {
		index = typeof(index)=='undefined' ? 0 : index;
		var oNode = this.oXML.getElementsByTagName(tagName)[index];
		var sText = this.GetTextByNode(oNode);
		return sText;
	}
	
	/******************************************************************************/
	this.GetTextByNode = function(oNode) {
		if(window.ActiveXObject){
			return oNode.text;
		} else if(document.implementation && document.implementation.createDocument) {
			var sText = "";
			for (var i = 0; i < oNode.childNodes.length; i++) {
				if (oNode.childNodes[i].hasChildNodes()) {
					sText += this.GetTextByNode(oNode.childNodes[i]);
				} else {
						sText += oNode.childNodes[i].nodeValue;
				}
			}
			return sText;
		} else {
			return null;
		}
	}
	
	/******************************************************************************/
	this.NodeDeep = function(oNode){
		var deep = -1;
		if(typeof(oNode)=="undefined") return deep;
		if(oNode.hasChildNodes()){
			deep = this.NodeDeep(oNode.firstChild)+1;
		}
		return deep;
	}
	
	/******************************************************************************/
	this.SerializeXML = function(oNode){	//for firefox
		var oSerializer = new XMLSerializer();
		return oSerializer.serializeToString(oNode);
	}
	
	/******************************************************************************/
	this.WriteToTable = function(oNode){
		if(this.NodeDeep(oNode)!=2){
//			alert("The deep of xml-data is not 2, please check the xml-data!");
//			return null;
		}
		
		var table = "<table id='xmlToTable' cellspacing='1' style='background-color:red; width:200px;'>";
		table += "<thead><tr>";
		
		/* tagName as thead */
		var nCols = oNode.childNodes[0].childNodes.length;
		for(i=0; i<nCols; i++){
			table += "<td id='thead_"+i+"' style='background-color:white'>" + oNode.childNodes[0].childNodes[i].tagName + "</td>";
		}
		
		table += "</tr></thead><tbody>";
		
		var oNodeLength = oNode.childNodes.length;
		for(i=0; i<oNodeLength; i++){
			table += "<tr class='r_"+i+"'>";
			var oChildNode = oNode.childNodes[i];
			var oChildNodeLength = oChildNode.childNodes.length;
			for(j=0; j<oChildNodeLength; j++){
				table += "<td id='"+i+"_"+j+"' style='background-color:white'>" + this.GetTextByNode(oChildNode.childNodes[j]) + "</td>";
			}
			table += "</tr>";
		}
		table += "</tbody></table>";
		document.write(table);
	}
}

