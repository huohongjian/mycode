<?php
error_reporting(7);

class MySQL {
//	private $configFileName = "./config/dbset.php";	
	public $host = "localhost";
	public $user = "root";
	public $password = "";
	public $dbname = "report";
	public $tblprefix = "r_";
	public $usepconnect = false;
	public $connectionid = 0;
	public $querycount = 0;
	
	function __construct($useDefautSet=true){
		if ($useDefautSet) {
			$this->Connect();
			$this->SelectDB();
			mysql_query("set names utf8");
		}
	}
	
	function __destruct(){
		@mysql_close();
	}
	
	function __GET($property_name){
		if (isset($this->$property_name)) return $this->$property_name;			
		else return null;
	}
	
	function __SET($property_name, $value){
		$this->$property_name = $value;
	}
	
	function Connect(){
		if ($this->usepconnect) {
			$this->connectionid = mysql_pconnect($this->host, $this->user, $this->password) or die(mysql_error());
		}
		else {
			$this->connectionid = mysql_connect($this->host, $this->user, $this->password) or die(mysql_error());
		}		
	}
	
	function SelectDB(){
		mysql_select_db($this->dbname, $this->connectionid) or die(mysql_error());
	}
	
	function Close(){
		@mysql_close($this->connectionid);
	}	

	function Query($sql){
		if (empty($this->connectionid)) die("Please select database first!");
		$sql = $this->tblprefix == "r_" ? $sql : str_replace("r_", $this->tblprefix);
		$result = mysql_query($sql, $this->connectionid);
		$this->querycount++;
		return $result;
	}
	
	function FetchRow($result){
		if (empty($result)) return false;
		return mysql_fetch_row($result);	
	}

	/**
	 * Enter description here...
	 *
	 * @param queryResult $result
	 * @return array
	 */
	function FetchArray($result){
		if (empty($result)) return false;
		return mysql_fetch_array($result);
	}

	function FetchObject($result){
		if (empty($result)) return false;
		return mysql_fetch_object($result);
	}
	
	/**
	 * Get those rows from sql sentence.
	 *
	 * @param string $sql
	 * @param boolean $hasFieldName
	 * @return array
	 */
	function getRows($sql, $hasFieldName=false){
		$rows = array();
		$result = $this->Query($sql);
		if (empty($result)) return false;
				
		$i = 0;
		if ($hasFieldName){
			while ($row = mysql_fetch_array($result)) {
				$rows[$i++] = $row;
			}
		} else {
			while ($row = mysql_fetch_row($result)) {
				$rows[$i++] = $row;
			}
		}
		return $rows;
	}
	
	function getFirstRow($sql){
		$pos = strpos(strtoupper($sql), "LIMIT");
		if (empty($pos)) {
			if (strspn(";", $sql)) $sql = str_replace(";", " LIMIT 0, 1", $sql);
			else $sql .= " LIMIT 0, 1";
		}
		$result = $this->Query($sql);
		if (empty($result)) return false;
		return mysql_fetch_array($result);
	}
	
	function getNumFields($sql){
		if (empty($sql)) die("please type the sql content!");
		$result = $this->Query($sql);
		if (empty($result)) return false;
		return mysql_num_fields($result);
	}
	
	function getNumRows($sql){
		if (empty($sql)) die("please type the sql content!");
		$result = $this->Query($sql);
		if (empty($result)) return false;
		return mysql_num_rows($result);
	}
	
	function getAffectedRows($sql){
		if (empty($sql)) die("please type the sql content!");
		$this->Query($sql);
		return mysql_affected_rows($this->connectionid);
	}
	
	function getInsertid($sql){
		if (empty($sql)) die("please type the sql content!");
		$this->Query($sql);
		return mysql_insert_id($this->connectionid);
	}
}
?>