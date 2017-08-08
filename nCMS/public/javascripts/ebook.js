




renderDocument(window.location.hash);
window.onhashchange = function() {renderDocument(window.location.hash)};

function renderDocument(hash) {
	if (hash) {
		R.ajax({
			method	: 'GET',
			random 	: false,
			url 	: '/details/' + hash.substr(1),
			onload	: function(doc) {
				var html = '<h2 class="article-title">' + doc.title + '</h2>\
					<ul class="article-meta">\
						<li><i class="iconfont icon-user"></i>'  + doc.user + '</li>\
						<li><i class="iconfont icon-date2"></i>' + doc.date + '</li>\
						<li><i class="iconfont icon-yuedu"></i>阅读(' + doc.click + ')</li> ';
				if (doc.editable) {
					html += '<li><i class="iconfont icon-edit"></i><a href="/user/edit/' + doc._id + '" target="_blank">编辑</a></li>';
				}
				html +=	'</ul><div class="article-content">' + doc.content + '</div>';
				R.id('doc').innerHTML = html;
			}
		});
	}
}

R('.menu').onclick = function() {
	// var o = R('.sidebar');
	// o.style.display = o.style.display=='none' ? 'block' : 'none';
	// console.log(o.style.display)
};


