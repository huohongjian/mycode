<?php
	function __autoload($class){
	    include_once("./class/$class.php");
	}
	$session = new Session();
	$data    = $session->read();
	$uid = $data['userid'];
	$gid = $data['usergroupid'];
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Administator</title>
		<script type="text/javascript" src="../_include/JQuery/jquery.js"></script>
		<script type="text/javascript" src='./javascript/share.js'></script>
		<script type="text/javascript" src="../_include/tabs/tabpane/js/tabpane.js"></script>
		<link type="text/css" rel="stylesheet" href="../_include/tabs/tabpane/css/luna/tab.css" />
		<style type="text/css">
			.tab-pane {width:_800px; height_:300px; background_:lightblue; margin:auto;}
			.tab-page{width:875px; height:360px; text-align:left;}
		</style>
		
		<style type="text/css">
			.tab {width:900px; margin:5px auto; height:400px;}
			.tab_left {overflow:auto; padding:5px; float:left; width:180px; height:400px; border:1px solid #797979; background:#F6F9E8;#FFDD88;}
			.tab_right {padding:5px; float:right; width:692px; height:400px; background:#F1F8D1; border:1px solid #797979;}
		</style>
		
		<script type="text/javascript">
			function getArticleTitle(index){
				$('input[@name*=articleid]').each(function(i){
					$.get(
						'action/admin.php',
						{
							func:	'getArticleTitle',
							articleid:	this.value
						},
						function(data){
							$('span[@name=artiletitle]')[i].innerHTML = data;
						}
					);
				});
			}
			function changeArticleId(){
				$.get(
					'action/admin.php',
					{
						func:	'changeArticleId',
						articleid0:	$('input[@name*=articleid]')[0].value,
						articleid1:	$('input[@name*=articleid]')[1].value
					},
					function(data){
						alert(data);
					}
				);
			}
		
		
			function getBrowseList(){
				var obj = new Object();
				obj.func = "getBrowseList";
				obj.articleid = getValue('textArticleid');
				XHR('POST', './action/admin.php', obj.toJSONString(), getBrowseList_back());
			}
			function getBrowseList_back(obj){
				setValue('browselist',obj.responseText);
				var json = obj.responseText.parseJSON()[0];
				for(var k in json){
		//			alert(k);
		///			alert(k.isPrototypeOf());
				}
			}
			
			function delQuanXian(){
				var userid = $('#userid').val();
				if(userid==''){
					alert('请指定用户id号');
					return;
				}
				if(!confirm('你在执行删除权限操作,请确认')) return;
				$.get('action/admin.php',
				{
					func:	'delQuanXian',
					userid:	$('#userid').val()
				},
				function(data){
					alert(data);
				}
				);
			}
			
			function setQuanXian(flag){
				var userid = $('#userid').val();
				if(userid==''){
					alert('请指定用户id号');
					return;
				}
				$.get('action/admin.php',
				{
					func:	'setQuanXian',
					userid:	userid,
					flag:	flag
				},
				function(data){
					alert(data);
				}
				);
			}
		</script>
	</head>
	<body>
		<script type="text/javascript">Div.header();</script>
		<div class="tab">
			<div class="tab-pane">
				<div class="tab-page">
					<h2 class="tab">登录信息</h2>
					<?php
						
						if($gid>2 || empty($gid)){
							echo "你不是系统管理员,你没有操作权限,如有问题请与系统管理员联系。<br/><br/>此页1秒种后自动跳转首页。";
							echo "<script type='text/javascript'>setTimeout(function(){window.location.href='./'},1);</script>";
						}else{
							echo "欢迎你, $uid 号系统管理员,请小心操作,避免错误!";
						}
					?>
				</div>
			
				<div class="tab-page">
					<h2 class="tab">数据库</h2>
					<a href="./admin/install.php">安装数据库</a>
					<br/><br/>
					<a href="./admin/create_file_jstree.php">create_file_jstree</a>
				</div>
				
				<div class="tab-page">
					<h2 class="tab">权限设置</h2>
					设置文章添加类别权限：
					用户ID号：<input type="text" id="userid"/>
					<button onclick="delQuanXian()">删除权限</button>
					<button onclick="setQuanXian('admin')">系统管理员权限</button>
					<button onclick="setQuanXian('sgs')">省公司权限</button>
					<button onclick="setQuanXian('fgs')">市公司权限</button>
				</div>
				
				<div class="tab-page">
					<h2 class="tab">阅读列表</h2>
					文章ID号：<input type="text" id="textArticleid"/>
					<button onclick="getBrowseList()" style="margin:0px 20px;">GO</button>
					文章名称：<span id='articlename'></span>
					<div id="browselist"></div>
				</div>
				
				<div class="tab-page">
					<h2 class="tab">互换id号</h2>
					文章Id号1：<input type="text" name="articleid"/>
					文章名称：<span name="artiletitle"></span>
					<br>
					文章Id号2：<input type="text" name="articleid"/>
					文章名称：<span name="artiletitle"></span>
					<br><br>
					<button onclick="getArticleTitle()">获取文章名称</button>
					<button onclick="changeArticleId()">互换文章Id号</button>
				</div>
			</div>
			
		</div>
		
		<script type="text/javascript">Div.footer();</script>
	</body>
</html>