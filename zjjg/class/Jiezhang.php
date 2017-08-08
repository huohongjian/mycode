<?php

class Jiezhang{
	
	private $db;
	private $table = 'zj_jiezhang';
	public $escape = true;
	
	public $jzid = 0;
	public $corid = 0;
	public $y = 0;
	public $m = 0;
	public $jzed = 'false';
	public $ymd = '2008-08-01';
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		
	}
	
	function update(){
		$this->escape();
		$sql = "SELECT fzj_jiezhang_update($this->corid, $this->y, $this->m, $this->jzed)";
		return $this->db->query($sql);
	}
	
	
}
?>