<?php
class Div{
	private $pgsql;

	
	function __construct($pgsql=null){
		$this->pgsql = $pgsql;
		date_default_timezone_set("PRC");
	}
	
	
	function li($parameters=array()){
		$id = '';
		$class = 'Basic';
		$style = '';
		$title = "最新文章";		//="" 返回<ul>...</ul>
		$titlelink = true;		//标题是否可链接
		$categoryid = -9;
		$limit = "6";
		$hasdate = false;
		foreach ($parameters as $k=>$v) {
		    $$k = $v;
		}
		if($titlelink) {
		    $title = "<a href='list.html?id=$categoryid'>$title</a>";
		}
		$body = $this->build_li($categoryid, $limit, $hasdate);
		echo $this->build_div($id, $class, $style, $title, $body);
	}
	
	private function build_li($categoryid, $limit, $hasdate){
		$article = new Article($this->pgsql);
		$rows = $article->get_bycategoryid($categoryid, $limit);
		$timestamp = time(); 
		foreach ($rows as $row){
			$s = strtotime($row['posttime']);
			$md = date("[Y-m-d]",$s);
			$span = round(($timestamp-$s)/60/60);
			$class = $span<24 ? " class='NewArtColor'" : "";	//设置最新文章字体颜色
			$title = $row['caption'] ? $row['caption'] : $row['title'];
			$md = $hasdate ? "<span>$md</span>" : "";
			$row_title = $row['title'];
			$row_title = str_replace("'", "", $row_title);
			$result .= "<li><a$class title='$row_title \n时间:$row[posttime] 点击:$row[counter]' href='browse.php?id=$row[articleid]' target='_blank'>$title</a>$md</li>\n";
		}
		return $result;
	}
	
	private function build_div($id, $class, $style, $title, $body){
		if(!empty($id)) $id = " id='$id'";
		if(!empty($class)) $class = " class='$class'";
		if(!empty($style)) $style = " style='$style'";
		if(empty($title)){
			if(empty($class)) $class=" class='dBody'";
			$html = "<ul$id$class$style>$body</ul>";
		}else{
			$html = "<div$id$class$style>\n
						<span class='dTitleM'>\n
							<span class='dTitleL'>\n
								<span class='dTitleR'>$title</span>\n
							</span>\n
						</span>\n
						<ul class='dBody'>\n
							$body\n
						</ul>
				  	</div>\n";
		}
		return $html;
	}

	function scroll($parameters=array()){
		$id = '';
		$class = 'Basic';
		$style = '';
		$title = '';
		$titlelink = true;		//标题是否可链接
		$categoryid = -9;
		$limit = "6";
		$delay = 2;
		$hasdate = false;
		foreach ($parameters as $k=>$v){$$k = $v;}
		
		if($titlelink){
			$title = "<a href='list.html?id=$categoryid'>$title</a>";
		}else{
			$title = "<a href='#'>$title</a>";
		}
		if(!empty($id)) $id = " id='$id'";
		if(!empty($class)) $class = " class='$class'";
		if(!empty($style)) $style = " style='$style'";
		
		$article = new Article($this->pgsql);
		$rows = $article->get_bycategoryid($categoryid, $limit);
		if ($rows){
    		foreach ($rows as $row) {
    			$t = $row['caption'] ? $row['caption'] : $row['title'];
    			$lis .= "<li delay=$delay><a href=\"browse.php?id=$row[articleid]\" target=\"_blank\">$t</a></li>\n";
    		}
		}
		$html = "<div$id$class$style>\n
						<span class='dTitleM'>\n
							<span class='dTitleL'>\n
								<span class='dTitleR'>$title</span>\n
							</span>\n
						</span>\n
						<div class='dBody'>\n
							<div>
								<div id='vscroll0' style='display:none;z-index:0;'><ul>$lis</ul></div>
							</div>
						</div>
				  	</div>\n";
		echo $html;
	}
	
	function img($parameters=array()){
		$id = '';
		$class = '';
		$style = '';
		$categoryid = -9;
		$hastxt = false;
		$hastitle = false;
		$islink = false;
		foreach ($parameters as $k=>$v){$$k = $v;}
		
		$image = new HomePageImage($this->pgsql);
		$row = $image->getByCategoryid($categoryid);
		if(!empty($id)) $id = " id='$id'";
		$class = empty($class) ? "" : " class='$class'";
		$style = empty($style) ? "" : " style='$style'";
		if($hastitle) {
			$title = " title='".str_replace("'", "", $row[title])."'";
		}
		$src = '../'.$row['name'];
		if($hastxt){
			$txt = empty($row['caption']) ? $row['title'] : $row['caption'];
			$img = "<img class='dImg'$title src='$src'></img>";
			if($islink) $img = "<img class='dImg'$title src='$src' onclick=\"window.open('browse.php?id=$row[articleid]')\"></img>";
			$html = "<div$id$class$style>\n
						$img\n
						<p class='dP'><a href='browse.php?id=$row[articleid]' target='_blank'>$txt</a></p>\n
					</div>\n";
		}else{
			$html = "<img$id$style class='dImg'$title src='$src'></img>";
			if($islink) $html = "<img$id$style class='dImg'$title src='$src' onclick=\"window.open('browse.php?id=$row[articleid]')\"></img>";
		}
		echo $html;
	}
	
	
	
	function link($parameters=array()){
		$id = '';
		$class = 'Basic';
		$style = '';
		$title = "最新文章";		//="" 返回<ul>...</ul>
		$titlelink = false;		//标题是否可链接
		$categoryid = -9;
		$limit = "0,6";
		$hasdate = false;
		foreach ($parameters as $k=>$v){$$k = $v;}
		
		if($titlelink){
			$title = "<a href='list.html?id=$categoryid'>$title</a>";
		}else{
			$title = "<a href='#'>$title</a>";
		}
		$body = "
			<li><a href='http://10.1.0.71' target='_blank'>国家局信息网</a></li>
			<li><a href='http://10.1.0.133:9080/netrep/' target='_blank'>财审网</a></li>
			<li><a href='http://10.1.0.123:9080/cms/' target='_blank'>国资网</a></li>
			<li><a href='http://10.16.0.49:9081/nportal/portal' target='_blank'>省公司信息网</a></li>
			<li><a href='http://10.3.9.14' target='_blank'>管控平台</a></li>
			<li><a href='ftp://10.16.9.129' target='_blank'>FTP129</a></li>
			<li style='background:#DBDBDB; height:1px; width:100%; margin_:3px;'></li>
			<li><a href='http://www.sohu.com' target='_blank'>搜狐</a></li>
			<li><a href='http://www.sina.com' target='_blank'>新浪</a></li>
			<li><a href='http://www.163.com' target='_blank'>网易</a></li>
			<li><a href='http://www.zaobao.com' target='_blank'>早报网</a></li>
			<li><a href='http://news.sina.com.cn/m/globaltimes/' target='_blank'>环球时报</a></li>
			<li><a href='http://cn.yahoo.com/' target='_blank'>雅虎</a></li>
			<li><a href='http://www.qq.com/' target='_blank'>腾讯</a></li>
			<li><a href='http://www.inhe.net' target='_blank'>银河</a></li>
			<li><a href='http://www.xinhuanet.com' target='_blank'>新华网</a></li>
			<li><a href='http://www.chinanews.com.cn/' target='_blank'>中国新闻</a></li>
			<li><a href='http://www.google.cn/' target='_blank'>谷歌</a></li>
			<li><a href='http://www.baidu.com/' target='_blank'>百度</a></li>
			<li><a href='http://www.sogou.com/' target='_blank'>搜狗</a></li>
			<li style='background:#DBDBDB; height:1px; width:100%; margin_:3px;'></li>
			<li><a href='http://www.newhua.com/' target='_blank'>华军</a></li>
			<li><a href='http://www.qidian.com/' target='_blank'>起点</a></li>
			<li><a href='http://www.readnovel.com/' target='_blank'>阅读</a></li>
			<li><a href='http://www.zol.com.cn/' target='_blank'>中关村</a></li>
			<li><a href='http://weather.tq121.com.cn/' target='_blank'>天气预报</a></li>
			<li><a href='http://www.tom.com' target='_blank'>TOM</a></li>
			<li><a href='http://www.21cn.com/' target='_blank'>21CN</a></li>
			<li><a href='http://www.duote.com/' target='_blank'>多特</a></li>
			<li><a href='http://www.pconline.com.cn/' target='_blank'>太平洋</a></li>
			<li><a href='http://www.hao123.com/' target='_blank'>网址大全</a></li>
			<li><a href='http://www.cctv.com' target='_blank'>CCTV</a></li>
			<li><a href='http://www.chinadaily.net/' target='_blank'>Daily</a></li>
			<li><a href='http://www.yzdsb.com.cn/' target='_blank'>都市报</a></li>
			<li><a href='http://www.hebnews.cn/' target='_blank'>河北新闻</a></li>
			";
	
		echo $this->build_div($id, $class, $style, $title, $body);
	}
	
	
	
	

	
	
}
?>
