<!--
//需要设置tab顺序 且<body onload="aEvent();">
//var enterTabOrder = new Array ('title','author','source','docnumber','save');

//firefox一般情况下要以事件e做为参数；而先调用getEvent()方法，可省略参数e。
function getEvent()	{
 	if(document.all)    return window.event;//如果是ie
	var func=getEvent.caller;
	while(func!=null){
		var arg0=func.arguments[0];
    	if(arg0){
       		if((arg0.constructor==Event || arg0.constructor ==MouseEvent) || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){return arg0;}
        }
        func=func.caller;
    }
   return null;
}

function aEvent(){
	for(var i=0; i<enterTabOrder.length; i++){
		var e = document.getElementById(enterTabOrder[i]);
		if (typeof window.event == 'undefined') {
			e.setAttribute('onkeypress',"tabE()"); 
		} else {
			e.attachEvent('onkeypress',tabE);
		}
	}
}

function tabE() {
	var evt=getEvent(); //var evt = (typeof window.event == 'undefined') ? e : window.event;
	var obj=evt.srcElement || evt.target;
	
	if (evt.keyCode == 13) {
		for(var i=0; i<enterTabOrder.length; i++){
			if (enterTabOrder[i] == obj.getAttribute('id') && i < enterTabOrder.length - 1){
				document.getElementById(enterTabOrder[i+1]).focus();
				break;
			} else {
				document.getElementById(enterTabOrder[0]).focus();
			}
		}
	}
	return null;
}
//-->