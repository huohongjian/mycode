<?php
	function __autoload($classname){include_once("../class/$classname.php");} //不可以用绝对路径
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	
	function getInfo(){
		$mysql = new MySQL();
		$session = new Session($mysql);
		$uid = $_SESSION['uid'];
		$gid = $_SESSION['gid'];
		$did = $_SESSION['did'];	//部门id
	
		$article = new Article($mysql);
		$articleid = intval($_REQUEST['articleid']);
		$row = $article->getById($articleid);
		if($row){
			$category = new Category($mysql);
			$parents = $category->parents($row['categoryid']);
			foreach ($parents as $parent) {
				$row['ArtCat'] .= " >> <a href='list.html?id={$parent[categoryid]}'>{$parent[name]}</a>";
			}
			$row['ArtCat'] .= " >> <a href='list.html?id=$categoryid'>$category->name</a>";

			$userid = $row['userid'];
			$row['ArtEdit'] = ($userid==$uid || (!empty($gid) && $gid<=2)) ? "<a href='edit.html?id=$articleid'>编辑</a>" : "";
			
			if(!$row['published'] && ($uid!=$userid && $gid!=1 || empty($uid))){
				$row['content'] = "<span style='color:red;'>此篇文章尚未发表，只可用户本人阅读，请登录或与文章上传者联系!</span>";
				return $row;
			}
			switch ($row['readlevel']){
				case 0: break;
				case 1: if(empty($uid)) {$row['content'] = "<span style='color:red;'>此篇文章只可注册用户阅读，请登录!</span>";} return $row; break;
				case 2: if($did!=1 && $gid>2) {$row['content'] = "<span style='color:red;'>此篇文章只可财务用户阅读，您不具备此权限!</span>";} return $row; break;
				case 3: if($gid!=4 && $gid>2) {$row['content'] = "<span style='color:red;'>此篇文章只可市局用户阅读，您不具备此权限!</span>";} return $row; break;
				case 4: if($gid!=3 && $gid>2) {$row['content'] = "<span style='color:red;'>此篇文章只可省局用户阅读，您不具备此权限!</span>";} return $row; break;
				case 5: if($uid!=$userid && $gid>2) {$row['content'] = "<span style='color:red;'>此篇文章只可用户本人阅读，您不具备此权限!</span>";} return $row; break;
				default: break;
			}
			
			$plus = $article->counter_plus($articleid);
			//注册阅读列表：
			$browselist = new BrowseList($mysql);
			$browselist->articleid = $articleid;
			$browselist->ipaddress = $_SERVER["REMOTE_ADDR"];
			$browselist->userid = $uid;
			$browselist->add_update();
			
			return $row;
		}else{
			return array('title'=>'没有此篇文章');
		}
	}
	
	function getpagesnum(){
		$answer = new Answer();
		$n = $answer->getRowsNum(intval($_REQUEST['articleid']));
		return $n;
	}
	
	
	function refresh_reply(){
		$articleid	= intval($_REQUEST['articleid']);
		$num		= intval($_REQUEST['num']);
		$page		= intval($_REQUEST['page']);
		$s = ($page-1)*$num;
		$limit = "$s,$num";
		
		$answer = new Answer();
		$rows = $answer->getByArticleid($articleid, $limit);
		return $rows;
	}
	
	function addreply(){
		$mysql = new MySQL();
		$session = new Session($mysql);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return array('msg'=>'nologin');
		
		$answer = new Answer($mysql);
		$answer->answerid 	= $_REQUEST['answerid'];
		$answer->isanonymous= $_REQUEST['isanonymous'];
		$answer->content 	= $_REQUEST['content'];
		
		if($answer->answerid==-1){
			$answer->articleid = intval($_REQUEST['articleid']);
			$answer->userid = $uid;
			$answer->add();
			return array('msg'=>'addOK','answerid'=>$answer->answerid);
		}else{
			$answer->update();
			return array('msg'=>'updateOK');
		}
		
	}
	
	
	function deletereply(){
		$answer = new Answer();
		return $answer->delete(intval($_REQUEST['answerid']));
	}
	
	
	function agree(){
		$answer = new Answer();
		return $answer->agreePlus(intval($_REQUEST['answerid']));
	}

	function oppose(){
		$answer = new Answer();
		return $answer->opposePlus(intval($_REQUEST['answerid']));
	}
	
	function hasPower(){
		$mysql = new MySQL();
		$session = new Session($mysql);
		$uid = $_SESSION['uid'];
		$gid = $_SESSION['gid'];
		$answer = new Answer($mysql);
		$userid = $answer->getUserid(intval($_REQUEST['answerid']));
		if($userid==$uid || ($gid>0 && $gid<=2)) return 1;
		else return 0;
	}
	
	

?>