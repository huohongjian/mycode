
function getPath(subPath){
	var Path = window.location.pathname;
	var BasePath = Path.substring(0,Path.indexOf('report'))+"report/"+subPath;
	return BasePath;
}



var Tag = {
	
	WriteStyle : function(){
		var width = document.all ? "100%" : "99.6%";
		var height = document.all ? "94%" : "92%";
		
		var titleHeight = 26;
		var imageIndex = 1, hoverIndex = 0, selectedIndex = 6;	//选择后的背景图片		
		var step = -29, imageL = [], imageR = [];
		for(i=0; i<10; i++){
			imageL[i] = "background:url(../image/tag/tag_left.gif) no-repeat left " + i*step + "px;";
			imageR[i] = "background:url(../image/tag/tag_right.gif) no-repeat right " + i*step + "px;";
		}
		var borderColor = ["#FF950B","#9DA6B5","#E45A9E","#3A81C8","#D28100","#00988B","#A8BC1F","#C8451D","#8D6564","#AA6FCD"];	
		var bgColor = ["#FFECD2","#CDD6E5","#FFB7DA","#DFEBF7","#FFD084","#E8FFFD","#F7FAE2","#E7A18C","#C29A99","#84A8F0"];
		
		var style = "<style type='text/css'>"
				  + "#myTag {width:100%; height:100%;}"
				  + "#tagTitle {}"
				  + "#tagTitle ul {margin:0px; padding:0px; height:"+titleHeight+"px; line-height:"+titleHeight+"px;}"
				  + "#tagTitle li {float:left; list-style-type:none; text-align:center; margin:0px 1px 0px 0px;}"
				  + "#tagTitle li a {text-decoration:none; color:#000000; display:block; width:auto; "+imageL[imageIndex]+";}"
				  + "#tagTitle li a span {display:block; padding:0px 10px; "+imageR[imageIndex]+";}"
				  
				  + "#tagTitle li a:hover {color:#ffffff; "+imageL[hoverIndex]+";}"
				  + "#tagTitle li a:hover span {"+imageR[hoverIndex]+";}"
				  + "#tagTitle li.selected a {color:#ffffff; "+imageL[selectedIndex]+";}"
				  + "#tagTitle li.selected a span {"+imageR[selectedIndex]+";}"
				  + ""
				  + "#tagContent {position:relative; float:left; width:"+width+"; height:"+height+"; background:"+bgColor[selectedIndex]+"; border:1px solid "+borderColor[selectedIndex]+"; border-top-width:3px;}"
				  + "#tagContent .content {display:none; width:100%; height:100%; padding:10px;}"
				  
				  + "</style>";
		
		document.write(style);
	},
	
	LoadTags : function(tags, tagsNumber){
		var len = tags.length;
		var n = (typeof tagsNumber !="undefined" && tagsNumber<len)? tagsNumber : len;
		var content = "";
		var html = "<div id='myTag'><div id='tagTitle'><ul>";
		for(i=0; i<n; i++){
			html += "<li id='tag_"+i+"'><a href='javascript:doSwitchTag("+i+")' onclick='Tag.SwitchTag("+i+");this.blur();'><span>"+tags[i]+"</span></a></li>";
		}
		html += "</ul></div><div id='tagContent'>";
		for(i=0; i<len; i++){
			html += "<div id='tagContent_"+i+"' class='content'>"+i+"</div>";
		}
		html += "</div></div>";
		document.getElementById('right').innerHTML = html;
//		this.SetRegion(300,300);
	},
	
	SwitchTag : function(index){
		var li = document.getElementById('tagTitle').getElementsByTagName('li');
		for(i=0; i<li.length; i++){
			li[i].className="";
			document.getElementById('tagContent_'+i).style.display = 'none';
		}
		li[index].className = "selected";
		document.getElementById('tagContent_'+index).style.display = 'block';
	},
	
	SetRegion : function(width, height){
		var padding_h = document.all ? 12 : 14;
		var padding_v = document.all ? 12 : 14;
		
		var obj = document.getElementById('myTag');
		var pObj = obj.parentNode;		
		
		var width = typeof width == "undefined" ? pObj.clientWidth-padding_h : width;
		var height = typeof height == "undefined" ? pObj.clientHeight-padding_v : height;
		
		obj.style.width = width + "px";
		obj.style.height = height + "px";
	}
};

Tag.WriteStyle();
window.onresize = function(){
	Tag.SetRegion();
}









