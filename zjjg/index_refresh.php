<?php
	$s_fname = "index.php"; 
	$o_fname = "index.html";
	
	ob_end_clean(); 
	ob_start(); 
	include($s_fname); 
	$length = ob_get_length(); 
	$buffer = ob_get_contents(); 
	ob_end_clean(); 

	$fp = fopen($o_fname,"w+"); 
	fwrite($fp,$buffer); 
	fclose($fp);
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>更新首页</title>
	</head>
	<body>
		首页更新完毕!<br><br>自动关闭此窗口!
		<script type="text/javascript">
			setTimeout(function(){window.close();},800);
		</script>
	</body>
</html>

