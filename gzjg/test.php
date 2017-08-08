<?php
	function __autoload($class) { include_once("class/$class.php"); }
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>河北烟草国有资产监管系统</title>
	<link type='text/css' rel='stylesheet' href='css/frame.css' />
	<style type="text/css">
		
	</style>
</head>
<body scroll="no">
	<div class="frame_top"><h2>河北烟草(HeBei Tobacco gyzc Manage)</h2></div>
	<div class="frame_middle">
		<div class="frame_left">
		
			<script type="text/javascript">
				var str = "Visit W3School hhj W3School";
				var patt = new RegExp("W.School", "g");
				var result;
				
				while ((result = patt.exec(str)) !=null) {
					document.write("<br/>");
					document.write(result);
					document.write("<br/>");
					document.write(result.lastIndex);
				}
			
			</script>
		
		
		
			
		</div><!--frame_left-->
		
		<div class="frame_right">
			<?php
				$ses = new Session();
				$ses->uid = 139;
				$_SESSION['name'] = 'hhj';
				$_SESSION['sex'] = 4;
				
		$db = new DB("sqlite");
$sql = "select cname from public.url where uid=:uid";
$stmt = $db->prepare($sql);
$stmt->bindParam(":uid", $uid);
$uid=2;
$stmt->execute();

//$rs->setFetchMode(PDO::FETCH_ASSOC);
$ss = $stmt->fetchAll();
//$ss = $rs->fetchColumn(4);
//$ss = $rs->fetchAll(PDO::FETCH_COLUMN);
print_r($ss);




			?>

		</div><!--frame_right-->
	</div><!--frame_middle-->
	<div class="frame_bottom">版权所有:河北省烟草专卖局（公司）财务管理处　CopyRight@ 2008-2012　最佳分辨率1024*768　技术支持:0311-88607956</div>
</body>
</html>