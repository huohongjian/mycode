<?php
	function __autoload($classname){include_once("../class/".$classname.".php");}
	date_default_timezone_set("PRC");
	//$_REQUEST[]具用$_REQUEST[] $_GET[]的功能,但是$_REQUEST[]比较慢。
	
	
	
	$back = call_user_func($_REQUEST['func']);
	if(is_array($back)){
		die(json_encode($back));	//将数组解析为字符串
	}else{
		die("$back");
	}
	
	function getOptions(){
		$appendageCategory = new AppendageCategory();
		return $appendageCategory->getsAll();
	}
	
	function getPath(){
		$appendagePath = new AppendagePath();
		return $appendagePath->getsAll();
	}
	
	function hasSameNameFile(){
		$appendage = new Appendage();
		$row = $appendage->getByFileName($_REQUEST['filename']);
		if($row){
			return $row['appendageid'];
		}else{
			return -1;
		}
	}
	
	function uploadFile(){
	    
		$pgsql = new PgSQL();
		$appendage = new Appendage($pgsql);
		$session = new Session($pgsql);
		
		$uid = $session->read('userid');
		if(empty($uid))return ("<html>
									<head><meta http-equiv=Content-Type content='text/html; charset=utf-8'></head>
									<script type='text/javascript'>
										alert('请先登录!');
									</script>
								</html>");
		
		$path = "../../_upload/cwc/default/";
		$result_msg = 'ERROR';
		
		if (isset($_FILES['file'])) {		// 从浏览器接受文件
			$msg = $_FILES['file']['error'];
			if ($_FILES['file']['error'] == UPLOAD_ERR_OK) {	// 没有错误
				$filename = $_FILES['file']['name'];
				
				//如果数据库中有同名文件
				$row = $appendage->getByFileName($filename);
				if($row) $saveName = $row['savename'];
				else $saveName = $filename;
				$newName = substr($saveName,0,strrpos($saveName, '.'));	//主文件名
				$extName = strrchr($saveName, '.');	//扩展名
				
				if(preg_match("/[".chr(0xa1)."-".chr(0xff)."]+/", $newName))	//判断是否有中文字符
					$newName = date("Y-m-d-").rand(1000,9999);
				if(preg_match("/[".chr(0xa1)."-".chr(0xff)."]+/", $extName))	//判断是否有中文字符
					$extName = '.extra';
				
				$newFileName = $newName.$extName;
				if(move_uploaded_file($_FILES['file']['tmp_name'], $path.$newFileName)){
					//写入数据库
					$appendageid = $_GET['appendageid'];
					$appendage->appendageid = $appendageid;
					$appendage->categoryid = $_GET['categoryid'];
					$appendage->pathid = $_GET['pathid'];
					$appendage->savename = $newFileName;
					$appendage->filename = $filename;
					$appendage->size = $_FILES['file']['size'];
					$appendage->articleid = $_GET['articleid'];
					$appendage->userid = $session->read('userid');
					if($appendageid=='-1'){
						$appendageid = $appendage->add();
					}else{
						$appendage->update();
					}
		      		$result_msg = "Upload file is ok!";
				}
			} elseif ($_FILES['file']['error'] == UPLOAD_ERR_INI_SIZE) {
				$result_msg = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
			} else {
				$result_msg = 'Unknown error';
			}
		}
		$js = "<html>
					<head><meta http-equiv=Content-Type content='text/html; charset=utf-8'></head>
					<body style='margin:0px; font-size:10pt;'>$result_msg</body>
					<script type='text/javascript'>
						parent.document.getElementById('current_file').value = '$newFileName';
						parent.\$appendageid = $appendageid;
						parent.document.getElementById('appendageid').value = $appendageid;
						alert('$result_msg');
					</script>
				</html>";
		return $js;
	}
/*	
	
	
	function addToHomePage(){
		$pgsql = new PgSQL();
		$session = new Session($pgsql);
		if($session->read('usergroupid')>2) return -1;
		
		$image = new HomePageImage($pgsql);
		$image->imageid = intval($_REQUEST['imageid']);
		$image->categoryid = intval($_REQUEST['categoryid']);
		$image->appendageid = intval($_REQUEST['appendageid']);
		$image->articleid =  intval($_REQUEST['articleid']);
		if($image->imageid==-1){
			$imageid = $image->add();
		}else{
			$image->update();
		}
		return $image->imageid;
	}
	
	function getNewImage(){
		$image = new HomePageImage();
		return $image->getNewlyImageByCategoryid(intval($_REQUEST['categoryid']));
	}
	
	
	function refreshPathFile(){
		$pgsql = new PgSQL();
		$session = new Session($pgsql);
		if(empty($session->read('userid')) die("alert('请先登录')");
		if($session->read('usergroupid')>2) die("alert('你没有此权限')");
		
		$id = $_REQUEST['pathid'];
		$appendagePath = new AppendagePath($pgsql);
		$name = $appendagePath->getNameById($id);
	//	echo $id.$name;
		$files = getFiles("../../$name");
		$htm = buildHtml($files);
		return $htm;
		die("setValue('fileList','$htm')");
	}
	
	
	
	
	
	
	
	
	
	
	
	
	$action = $_REQUEST['action'];
	
	$pgsql = new PgSQL();
	$appendage = new Appendage($pgsql);
	$session = new Session($pgsql);
	
//	$action = 0;
	

	
	if($action==21){		//刷新目录文件
		if(empty($session->read('userid'))) die("alert('请先登录')");
		if($session->read('usergroupid')>2) die("alert('你没有此权限')");
		$id = $_REQUEST['pathid'];
		$appendagePath = new AppendagePath($pgsql);
		$name = $appendagePath->getNameById($id);
	//	echo $id.$name;
		$files = getFiles("../../$name");
		$htm = buildHtml($files);
		
		die("setValue('fileList','$htm')");
	}
	
	if($action==22){		//注册文件
		if(empty($session->read('userid'))) die("alert('请先登录')");
		if($session->read('usergroupid')>2) die("alert('你没有此权限')");
		$appendagePath = new AppendagePath($pgsql);
		$path1 = "../../".$appendagePath->getNameById($_REQUEST['pathid1']);
		$path2 = "../../".$appendagePath->getNameById($_REQUEST['pathid2']);
		$files = explode(',', $_REQUEST['files']);
		foreach ($files as $file){
			$newName = substr($file,0,strrpos($file, '.'));	//主文件名
			$extName = strrchr($file, '.');	//扩展名
			if(preg_match("/[".chr(0xa1)."-".chr(0xff)."]+/", $newName))	//判断是否有中文字符
				$newName = date("Y-m-d-").rand(100,999);
			if(preg_match("/[".chr(0xa1)."-".chr(0xff)."]+/", $extName))	//判断是否有中文字符
				$extName = '.extra';
				
			$newFileName = $newName.$extName;
			chmod($path1.$file,0777);
			if(rename(getGBK($path1.$file), $path2.$newFileName)){
				//写入数据库
				$appendage->categoryid = 66;
				$appendage->pathid = $_REQUEST['pathid2'];
				$appendage->savename = $newFileName;
				$appendage->filename = $file;
				$appendage->size = filesize($path2.$newFileName);
				$appendage->articleid = 0;
				$appendage->userid = $session->read('userid');
				$appendageid = $appendage->add();
			}else{
				die("alert('发生错误')");
			}
		}
		die("alert('文件注册成功!')");
	}
	
	
	
	if($action==4){		//更新首页图片关联文章
		$image = new HomePageImage($pgsql);
		$image->imageid = $_REQUEST['imageid'];
		$image->articleid = $_REQUEST['articleid'];
		if($image->updateArticleid()){
			die("alert('关联文章设置成功!');");
		}
	}
	
	if($action==5){		//设置最新记录为当前图片
		$image = new HomePageImage($pgsql);
		$row = $image->getNewlyImage();
		$js = "
				\$imageid=$row[imageid];
				setValue('homepage_image_category',$row[categoryid]);
				setValue('appendageid',$row[appendageid]);
				setValue('articleid',$row[articleid]);
				";
		die($js);
	}
	
	
	
	if($action==10){	//查询附件
		$uid = $session->read('userid');
		if(empty($uid)) die("alert('请先登录!')");
		$gid = $session->read('usergroupid');
		$filename = $_REQUEST['filename'];
		if($gid<=2){
			$rows = $appendage->getsByFilename($filename, '0,5');
		}else{
			$rows = $appendage->getsByFilenameUserid($filename, $uid, '0,5');
		}
		$htm = buildHtml($rows);
		$js = "setValue('appendage_list','$htm')";
		die($js);
	}
	
	if($action==11){	//最新附件
		$uid = $session->read('userid');
		$gid = $session->read('usergroupid');
		if(empty($uid)) die("alert('请先登录!')");
		if($gid<=2){
			$rows = $appendage->getsAll('0,5');
		}else{
			$rows = $appendage->getsByUserid($uid, '0,5');
		}
		$htm = buildHtml($rows);
		$js = "setValue('appendage_list','$htm')";
		die($js);
	}
	
	function buildHtml($rows){
		$htm = "<table>\
					<thead>\
						<tr>\
							<td class=\'t_0\'>id</td>\
							<td class=\'t_1\'></td>\
							<td class=\'t_2\'>附件名</td>\
							<td class=\'t_3\'>大小K</td>\
							<td class=\'t_4\'>uid</td>\
						</tr>\
					</thead>\
					<tbody>";
		
		$i = 0;
		foreach($rows as $row){
			++$i;
			if($i>5) break;
			$size = round((int)$row['size']/1024);
			$id = $row['appendageid'];
			$htm .= "<tr>\
						<td>$id</td>\
						<td><input type=\'checkbox\' id=\'$id\' savename=\'$row[savename]\'/></td>\
						<td class=\'toleft\'><label for=\'$id\'>$row[filename]</lable></td>\
						<td>$size</td>\
						<td>$row[userid]</td>\
					</tr>";
		}
		$htm .= "</tbody></table>";
		return $htm;
	}
	
	
	
	
	
	
	
	
	function getUTF($str){
		//需要先enable mbstring 扩展库，在 php.ini里将; extension=php_mbstring.dll 前面的 ; 去掉。
		//解决中文名乱码问题的最好的办法是把系统假设在Linux上，把locale改成utf-8的，那什么问题都不会出现了。
		$encoding = mb_detect_encoding($str, "UTF-8, GBK, GB2312, CP936");
		if ($encoding != "UTF-8"){
			$str = mb_convert_encoding($str, "UTF-8", $encoding);
		}
		return $str;
	}
	
	function getGBK($str){
		$encoding = mb_detect_encoding($str, "UTF-8, GBK, GB2312, CP936");
		if ($encoding != "GBK"){
			$str = mb_convert_encoding($str, "GBK", $encoding);
		}
		return $str;
	}
	
	/*
	
	
	
	if ($action == 3) {		//获取文件列表
		$path = "../../{$_REQUEST['path']}";
		$nfiles = $_REQUEST['nfiles'];		//获取文件个数
		
		$dirs = array();
		$files = getFiles($path, $dirs);
		$html1 = "<ul>";
		foreach ($dirs as $dir){
			$dir = getUTF($dir);
			$html1 .= "<li><a href=\"javascript:select_path('$dir/')\" class='folder'>$dir</a></li>";
		}

		$len = count($files);
		$len = ($len>$nfiles && $nfiles!=-1) ? $nfiles : $len;
		for ($i=0; $i<$len; $i++){
			$file = getUTF($files[$i]);
			$html1 .= "<li><a href=\"javascript:select_file('$file')\" class='file'>$file</a></li>";
		}
		$html1 .= "</ul>";
		die("$html1");
	}
	
	function getFiles($path="", &$dirs=array()){
		$files = array();
		$res = opendir($path);
		while ($filen = readdir($res)) {
			if(is_dir($path.$filen)){
				array_push($dirs, $filen);
			}else{
				array_push($files, $filen);
			}
		}
		closedir($res);
		sort($dirs);						//按名称排序
		$files = array_reverse($files);		//按时间排序
		return $files;
		
	//	读目录也可以这样写：
	//	$it = new DirectoryIterator("../../upload/2008");
	//	foreach($it as $file) {
	//		if (!$it->isDot()) {	//不是.或..目录
	//			echo $file . "<br>";
	//		}
	//	}
	}
	*/
	function getFiles($path){
		$files = array();
		$res = opendir($path);
		$i=1;
		while ($filen = readdir($res)) {
			if(!is_dir($path.$filen)) {
				$file = array();
				$file['filename'] = getUTF($filen);
				$file['savename'] = getUTF($filen);
				$file['size'] = filesize($path.$filen);
				$file['appendageid'] = $i++;
				$file['userid'] = '';
				array_push($files, $file);
			}
		}
		closedir($res);
//		sort($dirs);						//按名称排序
//		$files = array_reverse($files);		//按时间排序
		return $files;
	}
	
	
	
	
	
	
	
	
?>