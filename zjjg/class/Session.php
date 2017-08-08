<?php
date_default_timezone_set("PRC");
class Session {
	private $table = "zj_session";
	private $life = 10;
	private $db;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
		$this->life = 1440;// get_cfg_var("session.gc_maxlifetime");	//1440秒
//		session_module_name("user");
//		ini_set("session.save_handler", "user");
		session_set_save_handler(
			array(&$this, "open"),
			array(&$this, "close"),
			array(&$this, "read"),
			array(&$this, "write"),
			array(&$this, "destroy"),
			array(&$this, "gc")
		);
		session_start();
	}
	
	function open($save_path, $session_name){
		return $this->gc();
	}
	
	function close(){
		return false;
	}
	
	function read($key){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "SELECT val FROM $this->table WHERE sessionid='$key' AND logintime>'$time'";
		return $this->db->query_value($sql);
	}
	
	function write($key, $val){
		$val = pg_escape_string($val);
		$sql = "SELECT zj_session_update('$key', '$val') AS result";
		return $this->db->query_first($sql);
	}
	
	function destroy($key){
		$sql = "DELETE FROM $this->table WHERE sessionid='$key'";
		return $this->db->query($sql);
	}
	
	function gc(){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "DELETE FROM $this->table WHERE logintime<'$time'";
		return $this->db->query($sql);
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY sid ASC";
		return $this->db->query_all($sql);
	}
}
?>