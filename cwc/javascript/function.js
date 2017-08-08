/**********************************************
version: 2008-07-23
author: HuoHongJian
1. function convertCurrency(currencyDigits)				将小写金额转换为大写　　只能是正数
2. function nst_convert(nmb, digits, hideZero)			转换数字 并且只可输入数字字符
3. function formatNumber(nmb, digits=2, hideZero=true)	格式化数字
4. function isDate(str)									判断是否为日期型字符串
5. function formatDate(date, format) 					格式化日期
6. function getYMD(str) 								获取年月日及月份最大日
7. function getLocationQuery(location, name)			获取地址栏参数值
8. function trim(str)									去除字符串左右空格
9. function setHomePage(url)							将url设置为默认页
10.function open_window_center(url,width,height,state)	居中打开窗口
11.function load_file(filename)							动态加载外部文件


***********************************************/
function convertCurrency(currencyDigits) {
	var MAXIMUM_NUMBER = 99999999999.99;
	// Predefine the radix characters and currency symbols for output:
	var CN_ZERO = "零";
	var CN_ONE = "壹";
	var CN_TWO = "贰";
	var CN_THREE = "叁";
	var CN_FOUR = "肆";
	var CN_FIVE = "伍";
	var CN_SIX = "陆";
	var CN_SEVEN = "柒";
	var CN_EIGHT = "捌";
	var CN_NINE = "玖";
	var CN_TEN = "拾";
	var CN_HUNDRED = "佰";
	var CN_THOUSAND = "仟";
	var CN_TEN_THOUSAND = "万";
	var CN_HUNDRED_MILLION = "亿";
	var CN_SYMBOL = "人民币";
	var CN_DOLLAR = "元";
	var CN_TEN_CENT = "角";
	var CN_CENT = "分";
	var CN_INTEGER = "整";

	// Variables:
	var integral; // Represent integral part of digit number. 
	var decimal; // Represent decimal part of digit number.
	var outputCharacters; // The output result.
	var parts;
	var digits, radices, bigRadices, decimals;
	var zeroCount;
	var i, p, d;
	var quotient, modulus;

	// Validate input string:
	currencyDigits = currencyDigits.toString();
	
	if (currencyDigits == "") {
//		alert("Empty input!");
		return "";
	}
	if (currencyDigits.match(/[^,.\d]/) != null) {
		
		alert("Invalid characters in the input string!");
		return "";
	}
	if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d*)?))$/) == null) {
	//	alert("Illegal format of digit number!");
		return "";
	}

	// Normalize the format of input digits:
	currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
	currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning. 
	
	// Assert the number is not greater than the maximum number.
	if (Number(currencyDigits) > MAXIMUM_NUMBER) {
		alert("Too large a number to convert!");
		return "";
	}
	// http://www.knowsky.com/ Process the coversion from currency digits to characters:
	// Separate integral and decimal parts before processing coversion:
	parts = currencyDigits.split(".");
	if (parts.length > 1) {
		integral = parts[0];
		decimal = parts[1];
		// Cut down redundant decimal digits that are after the second.
		decimal = decimal.substr(0, 2);
	} else {
		integral = parts[0];
		decimal = "";
	}
	// Prepare the characters corresponding to the digits:
	digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT,CN_NINE);
	radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
	bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
	decimals = new Array(CN_TEN_CENT, CN_CENT);
	// Start processing:
	outputCharacters = "";
	// Process integral part if it is larger than 0:
	if (Number(integral) > 0) {
		zeroCount = 0;
		for (i = 0; i < integral.length; i++) {
			p = integral.length - i - 1;
			d = integral.substr(i, 1);
			quotient = p / 4;
			modulus = p % 4;
			if (d == "0") {
				zeroCount++;
			} else {
				if (zeroCount > 0) {
					outputCharacters += digits[0];
				}
				zeroCount = 0;
				outputCharacters += digits[Number(d)] + radices[modulus];
			}
			if (modulus == 0 && zeroCount < 4) {
				outputCharacters += bigRadices[quotient];
			}
		}
		outputCharacters += CN_DOLLAR;
	}
	// Process decimal part if there is:
	if (decimal != "") {
		for (i = 0; i < decimal.length; i++) {
			d = decimal.substr(i, 1);
			if (d != "0") {
				outputCharacters += digits[Number(d)] + decimals[i];
			}
		}
	}
	// Confirm and return the final output string:
	if (outputCharacters == "") {
		outputCharacters = CN_ZERO + CN_DOLLAR;
	}
	if (decimal == "") {
		outputCharacters += CN_INTEGER;
	}
	//outputCharacters = CN_SYMBOL + outputCharacters;
	outputCharacters = outputCharacters;
	return outputCharacters;
}//



function nst_convert(nmb,digits,hideZero) {
	if(nmb==undefined) return '';
	nmb = nmb.toString().replace("。",".").replace("０","0").replace("１","1").replace("２","2").replace("３","3").replace("４","4").replace("５","5").replace("６","6").replace("７","7").replace("８","8").replace("９","9");
	var ms = nmb.replace(/[^\-\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0").replace(/(\-\d*)\-+$/,"$1").replace(/(\d*.+)\-$/,"$1");
	//replace(/[^\d\.]/g,"")去掉输入当中不是数字和.的字符
	//replace(/(\.\d{2}).+$/,"$1") 
	//匹配从字符开始的第一个.后面的所有字符,由于没有使用g标记，
	//所以只匹配开始第一次   然后用小数点和后两位进行替换以确定数值最后的格式正确 高.
	//replace(/^0+([1-9])/,"$1") 匹配以多个0开头的数值替换为去掉0后的数值做为数字的第一位 也是匹配开始的一次.
	//replace(/^0+$/,"0") 匹配以0开始和结束的多个0为一个0 也就是0000000 输入->转换成一个0
	//以下确定输入的为过滤后的合法数字
	//alert(ms);
	var txt = ms.split(".");
	//alert(txt[0]);
	//如果ms值不小数点存在则txt[0]=小数点前的值否则等于ms
	//regexp:/\d{4}(,|$)/ 匹配四位数字和,的集合或者四位数字和字符结尾的集合
	while(/\d{4}(,|$)/.test(txt[0]))//如果为txt[0]=4123
		txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/,"$1,$2");
	//txt[0].replace(/(\d)(\d{3}(,|$))/,"$1,$2")是将txt[0]进行替换后再赋给它
	//regexp:/(\d)(\d{3}(,|$))/ 将四个数字份为两组第一个数字为第一位，后三位和其他结尾为每二位
	//并替换成 第一位,第二位 注意 ,的使用很好.   也就是将4123先替换成4,123
	//由于此表达式默认采用贪婪匹配所以从数值后向前匹配再通过循环进行再匹配替换从而可以将
	//12345678分成你想要的123,456,78 楼主彩用(,|$)很精典，因为它略去了第二次匹配时的,问题
	if(digits){
		if(txt[1]==undefined) txt[1]='';
		txt[1] += "0000000000";
		txt[1] = txt[1].substring(0,digits);
	}
	val = txt[0]+(txt.length>1?"."+txt[1]:"");
	if(hideZero==true && val-0==0) val='';
	return val;
	//最终赋值到输入框中  
	//如果有小数点则加上并购成最终数字否则显示替换后的txt[0]
	
}

function  formatNumber(nmb,digits,hideZero){
	if(digits==undefined) digits=2;
	if(hideZero==undefined) hideZero=true;
	return nst_convert(nmb,digits,hideZero);
}


/*判断日期*/
function isDate(str){
	var reg = /^((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/
	if(reg.test(str)) return true; return false;
}

/*格式化日期*/
function formatDate(date, format){
	var o = {
		"M+" : date.getMonth()+1, //month   
		"d+" : date.getDate(),    //day   
		"h+" : date.getHours(),   //hour   
		"m+" : date.getMinutes(), //minute   
		"s+" : date.getSeconds(), //second   
		"q+" : Math.floor((date.getMonth()+3)/3), //quarter   
		"S"  : date.getMilliseconds() //millisecond   
   }   
   if(/(y+)/.test(format)) format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
   for(var k in o)if(new RegExp("("+ k +")").test(format))
     format = format.replace(RegExp.$1,   
       RegExp.$1.length==1 ? o[k] :    
         ("00"+ o[k]).substr((""+ o[k]).length));   
   return format;  
}
/*for example
obj1 = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
obj2 = formatDate(new Date(), "yyyy-MM-dd");
obj3 = formatDate(new Date(), "yyyy/MM/dd");
obj4 = formatDate(new Date(), "MM/dd/yyyy");
*/

/*获取年月日及最大日*/
function getYMD(str){
	str = str.replace(/[-\. _]/g,'/');
	var date = new Date(str);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var md= new Date(y, m, 0).getDate();
	return { y:y, m:m, d:d, md:md };
}

/*获取地址栏参数值*/
function getLocationQuery(location, name){
	if(name==undefined) name='id';
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = location.substr(location.indexOf("\?")+1).match(reg);
	if (r!=null) return unescape(r[2]); return null;
}

/*去除字符串左右空格*/
function trim(str){
	return str.replace(/(^\s+)|\s+$|^　+|　+$/g,"");
}

/*将url设置为默认页*/
function setHomePage(url){
	if (document.all) {
		homepage.style.behavior='url(#default#homepage)';
		homepage.sethomepage(url);
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
		}  
		catch (e) {
			alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将[signed.applets.codebase_principal_support]设置为'true'");
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage',url);
	}
}


/*居中打开窗口*/
function open_window_center(url, width, height, state){
	if(width==0 || width==undefined) width = screen.width;
	if(height==0 || height==undefined) height = screen.height;
	var left = screen.width/2 - width/2;
	var top = screen.height/2 - height*0.618;
	window.open(url,'','width='+width+'px, height='+height+'px, left='+left+', top='+top + ',' + state);
}




/*动态加载外部文件*/
function load_file(filename){
	var ft = filename.substring(filename.lastIndexOf("."));
	if (ft==".js"){ //判断文件类型 
	  var tag = document.createElement('script')
	  tag.setAttribute("type","text/javascript")
	  tag.setAttribute("src", filename)
	} else if (ft==".css"){
	  var tag = document.createElement("link") 
	  tag.setAttribute("rel", "stylesheet") 
	  tag.setAttribute("type", "text/css")  
	  tag.setAttribute("href", filename) 
	} 
	if (typeof tag!="undefined") 
	  document.getElementsByTagName("head")[0].appendChild(tag);
}



