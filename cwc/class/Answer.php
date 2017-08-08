<?php

class Answer {
	private $pgsql;
	private $tablename = 'c_answer';
	
	public $answerid;
	public $articleid;
	public $userid;
	public $isanonymous;
	public $posttime;
	public $agree;
	public $oppose;
	public $content;
	
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function escape_string(){
	    if ( !get_magic_quotes_gpc() ){
			$this->content = pg_escape_string($this->content);
		}
	}

	function add(){
		$this->escape_string();
		$sql = "INSERT INTO   $this->tablename (
		              articleid, userid, isanonymous, content )
		        VALUES (
		              $this->articleid, $this->userid, $this->isanonymous, '$this->content' )
		        RETRUNING answerid";
		$this->answerid = $this->pgsql->fetchVal($sql);
		return $this->answerid;
	}
	
	function update(){
		$this->escape_string();
		$sql = "UPDATE $this->tablename SET 
					isanonymous    = $this->isanonymous,
					content	       = '$this->content' 
				WHERE answerid = $this->answerid";
		return $this->pgsql->query($sql);
	}
	
	function delete($answerid){
		$sql = "DELETE FROM $this->tablename WHERE answerid=$answerid";
		return $this->pgsql->query($sql);
	}
	
	function agreePlus($answerid){
		$sql = "UPDATE $this->tablename SET agree=agree+1 WHERE answerid=$answerid";
		return $this->pgsql->query($sql);
	}
	
	function opposePlus($answerid){
		$sql = "UPDATE $this->tablename SET oppose=oppose+1 WHERE answerid=$answerid";
		return $this->pgsql->query($sql);
	}
	
	function getInfo($answerid){
		$sql = "SELECT * FROM $this->tablename WHERE answerid=$answerid";
		$row = $this->pgsql->fetchRow($sql);
		if($row){
			$this->articleid	= $row['articleid'];
			$this->userid		= $row['userid'];
			$this->isanonymous	= $row['isanonymous'];
			$this->posttime		= $row['posttime'];
			$this->agree		= $row['agree'];
			$this->oppose		= $row['oppose'];
			$this->content		= $row['content'];
			return true;
		}else{
			return false;
		}
	}
	
	function getByArticleid($articleid, $limit){
		if(!empty($limit)) $limit = "LIMIT $limit";
		$sql = "SELECT a.*, b.username 
				FROM $this->tablename AS a 
				LEFT JOIN c_user AS b ON b.userid=a.userid 
				WHERE a.articleid=$articleid ORDER BY a.answerid DESC $limit";
		return $this->pgsql->fetchAll($sql);
	}
	
	function getRowsNum($articleid){
		$sql = "SELECT count(*) FROM $this->tablename WHERE articleid=$articleid";
		return $this->pgsql->fetchVal($sql);
	}
	
	function getUserid($answerid){
		$sql = "SELECT userid FROM $this->tablename WHERE answerid=$answerid";
		return $this->pgsql->fetchVal($sql);
	}
	
	
	
}
	
?>