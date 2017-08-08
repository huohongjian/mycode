<?php
	function __autoload($class) { 
	    include_once("../class/$class.php"); 
	}

	
	
	call_user_func($_POST['func']);
	
	function getnRows(){
	    $pgsql   = new PgSQL();
	    $article = new Article($pgsql);
	    $session = new Session($pgsql);
	    $userid = $session->read('userid');
	    if(empty($userid)) {
	        $userid = -1;
	    }
	    echo $article->getMyCount($_POST['categoryid'], $userid, $_POST['field'], $_POST['value']);
	}
	
	function search(){
	    $pgsql   = new PgSQL();
	    $article = new Article($pgsql);
	    $session = new Session($pgsql);
	    $userid = $session->read('userid');
	    if(empty($userid)) {
	        $userid = -1;
	    }
	    $number 	= $_POST['num'] ? $_POST['num'] : 10;
	    $page 		= $_POST['page'] ? $_POST['page'] : 1;
		$s = ($page-1)*$number;
		$limit = $number;
		$offset = $s;
		$rows = $article->getsMyArticle($_POST['categoryid'], $userid, $_POST['field'], $_POST['value']);
	
		$html = "<table cellspacing='1' cellpadding='0'>\
					<thead>\
						<tr>\
							<td class='t_1'>序号</td>\
							<td class='t_2'>文章标题</td>\
							<td class='t_3'>点击</td>\
							<td class='t_4'>隐藏</td>\
							<td class='t_5'>发表</td>\
							<td class='t_6'>上传时间</td>\
						</tr>\
					</thead>\
					<tbody>";
		for ($i=0; $i<$number; $i++) {
			$s++;
			$row = $rows[$i];
			if ($row) {
				$counter = $row['counter'];
				$hidetitle = $row['hidetitle'] ? $row['hidetitle'] : '';
				$published = $row['published'] ? $row['published'] : '';
				$date = substr($row['posttime'],0,10);
				$title = addslashes($row['title']);
				$html .= "<tr>\
							<td class='t_1'>$s</td>\
							<td class='t_2 toleft'><input type='checkbox' name='aids' value='$row[articleid]'/><a href='browse.php?id=$row[articleid]'>$title</a></td>\
							<td class='t_3'>$counter</td>\
							<td class='t_4'>$hidetitle</td>\
							<td class='t_5'>$published</td>\
							<td class='t_6'>$date</td>\
					 	 </tr>";
			} else {
				$html .= "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
			}
		}
		$html .= "$tbody</tbody></table>";
		die("setValue('list',\"$html\");");
	}
	
	
	function hideTitle(){
	    $article = new Article();
		$ids = explode(',', $_POST['ids']);
		$bool = $_POST['hideTitle'];
		foreach ($ids as $id){
			$article->articleid = $id;
			$article->hidetitle = $bool;
			$article->hidetitle();
		}
		die("alert('隐藏/显示标题操作完毕!'); PageBar.SetPage(); if(confirm('现在是否更新首页?')) refreshHomePage();");
	}

	function published(){
		$article = new Article();
		$ids = explode(',', $_POST['ids']);
		$bool = $_POST['published'];
		foreach ($ids as $id){
			$article->articleid = $id;
			$article->published = $bool;
			$article->published();
		}
		die("alert('发表文章/取消发表操作完毕!'); PageBar.SetPage(); if(confirm('现在是否更新首页?')) refreshHomePage();");
	}
	
	function deleteArticle(){
		$article = new Article();
		$ids = explode(',', $_POST['ids']);
		foreach ($ids as $id){
			$article->delete($id);
		}
		die("alert('删除文章操作完毕!'); PageBar.SetPage(); if(confirm('现在是否更新首页?')) refreshHomePage();");
	}
	
	
	
	
?>