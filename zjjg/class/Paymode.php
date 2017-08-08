<?php

class Paymode{
	
	private $db;
	private $table = 'zj_paymode';
	public $escape = true;
	
	public $pid = -1;
	public $pname = '';
	public $odr = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->pname = pg_escape_string($this->pname);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY odr,pid";
		return $this->db->query_all($sql);
	}
	
	
}
?>