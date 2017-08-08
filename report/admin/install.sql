# CREATE DATABASE IF NOT EXISTS `report` default charset utf8 COLLATE utf8_general_ci;
------------------------------------------------------------
	DROP TABLE IF EXISTS `r_readme`;
CREATE TABLE IF NOT EXISTS `r_readme` (
	`id` tinyint unsigned NOT NULL auto_increment,
	`key` varchar(255) default NULL,
	`value` text default NULL,
	PRIMARY KEY (`id`)
) TYPE=MyISAM;
------------------------------------------------------------
	DROP TABLE IF EXISTS `r_session`;
CREATE TABLE IF NOT EXISTS `r_session` (
	`sessionId` varchar(32) NOT NULL default '',
	`expiry` int unsigned NOT NULL default 0,
	`value` varchar(255) NOT NULL default '',
	PRIMARY KEY (`sessionid`),
	KEY (`expiry`)
) TYPE=HEAP;
-------------------------------------------------------------
	DROP TABLE IF EXISTS `r_cache`;
CREATE TABLE IF NOT EXISTS `r_cache` (
	`cid` varchar(32) NOT NULL default '',
	`value` text default NULL,
	`time` datetime default NULL,
	PRIMARY KEY (`cid`)
) TYPE=MyISAM;
-------------------------------------------------------------
	DROP TABLE IF EXISTS `r_sql`;
CREATE TABLE IF NOT EXISTS `r_sql` (
	`cid` varchar(32) NOT NULL default '',
	`value` text default NULL,
	`time` datetime default NULL,
	PRIMARY KEY (`cid`)
) TYPE=MyISAM;
-------------------------------------------------------------
	DROP TABLE IF EXISTS `r_tableName`;
CREATE TABLE IF EXISTS `r_tableName` (
	`id` smallint unsigned NOT NULL auto_increment,
	`cid` char(2) NOT NULL default '',
	`name` varchar(64) NOT NULL default '',
	`brief` varchar(32) NOT NULL default '',
	`remark` varchar(255) default NULL,
	PRIMARY KEY (`id`),
	KEY (`cid`)
) TYPE=MyISAM;
INSERT INTO `r_tableCategory` VALUES
(1,'fz','资产负债表','资债表',''),
(2,'sy','利润及利润分配表','损益表',''),
(3,'xj','现金流量表','现金表',''),
(4,'yj','应上交应弥补款项表','应交表',''),
(5,'qy','所有者权益增减变动表','损益表',''),
(6,'jz','资产减值准备投资固定资产情况表','减值表',''),
(7,'jq','基本情况表','基情表',''),
(8,'gz','工资清算表','工资表',''),
(9,'fy','三项费用明细表','费用表',''),
(10,'ls','实现利税情况表','利税表',''),
(11,'fx','财务分析指标表','分析表',''),
(12,'kb','财务快报表','快报表','');
--------------------------------------------------------------
	DROP TABLE IF EXISTS `r_itemCategory`;
CREATE TABLE IF NOT EXISTS `r_itemCategory` (
	`id` tinyint unsigned NOT NULL auto_increment,
	`cid` char(2) NOT NULL default '',
	`name` varchar(64) NOT NULL default '',
	`brief` varchar(32) NOT NULL default '',
	`remark` varchar(255) default NULL,
	PRIMARY KEY (`id`),
	KEY (`cid`)
)TYPE=MyISAM;
INSERT INTO `r_itemCategory` VALUES
(1,'zc','资产类指标','资产',''),
(2,'fz','负债类指标','负债',''),
(3,'qy','权益类指标','权益',''),
(4,'sy','损益类指标','损益',''),
(5,'jy','经营费用指标','经营',''),
(6,'gl','管理费用指标','管理',''),
(7,'cw','财务费用指标','财务',''),
(8,'ls','利税类指标','利税',''),
(9,'gz','工资类指标','工资',''),
(10,'jq','基本情况表指标','基本情况表',''),
(99,'qt','其他指标','其他','');
----------------------------------------------------------------
	DROP TABLE IF EXISTS `r_taskCategory`;
CREATE TABLE IF NOT EXISTS `r_taskCategory` (
	`id` tinyint NOT NULL auto_increment,
	`cid` char(2) NOT NULL default '',
	`name` varchar(64) NOT NULL default '',
	`brief` varchar(32) NOT NULL default '',
	`remark` varchar(255) default NULL,
	PRIMARY KEY (`id`),
	KEY (`cid`)
) TYPE=MyISAM;
INSERT INTO `r_taskCategory` VALUES
('1','nb','决算报表','年报',''),
('2','yb','月份报表','月报',''),
('3','kb','快报表','快报',''),
('4','ys','预算报表','预算',''),
('99','qt','其他报表','其他','');
----------------------------------------------------------------
	DROP TABLE IF EXISTS `r_task`;
CREATE TABLE IF NOT EXISTS `r_task` (
	`id` smallint unsigned NOT NULL auto_increment,
	`cid` varchar(32) NOT NULL default '',			//标识符
	`taskCategoryId` tinyint NOT NULL default 0,	//任务类别
	`year` year default NULL,						//任务年份
	`times` tinyint NOT NULL default 1,				//年填报次数
	`name` varchar(64) NOT NULL default '',			//名称
	`alias` varchar(255) NOT NULL default '',		//别名
	`relativeCid` varchar(255) NOT NULL default '',	//关联任务
	`remark` varchar(255) default NULL,				//备注
	PRIMARY KEY (`id`),
	KEY (`taskCategoryId`)
) TYPE=MyISAM;
------------------------------------------------------------------
	DROP TABLE IF EXISTS `r_taskTable`;
CREATE TABLE IF NOT EXISTS `r_taskTable` (
	`id` mediumint unsigned NOT NULL auto_increment,
	`taskId` smallint unsigned NOT NULL default 0,		//任务编号
	`tableNameId` smallint unsigned NOT NULL default 0,	//报表名称编号
	`number` varchar(32) default NULL,					//报表编号
	`unit` enum('元','十元','百元','千元','万元','十万元','百万元','千万元','亿元','十亿元','百亿元','千亿元','万亿元','兆元') NOT NULL default '元',	//金额单位
	`decimal` tinyint NOT NULL default 2,				//小数位数
	`cols` tinyint NOT NULL default 0,					//列数
	`rows` smallint NOT NULL default 0,					//行数
	PRIMARY KEY (`id`),
	KEY (`taskId`)
) TYPE=MyISAM;
---------------------------------------------------------------
	DROP TABLE IF EXISTS `r_tableItem`;
CREATE TABLE IF NOT EXISTS `r_tableItem` (
	`id` mediumint unsigned NOT NULL auto_increment,
	`taskTableId` mediumint unsigned NOT NULL default 0,
	`property` enum('hz','hd','vz','vd'),				//横表头组合栏 数据栏　纵表头组合栏 数据栏
	`colspan` tinyint NOT NULL default 1,
	`rowspan` tinyint NOT NULL default 1,
	`itemId` smallint unsigned default NULL,			//科目代码
	`name` varchar(64) default NULL,					//名称
	`order` smallint default NULL,						//行号　顺序号
	PRIMARY KEY (`id`),
	KEY (`taskTableId`),
	KEY (`order`)
) TYPE=MyISAM;
---------------------------------------------------------------
	DROP TABLE IF EXISTS `r_item`;
CREATE TABLE IF NOT EXISTS `r_item` (
	`id` smallint unsigned NOT NULL auto_increment,
	`itemCategoryId` tinyint unsigned NOT NULL default 0,
	`cid` char(6) NOT NULL default '',
	`py` varchar(32) default NULL,
	`name` varchar(64) default NULL,
	`alias` varchar(255) default NULL,
	`i_0` varchar(32) default NULL,
	`i_1` varchar(32) default NULL,
	PRIMARY KEY (`id`),
	KEY (`itemCategoryId`),
	KEY (`cid`),
	KEY (`py`),
	KEY (`name`)
) TYPE=MyISAM;
-------------------------------------------------------------
	DROP TABLE IF EXISTS `r_data`;
CREATE TABLE IF NOT EXISTS `r_data` (
	`id` int unsigned NOT NULL auto_increment,
	`taskId` smallint unsigned NOT NULL default 0,		//任务id
	`nTime` tinyint unsigned NOT NULL default 1,		//年第n次填报
	`nCol` tinyint NOT NULL default 1,					//第n个四列
	`subjectId` smallint unsigned NOT NULL default 0,	//科目id
	`corpId` tinyint unsigned NOT NULL default 0,		//单位id
	`d_0` float default NULL,
	`d_1` float default NULL,
	`d_2` float default NULL,
	`d_3` float default NULL,
	PRIMARY KEY (`id`),
	KEY (`taskId`),
	KEY (`nTime`),
	KEY (`subjectId`),
	KEY (`corpId`)
) TYPE=MyISAM;
---------------------------------------------------------------------
	DROP TABLE IF EXISTS `r_dataXml`;
CREATE TABLE IF NOT EXISTS `r_dataXml` (
	`id` int unsigned NOT NULL auto_increment,
	`xml` text default NULL,
	PRIMARY KEY (`id`)
) TYPE=MyISAM;
---------------------------------------------------------------------
	DROP TABLE IF EXISTS `r_corp`;
CREATE TABLE IF NOT EXISTS `r_corp` (
	`id` tinyint unsigned NOT NULL auto_increment,
	`cid` char(4) default NULL,
	`corpId` varchar(16) default NULL,
	`taxId` varchar(16) default NULL,
	`name` varchar(64) default NULL,
	`alias` varchar(64) default NULL,
	`brief` varchar(32) default NULL,
	`areaCode` char(6) default NULL,
	`address` varchar(64) default NULL,
	`postCode` char(6) default NULL,
	`telephone` varchar(16) default NULL,
	PRIMARY KEY (`id`),
	KEY (`cid`)
) TYPE=MyISAM;
INSERT INTO `r_corp` VALUES
(1,'0000','','','中国烟草总公司河北省公司(合并)','河北省烟草公司(合并)','全省合计','','','',''),
(2,'0100','','','河北省烟草公司石家庄市公司','石家庄市烟草公司','石家庄','','','',''),
(3,'0200','','','河北省烟草公司唐山市公司','唐山市烟草公司','唐山','','','',''),
(4,'0300','','','河北省烟草公司秦皇岛市公司','秦皇岛市烟草公司','秦皇岛','','','',''),
(5,'0400','','','河北省烟草公司邯郸市公司','邯郸市烟草公司','邯郸','','','',''),
(6,'0500','','','河北省烟草公司邢台市公司','邢台市烟草公司','邢台','','','',''),
(7,'0600','','','河北省烟草公司保定市公司','保定市烟草公司','保定','','','',''),
(8,'0700','','','河北省烟草公司张家口市公司','张家口市烟草公司','张家口','','','',''),
(9,'0800','','','河北省烟草公司承德市公司','承德市烟草公司','承德','','','',''),
(10,'0900','','','河北省烟草公司沧州市公司','沧州市烟草公司','沧州','','','',''),
(11,'1000','','','河北省烟草公司廊坊市公司','廊坊市烟草公司','廊坊','','','',''),
(12,'1100','','','河北省烟草公司衡水市公司','衡水市烟草公司','衡水','','','',''),
(13,'1200','','','中国烟草公司河北省公司','河北省烟草公司','省公司','','','','');

---------------------------------------------------------------------
	DROP TABLE IF EXISTS `r_expressions`;
CREATE TABLE IF NOT EXISTS `r_expressions` (
	`id` mediumint unsigned NOT NULL auto_increment,
	`taskId` smallint unsigned NOT NULL default 0,		//任务编号
	`tableNameId` smallint unsigned NOT NULL default 0,	//报表名称编号
	`isPrivate` enum('y','n') default 'n',				//是否为表内公式
	`isPublic` enum('y','n') default 'n',				//是否为表间公式
	`isAudit` enum('y','n') default 'n',				//是否为审核公式
	`isOperate` enum('y','n') default 'n',				//是否为运算公式
	`expressions` varchar(255) default NULL,			//公式内容
	PRIMARY KEY (`id`),
	KEY (`taskId`)
) TYPE=MyISAM;






