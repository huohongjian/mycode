<?php
	function __autoload($class_name){include_once("../class/$class_name.php");}

	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	function update(){
		parse_str(file_get_contents("php://input"));
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		$corid = $_SESSION['cid'];
		
		$json['isok']	= false;
		$json['msg']	= '写入数据库错误,请重新操作或与系统管理员联系!';
		$json['appid']	= $appid;
		$json['apper']	= '';
		$json['replyer']= '';
		$json['sname'] = '新创建';
		
		if(empty($uid)) {$json['msg']='你尚未登录或登录已超时,请重新登录!'; return $json;}
		$user = new User($db);
		$r = $user->getByid($uid);
		if($sid<=2) {
			if($r['can_submit']=='f') {$json['msg']='你没有提交申请单的权限!'; return $json;}
			$json['apper'] = $r['realname'];
		} else if ($sid>=3 && $sid<=7) {
			if($r['can_reply']=='f') {$json['msg']='你没有此权限!'; return $json;}
			$json['replyer'] = $r['realname'];
		}
		
		$status = new Status($db);
		$json['sname'] = $status->getValue($sid);
		
		$app = new Application($db);
		$app->appid			= $appid;
		$app->corid			= $corid;
		$app->cid			= $cats;
		$app->app_money		= $app_money;
		$app->summary		= $summary;
		$app->gathering_cor	= $gathering_cor;
		$app->gathering_acc	= $gathering_acc;
		$app->pid			= $paymode;
		$app->remark		= $remark;
		$app->ymd			= $_SESSION['date'];
		$app->uid			= $uid;
		$app->sid			= $sid;
		
		$app->reply 		= $reply;
		$app->reply_ymd 	= $_SESSION['date'];
		$app->replyerid 	= $uid;
		$app->allow_money	= $allow_money;
		
		switch($app->sid){
			case 1:	/*保存*/
				$rst = $app->update_subit();
				if($rst==-4) {break;}
				if($rst>0) {$json['msg']='数据保存成功!'; $json['appid']=$rst; $json['isok']=true;}
				break;
			case 2:	/*提交*/
				$rst = $app->update_subit();
				if($rst==-4) {break;}
				if($rst>0) {$json['msg']='数据提交成功!'; $json['appid']=$rst; $json['isok']=true;}
				break;
			case 3:	/*审批*/
				if($app->update_adm()) {$json['msg']='此申请单正在办理审批中!'; $json['isok']=true;}
				break;
			case 4:	/*批复*/
				if($app->update_reply()) {$json['msg']='此申请单已正式批复!'; $json['isok']=true;}
				break;
			case 5:	/*撤消*/
				if($app->update_repeal()) {$json['msg']='此申请单已撤消至提交状态!'; $json['isok']=true;}
				break;
			case 6:	/*退回*/
				if($app->update_adm()) {$json['msg']='此申请单已退回!'; $json['isok']=true;}
				break;
			case 7:	/*作废*/
				if($app->update_repeal()) {$json['msg']='此申请单已作废!'; $json['isok']=true;}
				break;
		}
		return $json;
	}
	
	
	function getByid(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		$corid = $_SESSION['cid'];
		if(empty($uid)) return "{msg:'你尚未登录或登录已超时,请先登录!'}";
		$app = new Application($db);
		$r = $app->getByid($_REQUEST['appid']);
		if($r['corid']==$corid || $corid==0){
			return $r;
		}else{
			return "{msg:'请操作你本单位的申请单!'}";
		}
	}
	
	function getExtraInfo(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "{msg:'你尚未登录或登录已超时,请先登录!'}";
		$v = array();
		$corid = $_REQUEST['corid'];
		$cid = $_REQUEST['cid'];
		$edate = $_REQUEST['edate'];
		$sql = "SELECT r.ybudget, r.mbudget, r.ypayout, r.mpayout, r.allow
				FROM fzj_other_extra_info($corid, $cid, '$edate') as r";
		$r=$db->query_first($sql);
		return $r;
	}

?>