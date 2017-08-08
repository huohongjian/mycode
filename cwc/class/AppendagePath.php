<?php

class AppendagePath {
	private $pgsql;
	private $tablename = 'c_appendage_path';
	
	public $pathid;
	public $name;
	
	public $limit;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function escape_string(){
	    if ( !get_magic_quotes_gpc() ){
	        $this->name = pg_escape_string($this->name);
	    }
	}
	
	
	function getsAll(){
		$sql = "SELECT * FROM $this->tablename ORDER BY pathid ASC";
		if (!empty($this->limit)) $sql .= " LIMIT $this->limit";
		return $this->pgsql->fetchAll($sql);
	}
	
	function getNameById($id){
		$sql = "SELECT name FROM $this->tablename WHERE pathid=$id";
		return $this->pgsql->fetchVal($sql);
	}
	
}
?>