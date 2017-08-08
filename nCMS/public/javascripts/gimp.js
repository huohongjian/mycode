
var url=R.url(),
	pos = {},
	fontbox={},
	gearbox = {}, gearForm, stretch, imageInfo, canvas;

if (Boolean(url.isThumb)) {
	R('.icon-quan').className = 'iconfont icon-dian1';
	R('.icon-iconf-unlock').className = 'iconfont icon-lock1';
}

canvas = new Canvas({
	width:  parseInt(url.widht)  || 200,
	height: parseInt(url.height) || 120,
	container: '#canvas',
	onrender: function(p) {
		R('input[name=zoom').value = p.scale;
		R('input[name=rotate]').value = p.rot;
		if (gearbox.panel) {
			R('#width').value = p.cw;
			R('#rot').value   = p.rot;
			R('#scale').value  = p.scale;
		}
		showIamgeInfo(p);
	},
});


function showIamgeInfo(p) {
	if (imageInfo === undefined) {
		imageInfo = new Panel({
			id: 'imageInfo',
			top: 0,
			left: 0,
			width: 100,
			height: 158,
			titleHeight: 0,
			container: '#canvas',
			textAlign: 'left',
			background: 'transparent',
		});
	}
	imageInfo.setHtml(`
		<p><i>WIDTH:</i>${p.sw}</p>
		<p><i>HEIGHT:</i>${p.sh}</p>
		<p><i>SIZE(K):</i>${(p.ss/1024).toFixed()}</p>
		<p><i>width:</i>${p.cw}</p>
		<p><i>height:</i>${p.ch}</p>
		<p><i>size(k):</i>${(p.cs/1024).toFixed()}</p>
		<p><i>rotate:</i>${p.rot}°</p>
		<p><i>scale:</i>${p.scale}%</p>
	`);
}

function save(){
	if (window.opener) {
		var fd = new FormData();
		fd.append('file', canvas.getBlobData(pos.x, pos.y, pos.w, pos.h), 'thumb.jpeg');
		R.post('/user/uploadFile', fd, function(r){
			if (r.state == 200) {
				if (url.isThumb=='true') {
					window.opener.document.getElementById("thumb").src = r.id; 
				} else {
					window.opener.insert('![]' + '(' + r.id + ')');
				}
				window.close();
			} else {
				alert(r.msg)
			}
		}, 'JSON');
	} else {
		alert('没有父窗口!');
	}
}


function gear(){
	if (gearbox.panel===undefined) {
		gearbox = new Panel({
			id: 'gear',
			width: 300,
			height: 210,
			titleHeight: 36,
			title: '设置',
			onshow: function(){R.id('width').select()},
			html: `
				<form id="gearForm">
					<label><b> width:</b><input type="text" id="width"></label>
					<label><b>height:</b><input type="text" id="height"></label>
					<label><b>   rot:</b><input type="text" id="rot"></label>
					<label><b>  scale:</b><input type="text" id="scale" placeholder="0-100且width为空"></label>
					<input type="button" value="确定" onclick="setupOnchange()">
					<input type="button" value="取消" onclick="setupCancel()">
				</form>
			`,
		});
		R.all('#gearForm input').forEach(function(o){
			o.addEventListener('change', setupOnchange)
		});

		if (gearForm===undefined) gearForm = R.enterMoveFocus('gearForm');
	} else {
		gearbox.show();
	}
}
function setupCancel(){
	gearbox.hide();
}
function setupOnchange() {
	var w = R('#width').value,
		h = R('#height').value,
		r = R('#rot').value,
		z = R('#scale').value;
	if (w=='') {
		if (z!='') canvas.zoom(parseInt(z)/100, true);
	} else {
		canvas.ZOOM(parseInt(w), h==''?undefined:parseInt(h));
	}
	if (r!='') canvas.rotate(parseInt(r), true);
}


function showStretch(){
	if (stretch===undefined) {
		function POS(x, y , w, h) {pos.x=x; pos.y=y; pos.w=w; pos.h=h;}
		stretch = new Stretch({
			container: '#canvas',
			fixed: Boolean(url.isThumb),
			onhide: function(x, y, w, h) {pos={}},
			onmouseup: POS,
			onload: POS,
			onshow: POS,
		});
	} else {
		stretch.toggle();
	}
}

function fix(o){
	o.className = stretch.fix() ? 'iconfont icon-lock1' : 'iconfont icon-iconf-unlock';
}

// *********************************************************
function font(){
	if(fontbox.panel===undefined){
		fontbox = new Panel({
			container: 'body',
			width: 300,
			height: 100,
			html: `
				<div id="fontContent" contenteditable="true" style="font-size:16px; font-weight:normal; font-style:normal; color:#555555;"></div>
				<div id="fontSetup">
					字号:<input type="number" value="16" onchange="setSize(this)">
					颜色:<input type="color" value="#555555" onchange="setColor(this)">
					<b onclick="setBlod(this)">B</b>
					<i onclick=setItalic(this)>I</i>
					<input type="button" onclick="confirm()" value="确定">
				</div>`,
		});
	} else {
		fontbox.toggle();
	}
}
function setBlod(o){
	R.id('fontContent').style.fontWeight = 
	R.id('fontContent').style.fontWeight == 800 ? 'normal' : 800;
}
function setItalic(o){
	R.id('fontContent').style.fontStyle =
	R.id('fontContent').style.fontStyle == 'italic' ? 'normal' : 'italic';
}
function setSize(o){
	R.id('fontContent').style.fontSize = o.value + "px";
}
function setColor(o){
	R.id('fontContent').style.color = o.value;
}
function confirm(){
	var o = R.id('fontContent'),
		text = o.innerHTML,
		x = fontbox.getRect().left - R('canvas').getBoundingClientRect().left + 1,
		y = fontbox.getRect().top  - R('canvas').getBoundingClientRect().top + parseInt(o.style.fontSize) + 2;
	console.log(x, y);

	canvas.fillText(text, x, y, {
		color: 	o.style.color,
		style: 	o.style.fontStyle,
		size: 	o.style.fontSize,
		weight: o.style.fontWeight,
	});
	fontbox.toggle();
}
