<?php
date_default_timezone_set("PRC");

class Session {
    
    private $pgsql;
	private $life = 60 * 240;
	private $sessionid;
	
	function __construct($pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
		$this->gc();
		
		session_start();
		$this->sessionid = session_id();
//		$this->sessionid = getallheaders()['Cookie'];
	}

	
	function read($key=NULL){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql  = "UPDATE c_session SET logintime = current_timestamp WHERE sessionid='$this->sessionid' AND logintime>'$time';
		         SELECT data FROM c_session WHERE sessionid='$this->sessionid' AND logintime>'$time'";
		$data = $this->pgsql->fetchVal($sql);
		$obj  = json_decode($data, TRUE);  //$returnArray=false 返回对象
		if ($key) {
		    return $obj[$key];
		} else {
		    return $obj;
		}
	}
	
	
	function write($json){
	    $json = pg_escape_string($json);
	    $sql  = "SELECT c_session_update ('$this->sessionid', '$json')";
	    return $this->pgsql->fetchVal($sql);
	}
	
	
	function gc(){
		$time = date("Y-m-d H:i:s", time()-$this->life);
		$sql = "DELETE FROM c_session WHERE logintime<'$time'";
		$this->pgsql->query($sql);
	}
	
	
	function getAllSession(){
		$sql = "SELECT * FROM c_session ORDER BY sid ASC";
		return $this->pgsql->queryAll($sql);
	}
}


?>