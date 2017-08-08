<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>河北烟草国有资产监管系统</title>
	<link type='text/css' rel='stylesheet' href='css/main.css' />
	<script type="text/javascript" src="js/main.js"></script>
	<script type="text/javascript" src="cache/js/data.js"></script>
	
	<link type='text/css' rel='stylesheet' href='js/dgrid/dgrid.css' />
	<script type="text/javascript" src="js/dgrid/dgrid.js"></script>
	
	<style type="text/css">
		
		
	</style>
	<script type="text/javascript">
	
	</script>
</head>
<body scroll="no">
	<div id="frame_top"></div><!--frame_top-->
	<div id="frame_middle">
		<div id="frame_left">
			
		</div><!--frame_left--><div id="frame_splitter"></div>
		<div id="frame_right">
			<?php
				echo "index.php<br/>";
				
				require_once("creole/Creole.php");
				$dsn = "pgsql://pgsql@localhost:5432/gzjg";
				$conn = Creole::getConnection($dsn);
				echo $conn;
			?>
		</div><!--frame_right-->
	</div><!--frame_middle-->
	<div id="frame_bottom"></div><!--frame_bottom-->
</body>
<script type="text/javascript">

</script>
</html>