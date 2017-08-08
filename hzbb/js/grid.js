/**
version:	2016-07-15
author:		HuoHongJian

1. $table
2. dGrid
3. Grid
**/


function Grid() {
	this.pp = {
			table	: null,
			data	: [[]],
			evt 	: 'onclick',
			evtCols	: [],     		//触发事件的列：空表示全部列
			evtRows	: [],			//触发事件的行：空表示全部行
			fn  	: function(i,j,text,html){}
	};
	
	if (Grid._initialized === undefined) {
		Grid.prototype.init = function(id, p) {
			for (var k in p) {this.pp[k] = p[k];}
			div = $my.ge(id);
			div.innerHTML = '';
			this.pp.table = $table.create([], this.pp.data);
			div.appendChild(this.pp.table);
			
			/** 添加onclick事件 **/
			if (this.pp.fn) {
				var _this = this;
				this.pp.table.onclick = function(e) {
					var o = e.srcElement || e.target;
					if (o.tagName !== 'TD') {return;}
					var colIdx = o.cellIndex;
					var rowIdx = o.parentNode.rowIndex;
					if (_this.pp.evtCols.length > 0 && !_this.pp.evtCols.contains(colIdx)
					|| (_this.pp.evtRows.length > 0 && !_this.pp.evtRows.contains(rowIdx))) {
						return;
					}
					_this.pp.fn(rowIdx, colIdx, o.innerText, o.innerHTML);
				}
			}
		};
		
		Grid.prototype.insertRow = function(cells) {
			$table.get(this.pp.table).insertRow(cells);
		};
		
	    Grid._initialized = true;
	}
}

/*********************************************************************************
	

dGrid = {
	init : function(p) {
		this.setpp(p);
		// 创建表体 
		grid = $my.ge(this.pp.id);
		grid.className = 'dgrid';
		grid.innerHTML = '';
		grid.appendChild( this.createTable(this.tt.head1, [], 1) );
		grid.appendChild( this.createTable(this.tt.head2, [], 2) );
		grid.appendChild( this.createTable([], this.pp.headv, 3) );
		grid.appendChild( this.createTable([], this.pp.data,  4) );
		$table.get(table1).mergeCell(true);
		$table.get(table2).mergeCell(true);
		$table.get(table3).mergeCell(false);
		this.writeStyle();
		// 创建选择项selectItemDivs 
		this.tt.itemDivs =[];
		this.tt.itemK = undefined;
		for (var k in this.pp.items) {
			this.tt.itemDivs[k] = $my.ce('div', {className:'itemsDiv'});
			this.tt.itemDivs[k].appendChild($table.create([], this.pp.items[k]));
			grid.appendChild(this.tt.itemDivs[k]);
			var _this = this;
			// 添加onclick事件
			this.tt.itemDivs[k].onclick = function(e) {
				var o = e.srcElement || e.target;
				if (o.tagName !== 'TD') {return;}
				var v = o.parentNode.lastChild.innerHTML;
				table4.rows[_this.tt.x].cells[_this.tt.y].innerHTML = v;
				if(_this.pp.enterDown){_this.tt.x++;}else{_this.tt.y++;}
				_this.editTD(_this.tt.x, _this.tt.y);
			}
		}
		// 注册数据区事件 
		_this = this;
		var div4 = $my.ge('dgrid_div_4');
		div4.onclick = function(e) {
			var o = e.srcElement || e.target;
			if (o.tagName!='TD' || o.tagName=='INPUT') return;
			_this.tt.x = o.parentNode.rowIndex;
			_this.tt.y = o.cellIndex;
			_this.editTD();
		},
		div4.onkeydown = function(e) {_this.moveFocus(e);}
		div4.onscroll  = function(e) {
			$my.ge('dgrid_div_3').scrollTop  = this.scrollTop;
			$my.ge('dgrid_div_2').scrollLeft = this.scrollLeft;
		}
		
		$my.ge('dgrid_div_1').onclick =
		$my.ge('dgrid_div_2').onclick = 
		$my.ge('dgrid_div_3').onclick = function(e) {
			if (_this.tt.itemK) _this.tt.itemDivs[_this.tt.itemK].style.display = 'none';
		}
		
		_this.setScroll();
		window.onresize = function(e) { _this.setScroll(); }

	},
	
	editTD : function() {
		if (this.tt.y>=this.tt.dc) {this.tt.x++; this.tt.y=0;}
		if (this.tt.x>=this.tt.dr) {this.tt.y++; this.tt.x=0;}
		if (this.tt.y<0) {this.tt.x--; this.tt.y=this.tt.dc-1;}
		if (this.tt.x<0) {this.tt.y--; this.tt.x=this.tt.dr-1;}
		if (this.tt.x>=this.tt.dr || this.tt.y>=this.tt.dc) {this.tt.x=this.tt.dr-1; this.tt.y=this.tt.dc-1;return; }
		if (this.tt.x<0 || this.tt.y<0) { this.tt.x=0; this.tt.y=0; return ; }

		var o = table4.rows[this.tt.x].cells[this.tt.y];
		var input = $my.ce('input');
		input.value = o.innerHTML;
		o.innerHTML = '';		
		o.appendChild(input);
		input.focus();
		input.select();
		_this = this;
		input.onblur = function(e) {
			var I = _this.pp.items['r'+this.parentNode.parentNode.rowIndex] || _this.pp.items['c'+this.parentNode.cellIndex];
			if(I){for(var i=0; i<I.length; i++){if(this.value===I[i][0]+''){this.value=I[i][1];}}}
			this.parentNode.innerHTML = this.value;
		}
		
		// 设置选择项
		if (this.tt.itemDivs) {
			if(this.tt.itemK){this.tt.itemDivs[this.tt.itemK].style.display='none'};
			this.tt.itemK = 'r'+this.tt.x;
			var D = this.tt.itemDivs[this.tt.itemK];
			if (!D) {
				this.tt.itemK = 'c'+this.tt.y;
				D = this.tt.itemDivs[this.tt.itemK];
			}
			if (D) {
				D.style.display = 'block';
				D.style.top  = (o.offsetTop + o.offsetParent.offsetTop + this.pp.lineHeight) + 'px';
				D.style.left = o.offsetLeft+ o.offsetParent.offsetLeft + 'px';
			} else { this.tt.itemK = undefined; }
		}
		
	},
	
	moveFocus : function (e) {
		switch (e.keyCode) {
			case 13: if (this.pp.enterDown){this.tt.x ++;}else{this.tt.y ++;}break;
			case 37:// left
				this.tt.y --;
				if (this.pp.cfloat && this.tt.y>=0 &&
					this.tt.y==this.tt.dc-2 && this.tt.y>this.tt.hc-this.tt.vc-2) {
					if (this.deleteCol(this.tt.y+1)) {this.tt.dc --;}
				}break;
			case 38://up
				this.tt.x --;
				if (this.pp.rfloat && this.tt.x>=0 &&
					this.tt.x==this.tt.dr-2 && this.tt.x>this.tt.vr-2) {
					if (this.deleteRow(this.tt.x+1)) {this.tt.dr --;}
				}break;
			case 39://right
				this.tt.y ++;
				if (this.pp.cfloat && this.tt.y == this.tt.dc) {
					if (this.insertCol(this.tt.y)) {this.tt.dc ++;}
				}break; 
			case 40://down
				this.tt.x ++;
				if (this.pp.rfloat && this.tt.x == this.tt.dr) {
					if (this.insertRow(this.tt.x)) {this.tt.dr ++;}
				}break;
			default: return;
		}
		this.editTD();
	},

	
	writeStyle : function() {
		var s = '.dgrid tr {height:' + this.pp.lineHeight + 'px;}';
		for (var i=0; i<this.tt.vc; i++) {
			s +=   '#dgrid_div_1 .c_' + i;
			s += ', #dgrid_div_3 .c_' + i;
			s += ' {width:' + this.pp.width[i] + 'px;}';
			s +=   '#dgrid_div_3 .c_' + i;
			s += ' {text-align:' + this.tt.Align[this.pp.align[i]-1] + ';}';
		}
		for (var i=this.tt.vc; i<this.tt.hc; i++) {
			s +=   '#dgrid_div_2 .c_' + (i-this.tt.vc);
			s += ', #dgrid_div_4 .c_' + (i-this.tt.vc);
			s += ' {width:' + this.pp.width[i] + 'px;}';
			s += ', #dgrid_div_4 .c_' + (i-this.tt.vc);
			s += ' {text-align:' + this.tt.Align[this.pp.align[i]-1]+';}'
		}
		/** 必须有下面两行,否则table被撑开 **
		if (this.tt.width1>0) {s += '#table1, #table3' + ' {width:' + this.tt.width1 + 'px;}';}
		if (this.tt.width2>0) {s += '#table2, #table4' + ' {width:' + this.tt.width2 + 'px;}';}
		
		if (this.pp.cfloat) {s += '#table4 td {text-align:' + this.tt.Align[this.pp.align[0]-1] + ';}';}
		
		var style = $my.ce('style', {innerText: s});
		$my.ge(this.pp.id).appendChild(style);
	},

	createTable : function(thead, tbody, idx) {
		var div = $my.ce('div',   {"id": 'dgrid_div_' + idx, "tabindex":"'"+idx+"'"});
		var tbl = $table.create(thead, tbody, {"id": 'table' + idx});
		div.appendChild(tbl);
		return div;
	},
	
	renewData   : function(data) {
		if (data=='' || data==null || data==undefined) data=[['']];
		this.tt.dr = data.length;
		this.tt.dc = data[0].length;
		var div = $my.ge('dgrid_div_4');
		div.removeChild(div.firstChild);
		div.appendChild($table.create([], data, {"id": 'table4'}));
	},
	
	reflashData : function(data, convertItemsToValue) {
		if(convertItemsToValue){data = this.itemKVConvert(data, true);}
		return $table.get(table4).resetData(data);
	},
	
	getAllData  : function(convertItemsToKey, convertdf){
		var df = $table.get(table4).getAllData();
		if(convertItemsToKey){df = this.itemKVConvert(df, false);}
		if(convertdf){df=this.convertDF(df);}
		return df;
	},
	
	convertDF: function(df){// 根据行列属性转换数据格式
		for(var i=0; i<df.length; i++){
			for(var j=0; j<df[i].length; j++){
				if(this.pp.rtype[i]===undefined){df[i][j]=this.convertdf(df[i][j], this.pp.ctype[j]);}
				else{df[i][j]=this.convertdf(df[i][j], this.pp.rtype[i]);}
		}}
		return df;
	},
	convertdf: function(v, t){
		switch(t){
			case 0: v = parseInt(v);   break;	//整数型
			case 1: v = parseFloat(v); break;	//1位小数
			case 2: v = parseFloat(v); break;	//2位小数
			case 3: v = parseInt(v);   break;	//序数型
		}
		return v;
	},
	
	itemKVConvert: function(df, kToV){//item键值相互转换
		for(var k in this.pp.items){
			var item = this.pp.items[k];
			var x = k.substr(1);
			if(k.substr(0,1)=='r'){
				for(var j=0; j<df[x].length; j++){
					if(kToV==undefined || kToV){
						for(var s=0; s<item.length; s++){
							if(df[x][j]==item[s][0]){df[x][j]=item[s][1];break;}
					}}else{
						for(var s=0; s<item.length; s++){
							if(df[x][j]==item[s][1]){df[x][j]=item[s][0];break;}
			}}}}else{
				for(var i=0; i<df.length; i++){
					if(kToV==undefined || kToV){
						for(var s=0; s<item.length; s++){
							if(df[i][x]==item[s][0]){df[i][x]=item[s][1];break;}
					}}else{
						for(var s=0; s<item.length; s++){
							if(df[i][x]==item[s][1]){df[i][x]=item[s][0];break;}
		}}}}}
		return df;
	},	
	
	insertRow   : function(idx) {return $table.get(table4).insertRow(new Array(this.tt.dc), idx);},
	
	deleteRow : function(idx) {
		if (table4.rows[this.tt.x+1].cells[this.tt.y].lastChild.value != '') {return false;}
		for (var i=0; i<this.tt.dc; i++) {
			var s = table4.rows[idx].cells[i].innerHTML;
			if (s!='' && s!='<input>') {return false;}
		}
		table4.deleteRow(idx);
		return true;
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
		if (table4.rows[this.tt.x].cells[this.tt.y+1].lastChild.value != '') {return false;}
		for (var i=0; i<this.tt.dr; i++) {
			var s = table4.rows[i].cells[idx].innerHTML;
			if (s!='' && s!='<input>') {return false;}
		}
		for (var i=0; i<this.tt.dr; i++) {
			table4.rows[i].deleteCell(idx);
		}
		table4.style.width = this.tt.width2 + (this.tt.vc+this.tt.dc-this.tt.hc-1) * (this.pp.addColWidth+12) + 'px';
		return true;
	},
	
	setScroll : function() {
		var div3 = $my.ge('dgrid_div_3')
		var div4 = $my.ge('dgrid_div_4')
		if (table4.clientWidth > div4.clientWidth) {
			div3.style.overflowX = 'scroll';
		} else {
			div3.style.overflowX = 'hidden';
		}
		var ch = this.pp.height;
		if (this.pp.height==0) {
			ch = $my.ge('frame_right').clientHeight
			   - this.pp.lineHeight * this.tt.hr - this.pp.heightOff;
		}
		div3.style.height = div4.style.height = ch + 'px';
	},
	
	setpp : function(p) {
		for (var k in p) { this.pp[k] = p[k]; }
		if(this.pp.headh[0]){
			this.tt.hr = this.pp.headh.length;
			this.tt.hc = this.pp.headh[0].length;
		}else{
			this.tt.hr = 0;
			this.tt.hc = 0;
		}
		if(this.pp.headv[0]){
			this.tt.vr = this.pp.headv.length;
			this.tt.vc = this.pp.headv[0].length;
		}else{
			this.tt.vr = 0;
			this.tt.vc = 0;
		}
		if(this.pp.data[0]){
			this.tt.dr = this.pp.data.length;
			this.tt.dc = this.pp.data[0].length;
		}else{
			this.tt.dr = 1;
			this.tt.dc = 1;
		}
		this.tt.dr = Math.max(this.tt.vr, this.tt.dr);
		this.tt.dc = Math.max(this.tt.hc-this.tt.vc, this.tt.dc);
		
		
		this.tt.head1 = [];
		this.tt.head2 = [];
		for(i=0; i<this.tt.hr; i++) {
			this.tt.head1[i] = this.pp.headh[i].slice(0, this.tt.vc);
			this.tt.head2[i] = this.pp.headh[i].slice(this.tt.vc);
		}
		this.pp.headh = null;
		
		// 计算左右表格总宽度
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
		
		// 准备数据区数据 
		if (this.pp.data=='') {
			for(var i=0; i<this.tt.dr; i++) {
				this.pp.data[i] = new Array(this.tt.dc);
			}
		}
		
		
		
		// 将就数据库存储格式
		if(this.pp.rfloat==='t' || this.pp.rfloat===true){this.pp.rfloat=true;}else{this.pp.rfloat=false;}
		if(this.pp.cfloat==='t' || this.pp.cfloat===true){this.pp.cfloat=true;}else{this.pp.cfloat=false;}
		
	},
	
	tt : {	//临时数据
	  //横头行    横头列   纵头行    纵头列    数据行   数据列    当前焦点坐标
		hr:0, hc:0, vr:0, vc:0, dr:1, dc:1, x:0, y:0,
	  //左上表头          右上表头          左侧总宽度      右侧总宽度
		head1:[], head2:[], width1:0, width2:0, 
		itemDivs:[], itemK:undefined,
		Align:['left', 'center', 'right'],
	},
	
	pp : {	//初始化数据
		id		: 'dgrid',
		align	: [1, 2, 3],
		width	: [100],//[30, 100, 40, 90, 90, 90, 90],
		headh	: [['指标', '行次', '本年金额','上年金额','同比', '+_', '金额']],
		headv	: [['资产','货币资金',1],['','银行存款',2],['','货币资金',3],
		     	   ['损益','利润总额',4],['','销售收入',5],['','成本费用',6]],
		data	: [],
		
		ctype	: [],
		rtype	: [],
		
		lineHeight: 28,
		height: 0,			// 0:计算frame_right的clientHeight, 负值:自动适应table4高度。 
		heightOff: 100,		// 调节应自适应其他元素占用的高度
		items	 : {},
		
		addColWidth: 120,
		rfloat:		false,
		cfloat:		false,
		
		
		editable: false,
		enterDown: false,		//回车纵向移动 or h
		enterAppendRow: false,	//最后一个单元格回车追加行

		
		auditings: [],				//审核公式
		operations: []				//运算公式
	}
}

/****************************************************************************

	
$table = {
	table : null,
	
	get: function(obj) {
		switch (typeof obj) {
			case 'string': this.table = $my.ge(obj); break;
			case 'object': this.table = obj; break;
			default      : this.table = null;
		}
		return this;
	},
	
	create: function(thead, tbody, attribute) {
		var t = $my.ce('table', attribute);
		var h = $my.ce('thead');
		var b = $my.ce('tbody');
		t.appendChild(h);
		t.appendChild(b);
		for(var i=0; i<thead.length; i++){
			var tr = $my.ce('tr');	h.appendChild(tr);
			for(var j=0; j<thead[i].length; j++){
				if(thead[i][j]===undefined){thead[i][j]='';}
				tr.appendChild($my.ce('th', {className: 'c_'+j, innerHTML: thead[i][j]}));
			}
		}
		for(var i=0; i<tbody.length; i++){
			var tr = $my.ce('tr');	b.appendChild(tr);
			for(var j=0; j<tbody[i].length; j++){
				if(tbody[i][j]===undefined){tbody[i][j]='';}
				tr.appendChild($my.ce('td', {className: 'c_'+j, innerHTML: tbody[i][j]}));
			}
		}
		return t;
	},
	
	/** 合并单元格 **
	mergeCell: function(onlyMergeBottomCellIsNull) {
		var rows = this.table.rows.length || 0;
		if(this.table.rows[0]){cols=this.table.rows[0].cells.length}else{cols=0;}
		if (rows * cols == 0) { return; }
		/** 纵向合并单元格 **
		for (j=cols-1; j>=0; j--) {
			for (i=rows-1; i>0; i--) {
				if(this.table.rows[i].cells[j].innerHTML == '') {
					var rs = this.table.rows[i].cells[j].getAttribute('rowspan') || 1;
					this.table.rows[i].deleteCell(j);
					this.table.rows[i-1].cells[j].setAttribute('rowspan', parseInt(rs)+1);
				} else {
					if(onlyMergeBottomCellIsNull) {break;}
				}
			}
		}
		/** 横向合并单元格 **
		for (i=0; i<rows; i++) {
			for (j=this.table.rows[i].cells.length-1; j>0; j--) {
				if (this.table.rows[i].cells[j].innerHTML == '') {
					var cs = this.table.rows[i].cells[j].getAttribute('colspan') || 1;
					this.table.rows[i].deleteCell(j);
					this.table.rows[i].cells[j-1].setAttribute('colspan', parseInt(cs)+1);
					this.table.rows[i].cells[j-1].removeAttribute('class');
				}
			}
		}
		return true;
	},
	
	insertRow: function(cells, index) {
		if (index === undefined) {index = -1;}
		var tr = this.table.insertRow(index);
		for (var j=0; j<cells.length; j++) {
			cell = tr.insertCell();
			cell.className = 'c_' + j;
			cell.innerHTML = cells[j] || '';
		}
		return true;
	},

	insertCol : function(cells, index) {
		if (index === undefined) {index = -1;}
		for (var i=0; i<this.table.rows.length; i++) {
			cell = this.table.rows[i].insertCell(idx);
			cell.innerHTML = cells[j] || '';
		}
		return true;
	},
	
	
	resetData: function(data) {
		for(var i=0; i<this.table.rows.length; i++){
			for(var j=0; j<this.table.rows[i].cells.length; j++){
				if (data && data[i][j]) {
					this.table.rows[i].cells[j].innerHTML = data[i][j];
				} else {
					this.table.rows[i].cells[j].innerHTML = '';
				}
			}
		}
		
		
		return true;
	},
	
	getAllData : function() {
		if (this.table === null) {return null;}
		var ds = new Array();
		for (var i=0; i<this.table.rows.length; i++) {
			ds[i] = new Array();
			for (var j=0; j<this.table.rows[i].cells.length; j++) {
				ds[i][j] = this.table.rows[i].cells[j].innerHTML;
			}
		}
		return ds;
	},
	
	getRowData: function(index) {
		var ds = new Array();
		for (var j=0; j<this.table.rows[index].cells.length; j++) {
			ds.push(this.table.rows[index].cells[j].innerHTML);
		}
		return ds;
	},
	
	getColData: function(index) {
		var ds = new Array();
		for (var i=0; j<this.table.rows.length; i++) {
			ds.push(this.table.rows[i].cells[index].innerHTML);
		}
		return ds;
	},
	
	getCellData: function(rowIndex, colIndex) {
		return this.table.rows[rowIndex].cells[colIndex].innerHTML;
	}
	
	
	
}

*/

	
	
		
if ($my === undefined) $my = new Object();


if ($my.ce === undefined) {
	$my.ce = function(tag, att) {
		var obj = document.createElement(tag);
		for (var k in att) {obj[k] = att[k];}
		return obj;
	}
}

if ($my.ge === undefined) {
	$my.ge = function(s) {
		var o = document.getElementById(s) || document.getElementsByTagName(s);
		return o;
	}
}



