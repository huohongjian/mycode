<?php
class Div {
	
	static function ImageLeft ($ps) {
		$class = "image_left";
		$imageURL = "";
		$title = "";
		$text = "";
		foreach ($ps as $k=>$v) { $$k = $v; }
		
		$html = "<div class='$class'>
					<img src='$imageURL'/>
					<div class='title'>$title</div>
					<div class='text'>$text</div>
				</div>";
		echo $html;
	}
	
}

?>