<?php
//	include_once("../class/MySQL.php");
//	header("Content-Type: text/html; charset=utf-8");
//	$pText = mb_convert_encoding($pText, "gb2312", "utf-8");

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
	if ($handle == 'handle_login') {
		$userName = addslashes($pContent[1]);
		$userPassword = addslashes($pContent[2]);
		
		$userName = str_replace(';','；',$userName);			//SELECT 时;会出错,查不出来,所以替换成全角
		$userPassword = str_replace(';','；',$userPassword);

		$sql = "SELECT `userid`,`username`,`usergroupid` FROM `ma_user` WHERE `username`='$userName' AND `password`='$userPassword'";
		$row = $mysql->getFirstRow($sql);
		if($row) {			//login success
			$_SESSION['uid'] = $row[0];
			$_SESSION['name'] = $row[1];
			$_SESSION['gid'] = $row[2];
			echo "1";	
		} else { echo "2";	}		//login failed
		exit();
	}
	
	
/******************handles*********************/	
	if ($handle == 'handleSaveArticle') {
		$userid = $_SESSION['uid'];
		if(empty($userid)) die("-1");
		
		$articleid = $pContent[1];
		$categoryid = $pContent[2];
		$docnumber = addslashes($pContent[3]);
		$title = addslashes($pContent[4]);
		$author = addslashes($pContent[5]);
		$source = addslashes($pContent[6]);
		$content = addslashes($pContent[7]);

		
		
		if ($articleid == -1) {
			$sql = "INSERT INTO `ma_article` (`categoryid`,`docnumber`,`title`,`author`,`userid`,`posttime`,`source`,`content`)	
									VALUES ($categoryid,'$docnumber','$title','$author','$userid',now(),'$source','$content')";
			$articleid = $mysql->getInsertid($sql);
		} else {
			$sql = "UPDATE `ma_article` SET `categoryid`=$categoryid, `docnumber`='$docnumber',  
					`title`='$title', `author`='$author', `source`='$source', `content`='$content' 
					WHERE `articleid`=$articleid";
			$ok = $mysql->Query($sql);
		}
		echo $articleid;
		exit();
	}
/******************handles*********************/


?>