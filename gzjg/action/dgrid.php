<?php
	include_once('_init.php');
	function getList(){
		$json = "{
					page:10,
					total:100,
					rows:[
					{id:1, cell:['11,234','w\"h','5','2008']},
					{id:1, cell:['1','hhj','5','2008']},
					{id:1, cell:['1','hhj','5','2008']}
					]
				}";
		return $json;
	}
	
	

?>