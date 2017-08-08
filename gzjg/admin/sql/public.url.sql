

-- TABLE: public.url
DROP TABLE IF EXISTS public.url CASCADE;
DROP SEQUENCE IF EXISTS public.url_seq;	CREATE SEQUENCE public.url_seq MINVALUE 10001;
CREATE TABLE public.url (
	uid integer NOT NULL DEFAULT nextval('public.url_seq'),
	pid integer NOT NULL DEFAULT 0,
	pids varchar(255) NOT NULL DEFAULT '0,',
	isleaf boolean NOT NULL DEFAULT TRUE,
	cname varchar(255) NOT NULL DEFAULT '',
	bname varchar(255) NOT NULL DEFAULT '',
	url varchar(255) NOT NULL DEFAULT '',
	js text NOT NULL DEFAULT '',
	odr smallint NOT NULL DEFAULT 0,
	remark varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT url_pkey PRIMARY KEY (uid)
);
CREATE INDEX url_pid 	ON public.url(pid);
CREATE INDEX url_pids 	ON public.url(pids);
CREATE INDEX url_odr 	ON public.url(odr);


DELETE FROM public.description WHERE tname='url';
INSERT INTO public.description (tname, fname, cname, ftype) VALUES
('url', 'uid', 'url id号,自增序列', 'integer'),
('url', 'pid', 'url 父id号', 'integer'),
('url', 'pids', 'url 所有父id号', 'varchar(255)'),
('url', 'isleaf', '是否为末级', 'boolean'),
('url', 'cname', '中文名', 'varchar(255)'),
('url', 'bname', '简称', 'varchar(255)'),
('url', 'url', 'url', 'varchar(255)'),
('url', 'js', 'javascript代码', 'text'),
('url', 'odr', '排序', 'smallint'),
('url', 'remark', '备注', 'varchar(255)');


INSERT INTO public.url(uid, pid, pids, isleaf, cname, bname, url, js) VALUES
(1, 0, '0,', false, '首页导航菜单', '', '', ''),
(2, 1, '0,1,', true, '首页', '', 'index.html', ''),
(10, 1, '0,1,', false, '资产管理', '', '#', ''),
(11, 10, '0,1,10,', true, '申请', '', '', ''),
(12, 10, '0,1,10,', true, '购置', '', '', ''),
(13, 10, '0,1,10,', true, '调拨', '', '', ''),
(14, 10, '0,1,10,', true, '处置', '', '', ''),
(15, 10, '0,1,10,', true, '盘点', '', '', ''),
(20, 1, '0,1,', false, '日常管理', '', '', ''),
(21, 20, '0,1,20,', true, '维修记录', '', '', ''),
(22, 20, '0,1,20,', true, '保养记录', '', '', ''),
(23, 20, '0,1,20,', true, '行驶里程', '', '', ''),
(24, 20, '0,1,20,', true, '变更原值', '', '', ''),
(25, 20, '0,1,20,', true, '变更残值率', '', '', ''),
(26, 20, '0,1,20,', true, '变更折旧方法', '', '', ''),
(30, 1, '0,1,', false, '综合查询', '', '', ''),
(31, 30, '0,1,30,', true, '按人员', '', '', ''),
(32, 30, '0,1,30,', true, '按部门', '', '', ''),
(33, 30, '0,1,30,', true, '按类别', '', '', ''),
(34, 30, '0,1,30,', true, '接状态', '', '', ''),
(35, 30, '0,1,30,', true, '按时间', '', '', ''),
(36, 30, '0,1,30,', true, '全部资产', '', '', ''),
(37, 30, '0,1,30,', true, '综合查询', '', '', '');

