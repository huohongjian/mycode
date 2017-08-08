<?php

class Appendage {
	private $pgsql;
	private $tablename = 'c_appendage';
	
	public $appendageid;
	public $categoryid;
	public $pathid;
	public $savename;
	public $filename;
	public $size;
	public $articleid;
	public $userid;
	
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function escape_string(){
	    if ( !get_magic_quotes_gpc() ){
			$this->filename	= pg_escape_string($this->filename);
		}
	}
	
	function add(){
		$this->escape_string();
		$sql = "INSERT INTO $this->tablename (
		              categoryid, pathid, savename, filename, size, articleid, userid )
		        VALUES (
		              $this->categoryid, $this->pathid, '$this->savename', '$this->filename',
		              $this->size, $this->articleid, $this->userid )
		        RETURNING appendageid";
		$this->appendageid = $this->pgsql->fetchVal($sql);
		return $this->appendageid;
	}
	
	function update(){
		$this->escape_string();
		$sql = "UPDATE $this->tablename SET 
					categoryid = $this->categoryid,
					pathid     = $this->pathid,
					savename   = '$this->savename',
					filename   = '$this->filename',
					size       = $this->size,
					articleid  = $this->articleid,
					userid     = $this->userid
				WHERE appendageid=$this->appendageid";
		return $this->pgsql->query($sql);
	}
	
	function getByFilename($filename){
		$sql = "SELECT * FROM $this->tablename WHERE filename='$filename'";
		return $this->pgsql->fetchRow($sql);
	}
	
	function getsAll($limit){
		$sql = "SELECT * FROM $this->tablename ORDER BY appendageid DESC";
		if (!empty($limit)) $sql .= " LIMIT $limit";
		return $this->pgsql->fetchAll($sql);
	}
	
	function getsByUserid($user_id, $limit){
		$sql = "SELECT * FROM $this->tablename WHERE userid=$user_id ORDER BY appendageid DESC";
		if (!empty($limit)) $sql .= " LIMIT $limit";
		return $this->pgsql->fetchAll($sql);
	}
	
	function getsByFilename($filename, $limit){
		$sql = "SELECT * FROM $this->tablename WHERE filename LIKE '%$filename%' ORDER BY appendageid DESC";
		if (!empty($limit)) $sql .= " LIMIT $limit";
		return $this->pgsql->fetchAll($sql);
	}
	
	function getsByFilenameUserid($filename, $userid, $limit){
		$sql = "SELECT * FROM $this->tablename WHERE filename LIKE '%$filename%' AND userid=$userid ORDER BY appendageid DESC";
		if (!empty($limit)) $sql .= " LIMIT $limit";
		return $this->pgsql->fetchAll($sql);
	}
	
}
?>