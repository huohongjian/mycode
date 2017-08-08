<?
	function __autoload($classname){
		include_once("../class/".$classname.".php");
	}

	$fhandle = fopen("php://input", 'r');
	$pText = '';
	while (!feof($fhandle)) { 
		$pText .= fread($fhandle, 4096); //4096B
	}
	fclose($fhandle);
	
	$pContent = explode("|=>:", $pText);
	$handle = $pContent[0];
	
	$mysql = new MySQL();	
	$mysession = new Session(new MySQL());
	
	
/******************handles*********************/
	if ($handle == 'save_article') {
		$userid = $_SESSION['uid'];
//		if(empty($userid)) die("-1");
		
		$articleid = $pContent[1];
		$article = new Article($mysql);
		$article->articleid	= $articleid;
		$article->categoryid= $pContent[2];
		$article->docnumber	= addslashes($pContent[3]);
		$article->caption	= addslashes($pContent[4]);
		$article->title		= addslashes($pContent[5]);
		$article->author	= addslashes($pContent[6]);
		$article->userid	= $userid;
		$article->content	= addslashes($pContent[7]);	
		
		if ($articleid == -1) {
			$articleid = $article->Add();
			//删除index.html文件
			$file_name = "../index.html";
			if(file_exists($file_name)) $result = @unlink ($file_name);
		} else {
			$article->Update();
		}
		
		echo $articleid;
		exit();
	}
/******************handles*********************/	
	
?>