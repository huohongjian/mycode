

-- TABLE: user  用户表
DROP TABLE IF EXISTS public.user CASCADE;
DROP SEQUENCE IF EXISTS public.user_seq;	CREATE SEQUENCE public.user_seq;
CREATE TABLE public.user (
  uid smallint NOT NULL DEFAULT nextval('public.user_seq'),
  ugroupid smallint NOT NULL DEFAULT 0,
  corid smallint NOT NULL DEFAULT 0,
  depid smallint NOT NULL DEFAULT 0,
  headshipid smallint NOT NULL DEFAULT 0,
  uname varchar(255) NOT NULL DEFAULT '',
  upassword varchar(255) NOT NULL DEFAULT '',
  realname varchar(255) NOT NULL DEFAULT '',
  
  isman boolean NOT NULL DEFAULT true,
  idno varchar(255) NOT NULL DEFAULT '',
  jointime timestamp NOT NULL DEFAULT now(),
  score integer NOT NULL DEFAULT 0,
  telephone varchar(255) NOT NULL DEFAULT '',
  mobile varchar(255) NOT NULL DEFAULT '',
  address varchar(255) NOT NULL DEFAULT '',
  postcode varchar(255) NOT NULL DEFAULT '',
  
  ip inet NOT NULL DEFAULT '127.0.0.1',
  email varchar(255) NOT NULL DEFAULT '',
  oaemail varchar(255) NOT NULL DEFAULT '',
  homepage varchar(255) NOT NULL DEFAULT '',
  qq varchar(255) NOT NULL DEFAULT '',
  msn varchar(255) NOT NULL DEFAULT '',
  intro varchar(255) NOT NULL DEFAULT '',
  photo varchar(255) NOT NULL DEFAULT '',
  remark varchar(255) NOT NULL DEFAULT '',
  CONSTRAINT user_pkey PRIMARY KEY (uid),
  UNIQUE (uname)
);
CREATE INDEX user_uname ON public.user (uname);

  
DELETE FROM public.description WHERE tname='user';
INSERT INTO public.description (tname, fname, cname, ftype) VALUES
('user', 'uid', '用户ID号,自增序列', 'smallint'),
('user', 'ugroupid', '用户组ID号', 'smallint'),
('user', 'corid', '单位ID号', 'smallint'),
('user', 'depid', '部门ID号', 'smallint'),
('user', 'headshipid', '职务ID号', 'smallint'),
('user', 'uname', '用户名', 'varchar(255)'),
('user', 'upassword', '用户密码', 'varchar(255)'),
('user', 'realname', '用户真实姓名', 'varchar(255)'),
('user', 'isman', '性别男', 'boolean'),
('user', 'idno', '身份证号', 'varchar(255)'),
('user', 'jointime', '加入时间', 'timestamp'),
('user', 'score', '积分', 'integer'),
('user', 'telephone', '电话', 'varchar(255)'),
('user', 'mobile', '手机', 'varchar(255)'),
('user', 'address', '地址', 'varchar(255)'),
('user', 'postcode', '邮编', 'varchar(255)'),
('user', 'ip', 'IP地址', 'inet'),
('user', 'email', '邮箱', 'varchar(255)'),
('user', 'oaemail', 'OA邮箱', 'varchar(255)'),
('user', 'homepage', '主页', 'varchar(255)'),
('user', 'qq', 'QQ号', 'varchar(255)'),
('user', 'msn', 'MSN号', 'varchar(255)'),
('user', 'intro', '自我介绍', 'varchar(255)'),
('user', 'photo', '照片', 'varchar(255)'),
('user', 'remark', '备注', 'varchar(255)');



INSERT INTO public.user(uname, upassword, realname, corid) VALUES
('admin','6e96282617c1455a829826d469552d6f','管理员',0),
('hhj',	'6e96282617c1455a829826d469552d6f','霍宏建', 0),
('wyh',	'202cb962ac59075b964b07152d234b70','王永红',	1);

