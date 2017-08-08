<?php
header("Content-Type: text/html; charset=utf-8");
error_reporting(7);
require_once("../class/MySQL.php");
$DB = new MySQL();

$fcontent = '';
$fp = fopen("./install.sql","rb");
while (!feof($fp)) { 
	$fcontent .= fread($fp, 4096); //4096B
}
//$fcontent = fread($fp,2048000);
fclose($fp);


$fcontent = str_replace("\r", "\n", $fcontent);
$sqls = array();
$i = 0;
$fcons = explode(";\n", trim($fcontent));
foreach ($fcons as $fcon){
	$temps = explode("\n", trim($fcon));
	foreach ($temps as $tmp){
		$n = strpos($tmp, '//');
		if($n>0) $tmp = substr($tmp, 0, $n);
		$sqls[$i] .= ($tmp[0] == "#" || $tmp[0].$tmp[1] == "--" || $tmp[0].$tmp[1] == "//" ? "" : $tmp);
	}
	$i++;
}
unset($fcontent);
unset($fcon);
unset($temps);
unset($tmp);

foreach ($sqls as $sql){
	$sql = trim($sql);
	echo $sql;
	if ($sql) $DB->Query($sql);
	echo "<br />";
	echo $DB->__GET("querycount");
}

echo "create table ok!";


?>