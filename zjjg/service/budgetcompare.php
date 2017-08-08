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
		
		
		$rows = array();
		$cat = new Category($db);
		$rs = $cat->getAll();
		foreach ($rs as $r){
			$rows[$r['cid']]['cid'] = $r['cid'];
			$rows[$r['cid']]['cname'] = $r['cname'];
		}
		
		$payout = new Payout($db);
		$rs = $payout->getSum($corid, "$y-$m-1", "$y-$m-$d");
		if(!empty($rs)){
			foreach ($rs as $r){
				$rows[$r['cid']]['sum_credit'] = $r['sum_credit'];
			}
		}
		$budget = new Budget($db);
		$rs = $budget->getByCoridYM($corid, $y, $m);
		foreach ($rs as $r){
			$rows[$r['cid']]['budget'] = $r["m$m"];
		}
		
		$json = "{
					page:1,
					total:1,
					rows:[";
		$i=0;
		$sum_budget = 0;
		$sum_credit = 0;
		foreach ($rows as $r){
			$i++;
			$credit = $r['sum_credit'];
			$budget = $r['budget'];
			$balance = $credit - $budget;
			$depart = $budget==0 ? 0 : round($credit/$budget*100,2);
			$tmp .= ",{id:$r[cid], cell:['$i', '$r[cname]', '$credit', '$budget','$balance','$depart','']}";
			$sum_credit += $credit;
			$sum_budget += $budget;
		}
		$i++;
		$balance = $sum_credit - $sum_budget;
		$depart = $sum_budget==0 ? 0 : round($sum_credit/$sum_budget*100,2);
		$tmp .= ",{id:-9, cell:['$i', '合计', '$sum_credit', '$sum_budget','$balance','$depart','']}";
		
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	
	

?>