/**
version:	2008-10-15
author:		HuoHongJian
**/
(function($){

$.fn.dgrid = function(p){ $dgrid.main(p, this[0]); }
$.fn.dgridLoadTbodyData = function(json){ $dgrid.addTbodyData(json, this[0]); }
$.fn.dgridEditable = function(){ $dgrid.editable(this[0]); }
$.fn.dgridAppendRow = function(n){ $dgrid.appendRow(n, this[0]); }
$.fn.dgridInsertRow = function(n){ $dgrid.insertRow(n, this[0]); }
$.fn.dgridAjax = function(p){ $dgrid.ajax(p, this[0]); }
$.fn.dgridSerialize = function(p){ return $dgrid.serialize(p, this[0]); }
$.fn.dgridFocusCell = function(x, y){ $dgrid.enableTd(x*y+y, this[0]); }
$.fn.dgridDelInvRow = function(){ $dgrid.delInvRow(this[0]); }
$.fn.dgridDelCurRow = function(p){ $dgrid.delCurRow(p, this[0]); }
$.fn.dgridSetParams = function(p){ $.extend($dgrid.p[this[0].id].params, p); }
$.fn.dgridGetSeparator = function() { return {r: $dgrid.p[this[0].id].separators[0], c: $dgrid.p[this[0].id].separators[1]}; }

$.fn.dgridAuditing = function() { $dgrid.auditing(this[0]); }

$dgrid = {
	p: [],
	main: function(p, o){
		p = this.p[o.id] = this.setp(p);
		$(o).addClass('dgrid');
		//创建表头table
		var $t1 = $('<table></table>');
		var $t2 = $('<table></table>');
		
		if(p.theads.length==1){
			$t2.append($(p.theads[0]));
		}else if(p.theads.length==1){
			$t1.append($(p.theads[0]));
			$t2.append($(p.theads[1]));
		}else{
			var $th1 = $('<thead></thead>');
			var $th2 = $('<thead></thead>');
			var $tr1 = $('<tr></tr>');
			var $tr2 = $('<tr></tr>');
			for (i in p.colModel) {
				var cm = p.colModel[i];
				var th = document.createElement('th');
				th.innerHTML = cm.display;
				$(th).addClass('c'+i);
				if(i<p.fixedCol)
					$tr1.append(th);
				else
					$tr2.append(th);
				th = null;
			}
			$t1.append($th1.append($tr1));
			$t2.append($th2.append($tr2));
		}
	//	$('th', $t1).css('textAlign','center');
	//	$('th', $t2).css('textAlign','center');
			
		var $div1 = $('<div></div>').addClass('dgrid_div_1').append($t1);
		var $div2 = $('<div></div>').addClass('dgrid_div_2').append($t2);
		$(o).append($div1).append($div2).append($('<div></div>').css({clear:'both'}));
		
		var div1_width = $div1.width();
		var width = $(o).width() - div1_width;
		$div2.width(width-17);
		
		
		//创建表体
		var div3 = document.createElement('div');
		var div4 = document.createElement('div');
		var table3 = document.createElement('table');
		var table4 = document.createElement('table');
		var tbody3 = document.createElement('tbody');
		var tbody4 = document.createElement('tbody');
		$(table3).append(tbody3);
		$(table4).append(tbody4);
		$(div3).append(table3);
		$(div4).append(table4);
		$(o).append(
			$(div3).addClass('dgrid_div_3').height(p.height).width(div1_width).scroll(function(){
				$('.dgrid_div_4', o).get(0).scrollTop = this.scrollTop;
			}
			)
		);
		$(o).append(
			$(div4).addClass('dgrid_div_4').height(p.height).width(width).scroll(function(){
				$('.dgrid_div_3', o).get(0).scrollTop = this.scrollTop;
				$('.dgrid_div_2', o).get(0).scrollLeft = this.scrollLeft;
			}
			)
		);
		
		if(p.editable){
			$(o).click(function(e){
				t = e.srcElement || e.target;
				if(t.tagName=='DIV')
					$dgrid.disableTd(o);
			}
			);
			
			$('tbody',o).click(function(e){
				t = e.srcElement || e.target;
				if(t.tagName!='TD' || $(t).children().is('input')) return;
				var tr = $(t).parent();
				var x = $(t).parents('tbody').children().index($(t).parents()[0]);
				var y = $(t).attr('class').substring(1);
				$dgrid.enableTd(x, y, o);
			}
			).keydown(function(e){
				if(e.keyCode<37 & e.keyCode>40 & e.keyCode!=13) return;
				var cx = $dgrid.p[o.id].cxy.x-0;
				var cy = $dgrid.p[o.id].cxy.y-0;
				var step = 0;
				var skip = p.colModel[cy].skip;
				if(skip==undefined) skip = {left:0, right:0};
				switch(e.keyCode){
					case 13:	//回车
						if(p.enterDirect=='v')
							cx++;
						else if(p.enterDirect=='h')
							cy = cy + 1 + skip.right;
						break;
					case 37: cy = cy -1 - skip.left; break;		//左
					case 38: cx--; break;						//上
					case 39: cy = cy + 1 + skip.right; break;	//右
					case 40: cx++; break;						//下
					default : return;
				}
				var mx = $('.dgrid_div_4 tr', o).length;
				var my = p.colModel.length;
				if(cy<0) {cx--; cy+=my;}
				if(cy>=my) {cx++; cy-=my;}
				if(cx<0) {cy--; cx+=mx;}
				if(cx>=mx){
					if(p.enterAppendRow){
						$dgrid.appendRow(1, o);
						var div = $('.dgrid_div_4', o).get(0);
						div.scrollTop = div.scrollHeight; //将滚动条保持在最底部
					}else{
						cy++;
						cx-=mx;
					}
				}
				$dgrid.enableTd(cx, cy, o);
			}
			);
		}
		
		this.ajax({}, o);
		
		if(p.useFootBar || p.userPager || p.buttons.length>0){
			var $footbar = $("<div class='footbar'></div>");
			if(p.usePageBar){
				var $pd = $("<div class='pageDiv'></div>");
				$pd.append($("<a class='pButton pFirst' title='首页'><div></div></a>").click(function(){$dgrid.changePage(1, o);}));
				$pd.append($("<a class='pButton pPrev' title='前一页'><div></div></a>").click(function(){$dgrid.changePage($dgrid.p[o.id].page-1, o);}));
				$pd.append($("<span class='btnseparator'></span>"));
				$pd.append($("<span class='pageword'>Page</span>"));
				$pd.append($("<input type='text' class='pcontrol' value='1'/>").keydown(function(e){if(e.keyCode==13) $dgrid.changePage(parseInt($(this).val()), o);}));
				$pd.append($("<span>of</span>"));
				$pd.append($("<span class='pages'>1</span>"));
				$pd.append($("<span class='btnseparator'></span>"));
				$pd.append($("<a class='pButton pNext' title='下一页'><div></div></a>").click(function(){$dgrid.changePage($dgrid.p[o.id].page+1, o);}));
				$pd.append($("<a class='pButton pLast' title='末页'><div></div></a>").click(function(){$dgrid.changePage($dgrid.p[o.id].pages, o);}));
				$pd.append($("<span class='btnseparator'></span>"));
				$pd.append($("<a class='pButton pReload' title='刷新'><div></div></a>").click(function(){$dgrid.p[o.id].page=0; $dgrid.changePage(parseInt($('.pcontrol',o).val()), o);}));
				$footbar.append($pd);
			}
			for(i in p.buttons){
				var btn = p.buttons[i];
				var btnDiv = document.createElement('div');
				if(btn.id) $(btnDiv).attr('id',btn.id);
				btnDiv.className = 'fbutton';
				btnDiv.innerHTML = "<div><span>"+btn.name+"</span></div>";
				if (btn.bclass) 
					$('span',btnDiv)
					.addClass(btn.bclass)
					.css({paddingLeft:20})
					;
				btnDiv.onpress = btn.onpress;
				btnDiv.name = btn.name;
				if (btn.onpress) $(btnDiv).click(function (){this.onpress(this);});
				$footbar.append($(btnDiv));
			}
			$(o).append($footbar);
		}
	},
	changePage: function (page, o){
		if(isNaN(page) || page<1) page=1;
		if(page>this.p[o.id].pages) page=this.p[o.id].pages;
		if(page==this.p[o.id].page) return false;
		this.p[o.id].page=page;
		if (this.p[o.id].onChangePage) this.p[o.id].onChangePage(this.p[o.id].page);
		else this.ajax({}, o);
	},
	addTbodyData: function(json, o){
		this.appendRow(1, o);/*没有此行firefox不认css*/
		var p = this.p[o.id];
		$('.pcontrol', o).val(json.page);
		$('.pages', o).attr('title', '总记录数:'+json.total+' 每页记录数:'+p.rp);
		if(p.total==-1) this._countPages(json.total, o);
		
		$tbody1 = $('tbody:first', o);
		$tbody2 = $('tbody:last', o);
		$tbody1.empty();
		$tbody2.empty();
		$.each(json.rows, function(i,row){
			var tr1 = document.createElement('tr');
			var tr2 = document.createElement('tr');
			if(row.id) tr2.id = row.id;
			if(p.rowEvent) eval("$(tr2)."+ p.rowEvent.event+"(function(){p.rowEvent.handle(this);});");
			for(var j=0; j<row.cell.length; j++){
				td = document.createElement('td');
				/*
				var fn = p.colModel[j].formatNumber;
				if(fn)
					td.innerHTML = $dgrid.formatNumber(row.cell[j], fn.digits, fn.hideZero);
				else
					td.innerHTML = row.cell[j];
				*/
				var fn = p.colModel[j].init;
				td.innerHTML = fn ? fn(row.cell[j]) : row.cell[j];
				$(td).addClass('c'+j);
				if(row.title){
					var t = row.title[j]
					if(t!=undefined && t!='') $(td).attr('title',t);
				}
				if(j<p.fixedCol)
					$(tr1).append(td);
				else
					$(tr2).append(td);
				td = null;
			}
			$tbody1.append(tr1);
			$tbody2.append(tr2);
			tr1 = null;
			tr2 = null;
		}
		);
		$('.pReloading',o).attr('class','pButton pReload');
		if(json.msg!=undefined && json.msg!='') alert(json.msg);
	},
	
	ajax: function(pp, o){
		var autoload = this.p[o.id].autoload;
		this.p[o.id].autoload = true;
		if(!autoload) return false;
		
		var param = $.extend({page:this.p[o.id].page, rp:this.p[o.id].rp, total:this.p[o.id].total}, this.p[o.id].params, pp);
		if(param.total==-1) this.p[o.id].total = -1;
		p = this.p[o.id];
		if(!p.url) return false;
		
		$('.pReload',o).attr('class','pButton pReloading');
		$.ajax({
			   type:	p.method,
			   url:		p.url,
			   data:	param,
			   dataType:p.dataType,
			   success: function(json){$dgrid.addTbodyData(json, o)}
			 });
	},
	serialize: function(ps, o){
		this.delInvRow(o);
		var v = '';
		var p = this.p[o.id];
		$("tbody:last tr", o).each(function(i){
			var rowstr = p.separators[0] + this.id;
			var tr1 = $('tbody:first tr', o).get(i);
			var td1s = $('td', tr1);
			var td2s = $("td", this);
			if(ps==undefined){
				td1s.each(function(){
					rowstr += p.separators[1] + $dgrid.trim($(this).text().replace(p.separators[1],'').replace(p.separators[0],''));
				});
				td2s.each(function(){
					rowstr += p.separators[1] + $dgrid.trim($(this).text().replace(p.separators[1],'').replace(p.separators[0],''));
				});
			}else{
				for(var i=0; i<ps.length; i++){
					if(i<p.fixedCol)
						rowstr += p.separators[1] + $dgrid.trim($(td1s.get(ps[i])).text().replace(p.separators[1],'').replace(p.separators[0],''));
					else
						rowstr += p.separators[1] + $dgrid.trim($(td2s.get(ps[i-p.fixedCol])).text().replace(p.separators[1],'').replace(p.separators[0],''));
				}
			}
			v += rowstr;
		}
		);
		return v.substring(p.separators[0].length);
	},
	_countPages: function(total, o){
		if(this.p[o.id].usePageBar==false) return;
		this.p[o.id].total = total;
		this.p[o.id].pages = Math.round(this.p[o.id].total/this.p[o.id].rp + 0.4999);	//四舍五入
		if(this.p[o.id].pages<1) this.p[o.id].pages=1;
		$('.pages', o).html(this.p[o.id].pages);
		this.p[o.id].page = 1;
		$('.pcontrol', o).val(this.p[o.id].page);
	},
	setp: function(p){
		var pp = {},
		pp = $.extend(pp,
		{
			editable: false,
			enterDirect: 'v',		//回车纵向移动 or h
			enterAppendRow: false,	//最后一个单元格回车追加行
			url: false, 			//ajax url
			autoload: false,		//初始化时是否ajax
			height: 312,
			width: 'auto',
			method: 'POST',
			dataType: 'json',
			
			page: 1,				//current page
			pages: 0,				//总page
			total: -1,				//total rows if(total==-1)则在服务器端前端计算rows
			rp: 24,					// results per page
			rpOptions: [10,15,20,25,40],
			useRp: true,
			useFootBar: true,
			usePageBar: true,
			
			tableId: "A",				//表标识
			fixedCol: 0,				//锁定列数
			moveFocusLoop: false,
			cxy: {x:-1, y:-1},			//当前行列值
			div: null,
			invRows:[-1],				//无效行的列索引
			separators: ['|r|','|c|'],	//[行分隔符,列分隔符]
			params: {},					//相对固定的post参数
			
			buttons: [],
			colModel: [],
			theads: [],					//[左表头, 右表头]
			auditings: [],				//审核公式
			operations: []				//运算公式
		}, p);
		return pp;
	},
	
	enableTd: function(x, y, o){
		if(x<0 || y<0) return;
		var p = this.p[o.id];
		this.disableTd(o);
		if(y<p.fixedCol){
			var tr = $('.dgrid_div_3 tr', o).get(x);
		}else{
			var tr = $('.dgrid_div_4 tr', o).get(x);
		}
		var $td = $('.c'+y, tr);
		var v = $td.html();
		$td.empty();
		if(p.colModel[y].readonly)
			var $input = $("<input type='text' value='"+v+"' readonly/>");
		else
			var $input = $("<input type='text' value='"+v+"'/>");
		$td.append($input);
		this.p[o.id].cxy = {x:x, y:y};
		if(p.colModel[y].keypress)	$input.keypress(function(e){p.colModel[y].keypress(e,this)});
		if(p.colModel[y].keydown) 	$input.keydown(function(e){p.colModel[y].keydown(e,this)});
		if(p.colModel[y].keyup) 	$input.keyup(function(e){p.colModel[y].keyup(e,this)});
		if(p.colModel[y].focus) 	p.colModel[y].focus($input.get(0));
		// this.p.coMode[y].blur在this.disableTd()中定义
		$input.focus();
		$input.select();
	},
	disableTd: function(o){
		var p = this.p[o.id];
		var x = p.cxy.x;
		var y = p.cxy.y;
		if(x<0 || y<0) return;
		if(y<p.fixedCol)
			var tr = $('.dgrid_div_3 tr', o).get(x);
		else
			var tr = $('.dgrid_div_4 tr', o).get(x);
		var $td = $('.c'+y, tr);
		var $input = $td.children();
		if(p.colModel[y].blur) p.colModel[y].blur($input.get(0));
		var v = $input.val();
		$td.html(v);
		this.p[o.id].cxy = {x:-1, y:-1};
		return;
	},
	insertRow: function(n, o){
		if(this.p[o.id].cxy.x<0) {	//追加空行
			this.appendRow(n, o);
			return;
		}
		for(var i=0; i<n; i++){
			var tr1 = document.createElement('tr');
			var tr2 = document.createElement('tr');
			for(var j=0; j<this.p[o.id].colModel.length; j++){
				var td = document.createElement('td');
				$(td).addClass('c'+j);
				if(j<this.p[o.id].fixedCol)
					$(tr1).append(td);
				else
					$(tr2).append(td);
				td = null;
			}
			var x = this.p[o.id].cxy.x;
			$($('.dgrid_div_3 tr', o).get(x)).before(tr1);
			$($('.dgrid_div_4 tr', o).get(x)).before($(tr2).attr('id','-1'));
			this.p[o.id].cxy.x += n;
		}
	},
	appendRow: function(n, o){
		var p = this.p[o.id];
		for(var i=0; i<n; i++){
			var tr3 = document.createElement('tr');
			var tr4 = document.createElement('tr');
			for(var j=0; j<p.colModel.length; j++){
				var td = document.createElement('td');
				$(td).addClass('c'+j);
				if(j<p.fixedCol)
					$(tr3).append(td);
				else
					$(tr4).append(td);
				td = null;
			}
			$('.dgrid_div_3 table', o).append(tr3);
			$('.dgrid_div_4 table', o).append($(tr4).attr('id','-1'));
		}
	},
	
	delInvRow: function(o){
		var p = this.p[o.id].invRows;
		this.disableTd(o);
		var mx = $('.dgrid_div_4 tr', o).length;
		for(var i=mx-1; i>=0; i--){
			tr = $('.dgrid_div_4 tr', o).get(i);
			$td = $('td', tr);
			var tmp=''
			for(var j in p){
				tmp += $($td.get(p[j]-this.p[o.id].fixedCol)).html();
			}
			if(tmp==''){
				$(tr).remove();
				$($('.dgrid_div_3 tr', o).get(i)).remove();
			}
		}
	},
	
	delCurRow: function(p, o){
		var x = this.p[o.id].cxy.x;
		if(x<0) {alert('你没有选择行!'); return;}
		var tr3 = $('.dgrid_div_3 tr', o).get(x);
		var tr4 = $('.dgrid_div_4 tr', o).get(x);
		var rowid = $(tr4).attr('id');
		if(rowid==undefined) {alert('你没有选择行!'); return;}
		var mx = $('.dgrid_div_4 tr', o).length;
		if(mx==1) {alert('至少留一行,不可删除!'); return;}
		if(rowid!='-1') {
			if(!confirm('你将删除的是id='+rowid+'记录,请确认?')) return;
			p = $.extend({url:this.p[o.id].url, id:rowid, func:null, handle:null}, p);
			$.post(p.url,
			{
				func: p.func,
				id: rowid
			},
			function(data){p.handle(data)}
			);
		}
		$(tr3).remove();
		$(tr4).remove();
		var mx = $('.dgrid_div_4 tr', o).length;
		if(x>=mx) this.p[o.id].cxy.x=mx-1;
		this.enableTd(this.p[o.id].cxy.x, this.p[o.id].cxy.y, o);
	},
	
	formatNumber: function(nmb, digits, hideZero){
		if(digits==undefined) digits=2;
		if(hideZero==undefined) hideZero=true;
		var ms = nmb.toString();
		var txt = ms.split(".");
	//	txt[0] = (txt[0]-0).toLocaleString();	//firfox与ie结果不一致,对0的结果分别为 0  .00
		while(/\d{4}(,|$)/.test(txt[0]))//如果为txt[0]=4123
			txt[0] = txt[0].replace(/(\d)(\d{3}(,|$))/,"$1,$2");
		if(digits){
			if(txt[1]==undefined) txt[1]='';
			txt[1] += "0000000000";
			txt[1] = txt[1].substring(0,digits);
		}
		val = txt[0]+(txt.length>1?"."+txt[1]:"");
		if(hideZero==true && val-0==0) val='';
		return val;
		//下面这行可以控制输入过程中的错误
		//var ms = nmb.replace(/[^\-\d\.]/g,"").replace(/(\.\d{2}).+$/,"$1").replace(/^0+([1-9])/,"$1").replace(/^0+$/,"0").replace(/(\-\d*)\-+$/,"$1").replace(/(\d*.+)\-$/,"$1");
	},
	
	trim: function(value){
		return value.replace(/(^\s+)|\s+$|^　+|　+$/g,"");
	},
	
	auditing: function(o){
		
		var p = this.p[o.id];
		var formulas = p.auditings;
		var result = "";
		for(var i=0; i<formulas.length; i++){
			var fms = this.parseFormula(formulas[i], o);
			for(var j=0; j<fms.length; j++){
				var fm = fms[j];
				var ts = fm.split(/THEN/i);
				var cp = ts[0];				//条件部分
				var fp = ts[ts.length-1];	//公式部分
				if(this.formulaIsValid(ts[0], o)){
					if(this.getFormulaValue(fp,o)=="false"){
						result += "公式:" + fm + "审核有错误\n";
						var ps = fp.split(/=|>|<|>=|<=|<>|==/);
						result += "左边:" + this.getFormulaValue(ps[0],o,false) + "\t";
						result += "右边:" + this.getFormulaValue(ps[1],o,false) + "\n\n";
					}
				}
				
			}
			
		}
		if(result) alert(result);
		else alert("审核全部正确!");
	},
	
	formulaIsValid: function(formula, o){
		var c = formula.split(/IF|THEN/i)[1];
		if(c){
			var c = c.replace(/AND/gi, "&&").replace(/OR/gi, "||").replace(/NOT/gi, "!").replace(/([^=<>])=([^=])/g,"$1==$2");
			var v = this.getFormulaValue(c, o);
			if(v=="true") return true;
			else return false;
		}else{
			return true;
		}
	},
	
	parseFormula: function(formula, o){
		if(formula.indexOf("*")==-1) return new Array(formula);
		var p = this.p[o.id];
		var vals = new Array();
		
		//判断是行通配还是列通配
		var tmp = formula.substring(formula.indexOf("(")+1, formula.indexOf(")"));
		var tmps = tmp.split(",");
		var wc_x = tmps[0].indexOf("*")==-1 ? false : true;
		var wc_y = tmps[1].indexOf("*")==-1 ? false : true;
		
		var reg = new RegExp("{.*?}", "g");		// ?:最短匹配
		var subs = formula.match(reg);			//提取通配循环部分
		var f = formula.split("{")[0];			//提取公式部分
		var xs = new Array();
		var ys = new Array();
		var xl = $('.dgrid_div_4 tr', o).length;
		var yl = p.colModel.length;
		if(wc_x && !wc_y){			//只行通配
			var dash = subs ? subs[0] : "1~"+xl;
			xs = this.parseDash(dash);
			for(var i=0; i<xs.length; i++) vals.push(f.replace(/\*/g,xs[i]));
		}else if(!wc_x && wc_y){	//只列通配
			var dash = subs ? subs[0] : "1~"+yl;
			ys = this.parseDash(dash);
			for(var i=0; i<ys.length; i++) vals.push(f.replace(/\*/g,ys[i]));
		}else if(wc_x && wc_y){		//行列通配
			var dash = subs[0] || "1~"+xl;
			xs = this.parseDash(dash);
			var dash = subs[1] || "1~"+yl;
			ys = this.parseDash(dash);
			
			var tmps = f.split("*");
			var tl = tmps.length;
			for(var i=0; i<xs.length; i++){
				var str = "";
				for(var t=0; t<tl; t++){
					str += tmps[t];
					if(t<tl-1){
						if(t%2==0) str += xs[i];
						else str += "*";
					}
				}
				for(var j=0; j<ys.length; j++) vals.push(str.replace(/\*/g,ys[j]));
			}
		}
		return vals;
	},
	
	parseDash: function(para){
		para = para.replace(/[{}]/g, "");
		var vs = new Array();
		var ps = para.split(",");
		for(var i=0; i<ps.length; i++){
			if(ps[i].indexOf("~")>0){
				var lo = ps[i].split("~");
				for(var j=lo[0]; j<=lo[1]; j++){
					vs.push(j);
				}
			}else{
				vs.push(ps[i]);
			}
		}
		return vs;
	},
	
	getTdHtml: function(x,y,o){
		var p = this.p[o.id];
		x = x - 1;
		y = y - 1 + p.fixedCol;
		if(y<p.fixedCol)
			var tr = $('.dgrid_div_3 tr', o).get(x);
		else
			var tr = $('.dgrid_div_4 tr', o).get(x);
		var $td = $('.c'+y, tr);
		var result = $td.html();
		if(p.colModel[y].dataType=='number' && p.colModel[y].useDivide) result = result.replace(/\,/g, "");
		if(p.colModel[y].dataType=="string") result = '"' + result.replace(/\"/g, "'") + '"';
		return result;
	},
	
	getFormulaValue: function(exp, o, isEvalResult){
		if(isEvalResult==undefined || isEvalResult) exp = "(" + exp + ")";
		
		var tableId = this.p[o.id].tableId.toUpperCase();
		var reg = /\w*\([^\(]*?\)/g;	//最内层括号
		exp = exp.replace(/([^=<>])=([^=])/g,"$1==$2");	//将公式变化为逻辑表达式
		var subs = exp.match(reg);
		if(subs==null) return exp;
		
		for(var i=0; i<subs.length; i++){
			var f = subs[i].replace(/\(.*\)/g,"").toUpperCase();
			var value;
			switch (f){
				case "":	//计算括号内内容
					value = eval(subs[i]);
					break;
				case "ABS":
					value = eval(subs[i].replace(/ABS/i,"Math.abs"));
					break;
				case "INT":
					value = eval(subs[i].replace(/INT/i, "Math.round"));
					break;
				case tableId:	//计算Td内容
					var tmps = subs[i].split(/[\(\,\)]/);
					value = this.getTdHtml(eval(tmps[1]), eval(tmps[2]), o);
					break;
				default:
					alert("公式："+subs[i]+"不可识别!请检查表标识和公式的正确性。");
					return exp;
			}
			exp = exp.replace(subs[i], value);
		}
		return this.getFormulaValue(exp, o, false);
	}
	
};
})(jQuery);
