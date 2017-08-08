<?php
	function __autoload($class) {
	    include_once("class/$class.php");
	}
	
//	$html = new Html();
//	$html->Init();
	
	$pgsql = new PgSQL();
	$article = new Article($pgsql);
	$div = new Div($pgsql);
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="keywords" content="html,xhtml,基础,教程,语言,标签,代码" />
		<meta name="description" content="个人积累" />
		<title>河北省烟草专卖局(公司)财务管理处</title>
		<link href="/cwc/css/index.css" rel="stylesheet" type="text/css" />
		<script type="text/javascript" src="javascript/jquery.js"></script>
		<script type="text/javascript" src='javascript/share.js'></script>
	</head>
	
	<body>
		<script type="text/javascript">Div.header();</script>

		<div class="tab">
			<div class="tab_left">
				<?php $div->scroll(array('title'=>'公告信息', 'class'=>'newarticle', 'id'=>'affiche', 'categoryid'=>11)); ?>
				<?php $div->li(array('title'=>'最近更新', 'class'=>'newarticle', 'categoryid'=>1, 'limit'=>'10')); ?>
				<?php $div->li(array('title'=>'点击排名', 'class'=>'newarticle', 'categoryid'=>-2, 'limit'=>'10')); ?>
				<?php $div->link(array('title'=>'站点导航', 'class'=>'newarticle', 'id'=>'nav')); ?>
			</div>
			<div class="tab_right">
			<?php $div->li(array('title'=>'最新通知', 'class'=>'information', 'categoryid'=>12, 'hasdate'=>true)); ?>
			<?php $div->img(array('id'=>'imgnews', 'class'=>'imgnews', 'categoryid'=>1, 'islink'=>true, 'hastitle'=>true, 'hastxt'=>true)); ?>
			
            
            <?php $div->li(array('title'=>'政策法规', 'class'=>'information', 'categoryid'=>30, 'hasdate'=>true)); ?>   
			<?php $div->li(array('title'=>'领导讲话', 'class'=>'computer', 'id'=>'speak', 'categoryid'=>13)); ?>
			
			<?php $div->li(array('title'=>'学习交流', 'class'=>'information', 'categoryid'=>50, 'hasdate'=>true)); ?>
			<?php $div->li(array('title'=>'行业文件', 'class'=>'computer', 'id'=>'document', 'categoryid'=>14)); ?>
			
			<?php $div->img(array('id'=>'middle_img', 'categoryid'=>2)); ?>
			
			<?php $div->li(array('title'=>'行业信息', 'id'=>'xx', 'class'=>'computer', 'categoryid'=>15)); ?>    
		    <?php $div->li(array('title'=>'会计软件', 'id'=>'fx', 'class'=>'computer right', 'categoryid'=>17)); ?>
            
			<?php $div->li(array('title'=>'电脑知识', 'class'=>'computer', 'categoryid'=>70)); ?>
			<?php $div->li(array('title'=>'网络文摘', 'class'=>'computer right', 'categoryid'=>90)); ?>
			</div>
		</div>
		<div class="AutoFitHeight"></div>
		<script type="text/javascript">Div.footer();</script>
		
		
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
<script type="text/javascript" src="./javascript/scroll.js"></script>
	</body>
</html>

