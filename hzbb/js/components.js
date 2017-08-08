/*	date: 	2016-9-12
 * 	author:	HuoHongJian
 * 	content:
 * 		1. xhr
 * 		2. dataFrame
 * 		3. briefTable
 * 		4. tab
 * 		5. imgbar
 */

// ******************************* xhr ******************************

$xhr = {
	xhrs: [],
	getInstance: function(){
		var ln = this.xhrs.length;
		for(var i=0; i<ln; i++){
			if(this.xhrs[i].readyState==0 || this.xhrs[i].readyState==4){return this.xhrs[i]}
		}var xhr;
		try{xhr=new XMLHttpRequest()}catch(e){alert('您的浏览器版本太低，请升级至IE10+或最新版的firefox!')}
		if(typeof xhr.withCredentials===undefined){alert('您的浏览器不支持跨源请求，请升级至IE10+或最新版的firefox!')}
		if(ln<2){this.xhrs.push(xhr)}
		return xhr;
	},
	
	run:function(cfg){
		var p={
			"formid"	: undefined,
			"method"	: "POST",
			"url"		: "",
			"data"		: {},
			"type"		: "JSON",
			"async"		: true,
			"timeout"	: 3000,
			"ontimeout" : function(e) {console.log('request timeout!')},
			"onabort"	: function(e) {console.log('request abort!')},
	        "onerror" 	: function(e) {console.log('request failed!')},
	        "onload"	: function(res) {console.log(res)},
	        "onloadstart":function(e) {console.log('request start..., xhrs.length:' + $xhr.xhrs.length)},
	        "onprogress": function(loaded, total) {console.log(loaded+'/'+total)}};
		for(var k in cfg){p[k]=cfg[k]}
		
		// 加随机数防止缓存
		p.url += p.url.indexOf("?")>0 ? "&" : "?";
		p.url += "randnum=" + Math.random();

		var fd = p.formid===undefined ? new FormData() : new FormData(document.getElementById(p.id))
		if(typeof(p.data)==='object'){for(var k in p.data){fd.append(k, p.data[k])}}
		else{fd.append('fn', p.data)}
		
		var xhr = this.getInstance();
		xhr.open(p.method, p.url, p.async);
		xhr.timeout = p.timeout;
		xhr.send(fd);
		// 传递事件函数
		xhr.ontimeout 	= p.ontimeout;
		xhr.onabort 	= p.onabort;
		xhr.onerror 	= p.onerror;
		xhr.onloadstart	= p.onloadstart;
		xhr.onload      = function(event){
				var res = event.target.responseText;
				if (p.type.toUpperCase() === 'JSON' && res != ''){
					try{res=JSON.parse(res)}catch(e){}
				}
				p.onload(res);
			};
		xhr.upload.onprogress = function(e){
			if(e.lengthComputable){p.onprogress(e.loaded, e.total)}
		};
	},
	p:{
		"formid"	: undefined,
		"method"	: "POST",
		"url"		: "",
		"data"		: {},
		"type"		: "JSON",
		"async"		: true,
		"timeout"	: 3000,
		"ontimeout" : function(e) {console.log('request timeout!');},
		"onabort"	: function(e) {console.log('request abort!');},
        "onerror" 	: function(e) {console.log('request failed!');},
        "onload"	: function(res) {console.log(res);},
        "onloadstart":function(e) {console.log('request start..., xhrs.length:' + $xhr.xhrs.length);},
        "onprogress": function(loaded, total) {console.log(loaded+'/'+total);}
        
	}
		
};

// ************************************* dataFrame ******************************************
(function(){
	this.dataFrame = function(source) {
		if (isArray(source) && (isArray(source[0]) || isObject(source[0]))) return _.set(source);
		console.log('data df is wrong! create empty dataFrame.');
		return _.set([[]]);
	}
					
	var _ = {}, df, filler='';
	
	_.set 	= function(source) {df = source; return this};
	_.val 	= _.value = _.getValue = function() {return df};
	_.check = function(deep) {};
	_.size 	= function(deep) {var l={x:df.length, y:df[0].length, Y:0};if(deep){for(var i=0;i<l.x;i++){var n=df[i].length;l.y=Math.min(l.y,n);l.Y=Math.max(l.Y,n)}}return l};
	_.keys 	= function() {return keys(df[0])};
	// 行列转置
	_.cross = function() {
		var l=this.size(true), v=[];
		for(var j=0; j<l.Y; j++){v[j]=[]; for(var i=0; i<l.x; i++){v[j][i]=df[i][j] || filler}}
		df=v; return this;
	};
	
	_.getCol = function(j){
		var v=[];
		for(var i=0, I=df.length; i<I; i++){
			v.push(df[i][j])
		}return v;
	};
	
	_.setCol = function(j, arr, startRow) {
		var x = startRow ? startRow : 0;
		for(var n=0, N=arr.length; n<N; n++) df[n+x][j] = arr[n];
		return this;
	};
	
	_.getRowsAtEmptyCols = function(args) {
		var v=[];
		for (var i=0, I=df.length; i<I; i++) {
			if(this.isEmptyRowAtCols.call(null, i, arguments)) v.push(i)
		}
		return v;
	};
	
	_.delRow		= function(i) {df.splice(i,1); return this};
	_.delRows 		= function(args) {for(var n=arguments.length-1;n>=0;n--){this.delRow(arguments[n])}; return this};
	_.delEmptyRows	= function() {for (var i=df.length-1; i>=0; i--) {if (this.isEmptyRow(i)) this.delRow(i)}return this};
	_.delRowsAtEmptyCols = function(args) {
		for (var i=df.length-1; i>=0; i--) {
			if(this.isEmptyRowAtCols.call(this, i, arguments)) this.delRow(i);
		}return this;
	};
	_.delCol		= function(j){for(var i=0,I=df.length;i<I;i++){df[i].splice(j,1)}return this};
	_.delCols		= function(args){for(var n=arguments.length-1;n>=0;n--){this.delCol(arguments[n])}return this};
	_.delEmptyCols	= function(){
		for (var j=this.df[0].length-1;j>=0;j--) {
			if (this.isEmptyCol(j)) this.delCol(j)
		}return this;
	};
	_.delEmptyRCS	= function(){this.delEmptyRows(); this.delEmptyCols(); return this};
	
	_.isEmptyRow		= function(i) {return isEmpty(df[i].join(''))};
	_.isEmptyRowAtCols 	= function(i, cols) {for(var n=0, N=cols.length; n<N; n++) if(!isEmpty(df[i][cols[n]])) return false; return true};
	_.isEmptyCol		= function(j) {for(var i=0,I=df.length;i<I;i++) if(!isEmpty(df[i][j])) return false;return true};
	
	
	var kvConvert = function(a, ks, vs){
		var i=ks.indexOf(a);
		if(i==-1){i=vs.indexOf(a);
		if(i==-1){return a}else{return ks[i]}}else{return vs[i]}
	};
	
	
	
	
	
	_.k2v = function(kvs) {for(var n=0, N=kvs.length; n<N; n++) kvc(kvs[n]); return this};
	_.v2k = function(kvs) {for(var n=0, N=kvs.length; n<N; n++) {var o=kvs[n]; kvc({row:o.row, col:o.col, ks:o.vs, vs:o.ks})}; return this};
	var kvConvert = function (a, ks, vs){var i=ks.indexOf(a); return i===-1 ? a : vs[i]},
		kvc = function(kv){
			if(kv.row==='*'||kv.row==='') {kvcAtCol(kv.col, kv.ks, kv.vs); return}
			if(kv.col==='*'||kv.col==='') {kvcAtRow(kv.row, kv.ks, kv.vs); return}
			kvcAtCell(kv.row, kv.col, kv.ks, kv.vs); return
		},
		kvcAtCol = function(col, ks, vs){
			for(var i=0,I=df.length;i<I;i++) df[i][col] = kvConvert(df[i][col], ks, vs);
		},
		kvcAtRow = function(row, ks, vs){
			for(var j=0,J=df[row].length;j<J;j++) df[row][j] = kvConvert(df[row][j], ks, vs);
		},
		kvcAtCell = function(row, col, ks, vs){
			df[row][col] = kvConvert(df[row][col], ks, vs);
		};
	
	_.audit	= function(formulas){
		if(formulas.length==0){return null;}
		var es=[], gs=parseFormula(formulas);
		for(var n=0,N=gs.length;n<N;n++){
			var g=gs[n];
			var cs=g.match(/[A-Za-z]*\([0-9]+,[0-9]+\)/g);
			for(var i=0,I=cs.length;i<I;i++){
				var xy=cs[i].match(/[0-9]+/g);
				g=g.replace(cs[i], '"'+df[xy[0]-1][xy[1]-1]+'"' || '0');
			}
			g=g.replace(/(?=[^><!])(=)/g,'==').replace(/OR/gi, '||').replace(/AND/gi, '&&');
			if(!eval(g)){es.push([gs[n], g])}
		}
		return es.length==0 ? null : es;
	};
	
	var parseFormula = function(gs){
		var rs=[];
		for(var n=0,N=gs.length;n<N;n++){
			if(/\*/.test(gs[n])){
				var ns=[];
				if(/[{}]/.test(gs[n])){
					var t=gs[n].split(/[{}]/), ts=t[1].split(',');
					for(var i=0,I=ts.length;i<I;i++){
						if(/~/.test(ts[i])){
							var w=ts[i].split('~');
							for(var a=w[0];a<=w[1];a++){ns.push(a)}}
						else{ns.push(ts[n])}}}
				else{
					var l=this.len();
					ns=this._serial(/,\*/.test(t[0]) ? l.y : l.x, 1);
				}
				for(var i=0,I=ns.length;i<I;i++){
					rs.push(t[0].replace(/\*/g,ns[i]));
				}
			}else{rs.push(gs[n])}
		}return rs;
	};
	

	var toString 	= Object.prototype.toString,
		isArray 	= function(obj) {return toString.call(obj) === '[object Array]'},
		isObject 	= function(obj) {return toString.call(obj) === '[object Object]'},
		isString 	= function(obj) {return toString.call(obj) === '[object String]'},
		isNumber 	= function(obj) {return toString.call(obj) === '[object Number]'},
		isDate 		= function(obj) {return toString.call(obj) === '[object Date]'},
		isArguments = function(obj) {return toString.call(obj) === '[object Arguments]'},
		isBoolean 	= function(obj) {return obj === true || obj === false},
		isNaN 		= function(obj) {return isNumber(obj) && obj !== +obj},
		isNull 		= function(obj) {return obj === null},
		isUndefined = function(obj) {return obj === void 0},
		isElement 	= function(obj) {return !!(obj && obj.nodeType === 1)},
		isArrayLike = function(obj) {
			var length = obj == null ? void 0 : obj['length'];
			return typeof length == 'number' && length >= 0;
		},
		isEmpty = function(obj) {
			if (obj==null) return true;
			if (isString(obj) || isArray(obj) || isArguments(obj)) return obj.length === 0;
			if (isObject(obj)) return keys(obj).length === 0;
			return false;
		},
		has  = function(obj, key) {return obj != null && Object.prototype.hasOwnProperty.call(obj, key)},
		keys = function(obj) {
			if (!isObject(obj)) return [];
			if (Object.keys) return Object.keys(obj);
			var keys = [];
			for (var key in obj) keys.push(key);
			return keys;
		},
		each = function(obj, iteratee) {for (var i=0, I=obj.length; i<I; i++) iteratee(obj[i], i, obj);return obj},
		map  = function(obj, iteratee) {var v=Array();for (var i=0, I=obj.length; i<I; i++) v[i]=iteratee(obj[i], i, obj);return v},
		range = function(start, stop, step) {
			if (stop==null) {stop = start || 0; start = 0}
			step = step || 1;
			var length = Math.max(Math.ceil((stop - start) / step), 0);
			var range = Array(length);
			for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
			return range;
		},
		createEmptyArray = function(x,y){var d=new Array(x);if(y!=undefined){for(var i=0;i<x;i++) d[i]=new Array(y)}return d},
		sum = function(a){return eval(a.join(',').split(',').join('+'))};
	  
	
}.call(this));





// **************************************  briefTable  ******************************************

(function(){
	this.briefTable = function(table){
		if (table instanceof HTMLTableElement) {
			return new BriefTable(a);
		} else {
			return new BriefTable();
		}
	};
	
	function BriefTable(table) {
		this.t = table;
		this.f = null;
		this.x = -1;
		this.y = -1;
	}
	
	var _ = new Object();
	BriefTable.prototype = _;
	
	_.create = function(thead, tbody, attObj) {
		thead = thead || [];
		tbody = tbody || [];
		this.t = ce('table',attObj);
		var l = size(thead);
		if(l.x>0){
			var h = ce('thead'); this.t.appendChild(h);
			for(i=0; i<l.x; i++){
				var r = ce('tr'); h.appendChild(r);
				for(j=0; j<l.y; j++){
					var d = ce('th', {className:'c_'+j});
					r.appendChild(d);
					d.innerHTML = thead[i][j] || this.f;
		}}}
		l = size(tbody);
		if(l.x>0){
			var b = ce('tbody'); this.t.appendChild(b);
			for(i=0; i<l.x; i++){
				var r = ce('tr'); b.appendChild(r);
				for(j=0; j<l.y; j++){
					var d = ce('td', {className:'c_'+j});
					r.appendChild(d);
					d.innerHTML = tbody[i][j] || this.f;
		}}}return this;
	};
	
	_.appendTo = function(id, clear){
		var o = typeof id === 'string' ? document.getElementById(id) : id;
		if(clear) o.innerHTML = ''
		o.appendChild(this.t);
		return this;
	};
	
	_.destroy = function(){
		this.t = null; return this;
	};
	
	_.addEvt = function(evtName, callback) {this.t[evtName]=callback; return this};
	_.onclick = function(fn) {
		this.t.style.cursor='pointer'; 
		var that=this;
		this.t.onclick=function(e){
			if(that.x > -1){
				var r = that.t.rows[that.x], c = r.cells[that.y];
				r.className = r.className.replace(' currentRow', '');
				c.className = c.className.replace(' currentCell', '');
			}
			
			var o=e.srcElement || e.target;
			var o = evtPop(o, 'TD');
			var op= o.parentNode;
				that.x = op.rowIndex,
				that.y = o.cellIndex,
				h = that.getCell(that.x, that.y),
				t = that.getCell(that.x, that.y, 'text');
			if(fn) {fn(that.x, that.y, h, t, o)} else {alert('单元格坐标为:('+that.x+','+that.y+'),\r\nhtml内容为:'+h+',\r\n文本内容为:'+t)}
			o.className = o.className + ' currentCell';
			op.className = op.className + ' currentRow';
		};
		return this;
	};
	_.getCell = function(x, y, f) {
		var c=this.t.rows[x].cells[y];
		return f==='text' ? c.innerText : c.innerHTML;
	};
	
	/*
	
	fit:function(){//未考虑colspan
		var l=this._size(true);
		if(l.y<l.Y){
			for(var i=0;i<l.x;i++){
				var n=this.t.rows[i].cells.length;
				for(var j=n-1;j<l.y;j++){
					var c=this.t.rows[i].insertCell();
					c.innerHTML=this.f;
					c.className='c_'+j;
		}}}return this;
	},
	
	
	
	
	delCols:function(idx,args){
		var df=[];
		for(var i=0,I=this.t.rows.length;i<I;i++){
			df.push(this.t.rows[i].cells[idx].innerHTML);
			this.t.rows[i].deleteCell(idx)
		}return df;
	},
	insRow:function(i,ds){
		var tr=this.t.insertRow(i);
		for (var j=0; j<ds.length; j++){
			var c=tr.insertCell();
			c.innerHTML=ds[j]||this.f;
			c.className='c_'+j;
		}return this;
	},
	insRows:function(idx,args){
		var a=arguments, s=1, r=-1;
		if(!isNaN(idx)){r=idx}
		else if(this._dim(idx)===1){s=0}
		else{alert('insRows()->arguments invalid!');return this}
		for(var n=s,N=a.length;n<N;n++){
			var tr=this.t.insertRow(r);r++;
			for (var j=0; j<a[n].length; j++){
				var cell=tr.insertCell();
				cell.innerHTML=a[n][j]||this.f;
				cell.className='c_'+j;
		}}return this;
	},
	insCol:function(j,ds){
		for(var i=0,I=ds.length;i<I;i++){
			var c=this.t.rows[i].insertCell(j);
			c.innerHTML=ds[i]||this.f;
		}return this;
	},
	insCols:function(idx,args){
		var a=arguments, s=1, c=-1;
		if(!isNaN(idx)){c=idx}
		else if(this._dim(idx)===1){s=0}
		else{alert('insCols()->arguments invalid!');return this}
		
		for(var i=0,I=this.t.rows.length;i<I;i++){
			var y=c, Y=this.t.rows[i].cells.length;
			for(var n=s,N=a.length;n<N;n++){
				var cell=this.t.rows[i].insertCell(y);
				cell.innerHTML=a[n][i]||this.f;
				if(c===-1){//for append cols
					cell.className='c_'+(Y+n-s);
				}else{cell.className='c_'+(y+n-s);y++;}
			}
			if(c!=-1){
				for(var j=c-s+a.length,J=this.t.rows[i].cells.length;j<J;j++){
					this.t.rows[i].cells[j].className='c_'+j;
		}}}return true;
	},
	getData:function(x,y,X,Y){
		var df=new Array();
		for(var i=x||0,I=X||this.t.rows.length;i<I;i++){
			df[i]=new Array();
			for(var j=y||0,J=Y||this.t.rows[i].cells.length;j<J;j++){
				var s;
				try{s=this.t.rows[i].cells[j].innerHTML}catch(e){s=this.f};
				if(!isNaN(s)&&(this.nr.indexOf(i)>=0||this.nc.indexOf(n)>=0)){s=Number(s)}
					df[i][j]=s;
		}}return df;
	},
	getCols:function(a){
		var df=[],args;
		if(a===undefined){args=this._serial(this._size().y)}
		else if(typeof(a)==='number'){args=arguments}else{args=a}
		for(var n=0,N=args.length;n<N;n++){
			df[n]=[];
			for(var i=0,I=this.t.rows.length;i<I;i++){
				var s=this.t.rows[i].cells[args[n]].innerHTML;
				if(!isNaN(s)&&(this.nr.indexOf(i)>=0||this.nc.indexOf(n)>=0)){s=Number(s)}
				df[n].push(s);
		}}if(args.length===1){return df[0]}else{return df}
	},
	getRows:function(a){
		var df=[],args;
		if(a===undefined){args=this._serial(this._size().x)}
		else if(typeof(a)==='number'){args=arguments}else{args=a}
		for(var n=0,N=args.length;n<N;n++){
			df[n]=[];
			for(var j=0,J=this.t.rows[args[n]].cells.length;j<J;j++){
				var s=this.t.rows[args[n]].cells[j].innerHTML;
				if(!isNaN(s)&&(this.nr.indexOf(n)>=0||this.nc.indexOf(j)>=0)){s=Number(s)}
				df[n].push(s);
		}}if(args.length===1){return df[0]}else{return df}
	},
	
	setData:function(df){
		for(var i=0,I=this.t.rows.length;i<I;i++){
			for(var j=0,J=this.t.rows[i].cells.length;j<J;j++){
				try{this.t.rows[i].cells[j].innerHTML=df[i][j]||this.f}
				catch(e){this.t.rows[i].cells[j].innerHTML=this.f}
		}}return true;
	},
	setCols:function(idx,df){
		
	},
	setRows:function(idx,df){
		
	},
	setCell:function(x,y,d){
		
	},
	fmtData:function(digital){
		for(var i=0,I=this.t.rows.length;i<I;i++){
			for(var j=0,J=this.t.rows[i].cells.length;j<J;j++){
				this.t.rows[i].cells[j].innerHTML=this._format(this.t.rows[i].cells[j].innerHTML,digital)
		}}return true;
	},
	
	*/
	
	
	//  bellow is private method
	var ce  = function(tag, atts) {var o=document.createElement(tag);for(var k in atts){o[k]=atts[k]}return o},
		dim	= function(a) {if(Array.isArray(a)){return arguments.callee(a[0])+1}else{return 0}},
		size = function(df, deep){
			var l = {x:df.length, y:0, Y:0};
			if(dim(df)>1) l.y=df[0].length;
			if(deep) {for(var i=1;i<l.x;i++){var n=df[i].length;l.y=Math.min(l.y,n);l.Y=Math.max(l.Y,n)}}
			return l;
		},
		evtPop = function(o, tag) {
			if(o===null){return false}
			else if(o.tagName===tag.toUpperCase()){return o}
			else{return arguments.callee(o.parentNode, tag)}
		},
		range = function(start, stop, step) {
			if (stop==null) {stop = start || 0; start = 0}
			step = step || 1;
			var length = Math.max(Math.ceil((stop - start) / step), 0);
			var range = Array(length);
			for (var idx = 0; idx < length; idx++, start += step) range[idx] = start;
			return range;
		},
		createEmptyArray = function(x,y){var d=new Array(x);if(y!=undefined){for(var i=0;i<x;i++) d[i]=new Array(y)}return d},
		sum = function(a){return eval(a.join(',').split(',').join('+'))},
		repeat = function(s, n) {var v='';for(var i=0;i<n;i++){v+=s}if(n>0){return v}else{return ''}
		};
	/*	
	_size:function(deep){// col row span
		var l={x:this.t.rows.length,y:this.t.rows[0].cells.length,Y:0}
		if(deep===true){
			for(var i=0;i<l.x;i++){
				var n=this.t.rows[i].cells.length;l.y=Math.min(l.y,n);l.Y=Math.max(l.Y,n)
		}}return l;
	},
	
	
	
	_format:function(s,digital){
		if(s!=''&&!isNaN(s)){
			var i=s.indexOf('.');
			if(i===-1){s+='.';i=s.indexOf('.')}
			s+=this._repeat('0',digital);
			s=s.substring(0,i+digital+1);
		}return s;
	},
	
	_clone:function(o){var r={};
		for(var k in o){
			if(Array.isArray(o[k])){r[k]=o[k].slice(0)}
			else{r[k]=(o[k] instanceof Object)?arguments.callee(o[k]):o[k]}
		}return r
	},*/
		
}.call(this))








// *********************************** tab ********************************************
$tab=function(id){
	if(id===undefined){return new $Tab()}
	else {
		var o = document.getElementById(id).firstChild;
		if(o){return new $Tab(o)}else{return false}
	}
};
$Tab=function(t){this.t=t; this.i=0};//如果不用构造函数，事件则会地址引用
$Tab.prototype={
	constructor:$Tab,
	run:function(cfg){
		var p={
			moveBtn : true,
			items	: [],
		}
		for(var k in cfg){p[k]=cfg[k]}
		
		this.t = this._ce('div');
		if(p.moveBtn){
			var l=this._ce('a', {className:'dtab_left_a',  innerHTML:'<<'});
			var r=this._ce('a', {className:'dtab_right_a', innerHTML: '>>'});
			this.t.appendChild(l);
			this.t.appendChild(r);
			l.onclick = function(e) { md.scrollLeft  -= 100; }
			r.onclick = function(e) { md.scrollLeft  += 100; }
		}
		var md=this._ce('div', {className:'dtab_mid_div'});
		var ul=this._ce('ul',  {className:'dtab_ul'});
		this.t.appendChild(md);
		md.appendChild(ul);
		for(var j=0,J=p.items.length;j<J;j++){
			var li=this._ce('li', {innerHTML:p.items[j]});
			li.index = j;
			ul.appendChild(li);
		}
		ul.children[this.i].className = 'act';
		
		/** 注册鼠标滚动事件 **/
		if (this._isIE()) {
			md.onmousewheel = function(e) { md.scrollLeft += e.wheelDelta; }
		} else {
			md.addEventListener('DOMMouseScroll',function(e){md.scrollLeft += e.detail * 50;},false);
		}
		return this;
	},
	appendTo:function(id){
		document.getElementById(id).appendChild(this.t);
		return this;
	},
	onclick:function(callback){
		var that=this;
		this.t.onclick=function(e){
			var o = e.srcElement || e.target;
			if (o.tagName !== 'LI') {return false}
			var ul=o.parentNode, i=o.index;
			ul.children[that.i].className='';
			that.i=i;
			ul.children[i].className = ' act';
			callback(i);
		};return this;
	},
	
	setIndex:function(){
		
	},
	
	_ce:function(tag, atts){
		var o=document.createElement(tag);for(var k in atts){o[k]=atts[k]}return o;
	},
	_isIE:function(){
		var agent = navigator.userAgent.toLowerCase();
		return (/msie/.test(agent) && !/opera/.test(agent)) || /trident/.test(agent);
	},
	
};



// ************************************ imgbar ****************************************

$imgbar=function(){return new $ImgBar()}
$ImgBar=function(bar){this.bar=bar}
$ImgBar.prototype={
	constructor:$ImgBar,
	run:function(cfg){
		var p={
			path : 'image/icon/',
			imgs : [[]]
		};
		for(var k in cfg){p[k]=cfg[k]}
		this.bar=this._ce('div');
		for(var i=0,I=p.imgs.length;i<I;i++){
			var img = this._ce('img', {
				src  : p.path + p.imgs[i][1],
				title: p.imgs[i][0],
				index: i
			});
			this.bar.appendChild(img);
		}return this;
	},
	appendTo:function(id){
		document.getElementById(id).appendChild(this.bar);
		return this;
	},
	onclick:function(callback){
		var that=this;
		this.bar.onclick=function(e){
			var o = e.srcElement || e.target;
			if(o.tagName==='IMG'){
				callback(o.index);
		}};return this;
	},
	_ce:function(tag, atts){
		var o=document.createElement(tag);for(var k in atts){o[k]=atts[k]}return o;
	},
};

