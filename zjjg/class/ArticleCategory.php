<?php

class ArticleCategory{
	
	private $db;
	private $table = 'article.category';
	public $escape = true;
	
	public $catid = 0;
	public $pid = 0;
	public $cname = '';
	public $bname = '';
	public $isdir = 'false';
	public $uid = 0;
	public $pids = '';
	public $frequent = 'false';
	public $odr = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->cname = pg_escape_string($this->cname);
			$this->bname = pg_escape_string($this->bname);
			$this->pids	 = pg_escape_string($this->pids);
		}else{
			$this->escape = true;
		}
	}
	
	function getsByFrequent($frequent){
		$sql = "SELECT * FROM $this->table WHERE frequent=$frequent ORDER BY odr, catid";
		return $this->db->query_all($sql);
	}
	
	
}
?>