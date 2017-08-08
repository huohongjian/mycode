

-- Table: 会议名称表
DROP TABLE IF EXISTS conference.conference CASCADE;
DROP SEQUENCE IF EXISTS conference.conference_seq;	CREATE SEQUENCE conference.conference_seq;
CREATE TABLE conference.conference (
	conid integer NOT NULL DEFAULT nextval('conference.conference_seq'),
	conname varchar(255) NOT NULL DEFAULT '',
	contime varchar(255) NOT NULL DEFAULT '',
	location varchar(255) NOT NULL DEFAULT '',
	personnel varchar(255) NOT NULL DEFAULT '',
	item text NOT NULL DEFAULT '',
	linkid integer NOT NULL DEFAULT 0,
	register_time timestamp NOT NULL DEFAULT now(),
	post_time timestamp NOT NULL DEFAULT now(),
	uid smallint NOT NULL DEFAULT 0,
	CONSTRAINT conference_pkey PRIMARY KEY (conid)
);
CREATE INDEX conference_conname	ON conference.conference(conname);

DELETE FROM description WHERE tname='conference';
INSERT INTO description (schema, tname, fname, cname, ftype) VALUES
('conference', 'conference', 'conid', '会议名称表自增序列', 'integer'),
('conference', 'conference', 'conname', '会议名称', 'varchar(255)'),
('conference', 'conference', 'contime', '会议时间', 'varchar(255)'),
('conference', 'conference', 'location', '会议地点', 'varchar(255)'),
('conference', 'conference', 'personnel', '参会人员', 'varchar(255)'),
('conference', 'conference', 'item', '其他事项', 'text'),
('conference', 'conference', 'linkid', '关联的文章id', 'integer'),
('conference', 'conference', 'register_time', '报名时间', 'timestamp'),
('conference', 'conference', 'post_time', '上传时间', 'timestamp'),
('conference', 'conference', 'uid', '用户id', 'smallint');



-- 参加会议人员表
DROP TABLE IF EXISTS conference.personnel CASCADE;
DROP SEQUENCE IF EXISTS conference.personnel_seq;	CREATE SEQUENCE conference.personnel_seq;
CREATE TABLE conference.personnel (
	perid integer NOT NULL DEFAULT nextval('conference.personnel_seq'),
	corid smallint NOT NULL DEFAULT 0,
	pername varchar(255) NOT NULL DEFAULT '',
	sex varchar(255) NOT NULL DEFAULT '',
	race varchar(255) NOT NULL DEFAULT '',
	headship varchar(255) NOT NULL DEFAULT '',
	telephone varchar(255) NOT NULL DEFAULT '',
	mobile varchar(255) NOT NULL DEFAULT '',
	room_number varchar(255) NOT NULL DEFAULT '',
	room_telephone varchar(255) NOT NULL DEFAULT '',
	post_time timestamp NOT NULL DEFAULT now(),
	remark text NOT NULL DEFAULT '',
	CONSTRAINT personnel_pkey PRIMARY KEY (perid)
);
