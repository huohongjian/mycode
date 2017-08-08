<?php

class Article {
	private $pgsql;
	private $tablename = 'c_article';
	
	public $articleid = -1;
	public $categoryid = 1;
	public $number = '';
	public $caption = '';
	public $title = '';
	public $author = '';
	public $user_id = 0;	//不可以使用userid, 系统不认userid
	public $posttime;
	public $hidetitle = 0;
	public $published = 0;
	public $readlevel = 0;
	public $counter = 0;
	public $isreply = 0;
	public $answer = 0;
	public $content = '';
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function escape_string () {
		if ( !get_magic_quotes_gpc() ){
			$this->number	= pg_escape_string($this->number);     //不能用pg_escape_string()转义
			$this->caption	= pg_escape_string($this->caption);
			$this->title	= pg_escape_string($this->title);
			$this->author	= pg_escape_string($this->author);
			$this->content	= pg_escape_string($this->content);
		}
	}
	
	function add(){
		$this->escape_string();
		$sql = "INSERT INTO $this->tablename (
		              categoryid,     number,     caption,
		              hidetitle,      published,  isreply,
		              title,          author,     userid,     content )
		        VALUES (
		              $this->categoryid,  '$this->number',    '$this->caption',
		              $this->hidetitle,   $this->published,   $this->isreply,
		              '$this->title',     '$this->author',    $this->user_id,     '$this->content' )
		        RETURNING articleid";
		$this->articleid = $this->pgsql->fetchVal($sql);
		return $this->articleid;
	}
	
	function updateAllColumn(){
		$this->escape_string();
		$sql = "UPDATE $this->tablename SET 
					categoryid = $this->categoryid,
					number     = '$this->number',
					caption    = '$this->caption',
					title      = '$this->title',
					author     = '$this->author',
					userid     = $this->user_id,
					posttime   = '$this->posttime',
					hidetitle  = $this->hidetitle,
					published  = $this->published,
					readlevel  = $this->readlevel,
					counter    = $this->counter,
					isreply    = $this->isreply,
					answer     = $this->answer,
					content    = '$this->content' 
				WHERE articleid = $this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function update(){
		$this->escape_string();
		$sql = "UPDATE $this->tablename SET 
					categoryid = $this->categoryid,
					hidetitle  = $this->hidetitle,
					published  = $this->published,
					isreply    = $this->isreply,
					number     = '$this->number',
					caption    = '$this->caption',
					title      = '$this->title',
					author     = '$this->author',
					content    = '$this->content' 
				WHERE articleid = $this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function delete($articleid){
		$sql = "DELETE FROM $this->tablename WHERE articleid=$articleid";
		return $this->pgsql->query($sql);
	}
	
	function hidetitle(){
		$sql = "UPDATE $this->tablename SET hidetitle=$this->hidetitle WHERE articleid=$this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function published(){
		$sql = "UPDATE $this->tablename SET published=$this->published WHERE articleid=$this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function isreply(){
		$sql = "UPDATE $this->tablename SET isreply=$this->isreply WHERE articleid=$this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function set_readleval(){
		$sql = "UPDATE $this->tablename SET readlevel=$this->readlevel WHERE articleid=$this->articleid";
		return $this->pgsql->query($sql);
	}
	
	function getById($articleid){
		$sql = "SELECT * FROM $this->tablename WHERE articleid=$articleid";
		$row = $this->pgsql->fetchRow($sql);
		return $row;
	}
	
	function get_bycategoryid($categoryid, $limit) {
	    $sql = "SELECT * from c_article_get_by_categoryid($categoryid) 
	            WHERE published=1 AND hidetitle=0 
	            ORDER BY articleid DESC LIMIT $limit";
	    if ($categoryid == -2) {
	        $sql = "SELECT * from c_article_get_by_categoryid(1)
	                WHERE published=1 AND hidetitle=0 AND posttime>now()-INTERVAL '100 DAY' 
	                ORDER BY counter DESC LIMIT $limit";
	    }
		return $this->pgsql->fetchAll($sql);
	}
	
	
	function get_bytitle($title){
		$sql = "SELECT * FROM $this->tablename WHERE title='$title' ORDER BY articleid DESC";
		return $this->pgsql->fetchAll($sql);
	}
	
	
	function counter_plus($articleid) {
		$sql = "UPDATE $this->tablename SET counter=counter+1 WHERE articleid=$articleid";
		return $this->pgsql->query($sql);
	}
	
	function getTitle($articleid){
		$sql = "SELECT title FROM $this->tablename WHERE articleid=$articleid";
		return $this->pgsql->fetchVal($sql);
	}
	
	
	
/*********************** for myarticle.php *****************************/
	
	function getMyCount($categoryid, $userid, $field, $value) {
	    $sql = "SELECT count(*) FROM c_article_get_by_categoryid($categoryid) 
	           WHERE userid=$userid";
	    if (!empty($value)) {
	        $sql = "SELECT count(*) FROM c_article_get_by_categoryid($categoryid)
	        WHERE userid=$userid AND $field=$value";
	    }
	    echo $sql;
	    return $this->pgsql->fetchVal($sql);
	}
	
	function getsMyArticle($categoryid, $userid, $field, $value, $limit=10, $offset=0) {
	    $sql = "SELECT * FROM c_article_get_by_categoryid($categoryid)
	    WHERE userid=$userid ORDER BY articleid DESC LIMIT $limit OFFSET $offset";
	    if (!empty($value)) {
	        $sql = "SELECT * FROM c_article_get_by_categoryid($categoryid)
	        WHERE userid=$userid AND $field=$value
	        ORDER BY articleid DESC LIMIT $limit OFFSET $offset";
	    }
	    return $this->pgsql->fetchAll($sql);
	}
	
	
/*********************** for list.php *****************************/
	
	function getCountByLike($categoryid, $field, $value) {
	    $sql = "SELECT count(*) FROM c_article_get_by_categoryid($categoryid) WHERE published=1";
	    if (!empty($value)) {
	       $sql = "SELECT count(*) FROM c_article_get_by_categoryid($categoryid) 
	               WHERE published=1 AND $field LIKE '%$value%'";
	    }
	    return $this->pgsql->fetchVal($sql);
	}
	
    function getsByLike($categoryid, $field, $value, $limit=10, $offset=0) {
        $sql = "SELECT * FROM c_article_get_by_categoryid($categoryid)
                WHERE published=1 ORDER BY articleid DESC LIMIT $limit OFFSET $offset";
        if (!empty($value)) {
            $sql = "SELECT * FROM c_article_get_by_categoryid($categoryid)
                    WHERE published=1 AND $field LIKE '%$value%'
                    ORDER BY articleid DESC LIMIT $limit OFFSET $offset";
        }
        return $this->pgsql->fetchAll($sql);
    }
	
	
	function getNumInHours($hours){
		$sql = "SELECT count(*) FROM $this->tablename 
				WHERE posttime>now()-INTERVAL '$hours HOUR' AND published=1 AND hidetitle=0";
		return $this->pgsql->fetchVal($sql);
	}

}
?>