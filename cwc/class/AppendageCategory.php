<?php

class AppendageCategory {
	private $pgsql;
	private $tablename = 'c_appendage_category';
	
	public $categoryid;
	public $name;
	
	public $limit;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function escape_string(){
		if ( !get_magic_quotes_gpc() ){
		    $this->name = addslashes($this->name);
		}
	}
	
	
	function getsAll(){
		$sql = "SELECT * FROM $this->tablename ORDER BY categoryid ASC";
		if (!empty($this->limit)) $sql .= " LIMIT $this->limit";
		return $this->pgsql->fetchAll($sql);
	}
	

	
}
?>