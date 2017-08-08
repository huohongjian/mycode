var options = {
cors:[{v:'0', n:'河北省'},{v:'1', n:'石家庄'},{v:'2', n:'唐　山'},{v:'3', n:'秦皇岛'},{v:'4', n:'邯　郸'},{v:'5', n:'邢　台'},{v:'6', n:'保　定'},{v:'7', n:'张家口'},{v:'8', n:'承　德'},{v:'9', n:'沧　州'},{v:'10', n:'廊　坊'},{v:'11', n:'衡　水'},{v:'12', n:'省本部'},{v:'13', n:'省抵销'}],
corporations:[{v:'0', n:'中国烟草总公司河北省公司(合计)'},{v:'1', n:'河北省烟草公司石家庄市公司'},{v:'2', n:'河北省烟草公司唐　山市公司'},{v:'3', n:'河北省烟草公司秦皇岛市公司'},{v:'4', n:'河北省烟草公司邯　郸市公司'},{v:'5', n:'河北省烟草公司邢　台市公司'},{v:'6', n:'河北省烟草公司保　定市公司'},{v:'7', n:'河北省烟草公司张家口市公司'},{v:'8', n:'河北省烟草公司承　德市公司'},{v:'9', n:'河北省烟草公司沧　州市公司'},{v:'10', n:'河北省烟草公司廊　坊市公司'},{v:'11', n:'河北省烟草公司衡　水市公司'},{v:'12', n:'中国烟草总公司河北省公司(本部)'},{v:'13', n:'中国烟草总公司河北省公司(抵销)'}],
cats:[{v:'1', n:'费用支出'},{v:'2', n:'工资支出'},{v:'3', n:'税金支出'},{v:'4', n:'货款支出'},{v:'5', n:'捐赠支出'},{v:'6', n:'物流建设支出'},{v:'7', n:'资本性支出'},{v:'98', n:'差错更正'},{v:'99', n:'其他支出'}],
cats_withid:[{v:'1', n:'1.费用支出'},{v:'2', n:'2.工资支出'},{v:'3', n:'3.税金支出'},{v:'4', n:'4.货款支出'},{v:'5', n:'5.捐赠支出'},{v:'6', n:'6.物流建设支出'},{v:'7', n:'7.资本性支出'},{v:'98', n:'98.差错更正'},{v:'99', n:'99.其他支出'}],
status:[{v:'1', n:'已保存'},{v:'2', n:'已提交'},{v:'3', n:'审批中'},{v:'4', n:'已批复'},{v:'5', n:'已撤消'},{v:'6', n:'已退回'},{v:'7', n:'已作废'}],
paymodes:[{v:'1', n:'1.现金结算'},{v:'2', n:'2.支票结算'},{v:'3', n:'3.托收承付'},{v:'4', n:'4.汇兑'},{v:'5', n:'5.委托收款'},{v:'99', n:'99.其他'}],
unchargeupcats_withid:[{v:'1', n:'1.银付企未付'},{v:'2', n:'2.银收企未收'},{v:'3', n:'3.企付银未付'},{v:'4', n:'4.企收银未收'}],
art_fre_cats:[{v:'11', n:'公告信息'},{v:'12', n:'最新通知'}],
unshift_array: function(opts, insertObj){
		opts.unshift(insertObj);	//返回数组个数
		return opts;
	},
getName: function(opts, value){
		for(var i=0; i<opts.length; i++){
			if(opts[i].v==value) return opts[i].n;
		}
	},
getValue: function(opts, name){
		for(var i=0; i<opts.length; i++){
			if(opts[i].n==name) return opts[i].v;
		}
	}
}

var jscode = {
	path : './',
	header : function(){
		return "\
		<!--div id='peak'><ul>\
			<li style='width:70px;'><a id='homepage' href='javascript:sethomepage()'>设为首页</a></li>\
			<li style='width:70px;'><a id='help' href='javascript:constructiong()'>使用帮助</a></li>\
			<li style='padding-left:30px;'>用户名：</li>\
			<li><input type='text' id='UserName' onkeypress='loginEnter(this,event)'/></li>\
			<li style='padding-left:15px;'>密码：</li>\
			<li><input type='password' id='UserPwd' onkeypress='loginEnter(this,event)'/></li>\
			<li style='width:30px; padding-left:15px;'><a href='javascript:login()'>登录</a></li>\
			<li style='width:30px;'><a href='./register.html'>注册</a></li>\
			<li id='timer'><span id='date'></span> (<span id='wday' style='color:red'></span>)<span id='time'></span></li>\
		</ul></div-->\
		<div id='title_image'></div>\
		<div id='navigation'>\
			<ul style='padding-right:8px; float:right;'>\
				<li><a href='"+this.path+"'>首页</a></li>\
				<li><a href='"+this.path+"application.html'>额度申请</a></li>\
				<li><a href='"+this.path+"payout.html'>支出录入</a></li>\
				<li><a href='"+this.path+"budget.html'>预算录入</a></li>\
				<li class='five'><a href='"+this.path+"applications.html'>申请单查询</a></li>\
				<li class='five'><a href='"+this.path+"account.html'>明细账查询</a></li>\
				<li><a href='"+this.path+"ledger.html'>总账查询</a></li>\
				<li><a href='"+this.path+"budgetcompare.html'>预算执行</a></li>\
				<li><a href='"+this.path+"list.html'>文章查询</a></li>\
				<!--li><a href='"+this.path+"monthend.html'>月末处理</a></li-->\
				<li><a href=\"javascript:open_window_center('"+this.path+"login.html', 300, 180, 'nolocation')\">用户登录</a></li>\
			</ul>\
			<STRONG style='margin-left:8px;'>导航:</STRONG>\
		</div>";
	},
	
	footer : function(){
		return "\
			<div id='footer'></div>\
			<div style='margin:5px; text-align:center; clear:both;'>\
				关于我们 －\
				版权声明 －\
				联系我们 －\
				<a href='"+this.path+"sjjg.html'>省级监管</a > -\
				<a href='"+this.path+"user.html'>用户管理</a> -\
				使用说明\
			</div>\
			<div style='text-align:center; clear:both;'>\
				Copyright <span style='font-family:Arial;'>&copy;</span> 2008-2012 All Rights Reserved\
			</div>";
	}
}