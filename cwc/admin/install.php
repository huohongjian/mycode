<?php
header("Content-Type: text/html; charset=utf-8");
error_reporting(7);

function __autoload($class){
    include_once("../class/$class.php");
}



die('请修改我,否则无法重建!');


$db = new PgSQL();
$session = new Session($db);
if($session->read('usergroupid') != 1)  {
    die("你没有此权限!");
}


$fcontent = '';
$fhandle = fopen("./cwc1.txt","rb");
while (!feof($fhandle)) { 
	$fcontent .= fread($fhandle, 4096); //4096 B
}
fclose($fhandle);
$fcontent = str_replace("\r", "\n", $fcontent);
echo str_replace("\n", "<br />", $fcontent);


$db->query($fcontent);
die("create table ok!!!");



?>
