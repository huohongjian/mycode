<?php
class Form {
	
	function FormHeader ($args=array()) {
		if ($args[enctype]) $enctype = "enctype=\"$args[enctype]\"";
		else $enctype = "";
		if (!isset($args[method])) $args[method] = "post";
		if (!isset($args[action])) $args[action] = $_SERVER[PHP_SELF];
		if (!isset($args[colspan])) $args[colspan] = "2";
		
		$html = "<table bgcolor='lightgreen' width=\"100%\" align=\"center\" border=\"0\" cellspacing=\"1\" cellpadding=\"4\" class=\"tableoutline\" >\n";
		$html .= "<form action=\"$args[action]\" $enctype method=\"$args[method]\" name=\"$args[name]\" $args[extra]>\n";
		if ($args[title] != "") {
		$html .= "<tr id=\"cat\"> <td class=\"tbhead colspan=\"$args[colspan]\"><b>$args[title]</b></td></tr>\n";			
		}
		echo $html;
	}

	function FormFooter ($args=array()) {
		echo "<tr class=\"tbhead\">\n";
		
		if ($args[confirm]==1) {
			$args[button][submit][type] = "submit";
			$args[button][submit][name] = "submit";
			$args[button][submit][value] = "确认(y)";
			$args[button][submit][accesskey] = "y";
			
			$args[button][back][type] = "button";
			$args[button][back][value] = "取消";
			$args[button][back][accesskey] = "r";
			$args[button][back][extra] = " onclick=\"history.back(1)\"";
		} elseif (empty($args[button])) {
			$args[button][submit][type] = "submit";
			$args[button][submit][name] = "submit";
			$args[button][submit][value] = "确认(y)";
			$args[button][submit][accesskey] = "y";
			
			$args[button][back][type] = "reset";
			$args[button][back][value] = "重置";
			$args[button][back][accesskey] = "r";
		}
		
		if ($args[nextpage]==1) {
			$args[button][nextpage][type] = "submit";
			$args[button][nextpage][name] = "nextpage";
			$args[button][nextpage][value] = "继续添加下一页";
			$args[button][nextpage][accesskey] = "n";
		}
		
		if (empty($args[colspan])) $args[colspan] = 2;
		
		echo "<td colspan=\"{$args[colspan]}\" align=\"center\">\n";
		if (isset($args) && is_array($args)) {
			foreach ($args[button] as $k => $button) {
				if (empty($button[type])) $button[type] = "submit";
				echo "<input class=\"bginput\" accesskey=\"$button[accesskey]\" type=\"$button[type]\" name=\"$button[name]\" value=\"$button[value]\" $button[extra] >\n";
			}
		}
		echo "</td>\n</tr>\n";
		echo "</form>\n</table>\n";
	}
	
	function MakeInput($args = array("width1"=>10,"size"=>35,"maxlength"=>50,
						"type"=>"text")) {
		if ($args[html]) $args[value] = htmlspecialchars($args[html]);
		if (!empty($args[css])) $class = "class=\"$args[css]\"";
		echo "<tr nowrap>
				<td width='$args[width1]'>$args[text]</td>
				<td><input $class type=\"$args[type]\" name=\"$args[name]\" size=\"$args[size]\" maxlength=\"$args[maxlength]\" value=\"$args[value]\" $args[extra] /></td>
			</tr>\n";
			
	}
	

}

//
//$cpforms = new Form();
//$cpforms->FormHeader($test = array("title"=>"hhhhhhhh"));
//$cpforms->MakeInput(array("value"=>"<h2>hhjwyh</h2>"));
//$cpforms->FormFooter();
?>