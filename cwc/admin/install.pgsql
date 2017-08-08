/*
	database: 	cwc
	date:		2016-06-12
	author:		huohongjian
*/



DROP TABLE IF EXISTS c_article CASCADE;
DROP SEQUENCE IF EXISTS c_article_seq;
CREATE SEQUENCE c_article_seq;
CREATE TABLE IF NOT EXISTS c_article (
	articleid int NOT NULL DEFAULT nextval('c_article_seq'),
	categoryid integer NOT NULL default 0,
	number varchar(128),
	caption varchar(255) NOT NULL default '',
	title varchar(255) NOT NULL default '',
	author varchar(64),
	userid integer NOT NULL default 0,
	posttime timestamp(0) without time zone NOT NULL DEFAULT now(),
	hidetitle integer NOT NULL default 0,
	published integer NOT NULL default 0,
	readlevel integer NOT NULL default 0, 		--'浏览权限:0所有浏览者; 1仅注册用户; 2仅财务用户; 3仅市局用户; 4仅省局用户; 5仅用户本人'
	counter int NOT NULL default 0,
	isreply integer NOT NULL default 0,
	answer integer NOT NULL default 0,
	content text,
	CONSTRAINT c_article_pkey PRIMARY KEY (articleid)
);
CREATE INDEX c_article_categoryid 	ON c_article (categoryid);
CREATE INDEX c_article_userid 		ON c_article (userid);
CREATE INDEX c_article_hidetitle	ON c_article (hidetitle);
CREATE INDEX c_article_published	ON c_article (published);


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





DROP TABLE IF EXISTS c_answer CASCADE;
DROP SEQUENCE IF EXISTS c_answer_seq;
CREATE SEQUENCE c_answer_seq;
CREATE TABLE IF NOT EXISTS c_answer (
	answerid int NOT NULL DEFAULT nextval('c_answer_seq'),
	articleid int NOT NULL default 0,
	userid integer NOT NULL default 0,
	isanonymous integer NOT NULL default 0,
	posttime timestamp(0) without time zone NOT NULL DEFAULT now(),
	agree integer NOT NULL default 0,
	oppose integer NOT NULL default 0,
	content text,
	CONSTRAINT c_answer_pkey PRIMARY KEY (answerid)
);
CREATE INDEX c_answer_articleid ON c_answer (articleid);



DROP TABLE IF EXISTS c_appendage CASCADE;
DROP SEQUENCE IF EXISTS c_appendage_seq;
CREATE SEQUENCE c_appendage_seq;
CREATE TABLE IF NOT EXISTS c_appendage (
	appendageid int NOT NULL DEFAULT nextval('c_appendage_seq'),
	categoryid integer NOT NULL default 0,
	pathid integer NOT NULL default 0,
	savename varchar(255) NOT NULL default '',
	filename varchar(255) NOT NULL default '',
	size int NOT NULL default 0,
	articleid int NOT NULL default 0,
	userid integer NOT NULL default 0,
	CONSTRAINT c_appendage_pkey PRIMARY KEY (appendageid)
);
CREATE INDEX c_appendage_categoryid 	ON c_appendage (categoryid);
CREATE INDEX c_appendage_articleid		ON c_appendage (articleid);
CREATE INDEX c_appendage_userid			ON c_appendage (userid);



DROP TABLE IF EXISTS c_appendage_category CASCADE;
DROP SEQUENCE IF EXISTS c_appendage_category_seq;
CREATE SEQUENCE c_appendage_category_seq;
CREATE TABLE IF NOT EXISTS c_appendage_category (
	categoryid integer NOT NULL DEFAULT nextval('c_appendage_category_seq'),
	name varchar(255) NOT NULL default '',
	extra varchar(255) NOT NULL default '',
	CONSTRAINT c_appendage_category_pkey PRIMARY KEY (categoryid)
);
/*
INSERT INTO c_appendage_category VALUES
(1,'文本文件','.txt'),
(2,'网页文件','.htm.html.js.php.asp.apsx'),
(3,'xml文件','.xml'),
(4,'chm文件','.chm'),
(5,'office文件','.doc.xls.ppt'),
(6,'压缩文件','.rar.zip'),
(7,'图像文件','.jpg.ico.png.gif'),
(8,'音频文件','.mp3'),
(9,'视频文件','.avi.rm'),
(10,'数据文件',''),
(11,'驱动程序',''),
(12,'应用程序',''),
(13,'linux程序',''),
(14,'bsd程序',''),
(99,'其他','');
*/


DROP TABLE IF EXISTS c_appendage_path CASCADE;
DROP SEQUENCE IF EXISTS c_appendage_path_seq;
CREATE SEQUENCE c_appendage_path_seq;
CREATE TABLE IF NOT EXISTS c_appendage_path (
	pathid integer NOT NULL DEFAULT nextval('c_appendage_path_seq'),
	name varchar(255) NOT NULL default '',
	CONSTRAINT c_appendage_path_pkey PRIMARY KEY (pathid)
);
/*
INSERT INTO c_appendage_path VALUES 
(1,'_upload/cwc/default/'),
(2,'_upload/cwc/txt/'),
(3,'_upload/cwc/html/'),
(4,'_upload/cwc/office/'),
(5,'_upload/cwc/driver/'),
(6,'_upload/cwc/soft/'),
(7,'_upload/cwc/photo/'),
(8,'_upload/cwc/image/'),
(9,'_upload/cwc/mp3/'),
(10,'_upload/cwc/linux/'),
(11,'_upload/cwc/freebsd/'),
(12,'_upload/cwc/game/'),
(98,'_upload/cwc/temp/'),
(99,'_upload/cwc/other/');
*/


DROP TABLE IF EXISTS c_homepage_image CASCADE;
DROP SEQUENCE IF EXISTS c_homepage_image_seq;
CREATE SEQUENCE c_homepage_image_seq;
CREATE TABLE IF NOT EXISTS c_homepage_image (
	imageid int NOT NULL DEFAULT nextval('c_homepage_image_seq'),
	categoryid integer NOT NULL default 0,
	appendageid int NOT NULL default 0,
	articleid int NOT NULL default 0,
	CONSTRAINT c_homepage_image_pkey PRIMARY KEY (imageid)
);
CREATE INDEX c_homepage_image_categoryid 	ON c_homepage_image (categoryid);



DROP TABLE IF EXISTS c_image_category CASCADE;
DROP SEQUENCE IF EXISTS c_image_category_seq;
CREATE SEQUENCE c_image_category_seq;
CREATE TABLE IF NOT EXISTS c_image_category (
	categoryid integer NOT NULL DEFAULT nextval('c_image_category_seq'),
	name varchar(255) NOT NULL default '',
	dimension varchar(64) NOT NULL default '',
	CONSTRAINT c_image_category_pkey PRIMARY KEY (categoryid)
);
/*
INSERT INTO c_image_category VALUES
(1,'新闻图片1','200*150'),
(2,'右侧图片1','600*80');
*/


/*
DROP TABLE IF EXISTS c_session CASCADE;
DROP SEQUENCE IF EXISTS c_session_seq;	CREATE SEQUENCE c_session_seq;
CREATE TABLE c_session
(
	sid bigint NOT NULL DEFAULT nextval('c_session_seq'),
	sessionid varchar(255) NOT NULL DEFAULT '',
	logintime timestamp(0) NOT NULL DEFAULT now(),
	val text NOT NULL DEFAULT '',
	CONSTRAINT c_session_pkey PRIMARY KEY (sid)
);
CREATE INDEX c_session_sessionid ON c_session(sessionid);
CREATE INDEX c_session_logintime ON c_session(logintime);

CREATE OR REPLACE FUNCTION c_session_update(varchar, jsonb) RETURNS boolean AS $body$
BEGIN
	UPDATE c_session SET logintime=now(), data=data || $2 WHERE sessionid=$1;
	IF found THEN
		RETURN true;
	END IF;
	
	INSERT INTO c_session(sessionid, data) VALUES ($1, $2);
	IF found THEN
		RETURN true;
	END IF;
	
	RETURN false;
END;
$body$ LANGUAGE 'plpgsql';
*/

DROP TABLE IF EXISTS c_session CASCADE;
DROP SEQUENCE IF EXISTS c_session_seq;	CREATE SEQUENCE c_session_seq;
CREATE TABLE c_session
(
	sid bigint NOT NULL DEFAULT nextval('c_session_seq'),
	sessionid varchar(255) NOT NULL DEFAULT '',
	logintime timestamp(0) NOT NULL DEFAULT current_timestamp,
	data jsonb,
	CONSTRAINT c_session_pkey PRIMARY KEY (sid)	
);
CREATE INDEX c_session_sessionid ON c_session(sessionid);
CREATE INDEX c_session_logintime ON c_session(logintime);


CREATE OR REPLACE FUNCTION c_session_update(varchar, jsonb) RETURNS boolean AS $body$
BEGIN
	UPDATE c_session SET logintime=now(), data=data || $2 WHERE sessionid=$1;
	IF found THEN
		RETURN true;
	END IF;
	
	INSERT INTO c_session(sessionid, data) VALUES ($1, $2);
	IF found THEN
		RETURN true;
	END IF;
	
	RETURN false;
END;
$body$ LANGUAGE 'plpgsql';





DROP TABLE IF EXISTS c_cache CASCADE;
DROP SEQUENCE IF EXISTS c_cache_seq;
CREATE SEQUENCE c_cache_seq;
CREATE TABLE IF NOT EXISTS c_cache (
	cid integer NOT NULL DEFAULT nextval('c_cache_seq'),
	cacheid varchar(32) NOT NULL default '',
	thetime timestamp(0) without time zone,
	value text,
	CONSTRAINT c_cache_pkey PRIMARY KEY (cid)
);
CREATE INDEX c_cache_cacheid	ON c_cache (cacheid);



DROP TABLE IF EXISTS c_usergroup CASCADE;
DROP SEQUENCE IF EXISTS c_usergroup_seq;
CREATE SEQUENCE c_usergroup_seq;
CREATE TABLE IF NOT EXISTS c_usergroup (
	usergroupid integer NOT NULL DEFAULT nextval('c_usergroup_seq'),
	pyname varchar(16) NOT NULL default '',
	name varchar(32) NOT NULL default '',
	CONSTRAINT c_usergroup_pkey PRIMARY KEY (usergroupid)
);
/*
INSERT INTO c_usergroup VALUES
(1,'root',	'超级用户'),
(2,'admin', '系统管理员'),
(3,'sheng', '省公司'),
(4,'shi',	'市公司'),
(5,'xian',	'县公司'),
(9,'qt',	'其他');
*/


DROP TABLE IF EXISTS c_browselist CASCADE;
DROP SEQUENCE IF EXISTS c_browselist_seq;
CREATE SEQUENCE c_browselist_seq;
CREATE TABLE IF NOT EXISTS c_browselist (
	browselistid integer NOT NULL DEFAULT nextval('c_browselist_seq'),
	articleid int NOT NULL default 0,
	ipaddress varchar(16) NOT NULL default '',
	counter integer NOT NULL default 0,
	lasttime timestamp(0) without time zone NOT NULL DEFAULT now(),
	userid integer NOT NULL default 0,
	CONSTRAINT c_browselist_pkey PRIMARY KEY (browselistid)
);
CREATE INDEX c_browselist_articleid 	ON c_browselist (articleid);
CREATE INDEX c_browselist_userid		ON c_browselist (userid);
CREATE INDEX c_browselist_ipaddress		ON c_browselist (ipaddress);




-- TABLE: c_user  用户表
DROP TABLE IF EXISTS c_user CASCADE;
DROP SEQUENCE IF EXISTS c_user_seq;	CREATE SEQUENCE c_user_seq;
CREATE TABLE IF NOT EXISTS c_user (
	userid integer NOT NULL DEFAULT nextval('c_user_seq'),
	realname character varying(16) NOT NULL default '',
	username character varying(16) NOT NULL default '',
	password character varying(64) NOT NULL default '',
	usergroupid integer default 0,
	authorizationids character varying(255) NOT NULL default '',
	score integer NOT NULL default 0,
	sex character varying(2) default '',
	idno character varying(32) default NULL,
	jointime timestamp(0) without time zone NOT NULL DEFAULT now(),
	incid integer default 0,
	deptid integer default 0,
	iscw integer default 0,
	telephone character varying(16) default NULL,
	mobilephone character varying(16) default NULL,
	address character varying(255) default NULL,
	postcode character varying(8) default NULL,
	ipaddress character varying(16) default NULL,
	email character varying(64) default NULL,
	oaemail character varying(64) default NULL,
	homepage character varying(64) default NULL,
	qq character varying(16) default NULL,
	msn character varying(32) default NULL,
	intro character varying(255) default NULL,
	photo character varying(255) default NULL,
  	CONSTRAINT c_user_pkey PRIMARY KEY (userid),
  	UNIQUE (username)
);
CREATE INDEX c_user_username ON c_user (username);
CREATE INDEX c_user_usergroupid ON c_user (usergroupid);
/*
INSERT INTO c_user(realname, username, password, usergroupid)  VALUES
('root', 		   	'root', 		'202cb962ac59075b964b07152d234b70', 	1),
('administrator',  	'admin', 		'202cb962ac59075b964b07152d234b70', 	2),
('', '', '', 2),
('缴进才(admin)',  	'jiaojincai', 	'202cb962ac59075b964b07152d234b70', 	2),
('王永红(admin)', 	'wangyonghong', '202cb962ac59075b964b07152d234b70', 	2),
('霍宏建(admin)', 	'huohongjian', 	'202cb962ac59075b964b07152d234b70', 	2),
('郭永宾(admin)', 	'guoyongbin', 	'202cb962ac59075b964b07152d234b70', 	2);
*/


DROP TABLE IF EXISTS c_uc CASCADE;
DROP SEQUENCE IF EXISTS c_uc_seq;
CREATE SEQUENCE c_uc_seq;
CREATE TABLE IF NOT EXISTS c_uc (
	ucid integer NOT NULL DEFAULT nextval('c_uc_seq'),
	userid integer,
	categoryid integer,
	CONSTRAINT c_uc_pkey PRIMARY KEY (ucid)
);
CREATE INDEX c_uc_userid 		ON c_uc (userid);
CREATE INDEX c_uc_categoryid	ON c_uc (categoryid);
/*
INSERT INTO c_uc (userid, categoryid) VALUES 
(1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),
(10,10),(10,30),(10,50),(10,70),(10,90),(10,110),(10,150),
(11,10),(11,30),(11,50),(11,70),(11,90),(11,110),(11,150),
(12,10),(12,30),(12,50),(12,70),(12,90),(12,110),(12,150),
(13,10),(13,30),(13,50),(13,70),(13,90),(13,110),(13,150),
(14,10),(14,30),(14,50),(14,70),(14,90),(14,110),(14,150),
(15,10),(15,30),(15,50),(15,70),(15,90),(15,110),(15,150),
(16,10),(16,30),(16,50),(16,70),(16,90),(16,110),(16,150),
(17,10),(17,30),(17,50),(17,70),(17,90),(17,110),(17,150),
(18,10),(18,30),(18,50),(18,70),(18,90),(18,110),(18,150),
(19,10),(19,30),(19,50),(19,70),(19,90),(19,110),(19,150),
(20,10),(20,30),(20,50),(20,70),(20,90),(20,110),(20,150),
(21,10),(21,30),(21,50),(21,70),(21,90),(21,110),(21,150),
(22,10),(22,30),(22,50),(22,70),(22,90),(22,110),(22,150),
(23,10),(23,30),(23,50),(23,70),(23,90),(23,110),(23,150),
(24,10),(24,30),(24,50),(24,70),(24,90),(24,110),(24,150),
		(30,30),(30,50),(30,70),(30,90),(30,110),(30,150);
*/


DROP TABLE IF EXISTS c_category CASCADE;
DROP SEQUENCE IF EXISTS c_category_seq;
CREATE SEQUENCE c_category_seq;
CREATE TABLE IF NOT EXISTS c_category (
	categoryid integer NOT NULL DEFAULT nextval('c_category_seq'),
	parentid integer NOT NULL default 0,
	name varchar(64) NOT NULL default '',
	brifname varchar(32) NOT NULL default '',
	isdir char(1) NOT NULL default 'n',	
	visible char(1) NOT NULL default 'y',
	userid integer NOT NULL default 0,
	path varchar(64) NOT NULL default '0,',
	odr integer NOT NULL default 0,
	CONSTRAINT c_category_pkey PRIMARY KEY (categoryid)
);
CREATE INDEX c_category_parentid 	ON c_category (parentid);
CREATE INDEX c_category_userid		ON c_category (userid);
CREATE INDEX c_category_path		ON c_category (path);
CREATE INDEX c_category_odr			ON c_category (odr);
/*
INSERT INTO c_category VALUES
(1,0,'全部类别','','y','y',1,'',0),

(2,1,'','','y','y',1,'1,',0),
(3,2,'','','n','y',1,'1,2,',0),
(4,2,'','','n','y',1,'1,2,',0),
(5,2,'','','n','y',1,'1,2,',0),
(6,2,'','','n','y',1,'1,2,',0),
(7,2,'','','n','y',1,'1,2,',0),
(8,2,'','','n','y',1,'1,2,',0),
(9,2,'','','n','y',1,'1,2,',0),

(10,1,'通知通告','','y','y',1,'1,',0),
(11,10,'公告信息','','n','y',1,'1,10,',0),
(12,10,'最新通知','','n','y',1,'1,10,',0),
(13,10,'领导讲话','','n','y',1,'1,10,',0),
(14,10,'行业文件','','n','y',1,'1,10,',0),
(15,10,'行业信息','','n','y',1,'1,10,',0),
(16,10,'财会信息','','n','y',1,'1,10,',0),
(17,10,'','','n','y',1,'1,10,',0),
(18,10,'','','n','y',1,'1,10,',0),
(19,10,'其他','','n','y',1,'1,10,',0),

(20,1,'','','y','y',1,'1,',0),
(21,20,'','','n','y',1,'1,20,',0),
(22,20,'','','n','y',1,'1,20,',0),
(23,20,'','','n','y',1,'1,20,',0),
(24,20,'','','n','y',1,'1,20,',0),
(25,20,'','','n','y',1,'1,20,',0),
(26,20,'','','n','y',1,'1,20,',0),
(27,20,'','','n','y',1,'1,20,',0),
(28,20,'','','n','y',1,'1,20,',0),
(29,20,'','','n','y',1,'1,20,',0),

(30,1,'政策法规','','y','y',1,'1,',0),
(31,30,'法律','','n','y',1,'1,30,',0),
(32,30,'经济','','n','y',1,'1,30,',0),
(33,30,'财务','','n','y',1,'1,30,',0),
(34,30,'会计','','n','y',1,'1,30,',0),
(35,30,'税务','','n','y',1,'1,30,',0),
(36,30,'','','n','y',1,'1,30,',0),
(37,30,'','','n','y',1,'1,30,',0),
(38,30,'','','n','y',1,'1,30,',0),
(39,30,'其他','','n','y',1,'1,30,',0),

(40,1,'','','y','y',1,'1,',0),
(41,40,'','','n','y',1,'1,40,',0),
(42,40,'','','n','y',1,'1,40,',0),
(43,40,'','','n','y',1,'1,40,',0),
(44,40,'','','n','y',1,'1,40,',0),
(45,40,'','','n','y',1,'1,40,',0),
(46,40,'','','n','y',1,'1,40,',0),
(47,40,'','','n','y',1,'1,40,',0),
(48,40,'','','n','y',1,'1,40,',0),
(49,40,'','','n','y',1,'1,40,',0),

(50,1,'学习交流','','y','y',1,'1,',0),
(51,50,'财务','','n','y',1,'1,50,',0),
(52,50,'会计','','n','y',1,'1,50,',0),
(53,50,'税务','','n','y',1,'1,50,',0),
(54,50,'电脑','','n','y',1,'1,50,',0),
(55,50,'','','n','y',1,'1,50,',0),
(56,50,'','','n','y',1,'1,50,',0),
(57,50,'','','n','y',1,'1,50,',0),
(58,50,'','','n','y',1,'1,50,',0),
(59,50,'其他','','n','y',1,'1,50,',0),

(60,1,'','','y','y',1,'1,',0),
(61,60,'','','n','y',1,'1,60,',0),
(62,60,'','','n','y',1,'1,60,',0),
(63,60,'','','n','y',1,'1,60,',0),
(64,60,'','','n','y',1,'1,60,',0),
(65,60,'','','n','y',1,'1,60,',0),
(66,60,'','','n','y',1,'1,60,',0),
(67,60,'','','n','y',1,'1,60,',0),
(68,60,'','','n','y',1,'1,60,',0),
(69,60,'','','n','y',1,'1,60,',0),

(70,1,'电脑知识','','y','y',1,'1,',0),
(71,70,'系统','','n','y',1,'1,70,',0),
(72,70,'软件','','n','y',1,'1,70,',0),
(73,70,'硬件','','n','y',1,'1,70,',0),
(74,70,'网页','','n','y',1,'1,70,',0),
(75,70,'编程','','n','y',1,'1,70,',0),
(76,70,'数据库','','n','y',1,'1,70,',0),
(77,70,'多媒体','','n','y',1,'1,70,',0),
(78,70,'','','n','y',1,'1,70,',0),
(79,70,'其他','','n','y',1,'1,70,',0),

(80,1,'','','y','y',1,'1,',0),
(81,80,'','','n','y',1,'1,80,',0),
(82,80,'','','n','y',1,'1,80,',0),
(83,80,'','','n','y',1,'1,80,',0),
(84,80,'','','n','y',1,'1,80,',0),
(85,80,'','','n','y',1,'1,80,',0),
(86,80,'','','n','y',1,'1,80,',0),
(87,80,'','','n','y',1,'1,80,',0),
(88,80,'','','n','y',1,'1,80,',0),
(89,80,'','','n','y',1,'1,80,',0),

(90,1,'网络文摘','','y','y',1,'1,',0),
(91,90,'新闻','','n','y',1,'1,90,',0),
(92,90,'政治经济','','n','y',1,'1,90,',0),
(93,90,'时事评论','','n','y',1,'1,90,',0),
(94,90,'历史人物','','n','y',1,'1,90,',0),
(95,90,'励志人生','','n','y',1,'1,90,',0),
(96,90,'情感生活','','n','y',1,'1,90,',0),
(97,90,'诗词散文','','n','y',1,'1,90,',0),
(98,90,'随笔杂文','','n','y',1,'1,90,',0),
(99,90,'其他','','n','y',1,'1,90,',0),

(100,1,'','','y','y',1,'1,',0),
(101,100,'','','n','y',1,'1,100,',0),
(102,100,'','','n','y',1,'1,100,',0),
(103,100,'','','n','y',1,'1,100,',0),
(104,100,'','','n','y',1,'1,100,',0),
(105,100,'','','n','y',1,'1,100,',0),
(106,100,'','','n','y',1,'1,100,',0),
(107,100,'','','n','y',1,'1,100,',0),
(108,100,'','','n','y',1,'1,100,',0),
(109,100,'','','n','y',1,'1,100,',0),

(110,1,'软件下载','','y','y',1,'1,',0),
(111,110,'系统软件','','n','y',1,'1,110,',0),
(112,110,'网络工具','','n','y',1,'1,110,',0),
(113,110,'安全相关','','n','y',1,'1,110,',0),
(114,110,'媒体工具','','n','y',1,'1,110,',0),
(115,110,'编程工具','','n','y',1,'1,110,',0),
(116,110,'源码下载','','n','y',1,'1,110,',0),
(117,110,'电子图书','','n','y',1,'1,110,',0),
(118,110,'','','n','y',1,'1,110,',0),
(119,110,'其他','','n','y',1,'1,110,',0),

(120,1,'','','y','y',1,'1,',0),
(121,120,'','','n','y',1,'1,120,',0),
(122,120,'','','n','y',1,'1,120,',0),
(123,120,'','','n','y',1,'1,120,',0),
(124,120,'','','n','y',1,'1,120,',0),
(125,120,'','','n','y',1,'1,120,',0),
(126,120,'','','n','y',1,'1,120,',0),
(127,120,'','','n','y',1,'1,120,',0),
(128,120,'','','n','y',1,'1,120,',0),
(129,120,'','','n','y',1,'1,120,',0),

(130,1,'','','y','y',1,'1,',0),
(131,130,'','','n','y',1,'1,130,',0),
(132,130,'','','n','y',1,'1,130,',0),
(133,130,'','','n','y',1,'1,130,',0),
(134,130,'','','n','y',1,'1,130,',0),
(135,130,'','','n','y',1,'1,130,',0),
(136,130,'','','n','y',1,'1,130,',0),
(137,130,'','','n','y',1,'1,130,',0),
(138,130,'','','n','y',1,'1,130,',0),
(139,130,'','','n','y',1,'1,130,',0),

(140,1,'','','y','y',1,'1,',0),
(141,140,'','','n','y',1,'1,140,',0),
(142,140,'','','n','y',1,'1,140,',0),
(143,140,'','','n','y',1,'1,140,',0),
(144,140,'','','n','y',1,'1,140,',0),
(145,140,'','','n','y',1,'1,140,',0),
(146,140,'','','n','y',1,'1,140,',0),
(147,140,'','','n','y',1,'1,140,',0),
(148,140,'','','n','y',1,'1,140,',0),
(149,140,'','','n','y',1,'1,140,',0),

(150,1,'我的文章','','y','y',1,'1,',0),
(151,150,'工作','','n','y',1,'1,150,',0),
(152,150,'生活','','n','y',1,'1,150,',0),
(153,150,'学习','','n','y',1,'1,150,',0),
(154,150,'读书','','n','y',1,'1,150,',0),
(155,150,'笔记','','n','y',1,'1,150,',0),
(156,150,'文摘','','n','y',1,'1,150,',0),
(157,150,'随笔','','n','y',1,'1,150,',0),
(158,150,'','','n','y',1,'1,150,',0),
(159,150,'其他','','n','y',1,'1,150,',0),

(160,1,'','','y','y',1,'1,',0),
(161,160,'','','n','y',1,'1,160,',0),
(162,160,'','','n','y',1,'1,160,',0),
(163,160,'','','n','y',1,'1,160,',0),
(164,160,'','','n','y',1,'1,160,',0),
(165,160,'','','n','y',1,'1,160,',0),
(166,160,'','','n','y',1,'1,160,',0),
(167,160,'','','n','y',1,'1,160,',0),
(168,160,'','','n','y',1,'1,160,',0),
(169,160,'','','n','y',1,'1,160,',0),

(170,1,'','','y','y',1,'1,',0),
(171,170,'','','n','y',1,'1,170,',0),
(172,170,'','','n','y',1,'1,170,',0),
(173,170,'','','n','y',1,'1,170,',0),
(174,170,'','','n','y',1,'1,170,',0),
(175,170,'','','n','y',1,'1,170,',0),
(176,170,'','','n','y',1,'1,170,',0),
(177,170,'','','n','y',1,'1,170,',0),
(178,170,'','','n','y',1,'1,170,',0),
(179,170,'','','n','y',1,'1,170,',0),

(180,1,'','','y','y',1,'1,',0),
(181,180,'','','n','y',1,'1,180,',0),
(182,180,'','','n','y',1,'1,180,',0),
(183,180,'','','n','y',1,'1,180,',0),
(184,180,'','','n','y',1,'1,180,',0),
(185,180,'','','n','y',1,'1,180,',0),
(186,180,'','','n','y',1,'1,180,',0),
(187,180,'','','n','y',1,'1,180,',0),
(188,180,'','','n','y',1,'1,180,',0),
(189,180,'','','n','y',1,'1,180,',0),

(190,1,'','','y','y',1,'1,',0),
(191,190,'','','n','y',1,'1,190,',0),
(192,190,'','','n','y',1,'1,190,',0),
(193,190,'','','n','y',1,'1,190,',0),
(194,190,'','','n','y',1,'1,190,',0),
(195,190,'','','n','y',1,'1,190,',0),
(196,190,'','','n','y',1,'1,190,',0),
(197,190,'','','n','y',1,'1,190,',0),
(198,190,'','','n','y',1,'1,190,',0),
(199,190,'','','n','y',1,'1,190,',0),

(200,1,'我的类别','','y','y',1,'1,',0);
*/




DROP TABLE IF EXISTS  c_userinfo ;
DROP SEQUENCE IF EXISTS c_userinfo_seq;
CREATE SEQUENCE c_userinfo_seq;
CREATE TABLE  c_userinfo  (
	 userid  integer NOT NULL default nextval('c_userinfo_seq'),
	 truename  varchar(16) NOT NULL DEFAULT '',
	 department  varchar(16) NOT NULL DEFAULT '',
	 ipaddress  varchar(16) DEFAULT NULL,
	CONSTRAINT c_userinfo_pkey PRIMARY KEY ( userid )
);
CREATE INDEX c_userinfo_truename 	ON c_userinfo( truename );
CREATE INDEX c_userinfo_ipaddress	ON c_userinfo( ipaddress );





