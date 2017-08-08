<?php

class Application{
	
	private $db;
	private $table = 'zj_application';
	public $escape = true;
	
	public $appid = -1;
	public $corid = 0;
	public $cid = 0;
	public $app_money = 0;
	public $summary = 'su';
	public $gathering_cor = '';
	public $gathering_acc = '';
	public $pid = 0;
	public $remark = '';
	public $ymd = '2008-07-01';
	public $uid = 0;
	public $uptime = '2008-07-01 00:00:00';
	
	public $reply = '';
	public $reply_ymd = '2008-07-01 00:00:00';
	public $reply_time = '2008-07-01 00:00:00';
	public $allow_money = 0;
	public $replyerid = 0;
	public $leaderid = 0;
	
	public $payoutid = 0;
	public $sid = 0;
	
	function __construct(&$db=null){
		$this->db = $db ? $db : new PostgreSQL();
	}
	
	private function escape(){
		if($this->escape && !get_magic_quotes_gpc()){
			$this->summary	 	= pg_escape_string($this->summary);
			$this->gathering_cor=pg_escape_string($this->gathering_cor);
			$this->gathering_acc=pg_escape_string($this->gathering_acc);
			$this->remark		=pg_escape_string($this->remark);
			$this->reply	 	= pg_escape_string($this->reply);
		}else{
			$this->escape = true;
		}
	}
	
	function update_subit(){	/*提交或保存申请*/
		$this->escape();
		$sql = "SELECT zj_application_update_submit(
					$this->appid,
					$this->corid,
					$this->cid,
					$this->app_money,
					'$this->summary',
					'$this->gathering_cor',
					'$this->gathering_acc',
					$this->pid,
					'$this->remark',
					'$this->ymd',
					$this->uid,
					$this->sid
				) AS result";
		return $this->db->query_value($sql);
	}
	
	function update_reply(){	/*批复申请*/
		$this->escape();
		$sql = "SELECT zj_application_update_reply(
					$this->appid,
					'$this->reply',
					'$this->reply_ymd',
					$this->allow_money,
					$this->replyerid,
					$this->sid
				) AS result";
		return $this->db->query_value($sql);
	}
	
	function update_replies($rs, &$i, &$sum){
		foreach ($rs as $r) {
			$sql .= "SELECT zj_application_update_reply(
						$r[appid],  '同意', '$_SESSION[date]', $r[app_money], $_SESSION[uid], 4
			) AS result;";
			$i++;
			$sum += $r['app_money'];
		}
		return $this->db->query_value($sql);
	}
	
	function update_repeal(){	/*撤消或作废*/
		$this->escape();
		$sql = "SELECT zj_application_update_repeal(
					$this->appid,
					'$this->reply',
					'$this->reply_ymd',
					$this->replyerid,
					$this->sid
				) AS result";
		return $this->db->query_value($sql);
	}
	
	function update_adm(){
		$this->escape();
		$sql = "UPDATE $this->table SET 
					reply		= '$this->reply',
					reply_ymd	= '$this->reply_ymd',
					replyerid	= $this->replyerid,
					sid			= $this->sid
				WHERE appid = $this->appid";
		if(is_resource($this->db->query($sql))) return true;
		else return false;
	}
	
	
	
	function getByid($appid){
		$sql = "SELECT a.*, b.ccode, c.pcode, d.realname AS apper, e.realname AS replyer, 
						f.realname AS leader, g.aliasname, h.sname
				FROM $this->table a 
				LEFT JOIN zj_category b	ON b.cid=a.cid 
				LEFT JOIN zj_paymode c	ON c.pid=a.pid 
				LEFT JOIN zj_user d 	ON d.uid=a.uid 
				LEFT JOIN zj_user e 	ON e.uid=a.replyerid 
				LEFT JOIN zj_user f 	ON f.uid=a.leaderid
				LEFT JOIN zj_corporation g ON g.corid=a.corid
				LEFT JOIN zj_status h	ON h.sid=a.sid
		 		WHERE appid=$appid";
		return $this->db->query_first($sql);
	}
	

	
	function getByUserid($uid){
		$sql = "SELECT * FROM vzj_app_usr_cat_byuserid($uid)";
		return $this->db->query_all($sql);
	}
	
	function getNumByCorid($corid, $cid, $sid, $sdate, $edate){
		$sql = "SELECT COUNT(*) FROM $this->table a
				WHERE ymd>='$sdate' AND ymd<='$edate'";
		if($corid>0) $sql .= " AND a.corid=$corid";
		if($cid>0) $sql .= " AND a.cid=$cid";
		if($sid>0) $sql .= " AND a.sid=$sid";
		return $this->db->query_value($sql);
	}
	
	function getByCorid($corid, $cid, $sid, $sdate, $edate, $offset, $limit){
		$sql = "SELECT a.*, b.briefname, c.cname, d.sname
				FROM $this->table a
				LEFT JOIN zj_corporation b 	ON b.corid=a.corid
				LEFT JOIN zj_category c		ON c.cid=a.cid
				LEFT JOIN zj_status d		ON d.sid=a.sid
				WHERE ymd>='$sdate' AND ymd<='$edate'";
		if($corid>0) $sql .= " AND a.corid=$corid";
		if($cid>0) $sql .= " AND a.cid=$cid";
		if($sid>0) $sql .= " AND a.sid=$sid";
		$sql .=" ORDER BY a.appid DESC OFFSET $offset LIMIT $limit";
		return $this->db->query_all($sql);
	}
	
	function getByIds($ids){
		$sql = "SELECT * FROM $this->table WHERE appid IN ($ids) ORDER BY appid";
		return $this->db->query_all($sql);
	}
	
}
?>