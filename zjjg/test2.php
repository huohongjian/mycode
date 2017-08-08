<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<meta http-equiv="pragma" content="no-cache" />
	</head>
	<body>

<?php
function __autoload($class_name) {include_once("class/".$class_name.".php");}
	
		$init = array(
			'uid'		=> -1,
			'uname'		=> '',
			'upassword'	=> '',
			'realname'	=> '',
			'corid'		=> 0,
			'telephone'	=> '',
			'mobile'	=> '',
			'ip'		=> '127.0.0.1',
			'email'		=> '',
			'submitable'=> false,
			'escape'	=> true
		);
		$p = array(
			'uname' => '霍\"宏\"建'
		);
		$p = array_merge($init, $p);
		
		$p['ip'] = '10.16.0.77';
		
		if($p['escape'] && !get_magic_quotes_gpc()){
			foreach ($p as $k=>$v){
				$p[$k] = pg_escape_string($v);
			}
		}
		
		while(list($k,$v)=each($p)){
				echo "$k:$v<br>";
			}
		
		
		echo "<br><br><br>*************************<br>";
		
		
	$user = new User();
	$row = $user->getByNamePwd('hhj','hhj;');
	if($row){
		echo $row['realname'];
	}
echo strtotime('2008-6-3 23:23');
?>
</body>
</html>