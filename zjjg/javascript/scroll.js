z1=false;
z2=null;
z3=new Object();
vs_timers=new Object();
z4=false;
ulm_ie=window.showHelp;
ulm_opera=window.opera;
ulm_mac=navigator.userAgent.indexOf("Mac")+1;
ulm_firefox=false;
if(navigator.vendor)ulm_firefox=navigator.vendor.toLowerCase().indexOf("firefox")+1;

uls=document.getElementsByTagName("UL");

for(mi=0;mi<uls.length;mi++){
	pdiv=uls[mi].parentNode;
	if(cid=pdiv.id){
		if(cid.indexOf("vscroll")>-1){
			z3[cid]=pdiv;
			cid=cid.substring(7);
			dto=new window["vscroll_data"+cid];
			pdiv.parentNode.id="vsborder"+cid;
			pdiv.parentNode.parentNode.id="vsborderc"+cid;
			z11(cid,dto);
			pdiv.style.display="block";
			(ulo=pdiv.firstChild).id="psmover"+cid;
			z5=ulo.childNodes;
			for(li=0;li<z5.length;li++){
				if(z5[li].tagName=="LI"){
					z5[li].id="psitem"+z5[li].offsetTop;
					z5[li].onselectstart=function(){return false};
					z5[li].ondrag=function(){return false};
					links=z5[li].childNodes;
					for(ki=0;ki<links.length;ki++){
						if(links[ki].tagName=="A"){
							links[ki].onclick=function(){
								if(!(ulm_ie && ulm_mac)){
									if(ulm_ie || ulm_opera)document.attachEvent("onclick",ps_handle_onclick);
									else document.addEventListener("onclick",ps_handle_onclick,false);
								}
							}
						}
					}
				}
			}
			if((!ulm_firefox)&&(!(ulm_ie && ulm_mac))){
				pdiv.onmousedown=function(){
					z4=false;
					z1=this.firstChild;
				};
			}
			if(!(ulm_ie && ulm_mac)){
				if((ulm_ie)||(ulm_opera)){
					document.attachEvent("onmousemove",ps_handle_mousemove);
					document.attachEvent("onmouseup",ps_handle_mouseup);
					if(ulm_ie)document.documentElement.attachEvent("onmouseleave",ps_handle_mouseup);
				}else{
					document.addEventListener("mousemove",ps_handle_mousemove,false);
					document.addEventListener("mouseup",ps_handle_mouseup,false);
				}
			}else{
				pdiv.onmouseout=function(){
					if(!z7(event.toElement))z6(event,1);
				};
			}
			ulo.onselectstart=function(){return false};
			pdiv.onselectstart=function(){return false};
			pdiv.onmouseover=function(){
				clearTimeout(vs_timers[this.id]);
				vs_timers[this.id]=null;
			};
			tdly=dto.animation_delay;
			tjmp=dto.animation_jump;
			if(ulm_mac){
				tdly=dto.animation_delay_mac;
				tjmp=dto.animation_jump_mac;
			}
			pdiv.setAttribute("psid",cid);
			pdiv.setAttribute("psoffset",dto.top_pause_offset);
			pdiv.setAttribute("psdly",tdly);
			pdiv.setAttribute("psjmp",tjmp);
			setTimeout("move_it("+cid+","+dto.top_pause_offset+","+tdly+","+tjmp+")",dto.initial_scroll_delay*1000);
		}
	}
};


function ps_handle_onclick(e){
	if(z4)return false;
};
function ps_handle_mousemove(e){
	z6(e);
	if(ulm_ie)e=event;
	if(z1){if(z2!=null){
		st=e.clientY-z2;
		z1.style.top=z1.offsetTop+st+"px";
		z4=1;
	}
	z2=e.clientY;
	}
};
function ps_handle_mouseup(e){
	z1=false;
	z2=null;
	z6(e);
};
function z6(e){
	if(ulm_ie){
		e=event;
		sobj=e.srcElement;
	}else sobj=e.target;
	if(!z7(sobj)){
		if(!z1){
			for(pi in vs_timers){
				if(!vs_timers[pi]){
					mobj=document.getElementById(pi);
					move_it(mobj.getAttribute("psid"),mobj.getAttribute("psoffset"),mobj.getAttribute("psdly"),mobj.getAttribute("psjmp"));
				}
			}
		}
	}
};
function z7(tobj){
	do{
		if((tobj.id)&&(tobj.id.indexOf("vscroll")>-1))return 1;
	}while(tobj=tobj.parentNode)
};
function z9(){
	if((menu_location=window.location.hostname)!=""){
		if(!window.list7){
			mval=0;
			for(i=0;i<(menu_location).length;i++)
				mval+=menu_location.charCodeAt(i);
			mval+="-u";
			z10=0;
			while(a_val=window["unl"+"ock"+z10]){
				if(mval==a_val)return false;
				z10++;
			}
			return "ulm_ie";
		}
	}
};
function move_it(id,offset,dly,jmp){
	mtimer=dly;
	mobj=document.getElementById("psmover"+id);
	cobj=document.getElementById("vscroll"+id);
	if(mobj.offsetTop<-mobj.offsetHeight)mobj.style.top=cobj.offsetHeight+"px";
	else {
		mobj.style.top=mobj.offsetTop-jmp+"px";
		if((mobj.offsetTop-offset)<jmp){
			for(ti=0;ti<jmp;ti++){
				tpos=Math.abs(mobj.offsetTop-offset-ti);
				if(ditem=document.getElementById("psitem"+(tpos))){
					if(dval=ditem.getAttribute("delay")){
						setTimeout("adjust_it("+id+","+ti+")",mtimer);
						mtimer=parseInt(dval)*1000;
					}
				}
			}
		}
	}
	vs_timers["vscroll"+id]=setTimeout("move_it("+id+","+offset+","+dly+","+jmp+")",mtimer);
};
function adjust_it(id,amt){
	aobj=document.getElementById("psmover"+id);
	aobj.style.top=aobj.offsetTop-amt+"px";
};
function z11(id,dto){
	z12="#vscroll"+id;
	sd="<style id='ssvscroll"+id+"' type='text/css'>";
	sd+="#vsborderc"+id+" {font-size:1px;position:relative;width:"+dto.container_width+"px;height:"+dto.container_height+"px;}";
	sd+="#vsborder"+id+" {"+dto.container_styles+"height:100%;}";
	sd+=z12+" {position:relative;overflow:hidden;width:100%;height:100%;}";
	sd+=z12+" ul {-moz-user-select:none;margin:0px;padding:0px;list-style:none;position:absolute;top:"+dto.container_height+"px;width:100%;}";
	sd+=z12+" ul li{-moz-user-select:none;cursor:default;margin:0px;"+dto.item_styles+"}";
	sd+=z12+" ul li a{margin:0px;"+dto.item_link_styles+"}";
	sd+=z12+" ul li a:hover{"+dto.item_link_hover_styles+"}";
	sd+="</style>";
	document.write(sd);
}