<?php
	$index = $_GET['index'] ? $_GET['index'] : $_POST['id'];
	
	if($index==0){
		$item = array(
			array(0,'序号',30,'center'),
			array(1,'标识',30,'center'),
			array(2,'报表名称',100,'left'),
			array(3,'主标题',180,'right'),
			array(4,'副标题',180,'left'),
			array(5,'报表编号',60,'left'),
			array(6,'报表结构',60,'left'),
			array(7,'计量单位',60,'center')
		);
		$len = count($item);
		echo "<input type='hidden' id='titles' value='$len' />";
		$taskid = "2008syyb";
		$taskname = "2008年商业月报";
		echo "<span style='width:690px; height:22px; line-height:22px; text-align:left;'>任务名称：{$taskname}({$taskid})</span>";
		echo "<table id='r_manage' cellspacing='1' cellpadding='10'><thead><tr>";
		for($i=0; $i<$len; $i++){
			echo "<td style='width:{$item[$i][2]}px;'>{$item[$i][1]}</td>";
		}
		echo "</tr></thead><tbody id='r_manage_tbody'>";
		for($i=0; $i<$len; $i++){
			echo "<td><input type='text' class='{$item[$i][3]}' /></td>";
		}
		echo "</tbody></table>";
		echo "<br/>";
		echo "<button onclick='addRow()'>增加</button>&nbsp;<button>删除</button>&nbsp;<button>保存</button>";
	}
		
	if($index==1){
		echo "huohongjian";
	}
			


		



?>