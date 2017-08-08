<?php
/* PostgreSQL 8.* Simple Usage Class
* copyleft (c) bianbian
* http://bianbian.org
*/
  

class PostgreSQL {

    public $dbhost   = 'localhost';
    public $dbuser   = 'pgsql';
    public $dbpw     = '';
    public $dbname   = 'zjjg';
    public $dbport   = 5432;
    public $pconnect = 0;
  
    public $querynum = 0;
    public $dbconnect;
  
    function __construct($usedefaultset=1) {
        if($usedefaultset) $this->connect();
    }
    
    function __destruct() {
		$this->close();
	}
    
    function connect() {
        $connect = "host=".$this->dbhost." port=".$this->dbport." dbname=".$this->dbname." user=".$this->dbuser;
        if (!empty($this->dbpw))
            $connect.=" password=".$this->dbpw;
        
        if ($this->pconnect)
            $this->dbconnect=pg_pconnect($connect);
        else
            $this->dbconnect=pg_connect($connect);
  
        if (!$this->dbconnect)
            $this->halt("Cannot connect to database");
    }
  
    function query($sql, $silence = 0) {
        $result = pg_query($this->dbconnect, $sql);
        if(!$result && !$silence) {
            $this->halt('PgSQL Query Error', $sql);
        }
        $this->querynum++;
        return $result;
    } 
  
    // does a query and returns first row by reference
    function & query_first($sql, $result_type = PGSQL_ASSOC) {
 //   	echo $sql;
        $result = $this->query($sql);
        $returnarray = @pg_fetch_array($result, 0, $result_type);
        $this->free_result($result);
        return $returnarray;
    } 
    
    function & query_all($sql, $result_type = PGSQL_ASSOC) {
        $result = $this->query($sql);
        $returnarray = (function_exists("pg_fetch_all"))
            ? pg_fetch_all($result)
            : $this->fetch_all($result, $result_type);
        $this->free_result($result);
        return $returnarray;
    }
    
    function & query_value($sql, $i=0) {
    	$row = $this->query_first($sql,PGSQL_NUM);
    	return $row[$i];
    }
    
    function fetch_array($result, $row, $result_type = PGSQL_ASSOC) {
        return @pg_fetch_array($result, $row, $result_type);
    }
    
    function fetch_all($result) {
        while ($row = pg_fetch_assoc($result)) {
            $array_out[] = $row;
        }
        return $array_out;
    }
    
    function affected_rows() {
        return pg_affected_rows();
    }
  
    function error() {
        return pg_last_error();
    }
  
    function num_rows(&$query) {
        return pg_num_rows($query);
    }
  
    function num_fields(&$query) {
        return pg_num_rows($query);
    }
  
    function free_result(&$query) {
        return pg_free_result($query);
    }
  
    function fetch_row(&$query) {
        return pg_fetch_row($query);
    }
  
    function close() {
        if ($this->pconnect)
            return pg_close();
    }
  
    function halt($message = '', $sql = '') {
        $timestamp = time();
        $errmsg = '';
    
        $dberror = $this->error();
    
        if($message) {
            $errmsg = "<b>info</b>: $message\n\n";
        }
        $errmsg .= "<b>Time</b>: ".gmdate("Y-n-j g:ia", $timestamp)."\n";
        $errmsg .= "<b>Script</b>: ".$_SERVER['PHP_SELF']."\n\n";
        
        if($sql) {
            $errmsg .= "<b>SQL</b>: $sql\n";
        }
        $errmsg .= "<b>Error</b>:  $dberror\n\n";
    	
        $errmsg = nl2br($errmsg);
        echo "<p>$errmsg</p>";
        exit;
    }
}
?>