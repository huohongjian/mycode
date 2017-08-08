/**************************************
$.fn.reset: 重置表单内容

$.fn.enter: 回车事件,默认事件为　　回车->Tab

$.fn.date() 设置年月日下拉菜单
$.fn.dateGet()
$.fn.dateSet()

$.fn.select: <select></select>两位数字选择内容
$.fn.selectBuild()	构建select元素
$.fn.selectGetValue()
$.fn.selectSetValue()

**************************************/


(function($){

	$.fn.reset = function(p){
		$reset.main(p, this[0]);
	}
	
	var $reset = {
		p: [],
		setp: function(p){
			var pp = {};
			$.extend(pp,
					{
						selDftVal: '01',
						focusid: ':input'
					}, p);
			return pp;
		},
		main: function(p,o){
			p = this.p[o.id] = this.setp(p);
			$(':input',o).each(function(){
				if(this.tagName=='SELECT') $(this).val(p.selDftVal);
				else $(this).val('');
			}
			);
			$(p.focusid,o)[0].focus();
		}
	};
	

	
/********************************************************************/	
	$.fn.selectOption = function(){$select.selectOption(this);}
	$.fn.selectBuild = function(p){$select.build(p,this);}
	$.fn.selectGetValue = function(){return $select.getValue(this);}
	$.fn.selectSetValue = function(v){return $select.setValue(v,this);}
	
	var $select = {
		p: {n:''},
		selectOption: function(o){
			$(o).keydown(function(e){
				k = e.keyCode;
				if(k>47 && k<58){
					var c = String.fromCharCode(k);
					$(this).val($select.p.n+c);
					if($select.p.n=='')
						$select.p.n = c;
					else
						$select.p.n = '';
				}
				if(k==32 || k==48) {$select.p.n = ''; return;}	//空格或零
			}
			);	
		},
		build: function(p,o){
			//p = [{v:'1', n:'text'}]; p的格式
			var s = document.createElement('SELECT');
			$(s).attr('id',$(o)[0].id+'_select');
			for(var i=0; i<p.length; i++){
				var opt = document.createElement('OPTION');
				$(opt).attr('value',p[i].v);
				$(opt).html(p[i].n);
				$(s).append(opt);
				opt = null;
			}
			$(o).append(s);
		},
		getValue: function(o){
			var s = $(o).children().get(0);
			if(s.tagName=='SELECT') return s.value;
			return null;
		},
		setValue: function(v,o){
			var s = $(o).children().get(0);
			if(s.tagName=='SELECT') $(s).val(v);
		}
	};
	
	
	
	
	
/**********************************************************************************/	
	$.fn.enter = function(p){
		$enter.main(p,this[0]);
	}
	
	var $enter = {
		p: [],
		setp: function(p){
			var pp = {};
			$.extend(pp,
					{
						tag: 'input',
						initfocus: true,
						selected: true,
						func:[]	/*{k:'l', v:'n', s:1} {key: val: step:}*/
					},
					p);
			return pp;
		},
		main: function(p, o){
			this.p[o.id] = this.setp(p);
			this.p[o.id].$o = $(this.p[o.id].tag, o);
			if(this.p[o.id].initfocus) $(this.p[o.id].tag, o).get(0).focus();
			
			$(o).keypress(function(e){
					if (e.keyCode==13){
						var p = $enter.p[this.id];
						var $s = p.$o;
						var idx = $s.index(e.srcElement || e.target);
						var l = $s.length;
						var f = p.func;
						for(i=0; i<f.length; i++){
							if(f[i].k=='l') f[i].k = l-1;
							if(f[i].k==idx){
								if(f[i].v==undefined) f[i].v='n';
								if(f[i].v=='n' || f[i].v=='next'){
									idx = isNaN(f[i].s) ? idx+1 : idx+f[i].s;
									break;
								}else{
									f[i].v();
									return false;
								}
							}
						}
						idx++;
						if(idx>=l) idx=0
						
						var tn = $s.get(idx).tagName;
						if(p.selected && (tn=='INPUT' || tn=='TEXTAREA')) $s.get(idx).select();
						else $s.get(idx).focus();
						return false;
					}
				}
			);
			
			
		}
	};

	
	
	
/**********************************************************************************/	
//有日必须有年月日 	年必须有，可用作他用
	$.fn.date = function(p){$date.main(p,this);}
	$.fn.dateGet = function(){return $date.getDate(this);}
	$.fn.dateSet = function(p){$date.setDate(p, this);}
	
	var $date = {
		p: [],
		setp: function(p){
			var yy = $.extend({id:'y', name:'年', dv:2008, start:2008, end:2020, onchange:null},p.y);
			var mm = $.extend({id:'m', name:'月', dv:0, start:1, end:12, onchange:null, display:true},p.m);
			var dd = $.extend({id:'d', name:'日', dv:0, start:1, end:31, onchange:null, display:true},p.d);
			return $.extend({y:yy},{m:mm},{d:dd});
		},
		
		main: function(p, o){
			p = this.p[o.id] = this.setp(p);
			
			var oy = this.createSelect(p.y);
			$(o).append($(oy).change(function(){
				if(p.d.display==true) try{$date.refreshOptions(p.d, $(o).children().get(2));}catch(e){}
				if(p.y.onchange) p.y.onchange(this);
			}));
			if(p.y.dv==0) p.y.dv = p.y.start;
			this.refreshOptions(p.y,oy);
			
			if(p.m.display || p.d.display){
				var om = this.createSelect(p.m);
				$(o).append($(om).change(function(){
					if(p.d.display==true) try{$date.refreshOptions(p.d, $(o).children().get(2));}catch(e){}
					if(p.m.onchange) p.m.onchange(this);
				}));
				if(p.m.dv==0) p.m.dv=p.m.start;
				this.refreshOptions(p.m,om);
			}
			
			if(p.d.display){
				var od = this.createSelect(p.d)
				$(o).append($(od).change(function(){
					if(p.d.onchange) p.d.onchange(this);
				}));
				this.refreshOptions(p.d,od);
			}
		},
		setDate: function(p, o){
			p = $.extend({y:-1,m:-1,d:-1},p);
			var $cs = $(o).children();
			if(p.y>=0) try{$($cs.get(0)).val(p.y);}catch(e){}
			if(p.m>=0) try{$($cs.get(1)).val(p.m);}catch(e){}
			if($cs.length==3){
				try{this.refreshOptions(this.p[o.id].d, $(o).children().get(2));}catch(e){}
				if(p.d>=0) try{$($cs.get(2)).val(p.d);}catch(e){}
			}
		},
		getDate: function(o){
			var d = new Array(0,0,0);
			var $cs = $(o).children();
			for(var i=0; i<$cs.length; i++){
				d[i] = $cs.get(i).value;
			}
			return {date:new Date(d[0],d[1],d[2]), ymd:d[0]+'-'+d[1]+'-'+d[2], y:d[0], m:d[1], d:d[2]};
		},
		createSelect: function(p){
			var slt = document.createElement('SELECT');
			$(slt).attr('class','date_'+p.id);
			return slt;
		},
		refreshOptions: function(p,o){
			var dv = p.dv;
			var start = p.start;
			var end = p.end;
			if(p.id=='d'){
				var y=m=0;
				try{y = $(o).prev().prev().get(0).value;}catch(e){y=2008}
				try{m = $(o).prev().get(0).value;}catch(e){m=1}
				var days = new Date(y,m,0).getDate();
				if(days<end) end=days;
				if(dv==0) dv=start;
				if(dv==31) dv=end;
			}
			$(o).empty();
			for(var i=start; i<=end; i++){
				var opt = document.createElement('OPTION');
				$(opt).attr('value',i);
				var v = i+p.name;
				if(i==0 && p.id=='m') v = '全年';
				if(i==0 && p.id=='d') v = '全月';
				$(opt).html(v);
				$(o).append(opt);
				opt = null;
			}
			$(o).val(dv);
		}
		
	}

})(jQuery);