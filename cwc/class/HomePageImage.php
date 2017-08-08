<?php

class HomePageImage {
	private $pgsql;
	private $tablename = 'c_homepage_image';
	
	public $imageid;
	public $categoryid;
	public $appendageid;
	public $articleid;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function add(){
		$sql = "INSERT INTO $this->tablename (
		              categoryid, appendageid, articleid )
		        VALUES (
		              $this->categoryid, $this->appendageid, $this->articleid)
		        RETURNING imageid";
		$this->imageid = $this->pgsql->fetchVal($sql);
		return $this->imageid;
	}
	
	function update(){
		$sql = "UPDATE $this->tablename SET 
					categoryid = $this->categoryid,
					appendageid = $this->appendageid,
					articleid = $this->articleid 
				WHERE imageid = $this->imageid";
		return $this->pgsql->query($sql);
	}
	
	function updateArticleid(){
		$sql = "UPDATE $this->tablename SET 
					articleid = $this->articleid 
				WHERE imageid = $this->imageid";
		return $this->pgsql->query($sql);
	}
	
	function getNewlyImageByCategoryid($cateogyrid){
		$sql = "SELECT * FROM $this->tablename WHERE categoryid=$cateogyrid ORDER BY imageid DESC LIMIT 1";
		return $this->pgsql->fetchRow($sql);
	}
	
	function getByCategoryid($categoryid){
		$sql = "SELECT a.imageid AS imageid, CONCAT(c.name, b.savename) AS name, d.articleid, d.title, d.caption 
				FROM $this->tablename AS a 
				LEFT JOIN c_appendage AS b ON b.appendageid=a.appendageid 
				LEFT JOIN c_appendage_path AS c ON c.pathid = b.pathid 
				LEFT JOIN c_article AS d ON d.articleid=a.articleid 
				WHERE a.categoryid=$categoryid ORDER BY a.imageid DESC LIMIT 1";
		return $this->pgsql->fetchRow($sql);
	}
	
}
?>