<?php

class UnChargeupCat{
	
	private $db;
	private $table = 'zj_unchargeupcat';
	public $escape = true;
	
	public $ucucid = 0;
	public $ccode = '-1';
	public $cname = '';
	public $bname = '';
	public $odr = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->ccode = pg_escape_string($this->ccode);
			$this->cname = pg_escape_string($this->cname);
			$this->bname = pg_escape_string($this->bname);
		}else{
			$this->escape = true;
		}
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY odr,ucucid";
		return $this->db->query_all($sql);
	}
	
	
}
?>