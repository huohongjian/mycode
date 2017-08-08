<?php
	include_once('_init.php');
	function getList(){
		parse_str(file_get_contents("php://input"));
		
		$article = new ArticleList();
		if($total==-1)
			$total = $article->countByCatidTitleContent($catid, $title, $content);
		
		$rs = $article->getsByCatidTitleContent($catid, $title, $content, ($page-1)*$rp, $rp);
		if(empty($rs) && $page==1) return "{page:1, total:1, rows:[]}";
		$json = "{
					page:$page,
					total:$total,
					rows:[";
		if($rs){	//freebsd下必须要有
			foreach ($rs as $r){
				$pt = substr($r['posttime'],0,19);
				$tmp .= ",{id:$r[artid], cell:['$r[artid]', '<a href=\'browse.html?id=$r[artid]\'>$r[title]</a>', '$r[counter]', '$pt']}";
			}
		}
		$json .= substr($tmp,1)."]}";
		return $json;
	}
	
	

?>