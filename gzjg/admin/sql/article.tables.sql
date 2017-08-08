

-- TABLE: article.article 文章表
DROP TABLE IF EXISTS article CASCADE;
DROP SEQUENCE IF EXISTS article.list_seq;	CREATE SEQUENCE article.list_seq;
CREATE TABLE article.list
(
	artid integer NOT NULL DEFAULT nextval('article.list_seq'),
	catid smallint NOT NULL DEFAULT 0,
	art_number varchar(128),
	title varchar(255) NOT NULL DEFAULT '',
	title_alias varchar(255) NOT NULL DEFAULT '',
	author varchar(64) NOT NULL DEFAULT '',
	uid smallint NOT NULL DEFAULT 0,
	post_time timestamp NOT NULL DEFAULT now(),
	hide_title boolean NOT NULL DEFAULT FALSE,
	published boolean NOT NULL DEFAULT FALSE,
	can_link boolean NOT NULL DEFAULT TRUE,		--标题可链接
	can_reply boolean NOT NULL DEFAULT TRUE,	--文章可回复
	reply_num integer NOT NULL DEFAULT 0,
	read_level smallint NOT NULL DEFAULT 0,
	counter integer NOT NULL DEFAULT 0,
	content text NOT NULL DEFAULT '',
	CONSTRAINT list_pkey PRIMARY KEY (artid)
);
CREATE INDEX list_catid 		ON article.list(catid);
CREATE INDEX list_art_number 	ON article.list(art_number);
CREATE INDEX list_title 		ON article.list(title);
CREATE INDEX list_author 		ON article.list(author);
CREATE INDEX list_uid 			ON article.list(uid);
CREATE INDEX list_hide_title 	ON article.list(hide_title);
CREATE INDEX list_published 	ON article.list(published);
CREATE INDEX list_counter 		ON article.list(counter);

CREATE OR REPLACE FUNCTION article.list_update(
	_artid integer,
	_catid integer,
	_art_number varchar,
	_title varchar,
	_title_alias varchar,
	_author varchar,
	_uid integer,
	_content text
) RETURNS integer AS $body$
BEGIN
	UPDATE article.list SET 
		catid 		= _catid,
		art_number	= _art_number,
		title		= _title,
		title_alias	= _title_alias,
		author		= _author,
		uid			= _uid,
		content		= _content
	WHERE artid = _artid;
	
	IF FOUND THEN
		RETURN _artid;
	END IF;
	
	INSERT INTO article.list (catid, art_number, title, title_alias, author, uid, content) 
					 VALUES (_catid,_art_number,_title,_title_alias,_author,_uid,_content);
	
	IF FOUND THEN
		RETURN currval('article.list_seq');
	END IF;
	
	RETURN -4;
END;
$body$ LANGUAGE 'plpgsql';




-- Table: 文章类别表
DROP TABLE IF EXISTS article.category CASCADE;
DROP SEQUENCE IF EXISTS article.category_seq;	CREATE SEQUENCE article.category_seq;
CREATE TABLE article.category (
	catid smallint NOT NULL DEFAULT nextval('article.category_seq'),
	pid smallint NOT NULL DEFAULT 0,
	pids varchar(255) NOT NULL DEFAULT '0,',
	cname varchar(255) NOT NULL DEFAULT '',
	bname varchar(255) NOT NULL DEFAULT '',
	isdir boolean NOT NULL DEFAULT FALSE,
	uid smallint NOT NULL DEFAULT 0,
	frequent boolean NOT NULL DEFAULT FALSE,
	odr smallint NOT NULL DEFAULT 0,
	CONSTRAINT category_pkey PRIMARY KEY (catid)
);
CREATE INDEX category_pid 		ON article.category(pid);
CREATE INDEX category_uid		ON article.category(uid);
CREATE INDEX category_pids 		ON article.category(pids);
CREATE INDEX category_odr 		ON article.category(odr);

INSERT INTO article.category (pid, cname, isdir, pids, frequent) VALUES
(0,'全部类别',TRUE,'',FALSE),

(1,'',TRUE,'1,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),
(2,'',FALSE,'1,2,',FALSE),

(1,'资金监管',TRUE,'1,',FALSE),
(10,'公告信息',FALSE,'1,10,',TRUE),
(10,'最新通知',FALSE,'1,10,',TRUE),
(10,'类别1',FALSE,'1,10,',FALSE),
(10,'类别2',FALSE,'1,10,',FALSE),
(10,'类别3',FALSE,'1,10,',FALSE),
(10,'类别4',FALSE,'1,10,',FALSE),
(10,'类别5',FALSE,'1,10,',FALSE),
(10,'类别6',FALSE,'1,10,',FALSE),
(10,'其他',FALSE,'1,10,',FALSE);






