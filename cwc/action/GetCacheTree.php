<?php
	function __autoload($classname) {include_once("../class/{$classname}.php");}
	
	$cache = new Cache();
	$cacheid = $_GET['cacheid'];
	if (empty($cacheid)) $cacheid = "category_tree";
	echo $cache->GetValue($cacheid);
	exit();
?>