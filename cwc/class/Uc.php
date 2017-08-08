<?php

class Uc{
	
	private $pgsql;
	private $tablename = 'c_uc';
	
	public $userid;
	public $categoryid;
	
	function __construct(&$pgsql=null) {
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function hasrow($uid, $cids) {
		$sql = "SELECT count(*) FROM $this->tablename WHERE userid=$uid  AND categoryid IN ($cids)";
		if ($this->pgsql->fetchVal($sql)) {
			return true;
		} else {
			return false;
		}
	}
	
	function getByUidCid($uid, $cid){
		$sql = "SELECT * FROM $this->tablename WHERE userid=$uid  AND categoryid=$cid";
		return $this->pgsql->fetchRow($sql);
	}
	
	function add($uid, $cid){
		$sql = "INSERT INTO $this->tablename (userid, categoryid) VALUES ($uid, $cid)";
		return $this->pgsql->query($sql);
	}
	
	function delete($uid){
		$sql = "DELETE FROM $this->tablename WHERE userid=$uid";
		return $this->pgsql->query($sql);
	}
	
}