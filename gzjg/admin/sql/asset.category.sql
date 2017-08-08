
DROP TABLE IF EXISTS asset.category CASCADE;
DROP SEQUENCE IF EXISTS asset.category_seq;	CREATE SEQUENCE asset.category_seq MINVALUE 10001;
CREATE TABLE asset.category (
	cid integer NOT NULL DEFAULT nextval('asset.category_seq'),
	pid integer NOT NULL DEFAULT 0,
	pids varchar(255) NOT NULL DEFAULT '0,',
	isleaf boolean NOT NULL DEFAULT TRUE,
	ccode varchar(255) NOT NULL DEFAULT '',
	cname varchar(255) NOT NULL DEFAULT '',
	bname varchar(255) NOT NULL DEFAULT '',
	odr smallint NOT NULL DEFAULT 0,
	use_months smallint NOT NULL DEFAULT 0,
	net_value_rate float NOT NULL DEFAULT 0.05,
	depreciation_method varchar(255) NOT NULL DEFAULT '平均年限法二',
	remark text NOT NULL DEFAULT '',
	CONSTRAINT category_pkey PRIMARY KEY (cid)
);
CREATE INDEX category_ccode ON asset.category(ccode);
CREATE INDEX category_odr 	ON asset.category(odr);


DELETE FROM public.description WHERE schema='asset' AND tname='category';
INSERT INTO public.description (schema, tname, fname, cname, ftype) VALUES
('asset', 'category', 'cid', '自增序列', 'integer'),
('asset', 'category', 'pid', '父id', 'interger'),
('asset', 'category', 'pids', '所有父id', 'varchar(255)'),
('asset', 'category', 'isleaf', '是否末级', 'boolean'),
('asset', 'category', 'ccode', '代码', 'varchar(255)'),
('asset', 'category', 'cname', '名称', 'varchar(255)'),
('asset', 'category', 'bname', '简称', 'varchar(255)'),
('asset', 'category', 'odr', '排序', 'smallint'),
('asset', 'category', 'use_months', '使用月份', 'smallint'),
('asset', 'category', 'net_value_rate', '净残值率', 'float'),
('asset', 'category', 'depreciation_method', '折旧方法', 'varchar(255)'),
('asset', 'category', 'remark', '备注', 'text');


INSERT INTO asset.category (cid, pid, pids, isleaf, cname, use_months, remark) VALUES
(1, 0, '0,', false, '固定资产', 0, ''),
(2, 0, '0,', false, '低值易耗品', 0, ''),
(3, 0, '0,', false, '土地使用权', 0, ''),

(10, 1, '0,1,', true, '土地', 0, ''),

(20, 1, '0,1,', false, '房屋建筑物', 0, ''),
(21, 20, '0,1,20,', true, '房屋', 240, ''),
(22, 20, '0,1,20,', true, '建筑物', 240, ''),
(23, 20, '0,1,20,', true, '简易建筑物', 60, ''),

(30, 1, '0,1,', false, '设备', 0, ''),
(31, 30, '0,1,30,', true, '专用设备', 120, ''),
(32, 30, '0,1,30,', true, '通用设备', 120, ''),

(40, 1, '0,1,', false, '器具工具家具', 0, ''),
(41, 40, '0,1,40,', true, '计量标准器具', 60, ''),
(42, 40, '0,1,40,', true, '仪器仪表', 60, ''),
(43, 40, '0,1,40,', true, '办公用具家具', 60, ''),
(44, 40, '0,1,40,', true, '其他器具工具', 60, ''),

(50, 1, '0,1,', false, '计算机及通讯设备', 0, ''),
(51, 50, '0,1,50,', true, '电脑', 36, ''),
(52, 50, '0,1,50,', true, '网络设备', 36, ''),
(53, 50, '0,1,50,', true, '打印机', 36, ''),
(54, 50, '0,1,50,', true, '其他通讯及电子设备', 36, ''),

(60, 1, '0,1,', false, '运输工具', 0, ''),
(61, 60, '0,1,60,', true, '车辆', 48, ''),
(62, 60, '0,1,60,', true, '装卸', 48, ''),
(63, 60, '0,1,60,', true, '其他', 48, '');






