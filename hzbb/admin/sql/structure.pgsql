

-- 报表结构  structure --
DROP TABLE IF EXISTS structure CASCADE;
DROP SEQUENCE IF EXISTS structure_id_seq;
CREATE SEQUENCE structure_id_seq;
CREATE TABLE structure
(
	id 			integer NOT NULL DEFAULT nextval('structure_id_seq'::regclass),
	taskid 		integer,
	label 		character varying(256),
	name  		character varying(256),
	unit 		character varying(256),
	rfloat  	boolean NOT NULL DEFAULT false,
	cfloat  	boolean NOT NULL DEFAULT false,
	widths 		jsonb NOT NULL DEFAULT '[]'::jsonb,
	columns 	jsonb NOT NULL DEFAULT '[]'::jsonb,
	cells		jsonb NOT NULL DEFAULT '[]'::jsonb,
	merges		jsonb NOT NULL DEFAULT '[]'::jsonb,
	rheaders	jsonb NOT NULL DEFAULT '[[]]'::jsonb,
	cheaders	jsonb NOT NULL DEFAULT '[[]]'::jsonb,
	formulas 	jsonb NOT NULL DEFAULT '[]'::jsonb,
	kvs			jsonb NOT NULL DEFAULT '[]'::jsonb,
	userid 		integer,
	deleted 	boolean NOT NULL DEFAULT false,
	CONSTRAINT structure_pkey PRIMARY KEY (id)
);
CREATE INDEX structure_taskid_idx 	ON structure (taskid, label);
INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders, formulas, kvs) VALUES
(1, 'A', '添加任务', true, '[60, 160, 280, 90, 90, 90, 90, 120, 50]'::jsonb,
	'[	{"data":0, "className":"htCenter", "readOnly":true},
		{"data":1},
		{"data":2},
		{"data":3, "className":"htCenter", "type":"dropdown", "source":["财务表","统计表","调查表","其他表"]},	
		{"data":4, "className":"htCenter", "type":"dropdown", "source":["公司","部门","个人","其他"]},
		{"data":5, "className":"htCenter", "type":"dropdown", "source":["年","月","日","其他"]},
		{"data":6, "className":"htCenter", "type":"dropdown", "source":["省公司","市公司","县公司","其他"]},
		{"data":7},
		{"data":8, "className":"htCenter", "type":"checkbox"}
	]'::jsonb,
	'[["id", "名称", "标题", "类别", "填报主体", "填报周期", "填报范围", "备注", "隐藏"]]'::jsonb,
	'[{"c":false, "f":"A(*,3)>0"}]'::jsonb,
	'[
		{"row":"*", "col":3, "ks":["1","2","3","4"], "vs":["财务表","统计表","调查表","其他表"]},
		{"row":"*", "col":4, "ks":["1","2","3","4"], "vs":["公司","部门","个人","其他"]},
		{"row":"*", "col":5, "ks":["1","2","3","4"], "vs":["年","月","日","其他"]},
		{"row":"*", "col":6, "ks":["1","2","3","4"], "vs":["省公司","市公司","县公司","其他"]}
	]'::jsonb
);


INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders) VALUES
(1, 'B', '表间公式', true, '[90, 300, 90]'::jsonb,
	'[	{"className":"htCenter", "type":"checkbox"},
		{},
		{}
	]'::jsonb,
	'[["参与运算", "公式", "通配符"]]'::jsonb
);

INSERT INTO structure (taskid, label, name) VALUES
(1, 'C', '设置时期'), 
(0, '', ''),
(0, '', ''),
(0, '', ''),
(0, '', ''),
(0, '', ''),
(0, '', ''),
(0, '', '');

INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders) VALUES
(2, 'A', '添加报表', true, '[60, 60, 300, 90, 80, 80, 80]'::jsonb, 
	'[	{"data":0, "className":"htCenter", "editor":false},
		{"data":1, "className":"htCenter"},
		{"data":2, "className":"htLeft"},	
		{"data":3, "className":"htCenter"},
		{"data":4, "className":"htCenter", "type":"checkbox"},
		{"data":5, "className":"htCenter", "type":"checkbox"},
		{"data":6, "className":"htCenter", "type":"checkbox"}
	]'::jsonb,
	 
	'[["id", "标识号", "名称", "单位", "行浮动", "列浮动", "隐藏"]]'::jsonb
);


INSERT INTO structure (taskid, label, name, rfloat, cfloat, widths) VALUES
(2, 'B', '横表头', true, true, '120'),
(2, 'C', '纵表头', true, true, '120');



INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders, kvs) VALUES
(2, 'D', '列样式', true, '[60, 90, 60,  90, 60, 400]'::jsonb,
'[
	{"className":"htCenter"},
	{"className":"htCenter", "type":"dropdown", "source":["左对齐", "居中", "右对齐"]},
	{"className":"htCenter", "type":"checkbox"},
	{"className":"htCenter", "type":"dropdown", "source":["字符型", "数字型", "选择框", "日期型", "选择项", "下拉框", "匹配型", "密码型"]},
	{"className":"htCenter"},
	{}
]'::jsonb,
'[["宽度", "对齐", "只读", "类型", "格式", "数据源"]]'::jsonb,
'[
	{"row":"*", "col":"1", "ks":["htLeft","htCenter","htRight"], "vs":["左对齐", "居中", "右对齐"]},
	{"row":"*", "col":"4", 
		"ks":["text","numeric","checkbox","date","select","dropdown","autoComplete","password"], 
		"vs":["字符型", "数字型", "选择框", "日期型", "选择项", "下拉框", "匹配型", "密码型"]}
]'::jsonb
);

INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders, kvs) VALUES
(2, 'E', '格样式', true, '[60, 60, 90, 60, 90, 60, 400]'::jsonb,
'[
	{"className":"htCenter"},
	{"className":"htCenter"},
	{"className":"htCenter", "type":"dropdown", "source":["左对齐", "居中", "右对齐"]},
	{"className":"htCenter", "type":"checkbox"},
	{"className":"htCenter", "type":"dropdown", "source":["字符型", "数字型", "选择框", "日期型", "选择项", "下拉框", "匹配型", "密码型"]},
	{"className":"htCenter"},
	{}
]'::jsonb,
'[["行号", "列号", "对齐", "只读", "类型", "格式", "数据源"]]'::jsonb,
'[
	{"row":"*", "col":"2", "ks":["htLeft","htCenter","htRight"], "vs":["左对齐", "居中", "右对齐"]},
	{"row":"*", "col":"5", 
		"ks":["text","numeric","checkbox","date","select","dropdown","autoComplete","password"], 
		"vs":["字符型", "数字型", "选择框", "日期型", "选择项", "下拉框", "匹配型", "密码型"]}
]'::jsonb
);


INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders) VALUES
(2, 'F', '键值对', true, '[60, 60, 400, 400]'::jsonb,
'[
	{"className":"htCenter", "type":"numeric"},
	{"className":"htCenter", "type":"numeric"},
	{},
	{}
]'::jsonb,
'[["行号", "列号", "键列表", "值列表"]]'::jsonb
);


INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders) VALUES
(2, 'G', '审核公式', true, '[400]'::jsonb,
	'[
		{}
	]'::jsonb,
	'[["审核公式"]]'::jsonb
);

INSERT INTO structure (taskid, label, name, rfloat, widths, columns, cheaders) VALUES
(2, 'H', '运算公式', true, '[400]'::jsonb,
	'[
		{}
	]'::jsonb,
	'[["审核公式"]]'::jsonb
);

INSERT INTO structure (taskid, label, name) VALUES(2, 'I', '预览');

