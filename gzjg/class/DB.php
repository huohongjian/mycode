<?php

class DB extends PDO {
	public function __construct ($dsn="pgsql:host=localhost;dbname=gzjg", $usr="pgsql", $pwd="", $opt=array()) {
		if ($dsn=="sqlite") $dsn = "sqlite:{$_SERVER['DOCUMENT_ROOT']}/gzjg/data/test1.sqlite";
		try {
			parent::__construct($dsn, $usr, $pwd, $opt);
		} catch (PDOException $e) {
			$this->halt($e);
		}
		parent::setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		parent::setAttribute(PDO::ATTR_CASE, PDO::CASE_LOWER);
	}
	
	public final function query($sql) {
		try {
			return parent::query($sql);
		} catch (PDOException $e) {
			$this->halt($e, $sql);
		}
		return null;
	}
	
	private function halt($excep, $sql) {
		$msg = $excep->getMessage();
		$tra = $excep->getTraceAsString();
		$tra = str_replace("#1","<br/>#1",$tra);
		$tra = str_replace("#2","<br/>#2",$tra);
		die("SQL:$sql<br/>Error:$msg<br/>$tra");
	}
}

?>