<?php
    date_default_timezone_set('PRC');
    
 //   error_reporting(E_ALL);
 //   ini_set('display_errors', '1');

    
	function __autoload($class_name) {
	    include_once("../class/$class_name.php");
	}

	$ReturnValue = call_user_func($_REQUEST['fn']);
	
	if(is_array($ReturnValue)) {
		die(json_encode($ReturnValue));	//将数组解析为字符串
	} else {
		die($ReturnValue);
	}
	

?>