
DROP TABLE IF EXISTS asset.status CASCADE;
DROP SEQUENCE IF EXISTS asset.status_seq;	CREATE SEQUENCE asset.status_seq MINVALUE 10001;
CREATE TABLE asset.status (
	iid smallint NOT NULL DEFAULT nextval('asset.status_seq'),
	ipid smallint NOT NULL DEFAULT 0,
	spids varchar(255) NOT NULL DEFAULT '0,',
	bleaf boolean NOT NULL DEFAULT true,
	sname varchar(255) NOT NULL DEFAULT '',
	sbrief varchar(255) NULL,
	iorder smallint NULL,
	sremark text NULL,
	CONSTRAINT status_pkey PRIMARY KEY (iid)
);
CREATE INDEX status_ipid 	ON asset.status(ipid);
CREATE INDEX status_spids 	ON asset.status(spids);
CREATE INDEX status_iorder 	ON asset.status(iorder);


DELETE FROM public.description WHERE schema='asset' AND tname='status';
INSERT INTO public.description (schema, tname, fname, cname, ftype) VALUES
('asset', 'status', 'iid', '自增序列', 'smallint'),
('asset', 'status', 'ipid', '父ID', 'smallint'),
('asset', 'status', 'ipids', '所有父ID', 'varcher(255)'),
('asset', 'status', 'ibleaf', '是否末级', 'boolean'),
('asset', 'status', 'sname', '名称', 'varchar(255)'),
('asset', 'status', 'sbrief', '简称', 'varchar(255)'),
('asset', 'status', 'iorder', '排序', 'smallint'),
('asset', 'status', 'sremark', '备注', 'text');


INSERT INTO asset.status (iid, ipid, spids, bleaf, sname) VALUES
(1, 0, '', false, '使用状态目录表'),

(10, 1, '1,', false, '在使用'),
(11, 1, '1,10', true, '在用'),
(12, 1, '1,10', true, '大修理停用'),
(13, 1, '1,10', true, '季节性停用'),
(14, 1, '1,10', true, '经营性出租'),
(19, 1, '1,10', true, '其他'),

(20, 1, '1,', false, '未使用'),
(21, 1, '1,20', true, '在库'),
(22, 1, '1,20', true, '闲置'),
(29, 1, '1,20', true, '其他'),

(30, 1, '1,', true, '已注销');






