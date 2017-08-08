
$cache_js_data = new Object();
$cache_js_data.header = "\
	<div class='logo'>河北烟草财务信息系统</div>\
		<div class='nav'>\
			<ul class='login'>\
				<li><a href='javascript:logout()'>退出</a></li>\
				<li>登录</li>\
				<li>密码：<input id='password' type='text'/></li>\
				<li>用户名：<input id='userName' type='text'/></li>\
			</ul>\
			<ul class='menu'>\
				<li><a href='#'>使用帮助</a></li>\
				<li><a href='admin/'>系统管理</a>\
					<ul>\
						<li><a href='#'>人员管理</a></li>\
						<li><a href='#'>用户管理</a></li>\
						<li><a href='#'>权限管理</a></li>\
						<li><a href='#'>刷新缓存</a></li>\
					</ul>\
				</li>\
				<li><a href='#'>任务管理</a>\
					<ul>\
						<li><a href='/hzbb/define/task.html'>添加任务</a></li>\
						<li><a href='#'>查看任务</a></li>\
					</ul>\
				</li>\
				<li><a href='#'>月末处理</a>\
					<ul>\
						<li><a href='#'>计提折旧</a></li>\
						<li><a href='#'>资产盘点</a></li>\
					</ul>\
				</li>\
				<li><a href='#'>综合查询</a>\
					<ul>\
						<li><a href='#'>按人员</a></li>\
						<li><a href='#'>按部门</a></li>\
						<li class='spline'><a href='#'>按类别</a></li>\
						<li><a href='#'>按状态</a></li>\
						<li><a href='#'>按时间</a></li>\
						<li class='spline'><a href='#'>全部资产</a></li>\
						<li><a href='#'>综合查询</a></li>\
					</ul>\
				</li>\
				<li><a href='#'>日常管理</a>\
					<ul>\
						<li><a href='#'>维修记录</a></li>\
						<li><a href='#'>保养记录</a></li>\
						<li><a href='#'>行驶里程</a></li>\
						<li class='spline'><a href='#'>变更原值</a></li>\
						<li><a href='#'>变更残值率</a></li>\
						<li><a href='#'>变更折旧方法</a></li>\
					</ul>\
				</li>\
				<li><a href='#'>测试页</a>\
					<ul>\
						<li><a href='/hzbb/test.html'>test.html</a></li>\
						<li><a href='/hzbb/test.php'>test.php</a></li>\
						<li><a href='#'>调拨</a></li>\
						<li><a href='#'>处置</a></li>\
						<li><a href='#'>盘点</a></li>\
					</ul>\
				</li>\
				<li><a href='/hzbb/'>首页</a></li>\
			</ul>\
		</div>\
";
$cache_js_data.footer = "版权所有:河北省烟草专卖局（公司）财务管理处　CopyRight@ 2016-2020　技术支持:0311-88607956";


