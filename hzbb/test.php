<?php 
function __autoload($class) {
    include_once("class/$class.php");
}
    $v = true==='true';
    print_r($v);

//结果  abc
    
?>