<?php
date_default_timezone_set("PRC");

class Session {
	private $table = "c_session";
	private $life = 60 * 24;       // get_cfg_var("session.gc_maxlifetime");
	private $pgsql;
	
	function __construct($db=null){
		$this->pgsql = $db ? $db : new PgSQL();
		session_module_name("user");
		session_set_save_handler( array($this, "open"),
			                      array($this, "close"),
                        	      array($this, "read"),
                        		  array($this, "write"),
                        		  array($this, "destroy"),
                        		  array($this, "gc"));
		session_start();
	}
	
	function open($save_path, $session_name){
		return true;
	}
	
	function close(){
	    $this->gc();
		return true;
	}
	
	function read($key){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "SELECT val FROM $this->table WHERE sessionid='$key' AND logintime>'$time'";
		return $this->pgsql->fetchVal($sql);
	}
	
	function write($key, $val){
	    $val = pg_escape_string($val);
		$sql = "SELECT c_session_update ('$key', '$val')";
		$db = new PgSQL();
//		echo $db->fetchVal($sql);
		$this->pgsql->query($sql);
	}
	
	function destroy($key){
		$sql = "DELETE FROM $this->table WHERE sessionid='$key'";
		return $this->pgsql->query($sql);
	}
	
	function gc(){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "DELETE FROM $this->table WHERE logintime<'$time'";
//		return $this->pgsql->query($sql);
	}
	
	function getAll(){
		$sql = "SELECT * FROM $this->table ORDER BY sid ASC";
		return $this->pgsql->queryAll($sql);
	}
}


?>