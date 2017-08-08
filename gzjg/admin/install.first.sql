
DROP SCHEMA IF EXISTS asset CASCADE; CREATE SCHEMA asset;
DROP SCHEMA IF EXISTS article CASCADE; CREATE SCHEMA article;
DROP SCHEMA IF EXISTS conference CASCADE; CREATE SCHEMA conference;







-- TABLE: public.description 描述表
DROP TABLE IF EXISTS public.description CASCADE;
DROP SEQUENCE IF EXISTS public.description_seq; CREATE SEQUENCE public.description_seq;
CREATE TABLE public.description (
	desid smallint NOT NULL DEFAULT nextval('description_seq'),
	"schema" varchar(255) NOT NULL DEFAULT 'public',
	tname varchar(255) NOT NULL DEFAULT '',
	fname varchar(255) NOT NULL DEFAULT '',
	cname varchar(255) NOT NULL DEFAULT '',
	ftype varchar(255) NOT NULL DEFAULT '',
	remark varchar(255) NOT NULL DEFAULT '',
	CONSTRAINT description_pkey PRIMARY KEY (desid)
);
CREATE INDEX description_tname ON public.description (tname);


DELETE FROM public.description WHERE tname='desciption';
INSERT INTO public.description (tname, fname, cname, ftype) VALUES
('desciption', 'desid', '描述表自增序列', 'smallint'),
('desciption', 'tname', '表名', 'varchar(255)'),
('desciption', 'fname', '字段名', 'varchar(255)'),
('desciption', 'cname', '字段中文名', 'varchar(255)'),
('desciption', 'ftype', '字段类别', 'varchar(255)'),
('desciption', 'remark', '备注', 'varchar(255)');