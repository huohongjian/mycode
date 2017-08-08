<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv=Content-Type content="text/html; charset=utf-8">
		<title>文章列表</title>
		
		<script type="text/javascript" src="../_include/JQuery/jquery.js"></script>
		
		
<link rel="stylesheet" type="text/css" href="../_include/JQuery/plugin/flexigrid/flexigrid.css">
<script type="text/javascript" src="../_include/JQuery/plugin/flexigrid/flexigrid.js"></script>

		<script type="text/javascript" src='./javascript/share.js'></script>
		<script type="text/javascript" src='./cache/category_tree.js'></script>
		
		<script type="text/javascript" src="../_include/dtree/dtree.js"></script>
		<link type="text/css" rel="StyleSheet" href="../_include/dtree/dtree.css" />
		
		<style type="text/css">
			.tab {width:900px; margin:5px auto;}
			.tab_left {overflow:auto; padding:5px; float:left; width:180px; height:400px; border:1px solid #797979; background:#F6F9E8;#FFDD88;}
			.tab_right {padding:5px; float:right; width:692px; height:400px; background:#F1F8D1; border:1px solid #797979;}
			
			.tab_right ul {padding-left:6px; height:30px; line-height:30px;}
			.tab_right ul li {float:left;}
			.tab_right ul .adjust {margin-top:0px!important; margin-top:4px;}
			
			#list table {width:100%; background:green; margin:auto; table-layout:fixed; margin-bottom:5px;}
			#list .t_1 {width:5%;}	/*用px ie中是折行*/
			#list .t_2 {width:68%;}
			#list .t_3 {width:5%;}
			#list .t_4 {width:5%;}
			#list .t_5 {width:5%;}
			#list .t_6 {width:12%;}
			#list table td {text-align:center; background:white; overflow:hidden; white-space:nowrap; word-break:keep-all; text-overflow:ellipsis;}
			#list table .toleft {text-align:left; padding-left:5px;}
			#list table .toleft input {margin-right:3px;}
			#list table tr {height:28px; overflow:hidden;}
			
			#search_bar {padding:8px;}
			#search_field {width:100px;}
			#search_category, #search_field, #search_txt {margin:0px 15px 0px 5px;}
		</style>
			<style>
	
	.flexigrid div.fbutton .fresh
		{
			background: url(../_include/JQuery/plugin/flexigrid/images/load.png) no-repeat center left;
		}	

	.flexigrid div.fbutton .register
		{
			background: url(../_include/JQuery/plugin/flexigrid/images/add.png) no-repeat center left;
		}	

</style>
		<script type="text/javascript">
			var $searchField = 'categoryid';
			var $searchTxt = '-1';
			var $categoryid = -1;
			
			$(function(){
				flex();
			}
			);
			
			function flex(){
				$("#flex1").flexigrid(
					{
						url: 'action/test_flexigrid.php',
						dataType: 'json',
						colModel : [
						{display: '序号', name : 'id', width : 30, sortable : false, align: 'center'},
						{display: '文章标题', name : 'title', width : 360, align: 'left'},
						{display: '点击', name : 'counter', width : 30, align: 'center'},
						{display: '隐藏', name : 'hidetitle', width : 30, align: 'center'},
						{display: '发表', name : 'published', width : 30, align: 'center'},
						{display: '上传时间', name : 'posttime', width : 80, align: 'center'}
						],
					buttons : [
						{name: '刷新列表', bclass: 'fresh', onpress : test},
						{name: '注册附件', bclass: 'register', onpress : test},
						{separator: true}
						],
					searchitems : [
						{display: 'ISO', name : 'iso'},
						{display: 'Name', name : 'name', isdefault: true}
						],
					sortname: "id",
					sortorder: "asc",
					usepager: true,
					title: '附件列表',
					useRp: true,
					rpOptions: [1,2,3,4,5],
					rp:3,
					showTableToggleBtn: false,
					hideOnSubmit: false,
					width: 680,
					height: 250
					}
				); 
			}
			
				function test(com,grid){
				if (com=='Delete'){
						confirm('Delete ' + $('.trSelected',grid).html() + ' items?')
				}else if (com=='Add'){
					alert('Add New Item');
				}else if(com=='刷新列表'){
					refreshPath();
				}else if(com=='注册附件'){
					regist();
				}
			}
			
			window.onload = function(){
				create_tree(document.getElementById('tree'));
				$searchTxt = window.location.href.getQuery('id') || -1;
				$categoryid = $searchTxt;
	//			if($searchTxt!=-1) XHR('POST', './action/list.php', 'func=getCategoryName&categoryid='+$searchTxt);
		//		getPages_searchArticle();
			}
			
			
			function getPages_searchArticle(){
				var data = 'func=getnRows&categoryid='+$categoryid+'&searchField='+$searchField+'&searchTxt='+$searchTxt;
				XHR('POST', './action/list.php', data, getPages_searchArticle_back);
			}
			function getPages_searchArticle_back(obj){
				var rows = parseInt(obj.responseText);
				PageBar.CalculatePages(rows);
				setpagedo(1);
			}
			
			function setpagedo(page){
				PageBar.page = page;
				var number = PageBar.row;
				var data = "func=search&categoryid="+$categoryid+"&page="+page+"&num="+number+"&searchField="+$searchField+"&searchTxt="+$searchTxt;
				XHR('POST', './action/list.php', data, setpagedo_back);
			}
			function setpagedo_back(obj){
				document.getElementById('list').innerHTML = obj.responseText;
			}

			
			function clickleaf(treeid, categoryid, categoryname){
				$categoryid = categoryid;
				$searchField = 'categoryid';
				$searchTxt = categoryid;
				getPages_searchArticle();
				setValue('categoryname', categoryname);
			}
			function clicknode(treeid, categoryid, categoryname){
				clickleaf(treeid, categoryid, categoryname)
			}
			
			
			function search(){
				$searchField = getValue('search_field');
				$searchTxt = getValue('search_txt');
				getPages_searchArticle();
			}
		</script>
	</head>
	<body>
		
		<script type="text/javascript">Div.header();</script>
		
		<div class="tab">
			<div class="tab_left">
				<div id="tree"></div>
			</div>
			<div class="tab_right">
				<ul>
					<li style="width:150px; margin-top:0px!important; margin-top:2px;">
						当前类别：<span id="categoryname">全部类别</span>
					</li>	
					<li>字段:</li>
					<li class="adjust">
						<select id='search_field' style="border:1px solid #7F9DB9;">
							<option value="title">标题</option>
							<option value="number">文号</option>
							<option value="author">作者</option>
							<option value="content">内容</option>
						</select>
					</li>
					<li>内容:</li>
					<li class="adjust">
						<input type="text" id='search_txt' style="width:150px; height:18px; border:1px solid #7F9DB9;"/>
					</li>
					<li><a href="javascript:search()">查询</a></li>
				</ul>
				<table id="flex1" style="display:none;"></table>
				<div id="list"></div>
				<script type="text/javascript">document.write(PageBar.Html());</script>
			</div>
			<div class="AutoFitHeight"></div>
		</div>
		<script type="text/javascript">Div.footer();</script>
	</body>
</html>