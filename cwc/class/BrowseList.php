<?php

class BrowseList {
	private $pgsql;
	private $tablename = 'c_browselist';
	
	public $browselistid;
	public $articleid;
	public $ipaddress;
	public $counter;
	public $lasttime;
	public $userid;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function add(){
		if(empty($this->userid)) $this->userid = 0;
		$sql = "INSERT INTO $this->tablename (
		              articleid, ipaddress, counter, userid )
		        VALUES (
		              $this->articleid, '$this->ipaddress', 1, '$this->userid')
		        RETURNING browselistid";
		$this->browselistid = $this->pgsql->fetchVal($sql);
		return $this->browselistid;
	}
	
	function update(){
		$sql = "UPDATE $this->tablename SET 
					counter = counter+1, 
					lasttime = now() 
				WHERE articleid=$this->articleid AND ipaddress='$this->ipaddress'";
		if(!empty($this->userid))
			$sql = str_replace('SET', "SET userid=$this->userid,", $sql);
		return $this->pgsql->query($sql);
	}
	
	function getsByArticleidIpaddress(){
		$sql = "SELECT * FROM $this->tablename WHERE articleid=$this->articleid AND ipaddress='$this->ipaddress'";
		return $this->pgsql->fetchRow($sql);
	}
	
	function add_update(){
		if($this->getsByArticleidIpaddress()){
			$this->update();
		}else{
			$this->add();
		}
	}
	
	function getsByArticleid($articleid){
		$sql = "SELECT * FROM $this->tablename WHERE articleid=$articleid";
		return $this->pgsql->fetchAll($sql);
	}
	
}