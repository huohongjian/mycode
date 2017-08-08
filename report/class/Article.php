<?php

class Article {
	private $DB;
	public $articleid;
	public $categoryid;
	public $docnumber;
	public $title;
	public $author;
	public $userid;
	public $posttime;
	public $hits;
	public $answers;
	public $source;
	public $content;
	
	function __construct($mysql=null){
		$this->DB = empty($mysql) ? new MySQL() : $mysql;
	}
	
	
	function EchoText($id){
		$hit = "UPDATE `ma_article` SET `hits`=`hits`+1 WHERE `articleid`=$id";
		$this->DB->Query($hit);
		$sql = "SELECT * FROM ma_article WHERE `articleid`=$id";
		$row = $this->DB->getFirstRow($sql);
		if ($row) {
			$sql_1 = "SELECT `username` FROM ma_user WHERE `userid`=$row[userid]";
			$row_1 = $this->DB->getFirstRow($sql_1);
			$username = $row_1[0];
			$author = empty($row['author']) ? "" : "作者:".$row['author']."　";
			$source = empty($row['source']) ? "" : "本文摘自:{$row['source']}<br/>";
			$docnumber = empty($row['docnumber']) ? "" : "<div class='neck_1'>$row[docnumber]</div>";
			
			$category = new Category(&$this->DB);
			$parentArr = $category->GetParentArr($row['categoryid']);
			foreach ($parentArr as $k => $v){
				$catStr .= " >> <a href='category.php?id=$k' target='_blank'>$v</a>";
			}
			
			echo "<div class='article'>";
			echo "<div class='article_t'>";
			echo "<span class='article_t_1'>$catStr</span><a href='javascript:edit($id)'>编辑</a>";
			echo "</div><!-- class=article_t -->";
			echo "<div class='article_b'>";
			echo "<div class='title'>$row[title]</div>$docnumber<hr>";
			echo "<div class='neck_2'>{$author}时间:$row[posttime]　点击:$row[hits]</div>";
			echo "<div class='content'>$row[content]</div>";
			echo "<div class='tail'>{$source}特别鸣谢:<span style='color:red;'>{$username}</span>上传此文!</div>";
			echo "</div><!-- class=article_b -->";
			echo "</div><!-- class=article -->";
		}
	}
	
	
	function EchoDiv($css='list', $title='最新文章', $categoryid=-1, $rows=6){
		$result = "<div class='$css'>\n";
		$result .= "<div class='{$css}_t'>$title</div>\n";
		$result .= "<div class='{$css}_b'><ul>\n";
		$result .= $this->getDivContent($title, $categoryid, $rows);
		$result .= "</ul></div>\n";			
		$result .= "</div><!-- id=$css -->\n";
		echo $result;
	}
	
	private function getDivContent($title, $categoryid, $rows){
		$sql = "SELECT `articleid`,`title` FROM ma_article ";
		if ($categoryid == -1){
			switch ($title){
				case '最新文章':	$sql .= "ORDER BY `articleid` DESC LIMIT 0, $rows"; break;
				case '热点文章':	$sql .= "ORDER BY `hits` DESC LIMIT 0, $rows";	break;
				default: return null;
			}
		} else {
			$category = new Category(&$this->DB);
			$idStr = $category->GetChildIdStr($categoryid);
			$sql .= "WHERE `categoryid` IN ($idStr) ORDER BY `articleid` DESC LIMIT 0, $rows";
		}
		$result = $this->DB->Query($sql);
		if (!$result) return null;
		while ($row = mysql_fetch_array($result)) {
			$value .= "<li><a href='browse.php?id=$row[0]' target='_blank'>$row[1]</a></li>\n";
		}	
		return $value;
	}

	
	function getArticle($id){
		$sql = "SELECT * FROM ma_article WHERE `articleid`=$id";
		$result = $this->DB->Query($sql);
		$row = mysql_fetch_row($result);
		if (!empty($row)) {
			$this->articleid = $row[0];
			$this->categoryid = $row[1];
			$this->docnumber = $row[2];
			$this->title = $row[3];
			$this->author = $row[4];
			$this->userid = $row[5];
			$this->posttime = $row[6];
			$this->hits = $row[7];
			$this->answers = $row[8];
			$this->source = $row[9];
			$this->content = $row[10];
		}
	}
	
}






?>