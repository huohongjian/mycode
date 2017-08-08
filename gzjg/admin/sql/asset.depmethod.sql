
DROP TABLE IF EXISTS asset.depmethod CASCADE;
DROP SEQUENCE IF EXISTS asset.depmethod_seq;	CREATE SEQUENCE asset.depmethod_seq MINVALUE 10001;
CREATE TABLE asset.depmethod (
	idepid smallint NOT NULL DEFAULT nextval('asset.depmethod_seq'),
	sname varchar(255) NOT NULL DEFAULT '',
	sbrief varchar(255) NULL,
	sformula varchar(255) NULL,
	iorder smallint NULL,
	sremark text NULL,
	CONSTRAINT depmethod_pkey PRIMARY KEY (iDepId)
);
CREATE INDEX depmethod_iOrder 	ON asset.depmethod(iOrder);


DELETE FROM public.description WHERE schema='asset' AND tname='depmethod';
INSERT INTO public.description (schema, tname, fname, cname, ftype) VALUES
('asset', 'depmethod', 'idepid', '折旧方法ID', 'smallint'),
('asset', 'depmethod', 'sname', '折旧方法名称', 'varchar(255)'),
('asset', 'depmethod', 'sbrief', '折旧方法简称', 'varchar(255)'),
('asset', 'depmethod', 'sformula', '月折旧额计算公式', 'varchar(255)'),
('asset', 'depmethod', 'iorder', '排序', 'smallint'),
('asset', 'depmethod', 'sremark', '备注', 'text');


INSERT INTO asset.depmethod (idepid, sname) VALUES
(1, '不提折旧'),
(2, '平均年限法（一）'),
(3, '平均年限法（二）'),
(4, '工作量法'),
(5, '年数总和法'),
(6, '双倍余额递减法');






