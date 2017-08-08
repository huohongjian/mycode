DROP TABLE IF EXISTS taskcat CASCADE;
DROP SEQUENCE IF EXISTS taskcat_id_seq;
CREATE SEQUENCE taskcat_id_seq;
CREATE TABLE taskcat
(
	id integer NOT NULL DEFAULT nextval('taskcat_id_seq'::regclass),
	name character varying(256),
	CONSTRAINT taskcat_pkey PRIMARY KEY (id)
);
INSERT INTO taskcat(name) VALUES
('财务表'),
('统计表'),
('调查表'),
('报名表'), 
('其他表');




DROP TABLE IF EXISTS subject CASCADE;
DROP SEQUENCE IF EXISTS subject_id_seq;
CREATE SEQUENCE subject_id_seq;
CREATE TABLE subject
(
	id integer NOT NULL DEFAULT nextval('subject_id_seq'::regclass),
	name character varying(256),
	CONSTRAINT subject_pkey PRIMARY KEY (id)
);
INSERT INTO subject(name) VALUES
('公司'), ('部门'), ('个人');



DROP TABLE IF EXISTS period CASCADE;
DROP SEQUENCE IF EXISTS period_id_seq;
CREATE SEQUENCE period_id_seq;
CREATE TABLE period
(
	id integer NOT NULL DEFAULT nextval('period_id_seq'::regclass),
	name character varying(256),
	CONSTRAINT period_pkey PRIMARY KEY (id)
);
INSERT INTO period(name) VALUES
('年'), ('月'),('日'), ('自定义');



