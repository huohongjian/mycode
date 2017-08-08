<?php
	function __autoload($class) {
	    include_once("../class/$class.php");
	}
	
//	parse_str(file_get_contents("php://input"), $arr);

	
	
	call_user_func($_REQUEST['func']);
	

	
	
	function saveArticle() {
	    $pgsql = new PgSQL();
		
		$session = new Session($pgsql);
		$userid  = $session->read('userid');
		if(empty($userid)) {
		    die('{"articleid": -1}');         //未登陆
		}
		
		//判断是否有权限
		$categoryid = $_REQUEST['categoryid'];
		$category = new Category($pgsql);
		$row = $category->get_one_byid($categoryid);
		$cids = $row['path'].$categoryid;
		$uc = new Uc($pgsql);
		if (!$uc->hasrow($userid, $cids)) {
		    die('{"articleid": -2}');         //没有权限
		}
		
		//添加更新文章
		$article = new Article($pgsql);
		$article->articleid	= intval($_REQUEST['articleid']);
		$article->categoryid= intval($_REQUEST['categoryid']);
		$article->hidetitle = intval($_REQUEST['hidetitle']);
		$article->published = intval($_REQUEST['published']);
		$article->isreply   = intval($_REQUEST['isreply']);
		$article->user_id	= $userid;
		$article->number	= $_REQUEST['number'];
		$article->caption	= $_REQUEST['caption'];
		$article->title		= $_REQUEST['title'];
		$article->author	= $_REQUEST['author'];
		$article->content	= $_REQUEST['content'];			
		
		
		if ($article->articleid==-1) {
			$articleid = $article->add();
		} else {
			$article->update();
			$articleid = $article->articleid;
		}
		die("{\"articleid\": $articleid}");
	}
	
	
	function hidetitle(){
		$article = new Article();
		$article->articleid	= intval($_REQUEST['articleid']);
		$article->hidetitle = intval($_REQUEST['hidetitle']);
		$article->hidetitle();
		return $article->hidetitle;
	}
	
	function published(){
		$article = new Article();
		$article->articleid	= intval($_REQUEST['articleid']);
		$article->published = intval($_REQUEST['published']);
		$article->published();
		return $article->published;
	}
	
	function isreply(){
		$article = new Article();
		$article->articleid	= intval($_REQUEST['articleid']);
		$article->isreply	= intval($_REQUEST['isreply']);
		$article->isreply();
		return $article->isreply;
	}
	
	function set_readlevel(){
		$article = new Article();
		$article->articleid	= intval($_REQUEST['articleid']);
		$article->readlevel = intval($_REQUEST['readlevel']);
		if($article->set_readleval()){
			return $article->readlevel;
		}
	}
	
	
	function getInfo() {
		$pgsql = new PgSQL();
		$article = new Article($pgsql);
		$session = new Session($pgsql);
		$sess = $session->read();
		if(empty($sess['userid'])) {
		    die('{"articleid": -1}');
		}
		$row = $article->getById($_REQUEST['articleid']);
		if ($sess['userid'] != $row['userid']  &&  $sess['usergroupid'] > 2) {
		    die('{"articleid": -2}');
		}
		die(json_encode($row));
	}
	
?>