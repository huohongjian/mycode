<?php
/**
 * ============================================================
 *         PgSQL Class v1.0_2016.06.30
 * -------------------------------------------------------------
 * Copyright (C) HuoHongJian All Rights Reserved.
 * =============================================================
 */

class PgSQL {
    public $host    = 'localhost';
    public $port    = 5432;
    public $user    = 'pgsql';
    public $pwd     = '';
    public $dbname  = 'cwc';
    public $pconn   = FALSE;
    
    private $linkid;
    private $queryid;
    private $result;
    private $querycount = 0;
    
    
    function __construct($autoConnect=TRUE) {
        if ($autoConnect) {
            $this->connect();
        }
    }
    
    
    function connect() {
        $conn = "host    = {$this->host}
                 port    = {$this->port}
                 dbname  = {$this->dbname}
                 user    = {$this->user}
                 password= {$this->pwd}";
        try {
            if ($this->pconn) {
                $this->linkid = @pg_pconnect($conn);
            } else {
                $this->linkid = @pg_connect($conn);
            }
            if (!$this->linkid) {
                throw new Exception("Could not connect to database server!");
            }
        } catch (Exception $e) {
            die ($e->getMessage());
        }
    }
    
    
    function query($sql) {
//    	echo "{$sql}<br>";
        try {
            $this->result = pg_query($this->linkid, $sql);
            if (!$this->result) {
                throw new Exception("The database query failed!");
            }
        } catch (Exception $e) {
            die($e->getMessage());
        }
        $this->querycount ++;
        return $this->result;
    }
    
    
    function fetchAll($sql) {
        $this->query($sql);
        return @pg_fetch_all($this->result);
    }


    function fetchRow($sql, $row=0, $type=PGSQL_ASSOC) {    //NUM:以编号为键值; ASSOC:以字段名为键值; BOTH:同时用两者为键值;
        $this->query($sql);
        return @pg_fetch_array($this->result, $row, $type);
    }
    
    
    function fetchObj($sql, $row=0, $type=PGSQL_ASSOC) {
        $this->query($sql);
        return @pg_fetch_object($this->result, $row, $type);
    }

    
    function fetchVal($sql, $row=0, $col=0) {
        $this->query($sql);
        $row = @pg_fetch_row($this->result, $row);
        if ($row) {
            return $row[$col];
        } else {
            return FALSE;
        }
    }

    
    function numRows() {
        return @pg_num_rows($this->result);
    }
    
    
    function numFields() {
        return @pg_num_fields($this->result);
    }

    
    function affectdRows() {
        return @pg_affected_rows($this->linkid);
    }
    
    
    function numQueries() {
        return $this->querycount;
    }
    
    
    function close() {
        if ($this->linkid) @pg_close();
    }
    
    
    function __destruct(){
        $this->close();
    }
}
?>