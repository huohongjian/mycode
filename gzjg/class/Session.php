<?php
date_default_timezone_set("PRC");
class Session {
	private $table = "public.session";
	private $life = 10;
	private $db;
	
	public $uid = 0;
	
	function __construct(&$db=null, $with_session_start=true){
		$this->db = $db ? $db : new PostgreSQL();
		$this->life = 1440;// get_cfg_var("session.gc_maxlifetime");	//1440秒
		if ($with_session_start){
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
	}
	
	function open($save_path, $session_name){
		return $this->gc();
	}
	
	function close(){
		return false;
	}
	
	function read($key){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "SELECT val FROM $this->table WHERE sessionid='$key' AND login_time>'$time'";
		return $this->db->query_value($sql);
	}
	
	function write($key, $val){
		$val = pg_escape_string($val);
		$ip = $_SERVER['REMOTE_ADDR'];
		$sql = "SELECT public.session_update('$key', '$val') AS result;";
		$sql .= "UPDATE session SET ip='$ip' where sessionid='$key';";
		$sql .= "UPDATE session SET uid=$this->uid where sessionid='$key'";
		return $this->db->query_first($sql);
	}
	
	function destroy($key){
		$sql = "DELETE FROM $this->table WHERE sessionid='$key'";
		return $this->db->query($sql);
	}
	
	function gc(){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "DELETE FROM $this->table WHERE login_time<'$time'";
		return $this->db->query($sql);
	}
	
	//滞后于$this->write()
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY sesid ASC";
		return $this->db->query_all($sql);
	}
	
	//滞后于$this->write()
	function getOne(){
		if(!session_start()) session_start();
		$id = session_id();
		$sql = "SELECT * FROM $this->table WHERE sessionid='$id'";
		return $this->db->query_first($sql);
	}
	
}
?>