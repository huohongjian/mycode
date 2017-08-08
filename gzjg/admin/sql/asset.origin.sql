
DROP TABLE IF EXISTS asset.origin CASCADE;
DROP SEQUENCE IF EXISTS asset.origin_seq;	CREATE SEQUENCE asset.origin_seq MINVALUE 10001;
CREATE TABLE asset.origin (
	iorid smallint NOT NULL DEFAULT nextval('asset.origin_seq'),
	ipid smallint NOT NULL DEFAULT 0,
	spids varchar(255) NOT NULL DEFAULT '0,',
	bleaf boolean NOT NULL DEFAULT true,
	sname varchar(255) NOT NULL DEFAULT '',
	sbrief varchar(255) NULL,
	iorder smallint NULL,
	sremark text NULL,
	CONSTRAINT origin_pkey PRIMARY KEY (iorid)
);
CREATE INDEX origin_ipid 	ON asset.origin(ipid);
CREATE INDEX origin_spids 	ON asset.origin(spids);
CREATE INDEX origin_iorder 	ON asset.origin(iorder);


DELETE FROM public.description WHERE schema='asset' AND tname='origin';
INSERT INTO public.description (schema, tname, fname, cname, ftype) VALUES
('asset', 'origin', 'iorid', '折旧方法ID', 'smallint'),
('asset', 'origin', 'ipid', '父ID', 'smallint'),
('asset', 'origin', 'ipids', '所有ID', 'varchar(255)'),
('asset', 'origin', 'bleaf', '是否为末级', 'boolean'),
('asset', 'origin', 'sname', '折旧方法名称', 'varchar(255)'),
('asset', 'origin', 'sbrief', '折旧方法简称', 'varchar(255)'),
('asset', 'origin', 'sformula', '月折旧额计算公式', 'varchar(255)'),
('asset', 'origin', 'iorder', '排序', 'smallint'),
('asset', 'origin', 'sremark', '备注', 'text');


INSERT INTO asset.origin (iorid, ipid, spids, bleaf, sname) VALUES
(1, 0, '', false, '增减方式'),

(10, 1, '1,', false,  '增加方式'),
(11, 10, '1,10,', true, '直接购入'),
(12, 10, '1,10,', true, '投资者投入'),
(13, 10, '1,10,', true, '捐赠'),
(14, 10, '1,10,', true, '盘盈'),
(15, 10, '1,10,', true, '在建工程转入'),
(16, 10, '1,10,', true, '融资租入'),
(19, 10, '1,10,', true, '其他'),

(20, 1, '1,', false, '减少方式'),
(21, 20, '1,20,', true, '出售'),
(22, 20, '1,20,', true, '盘亏'),
(23, 20, '1,20,', true, '投资转出'),
(24, 20, '1,20,', true, '捐赠转出'),
(25, 20, '1,20,', true, '报废'),
(26, 20, '1,20,', true, '毁损'),
(27, 20, '1,20,', true, '融资租出'),
(28, 20, '1,20,', true, '丢失被盗'),
(29, 20, '1,20,', true, '其他');






