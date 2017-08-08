<?php
class File{
	
	function __construct(){
	}
	
	function read($name, $mode='r'){
		$fhandle = fopen($name, $mode);
		$text = '';
		while(!feof($fhandle)){
			$text .= fread($fhandle, 4096);	 //4096B
		}
		fclose($fhandle);
		return $text;
	}
}




?>