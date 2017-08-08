

-- 任务表 --
DROP TABLE IF EXISTS task CASCADE;
DROP SEQUENCE IF EXISTS task_id_seq;
CREATE SEQUENCE task_id_seq;
CREATE TABLE task
(
	id integer NOT NULL DEFAULT nextval('task_id_seq'::regclass),
	name  character varying(256),
	title character varying(256),
	taskcatid integer REFERENCES taskcat
                 		ON UPDATE CASCADE
                 		ON DELETE SET NULL,
	subjectid integer REFERENCES subject
                 		ON UPDATE CASCADE
                 		ON DELETE SET NULL,   --填报主体
    periodid integer REFERENCES period
                 		ON UPDATE CASCADE
                 		ON DELETE SET NULL,
    dates jsonb,
	rangeid integer,
	userid integer,
	datetime timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	remark	text,
	deleted boolean NOT NULL DEFAULT false,
	CONSTRAINT task_pkey PRIMARY KEY (id)
);
INSERT INTO task (name, title, taskcatid, subjectid) VALUES
('定义任务', '系统表', 1, 1),
('定义报表', '系统表', 1, 1),
('财务报表', '测算表', 1, 1);



