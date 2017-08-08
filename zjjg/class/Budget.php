<?php

class Budget {
	
	private $db;
	private $table = 'zj_budget';
	public $escape = true;
	
	public $bgid = -1;
	public $corid = 0;
	public $cid = 0;
	public $y = 0;
	public $m0 = 0;
	public $m1 = 0;
	public $m2 = 0;
	public $m3 = 0;
	public $m4 = 0;
	public $m5 = 0;
	public $m6 = 0;
	public $m7 = 0;
	public $m8 = 0;
	public $m9 = 0;
	public $m10 = 0;
	public $m11 = 0;
	public $m12 = 0;
	public $remark = '';
	
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->remark = pg_escape_string($this->remark);
		}else{
			$this->escape = true;
		}
	}
	
	function update(){
		$this->escape();
	}
	
	function updates($rs){
		foreach ($rs as $r){
			$bgid = $r[0];
			$m0 = (float)str_replace(',','',$r[3]);
			$m1 = (float)str_replace(',','',$r[4]);
			$m2 = (float)str_replace(',','',$r[5]);
			$m3 = (float)str_replace(',','',$r[6]);
			$m4 = (float)str_replace(',','',$r[7]);
			$m5 = (float)str_replace(',','',$r[8]);
			$m6 = (float)str_replace(',','',$r[9]);
			$m7 = (float)str_replace(',','',$r[10]);
			$m8 = (float)str_replace(',','',$r[11]);
			$m9 = (float)str_replace(',','',$r[12]);
			$m10 = (float)str_replace(',','',$r[13]);
			$m11 = (float)str_replace(',','',$r[14]);
			$m12 = (float)str_replace(',','',$r[15]);
			$remark = pg_escape_string($r[16]);
			$sql .= "UPDATE zj_budget SET 
							m0	= $m0,
							m1	= $m1,
							m2	= $m2,
							m3	= $m3,
							m4	= $m4,
							m5	= $m5,
							m6	= $m6,
							m7	= $m7,
							m8	= $m8,
							m9	= $m9,
							m10	= $m10,
							m11	= $m11,
							m12	= $m12,
							remark = '$remark'
						WHERE bgid = $bgid;";
		}
		return $this->db->query($sql);
	}
	
	function getByCoridY($corid, $y){
		$sql = "SELECT a.*, b.cname 
				FROM $this->table a
				LEFT JOIN zj_category b ON b.cid=a.cid
				WHERE a.corid=$corid AND a.y=$y
				ORDER BY a.cid ASC";
		return $this->db->query_all($sql);
	}
	
	function sumByCoridY($corid, $y){
		$sql = "SELECT  SUM(m0) AS sum_m0,
						SUM(m1) AS sum_m1,
						SUM(m2) AS sum_m2,
						SUM(m3) AS sum_m3,
						SUM(m4) AS sum_m4,
						SUM(m5) AS sum_m5,
						SUM(m6) AS sum_m6,
						SUM(m7) AS sum_m7,
						SUM(m8) AS sum_m8,
						SUM(m9) AS sum_m9,
						SUM(m10) AS sum_m10,
						SUM(m11) AS sum_m11,
						SUM(m12) AS sum_m12
				FROM $this->table
				WHERE corid=$corid AND y=$y";
		return $this->db->query_first($sql);
	}
	
	function getByCoridCidY($corid, $cid, $y){
		$sql = "SELECT * FROM $this->table WHERE corid=$corid AND cid=$cid AND y=$y";
		return $this->db->query_first($sql);
	}
	
	function getByCoridYM($corid, $year, $month){
		$sql = "SELECT cid, m$month FROM $this->table WHERE corid=$corid AND y=$year ORDER BY bgid ASC";
		return $this->db->query_all($sql);
	}
	
}
?>