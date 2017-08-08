<?php
	include_once('_init.php');
	
	function getArticleById(){
	//	parse_str(file_get_contents("php://input")); only for post
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		$article = new ArticleList($db);
		$r = $article->getById($_REQUEST['id']);
		$r['editable'] = $uid==$r['uid'] ? true : false;
		
		return $r;
	}
	
	

?>