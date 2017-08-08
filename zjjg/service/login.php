<?php
	function __autoload($class_name){include_once("../class/$class_name.php");}
	
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	function regist(){
		$db = new PostgreSQL();
		$user = new User($db);
		$row = $user->getByNamePwd($_REQUEST['uname'],$_REQUEST['upassword']);
		if($row){
			$session = new Session($db);
			$_SESSION['uid'] = $row['uid'];
			$_SESSION['name'] = $row['realname'];
			$_SESSION['cid'] = $row['corid'];
			$_SESSION['can_submit'] = $row['can_submit'];
			$_SESSION['can_reply'] = $row['can_reply'];
			$_SESSION['date'] = $_REQUEST['udate'];
			return 1;
		}else{
			return 0;
		}
	}
	
	function getUserInfo(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		$corid = $_SESSION['cid'];
		if(empty($uid)) return "{key:0, msg:'你尚未登录或登录已超时,请先登录!'}";
		
		$user = new User($db);
		$r = $user->getByid($uid);
		$r['key'] = 1;
		$r['date'] = $_SESSION['date'];
		return $r;
	}

?>