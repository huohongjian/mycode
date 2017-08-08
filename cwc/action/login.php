<?php
	function __autoload($class) {
	    include_once("../class/$class.php");
	}
	$user = new User();
	echo $user->register($_REQUEST['usr'], $_REQUEST['pwd']);


?>