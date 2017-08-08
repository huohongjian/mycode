

-- TABLE: zj_user  用户表
DROP TABLE IF EXISTS zj_user CASCADE;
DROP SEQUENCE IF EXISTS zj_user_seq;	CREATE SEQUENCE zj_user_seq;
CREATE TABLE zj_user
(
  uid smallint NOT NULL DEFAULT nextval('zj_user_seq'),
  uname character varying(32) NOT NULL DEFAULT '',
  upassword character varying(32) NOT NULL DEFAULT '',
  realname character varying(32) NOT NULL DEFAULT '',
  corid smallint NOT NULL DEFAULT 0,
  telephone character varying(16) NOT NULL DEFAULT '',
  mobile character varying(16) NOT NULL DEFAULT '',
  ip inet NOT NULL DEFAULT '127.0.0.1',
  email character varying(64) NOT NULL DEFAULT '',
  can_submit boolean NOT NULL DEFAULT false,
  can_reply boolean NOT NULL DEFAULT false,
  CONSTRAINT zj_user_pkey PRIMARY KEY (uid),
  UNIQUE (uname)
);
CREATE INDEX zj_user_name ON zj_user (uname);
INSERT INTO zj_user(uname, upassword, realname, corid, can_submit, can_reply) VALUES
('admin','6e96282617c1455a829826d469552d6f','管理员',0, true, true),
('jjc',	'202cb962ac59075b964b07152d234b70','缴进才',	0, true, true),
('cy', 	'202cb962ac59075b964b07152d234b70','程渊', 	0, true, true),
('ycx',	'202cb962ac59075b964b07152d234b70','杨翠霞', 0, true, true),
('fjb',	'202cb962ac59075b964b07152d234b70','樊静波', 0, true, true),
('hhj',	'6e96282617c1455a829826d469552d6f','霍宏建', 0, true, true),
('zl', 	'202cb962ac59075b964b07152d234b70','张磊', 	0, true, true),
('gyb',	'202cb962ac59075b964b07152d234b70','郭永宾', 0, true, true),
('mm123','202cb962ac59075b964b07152d234b70','密码', -1, false, false),
('wyh',	'202cb962ac59075b964b07152d234b70','王永红',	1, true, false);


-- TABLE: zj_corporation  公司名称表
DROP TABLE IF EXISTS zj_corporation CASCADE;
DROP SEQUENCE IF EXISTS zj_corporation_seq;	CREATE SEQUENCE zj_corporation_seq;
CREATE TABLE zj_corporation
(
	corid smallint NOT NULL DEFAULT nextval('zj_corporation_seq'),
	parentid smallint NOT NULL DEFAULT 0,
	haschild boolean NOT NULL DEFAULT false,
	corpath varchar(255) NOT NULL DEFAULT '',
	corcode character(2) NOT NULL DEFAULT '-1',
	corname character varying(64) NOT NULL DEFAULT '',
	aliasname character varying(32) NOT NULL DEFAULT '',
	briefname character varying(16) NOT NULL DEFAULT '',
	CONSTRAINT zj_corporation_pkey PRIMARY KEY (corid)
);
INSERT INTO zj_corporation VALUES
(0,-1,	true,	'/',	'00',	'中国烟草总公司河北省公司(合计)', 	'河北省烟草公司(合计)',	'河北省'),
(1,	0,	false,	'/0/',	'01',	'河北省烟草公司石家庄市公司',		'石家庄市烟草公司',		'石家庄'),
(2,	0,	false,	'/0/',	'02',	'河北省烟草公司唐　山市公司',		'唐　山市烟草公司',		'唐　山'),
(3,	0,	false,	'/0/',	'03',	'河北省烟草公司秦皇岛市公司',		'秦皇岛市烟草公司',		'秦皇岛'),
(4,	0,	false,	'/0/',	'04',	'河北省烟草公司邯　郸市公司',		'邯　郸市烟草公司',		'邯　郸'),
(5,	0,	false,	'/0/',	'05',	'河北省烟草公司邢　台市公司',		'邢　台市烟草公司',		'邢　台'),
(6,	0,	false,	'/0/',	'06',	'河北省烟草公司保　定市公司',		'保　定市烟草公司',		'保　定'),
(7,	0,	false,	'/0/',	'07',	'河北省烟草公司张家口市公司',		'张家口市烟草公司',		'张家口'),
(8,	0,	false,	'/0/',	'08',	'河北省烟草公司承　德市公司',		'承　德市烟草公司',		'承　德'),
(9,	0,	false,	'/0/',	'09',	'河北省烟草公司沧　州市公司',		'沧　州市烟草公司',		'沧　州'),
(10,0,	false,	'/0/',	'10',	'河北省烟草公司廊　坊市公司',		'廊　坊市烟草公司',		'廊　坊'),
(11,0,	false,	'/0/',	'11',	'河北省烟草公司衡　水市公司',		'衡　水市烟草公司',		'衡　水'),
(12,0,	false,	'/0/',	'12',	'中国烟草总公司河北省公司(本部)',	'河北省烟草公司(本部)',	'省本部'),
(13,0,	false,	'/0/',	'13',	'中国烟草总公司河北省公司(抵销)',	'河北省烟草公司(抵销)',	'省抵销');


-- Table: zj_session  SESSION表
DROP TABLE IF EXISTS zj_session CASCADE;
DROP SEQUENCE IF EXISTS zj_session_seq;	CREATE SEQUENCE zj_session_seq;
CREATE TABLE zj_session
(
	sid bigint NOT NULL DEFAULT nextval('zj_session_seq'),
	sessionid varchar(255) NOT NULL DEFAULT '',
	logintime timestamp NOT NULL DEFAULT now(),
	val text NOT NULL DEFAULT '',
	CONSTRAINT zj_session_pkey PRIMARY KEY (sid)
);
CREATE INDEX zj_session_sessionid ON zj_session(sessionid);
CREATE INDEX zj_session_logintime ON zj_session(logintime);

CREATE OR REPLACE FUNCTION zj_session_update(varchar, text) RETURNS boolean AS $body$
BEGIN
	UPDATE zj_session SET logintime=now(), val=$2 WHERE sessionid=$1;
	IF found THEN
		RETURN true;
	END IF;
	
	INSERT INTO zj_session(sessionid, val) VALUES ($1, $2);
	IF found THEN
		RETURN true;
	END IF;
	
	RETURN false;
END;
$body$ LANGUAGE 'plpgsql';


-- TABLE: zj_category  支出类别表
DROP TABLE IF EXISTS zj_category CASCADE;
DROP SEQUENCE IF EXISTS zj_category_seq;	CREATE SEQUENCE zj_category_seq;
CREATE TABLE zj_category
(
	cid smallint NOT NULL DEFAULT nextval('zj_category_seq'),
	ccode char(2) NOT NULL DEFAULT '-1',
	cname text NOT NULL DEFAULT '',
	bname varchar(64) NOT NULL DEFAULT '',
	odr smallint NOT NULL DEFAULT 0,
	CONSTRAINT zj_category_pkey PRIMARY KEY (cid)
);
INSERT INTO zj_category VALUES
(default,	'01','费用支出',		'费用',	default),
(default,	'02','工资支出',		'工资',	default),
(default,	'03','税金支出',		'税金',	default),
(default,	'04','货款支出',		'货款',	default),
(default,	'05','捐赠支出',		'捐赠',	default),
(default,	'06','物流建设支出',	'物流',	default),
(default,	'07','资本性支出',	'资本',	default),
(98,		'98','差错更正',		'差错',	default),
(99,		'99','其他支出',		'其他',	default);


-- TABLE: zj_paymode  付款方式表
DROP TABLE IF EXISTS zj_paymode CASCADE;
DROP SEQUENCE IF EXISTS zj_paymode_seq;	CREATE SEQUENCE zj_paymode_seq;
CREATE TABLE zj_paymode
(
	pid smallint NOT NULL DEFAULT nextval('zj_paymode_seq'),
	pcode char(2) NOT NULL DEFAULT '-1',
	pname text NOT NULL DEFAULT '',
	bname varchar(64) NOT NULL DEFAULT '',
	odr smallint NOT NULL DEFAULT 0,
	CONSTRAINT zj_paymode_pkey PRIMARY KEY (pid)
);
INSERT INTO zj_paymode VALUES
(default,	'01','现金结算',	'现金',	default),
(default,	'02','支票结算',	'支票',	default),
(default,	'03','托收承付',	'托收',	default),
(default,	'04','汇兑',		'汇兑',	default),
(default,	'05','委托收款',	'委托',	default),
(99,		'99','其他',		'其他',	default);


-- TABLE: zj_status 申请单状态表
DROP TABLE IF EXISTS zj_status;
DROP SEQUENCE IF EXISTS zj_status_seq;	CREATE SEQUENCE zj_status_seq;
CREATE TABLE zj_status
(
	sid smallint NOT NULL DEFAULT nextval('zj_status_seq'),
	scode char(2) NOT NULL DEFAULT '00',
	sname varchar(32) NOT NULL DEFAULT '',
	app_writable boolean NOT NULL DEFAULT false,
	rep_writable boolean NOT NULL DEFAULT false,
	color varchar(32) NOT NULL DEFAULT 'white',
	CONSTRAINT zj_status_pkey PRIMARY KEY (sid)
);
INSERT INTO zj_status VALUES
(default,	'01', '已保存', true, 	true, 	default),
(default,	'02', '已提交', false,	true, 	default),
(default,	'03', '审批中', false, 	true, 	default),
(default,	'04', '已批复', false, 	false, 	default),
(default,	'05', '已撤消', true, 	true, 	default),
(default,	'06', '已退回', true, 	true, 	default),
(default,	'07', '已作废', false, 	false, 	default);


-- TABLE: zj_application  申请单
DROP TABLE IF EXISTS zj_application CASCADE;
DROP SEQUENCE IF EXISTS zj_application_seq;		CREATE SEQUENCE zj_application_seq;
CREATE TABLE zj_application
(
	appid integer NOT NULL DEFAULT nextval('zj_application_seq'),
	corid smallint NOT NULL DEFAULT 0,
	cid smallint NOT NULL DEFAULT 0,
	app_money numeric(13,2) NOT NULL DEFAULT 0,
	summary text NOT NULL DEFAULT '',
	gathering_cor varchar(255) NOT NULL DEFAULT '',
	gathering_acc varchar(64) NOT NULL DEFAULT '',
	pid smallint NOT NULL DEFAULT 0,--zj_paymode表中id
	remark text NOT NULL DEFAULT '',
	ymd date NOT NULL DEFAULT now(),
	uid smallint NOT NULL DEFAULT 0,
	uptime timestamp(0) NOT NULL DEFAULT now(),
	
	reply text NOT NULL DEFAULT '',
	reply_ymd date NULL,
	reply_time timestamp(0) NULL,
	allow_money numeric(13,2) NOT NULL DEFAULT 0,
	replyerid smallint NOT NULL DEFAULT 0,
	leaderid smallint NOT NULL DEFAULT 0,
	
	sid smallint NOT NULL DEFAULT 0,--申请单状态id
	CONSTRAINT zj_application_pkey PRIMARY KEY (appid)
);
--	y smallint NOT NULL DEFAULT to_char(now(),'yyyy')::integer,
--	m smallint NOT NULL DEFAULT to_char(now(),'mm')::integer,
CREATE INDEX zj_application_cid 	ON zj_application (cid);
CREATE INDEX zj_application_corid 	ON zj_application (corid);
CREATE INDEX zj_application_ymd		ON zj_application (ymd);
CREATE INDEX zj_application_sid		ON zj_application (sid);

-- 提交或保存申请
CREATE OR REPLACE FUNCTION zj_application_update_submit(
	_appid integer,
	_corid integer,
	_cid integer,
	_app_money numeric,
	_summary text,
	_gathering_cor varchar,
	_gathering_acc varchar,
	_pid integer,
	_remark text,
	_ymd timestamp,
	_uid integer,
	_sid integer
) RETURNS integer AS $body$
DECLARE
	
BEGIN
--	SELECT INTO _corid corid FROM zj_user WHERE uid = _uid;
	UPDATE zj_application SET 
		corid			= _corid,
		cid				= _cid,
		app_money		= _app_money,
		summary			= _summary,
		gathering_cor	= _gathering_cor,
		gathering_acc	= _gathering_acc,
		pid				= _pid,
		remark			= _remark,
		ymd				= _ymd,
		uid				= _uid,
		uptime			= now(),
		sid				= _sid,
		reply			= ''
	WHERE appid = _appid;
	IF FOUND THEN
		RETURN _appid;
	END IF;
	
	INSERT INTO zj_application 
		( corid, cid, app_money, summary, gathering_cor, gathering_acc, pid, remark, ymd, uid, sid) VALUES
		(_corid,_cid,_app_money,_summary,_gathering_cor,_gathering_acc,_pid,_remark,_ymd,_uid,_sid);
	IF FOUND THEN
		RETURN currval('zj_application_seq');
	END IF;
	
	RETURN -4;
END;
$body$ LANGUAGE 'plpgsql';



-- 批复申请
CREATE OR REPLACE FUNCTION zj_application_update_reply(
	_appid integer,
	_reply text,
	_reply_ymd timestamp,
	_allow_money numeric,
	_replyerid integer,
	_sid integer
) RETURNS boolean AS $body$
DECLARE
	_cid		integer;
	_corid		integer;
BEGIN
	SELECT INTO _cid,_corid cid,corid FROM zj_application WHERE appid=_appid;
	INSERT INTO zj_payout (cid, summary, debit, corid, ymd, appid) VALUES (_cid, '批复申请', _allow_money, _corid, _reply_ymd, _appid);
--	EXECUTE 'SELECT currval(\'zj_payout_seq\')' INTO _payoutid;
--	SELECT INTO _payoutid currval('zj_payout_seq');
	UPDATE zj_application SET 
		reply			= _reply,
		reply_ymd		= _reply_ymd,
		reply_time		= now(),
		allow_money		= _allow_money,
		replyerid		= _replyerid,
		sid				= _sid
	WHERE appid = _appid;
	IF FOUND THEN
		RETURN true;
	ELSE
		RETURN false;
	END IF;
END;
$body$ LANGUAGE 'plpgsql';


-- 撤消或作废
CREATE OR REPLACE FUNCTION zj_application_update_repeal(
	_appid integer,
	_reply text,
	_reply_ymd timestamp,
	_replyerid integer,
	_sid integer
) RETURNS boolean AS $body$
BEGIN
	UPDATE zj_payout SET
		deleted=true,
		summary='撤消或作废申请'
	WHERE appid=_appid;
	UPDATE zj_application SET 
		reply			= _reply,
		reply_ymd		= _reply_ymd,
		reply_time		= now(),
		allow_money		= 0,
		replyerid		= _replyerid,
		sid				= _sid
	WHERE appid = _appid;
	IF FOUND THEN
		RETURN true;
	ELSE
		RETURN false;
	END IF;
END;
$body$ LANGUAGE 'plpgsql';



/*
CREATE OR REPLACE FUNCTION zj_application_select_byuid(
	_uid integer
) RETURNS refcursor AS $body$
DECLARE
    _cursor refcursor;
BEGIN
	OPEN _cursor FOR SELECT * FROM zj_application;
	RETURN _cursor;
END;
$body$ LANGUAGE 'plpgsql';


isok
CREATE OR REPLACE FUNCTION zj_application_selbycorid_throughuid(
	_uid integer
) RETURNS SETOF zj_application AS $body$
DECLARE
	rs record;
BEGIN
	FOR rs IN SELECT * FROM zj_application WHERE corid=(SELECT corid FROM zj_user WHERE uid=_uid) LOOP
		RETURN NEXT rs;
	END LOOP;
END;
$body$ LANGUAGE 'plpgsql';
*/

CREATE OR REPLACE VIEW vzj_app_usr_cat AS
	SELECT a.*, b.briefname, c.cname, d.sname
	FROM zj_application a
	LEFT JOIN zj_corporation b 	ON b.corid=a.corid
	LEFT JOIN zj_category c 	ON c.cid=a.cid
	LEFT JOIN zj_status d 		ON d.sid=a.sid;

CREATE OR REPLACE FUNCTION vzj_app_usr_cat_byuserid(
	_uid integer
) RETURNS SETOF vzj_app_usr_cat AS $body$
DECLARE
	_corid integer;
	_sql text;
	rs record;
BEGIN
	SELECT INTO _corid corid FROM zj_user WHERE uid=_uid;
	IF _corid<=0 THEN
		_sql := 'SELECT * FROM vzj_app_usr_cat ORDER BY appid';
	ELSE
		_sql := 'SELECT * FROM vzj_app_usr_cat WHERE corid=' || _corid || ' ORDER BY appid';
	END IF;
	FOR rs IN EXECUTE _sql LOOP
		RETURN NEXT rs;
	END LOOP;
END;
$body$ LANGUAGE 'plpgsql';


-- TABLE: zj_payout  支出明细表
DROP TABLE IF EXISTS zj_payout CASCADE;
DROP SEQUENCE IF EXISTS zj_payout_seq;
CREATE SEQUENCE zj_payout_seq;
CREATE TABLE zj_payout
(
	payoutid integer NOT NULL DEFAULT nextval('zj_payout_seq'),
	cid	smallint NOT NULL DEFAULT 0,
	summary text NOT NULL DEFAULT '',
	debit numeric(13,2) NOT NULL DEFAULT 0,
	credit numeric(13,2) NOT NULL DEFAULT 0,
	balance numeric(13,2) NOT NULL DEFAULT 0,
	corid smallint NOT NULL DEFAULT 0,
	ymd date NOT NULL DEFAULT now(),
	appid integer NOT NULL DEFAULT 0,
	deleted boolean NOT NULL DEFAULT false,
	CONSTRAINT zj_payout_pkey PRIMARY KEY (payoutid)
);
CREATE INDEX zj_payout_cid			ON zj_payout (cid);
CREATE INDEX zj_payout_corid		ON zj_payout (corid);
CREATE INDEX zj_payout_ymd 			ON zj_payout (ymd);
CREATE INDEX zj_payout_appid 		ON zj_payout (appid);
CREATE INDEX zj_payout_deleted 		ON zj_payout (deleted);


-- TABLE: zj_budget  预算数据表
DROP TABLE IF EXISTS zj_budget CASCADE;
DROP SEQUENCE IF EXISTS zj_budget_seq;
CREATE SEQUENCE zj_budget_seq;
CREATE TABLE zj_budget
(
	bgid integer NOT NULL DEFAULT nextval('zj_budget_seq'),
	corid smallint NOT NULL DEFAULT 0,
	cid	smallint NOT NULL DEFAULT 0,
	y smallint NOT NULL DEFAULT 0,
	m0 numeric(13,2) NOT NULL DEFAULT 0,
	m1 numeric(13,2) NOT NULL DEFAULT 0,
	m2 numeric(13,2) NOT NULL DEFAULT 0,
	m3 numeric(13,2) NOT NULL DEFAULT 0,
	m4 numeric(13,2) NOT NULL DEFAULT 0,
	m5 numeric(13,2) NOT NULL DEFAULT 0,
	m6 numeric(13,2) NOT NULL DEFAULT 0,
	m7 numeric(13,2) NOT NULL DEFAULT 0,
	m8 numeric(13,2) NOT NULL DEFAULT 0,
	m9 numeric(13,2) NOT NULL DEFAULT 0,
	m10 numeric(13,2) NOT NULL DEFAULT 0,
	m11 numeric(13,2) NOT NULL DEFAULT 0,
	m12 numeric(13,2) NOT NULL DEFAULT 0,
	remark text NOT NULL DEFAULT '',
	CONSTRAINT zj_budget_pkey PRIMARY KEY (bgid)
);
CREATE INDEX zj_budget_corid	ON zj_budget (corid);
CREATE INDEX zj_budget_cid		ON zj_budget (cid);
CREATE INDEX zj_budget_y		ON zj_budget (y);


CREATE OR REPLACE FUNCTION fzj_budget_init(
	_year integer
) RETURNS boolean AS $body$
DECLARE
	myrec record;
	_rs1 record;
	_rs2 record;
BEGIN
	SELECT INTO myrec bgid FROM zj_budget WHERE y=_year;
	IF FOUND THEN
		RETURN FALSE;
	END IF;
	FOR _rs1 IN SELECT corid FROM zj_corporation LOOP
		FOR _rs2 IN SELECT cid FROM zj_category LOOP
			INSERT INTO zj_budget(corid, cid, y) VALUES (_rs1.corid, _rs2.cid, _year);
		END LOOP;
	END LOOP;
	RETURN TRUE;
END;
$body$ LANGUAGE 'plpgsql';

select fzj_budget_init(2008);
select fzj_budget_init(2009);
select fzj_budget_init(2010);
select fzj_budget_init(2011);
select fzj_budget_init(2012);


CREATE OR REPLACE FUNCTION fzj_other_extra_info(
	_corid integer,
	_cid integer,
	_edate date,
	OUT ybudget numeric,
	OUT mbudget numeric,
	OUT ypayout numeric,
	OUT mpayout numeric,
	OUT allow numeric
) RETURNS RECORD AS $body$
DECLARE
	_sql text;
	_year integer;
	_month integer;
	rec record;
	_sy date;
	_ey date;
	_sdate date;
BEGIN
	SELECT INTO _year EXTRACT(YEAR from _edate);
	SELECT INTO _month EXTRACT(MONTH from _edate);
	_sy := DATE(_year || '-1-1');
	_ey := DATE(_year || '-12-31');
	_sdate := DATE(_year || '-' || _month || '-1');--DATE('2008-7-1');--
	
	SELECT INTO ybudget m0 FROM zj_budget WHERE corid=_corid AND cid=_cid AND y=_year;
	SELECT INTO allow, mpayout  SUM(debit), SUM(credit) FROM zj_payout WHERE corid=_corid AND cid=_cid AND ymd>=_sdate AND ymd<=_edate AND deleted=false;
	
	SELECT INTO rec * FROM zj_budget WHERE corid=_corid AND cid=_cid AND y=_year;
	IF _month = 1 THEN mbudget := rec.m1;
	ELSEIF _month = 2 THEN mbudget := rec.m2;
	ELSEIF _month = 3 THEN mbudget := rec.m3;
	ELSEIF _month = 4 THEN mbudget := rec.m4;
	ELSEIF _month = 5 THEN mbudget := rec.m5;
	ELSEIF _month = 6 THEN mbudget := rec.m6;
	ELSEIF _month = 7 THEN mbudget := rec.m7;
	ELSEIF _month = 8 THEN mbudget := rec.m8;
	ELSEIF _month = 9 THEN mbudget := rec.m9;
	ELSEIF _month = 10 THEN mbudget := rec.m10;
	ELSEIF _month = 11 THEN mbudget := rec.m11;
	ELSEIF _month = 12 THEN mbudget := rec.m12;
	END IF;
	
	SELECT INTO ypayout SUM(credit) FROM zj_payout WHERE corid=_corid AND cid=_cid AND ymd>=_sy AND ymd<=_ey AND deleted=false;
END
$body$ LANGUAGE 'plpgsql';

--select fzj_other_extra_info(0,1,'2008-7-31');









-- 以下为改动表




-- TABLE: zj_jiezhang  结账标识表
DROP TABLE IF EXISTS zj_jiezhang CASCADE;
DROP SEQUENCE IF EXISTS zj_jiezhang_seq;
CREATE SEQUENCE zj_jiezhang_seq;
CREATE TABLE zj_jiezhang
(
	jzid integer NOT NULL DEFAULT nextval('zj_jiezhang_seq'),
	corid smallint NOT NULL DEFAULT 0,
	y smallint NOT NULL DEFAULT 0,
	m smallint NOT NULL DEFAULT 0,
	jzed boolean NOT NULL DEFAULT false,		--是否已结账
	ymd date NOT NULL DEFAULT now(),
	CONSTRAINT zj_jiezhang_pkey PRIMARY KEY (jzid)
);
CREATE INDEX zj_jiezhang_corid	ON zj_jiezhang (corid);
CREATE INDEX zj_jiezhang_y		ON zj_jiezhang (y);
CREATE INDEX zj_jiezhang_m		ON zj_jiezhang (m);
CREATE INDEX zj_jiezhang_jzed	ON zj_jiezhang (jzed);

CREATE OR REPLACE FUNCTION fzj_jiezhang_update(
	_corid integer,
	_y integer,
	_m integer,
	_jzed boolean
) RETURNS boolean AS $body$
DECLARE
	_jzid integer;
BEGIN
	SELECT INTO _jzid jzid FROM zj_jiezhang WHERE corid=_corid AND y=_y AND m=_m;
	IF FOUND THEN
		UPDATE zj_jiezhang SET jzed = _jzed, ymd = now() WHERE jzid=_jzid;
	ELSE
		INSERT INTO zj_jiezhang(corid, y, m, jzed) VALUES (_corid, _y, _m, _jzed);
	END IF;
	RETURN true;
END;
$body$ LANGUAGE 'plpgsql';








DROP SCHEMA IF EXISTS article CASCADE; CREATE SCHEMA article;


-- TABLE: article.list 文章表
DROP TABLE IF EXISTS article.list CASCADE;
DROP SEQUENCE IF EXISTS article.list_seq;	CREATE SEQUENCE article.list_seq;
CREATE TABLE article.list
(
	artid integer NOT NULL default nextval('article.list_seq'),
	catid smallint NOT NULL default 0,
	art_number varchar(128),
	title varchar(255) NOT NULL default '',
	title_alias varchar(255) NOT NULL default '',
	author varchar(64) NOT NULL default '',
	uid smallint NOT NULL default 0,
	posttime timestamp NOT NULL DEFAULT now(),
	hidetitle boolean NOT NULL default false,
	published boolean NOT NULL default false,
	disp_content boolean NOT NULL default false,	--标题直接显示内容
	replyed boolean NOT NULL default true,			--是否可回复
	reply_num integer NOT NULL default 0,
	readlevel smallint NOT NULL default 0,
	counter integer NOT NULL default 0,
	content text NOT NULL default '',
	CONSTRAINT list_pkey PRIMARY KEY (artid)
);
CREATE INDEX list_catid 		ON article.list(catid);
CREATE INDEX list_art_number 	ON article.list(art_number);
CREATE INDEX list_title 		ON article.list(title);
CREATE INDEX list_author 		ON article.list(author);
CREATE INDEX list_uid 			ON article.list(uid);
CREATE INDEX list_hidetitle 	ON article.list(hidetitle);
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
	catid smallint NOT NULL default nextval('article.category_seq'),
	pid smallint NOT NULL default 0,
	cname varchar(255) NOT NULL default '',
	bname varchar(255) NOT NULL default '',
	isdir boolean NOT NULL default false,
	uid smallint NOT NULL default 0,
	pids varchar(255) NOT NULL default '0,',
	frequent boolean NOT NULL default false,
	odr smallint NOT NULL default 0,
	CONSTRAINT category_pkey PRIMARY KEY (catid)
);
CREATE INDEX category_pid 		ON article.category(pid);
CREATE INDEX category_uid		ON article.category(uid);
CREATE INDEX category_pids 		ON article.category(pids);
CREATE INDEX category_odr 		ON article.category(odr);

INSERT INTO article.category (pid, cname, isdir, pids, frequent) VALUES
(0,'全部类别',true,'',false),

(1,'',true,'1,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),
(2,'',false,'1,2,',false),

(1,'资金监管',true,'1,',false),
(10,'公告信息',false,'1,10,',true),
(10,'最新通知',false,'1,10,',true),
(10,'类别1',false,'1,10,',false),
(10,'类别2',false,'1,10,',false),
(10,'类别3',false,'1,10,',false),
(10,'类别4',false,'1,10,',false),
(10,'类别5',false,'1,10,',false),
(10,'类别6',false,'1,10,',false),
(10,'其他',false,'1,10,',false);




