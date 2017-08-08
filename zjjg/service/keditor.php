<?php
	include_once('_init.php');
	
	function updateArticle () {
		parse_str(file_get_contents("php://input"));
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		$cid = $_SESSION['cid'];
		if(empty($uid)) return "{cases:9, msg:'请登录!'}";
		if($cid!=0) return "{cases:9, msg:'你没有权限!'}";
		
		$article = new ArticleList($db);
		$article->artid = $artid;
		$article->catid = $catid;
		$article->art_number = $number;
		$article->title = $title;
		$article->title_alias = $alias;
		$article->author = $author;
		$article->uid = $uid;
		$article->content = $content;
		$v = $article->update();
		return "{cases:1, artid:$v}";
		
	}
	
	function getArticleById(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		$cid = $_SESSION['cid'];
		$article = new ArticleList($db);
		$r = $article->getById($_REQUEST['id']);
		if(empty($uid) || $cid!=0) $r['power'] = false;
		else $r['power'] = true;
		return $r;
	}
	

?>