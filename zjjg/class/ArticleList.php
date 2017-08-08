<?php

class ArticleList{
	
	private $db;
	private $table = 'article.list';
	public $escape = true;
	
	public $artid = 0;
	public $catid = 0;
	public $art_number = '';
	public $title = '';
	public $title_alias = '';
	public $author = '';
	public $uid = 0;
	public $posttime = '2008-08-13';
	public $hidetitle = 'false';
	public $published = 'false';
	public $disp_content = 'false';
	public $replyed = 'true';
	public $reply_num = 0;
	public $readlevel = 0;
	public $counter = 0;
	public $content = '';
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->art_number	= pg_escape_string($this->art_number);
			$this->title		= pg_escape_string($this->title);
			$this->title_alias	= pg_escape_string($this->title_alias);
			$this->author		= pg_escape_string($this->author);
			$this->content		= pg_escape_string($this->content);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
		$sql = "SELECT article.list_update(
			$this->artid,
			$this->catid,
			'$this->art_number',
			'$this->title',
			'$this->title_alias',
			'$this->author',
			$this->uid,
			'$this->content'
		) AS result";
		return $this->db->query_value($sql);
	}
	
	function getById($artid=0){
		$sql = "UPDATE $this->table SET counter=counter+1 WHERE artid=$artid;
				SELECT * FROM $this->table WHERE artid=$artid";
		return $this->db->query_first($sql);
	}
	
	function getsByCatid($catid=0, $offset=0, $limit=0){
		if($catid==0)
			$sql = "SELECT * FROM $this->table ORDER BY artid DESC OFFSET $offset LIMIT $limit";
		else
			$sql = "SELECT * FROM $this->table WHERE catid=$catid ORDER BY artid DESC OFFSET $offset LIMIT $limit";
		return $this->db->query_all($sql);
	}
	
	function countByCatid($catid=0){
		if($catid==0)
			$sql = "SELECT COUNT(*) FROM $this->table";
		else
			$sql = "SELECT COUNT(*) FROM $this->table WHERE catid=$catid";
		return $this->db->query_value($sql);
	}
	
	function getsByCatidTitleContent($catid=0, $title='', $content='', $offset=0, $limit=0){
		$sql = "SELECT * FROM $this->table WHERE TRUE ORDER BY artid DESC OFFSET $offset LIMIT $limit";
		if(!empty($catid)) $sql = str_replace("TRUE", "TRUE AND catid=$catid", $sql);
		if(!empty($title)) $sql = str_replace("TRUE", "TRUE AND title LIKE '%$title%'", $sql);
		if(!empty($content)) $sql = str_replace("TRUE", "TRUE AND content LIKE '%$content%'", $sql);
		return $this->db->query_all($sql);
	}
	
	function countByCatidTitleContent($catid=0, $title='', $content=''){
		$sql = "SELECT COUNT(*) FROM $this->table WHERE TRUE";
		if(!empty($catid)) $sql = str_replace("TRUE", "TRUE AND catid=$catid", $sql);
		if(!empty($title)) $sql = str_replace("TRUE", "TRUE AND title LIKE '%$title%'", $sql);
		if(!empty($content)) $sql = str_replace("TRUE", "TRUE AND content LIKE '%$content%'", $sql);
		return $this->db->query_value($sql);
	}
	
}
?>