<?php

class Cache{
	
	private $pgsql;
	private $tablename = 'c_cache';
	public $cacheid;
	public $thetime;
	public $value;
	
	function __construct(&$pgsql=null){
		$this->pgsql = $pgsql ? $pgsql : new PgSQL();
	}
	
	function add($cacheid, $value){
		$cacheid = pg_escape_string($cacheid);
		$value = pg_escape_string($value);
		
		$sql = "SELECT COUNT(cacheid) FROM $this->tablename WHERE cacheid='$cacheid'";
		if($this->pgsql->fetchVal($sql)){
			$sql = "UPDATE $this->tablename SET thetime=now(), value='$value' WHERE cacheid='$cacheid'";
		}else{
			$sql = "INSERT INTO $this->tablename(cacheid, value) VALUES ('$cacheid', '$value')";
		}
		return $this->pgsql->query($sql);
	}
	
	function delete($cacheid){
		$sql = "DELETE FROM $this->tablename WHERE cacheid='$cacheid'";
		return $this->pgsql->query($sql);
	}
	
	function get_value_byid($cacheid){
		$sql = "SELECT value FROM $this->tablename WHERE cacheid='$cacheid'";
		return  $this->pgsql->fetchVal($sql);
	}
	
	function create_tree_jsfile($cacheid) {
		
	}
	
	function get_tree($cacheid){
		$sql = "SELECT value FROM $this->tablename WHERE cacheid='$cacheid'";
		$info = $this->pgsql->fetchVal($sql);
		$js = "
				<script type='text/javascript'>
					d = new dTree('d', '../include/dtree/');
					$info
					document.write(d);
					d.openTo(2, false);
					d.openTo(30, false);
				</script>";
		return $js;
	}
	

	
}

?>