
-- TABLE: session 表
DROP TABLE IF EXISTS public.session CASCADE;
DROP SEQUENCE IF EXISTS public.session_seq;	CREATE SEQUENCE public.session_seq;
CREATE TABLE public.session (
	sid bigint NOT NULL DEFAULT nextval('public.session_seq'),
	sessionid varchar(255) NOT NULL DEFAULT '',
	uid smallint NOT NULL DEFAULT 0,
	ip inet NOT NULL DEFAULT '127.0.0.1',
	login_time timestamp NOT NULL DEFAULT now(),
	val text NOT NULL DEFAULT '',
	CONSTRAINT session_pkey PRIMARY KEY (sid)
);
CREATE INDEX session_sessionid	ON public.session(sessionid);
CREATE INDEX session_login_time	ON public.session(login_time);


DELETE FROM description WHERE tname='session';
INSERT INTO description (tname, fname, cname, ftype) VALUES
('session', 'sid', 		'SESSION表自增序列', 'bigint'),
('session', 'sessionid', '用户SESSION ID', 'varchar(255)'),
('session', 'uid', 		'用户id', 'smallint'),
('session', 'ip', 		'用户ip', 'inet'),
('session', 'login_time', '最近登录时间', 'timestamp'),
('session', 'val', 		'SESSION值', 'text');


CREATE OR REPLACE FUNCTION public.session_update(
	_sessionid varchar,
	_val text
) RETURNS boolean AS $body$
BEGIN
	UPDATE public.session SET login_time=now(), val=_val WHERE sessionid=_sessionid;
	IF found THEN
		RETURN TRUE;
	END IF;
	
	INSERT INTO public.session(sessionid, val) VALUES ($1, $2);
	IF found THEN
		RETURN TRUE;
	END IF;
	
	RETURN FALSE;
END;
$body$ LANGUAGE 'plpgsql';


