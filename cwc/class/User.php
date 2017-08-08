<?php

class User{
	
	private $pgsql;
	private $tablename = 'c_user';
	
	public $userid = 0;
	public $realname = '';
	public $username = '';
	public $password = '';
	public $usergroupid = 4;	// 市公司
	public $authorizationids = '';
	public $score = 0;
	public $sex = '男';
	public $idno = '';
	public $jointime;
	public $incid = 0;
	public $deptid = 0;
	public $iscw = 0;
	public $telephone = '';
	public $mobilephone = '';
	public $address = '';
	public $postcode = '';
	public $ipaddress = '';
	public $email = '';
	public $oaemail = '';
	public $homepage = '';
	public $qq = '';
	public $msn = '';
	public $intro = '';
	
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	private function escape_string(){
		if(!get_magic_quotes_gpc()){
			$this->realname	= pg_escape_string($this->realname);
			$this->username	= pg_escape_string($this->username);
			$this->password	= pg_escape_string($this->password);
			$this->address	= pg_escape_string($this->address);
			$this->intro	= pg_escape_string($this->intro);
		}
	}
	
	function add(){
		$this->escape_string();
		$sql = "INSERT INTO $this->tablename (
		              realname,         username,           password, 
                      usergroupid,      authorizationids,   score,
                      sex,              idno,               incid,
                      deptid,           iscw,               telephone,
                      mobilephone,      address,            postcode,
                      ipaddress,        email,              oaemail,
                      homepage,         qq,                 msn, 
                      intro)
              VALUES (
		              '$this->realname',      '$this->username',          '$this->password',
		               $this->usergroupid,    '$this->authorizationids',   $this->score,
		              '$this->sex',           '$this->idno',               $this->incid,
		               $this->deptid,          $this->iscw,              '$this->telephone',
		              '$this->mobilephone',   '$this->address',           '$this->postcode',
		              '$this->ipaddress',     '$this->email',             '$this->oaemail',
		              '$this->homepage',      '$this->qq',                '$this->msn',
		              '$this->intro')
		      RETURNING userid;";

		$this->userid = $this->pgsql->fetchVal($sql);
		return $this->userid;
}
	
	
	function update(){
		if($this->escaped) $this->escape_string();
		$sql = "UPDATE $this->tablename SET 
					realname = '$this->realname',
					password = '$this->password',
					usergroupid = $this->usergroupid,
					sex = '$this->sex',
					idno = '$this->idno',
					jointime = now(),
					incid = $this->incid,
					deptid = $this->deptid,
					telephone = '$this->telephone',
					mobilephone = '$this->mobilephone',
					address = '$this->address',
					postcode = '$this->postcode',
					ipaddress = '$this->ipaddress',
					email = '$this->email',
					oaemail = '$this->oaemail',
					homepage = '$this->homepage',
					qq = '$this->qq',
					msn = '$this->msn',
					intro = '$this->intro' 
				WHERE userid = $this->userid";
		return $this->pgsql->query($sql);
	}
	
	function getByUserid($userid){
		$sql = "SELECT * FROM $this->tablename WHERE userid='$userid'";
		$row = $this->pgsql->fetchRow($sql);
		if ($row) {
    		$this->userid 		= $row['userid'];
    		$this->realname		= $row['realname'];
    		$this->username		= $row['username'];
    		$this->password		= $row['password'];
    		$this->usergroupid	= $row['usergroupid'];
    		$this->authorizationids	= $row['authorizationids'];
    		$this->score		= $row['score'];
    		$this->sex			= $row['sex'];
    		$this->idno			= $row['idno'];
    		$this->jointime		= $row['jointime'];
    		$this->incid		= $row['incid'];
    		$this->deptid		= $row['deptid'];
    		$this->iscw			= $row['iscw'];
    		$this->telephone	= $row['telephone'];
    		$this->mobilephone	= $row['mobilephone'];
    		$this->address		= $row['address'];
    		$this->postcode		= $row['postcode'];
    		$this->ipaddress	= $row['ipaddress'];
    		$this->email		= $row['email'];
    		$this->oaemail		= $row['oaemail'];
    		$this->homepage		= $row['homepage'];
    		$this->qq			= $row['qq'];
    		$this->msn			= $row['msn'];
    		$this->intro		= $row['intro'];
    		$this->escape_string();
		}
		return $row;
	}
	
	function getByUsername($username){
		$sql = "SELECT * FROM $this->tablename WHERE username='$username'";
		return $this->pgsql->fetchRow($sql);
	}
	
	function getNameByUserid($userid){
		$sql = "SELECT username FROM $this->tablename WHERE userid=$userid";
		return $this->pgsql->fetchVal($sql);
	}
	
	function getGroupid($userid){
		$sql = "SELECT usergroupid FROM $this->tablename WHERE userid=$userid";
		return $this->pgsql->fetchVal($sql);
	}
	
	function register($username, $password){
		$username = pg_escape_string($username);
		$password = pg_escape_string($password);
		$sql = "SELECT row_to_json(t) FROM 
		       (SELECT userid,username,usergroupid,iscw 
		          FROM $this->tablename 
		          WHERE username='$username' AND password='$password') t";
		$json = $this->pgsql->fetchVAL($sql);
		if ($json) {
			$session = new Session();
			$session->write($json);
			return true;
		} else {
			return false;
		}
	}
	
	
	
	
	
}
?>