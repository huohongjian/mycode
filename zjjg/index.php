<?php
	function __autoload($classname) {include_once("class/".$classname.".php");} //不可以用绝对路径
	$db = new PostgreSQL();
	$div = new Div($db);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<title>河北省烟草专卖局(公司)资金监管中心</title>
		<link rel="stylesheet" type="text/css" href="css/main.css"/>
		<link rel="stylesheet" type="text/css" href="css/index.css" />
		<script type="text/javascript" src="cache/data.js"></script>
		<script type="text/javascript" src="javascript/jquery.pack.js"></script>
		<script type="text/javascript" src='javascript/function.js'></script>
		
		
		<style type="text/css">
			.tabBottom {height:200px; background:url(image/backimage/bgImg23.gif); margin-top:5px;}
		</style>
	</head>
	
	<body>
		<script type="text/javascript">document.write(jscode.header());</script>
		<div class="tab">
			<div class="tabLeft">
				<iframe scrolling="No" src="login.html" frameborder="no" style="width:225px; height:173px !important; height:172px; border:1px solid #FF8E00; margin-top:5px; padding-top:5px;"></iframe>
				<?php // $div->link(array('title'=>'站点导航', 'class'=>'newarticle', 'id'=>'nav')); ?>
			</div>
			<div class="tabRight">
				<?php $div->li(array('title'=>'最新通知', 'class'=>'information', 'categoryid'=>12, 'hasdate'=>true)); ?>
				<?php $div->scroll(array('title'=>'公告信息', 'class'=>'newarticle', 'id'=>'affiche', 'categoryid'=>11)); ?>
				<?php // $div->li(array('title'=>'待定', 'class'=>'computer', 'id'=>'speak', 'categoryid'=>13)); ?>
				
				<?php //  $div->li(array('title'=>'注意事项', 'class'=>'information', 'categoryid'=>12, 'hasdate'=>true)); ?>
				<?php //  $div->li(array('title'=>'使用说明', 'class'=>'computer', 'id'=>'speak', 'categoryid'=>13)); ?>
				<!--img src="image/index/yggf.jpg" width="665px" height="87px" style="margin-top:5px;" /-->
			</div>
			<div style="clear:both"></div>
			<div class="tabBottom"></div>
		</div>
		<script type="text/javascript">document.write(jscode.footer());</script>
		<script type="text/javascript">
			function vscroll_data0(){
		//	 	this.container_width = 160
				this.container_height = 132
				this.top_pause_offset = 10
			
			    /*Timing and Animation Speed*/
				this.initial_scroll_delay = 0
				this.animation_delay = 130
				this.animation_jump = 2
				this.animation_delay_mac = 100
				this.animation_jump_mac = 10
			
				/*Scroll Styles  */
				this.container_styles = "";
				this.item_link_styles = "font-size:9pt;";
				this.item_link_hover_styles = "";
				this.item_styles = "margin-bottom:15px;";
			
			}
		</script>
		<script type="text/javascript" src="javascript/scroll.js"></script>
	</body>
</html>
