<?php
function __autoload($classname) {
    include_once("class/$classname.php");
}
$pgsql = new PgSQL();
$session = new Session($pgsql);
$data = $session->read();
$uid = $data['userid'];
$gid = $data['usergroupid'];
$did = $data['iscw'];	//部门id

//echo "uid=$uid";
//echo var_dump($_SESSION);


$article = new Article($pgsql);
$articleid = intval($_GET['id']);
$row = $article->getById($articleid);
if($row){
	$category = new Category($pgsql);
	$parents = $category->parents($row['categoryid']);
	
	foreach ($parents as $parent) {
		$ArtCat .= " >> <a href='list.html?id={$parent['categoryid']}'>{$parent['name']}</a>";
	}
	$ArtCat .= " >> <a href='list.html?id={$row['categoryid']}'>$category->name</a>";
	$author = empty($row['author']) ? "" : "{$row['author']}　　";
	$neck = "{$author}上传时间：{$row['posttime']}　　点击次数：{$row['counter']}";

	$userid = $row['userid'];
	$ArtEdit = ($userid==$uid || (!empty($gid) && $gid<=2)) ? "<a href='edit.html?id=$articleid'>编辑</a>" : "";
	
	if(!$row['published'] && ($uid!=$userid && $gid!=1 || empty($uid))){
		$row['content'] = "<span style='color:red;'>此篇文章尚未发表，只可用户本人阅读，请登录或与文章上传者联系!</span>";
	}
	switch ($row['readlevel']){
		case 1: if(empty($uid)) {$row['content'] = "此篇文章只可注册用户阅读，请登录!";} break;
		case 2: if($did!=1 && $gid>2) {$row['content'] = "此篇文章只可财务用户阅读，您不具备此权限!";} break;
		case 3: if($gid!=4 && $gid>2) {$row['content'] = "此篇文章只可市局用户阅读，您不具备此权限!";} break;
		case 4: if($gid!=3 && $gid>2) {$row['content'] = "此篇文章只可省局用户阅读，您不具备此权限!";} break;
		case 5: if($uid!=$userid && $gid>2) {$row['content'] = "此篇文章只可用户本人阅读，您不具备此权限!";} break;
		default: break;
	}
	$plus = $article->counter_plus($articleid);
	//注册阅读列表：
	$browselist = new BrowseList($pgsql);
	$browselist->articleid = $articleid;
	$browselist->ipaddress = $_SERVER["REMOTE_ADDR"];
	$browselist->userid = $uid;
	$browselist->add_update();
}
?>	




<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>浏览文章</title>
		<style type="text/css">
			.reply_title {width:100%; height:25px; line-height:25px; background:#F1F8D1; #9ABFD9; border-top:1px solid #5A83A1; border-bottom:1px solid #5A83A1;}
			.reply_title p {float:left;}
			.reply_title .username {margin-left:5px; width:200px;}
			.reply_title .posttime {width:300px;}
			.reply_title a {cursor:pointer;}
			.reply_body {min-height:50px; height:auto!important; height:50px; padding:10px;}
			.reply_body a:link {text-decoration:underline;}
			.reply_body a:hover {text-decoration:underline;}
			.reply_body a:visited {text-decoration:underline;}
			
			#Art {width:898px; min-height:450px; height:auto!important; height:450px; margin:5px auto; border:#DBDBDB 1px solid; background:#FDFDFD; _#f4f7ff;}
			#ArtTitleM, #ArtTitleL, #ArtTitleR {display:block; height:26px; line-height:26px;}
			#ArtTitleM {background:url('image/index/hhj_bc_1.jpg');}
			#ArtCat {padding:0 15px;}
			#ArtEdit {padding:0 15px; font-weight:bold; float:right; }
			
			#ArtBody {font-size:11pt; width:760px; margin:20px auto; overflow:auto; text-align:center;}
			#ArtBody #ArtTitle {font-size:18pt; font-family:黑体; line-height:35px; text-align:center; margin:8px 20px;}
			#ArtBody #ArtNumber {width:100%; text-align:center; color:red; line-height:30px;}
			#ArtBody #ArtHr {display_:none; width:100%; height:2px; color:red; background:red; border:0px; margin:5px 0px!important; margin:0px;}
			#ArtBody #ArtNeck {text-align:center; padding:8px 0px; color:blue; line-height:30px; display:block; background_:red;}
			#ArtBody #ArtContent {font-family:仿宋_GB2312,仿宋; font-size:15pt; line-height:36px; text-align:left;}
			#ArtBody #ArtContent a:link {text-decoration:underline;}
			#ArtBody #ArtContent a:hover {text-decoration:underline;}
			#ArtBody #ArtContent a:visited {text-decoration:underline;}
			
		</style>
		<script type="text/javascript" src="../_include/JQuery/jquery.js"></script>
		<script type="text/javascript" src='javascript/share.js'></script>
				
		<script type="text/javascript">
			var $articleid = window.location.href.getQuery('id') || -1;
			
			$(document).ready(function(){
				if(<?php echo $row['isreply']; ?>){
					$('#replydiv').show();
					getpagesnum();
				}
			})

			function getpagesnum(){
				$.post('./action/browse.php',
				{
					func:		'getpagesnum',
					articleid:	$articleid
				},
				function(data){
					var rows = parseInt(data);
					PageBar.CalculatePages(rows,10);
					refresh_reply(1);
				}
				);
			}
			
			function refresh_reply(page){
				if(!isNaN(page)) PageBar.page = page;
				var params = "func=refresh_reply&articleid="+$articleid+"&page="+PageBar.page+"&num="+PageBar.row;
				$.ajax({
					url:		'./action/browse.php',
					type:		'post',
					dataType:	'json',
					data:		params,
					success:	refresh_reply_back
				});
			}
			function refresh_reply_back(jsons){
				$("#reply_content").empty();
				$.each(jsons, function(k, json){
					var username = json['isanonymous']==1 ? 'anonymous' : json['username'];
					var html = "<div class='reply_title' answerid='"+json['answerid']+"'>\
									<p class='username'>网友："+username+"</p>\
									<p class='posttime'>发表时间："+json['posttime']+"</p>\
									<a class='agree' onclick='agree(this)'>支持本贴</a>\
									[<span>"+json['agree']+"</span>]\
									<a class='oppose' onclick='oppose(this)'>反对本贴</a>\
									[<span>"+json['oppose']+"</span>]\
								</div>\
								<div class='reply_body'  ondblclick='edit_reply(this)'>"+json['content']+"</div>";
					$(html).appendTo("#reply_content");
				}
				);
			}
			
			function setpagedo(page){
				refresh_reply(page);
			}
		
			function display_reply_div(){
				var obj = document.getElementById('reply_div');
				obj.value = '';
				var width = 330;
				var height = 160;
				var left = screen.width/2 - width/2;
				var top = document.documentElement.scrollTop + screen.height/2 - height*0.518;
				obj.style.left = left+'px';
				obj.style.top = top+'px';
				obj.style.display = "block";
			}
			
			function say(){
				$answerid = -1;
				$('#reply').val('');
				$('#anonymous').attr('checked',false);
				display_reply_div();
			}
			
			var $answerid = -1	//新增和修改共用answerid
			function addreply(){
				if($articleid==-1) {alert('请您指定需要回复的文章id!'); return;}
				var content = $.trim($('#reply').val());
				if(content=='') {alert('不能提交空信息!'); return;}
				
				var isanonymous = $('#anonymous').attr("checked") ? 1 : 0;
				$.post('./action/browse.php',
				{
					func:		'addreply',
					answerid:	$answerid,
					articleid:	$articleid,
					isanonymous:isanonymous,
					content:	content
				},
				function(data){
					eval("json="+data);
					switch(json.msg){
						case 'nologin'	: alert('请您先登录!'); break;
						case 'addOK'	: alert('回复添加成功!'); break;
						case 'updateOK'	: alert('回复更新成功!'); break;
						default: alert('发生未知错误,请与系统管理员联系!');
					}
					close_div();
					PageBar.rows++;
					PageBar.CalculatePages();
					refresh_reply(1);
				}
				);
			}
			
			function deleteAnswer(){
				if(!confirm('此贴删除后,不可恢复,是否继续?')) return;
				$.post('./action/browse.php',
				{
					func:		'deletereply',
					answerid:	$answerid
				},
				function(data){
					if(data==1){
						$answerid = -1;
						close_div();
						PageBar.rows--;
						PageBar.CalculatePages();
						refresh_reply();
					}else{
						alert('此贴未能删除!')
					}	
				}
				);
			}
			
			function close_div(){
				document.getElementById('reply_div').style.display='none';
			}
			
			function edit_reply(obj){
				$answerid = $(obj).prev().attr('answerid');
				
				$.post('./action/browse.php',
				{
					func:		'hasPower',
					answerid:	$answerid
				},
				function(data){
					if(data==1){
						var username = $(obj).prev().children().html();
						if(username=='网友：anonymous') $('#anonymous').attr("checked", true);
						else $('#anonymous').attr("checked", false);
						var content = $(obj).html();
						$('#reply').val(content);
						display_reply_div();
					}else{
			//			alert('你尚未登录!')
					}
				}
				);
				
			}
			
			
			function agree(obj){
				var answerid = $(obj).parent().attr('answerid');
				$.post('./action/browse.php',
				{
					func:		'agree',
					answerid:	answerid
				},
				function(data){
					if(data==1){
						var n = $(obj).next().html();
						$(obj).next().html(parseInt(n)+1);
						alert('谢谢你的支持!请你继续关注本站!');
					}
				}
				);
			}
			
			function oppose(obj){
				var answerid = $(obj).parent().attr('answerid');
				$.post('./action/browse.php',
				{
					func:		'oppose',
					answerid:	answerid
				},
				function(data){
					if(data==1){
						var n = $(obj).next().html();
						$(obj).next().html(parseInt(n)+1);
						alert('请发表您的高见!');
					}
				}
				);
			}
		</script>
	</head>
	<body>
		<script type="text/javascript">Div.header();</script>
		<?php echo "
			<div id='Art'>
				<span id='ArtTitleM'>
					<span id='ArtTitleL'>
						<span id='ArtTitleR'>
							<span id='ArtEdit'>$ArtEdit</span>
							<span id='ArtCat'>$ArtCat</span>
						</span>
					</span>
				</span>
				<div id='ArtBody'>
					<div id='ArtTitle'>{$row['title']}</div>
					<span id='ArtNumber'>{$row['number']}</span>
					<hr id='ArtHr'/>
					<span id='ArtNeck'>$neck</span>
					<div id='ArtContent'>{$row['content']}</div>
				</div>
			</div>";
		?>
		<div id="replydiv" style='display:none; width:900px; margin:5px auto; border:1px solid #ADB9C2;'>
			<div style='background:#D9DADC; padding:10px;'>
				<script type='text/javascript'>document.write(PageBar.Html());</script>
 				<a href='javascript:say()'>我来说两句</a>
 				<a href='javascript:refresh_reply(1)' style="margin-left:20px;">刷新回复</a>
			</div>
			<div id='reply_content'></div>
		</div>
		<div id="reply_div" style="display:none; padding:6px 2px; position:absolute; text-align:center; width:333px; background:#F1F8D1; border:1px solid #a7cafa;">
			<h4>我来说两句</h4>
			
			<textarea id="reply" style="border:1px solid #7F9DB9; width:300px; height:120px; padding:5px; margin:10px;"></textarea>
			<input type="checkbox" id="anonymous" checked=false/>
			<label for="anonymous" style="margin-right:20px;">匿名发表</label>
			<a href="javascript:addreply()">提交发表</a>
			<a href="javascript:deleteAnswer()" style="margin:0px 20px;">删除此贴</a>
			<a href="javascript:close_div()">关闭此窗口</a>
			<div style="margin-top:5px;"><b style="color:red;">双击已发表的回复,可进行修改和编辑。</b></div>
		</div>
		<script type="text/javascript">Div.footer();</script>
	</body>
</html>



