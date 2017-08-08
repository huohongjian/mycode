<?php

	function __autoload($class_name){include_once("../class/$class_name.php");}
	
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	
	function getList(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		if(empty($uid)) return "{page:1, total:1, rows:[]}";
		
		parse_str(file_get_contents("php://input"));
		
		if($_SESSION['cid']>0) $corid = $_SESSION['cid'];
	//	$page=$page;
	//	$rp = 10000;
		$application = new Application($db);
		if($total==-1){	//计算总记录数
			$total = $application->getNumByCorid($corid, $cid, $sid, $sdate, $edate) + 1;
		}
		$rs = $application->getByCorid($corid, $cid, $sid, $sdate, $edate, ($page-1)*$rp, $rp);
		if(empty($rs)) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:$page,
					total:$total,
					rows:[";
		foreach ($rs as $r){
			$tmp .= ",{id:$r[appid]
				     ,cell:['<a href=\'application.html?id=$r[appid]\' target=\'_blank\'>$r[appid]</a>', '$r[briefname]', '$r[ymd]', '$r[cname]', '$r[summary]', '$r[app_money]', '$r[sname]']
					 ,title:['','','','','摘要：$r[summary]\\r\\r备注：$r[remark]']}";
			$tMoney += $r['app_money'];
		}
		$tmp .= ",{id:-99, cell:['','','','合计','','$tMoney','']}";
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	
	function reply(){
		$db = new PostgreSQL();
		$session = new Session($db);
		if($_SESSION['can_reply']=='f') return "你没有权限!";
		
		parse_str(file_get_contents("php://input"));
		$rs = Func::explodeString($data);
		if(empty($rs)) return "没有批复任何申请单!";
		foreach ($rs as $r) {
			$ids .= ",$r[0]";
		}
		
		$app = new Application($db);
		$rs = $app->getByIds(substr($ids,1));
		if(empty($rs)) return "没有匹配的申请单。";
		$sameCorp = $sameStatus = true;
		foreach ($rs as $r) {
			if($r['corid']!=$corid) $sameCorp = false;
			if($r['sid']!=2) $sameStatus = false;
		}
		if(!$sameCorp && count($rs)>1) return "单位不一致，不可批量批复!";
		if(!$sameStatus) return "不是提交状态申请单，不可批复!";
		
		$i = $sum = 0;
		if($app->update_replies($rs, $i, $sum)) return "共批复{$i}笔申请单,金额为：{$sum}元。";
		else return "未知错误，请与系统管理员联系!";
	}
	
	
	function getUser(){
		$session = new Session();
		$rs = $session->getAll();
		if(empty($rs)) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:1,
					total:1,
					rows:[";
		foreach ($rs as $r){
			$vs = explode('"',$r['val']);
			if(empty($vs[3])) continue;
			$time = substr($r['logintime'],11,8);
			$tmp .= ",{id:$r[sid],cell:['$r[sid]', '$vs[5]', '$vs[3]', '$time']}";
		}
		$json .= substr($tmp,1)."]}";
		
		return $json;
	}
	
	function getUserInfo(){
		$user = new User();
		$rs = $user->getAll();
		if(empty($rs)) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:1,
					total:1,
					rows:[";
		foreach ($rs as $r){
			$tmp .= ",{id:$r[uid],cell:['$r[uid]', '$r[corid]', '$r[realname]', '$r[telephone]']}";
		}
		$json .= substr($tmp,1)."]}";
		
		return $json;
	}

?>