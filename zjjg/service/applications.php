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
		
		$application = new Application($db);
		if($total==-1){	//计算总记录数
			$total = $application->getNumByCorid($corid, $cid, $sid, $sdate, $edate);
		}
		
		$rs = $application->getByCorid($corid, $cid, $sid, $sdate, $edate, ($page-1)*$rp, $rp);
		if(empty($rs)) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:$page,
					total:$total,
					rows:[";
		foreach ($rs as $r){
			$tmp .= ",{id:$r[appid], cell:['$r[appid]', '$r[briefname]', '$r[ymd]', '$r[cname]', '$r[summary]', '$r[app_money]', '$r[sname]']}";
		}
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	

?>