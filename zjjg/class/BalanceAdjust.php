<?php

class BalanceAdjust{
	
	private $db;
	private $table = 'zj_balanceadjust';
	public $escape = true;
	
	public $baid = 0;
	public $yhrjz = 0;
	public $ysqws = 0;
	public $yfqwf = 0;
	public $qsyws = 0;
	public $qfywf = 0;
	public $xted = 0;
	public $yhed = 0;
	public $tzed = 0;
	public $corid = 0;
	public $y = 0;
	public $m = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		
	}
	
	function update_xted(){
		$this->escape();
		$sql = "SELECT fzj_balanceadjust_update_xted($this->corid, $this->y, $this->m, $this->xted)";
		return $this->db->query($sql);
	}
	
	
}
?>