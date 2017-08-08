/*
	database: 	cwxx
	date:		2016-07-12
	author:		huohongjian
*/


-- DROP SCHEMA cx CASCADE;
-- CREATE SCHEMA cx;





-- 设置填报周期表 --
DROP TABLE IF EXISTS period CASCADE;
DROP SEQUENCE IF EXISTS period_id_seq;
CREATE SEQUENCE period_id_seq;
CREATE TABLE period
(
	id integer NOT NULL DEFAULT nextval('period_id_seq'::regclass),
	name  	character varying(256),
	year 	smallint,
	month 	smallint,
	taskid 	integer,
	CONSTRAINT period_pkey PRIMARY KEY (id)
);
CREATE INDEX period_taskid_idx ON period (taskid);



-- 横表头 --
DROP TABLE IF EXISTS headh CASCADE;
DROP SEQUENCE IF EXISTS headh_id_seq;
CREATE SEQUENCE headh_id_seq;
CREATE TABLE headh
(
  id integer NOT NULL DEFAULT nextval('headh_id_seq'::regclass),
  seq smallint,
  name character varying(256),
  level smallint,
  colcat character(1),
  digit smallint NOT NULL DEFAULT 0,
  width smallint,
  alignno smallint,
  tableid smallint,
  CONSTRAINT headh_pkey PRIMARY KEY (id)
);
CREATE INDEX headh_tableid_idx 	ON headh (tableid);
CREATE INDEX headh_seq_idx	 	ON headh (seq);

INSERT INTO headh 
(seq, name, level, colcat, digit, width, alignno)
VALUES 
(1, '行次', 	1, 's', 0, 50,  2),
(2, '指标名称', 1, 't', 0, 180, 1),
(3, '级次', 	1, 's', 0, 60, 	2),
(4, '栏类别', 	1, 't', 0, 60, 	2),
(5, '小数位', 	1, 's', 0, 60, 	2),
(6, '宽度',		1, 't', 0, 60, 	2),
(7, '对齐',		1, 's', 0, 60, 	2),

(1, '指标名称', 1, 'z', 0, 180, 1),
(2, '行次', 	1, 'h', 0, 50,  2),
(3, '本月数', 	1, 's', 2, 100, 3),
(4, '本年数', 	1, 's', 2, 100, 3),
(5, '上年数', 	1, 's', 2, 100, 3),
(6, '同比',		1, 's', 2, 100, 3);


-- 纵表头 -- 
DROP TABLE IF EXISTS headv CASCADE;
DROP SEQUENCE IF EXISTS headv_id_seq;
CREATE SEQUENCE headv_id_seq;
CREATE TABLE headv
(
  id integer NOT NULL DEFAULT nextval('headv_id_seq'::regclass),
  seq smallint,
  name character varying(256),
  level smallint,
  tableid smallint,
  CONSTRAINT headh_pkey PRIMARY KEY (id)
);
CREATE INDEX headv_tableid_idx 	ON headv (tableid);
CREATE INDEX headv_seq_idx	 	ON headv (seq);


-- 表内公式 --
DROP TABLE IF EXISTS formula CASCADE;
DROP SEQUENCE IF EXISTS formula_id_seq;
CREATE SEQUENCE formula_id_seq;
CREATE TABLE formula
(
  id integer NOT NULL DEFAULT nextval('formula_id_seq'::regclass),
  seq smallint,
  name character varying(256),
  computable boolean NOT NULL DEFAULT true,  -- 是否为运算公式
  tableid smallint,
  CONSTRAINT formula_pkey PRIMARY KEY (id)
);
CREATE INDEX formula_tableid_idx 	ON formula (tableid);
CREATE INDEX formula_seq_idx	 	ON formula (seq);


-- 表间公式 --
DROP TABLE IF EXISTS formulaext CASCADE;
DROP SEQUENCE IF EXISTS formulaext_id_seq;
CREATE SEQUENCE formulaext_id_seq;
CREATE TABLE formulaext
(
  id integer NOT NULL DEFAULT nextval('formulaext_id_seq'::regclass),
  seq smallint,
  name character varying(256),
  computable boolean NOT NULL DEFAULT false,  -- 是否为运算公式
  taskid smallint,
  CONSTRAINT formulaext_pkey PRIMARY KEY (id)
);
CREATE INDEX formulaext_taskid_idx 	ON formulaext (taskid);
CREATE INDEX formulaext_seq_idx	 	ON formulaext (seq);



-- 数据表 --
DROP TABLE IF EXISTS data CASCADE;
DROP SEQUENCE IF EXISTS data_id_seq;
CREATE SEQUENCE data_id_seq;
CREATE TABLE data
(
  id integer NOT NULL DEFAULT nextval('data_id_seq'::regclass),
  companyid smallint,
  taskid integer,
  period smallint,
  audited boolean NOT NULL DEFAULT false,
  
  data jsonb,
  CONSTRAINT data_pkey PRIMARY KEY (id)
);
CREATE INDEX data_taskid_idx 	ON data (taskid);
CREATE INDEX data_period_idx 	ON data (period);


/*

-- 定义报表 -- 
DROP TABLE IF EXISTS define CASCADE;
DROP SEQUENCE IF EXISTS define_id_seq;
CREATE SEQUENCE define_id_seq;
CREATE TABLE define
(
	id integer NOT NULL DEFAULT nextval('define_id_seq'::regclass),
	taskid integer,
	label character varying(256),
	name  character varying(256),
	
	unit character varying(256),
	headh jsonb,
	headv jsonb,
	CONSTRAINT define_pkey PRIMARY KEY (id)
)

INSERT INTO define (headh) VALUES ('{
 "a":
[{"name": "指标", "level":1, "category": "z", "digit": 0, "width": 100, "align": "left",   "editable": false},
 {"name": "行次", "level":1, "category": "h", "digit": 0, "width":  50, "align": "center", "editable": false},
 {"name": "金额", "level":1, "category": "s", "digit": 2, "width": 120, "align": "right",  "editable": true }
],
 "b":
[{"name": "指标", "level": 1, "category": "z", "digit": 0, "width": 100, "align": "left",   "editable": false},
 {"name": "行次", "level": 1, "category": "h", "digit": 0, "width":  50, "align": "center", "editable": false},
 {"name": "金额", "level": 1, "category": "s", "digit": 2, "width": 120, "align": "right",  "editable": true }
 ]
}'::jsonb);

INSERT INTO define (headh) VALUES ('{
 "a":
[["指标", 1, "z", 0, 100, "left",   false],
 ["行次", 1, "h", 0,  50, "center", false],
 ["金额", 1, "s", 2, 120, "right",  true ]
],
 "b":
[["指标", 1, "z", 0, 100, "left",   false],
 ["行次", 1, "h", 0,  50, "center", false],
 ["金额", 1, "s", 2, 120, "right",  true ]
]
}'::jsonb);
*/











-- DROP SCHEMA ca CASCADE;
-- CREATE SCHEMA ca;

-- 对齐方式表 --
DROP TABLE IF EXISTS ca.align CASCADE;
CREATE TABLE ca.align
(
	id smallint,
	label character varying(256),
	name  character varying(256),
	CONSTRAINT align_pkey PRIMARY KEY (id)
);
INSERT INTO ca.align VALUES
(1, 'left',   '左对齐'),
(2, 'center', '居中'),
(3, 'right',  '右对齐');


-- 填报范围表 --
DROP TABLE IF EXISTS ca.range CASCADE;
CREATE TABLE ca.range
(
	id smallint,
	name  character varying(256),
	CONSTRAINT range_pkey PRIMARY KEY (id)
);
INSERT INTO ca.range (id, name) VALUES 
(1, '全部'),
(2, '省市级公司'),
(3, '市县级公司'),
(4, '仅省级公司'),
(5, '仅市级公司'),
(6, '仅县级公司'),
(7, '自定义');




















/*
CREATE OR REPLACE FUNCTION c_article_get_by_categoryid(_categoryid integer)
	RETURNS SETOF c_article AS $$
DECLARE
	_path TEXT;
BEGIN
	SELECT INTO _path path FROM c_category WHERE categoryid=$1;
	_path := _path || $1 || ',%';
	RETURN QUERY SELECT a.* FROM c_article a 
				 LEFT JOIN c_category b 
				 ON a.categoryid=b.categoryid 
				 WHERE b.categoryid=$1 OR b.path LIKE _path;
END;
$$ LANGUAGE plpgsql;
*/





