<?php
	function __autoload($classname) {
	    include_once("../class/$classname.php");
	}
	
	call_user_func($_REQUEST['func']);
	
	function getInfo() {
		$pgsql = new PgSQL();
		$session = new Session($pgsql);
		$userid  = $session->read('userid');
		if(empty($userid)) {
		    die("{status:500, msg:'未登陆'}");
		}

	    $user = new User($pgsql);
	    $row = $user->getByUserid($userid);
	    if ($row) {
	    	die("{
				status: 	200,
				msg:		'ok',
				user_name: 	'$user->username',
				realname: 	'$user->realname',
				sex:		'$user->sex',
				idno:		'$user->idno',
				incid:		 $user->incid,
				deptid:		 $user->deptid,
				address:	'$user->address',
				postcode:	'$user->postcode',
				telephone:	'$user->telephone',
				mobilephone:'$user->mobilephone',
				email:		'$user->email',
				ipaddress:	'$user->ipaddress',
				oaemail:	'$user->oaemail',
				home_page:	'$user->homepage',
				qq:			'$user->qq',
				msn:		'$user->msn',
				intro:		'$user->intro',
				usergroupid: $user->usergroupid,	
			}");
	    } else {
	    	die("{status: 500, msg:'出现未知错误!'}");
	    }
	}
	
	
	function addUser(){

	}
	
	function setUserInfo(&$user){
		$user->realname 	= $_POST['realname'];
		$user->username 	= $_POST['username'];
		$user->password 	= $_POST['password'];
		$user->usergroupid 	= 4;	//市公司
		$user->authorizationids = '';
		$user->score 		= 0;
		$user->sex 			= $_POST['sex'];
		$user->idno 		= $_POST['idno'];
		$user->incid 		= $_POST['incid'];
		$user->deptid 		= $_POST['deptid'];
		$user->iscw 		= 0;
		$user->telephone 	= $_POST['telephone'];
		$user->mobilephone 	= $_POST['mobilephone'];
		$user->address 		= $_POST['address'];
		$user->postcode 	= $_POST['postcode'];
		$user->ipaddress 	= $_POST['ipaddress'];
		$user->email 		= $_POST['email'];
		$user->oaemail 		= $_POST['oaemail'];
		$user->homepage 	= $_POST['homepage'];
		$user->qq 			= $_POST['qq'];
		$user->msn 			= $_POST['msn'];
		$user->intro 		= $_POST['intro'];
	}

	function modifyInfo() {
		$pgsql = new PgSQL();
		$session = new Session($pgsql);
		$userid  = $session->read('userid');
		if(empty($userid)) {
		    die("{status:500, msg:'未登陆'}");
		}

	    $user = new User($pgsql);

	    $name = $user->getNameByUserid($userid);
	    if ($name != $_POST['username']) {
	    	die('登录用户与修改用户名不一致,请修改用户登录!');
	    }

		setUserInfo($user);
		$user->userid = $userid;

		if ($user->update()) {
			die('用户信息修改成功!');
		} else {
			die('出现未知错误!');
		}
	}


	function doRegist() {
		$pgsql = new PgSQL();
	    $user = new User($pgsql);
		setUserInfo($user);
	    if ($user->getByUsername($user->username)){
			die('已有同名用户,请更改用户名!');
		}
		if ($user->add()) {
			die('用户添加成功!');
		} else {
			die('出现未知错误!');
		}
	}
	
	
	// die();
	
	// $action = $_POST['action'];
	
	// if($action==1){		//获取ip地址
	// 	$ip = $_SERVER["REMOTE_ADDR"];
	// 	die("$ip");
	// }
	


?>