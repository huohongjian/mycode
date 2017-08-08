<?php
	function __autoload($class_name){include_once("../class/$class_name.php");}
	
	$payout = new Payout();
	$corid	= $_REQUEST['corid'];
	$cid	= $_REQUEST['cid'];
	$sdate	= $_REQUEST['sdate'];
	$edate	= $_REQUEST['edate'];
	$rs = $payout->getForExcel($corid, $cid, $sdate, $edate);
	
	$xls = new ExcelXML();
	$xls->headers = array('序号', '单号', '日期', '类别', '摘要', '借方', '贷方', '余额');
	$xls->addSeqence = true;
	$xls->addArray ( $rs );
	$xls->generateXML ("account");

?>