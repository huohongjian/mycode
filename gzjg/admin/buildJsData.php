<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<title>河北省烟草专卖局(公司)资金监管中心</title>
	</head>
	<body>
<?php
	function __autoload($class_name){include_once("../class/$class_name.php");}
	
	function buildOptions($recordset, $field_value, $field_name, $nameWithValue=false){
		$tmp = '';
		foreach ($recordset as $r){
			if($nameWithValue)
				$tmp .= ",{v:'$r[$field_value]', n:'$r[$field_value].$r[$field_name]'}";
			else
				$tmp .= ",{v:'$r[$field_value]', n:'$r[$field_name]'}";
		}
		$tmp = substr($tmp,1);
		return "[$tmp]";
	}
	
	$db = new PostgreSQL();
	
	$filename = "../cache/data.js";
	$jsdata = "var options = {\r\n";
	//单位列表
	$corporation = new Corporation($db);
	$rs = $corporation->getAll();;
	$jsdata .= "cors:".buildOptions($rs, 'corid', 'briefname').",\r\n";
	$jsdata .= "corporations:".buildOptions($rs, 'corid', 'corname').",\r\n";
	//支出类别列表
	$category = new Category($db);
	$rs = $category->getAll();
	$jsdata .= "cats:".buildOptions($rs, 'cid', 'cname').",\r\n";
	$jsdata .= "cats_withid:".buildOptions($rs, 'cid', 'cname', true).",\r\n";
	//申请单状态列表
	$status = new Status($db);
	$jsdata .= "status:".buildOptions($status->getAll(), 'sid', 'sname').",\r\n";
	//结算方式
	$paymode = new Paymode($db);
	$jsdata .= "paymodes:".buildOptions($paymode->getAll(), 'pid', 'pname', true).",\r\n";
	//未达账项类别
	$unchargeupcat = new UnChargeupCat($db);
	$jsdata .= "unchargeupcats_withid:".buildOptions($unchargeupcat->getAll(), 'ucucid', 'cname', true).",\r\n";
	//文章常用类别
	$art_fre_cat = new ArticleCategory($db);
	$jsdata .= "art_fre_cats:".buildOptions($art_fre_cat->getsByFrequent('true'), 'catid', 'cname').",\r\n";
	
	//tmp
	$jsdata .= "unshift_array: function(opts, insertObj){
		opts.unshift(insertObj);	//返回数组个数
		return opts;
	},\r\n";
	
	$jsdata .= "getName: function(opts, value){
		for(var i=0; i<opts.length; i++){
			if(opts[i].v==value) return opts[i].n;
		}
	},\r\n";
	
	$jsdata .= "getValue: function(opts, name){
		for(var i=0; i<opts.length; i++){
			if(opts[i].n==name) return opts[i].v;
		}
	}\r\n";
	
	$jsdata .= "}\r\n\r\n";
	
	
	
	$jsdata .= "var jscode = {
	path : './',
	header : function(){
		return \"\
		<!--div id='peak'><ul>\
			<li style='width:70px;'><a id='homepage' href='javascript:sethomepage()'>设为首页</a></li>\
			<li style='width:70px;'><a id='help' href='javascript:constructiong()'>使用帮助</a></li>\
			<li style='padding-left:30px;'>用户名：</li>\
			<li><input type='text' id='UserName' onkeypress='loginEnter(this,event)'/></li>\
			<li style='padding-left:15px;'>密码：</li>\
			<li><input type='password' id='UserPwd' onkeypress='loginEnter(this,event)'/></li>\
			<li style='width:30px; padding-left:15px;'><a href='javascript:login()'>登录</a></li>\
			<li style='width:30px;'><a href='./register.html'>注册</a></li>\
			<li id='timer'><span id='date'></span> (<span id='wday' style='color:red'></span>)<span id='time'></span></li>\
		</ul></div-->\
		<div id='title_image'></div>\
		<div id='navigation'>\
			<ul style='padding-right:8px; float:right;'>\
				<li><a href='\"+this.path+\"'>首页</a></li>\
				<li><a href='\"+this.path+\"application.html'>额度申请</a></li>\
				<li><a href='\"+this.path+\"payout.html'>支出录入</a></li>\
				<li><a href='\"+this.path+\"budget.html'>预算录入</a></li>\
				<li class='five'><a href='\"+this.path+\"applications.html'>申请单查询</a></li>\
				<li class='five'><a href='\"+this.path+\"account.html'>明细账查询</a></li>\
				<li><a href='\"+this.path+\"ledger.html'>总账查询</a></li>\
				<li><a href='\"+this.path+\"budgetcompare.html'>预算执行</a></li>\
				<li><a href='\"+this.path+\"monthend.html'>月末处理</a></li>\
				<li><a href=\\\"javascript:open_window_center('\"+this.path+\"login.html', 300, 180, 'nolocation')\\\">用户登录</a></li>\
			</ul>\
			<STRONG style='margin-left:8px;'>导航:</STRONG>\
		</div>\";
	},
	
	footer : function(){
		return \"\
			<div id='footer'></div>\
			<div style='margin:5px; text-align:center; clear:both;'>\
				关于我们 －\
				版权声明 －\
				联系我们 －\
				<a href='\"+this.path+\"sjjg.html'>省级监管</a > -\
				<a href='\"+this.path+\"user.html'>用户管理</a> -\
				使用说明\
			</div>\
			<div style='text-align:center; clear:both;'>\
				Copyright <span style='font-family:Arial;'>&copy;</span> 2008-2012 All Rights Reserved\
			</div>\";
	}
}";
	
	
	
	$fp = fopen($filename, "w");
	if (fwrite($fp, $jsdata)) {
		fclose($fp);
	}
	
	echo "<pre>$jsdata</pre>";
?>
	</body>
</html>