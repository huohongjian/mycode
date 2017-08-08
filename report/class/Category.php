<?php

class Category{
	private $DB;
	public $categoryid;
	public $parentid;
	public $name;
	public $brifname;
	public $isdir;
	public $visible;
	public $userid;
	public $path;
	public $order;
	
	function __construct(&$mysql=null){
		$this->DB = &$mysql;
		if (empty($this->DB)) $this->DB = new MySQL();
	}
	
	function GetParentArr($categoryid=0){
		$sql = "SELECT `path` FROM `ma_category` WHERE `categoryid`=$categoryid";
		$result = $this->DB->Query($sql);
		if (empty($result)) return null;
		$row = mysql_fetch_row($result);
		$path = substr($row[0],0,-1);

		$sql = "SELECT `categoryid`,`name` FROM `ma_category` WHERE `categoryid` IN ($path) ORDER BY `path`";
		$result = $this->DB->Query($sql);
		while ($row = mysql_fetch_row($result)) {
			$arr[$row[0]] = $row[1];
		}
		return $arr;
	}
	
	function GetChildArr($categoryid=0){
		$sql = "SELECT `path` FROM `ma_category` WHERE `categoryid`='$categoryid'";
		$path = $this->DB->getFirstRow($sql);
		if (empty($path)) return null;
		
		$sql = "SELECT `categoryid`,`name` FROM `ma_category` WHERE `path` LIKE '$path[0]%' ORDER BY `order`,`categoryid`";
		$result = $this->DB->Query($sql);
		while ($row = mysql_fetch_row($result)){
			$arr[$row[0]] = $row[1];
		}
		return $arr;
	}
	
	function GetChildIdStr($categoryid=0){
		$childArr = $this->GetChildArr($categoryid);
		foreach ($childArr as $k => $v){
			$idStr .= "$k,";
		}
		$idStr = substr($idStr, 0, -1);
		return $idStr;
	}
	
}

?>