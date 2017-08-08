
-- TABLE: corporation 表
DROP TABLE IF EXISTS public.corporation CASCADE;
DROP SEQUENCE IF EXISTS public.corporation_seq;	CREATE SEQUENCE public.corporation_seq;
CREATE TABLE public.corporation (
	autoid smallint NOT NULL DEFAULT nextval('public.corporation_seq'),
	parentid smallint NOT NULL DEFAULT 0,
	grade smallint NOT NULL DEFAULT 0,
	isleaf boolean NOT NULL DEFAULT false,
	fullpath varchar(255) NOT NULL DEFAULT '',
	corid integer NOT NULL DEFAULT 0,
	tradecode integer NOT NULL DEFAULT 0,
	corcode varchar(255) NOT NULL DEFAULT '',
	corname varchar(255) NOT NULL DEFAULT '',
	aliasname varchar(255) NOT NULL DEFAULT '',
	briefname varchar(255) NOT NULL DEFAULT '',
	address varchar(255) NOT NULL DEFAULT '',
	postcode varchar(255) NOT NULL DEFAULT '',
	areacode varchar(255) NOT NULL DEFAULT '',
	odr smallint NOT NULL DEFAULT 0,
	CONSTRAINT corporation_pkey PRIMARY KEY (autoid)
);
CREATE INDEX corporation_fullpath	ON public.corporation(fullpath);
CREATE INDEX corporation_corid		ON public.corporation(corid);
CREATE INDEX corporation_tradecode	ON public.corporation(tradecode);
CREATE INDEX corporation_odr		ON public.corporation(odr);



DELETE FROM public.description WHERE tname='corporation';
INSERT INTO public.description (tname, fname, cname, ftype) VALUES
('corporation', 'autoid', '自增序列', 'smallint'),
('corporation', 'parentid', '父ID', 'smallint'),
('corporation', 'isleaf', '是否为末级单位', 'boolean'),
('corporation', 'fullpath', '全路径', 'varchar(255)'),
('corporation', 'corid', '单位代码', 'integer'),
('corporation', 'tradecode', '行业单位代码', 'integer'),
('corporation', 'corcode', '企业代码', 'varchar(255)'),
('corporation', 'corname', '企业名称', 'varchar(255)'),
('corporation', 'aliasname', '企业别称', 'varchar(255)'),
('corporation', 'briefname', '企业简称', 'varchar(255)'),
('corporation', 'address', '单位地址', 'varchar(255)'),
('corporation', 'postcode', '邮政编码', 'varchar(255)'),
('corporation', 'areacode', '行政区划码', 'varchar(255)'),
('corporation', 'odr', '排序', 'smallint');



INSERT INTO public.corporation VALUES 
(1, 0, 1, false, '/', 		100000, 0,		 '',			'中国烟草总公司', 						'总公司', 					'中国',	 '',  '', ''),
(2, 1, 2, false, '/1/', 	130000, 1130001, '601700395',	'中国烟草总公司河北省公司', 				'河北省公司', 				'河北省', '', '050051', '130104'),
(3, 2, 3, false, '/1/2/', 	130100, 0,		 '',			'河北省烟草公司石家庄市公司', 				'石家庄市烟草专卖局（公司）', 	'石家庄', '', '', ''),
(4, 3, 4, true,	 '/1/2/3/', 130102, 0,		 '',			'河北省烟草公司石家庄市公司正定县营销部', 	'正定县营销部', 				'正定', 	 '', '', '');

