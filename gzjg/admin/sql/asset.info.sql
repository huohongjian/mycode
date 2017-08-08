
DROP TABLE IF EXISTS asset.info CASCADE;
DROP SEQUENCE IF EXISTS asset.info_seq;	CREATE SEQUENCE asset.info_seq;
CREATE TABLE asset.info (
	iid integer NOT NULL DEFAULT nextval('asset.info_seq'),
	icid smallint NOT NULL DEFAULT 0,
	scode varchar(255) NOT NULL DEFAULT '',
	scardno varchar(255) NOT NULL DEFAULT '',
	sfcode varchar(255) NOT NULL DEFAULT '',
	sname varchar(255) NOT NULL DEFAULT '',
	smodel varchar(255) NOT NULL DEFAULT '',
	
	novalue numeric(13,2) NOT NULL DEFAULT 0,
	ntdepr numeric(13,2) NOT NULL DEFAULT 0,
	nnvalue numeric(13,2) NOT NULL DEFAULT 0,
	nmonthdepr numeric(13,2) NOT NULL DEFAULT 0,
	fnvrate float NOT NULL DEFAULT 0.05,
	iusedmonths smallint NOT NULL DEFAULT 0,
	irestmonths smallint NOT NULL DEFAULT 0,
	idepmethodid smallint NOT NULL DEFAULT 0,
	
	istatusid smallint NOT NULL DEFAULT 0,
	iincid smallint NOT NULL DEFAULT 0,
	idecid smallint NOT NULL DEFAULT 0,
	iuserid integer NOT NULL DEFAULT 0,
	idepid smallint NOT NULL DEFAULT 0,
	ienclosure smallint NOT NULL DEFAULT 0,
	senclosure text NOT NULL DEFAULT '',
	ssite varchar(255) NOT NULL DEFAULT '',
	
	tbuytime timestamp NOT NULL DEFAULT now,
	tstartuse timestamp NOT NULL DEFAULT now,
	taddtime timestamp NOT NULL DEFAULT now(),
	
	iadduid integer NOT NULL DEFAULT 0,
	iappid integer NOT NULL DEFAULT 0,
	sremark text NOT NULL DEFAULT '',
	CONSTRAINT info_pkey PRIMARY KEY (assid)
);
CREATE INDEX info_ccode 	ON asset.info(ccode);

DELETE FROM public.description WHERE schema='asset' AND tname='info';
INSERT INTO public.description (schema, tname, fname, cname, ftype) VALUES
('asset', 'info', 'iid', '编号', 'integer'),
('asset', 'info', 'icid', '类别', 'smallint'),
('asset', 'info', 'scode', '资产编码', 'varchar(255)'),
('asset', 'info', 'scardno', '卡片编码', 'varchar(255)'),
('asset', 'info', 'sfcode', '财务编码', 'varchar(255)'),
('asset', 'info', 'sname', '资产名称', 'varchar(255)'),
('asset', 'info', 'smodel', '型号', 'varchar(255)'),

('asset', 'info', 'novalue', '原值', 'numeric(13,2)'),
('asset', 'info', 'ntdepr', '累计折旧', 'numeric(13,2)'),
('asset', 'info', 'nnvalue', '净值', 'numeric(13,2)'),
('asset', 'info', 'nmonthdepr', '月折旧额', 'numeric(13,2)'),
('asset', 'info', 'fnvrate', '净残值率', 'float'),
('asset', 'info', 'iusedmonths', '已使用年限', 'smallint'),
('asset', 'info', 'irestmonths', '尚已使用年限', 'smallint'),
('asset', 'info', 'idepmethodid', '折旧方法', 'smallint'),

('asset', 'info', 'istatusid', '状态', 'smallint'),
('asset', 'info', 'iincid', '增加方式', 'smallint'),
('asset', 'info', 'idecid', '减少方式', 'smallint'),
('asset', 'info', 'iuserid', '使用人id', 'integer'),
('asset', 'info', 'idepid', '使用部门id', 'smallint'),
('asset', 'info', 'ienclosure', '附件个数', 'smallint'),
('asset', 'info', 'senclosure', '附件内容', 'text'),
('asset', 'info', 'ssite', '存放地点', 'varchar(255)'),

('asset', 'info', 'tbuytime', '购买时间', 'timestamp'),
('asset', 'info', 'tstartuse', '开始使用时间', 'timestamp'),
('asset', 'info', 'taddtime', '资产录入时间', 'timestamp'),

('asset', 'info', 'iadduid', '录入人', 'integer'),
('asset', 'info', 'iappid', '购买申请单号', 'integer'),
('asset', 'info', 'sremark', '备注', 'text'),
('asset', 'info', '', '', ''),
('asset', 'info', '', '', '');




