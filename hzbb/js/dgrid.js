/**
version:	2016-07-15
author:		HuoHongJian

1. dDrid.init({})				表格初始化
2. dDrid.reflashData([[]])		添加表格数据


**/

if (!$my.ce) {
	$my.ce = function(tag, att) {
		var obj = document.createElement(tag);
		for (var k in att) {obj[k] = att[k];}
		return obj;
	}
}

dGrid = {
	init : function(p) {
		this.setpp(p);
		/** 创建表体 **/
		grid = document.getElementById(this.pp.id);
		grid.innerHTML = '';
		grid.appendChild( this.createTable(1, this.tt.head1, 0) );
		this.mergeCell(table1, true);
		grid.appendChild( this.createTable(2, this.tt.head2, this.tt.vc) );
		this.mergeCell(table2, true);
		grid.appendChild( this.createTable(3, this.pp.headv, 0) );
		this.mergeCell(table3, false)
		grid.appendChild( this.createTable(4, this.pp.data, this.tt.vc) );
		this.writeStyle();
		
		/** 注册数据区事件 **/
		var div4 = document.getElementById('dgrid_div_4');
		div4.onclick = function(e) {
			var o = e.srcElement || e.target;//事件元素本身,与this不同,this指DIV,而这里指TD
			if (o.tagName!='TD' || o.tagName=='INPUT') return;
			dGrid.tt.x = o.parentNode.rowIndex;
			dGrid.tt.y = o.cellIndex;
			dGrid.editTD(o);
		},
		div4.onkeydown = function(e) { dGrid.moveFocus(e); }
		div4.onscroll  = function(e) {
			document.getElementById('dgrid_div_3').scrollTop  = this.scrollTop;
			document.getElementById('dgrid_div_2').scrollLeft = this.scrollLeft;
		}
		
		
		dGrid.setScroll();
		window.onresize = function(e) { dGrid.setScroll(); }

	},
	
	editTD : function(o) {		
		var input = $my.ce('input');
		input.value = o.innerHTML;
		o.innerHTML = '';		
		o.appendChild(input);
		input.focus();
		input.select();
		input.onblur = function(e) { this.parentNode.innerHTML = this.value; }
	},
	
	moveFocus : function (e) {
		switch (e.keyCode) {
			case 13: if (this.pp.enterDown){this.tt.x ++;}else{this.tt.y ++;}break;
			case 37:// left
				this.tt.y --;
				if (this.pp.autoDelCol && this.tt.y>=0 &&
					this.tt.y==this.tt.dc-2 && this.tt.y>this.tt.hc-this.tt.vc-2) {
					if (this.deleteCol(this.tt.y+1)) {this.tt.dc --;}
				}break;
			case 38://up
				this.tt.x --;
				if (this.pp.autoDelRow && this.tt.x>=0 &&
					this.tt.x==this.tt.dr-2 && this.tt.x>this.tt.vr-2) {
					if (this.deleteRow(this.tt.x+1)) {this.tt.dr --;}
				}break;
			case 39://right
				this.tt.y ++;
				if (this.pp.autoAddCol && this.tt.y == this.tt.dc) {
					if (this.insertCol(this.tt.y)) {this.tt.dc ++;}
				}break; 
			case 40://down
				this.tt.x ++;
				if (this.pp.autoAddRow && this.tt.x == this.tt.dr) {
					if (this.insertRow(this.tt.x)) {this.tt.dr ++;}
				}break;
			default: return;
		}
		if (this.tt.y >= this.tt.dc) {this.tt.x ++; this.tt.y = 0;}
		if (this.tt.x >= this.tt.dr) {this.tt.y ++; this.tt.x = 0;}
		if (this.tt.y < 0) {this.tt.x --; this.tt.y = this.tt.dc-1;}
		if (this.tt.x < 0) {this.tt.y --; this.tt.x = this.tt.dr-1;}
		this.editTD(table4.rows[this.tt.x].cells[this.tt.y]);
	},

	
	writeStyle : function() {
		var s = '.dgrid_table tr {height:' + this.pp.lineHeight + 'px;}';
		for (var i=0; i<this.tt.hc; i++) {
			s += ' .cc_'+i+' {width:' + this.pp.width[i]+'px;}';
			s += ' .cc_'+i+ ', .cc_'+i+', .cc_'+i+' input';
			s += ' {text-align:' + this.pp.align[i]+';}'
		}
		/** 必须有下面两行,否则table被撑开 **/
		if (this.tt.width1>0) {s += ' #table1, #table3 {width:' + this.tt.width1 + 'px;}';}
		if (this.tt.width2>0) {s += ' #table2, #table4 {width:' + this.tt.width2 + 'px;}';}
		var style = document.createElement('style');
		style.innerText = s;
		document.getElementById('dgrid').appendChild(style);
	},
	
	reflashData : function(data) {
		for (var i=0; i<this.tt.dr; i++) {
			for (var j=0; j<this.tt.dc; j++) {
				if (data) {
					table4.rows[i].cells[j].innerHTML = data[i][j] || '';
				} else {
					table4.rows[i].cells[j].innerHTML = '';
				}
			}
		}
	},
	
	getData : function() {
		var ds = new Array();
		for (var i=0; i<this.tt.dr; i++) {
			ds[i] = new Array();
			for (var j=0; j<this.tt.dc; j++) {
				ds[i][j] = table4.rows[i].cells[j].innerHTML;
			}
		}
		return ds;
	},
	
	
	createTable : function(idx, data, start) {
		var div = $my.ce('div',   {id: 'dgrid_div_' + idx});
		var tbl = $my.ce('table', {id: 'table' + idx, className: 'dgrid_table'});
		div.appendChild(tbl);
		for (i=0; i<data.length; i++) {
			var tr = tbl.insertRow();
			for (j=0; j<data[i].length; j++) {
				td = tr.insertCell();
				td.className = 'cc_' + (j+start);
				td.innerHTML = data[i][j] || '';
			}
		}
		return div;
	},
	
	
	insertRow : function(idx) {
		var tr = table4.insertRow(idx);
		for (var i=0; i<this.tt.dc; i++) {
			td = tr.insertCell();
		}
		return true;
	},
	deleteRow : function(idx) {
		var s = '';
		for (var i=0; i<this.tt.dc; i++) {
			s += table4.rows[idx].cells[i].innerHTML;
		}
		var inputValue = table4.rows[this.tt.x+1].cells[this.tt.y].lastChild.value;
		if (s == '<input>' && inputValue == '') {
			table4.deleteRow(idx);
			return true;
		} else {
			return false;
		}
	},
	insertCol : function(idx) {		
		for (var i=0; i<this.tt.dr; i++) {
			td = table4.rows[i].insertCell(idx);
		}
		table4.rows[0].cells[this.tt.dc].style.width = this.pp.addColWidth + 'px';
		table4.style.width = this.tt.width2 + (this.tt.dc-this.tt.hc+this.tt.vc+1) * (this.pp.addColWidth+12)  + 'px';
		return true;
	},
	deleteCol: function(idx) {
		var s = '';
		for (var i=0; i<this.tt.dr; i++) {
			s += table4.rows[i].cells[idx].innerHTML;
		}
		var inputValue = table4.rows[this.tt.x].cells[this.tt.y+1].lastChild.value;
		if (s == '<input>' && inputValue == '') {
			for (var i=0; i<this.tt.dr; i++) {
				table4.rows[i].deleteCell(idx);
			}
			table4.style.width = this.tt.width2 + (this.tt.vc+this.tt.dc-this.tt.hc-1) * (this.pp.addColWidth+12) + 'px';
			return true;
		} else {
			return false;
		}
	},
	
	/** 合并单元格 **/
	mergeCell: function(table, onlyMergeBottomCellIsNull) {
		var rows = table.rows.length || 0;
		var cols = table.rows[0].cells.length || 0;
		if (rows * cols == 0) return;
		/** 纵向合并单元格 **/
		for (j=cols-1; j>=0; j--) {
			for (i=rows-1; i>0; i--) {
				if(table.rows[i].cells[j].innerHTML == '') {
					var rs = table.rows[i].cells[j].getAttribute('rowspan') || 1;
					table.rows[i].deleteCell(j);
					table.rows[i-1].cells[j].setAttribute('rowspan', parseInt(rs)+1);
				} else {
					if(onlyMergeBottomCellIsNull) {break;}
				}
			}
		}
		/** 横向合并单元格 **/
		for (i=0; i<rows; i++) {
			for (j=table.rows[i].cells.length-1; j>0; j--) {
				if (table.rows[i].cells[j].innerHTML == '') {
					var cs = table.rows[i].cells[j].getAttribute('colspan') || 1;
					table.rows[i].deleteCell(j);
					table.rows[i].cells[j-1].setAttribute('colspan', parseInt(cs)+1);
					table.rows[i].cells[j-1].removeAttribute('class');
				}
			}
		}
	},

	
	setScroll : function() {
		var div3 = document.getElementById('dgrid_div_3')
		var div4 = document.getElementById('dgrid_div_4')
		if (table4.clientWidth > div4.clientWidth) {
			div3.style.overflowX = 'scroll';
		} else {
			div3.style.overflowX = 'hidden';
		}
		var ch = this.pp.height;
		if (this.pp.height==0) {
			ch = document.getElementById('frame_right').clientHeight
			   - this.pp.lineHeight * this.tt.hr - this.pp.heightOff;
		}
		div3.style.height = div4.style.height = ch + 'px';
	},
	
	setpp : function(p) {
		for (var k in p) { this.pp[k] = p[k]; }
		this.tt.hr = this.pp.headh.length;
		this.tt.hc = this.pp.headh[0].length;
		this.tt.vr = this.pp.headv.length;
		this.tt.vc = this.pp.headv[0].length;
		
		
		this.tt.dr = Math.max(this.tt.vr, 1);
		this.tt.dc = Math.max(this.tt.hc - this.tt.vc, 1);
		
		
		for(i=0; i<this.tt.hr; i++) {
			this.tt.head1[i] = this.pp.headh[i].slice(0, this.tt.vc);
			this.tt.head2[i] = this.pp.headh[i].slice(this.tt.vc);
		}
		this.pp.headh = null;
		
		/** 计算左右表格总宽度 **/
		if (this.tt.hc > 0) {
			if (this.tt.vc > 0) {
				width1 = this.pp.width.slice(0, this.tt.vc);
				width2 = this.pp.width.slice(this.tt.vc);
				this.tt.width1 = eval(width1.join('+')) + 12 * width1.length;
				this.tt.width2 = eval(width2.join('+')) + 12 * width2.length;
			} else {
				this.tt.width2 = eval(this.pp.width.join('+')) + 12 * width2.length;
			}
			
			
		}
		
		/** 准备数据区数据 **/
		if (this.pp.data=='') {
			for(var i=0; i<this.tt.dr; i++) {
				this.pp.data[i] = new Array(this.tt.dc);
			}
		}
	},
	
	tt : {	//临时数据
	  //横头行    横头列   纵头行    纵头列    数据行   数据列    当前焦点坐标
		hr:0, hc:0, vr:0, vc:0, dr:0, dc:0, x:0, y:0,
	  //左上表头          右上表头          左侧总宽度      右侧总宽度
		head1:[], head2:[], width1:0, width2:0
	},
	
	pp : {	//初始化数据
		id		: 'dgrid',
		align	: ['center', 'left', 'center', 'right', 'left', 'left'],
		width	: [100],//[30, 100, 40, 90, 90, 90, 90],
		headh	: [['指标', '行次', '本年金额','上年金额','同比', '+_', '金额']],
		headv	: [['资产','货币资金',1],['','银行存款',2],['','货币资金',3],
		     	   ['损益','利润总额',4],['','销售收入',5],['','成本费用',6]],
		data	: [],
		
		lineHeight: 28,
		height: 0,			// 0:计算frame_right的clientHeight, 负值:自动适应table4高度。 
		heightOff: 100,	// 调节应自适应其他元素占用的高度
		
		autoAddRow: true,
		autoAddCol: true,
		autoDelRow: true,
		autoDelCol: true,
		addColWidth: 120,
		
		
		editable: false,
		enterDown: true,		//回车纵向移动 or h
		enterAppendRow: false,	//最后一个单元格回车追加行

		
		auditings: [],				//审核公式
		operations: []				//运算公式
}
		
		
		
		
		
}