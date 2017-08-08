/********************** main.html **********************/
var initedTag = new Array();	//控制初始化tag
function doSwitchTag(index){
	if(initedTag[index]==true) return;
	initedTag[index] = true;
	XMLHttp.sendReq('GET', 'request.php?index='+index, '', callback, index);
}

function callback(objXMLHttp, index)
{
	var response = objXMLHttp.responseText;
	document.getElementById('tagContent_'+index).innerHTML = response;
}




/********************** 表管理函数 **********************/
function addRow(){
	var titles = parseInt(document.getElementById('titles').value);
	
	var objTR = document.createElement('tr');
	for(i=0; i<titles; i++){
		var objTD = document.createElement('td');
		var objInput = document.createElement('input');
		objInput.setAttribute('type', 'text');
		objTD.appendChild(objInput);
		objTR.appendChild(objTD);
	}
	document.getElementById('r_manage_tbody').appendChild(objTR);
	
	//alert(titles+1);
}