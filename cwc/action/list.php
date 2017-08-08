<?php
	function __autoload($classname) {
	    include_once("../class/$classname.php"); 
	}
	
	call_user_func($_POST['func']);
	
	function getCategoryName(){
		$category = new Category();
		$txt = $category->getNameById($_POST['categoryid']);
		die($txt);
	}

	function getnRows(){
		$article = new Article();
		echo $article->getCountByLike($_POST['categoryid'], 
		                              $_POST['searchField'], 
		                              $_POST['searchTxt']);
	}
	
	function search(){
		$num  = $_POST['num'] ? $_POST['num'] : 10;
	    $page = $_POST['page'] ? $_POST['page'] : 1;
	    $offset = ($page-1) * $num;
		
		$article = new Article();
		$rows = $article->getsByLike($_POST['categoryid'],
		                            $_POST['searchField'],
		                            $_POST['searchTxt'],
		                            $num, $offset);

		$html = "<table cellspacing='1' cellpadding='0'>
					<thead>
						<tr>
							<td class='t_1'>序号</td>
							<td class='t_2'>文章标题</td>
							<td class='t_3'>点击</td>
							<td class='t_4'>隐藏</td>
							<td class='t_5'>发表</td>
							<td class='t_6'>上传时间</td>
						</tr>
					</thead>
					<tbody>";
		
		for ($i=0; $i<$num; $i++) {
			$s++;
			$row = $rows[$i];
			if ($row) {
				$counter = $row['counter'];
				$hidetitle = $row['hidetitle'];
				$published = $row['published'];
				if($hidetitle==0) $hidetitle = '';
				if($published==0) $published = '';
				$date = substr($row['posttime'],0,10);
				$id = ($page-1)*10+$s;
				$html .= "<tr>
							<td class='t_1'>$id</td>
							<td class='t_2 toleft'><a href='browse.php?id=$row[articleid]'>$row[title]</a></td>
							<td class='t_3'>$counter</td>
							<td class='t_4'>$hidetitle</td>
							<td class='t_5'>$published</td>
							<td class='t_6'>$date</td>
					 	 </tr>";
			} else {
				$html .= "<tr>
							<td></td><td></td><td></td><td></td><td></td><td></td>
					 	 </tr>";
			}
		}
		$html .= "$tbody</tbody></table>";
		die($html);
	}


?>