/**
 * @version 1.0
 * @date 	2016-08-15
 * @author	HuoHongJian
 * @param 	args
 * @returns
 * @remark	require $tbl.js
 */

$dgrid={
	appendTo:function(id){
		this.p.id=id;
		var d=this._ge(id);
		d.className = 'dgrid';
		d.innerHTML = '';
		
		var d1=this._ce('div');
		var d2=this._ce('div');
		var d3=this._ce('div');
		var d4=this._ce('div');
		var d5=this._ce('div',{ondblclick:function(e){this.style.display='none'}})
		d.appendChild(d1);
		d.appendChild(d2);
		d.appendChild(d3);
		d.appendChild(d4);
		d.appendChild(d5);

		this.p.t1=$tbl().create(this.p.head1, []).mergeCells(true).appendTo(d1).t;
		this.p.t2=$tbl().create(this.p.head2, []).mergeCells(true).appendTo(d2).t;
		this.p.t3=$tbl().create([], this.p.headv).mergeCells(false).appendTo(d3).t;
		this.p.t4=$tbl().create([], this.p.data).appendTo(d4).t;
		
		
		
		//** write style **
		var s = '.dgrid tr {height:' + this.p.cellHeight + 'px;}';
		for(var i=0; i<this.p.vc; i++){
			s += '.dgrid div:nth-child(1) .c_'+i+'{' + this.getStyleStr('c'+i, 'width') + '}';
			s += '.dgrid div:nth-child(3) .c_'+i+'{' + this.getStyleStr('c'+i) + '}';
		}
		for(var i=this.p.vc; i<this.p.hc; i++){
			s += '.dgrid div:nth-child(2) .c_'+(i-this.p.vc)+'{' + this.getStyleStr('c'+i, 'width') + '}';
			s += '.dgrid div:nth-child(4) .c_'+(i-this.p.vc)+'{' + this.getStyleStr('c'+i) + '}';
		}
		//** 必须有下面两行,否则table被撑开 **
		if (this.p.width1>0) {s += '.dgrid div:nth-child(1) table, .dgrid div:nth-child(3) table' + ' {width:' + this.p.width1 + 'px;}';}
		if (this.p.width2>0) {s += '.dgrid div:nth-child(2) table, .dgrid div:nth-child(4) table' + ' {width:' + this.p.width2 + 'px;}';}
//		if (this.p.cfloat)   {s += '.dgrid div:nth-child(4) td {text-align:' + this.p.Align[this.p.align[0]-1] + ';}';}
		s += '.dgrid div:nth-child(5){width:'+Math.max(200, this.p.width1+this.p.width2-2)+'px';
		d.appendChild(this._ce('style', {innerText: s}));
		
		
		var that = this;
		// 创建选择项selectItemDivs 
		this.p.itemDivs =[];
		this.p.itemK = undefined;
		for (var k in this.p.items) {
			this.p.itemDivs[k] = this._ce('div', {className:'itemsDiv'});
			d.appendChild(this.p.itemDivs[k]);
			$tbl().create([], this.p.items[k]).appendTo(this.p.itemDivs[k]).onclick(function(x,y,h,t,o){
				that.p.t4.rows[that.p.x].cells[that.p.y].innerHTML=o.parentNode.lastChild.innerText;
				if(that.p.enterDown){that.p.x++;}else{that.p.y++;}
				that.editTD(that.p.x, that.p.y);
		})}
		
		// 注册数据区事件 
		if(this.p.editable){
			d4.onclick = function(e) {
				var o = e.srcElement || e.target;
				if (o.tagName!='TD' || o.tagName=='INPUT') return;
				that.p.x = o.parentNode.rowIndex;
				that.p.y = o.cellIndex;
				that.editTD();
			}
			d4.onkeydown=function(e){that.moveFocus(e)}
		}
		d4.onscroll  = function(e) {
			d3.scrollTop  = this.scrollTop;
			d2.scrollLeft = this.scrollLeft;
		}
		
		d1.onclick = d2.onclick = d3.onclick = function(e) {
			if(that.p.itemK)that.p.itemDivs[that.p.itemK].style.display='none';
		}
			
		this.setScroll(d3, d4);
		window.onresize=function(e){that.setScroll(d3, d4)}
			
			
	},
	
	editTD : function() {
		if (this.p.y>=this.p.dc) {this.p.x++; this.p.y=0;}
		if (this.p.x>=this.p.dr) {this.p.y++; this.p.x=0;}
		if (this.p.y<0) {this.p.x--; this.p.y=this.p.dc-1;}
		if (this.p.x<0) {this.p.y--; this.p.x=this.p.dr-1;}
		if (this.p.x>=this.p.dr || this.p.y>=this.p.dc) {this.p.x=this.p.dr-1; this.p.y=this.p.dc-1;return; }
		if (this.p.x<0 || this.p.y<0) { this.p.x=0; this.p.y=0; return ; }

		var o = this.p.t4.rows[this.p.x].cells[this.p.y];
		var input = this._ce('input');
		input.value = o.innerHTML;
		o.innerHTML = '';		
		o.appendChild(input);
		input.focus();
		input.select();
		var that = this;
		input.onblur = function(e) {
			var I = that.p.items['r'+this.parentNode.parentNode.rowIndex] || that.p.items['c'+this.parentNode.cellIndex];
			if(I){for(var i=0; i<I.length; i++){if(this.value===I[i][0]+''){this.value=I[i][1];}}}
			this.parentNode.innerHTML = this.value;
		}
		
		// 设置选择项
		if (this.p.itemDivs) {
			if(this.p.itemK){this.p.itemDivs[this.p.itemK].style.display='none'};
			this.p.itemK = 'r'+this.p.x;
			var D = this.p.itemDivs[this.p.itemK];
			if (!D) {
				this.p.itemK = 'c'+this.p.y;
				D = this.p.itemDivs[this.p.itemK];
			}
			if (D) {
				D.style.display = 'block';
				D.style.top  = (o.offsetTop + o.offsetParent.offsetTop + this.p.cellHeight +5) + 'px';
				D.style.left = o.offsetLeft+ o.offsetParent.offsetLeft + 'px';
			} else { this.p.itemK = undefined; }
		}
		
	},
	
	moveFocus : function (e) {
		switch (e.keyCode) {
			case 13: if (this.p.enterDown){this.p.x ++;}else{this.p.y ++;}break;
			case 37:// left
				this.p.y --;
				if (this.p.y>=0 && this.p.y==this.p.dc-2 && this.p.y>this.p.hc-this.p.vc-2) {
					this.delKongCols(this.p.y+1);
				}break;
			case 38://up
				this.p.x --;
				if (this.p.x>=0 && this.p.x==this.p.dr-2 && this.p.x>this.p.vr-2) {
					this.delKongRows(this.p.x+1);
				}break;
			case 39://right
				this.p.y ++;
				if(this.p.y === this.p.dc){this.insCol(-1)}break; 
			case 40://down
				this.p.x ++;
				if(this.p.x === this.p.dr){this.insRow(-1)}break;
			default: return;
		}
		this.editTD();
	},
	
	setData:function(df) {
		this.p.itemConvert = true;
		if(df && this.p.itemConvert){df=this.itemKVConvert(df)}
		if(this.p.rfloat||this.p.cfloat){
			var d4=document.getElementById(this.p.id).getElementsByTagName('div')[3];
			d4.innerHTML='';
			this.p.data=df;
			this.initData();
			this.p.t4=$tbl().create([], this.p.data).appendTo(d4).t;
		}else{
			$tbl(this.p.t4).setData(df);
		}
		return true;
	},
	
	
	_getNumType:function(t){
		var ns=[];
		for(var n=0,N=t.length;n<N;n++){
			if(t[n]<2){ns.push(t[n])}
		}return ns;
	},
	_toNumber:function(s,x,y){
		if(!this.p.vtn || isNaN(s)){return s}
		var r=this.getStyleVal('r'+x, 'type');
		var c=this.getStyleVal('c'+y, 'type');
		if(r===undefined || c===undefined){return s}
		if(r.indexOf('d')===0 || c.indexOf('d')===0){return Number(s)}else{return s}
	},
	_toItems:function(s,x,y){
		var item=this.p.items['r'+x]||this.p.items['c'+y];
		if(item && this.p.vti){
			for(var n=0,N=item.length;n<N;n++){
				if(s==item[n][0]){s=item[n][1];break}
				else if(s==item[n][1]){s=item[n][0];break}
		}}return s;
	},
	
	getAll:function(){
		var df=[];
		for(var i=0,I=this.p.t4.rows.length;i<I;i++){
			df[i]=[];
			for(var j=0,J=this.p.t4.rows[i].cells.length;j<J;j++){
				var s=this.p.t4.rows[i].cells[j].innerHTML;
				s=this._toNumber(s,i,j);s=this._toItems(s,i,j);df[i].push(s);
		}}return df;
	},
	getCol:function(n){
		var ds=[];
		for(var i=0,I=this.p.t4.rows.length;i<I;i++){ds.push(this.getVal(i,n))}
		return ds;
	},
	
	getRow:function(n){
		var ds=[];
		for(var j=0,J=this.p.t4.rows[n].cells.length;j<J;j++){ds.push(this.getVal(n,j))}
		return ds;
	},
	getVal:function(x,y){
		var s=this.p.t4.rows[x].cells[y].innerHTML;
		if(s==='<input>') s=this.p.t4.rows[x].cells[y].firstChild.value;
		if(this.p.vtn) s=this._toNumber(s,x,y);
		if(this.p.vti) s=this._toItems(s,x,y);
		return s;
	},
	
	insRow:function(i){
		if(this.p.rfloat){
			$tbl(this.p.t4).insRow(i||this.p.x, new Array(this.p.dc));
			this.p.dr++;
			return true;
		}else{
			alert('非行浮动表，无法插入行!');
			return false;
		}
	},
	insCol:function(idx) {
		if(this.p.cfloat){
			idx = idx||this.p.y;
			for (var i=0; i<this.p.dr; i++) {
				td = this.p.t4.rows[i].insertCell(idx);
			}
			this.p.t4.rows[0].cells[this.p.dc].style.width = this.p.cellWidth + 'px';
			this.p.t4.style.width = this.p.width2 + (this.p.dc-this.p.hc+this.p.vc+1) * (this.p.cellWidth+12)  + 'px';
			this.p.dc++;
			return true;
		}else{
			alert('非列浮动表，无法插入列!');
			return false;
		}
	},
	
	
	delKongRowsCols:function(){
		this.delKongRows();this.delKongCols();return this;
	},
	delKongRows:function(){
		if(this.p.rfloat){
			var a=arguments.length>0?arguments:this._serial(this.p.dr);
			for(var i=a.length-1;i>=0;i--){
				if(this.isKongRow(a[i])){this.delRow(a[i])}
		}}return this;
	},
	delKongCols:function(){
		if(this.p.cfloat){
			var a=arguments.length>0?arguments:this._serial(this.p.dc);
			for(var j=a.length-1;j>=0;j--){
				if(this.isKongCol(a[j])){this.delCol(a[j])}
		}}return this;
	},
	delRow:function(i) {
		if(this.p.rfloat){
			this.p.t4.deleteRow(i||this.p.x);
			this.p.dr--;
			if(this.p.x>=this.p.dr){this.p.x=this.p.dr-1}
			return true;
		}else{
			return false;
		}
	},
	delCol:function(j){
		if(this.p.cfloat){
			for(var i=0;i<this.p.dr;i++){
				this.p.t4.rows[i].deleteCell(j||this.p.y);
			}
			this.p.dc--;
			if(this.p.y>=this.p.dc){this.p.y=this.p.dc-1}
			this.p.t4.style.width = this.p.width2 + (this.p.vc+this.p.dc-this.p.hc-1) * (this.p.cellWidth+12) + 'px';
			return true;
		}else{
			return false;
		}
	},
	
	isKongRow:function(i){
		if(['', '<input>'].indexOf(this.getRow(i).join(''))===-1){return false}else{return true}
	},
	isKongCol:function(j){
		if(['', '<input>'].indexOf(this.getCol(j).join(''))===-1){return false}else{return true}
	},

	
	setScroll : function(div3, div4) {
		if (this.p.t4.clientWidth > div4.clientWidth) {
			div3.style.overflowX = 'scroll';
		} else {
			div3.style.overflowX = 'hidden';
		}
		var ch = this.p.height;
		if (this.p.height===0) {
			ch = this._ge('main').clientHeight
			   - this.p.cellHeight * this.p.hr - this.p.heightOff;
		}
		div3.style.height = div4.style.height = ch + 'px';
	},
	
	audit:function(gs){
		var es=[];
		gs=this.parseFormula(gs||[].concat(this.p.auditings));
		for(var n=0,N=gs.length;n<N;n++){
			var g=gs[n];
			var cs=g.match(/[A-Za-z]*\([0-9]+,[0-9]+\)/g);
			for(var i=0,I=cs.length;i<I;i++){
				var xy=cs[i].match(/[0-9]+/g);
				var v=this.getVal(xy[0]-1,xy[1]-1);
		//		if(v==''){v=0}	//////////
				g=g.replace(cs[i], v);
			}
			g=g.replace(/[^><!]=/g,'==')
			if(!eval(g)){es.push([gs[n], g])}
		}
		
		var d=document.getElementById(this.p.id).getElementsByTagName('div')[4];
		if(this._len(es).y===0){
			d.style.display='none';
			return true;
		}
		else{
			d.style.display='block';
			d.innerHTML='错误信息:';
			$tbl().create([],es).appendTo(d);
			return false;
		}
	},
	
	parseFormula:function(gs){
		var rs=[];
		for(var n=0,N=gs.length;n<N;n++){
			if(/\*/.test(gs[n])){
				var ns;
				if(/[{}]/.test(gs[n])){
					var ns=[], t=gs[n].split(/[{}]/); gs[n] = t[0];						
					var ts=t[1].split(',');
					for(var i=0,I=ts.length;i<I;i++){
						if(/~/.test(ts[i])){
							var w=ts[i].split('~');
							for(var a=w[0];a<=w[1];a++){ns.push(a)}}
						else{ns.push(ts[n])}}}
				else{
					if(/,\*/.test(gs[n])){ns=this._serial(this.p.dc,1)}
					else{ns=this._serial(this.p.dr,1)}
				}
				for(var i=0,I=ns.length;i<I;i++){
					rs.push(gs[n].replace(/\*/g,ns[i]));
				}
			}else{rs.push(gs[n])}
		}return rs;
	},
	
	// ______________________ private method ______________________
	_ge:function(id){return document.getElementById(id)},
	_ce:function(tag, atts){var o=document.createElement(tag);for(var k in atts){o[k]=atts[k]}return o},
	_ct:function(thead, tbody, idx, onlyMergeBottomBlankCells) {
		var o = this._ce('div', {"id": 'dgrid_div_' + idx});
		var t = $tbl().create(thead, tbody, {"id": 'table' + idx})
		if(onlyMergeBottomBlankCells!=undefined){t=t.mergeCells(onlyMergeBottomBlankCells)}
		t.appendTo(o);
		return o;
	},
	_clone:function(o){var r={};
		for(var k in o){
			if(Array.isArray(o[k])){r[k]=o[k].slice(0)}
			else{r[k]=(o[k] instanceof Object)?arguments.callee(o[k]):o[k]}
		}return r
	},
	_dim:function(a){if(Array.isArray(a)){return arguments.callee(a[0])+1}else{return 0}},
	_len:function(df,deep){
		var l={x:0,y:999,Y:0};
		if(this._dim(df)===1){l={x:df.length,y:0,Y:0}}
		else if(this._dim(df)>1){l.x=df.length;l.y=df[0].length;
			if(deep===true){for(var i=0;i<l.x;i++){var n=df[i].length;l.y=Math.min(l.y,n);l.Y=Math.max(l.Y,n)}}
		}return l;
	},
	_array:function(x,y){
		var d=new Array(x);if(y!=undefined){for(var i=0;i<x;i++){d[i]=new Array(y)}}return d;
	},
	_serial:function(n,start,step){
		var s=start||0, p=step||1;
		return new Array(n).join('0,').split(',').map(function(v,k){return s+k*p})
	},
	_sum:function(a){return eval(a.join(',').split(',').join('+'))},
	
	itemKVConvert:function(df){//item键值转换
		for(var k in this.p.items){
			var item = this.p.items[k];
			var x = k.substr(1);
			if(k.substr(0,1)=='r'){
				for(var j=0,J=df[x].length;j<J;j++){
					for(var s=0,S=item.length;s<S;s++){
							 if(df[x][j]==item[s][0]){df[x][j]=item[s][1];break}
						else if(df[x][j]==item[s][1]){df[x][j]=item[s][0];break}}}}
			else if(k.substr(0,1)=='c'){
				for(var i=0,I=df.length;i<I;i++){
						for(var s=0,S=item.length;s<S;s++){
								 if(df[i][x]==item[s][0]){df[i][x]=item[s][1];break}
							else if(df[i][x]==item[s][1]){df[i][x]=item[s][0];break}}}}
		}return df;
	},	
	
	run:function(p) {
		for(var k in p){this.p[k]=p[k]}
//		this.p=this._clone(P);
		
		var l=this._len(this.p.headh);
		this.p.hr=l.x;
		this.p.hc=l.y;
		l=this._len(this.p.headv);
		this.p.vr=l.x;
		this.p.vc=l.y;
		this.initData();// 准备数据区数据
		
		for(i=0; i<this.p.hr; i++) {
			this.p.head1[i] = this.p.headh[i].slice(0, this.p.vc);
			this.p.head2[i] = this.p.headh[i].slice(this.p.vc);
		}this.p.headh = null;
		
		
		// 计算左右表格总宽度
		this.p.width1=0; this.p.width2=0;
		for(var i=0;i<this.p.vc;i++){
			this.p.width1 += parseInt(this.getStyleVal('c'+i, 'width')) + 12;
		}
		for(var i=this.p.vc;i<this.p.hc;i++){
			this.p.width2 += parseInt(this.getStyleVal('c'+i, 'width')) + 12;
		}
		
		// 将就数据库存储格式
		if(this.p.rfloat==='t'||this.p.rfloat===true){this.p.rfloat=true;}else{this.p.rfloat=false;}
		if(this.p.cfloat==='t'||this.p.cfloat===true){this.p.cfloat=true;}else{this.p.cfloat=false;}
		
		this.p.x=-1;
		this.p.y=-1;
		this.p.toNumber=true;
		this.p.toItems=true;
		return this;
	},
	getStyleVal:function(idx, property){
		var s, a=this.p.style[idx];
		if(a){var b=a[property];if(b){s=b}}
		return s;
	},
	getStyleStr:function(idx, propertys){
		var s='', a=this.p.style[idx];
		if(a){
			var I=arguments.length;
			if(I>1){
				for(var i=1;i<I;i++){
					var b=a[arguments[i]];
					if(b){s+=arguments[i]+':'+b+';'}
				}
			}else{
				for(var k in a){
					if(k==='type') continue;
					s+=k+':'+a[k]+';';
				}
			}
		}
		return s;
	},
	
	initData:function(){
		var l=this._len(this.p.data);
		this.p.dr=Math.max(1, l.x, this.p.vr);
		this.p.dc=Math.max(1, l.y, this.p.hc-this.p.vc)
		if(l.x<this.p.dr){
			this.p.data=this.p.data.concat(this._array(this.p.dr-l.x,l.y))
		}

		if(l.y<this.p.dc){
			for(var i=0;i<this.p.dr;i++){
				this.p.data[i]=this.p.data[i].concat(new Array(this.p.dc-l.y))
		}}
	},
	
	setp:function(p){
		for(var k in p){this.p[k]=p[k]};return this;
	},
	
	p:{
		id		: 'dgrid',
		headh	: [['类别','指标', '行次', '本年金额','上年金额','同比']],
		headv	: [['资产','货币资金',1],['','银行存款',2],['','货币资金',3],
		     	   ['损益','利润总额',4],['','销售收入',5],['','成本费用',6]],
		data	: [[]],
		items	: {},
		style	: {
			c0:{type:"s",	"text-align":"center",	width:"40px"},
			c1:{type:"s",	"text-align":"left", 	width:"200px"},
			c2:{type:"s",	"text-align":"center",	width:"40px"},
			c3:{type:"d2",	"text-align":"right",	width:"120px"},
			c4:{type:"d2",	"text-align":"right",	width:"120px"},
			c5:{type:"d2",	"text-align":"right",	width:"120px"}
		},
		height	  : -1,	// 0:计算frame_right的clientHeight, 负值:自动适应this.p.t4高度。 
		heightOff : 112,// 调节应自适应其他元素占用的高度
		cellHeight: 28,
		cellWidth : 120,
		rfloat	  :	false,
		cfloat	  :	false,
		
		editable : true,
		enterDown: false,		//回车纵向移动 or h
		enterAppendRow: false,	//最后一个单元格回车追加行
		//审核公式
		auditings: [],
		operations: [],				//运算公式
		//横头行  横头列   纵头行    纵头列    数据行   数据列   当前焦点坐标   左上表头         右上表头          左侧总宽度      右侧总宽度
		hr:0, hc:0, vr:0, vc:0, dr:1, dc:1, x:-1, y:-1, head1:[], head2:[], width1:0, width2:0,
		t1:null,t2:null,t3:null,t4:null,
		itemDivs:[], itemK:undefined,
		vtn:true, //valToNumber:true,
		vti:true, //valToItems:true,
	},
}
