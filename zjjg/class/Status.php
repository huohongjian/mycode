<?php

class Status {
	
	private $db;
	private $table = 'zj_status';
	public $escape = true;
	
	public $sid = -1;
	public $scode = '';
	public $sname = '';
	public $app_writable = false;
	public $rep_writable = false;
	public $color = '';
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->scode = pg_escape_string($this->scode);
			$this->sname = pg_escape_string($this->sname);
			$this->color = pg_escape_string($this->color);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY sid";
		return $this->db->query_all($sql);
	}
	
	function getValue($sid){
		$sql = "SELECT sname FROM $this->table WHERE sid=$sid";
		return $this->db->query_value($sql);
	}
	
}
?>