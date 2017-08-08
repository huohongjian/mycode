<?php
	header("Content-Type: text/html; charset=utf-8");
	error_reporting(7);
	
	function __autoload($class_name) {include_once("../class/".$class_name.".php");}
	
	$db = new PostgreSQL();
//	$session = new Session($db);
//	if($_SESSION['uid']!=1) die("你没有权限!");
	
	//echo $DB->link_id;
	$fhandle = fopen("./install.sql","rb");
	$fcontent = '';
	while (!feof($fhandle)) { 
		$fcontent .= fread($fhandle, 4096); //4096B
	}
	fclose($fhandle);
	
	$fcontent = str_replace("\r", "\n", $fcontent);
	
	//echo $fcontent;
	echo $fcontent;
	$db->query($fcontent);
	die("create table ok!!!");
	
	
	
	
	
	
	$sqls = array();
	$i = 0;
	foreach (explode(";\n", trim($fcontent)) as $fcon){
		$temps = explode("\n", trim($fcon));
		foreach ($temps as $tmp){
			$sqls[$i] .= ($tmp[0] == "#" || $tmp[0].$tmp[1] == "--" ? "" : $tmp);
		}
		$i++;
	}
	unset($fcontent);
	unset($fcon);
	unset($temps);
	unset($tmp);
	
	//print_r($sqls);
	
	foreach ($sqls as $sql){
		$sql = trim($sql);
		echo $sql;
		if ($sql) $db->query($sql);
		echo "<br />";
	}
	
	echo "create table ok!!!";


?>