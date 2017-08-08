<?php
/*************************************
global $mysql = new MySQL();
**************************************/


/**********************************************************************************
array index 0~9 每10个为一个完整单位,含义分别如下.
0:标志  1:text  2:hint  3:status  4:img1  5:img2  6:type  7:script  8:link  9:target
标志含义:
0:目录	1:文件	-1:下一级开始	 1:本级结束,返回上一级	 5:全部结束	注:有多小个-1就有多少个1
type含义: 3:链接  4:脚本
***********************************************************************************/
function BuildTree($treestring, $expandstring = "tree.expandAll();") {
	$sBasePath = $_SERVER['PHP_SELF'];
	$sBasePath = substr($sBasePath, 0, strpos($sBasePath,"myarticle"));
	$sBasePath .= "myarticle/include/treemaker";
	
	if (empty($treestring)) $treestring = "
		0,'我的网站','','','','',3,'','','',
		-1,'','','','','','','','','',
		0,'综合网站','提示文字','','','',3,'','','',
		-1,'','','','','','','','','',
		2,'sohu','','','','',3,'','http://www.sohu.com','_blank',
		1,'','','','','','','','','',
		2,'搜索引擎','','','','',4,'alert(\"ok!\")','','',
		2,'电脑学习','','','','',4,'alert(new Date())','','',
		1,'','','','','','','','','',";	
	
	echo "
<link rel='stylesheet' href='$sBasePath/_treemaker.css' />
<script type='text/javascript'>
var lineFolder = '$sBasePath/';	//连线文件夹路径 _treeconfig.js调用
var tree_node=new Array({$treestring}5);
</script>
<script type='text/javascript' src='$sBasePath/_treemaker.js'></script>
<script type='text/javascript' src='$sBasePath/_treeconfig.js'></script>
<script type='text/javascript'>$expandstring</script>
";
/*菜单必需逐级展开,且index必须为本级的第一个node_id号*/
}



function GetTreeFromGategory ($parentid = 0) {
	global $mysql;
	static $mystring = "";
	static $lastdepth = -1;

	$sql = "select `categoryid`,`parentid`,`name`,`brifname`,`isdir`,`path` from ma_category where `parentid`=$parentid order by `order`,`categoryid`;";
	$result = $mysql->Query($sql);
	while ($row = mysql_fetch_row($result)) {
		$treedepth = strlen(ereg_replace("[0-9]", "", $row[5]));
		if ($lastdepth == -1) {$lastdepth = $treedepth;}
		$balance = $treedepth - $lastdepth;	
		$lastdepth = $treedepth;	
		$mystring .= alterLevel($balance);
		
		if (empty($row[2])) continue;
		if ($row[4] == 'y') {
			$mystring .= "0,'$row[2]','$row[0]:$row[2]','','','',4,'onClick=setCategoryId(-1)','','',";
			GetTreeFromGategory($row[0]);   //递归recursion
		} else {
			$mystring .= "2,'$row[2]','$row[0]:$row[2]','','','',4,'onClick=setCategoryId($row[0])','','',";
		}
	}
	return $mystring;
}

/****************不推荐使用下面的方法*************************/
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
		$mystring .= alterLevel($balance);
		
		if ($row[4] == 'y') {
			$mystring .= "0,'$row[2]','','','','',3,'','http://www.sohu.com','_blank',";
			GetTreeInfo($row[0]);   //递归recursion
		} else {
			$mystring .= "2,'$row[2]','','','','',3,'','http://www.google.cn','_blank',";
		}
	}
	return $mystring;
}

//private
function alterLevel($balance = 0){  
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


function GetTreeExpandString($level = 0) {
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







?>