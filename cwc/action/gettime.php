<?php
date_default_timezone_set("PRC");
die(json_encode(getdate()));

$y=date("Y");
$m=date("n");
$d=date("j");
$h=date("G");
$i=date("i");
$s=date("s");

$result = "yy=$y; mm=$m; dd=$d; hh=$h; ii=$i; ss=$s";
die($result);
?>