/**
version:	2008-07-22
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
$.fn.dgridGetSeparator = function() { return {r: $dgrid.p[this[0].id].rowSeparator, c: $dgrid.p[this[0].id].colSeparator}; }

$dgrid = {
	p: [],
	main: function(p, o){
		p = this.p[o.id] = this.setp(p);
		$(o).addClass('dgrid');
		//创建表头table
		var div1 = document.createElement('div');
		var div2 = document.createElement('div');
		var table1 = document.createElement('table');
		var table2 = document.createElement('table');
		var thead1 = document.createElement('thead');
		var thead2 = document.createElement('thead');
		var tr1 = document.createElement('tr');
		var tr2 = document.createElement('tr');
		for (i in p.colModel){
			var cm = p.colModel[i];
			var th = document.createElement('th');
			th.innerHTML = cm.display;
			$(th).addClass('c'+i);
			$(th).css('textAlign','center');
			if(i<p.fixedCol)
				$(tr1).append(th);
			else
				$(tr2).append(th);
			th = null;
		}
		$(thead1).append(tr1);
		$(thead2).append(tr2);
		$(table1).append(thead1);
		$(table2).append(thead2);
		$(div1).append(table1);
		$(o).append($(div1).addClass('dgrid_div_1'));
		$(div2).append(table2);
		var div1_width = $(div1).width();
		var width = $(o).width() - div1_width;
		$(o).append($(div2).addClass('dgrid_div_2').width(width-17));
		
		$(o).append($('<div></div>').css({clear:'both'}));
		
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
			if(p.usePager){
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
			var rowstr = p.rowSeparator + this.id;
			var tr1 = $('tbody:first tr', o).get(i);
			var td1s = $('td', tr1);
			var td2s = $("td", this);
			if(ps==undefined){
				td1s.each(function(){
					rowstr += p.colSeparator + $dgrid.trim($(this).text().replace(p.colSeparator,'').replace(p.rowSeparator,''));
				});
				td2s.each(function(){
					rowstr += p.colSeparator + $dgrid.trim($(this).text().replace(p.colSeparator,'').replace(p.rowSeparator,''));
				});
			}else{
				for(var i=0; i<ps.length; i++){
					if(i<p.fixedCol)
						rowstr += p.colSeparator + $dgrid.trim($(td1s.get(ps[i])).text().replace(p.colSeparator,'').replace(p.rowSeparator,''));
					else
						rowstr += p.colSeparator + $dgrid.trim($(td2s.get(ps[i-p.fixedCol])).text().replace(p.colSeparator,'').replace(p.rowSeparator,''));
				}
			}
			v += rowstr;
		}
		);
		return v.substring(p.rowSeparator.length);
	},
	_countPages: function(total, o){
		if(this.p[o.id].usePager==false) return;
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
			enterDirect: 'v',	//回车纵向移动
			enterAppendRow: false,	//最后一个单元格回车追加行
			height: 312, //default height
			width: 'auto', //auto width
			url: false, //ajax url
			autoload: false,	//初始化时是否ajax
			method: 'POST', // data sending method
			dataType: 'json', // type of data loaded
			
			page: 1, //current page
			pages: 0,
			total: -1, //total rows if(total==-1)则在服务器端前端计算rows
			useRp: true, //use the results per page select box
			rp: 24, // results per page
			rpOptions: [10,15,20,25,40],
			useFootBar: true,
			usePager: true,
			buttons: [],
			
			rowSeparator: '{`r`}',
			colSeparator: '{`c`}',
			params: {},		//相关固定的post参数
			
			fixedCol: 0,	//锁定列数
			moveFocusLoop: false,
			cxy: {x:-1, y:-1},	//当前行列值
			div: null,
			invRows:[-1]	//无效行的列索引
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
	}
	
};
})(jQuery);
