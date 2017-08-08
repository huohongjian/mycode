<?php

	function __autoload($classname) { include_once("../class/".$classname.".php"); }
	
	
	
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	function getArticleTitle(){
		$article = new Article();
		return $article->getTitle(intval($_REQUEST['articleid']));
	}
	
	function changeArticleId(){
		$mysql = new MySQL();
		$article0 = new Article($mysql);
		$article1 = new Article($mysql);
		$row0 = $article0->getById(intval($_REQUEST['articleid0']));
		$row1 = $article1->getById(intval($_REQUEST['articleid1']));
		$id0 = $article0->articleid;
		$article0->articleid = $article1->articleid;
		$article1->articleid = $id0;
		$article0->updateAllColumn();
		$article1->updateAllColumn();
		return 'ok';
	}
	
	
	function delQuanXian(){
		$mysql = new MySQL();
		$session = new Session($mysql);
		$gid = $_SESSION['gid'];
		if(empty($gid) || $gid>2) return("你没有此权限!");
		
		$uc = new Uc($mysql);
		$uc->delete(intval($_REQUEST['userid']));
		return "权限删除完毕";
	}
	
	function setQuanXian(){
		$mysql = new MySQL();
		$session = new Session($mysql);
		$gid = $_SESSION['gid'];
		if(empty($gid) || $gid>2) return("你没有此权限!");
		
		$quanxians['admin'] = array(1);	//系统管理员
		$quanxians['sgs'] = array(10,30,50,70,90,110,150);	//省公司用户
		$quanxians['fgs'] = array(30,50,70,90,110,150);	//市公司用户
		
		$qxs = $quanxians[$_REQUEST['flag']];
		$uid = intval($_REQUEST['userid']);
		
		$uc = new Uc($mysql);
		foreach ($qxs as $qx){
			if(!$uc->getByUidCid($uid, $qx)){
				$uc->add($uid, $qx);
			}
		}
		return "权限设置完毕";
	}
	
	

?>