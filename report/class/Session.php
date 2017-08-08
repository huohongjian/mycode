<?php
error_reporting(7);

class Session {
	private $tablename = "ma_session";
	private $sessionLife = 60;
	private $DB;
	
	function __construct(&$DB){
		$this->DB = &$DB;
		$this->sessionLife = get_cfg_var("session.gc_maxlifetime");
//		session_module_name("user");
		ini_set("session.save_handler", "user");
		session_set_save_handler(
			array(&$this, "Open"),
			array(&$this, "Close"),
			array(&$this, "Read"),
			array(&$this, "Write"),
			array(&$this, "Destroy"),
			array(&$this, "Gc")
		);
		session_start();
	}
	
	function Open($savePath, $sessionName){
		$this->Gc(time());
		return true;
	}
	
	function Close(){
		return false;
	}
	
	function Read($key){
		$sql = "SELECT * FROM `$this->tablename` WHERE `sessionid`='{$key}'";
		$session = $this->DB->getFirstRow($sql);
		if (!empty($session) && $session["expiry"] > time()) return $session["value"];
		else return "";
	}
	
	function Write($key, $val){
		$expiry = time() + $this->sessionLife;
		$value = addslashes($val);
		
		$sql = "SELECT `sessionid` FROM `$this->tablename` WHERE `sessionid`='$key'";
		$tmp = $this->DB->getFirstRow($sql);
		
		if (!empty($tmp)) {
			$sql = "UPDATE `$this->tablename` SET `expiry`=$expiry, `value`='$val' WHERE `sessionid`='$key'";
		} else {
			$sql = "INSERT INTO `$this->tablename` VALUES ('$key', $expiry, '$val')";
		}
		return $this->DB->Query($sql);
	}
	
	function Destroy($key){
		$sql = "DELETE FROM `$this->tablename` WHERE `sessionid`='$key'";
		return $this->DB->Query($sql);
	}
	
	function Gc($maxlifetime){
		$sql = "DELETE FROM `$this->tablename` WHERE `expiry`<$maxlifetime";
		return $this->DB->Query($sql);
	}
}
?>