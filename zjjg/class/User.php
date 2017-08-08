<?php

class User{
	
	private $db;
	private $table = 'zj_user';
	public $escape = true;
	
	public $uid = 0;
	public $uname = '';
	public $upassword = '';
	public $realname = '';
	public $corid = -1;
	public $telephone = '';
	public $mobile = '';
	public $ip = '';
	public $email = '';
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->uname = pg_escape_string($this->uname);
			$this->upassword = pg_escape_string($this->upassword);
			$this->realname = pg_escape_string($this->realname);
			$this->telephone = pg_escape_string($this->telephone);
			$this->mobile = pg_escape_string($this->mobile);
			$this->ip = pg_escape_string($this->ip);
			$this->email = pg_escape_string($this->email);
		}else{
			$this->escape = true;
		}
	}
	
	
	function add(){
	}
	
	function updateInfo(){
		$this->escape();
		$sql = "UPDATE $this->table SET 
					uname	= '$this->uname',
					corid	= $this->corid,
					telephone = '$this->telephone',
					mobile	= '$this->mobile',
					ip		= '$this->ip',
					email	= '$this->email'
				WHERE uid = $this->uid";
		return $this->db->query($sql);
	}
	
	function updatePswd(){
		$this->escape();
		$sql = "UPDATE $this->table SET 
					upassword = '$this->upassword'
				WHERE uid = $this->uid";
		return $this->db->query($sql);
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY corid,uid";
		return $this->db->query_all($sql);
	}
	
	function getByNamePwd($name, $pwd){
		$sql = "SELECT * FROM $this->table WHERE uname='$name' AND upassword='$pwd'";
		return $this->db->query_first($sql);
	}
	
	function getByid($uid){
		$sql = "SELECT a.*, b.corname, b.aliasname
				FROM $this->table a
				LEFT JOIN zj_corporation b ON b.corid=a.corid
				WHERE a.uid=$uid";
		return $this->db->query_first($sql);
	}
	
	
}
?>