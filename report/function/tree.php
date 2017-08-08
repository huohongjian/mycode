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

/****************���²�����ʹ��*************************/
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
array index 0~9 ÿ10��Ϊһ��������λ,����ֱ�����.
0:��־  1:text  2:hint  3:status  4:img1  5:img2  6:type  7:script  8:link  9:target
��־����:
0:Ŀ¼	2:�ļ�	-1:��һ����ʼ	 1:��������,������һ��	 5:ȫ������	ע:�ж�С��-1���ж��ٸ�1
type����: 3:����  4:�ű�
***********************************************************************************/

?>