
function message(msg, t, w, h, renew) {
	var a=this;
	a.box = a.box || {};
	if (a.box.panel===undefined || renew===true) {
		a.box = new Panel({
			width : w||300,
			height: h||180,
		});
	}
	a.box.setHtml('<br><p>'+msg+'</p>');
	a.box.twinkle(t);
}


function siteNavMore() {
    var ul = R('.site-nav ul');
    ul.style.height = parseInt(ul.style.height)>40 ? '34px' : '68px';
}

(function(){
	var o=R.id('gotop');
	if(o){
		o.onclick = function(){
			var a = R.getScrollTop();
			var int = setInterval(function(){
				a = a>500 ? a-500 : 0;
				if(a==0) clearInterval(int);
				R.setScrollTop(a);
			},30);
		};

		window.onscroll = function(event) {
			if(R.getScrollTop() > 100){
				o.style.opacity = 0.3;
			}else{
				o.style.opacity = 0;
			}
		};
	}
})();




