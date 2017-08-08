<?php
/*************************************
global $mysql = new MySQL();
**************************************/

function GetTreeFromGategory ($parentid = 0) {
	global $mysql;
	static $mystring = "";
	static $lastdepth = -1;

	$sql = "select `categoryid`,`parentid`,`name`,`brifname`,`isdir`,`path` from ma_category where `parentid`=$parentid order by `order`;";
	$result = $mysql->Query($sql);
	while ($row = mysql_fetch_row($result)) {
		$treedepth = strlen(ereg_replace("[0-9]", "", $row[5]));
		if ($lastdepth == -1) {$lastdepth = $treedepth;}
		$balance = $treedepth - $lastdepth;	
		$lastdepth = $treedepth;	
		$mystring .= AlterLevel($balance);
		
		if ($row[4] == 'y') {
			$mystring .= "0,'$row[2]','','','','',3,'','http://www.sohu.com','_blank',";
			GetTreeFromGategory($row[0]);   //recursion
		} else {
			$mystring .= "2,'$row[2]','','','','',3,'','http://www.google.cn','_blank',";
		}		
	}
	return $mystring;
}

/****************以下不建议使用*************************/
function GetTreeInfo($parentid = 0){
	global $mysql;
	static $mystring = "";
	static $lastdepth = -1;

	$sql = "select `categoryid`,`parentid`,`name`,`brifname`,`isdir`,`path` from ma_category where `parentid`=$parentid order by `order`;";
	$myrows = $mysql->getRows($sql);
	foreach ($myrows as $row){
		$treedepth = strlen(ereg_replace("[0-9]", "", $row[5]));
		if ($lastdepth == -1) {$lastdepth = $treedepth;}
		$balance = $treedepth - $lastdepth;	
		$lastdepth = $treedepth;	
		$mystring .= AlterLevel($balance);
		
		if ($row[4] == 'y') {
			$mystring .= "0,'$row[2]','','','','',3,'','http://www.sohu.com','_blank',";
			GetTreeInfo($row[0]);   //recursion
		} else {
			$mystring .= "2,'$row[2]','','','','',3,'','http://www.google.cn','_blank',";
		}
	}
	return $mystring;
}
		
function AlterLevel($balance = 0){
	$val = "";
	while ($balance > 0) {
		$balance --;
		$val = "-1,'','','','','','','','','',";
	}		
	while ($balance < 0) {
		$balance ++ ;
		$val .= "1,'','','','','','','','','',";
	}
	return $val;
}


function ExpandString($level = 0) {
	$str = "";
	if ($level < 0) {
		$str = "tree.expandAll();";
	} else {
		for ($i=0; $i<=$level; $i++) {
			$str .= "tree.expand($i,true);";
		}
	}
	return $str;
}

/**********************************************************************************
array index 0~9 每10个为一个完整单位,含义分别如下.
0:标志  1:text  2:hint  3:status  4:img1  5:img2  6:type  7:script  8:link  9:target
标志含义:
0:目录	2:文件	-1:下一级开始	 1:本级结束,返回上一级	 5:全部结束	注:有多小个-1就有多少个1
type含义: 3:链接  4:脚本
***********************************************************************************/

?>