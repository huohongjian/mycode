<?php

    header("Content-Type: text/html; charset=utf-8");
    error_reporting(7);
    
    function __autoload($class){
        include_once("../class/$class.php");
    }
    
    
    
//    die('请修改我,否则无法重建!');
    
    
    $pgsql = PgSQL::getInstance();
    
    /*
    $session = new Session();
    if($session->read('usergroupid') != 1)  {
        die("你没有此权限!");
    }
    */
    
    $i = 0;
/*    $f = "install.pgsql";
    echo "$i.$f<br>";
    $fh = fopen($f, "rb");
    $fsize = filesize($f);
    $fcontent = fread($fh, $fsize);
    fclose($fh);
    $fcontent = str_replace("\r", "\n", $fcontent);
//    echo str_replace("\n", "<br />", $fcontent);
    $pgsql->query($fcontent);
  */  
    
//    die('要安装./sql/下的文件,请屏蔽本行！');
    
    echo '正在安装./sql/下的文件...<br>';
    $res = opendir("sql//");
    while ($filen = readdir($res)) {
        if($filen=="." || $filen==".." || substr($filen, 0, 1)=="_") continue;
        $i++;
        echo "$i.$filen<br>";
    
        $fcontent = '';
        $fhandle = fopen("sql//$filen", "rb");
        while (!feof($fhandle)) {
            $fcontent .= fread($fhandle, 4096); //4096B
        }
        fclose($fhandle);
        $fcontent = str_replace("\r", "\n", $fcontent);
        $pgsql->query($fcontent);
    }
    closedir($res);
    
    
    
    die("create table ok!");
    


?>
