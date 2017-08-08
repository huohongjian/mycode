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
		if(empty($uid)) return "{page:1, total:1, rows:[], msg:'请登录!'}";
		
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
		$rs = $payout->getSum($corid, "$sdate", "$edate");
		if(!empty($rs)){
			foreach ($rs as $r){
				$rows[$r['cid']]['count_rows'] = $r['count_rows'];
				$rows[$r['cid']]['sum_debit'] = $r['sum_debit'];
				$rows[$r['cid']]['sum_credit'] = $r['sum_credit'];
			}
		}
		$json = "{
					page:1,
					total:1,
					rows:[";
		$i=0;
		$sum_debit = 0;
		$sum_credit = 0;
		$sum_balance = 0;
		$sum_rows = 0;
		foreach ($rows as $r){
			$i++;
			$count_rows = $r['count_rows'];
			$debit = $r['sum_debit'];
			$credit = $r['sum_credit'];
			$balance = $debit - $credit;
			$tmp .= ",{id:$r[cid], cell:['$i', '$r[cname]', '$count_rows', '$debit', '$credit', '$balance','']}";
			$sum_debit += $debit;
			$sum_credit += $credit;
			$sum_balance += $balance;
			$sum_rows += $count_rows;
		}
		$i++;
		$tmp .= ",{id:-9, cell:['$i','合计','$sum_rows','$sum_debit','$sum_credit','$sum_balance','']}";
	
		
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	

?>