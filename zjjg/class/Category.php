<?php

class Category{
	
	private $db;
	private $table = 'zj_category';
	public $escape = true;
	
	public $cid = -1;
	public $cname = '';
	public $odr = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->cname = pg_escape_string($this->cname);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY odr,cid";
		return $this->db->query_all($sql);
	}
	
	
}
?>