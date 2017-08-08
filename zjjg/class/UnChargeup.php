<?php

class UnChargeup{
	
	private $db;
	private $table = 'zj_unchargeup';
	public $escape = true;
	
	public $ucucid = 0;
	public $ccode = '-1';
	public $cname = '';
	public $bname = '';
	public $odr = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->ccode = pg_escape_string($this->ccode);
			$this->cname = pg_escape_string($this->cname);
			$this->bname = pg_escape_string($this->bname);
		}else{
			$this->escape = true;
		}
	}
	
	function getByCoridYmd($corid, $sdate, $edate){
		$sql = "SELECT a.*, b.cname
				FROM $this->table a
				LEFT JOIN zj_unchargeupcat b ON b.ucucid=a.ucucid
				WHERE a.corid=$corid AND a.ymd>='$sdate' AND a.ymd<='$edate' AND a.deleted='f'
				ORDER BY a.ucuid";
		return $this->db->query_all($sql);
	}
	
	function updates($rs){
		foreach ($rs as $r){
			$ucuid 		= $r[1];
			$ucucid		= (int)$r[2];
			$thedate	= $r[3];
			$summary	= pg_escape_string($r[4]);
			$money		= (float)str_replace(',','',$r[5]);
			$corid		= $_SESSION['cid'];
			$ymd		= $_SESSION['date'];
			if(empty($ucuid))
				$sql .= "INSERT INTO $this->table(ucucid, money, thedate, summary, corid, ymd)
										  VALUES($ucucid, $money, '$thedate', '$summary', $corid, '$ymd');";
			else
				$sql .= "UPDATE $this->table SET 
							ucucid	= $ucucid,
							money	= $money,
							thedate	= '$thedate',
							summary = '$summary',
							corid 	= $corid,
							ymd		= '$ymd'
						WHERE ucuid = $ucuid;";
		}
		return $this->db->query($sql);
	}
	
	function logicDelete($ucuid){
		$sql = "UPDATE $this->table SET deleted=true WHERE ucuid=$ucuid";
		return $this->db->query($sql);
	}
	
	
}
?>