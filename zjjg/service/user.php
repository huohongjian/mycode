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
			$_SESSION['cid'] = $row['corid'];
			$_SESSION['date'] = $_REQUEST['udate'];
			return 1;
		}else{
			return 0;
		}
	}
	
	function getInfo(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "{key:0, msg:'你尚未登录或登录已超时,请先登录!'}";
		
		$corid = $_SESSION['cid'];
		$user = new User($db);
		$r = $user->getByid($uid);
		$r['key'] = 1;
		$r['date'] = $_SESSION['date'];
		return $r;
	}
	
	function setInfo(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "你尚未登录或登录已超时,请先登录!";
		
		parse_str(file_get_contents("php://input"));
		if($_SESSION['cid']!=$corid) return "所属单位不可更改!";
		$user = new User($db);
		$user->uid = $uid;
		$user->uname = $uname;
		$user->corid	= $corid;
		$user->telephone= $telephone;
		$user->mobile	= $mobile;
		$user->ip		= $ip;
		$user->email	= $email;
		if($user->updateInfo())
			return "用户信息更新成功!";
		else
			return "用户信息更新失败!";
	}
	
	function setUserPswd(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "你尚未登录或登录已超时,请先登录!";
		
		parse_str(file_get_contents("php://input"));
		$user = new User($db);
		$user->uid = $uid;
		$user->upassword = $pswd;
		if($user->updatePswd())
			return "用户密码更新成功!";
		else
			return "用户密码更新失败!";
	}
	
	function getUserName(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "";
		
		$user = new User($db);
		$r = $user->getByid($uid);
		if(empty($r)) return "";
		return $r['uname'];
	}
	
	function logout(){
		$db = new PostgreSQL();
		$session = new Session($db);
		session_destroy();
		return '1';
	}

?>