<?php
/************************************************
 * 在文章的第一行 $html = new Html();
 * 在文章的最末行 $html->Add();
 ***********************************************/
class Html{
	private $file_name;
	
	function __construct($file_name='index.html'){
		$this->file_name = $file_name;
	}
	
	function Init(){
		if (file_exists($this->file_name)) {
			header("Location: $this->file_name");
			exit();
		} else {
			ob_start();
		}
	}
	
	function Add(){
		$text = ob_get_contents();
		if (empty($text)) return ;
//		ob_end_clean();
		
		$fp = fopen($this->file_name,'w');
		fwrite($fp, $text);
	}
	
	function Delete(){
		$reg = '(.html$|.htm$|.js)';
		if (!ereg($reg, $this->file_name))
			return "只能删除.html .htm .js文件!";
		
		if (!file_exists($this->file_name)) 
			return "文件:$this->file_name 不存在!";
			
		if(!is_writable($this->file_name))
			return "文件:$this->file_name 不可写!";
		
		$result = @unlink ($this->file_name);
		if ($result) {
			return "文件:$this->file_name 删除成功!";
		} else {
			return "文件:$this->file_name 删除失败!";
		}
		
	}
	
	
	
}


?>