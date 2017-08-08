<?php

class Corporation{
	
	private $db;
	private $table = 'zj_corporation';
	public $escape = true;
	
	public $corid = -1;
	public $parentid = 0;
	public $haschild = 'false';
	public $corpath = '';
	public $corcode = '-1';
	public $corname = '';
	public $aliasname = '';
	public $briefname = '';
	
	
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->code	 			= pg_escape_string($this->code);
			$this->corporationname	=pg_escape_string($this->corporationname);
			$this->aliasname		=pg_escape_string($this->aliasname);
			$this->briefname		=pg_escape_string($this->briefname);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY corid ASC";
		return $this->db->query_all($sql);
	}
	
	function getByParentid($parentid){
		$sql = "SELECT * FROM $this->table WHERE parentid=$parentid ORDER BY corid ASC";
		return $this->db->query_all($sql);
	}
	
	
}
?>