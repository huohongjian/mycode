<?php
	header("Content-Type: text/html; charset=utf-8");
	error_reporting(7);
	
	function __autoload($class_name) {include_once("../class/".$class_name.".php");}
	
	$db = new PostgreSQL();
//	$session = new Session($db);
//	if($_SESSION['uid']!=1) die("你没有权限!");
	
	$i = 1;
	$f = "install.first.sql";
	echo "$i.$f<br>";
	$fh = fopen($f, "rb");
	$fsize = filesize($f);
	$fcontent = fread($fh, $fsize);
	fclose($fh);
	$fcontent = str_replace("\r", "\n", $fcontent);
	$db->query($fcontent);
	
	$res = opendir("sql//");
	while ($filen = readdir($res)) {
		if($filen=="." || $filen=="..") continue;
		$i++;
		echo "$i.$filen<br>";
		
		$fcontent = '';
		$fhandle = fopen("sql//$filen", "rb");
		while (!feof($fhandle)) { 
			$fcontent .= fread($fhandle, 4096); //4096B
		}
		fclose($fhandle);
		$fcontent = str_replace("\r", "\n", $fcontent);
		$db->query($fcontent);
	}
	closedir($res);
	
	
	
	die("create table ok!");

?>