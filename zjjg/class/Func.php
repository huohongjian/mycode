<?php

class Func {
	
	static function explodeString($str, $rowSeperator='{`r`}', $colSeperator='{`c`}'){
		if(empty($str)) return false;
		$results = array();
		$rs = explode($rowSeperator, $str);
		for ($i=0; $i<count($rs); $i++) {
			$results[$i] = explode($colSeperator, $rs[$i]);
		}
		return $results;
	}
	
	static function getMonthLastDay($year, $month){
		$d = mktime(0, 0, 0, $month, 1, $year);
		return date('t', $d);
	}
	
	static function getdate($dateString){
		return preg_split('/[\/\-\. :]/', $dateString);
	}
	
	
}
?>