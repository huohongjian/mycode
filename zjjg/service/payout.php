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
		$corid = $_SESSION['cid'];
		$ymd = $_SESSION['date'];
		$payout = new Payout($db);
		$rs = $payout->getByCoridYmd($corid, $ymd);
		if(empty($rs)) return "{page:1, total:1, rows:[{id:-1, cell:['','','','']}]}";
		$json = "{
					page:1,
					total:1,
					rows:[";
		foreach ($rs as $r){
			$tmp .= ",{id:$r[payoutid], cell:['$r[payoutid]', '$r[cid].$r[cname]', '$r[summary]', '$r[credit]']}";
		}
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	
	function saveData(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		if(empty($uid)) return "请登录!";
		if($_SESSION['can_submit']=='f') return "你没有提交数据的权限!";
		
		parse_str(file_get_contents("php://input"));
		$rs = Func::explodeString($data);
		$payout = new Payout($db);
		if($payout->updates($rs)) return "ok";
	}
	
	
	function delete(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		if(empty($uid)) return "请登录!";
		$payout = new Payout($db);
		if($payout->delete($_REQUEST['id'])) return '数据删除成功!';
		
	}
	

?>