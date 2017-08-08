
		<?php
	//		function __autoload($classname) {include_once("class/".$classname.".php");} //不可以用绝对路径
			
			$s_fname = "index.php"; 
			$o_fname = "index.html";
			
			ob_end_clean(); 
			ob_start(); 
			include($s_fname); 
			$length = ob_get_length(); 
			$buffer = ob_get_contents(); 
			//$buffer = eregi_replace("r","",$buffer); 
			ob_end_clean(); 

			$fp = fopen($o_fname,"w+"); 
			fwrite($fp,$buffer); 
			fclose($fp);
			
			
			//更新cache/desktop.json文件
			$o_fname = "cache/desktop.json";
			$article = new Article();
			$num = $article->getNumInHours(24);
			
			date_default_timezone_set("PRC");
			$buffer = "{\"newArtNum\":\"$num\", \"loopRow\":[";
			$rows = $article->get_bycategoryid(10, '3');
			foreach ($rows as $row){
				$id = $row['articleid'];
				$title = $row['caption'] ? $row['caption'] : $row['title'];
				$s = strtotime($row['posttime']);
				$md = date("[m-d]",$s);
				$buffer .= "{\"id\":\"{$id}\", \"title\":\"$title $md\"},";
			}
			
			$buffer = substr($buffer,0,-1)."]}";
			$fp = fopen($o_fname,"w+"); 
			fwrite($fp,$buffer); 
			fclose($fp);
		?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>更新首页</title>
	</head>
	<body>
		首页更新完毕!<br><br>自动关闭此窗口!
		<script type="text/javascript">
//			alert("首页更新完毕!");
			setTimeout(function(){window.close();},600);
		</script>
	</body>
</html>

