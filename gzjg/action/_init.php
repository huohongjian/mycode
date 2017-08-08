<?php
	function __autoload($class_name){include_once("../class/$class_name.php");}
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back))
		die(json_encode($back));	//将数组解析为字符串
	else
		die("$back");
?>