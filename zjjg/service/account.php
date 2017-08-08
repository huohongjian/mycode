<?php
	include_once('_init.php');
	
	function getList(){
		$db = new PostgreSQL();
		$session = new Session($db);
		$uid = $_SESSION['uid'];
		if(empty($uid)) return "{page:1, total:1, rows:[], msg:'请登录!'}";
		
		parse_str(file_get_contents("php://input"));
		if($_SESSION['cid']>0) $corid = $_SESSION['cid'];
		
		$payout = new Payout($db);
		if($total==-1){
			$total = $payout->countForAccount($corid, $cid, $sdate, $edate)+1;	//1是合计行
		}
		
		
		$rs = $payout->getForAccount($corid, $cid, $sdate, $edate, ($page-1)*$rp, $rp);
		if(empty($rs) && $page==1) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:$page,
					total:$total,
					rows:[";
		if($rs){	//freebsd下必须要有
			$i = ($page-1)*$rp;
			foreach ($rs as $r){
				$i++;
				$tmp .= ",{id:$r[payoutid], cell:['$i', '$r[ymd]', '$r[cname]', '$r[summary]', '$r[debit]', '$r[credit]', '$r[balance]']}";
			}
		}
		if($page==round($total/$rp+0.4999,0)){	//判断是否为最后一页
			$r = $payout->sumForAccount($corid, $cid, $sdate, $edate);
			$balance = $r['sum_debit']-$r['sum_credit'];
			$tmp .= ",{id:null, cell:['','','合计','','$r[sum_debit]','$r[sum_credit]','$balance']}";
		}
		$json .= substr($tmp,1)."]}";
		
		
		return $json;
	}
	
	

?>