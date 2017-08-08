/**
 * @version 1.0
 * @date   	2016-08-15
 * @author 	HuoHongJian
 * @param 	args
 * @returns
 */
$df=function(args){
	return new $DF(args);
	
	var a=arguments;
	if(a.length===0){return new $DF()}
	else if(a[0] instanceof Array && a[0][0] instanceof Array){return new $DF(a[0])}
	else if(typeof a[0]==='number'&&typeof a[1]==='number'){return new $DF().setFiller(a[2]||'').cut(1,1,a[0],a[1])}
	else{alert('youre input arguments is invalid!');return flase}
}
$DF=function(d){this.df=d;this.f=''}
$DF.prototype={
	constructor:$DF,
	len:function(df){
		df=df||this.df;var l={x:0,y:0};
		if(df instanceof Array&&df[0] instanceof Array){l={x:df.length,y:df[0].length}}
		else if(df!=undefined){alert('dataframe is invalid');return false;}return l;
	},
	LEN:function(){
		var a=arguments;var N=a.length;var L={x:999999,y:9999,X:0,Y:0};var ds=[];
		if(N===0){ds[0]=this.df}else{for(var n=0;n<N;n++){ds.push(a[n])}}
		for(var n=0,N=ds.length;n<N;n++){
			var l=ds[n].length;
			L.x=Math.min(L.x,l);
			L.X=Math.max(L.X,l);
			for(var i=0,I=ds[n].length;i<I;i++){
				var l=ds[n][i].length;
				L.y=Math.min(L.y,l);
				L.Y=Math.max(L.Y,l);
			}
		}return L;
	},
	check:function(df){
		df=df||this.df;
		if(df instanceof Array&&df[0] instanceof Array){
			var I=df.length;var y=df[0].length;
			for(var i=1;i<I;i++){
				if(!(df[i] instanceof Array)||y!=df[i].length){return false}
		}}else{return false}return true;
	},
	split:function(cs){
		var d=[];var v=this.df;N=arguments.length;var a=[];l=this.len();
		if(N===0){for(var j=1;j<l.y;j++){a.push(j)}N=l.y-1}else{a=arguments}
		for(var n=0;n<N;n++){d[n]=[]}
		for(var i=0;i<l.x;i++){
			for(var n=N-1; n>=0; n--){
				d[n][i]=v[i].slice(a[n]);
				v[i]=v[i].slice(0,a[n]);
		}}return [v].concat(d);
	},
	splitv:function(rs){
		var d=[];var v=this.df;N=arguments.length;var a=[];l=this.len();
		if(N===0){for(var j=1;j<l.y;j++){a.push(j)}N=l.y-1}else{a=arguments}
		for(var n=N-1;n>=0;n--){d[n]=v.slice(a[n]);v=v.slice(0,a[n]);
		}return [v].concat(d);
	},
	getCol:function(c){var d=[];for(var i=0,l=this.len();i<l.x;i++){d[i]=this.df[i][c]}return d},
	getRow:function(r){return this.df[r]},
	//bellow is return this
	setDf:function(d){this.df=d;return this},
	setFiller:function(s){this.f=s;return this},
	fit:function(){
		var I=this.df.length;var y=999; var Y=0;
		for(var i=I-1;i>=0;i--){
			if(this.df[i] instanceof Array){var l=this.df[i].length;y=Math.min(y,l);Y=Math.max(Y,l)}
			else{this.delRows(i)}
		}
		if(y===999 || Y===0){console.log('fit()->df is invalid!')}
		else if(y!=Y){console.log('fit()->{mincols:'+y+' ,maxcols:'+Y+'}');this.cut(0,0,I-1,Y-1);}
		return this;
	},
	cut:function(x,y,X,Y){
		var d=[];var l=this.len();x=x||0;y=y||0;X=X||l.x-1;Y=Y||l.y-1;
		for(var i=x;i<=X;i++){d[i-x]=[];
			for(var j=y;j<=Y;j++){
				try{d[i-x][j-y]=this.df[i][j]||this.f}catch(e){d[i-x][j-y]=this.f}
		}}this.df=d;return this;
	},
	concat:function(args){
		var v=[this.df].concat(Array.prototype.slice.call(arguments));
		var L=this.LEN.apply(this,v);var d=[];
		for(var i=0;i<L.X;i++){d[i]=[];J=0;
			for(var n=0,N=v.length;n<N;n++){
				for(var j=0,l=this.len(v[n]);j<l.y;j++){
					try{d[i][J]=v[n][i][j]||this.f}catch(e){d[i][J]=this.f}J+=1;
		}}}this.df=d;return this;
	},
	append:function(args){
		var a=arguments;
		for(var n=0,N=a.length;n<N;n++){
			for(var i=0,I=a[n].length;i<I;i++){this.df.push(a[n][i]);}
		}this.fit();return this;
	},
	unshift:function(args){
		var a=Array.prototype.slice.call(arguments).concat([this.df]);
		this.df=v.shift();this.concat.apply(this,v);return this;
	},
	runshift:function(){
		var d=[];var a=Array.prototype.slice.call(arguments).concat([this.df]);
		for(var n=0,N=a.length;n<N;n++){
			for(var i=0,I=a[n].length;i<I;i++){d.push(a[n][i]);}
		}this.df=d;this.fit();return this;
	},
	sort:function(c,asc){c=c||0;
		if(asc===false){this.df.sort(function(x,y){
			try{return y[c].localeCompare(x[c])}catch(e){return y[c]-x[c]}
		})}else{this.df.sort(function(x,y){
			try{return x[c].localeCompare(y[c])}catch(e){return x[c]-y[c]}
		})}return this;
	},
	insCols:function(c,args){
		var a=arguments;var N=a.length;var s=1;var x;
		if(a[0] instanceof Array){s=0}
		else{if(N<2){alert('your input args invalid!');return this;}x=c}
		var l=this.len();var I=l.x;
		for(var n=s;n<N;n++){I=Math.max(I,a[n].length)}
		if(I>l.x){this.cut(0,0,I-1)}
		for(var i=0;i<I;i++){
			for(var n=s;n<N;n++){
				if(x===undefined){this.df[i].push(a[n][i]||this.f)}
				else{this.df[i].splice(x,0,a[N-n][i]||this.f)}
		}}return this;
	},
	insRows:function(i,args){
		var a=arguments;var N=a.length;var s=1;var x;
		if(a[0] instanceof Array){s=0}
		else{if(N<2){alert('your input args invalid!');return this;}x=i}
		for(var n=s,N=a.length;n<N;n++){
			if(x===undefined){this.df.push(a[n])}
			else{this.df.splice(x,0,a[N-n])}
		}
		if(!this.check()){this.fit()}return this;
	},
	selCols:function(){
		var N=arguments.length;if(N===0){return this}var d=[];
		for(var i=0,l=this.len();i<l.x;i++){d[i]=[];
			for(var j=0;j<N;j++){d[i][j]=this.df[i][arguments[j]]}
		}this.df=d;return this;
	},
	selRows:function(){
		var N=arguments.length;if(N===0){return this}var d=[];
		for(var n=0;n<N;n++){
			d[n]=this.df[arguments[n]]
		}this.df=d;return this;
	},
	delCols:function(){
		var N=arguments.length;var a=[];var l=this.len();
		if(N===0){for(var j=0;j<l.y;j++){if(this.getCol(j).join('')===''){a.push(j)}}}
		else{for(var n=0;n<N;n++){a.push(arguments[n])}}a.sort();
		for(var i=0;i<l.x;i++){
			for(var j=a.length-1;j>=0;j--){this.df[i].splice(a[j],1)}
		}return this;
	},
	delRows:function(){
		var N=arguments.length;var a=[];var l=this.len();
		if(N===0){for(var i=0;i<l.x;i++){if(this.getRow(i).join('')===''){a.push(i);N++}}}
		else{for(var n=0;n<N;n++){a.push(arguments[n])}}a.sort();
		for(var n=N-1;n>=0;n--){this.df.splice(a[n],1)}
		return this;
	},
	nmbCols:function(){
		this._fmtCols.apply(this,['n'].concat(Array.prototype.slice.call(arguments)));return this;
	},
	strCols:function(){
		this._fmtCols.apply(this,['s'].concat(Array.prototype.slice.call(arguments)));return this;
	},
	nmbRows:function(){
		this._fmtRows.apply(this,['n'].concat(Array.prototype.slice.call(arguments)));return this;
	},
	strRows:function(){
		this._fmtRows.apply(this,['s'].concat(Array.prototype.slice.call(arguments)));return this;
	},
	//below is private method
	_fmtCols:function(){
		var N=arguments.length;var a=[];var l=this.len();
		if(N===0){a=this._serial(l.y)}else{a=this._array.apply(this,arguments)};
		
		for(var i=0;i<l.x;i++){
			for(var n=1,N=a.length;n<N;n++){
				this.df[i][a[n]]=this._format(this.df[i][a[n]],arguments[0]);
		}}return true;
	},
	_fmtRows:function(){
		var N=arguments.length;var a=[];var l=this.len();
		if(N===0){a=this._serial(l.x)}else{a=this._array.apply(this,arguments)};
		
		for(var n=1,N=a.length;n<N;n++){
			for(var j=0;j<l.y;j++){
				this.df[a[n]][j]=this._format(this.df[a[n]][j],arguments[0]);
		}}return true;
	},
	_format:function(s, f){
		switch(f){
			case 'n':if(!isNaN(s)){return Number(s)}
			case 's':if(s===0){return ''}else{return String(s)}
			case 'b':if(s==0){return 'f'}else{return 't'}
			case 'B':if(s==0){return false}else{return true}
		}return false
	},
	_serial:function(n){
		return new Array(n).join('0,').split(',').map(function(v,k){return k;});
	},
	_array:function(args){
		var a=[];for(var n=0,N=arguments.length;n<N;n++){a.push(arguments[n])};return a;
	},
	dim:function(a){a=a||this.df;if(Array.isArray(a)){return arguments.callee(a[0])+1}else{return 0}},

}


