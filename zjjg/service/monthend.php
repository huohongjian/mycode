<?php

	function __autoload($class_name){include_once("../class/$class_name.php");}
	
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	function getBalance(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "{page:1, total:1, rows:[], msg:'请登录!'}";
		
		parse_str(file_get_contents("php://input"));
		if($_SESSION['cid']>0) $corid = $_SESSION['cid'];
		
		$sdate = "$y-$m-1";
		$edate = "$y-$m-$md";
		
		$rows = array();
		$cat = new Category($db);
		$rs = $cat->getAll();
		foreach ($rs as $r){
			$rows[$r['cid']]['cid'] = $r['cid'];
			$rows[$r['cid']]['cname'] = $r['cname'];
		}
		$payout = new Payout($db);
		$rs = $payout->getSum($corid, $sdate, $edate);
		if(!empty($rs)){
			foreach ($rs as $r){
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
		foreach ($rows as $r){
			$i++;
			$debit = $r['sum_debit'];
			$credit = $r['sum_credit'];
			$balance = $debit - $credit;
			$tmp .= ",{id:$r[cid], cell:['$i', '$r[cname]', '$debit', '$credit', '$balance']}";
			$sum_debit += $debit;
			$sum_credit += $credit;
		}
		$i++;
		$balance = $sum_debit - $sum_credit;
		$tmp .= ",{id:-1, cell:['$i','合计','$sum_debit','$sum_credit','$balance']}";
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	function monthendwork(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		if(empty($uid)) return "请登录!";
		if($_SESSION['can_submit']=='f') return "你没有提交数据的权限!";
		$corid = $_SESSION['cid'];
		$ymd = $_SESSION['date'];
		$date = Func::getdate($ymd);
		parse_str(file_get_contents("php://input"));
		$rs = Func::explodeString($data);
		$xted = 0;
		if(!empty($rs)){
			foreach ($rs as $r){
				$money = doubleval(str_replace(',', '', $r[1]));
				if($money<0) return '有小于零的余额,请追加额度后,再进行月末处理!';
				$xted += $money;
			}
		}
		$payout = new Payout($db);
		
		
		if($payout->monthendwork($rs)){
			$ba = new BalanceAdjust($db);
			$ba->corid = $corid;
			$ba->y = $date[0];
			$ba->m = $date[1];
			$ba->xted = $xted/2;
			if($ba->update_xted()){
				$jiezhang = new Jiezhang($db);
				$jiezhang->corid = $corid;
				$jiezhang->y = $date[0];
				$jiezhang->m = $date[1];
				$jiezhang->jzed = 'true';
				if($jiezhang->update())
					return "余额结转成功!";
				else
					return "余额结转错误，请与系统管理员联系!";
			}else{
				return "余额结转错误，请与系统管理员联系!";
			}
		}else{
			return '余额已为零,不需要进行结转。';
		}
	}
	
	function getWdzx(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		
		if(empty($uid)) return "请登录!";
		if($_SESSION['can_submit']=='f') return "你没有提交数据的权限!";
		
		parse_str(file_get_contents("php://input"));
		$corid = $_SESSION['cid'];
		$sdate = "$y-$m-1";
		$edate = "$y-$m-$md";
		
		$unchargeup = new UnChargeup($db);
		$rs = $unchargeup->getByCoridYmd($corid, $sdate, $edate);
		$json = "{
					page:1,
					total:1,
					rows:[";
		if(empty($rs)){
			$tmp = ",{id:-1, cell:['','','','','']}";
		}else{
			foreach ($rs as $r){
				$tmp .= ",{id:$r[ucuid], cell:['$r[ucuid]', '$r[ucucid].$r[cname]', '$r[thedate]', '$r[summary]', '$r[money]']}";
			}
		}
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	function saveWdzx(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "请登录!";
		if($_SESSION['can_submit']=='f') return "你没有提交数据的权限!";
		
		parse_str(file_get_contents("php://input"));
		$rs = Func::explodeString($data);
		$unchargeup = new UnChargeup($db);
		$unchargeup->updates($rs);
		return "ok";
	}
	
	function delCurRow(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "请登录!";
		if($_SESSION['can_submit']=='f') return "你没有提交数据的权限!";
		$ucuid = intval($_REQUEST['id']);
		$unchargeup = new UnChargeup($db);
		if($unchargeup->logicDelete($ucuid)) return '数据删除成功!';
		else return '删除数据错误!';
	}
	

?>