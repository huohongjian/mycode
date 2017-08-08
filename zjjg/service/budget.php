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
		$budget = new Budget($db);
		$rs = $budget->getByCoridY($corid, $year);
		if(empty($rs)) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:1,
					total:1,
					rows:[";
		$i=0;
		foreach ($rs as $r){
			$i++;
			$tmp .= ",{id:$r[bgid], cell:['$i', '$r[cname]', '$r[m0]',
					'$r[m1]','$r[m2]','$r[m3]','$r[m4]','$r[m5]','$r[m6]',
					'$r[m7]','$r[m8]','$r[m9]','$r[m10]','$r[m11]','$r[m12]', '$r[remark]　']}";
		}
		
		$r = $budget->sumByCoridY($corid, $year);
		$i++;
		$tmp .= ",{id:-9, cell:['$i','合计','$r[sum_m0]','$r[sum_m1]','$r[sum_m2]',
			'$r[sum_m3]','$r[sum_m4]','$r[sum_m5]','$r[sum_m6]','$r[sum_m7]','$r[sum_m8]',
			'$r[sum_m9]','$r[sum_m10]','$r[sum_m11]','$r[sum_m12]','　']}";
		
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
		$budget = new Budget($db);
		if($budget->updates($rs)) return "数据保存成功!";
	}
	
	
	

?>