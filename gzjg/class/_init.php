<?php
	date_default_timezone_set("PRC");
	
	function __autoload($class) { include_once("../class/$class.php"); }
	
	$result = call_user_func($_REQUEST['func']);
	
	if (is_array($result))
		die(json_encode($result));	//将数组解析为字符串
	else
		die("$result");
		
?>