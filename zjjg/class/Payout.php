<?php

class Payout{
	
	private $db;
	private $table = 'zj_payout';
	public $escape = true;
	
	public $payoutid	= -1;
	public $cid			= 0;
	public $summary		= '';
	public $debit		= 0;
	public $credit		= 0;
	public $balance		= 0;
	public $corid		= 0;
	public $ymd			= '2008-07-07';
	public $appid		= 0;
	public $deleted		= 'false';
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->summary = pg_escape_string($this->summary);
		}else{
			$this->escape = true;
		}
	}
	
	function updates($rs){
		foreach ($rs as $row){
			$payoutid 	= $row[1];
			$cid		= (int)$row[2];
			$summary	= pg_escape_string($row[3]);
			$credit		= (float)str_replace(',','',$row[4]);
			$corid		= $_SESSION['cid'];
			$ymd		= $_SESSION['date'];
			if(empty($payoutid))
				$sql .= "INSERT INTO zj_payout(cid, summary, credit, corid, ymd)
										VALUES($cid,'$summary',$credit,$corid,'$ymd');";
			else
				$sql .= "UPDATE zj_payout SET 
							cid		= $cid,
							summary = '$summary',
							credit 	= $credit,
							ymd		= '$ymd'
						WHERE payoutid = $payoutid;";
		}
		return $this->db->query($sql);
	}
	
	function monthendwork($rs){
		$summary	= '月末结转';
		$uid		= $_SESSION['uid'];
		$corid		= $_SESSION['cid'];
		$ymd		= $_SESSION['date'];
		foreach ($rs as $r) {
			$cid = intval($r[0]);
			$debit = doubleval(str_replace(',', '', $r[1]));
			$_debit = -$debit;
			if($debit!=0 && $cid==1)
				$sql .= "INSERT INTO zj_application(corid, cid, app_money, summary, pid, ymd, uid, sid)
						VALUES($corid, $cid, $debit, '$summary', 99, '$ymd', $uid, 2);";
			if($debit!=0 && $cid>0)
				$sql .= "INSERT INTO zj_payout(cid, summary, debit, corid, ymd, appid)
						VALUES($cid, '$summary', $_debit, $corid, '$ymd', -7);";
		}
		if(empty($sql)) return false;
		return $this->db->query($sql);
	}
	
	function delete($payoutid){
		$sql = "UPDATE $this->table SET deleted=true WHERE payoutid=$payoutid";
		return $this->db->query($sql);
	}
	
	function getByCoridYmd($corid, $ymd){
		$sql = "SELECT a.*, b.ccode, b.cname 
				FROM zj_payout a
				LEFT JOIN zj_category b ON b.cid=a.cid
				WHERE a.ymd='$ymd' AND a.deleted='f' AND a.appid=0";
		if($corid>0)
			$sql .= " AND a.corid=$corid";
		$sql .= " ORDER BY a.payoutid ASC";
		return $this->db->query_all($sql);
	}
	
	function countForAccount($corid, $cid, $sdate, $edate){
		$sql = "SELECT COUNT(payoutid) FROM $this->table WHERE ymd>='$sdate' AND ymd<='$edate' AND deleted='f'";
		if ($cid>0) $sql .= " AND cid=$cid";
		if($corid>0) $sql .= " AND corid=$corid";
		return $this->db->query_value($sql);
	}
	
	function getForAccount($corid, $cid, $sdate, $edate, $offset, $limit){
		$sql = "SELECT a.*, b.cname 
				FROM zj_payout a
				LEFT JOIN zj_category b ON b.cid=a.cid
				WHERE a.ymd>='$sdate' AND a.ymd<='$edate' AND a.deleted='f'";
		if($cid>0) $sql .= " AND a.cid=$cid";
		if($corid>0) $sql .= " AND a.corid=$corid";
		$sql .= " ORDER BY a.payoutid ASC OFFSET $offset LIMIT $limit";
		return $this->db->query_all($sql);
	}
	
	function getForExcel($corid, $cid, $sdate, $edate){
		$sql = "SELECT a.payoutid, a.ymd, b.cname, a.summary, a.debit, a.credit, a.balance 
				FROM zj_payout a
				LEFT JOIN zj_category b ON b.cid=a.cid
				WHERE a.ymd>='$sdate' AND a.ymd<='$edate' AND a.deleted='f'";
		if($cid>0) $sql .= " AND a.cid=$cid";
		if($corid>0) $sql .= " AND a.corid=$corid";
		$sql .= " ORDER BY a.payoutid";
		return $this->db->query_all($sql);
	}
	
	function sumForAccount($corid, $cid, $sdate, $edate){
		$sql = "SELECT SUM(debit) AS sum_debit, SUM(credit) AS sum_credit FROM $this->table
				WHERE ymd>='$sdate' AND ymd<='$edate' AND deleted='f'";
		if ($cid>0) $sql .= " AND cid=$cid";
		if($corid>0) $sql .= " AND corid=$corid";
		return $this->db->query_first($sql);
	}
	
	function getForLedger($corid, $cid, $sdate, $edate){
		$sql = "SELECT a.cid, COUNT(a.*) AS count_rows, SUM(a.debit) AS sum_debit,
					SUM(a.credit) AS sum_credit, b.cname
				FROM $this->table a
				LEFT JOIN zj_category b ON b.cid = a.cid
				WHERE ymd>='$sdate' AND ymd<='$edate' AND deleted='f'";
		if ($cid>0) $sql .= " AND a.cid=$cid";
		if($corid>0) $sql .= " AND a.corid=$corid";
		$sql .= "GROUP BY a.cid, b.cname ORDER BY a.cid ASC";
		return $this->db->query_all($sql);
	}
	
	function getSum($corid, $sdate, $edate){
		$sql = "SELECT cid, COUNT(*) AS count_rows, SUM(debit) AS sum_debit, SUM(credit) AS sum_credit
				FROM $this->table 
				WHERE ymd>='$sdate' AND ymd<='$edate' AND deleted='f'";
		if($corid>0) $sql .= " AND corid=$corid";
		$sql .= "GROUP BY cid ORDER BY cid ASC";
		return $this->db->query_all($sql);
	}
	
}
?>