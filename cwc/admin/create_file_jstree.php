<?php
	function __autoload($classname) {include_once("../class/{$classname}.php");}
	$category = new Category();
	echo $category->create_file_jstree(1);
?>