var panel, msg;

function regist() {
	msg='';

    if(Panel.len==0) {
        panel = new Panel({
            display: 'none',
        });
    }

	var login = R('input[name=login]').value,
		pwd   = R('input[name=pwd]').value;
	if(login.length<3){
		msg += '<p>用户名长度不够，至少3位</p>';
	}else if(!R.isDC(login)){
		msg += '<p>用户名只允许使用数字、英文和_</p>';
	}else if(pwd.length<3){
		msg += '<p>密码长度不够，至少3位</p>';
	}else if(!R.isDC(pwd)){
		msg += '<p>密码只允许使用数字、英文和_</p>';
	}else if(pwd!=R('input[name=pwd2]').value){
		msg += '<p>两次密码输入不一致</p>';
	}else if(R('input[name=vnum]').value.length!=4){
		msg += '<p>验证码位数不对</p>'
	}

    if(msg!=''){
    	panel.setHtml('<div class="red"><br>'+msg+'</div>');
    	panel.show();
    	return;
    }


    R.post('/doRegist', R.fd('#regForm'), function(r) {
        if (r == '验证码有误!') {
            R('#vcode').setAttribute('src', '/vnum?r=' + Math.random());
        	r = '<br><p class="color:red">'+r+'</p>';
        } else if (r == '有重名用户!') {
        	r = '<br><p class="color:red">'+r+'</p>';
        } else if (r == '注册成功!') {
        	r = '<br><br>'+r;
        	setTimeout(function(){
        		window.location = '/login';
        	}, 1000);
        }
        panel.setHtml(r);
        panel.twinkle(1000);
    });
}
R.id('registButton').addEventListener('click', regist, false);
R.enterEvent(('input[name=vnum]'), regist, false);

R('input[name=login]').focus();
R.enterMove('#regForm');


