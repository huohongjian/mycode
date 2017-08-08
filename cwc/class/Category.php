<?php

class Category{
	
	private $pgsql;
	private $tablename = 'c_category';
	
	public $categoryid;
	public $parentid;
	public $name;
	public $brifname;
	public $isdir;
	public $visible;
	public $userid;
	public $path;
	public $order;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function get_one_byid($categoryid) {
		$sql = "SELECT * FROM $this->tablename WHERE categoryid='$categoryid'";
		$row = $this->pgsql->fetchRow($sql);
		if ($row) {
    		$this->categoryid	=	$row['categoryid'];
    		$this->parentid		=	$row['parentid'];
    		$this->name			=	$row['name'];
    		$this->brifname		=	$row['brifanme'];
    		$this->isdir		=	$row['isdir'];
    		$this->visible		=	$row['visible'];
    		$this->userid		=	$row['userid'];
    		$this->path			=	$row['path'];
    		$this->order		=	$row['order'];
		}
		return $row;
	}
	
	function parents($categoryid) {
		$sql = "SELECT name, path FROM $this->tablename WHERE categoryid=$categoryid";
		$row = $this->pgsql->fetchRow($sql);
		$this->name = $row['name'];
		$path = substr($row['path'],0,-1);
		$sql = "SELECT * FROM $this->tablename WHERE categoryid IN ($path) AND name>'' ORDER BY odr, categoryid";
		$rows = $this->pgsql->fetchAll($sql);
		return $rows;
	}
	
	function children($categoryid) {
		$sql = "SELECT name, path FROM $this->tablename WHERE categoryid='$categoryid'";
		$row = $this->pgsql->fetchRow($sql);
		$this->name = $row[0];
		$path = $row[1].$categoryid.",";
		$sql = "SELECT * FROM $this->tablename WHERE path LIKE '$path%' AND name>'' ORDER BY odr, categoryid";
		$rows = $this->pgsql->fetchAll($sql);
		return $rows;
	}
	
	function getNameById($cateogtyid){
		$sql = "SELECT name FROM $this->tablename WHERE categoryid=$cateogtyid";
		return $this->pgsql->fetchVal($sql);
	}
	
	
	/*
	function GetChildrenIdString($categoryid=1){
		$rows = $this->GetChildren($categoryid);
		$str = "$categoryid,";
		foreach($rows as $row){
			$str .= "$row[0],";
		}
		return $str+"-8";
	}
	
	
	function BuildCache($categoryid=1){
//		$cache = "d = new dTree('d', '../include/dtree/');";
		$this->GetInfo($categoryid);
		$cache .= "d.add($categoryid, -1, '<a href=\"javascript:open_close();\"><b>{$this->name}</b></a>','')";
		$rows = $this->GetChildren($categoryid);
		foreach ($rows as $row){
			if($row[4]=='y'){
				$js .= "d.add({$row['categoryid']}, {$row['parentid']}, '{$row['name']}', '');";
			}else{
				$js .= "d.add($row[0], $row[1],'$row[2]','javascript:set_categoryid($row[0])')";
			}
		}
		return $cache;
	}
	*/
	function create_file_jstree($categoryid) {
		$filename = "../cache/category_tree.js";
		$sql = "SELECT name FROM $this->tablename WHERE categoryid=$categoryid";
		$name = $this->pgsql->fetchVal($sql);
		$rows = $this->children($categoryid);
		$js =  "function create_tree(obj) {
				d = new dTree('d', '../_include/dtree/');\n
				d.add($categoryid, -1, '$name', 'javascript:clicknode(0,$categoryid,\'$name\')');\n";
		$treeid = 0;
		foreach ($rows as $row) {
			$treeid++;
			if ($row['isdir']=='y') $js .= "d.add($row[categoryid], $row[parentid], '$row[name]', 'javascript:clicknode($treeid,$row[categoryid],\'$row[name]\')');\n";
			else $js .= "d.add($row[categoryid], $row[parentid], '$row[name]', 'javascript:clickleaf($treeid,$row[categoryid],\'$row[name]\')');\n";
		}
		$js .= "obj.innerHTML = d;\n
				d.openTo(10, false);\n
			//	d.openTo(20, false);\n
				}";
		echo $js;
		$fp = fopen($filename, "w");
		if (fwrite($fp, $js)) {
			fclose($fp);
			return true;
		}
		return false;
	}
	
	
	
}
?>