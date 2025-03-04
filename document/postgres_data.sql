-- Adminer 4.8.1 PostgreSQL 16.2 (Debian 16.2-1.pgdg120+2) dump

DROP TABLE IF EXISTS "device";
DROP SEQUENCE IF EXISTS device_device_id_seq;
CREATE SEQUENCE device_device_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device" (
    "device_id" integer DEFAULT nextval('device_device_id_seq') NOT NULL,
    "device_name" character varying(127) DEFAULT '' NOT NULL,
    "place_name" character varying(127) DEFAULT '' NOT NULL,
    "device_alias_name" character varying(127) DEFAULT '' NOT NULL,
    "device_type_id" integer,
    "device_type_category_id" integer,
    "device_connection_id" integer,
    "domain_id" integer,
    "address" character varying(255) DEFAULT '' NOT NULL,
    "lat" numeric(10,8),
    "lng" numeric(11,8),
    "is_online" boolean DEFAULT false NOT NULL,
    "output_power_capacity" double precision,
    "bat_capacity" double precision,
    "solar_capacity" double precision,
    "solar_area" double precision,
    "solar_eff" double precision,
    "device_state" character varying(31) DEFAULT '' NOT NULL,
    "error_code" character varying(63) DEFAULT '' NOT NULL,
    "error_description" text DEFAULT '' NOT NULL,
    "last_data" text DEFAULT '' NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "extra" text DEFAULT '' NOT NULL,
    "install_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "last_connect_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "device_pkey" PRIMARY KEY ("device_id")
) WITH (oids = false);

INSERT INTO "device" ("device_id", "device_name", "place_name", "device_alias_name", "device_type_id", "device_type_category_id", "device_connection_id", "domain_id", "address", "lat", "lng", "is_online", "output_power_capacity", "bat_capacity", "solar_capacity", "solar_area", "solar_eff", "device_state", "error_code", "error_description", "last_data", "enabled", "extra", "install_time", "create_time", "last_connect_time") VALUES
(129,	'AA-70-2209-01-0079-377',	'',	'會展中心377',	6,	1,	56,	191,	'台南市歸仁區歸仁十二路3號',	22.92122346,	120.28517604,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:17:56.606',	'2024-09-26 02:20:07.70178',	'2024-10-04 14:44:41.117'),
(125,	'SP000001',	'',	'SmartPanel-01',	2,	4,	55,	179,	'',	13.74942632,	100.51750481,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-24 10:50:04.684',	'2024-09-24 02:50:43.162853',	'2024-10-04 14:44:27.631'),
(123,	'PV000001',	'',	'PVTest01',	8,	2,	NULL,	158,	'',	22.98648624,	120.20763874,	'f',	NULL,	NULL,	100,	2000,	0.226,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-03 16:49:28.171',	'2024-09-03 08:51:10.840135',	'2024-09-03 08:51:10.840135'),
(87,	'AA-70-2211-01-0217-874',	'',	'K館874',	6,	1,	41,	123,	'',	22.92122841,	120.28976798,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-06-26 14:11:02.15',	'2024-06-26 06:12:15.738575',	'2024-10-04 14:44:39.739'),
(108,	'SM000005',	'',	'SmartMeter-05',	9,	3,	46,	176,	'',	25.08212994,	121.56451464,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-08-19 16:21:51.509',	'2024-08-19 08:22:11.15545',	'2024-10-04 14:44:59.713'),
(127,	'PV0001',	'',	'茂迪PV-01',	8,	2,	NULL,	185,	'',	22.92121358,	120.28968215,	'f',	NULL,	NULL,	12,	NULL,	NULL,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-25 18:26:53.541',	'2024-09-25 10:27:49.967244',	'2024-09-25 10:27:49.967244'),
(124,	'SP000001',	'',	'SmartPanel-Hermes-01',	2,	4,	54,	175,	'',	25.08217852,	121.56453609,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-18 16:09:20.385',	'2024-09-18 08:14:14.152151',	'2024-10-04 14:44:27.697'),
(131,	'AA-70-2211-01-0217-874',	'',	'K館874',	6,	1,	56,	187,	'',	22.92121358,	120.28963387,	't',	11.5,	18.5,	4,	18,	0.2286,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:21:31.977',	'2024-09-26 02:22:31.279434',	'2024-10-04 14:44:41.119'),
(128,	'AA-70-2212-01-0076-613',	'',	'會展中心613',	6,	1,	56,	191,	'台南市歸仁區歸仁十二路3號',	22.92122346,	120.28517604,	't',	11.5,	18.5,	4.5,	18.4972,	0.2,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:13:54.396',	'2024-09-26 02:17:54.485812',	'2024-10-04 14:44:41.122'),
(137,	'PCS001',	'',	'碩天PCS-01',	6,	1,	NULL,	187,	'',	22.92121358,	120.28963387,	'f',	6,	NULL,	3,	13.875,	0.2286,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-26 12:27:58.576',	'2024-09-26 04:28:58.752591',	'2024-09-26 04:28:58.752591'),
(144,	'SM000005',	'',	'SmartMeter-05',	9,	3,	57,	195,	'',	25.08214937,	121.56452000,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-10-01 10:49:08.961',	'2024-10-01 02:49:24.381742',	'2024-10-04 14:44:59.728'),
(104,	'SM000001',	'',	'SmartMeter-01',	9,	3,	46,	148,	'',	25.08211050,	121.56453609,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	't',	'',	'2024-08-19 02:55:13.877',	'2024-08-19 02:55:13.877167',	'2024-10-04 14:44:59.612'),
(88,	'AA-70-2212-01-0028-070',	'',	'K館070',	6,	1,	41,	123,	'',	22.92122841,	120.28976798,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-06-26 14:12:19.483',	'2024-06-26 06:12:59.677251',	'2024-10-04 14:44:39.756'),
(83,	'AA-70-2212-01-0076-613',	'',	'會展中心613',	6,	1,	41,	131,	'台南市歸仁區歸仁十二路3號',	22.92128275,	120.28529406,	't',	11.5,	18.5,	4.5,	18.4972,	0.2,	'running',	'',	'',	'',	'f',	'',	'2024-06-19 10:53:28.066',	'2024-06-19 03:02:31.590056',	'2024-10-04 14:44:39.742'),
(86,	'AA-70-2211-01-0078-938',	'',	'K館938',	6,	1,	41,	123,	'',	22.92122841,	120.28976798,	't',	11.5,	18.5,	22.5,	100,	0.2286,	'running',	'',	'',	'',	'f',	'',	'2024-06-26 14:08:26.706',	'2024-06-26 06:10:46.670001',	'2024-10-04 14:44:39.759'),
(138,	'PCS002',	'',	'碩天PCS-02',	6,	1,	NULL,	187,	'',	22.92121358,	120.28963387,	'f',	6,	NULL,	3,	13.875,	0.2286,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-26 12:29:05.542',	'2024-09-26 04:29:33.81778',	'2024-09-26 04:29:33.81778'),
(139,	'PCS003',	'',	'碩天PCS-03',	6,	1,	NULL,	187,	'',	22.92121358,	120.28963387,	'f',	6,	NULL,	2,	9.25,	0.2286,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-26 12:49:55.346',	'2024-09-26 04:51:08.933635',	'2024-09-26 04:51:08.933635'),
(92,	'AA-70-2212-01-0098-848',	'',	'台南工研院848',	6,	1,	41,	154,	'台南市歸仁區高發二路360號',	22.92079855,	120.29152751,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-07-03 18:49:14.304',	'2024-07-03 10:49:46.490026',	'2024-10-04 14:44:39.745'),
(91,	'AA-70-2201-01-0103-299',	'',	'台南工研院299',	6,	1,	41,	154,	'台南市歸仁區高發二路360號',	22.92079855,	120.29152751,	't',	11.5,	18.5,	4.5,	18.4972,	0.22,	'running',	'',	'',	'',	'f',	'',	'2024-07-03 18:47:58.187',	'2024-07-03 10:49:09.018597',	'2024-10-04 14:44:39.748'),
(94,	'AA-70-2204-01-0014-576',	'',	'辦公室576',	6,	1,	41,	130,	'',	23.03030308,	120.24390221,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-07-03 18:50:50.156',	'2024-07-03 10:51:22.351513',	'2024-10-04 14:44:39.752'),
(132,	'AA-70-2212-01-0028-070',	'',	'K館070',	6,	1,	56,	187,	'',	22.92121358,	120.28963387,	't',	11.5,	18.5,	5,	22.5,	0.2286,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:22:32.914',	'2024-09-26 02:23:18.872765',	'2024-10-04 14:44:41.108'),
(126,	'PV000001',	'',	'碩天PCS',	8,	2,	NULL,	181,	'',	22.92122346,	120.28971970,	'f',	NULL,	NULL,	6,	NULL,	NULL,	'unknow',	'',	'',	'',	'f',	'',	'2024-09-25 17:08:42.373',	'2024-09-25 09:09:11.57741',	'2024-09-25 09:09:11.57741'),
(133,	'AA-70-2201-01-0103-299',	'',	'台南工研院299',	6,	1,	56,	189,	'台南市歸仁區高發二路360號',	22.92081831,	120.29149532,	't',	11.5,	18.5,	4.5,	18.4972,	0.22,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:23:20.894',	'2024-09-26 02:24:38.86149',	'2024-10-04 14:44:41.112'),
(120,	'ESS000001',	'',	'ESSTest01',	10,	1,	49,	152,	'',	25.03432210,	121.56421959,	't',	11.5,	18.5,	22.5,	200,	0.216,	'unknow',	'E2007',	'電池欠壓，電池電壓低於正常工作範圍',	'',	'f',	'',	'2024-09-03 15:23:55.831',	'2024-09-03 08:05:14.641107',	'2024-10-04 14:44:22.897'),
(134,	'AA-70-2212-01-0098-848',	'',	'台南工研院848',	6,	1,	56,	189,	'台南市歸仁區高發二路360號',	22.92081831,	120.29149532,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:24:40.928',	'2024-09-26 02:25:52.11534',	'2024-10-04 14:44:41.124'),
(141,	'SM000002',	'',	'SmartMeter-02',	9,	3,	57,	194,	'',	25.08213479,	121.56450391,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-10-01 10:33:40.339',	'2024-10-01 02:34:05.482289',	'2024-10-04 14:44:59.623'),
(130,	'AA-70-2211-01-0078-938',	'',	'K館938',	6,	1,	56,	187,	'',	22.92121358,	120.28963387,	't',	11.5,	18.5,	5,	22.5,	0.2286,	'running',	'',	'',	'',	'f',	'',	'2024-09-26 10:20:19.703',	'2024-09-26 02:21:29.840947',	'2024-10-04 14:44:41.114'),
(105,	'SM000002',	'',	'SmartMeter-02',	9,	3,	46,	148,	'',	25.08212994,	121.56451464,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-08-19 15:58:42.622',	'2024-08-19 07:59:39.290837',	'2024-10-04 14:44:59.633'),
(142,	'SM000003',	'',	'SmartMeter-03',	9,	3,	57,	194,	'',	25.08213479,	121.56450391,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-10-01 10:48:26.7',	'2024-10-01 02:48:50.778701',	'2024-10-04 14:44:59.644'),
(140,	'SM000001',	'',	'SmartMeter-01',	9,	3,	57,	194,	'',	25.08213479,	121.56450391,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-10-01 10:32:08.193',	'2024-10-01 02:33:22.944602',	'2024-10-04 14:44:59.602'),
(106,	'SM000003',	'',	'SmartMeter-03',	9,	3,	46,	148,	'',	25.08212994,	121.56451464,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-08-19 16:21:03.341',	'2024-08-19 08:21:28.016781',	'2024-10-04 14:44:59.652'),
(143,	'SM000004',	'',	'SmartMeter-04',	9,	3,	57,	195,	'',	25.08214937,	121.56452000,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-10-01 10:48:52.619',	'2024-10-01 02:49:07.808339',	'2024-10-04 14:44:59.663'),
(107,	'SM000004',	'',	'SmartMeter-04',	9,	3,	46,	176,	'',	25.08212994,	121.56451464,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-08-19 16:21:29.728',	'2024-08-19 08:21:49.893979',	'2024-10-04 14:44:59.671'),
(117,	'ESS000001',	'',	'Hermes-ESS000001',	10,	1,	50,	126,	'',	25.08211050,	121.56453609,	't',	NULL,	NULL,	NULL,	NULL,	NULL,	'unknow',	'E2007',	'電池欠壓，電池電壓低於正常工作範圍',	'',	'f',	'',	'2024-08-30 14:51:41.778',	'2024-08-30 06:53:58.155539',	'2024-10-04 14:44:22.903'),
(93,	'AA-70-2201-01-0093-915',	'',	'辦公室915',	6,	1,	41,	130,	'',	23.03030308,	120.24390221,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-07-03 18:49:53.756',	'2024-07-03 10:50:31.018881',	'2024-10-04 14:44:39.727'),
(85,	'AA-70-2209-01-0079-377',	'',	'會展中心377',	6,	1,	41,	131,	'台南市歸仁區歸仁十二路3號',	22.92128275,	120.28529406,	't',	11.5,	18.5,	NULL,	NULL,	NULL,	'running',	'',	'',	'',	'f',	'',	'2024-06-19 11:06:34.033',	'2024-06-19 03:07:25.917051',	'2024-10-04 14:44:39.735');

DROP TABLE IF EXISTS "device_connection";
DROP SEQUENCE IF EXISTS device_connection_device_connection_id_seq;
CREATE SEQUENCE device_connection_device_connection_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_connection" (
    "device_connection_id" integer DEFAULT nextval('device_connection_device_connection_id_seq') NOT NULL,
    "device_connection_name" character varying(127) DEFAULT '' NOT NULL,
    "device_connection_type" character varying(127) DEFAULT '' NOT NULL,
    "organization_id" integer,
    "device_type_id" integer,
    "url" text,
    "host" character varying(255),
    "port" integer,
    "username" character varying(127),
    "password" character varying(127),
    "token" character varying(255),
    "org" character varying(127),
    "database_name" character varying(63),
    "enabled" boolean DEFAULT true NOT NULL,
    "extra" text DEFAULT '' NOT NULL,
    CONSTRAINT "device_connection_pkey" PRIMARY KEY ("device_connection_id")
) WITH (oids = false);

INSERT INTO "device_connection" ("device_connection_id", "device_connection_name", "device_connection_type", "organization_id", "device_type_id", "url", "host", "port", "username", "password", "token", "org", "database_name", "enabled", "extra") VALUES
(41,	'ESS-http-01',	'',	118,	6,	NULL,	NULL,	NULL,	'bomb054@gmail.com',	'Abcd1234',	NULL,	NULL,	NULL,	't',	''),
(43,	'PV-test-01',	'',	118,	8,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(45,	'PV-test-01',	'',	149,	8,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(46,	'dy-smartmeter',	'',	118,	9,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(47,	'SmartMeter-01',	'',	149,	9,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(50,	'ESS-hermes',	'',	118,	10,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(48,	'ESS-http-01',	'',	149,	6,	NULL,	NULL,	NULL,	'bomb054@gmail.com',	'Abcd1234',	NULL,	NULL,	NULL,	't',	''),
(51,	'PV-TestA',	'',	159,	8,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(52,	'ESS-TestB',	'',	160,	10,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(53,	'ESS-TestA',	'',	159,	10,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(49,	'ESS-hermes-01',	'',	149,	10,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(54,	'SmartPanel-Hermes',	'',	149,	2,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(55,	'SmartMeter-hermes',	'',	118,	2,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	''),
(56,	'ESS-http-01',	'',	182,	6,	NULL,	NULL,	NULL,	'bomb054@gmail.com',	'Abcd1234',	NULL,	NULL,	NULL,	't',	''),
(57,	'dev-smartmeter',	'',	167,	9,	NULL,	'192.168.1.9',	1883,	'wilson',	'wilsonpw',	NULL,	NULL,	NULL,	't',	'');

DROP TABLE IF EXISTS "device_handler";
DROP SEQUENCE IF EXISTS device_handler_device_handler_id_seq;
CREATE SEQUENCE device_handler_device_handler_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_handler" (
    "device_handler_id" integer DEFAULT nextval('device_handler_device_handler_id_seq') NOT NULL,
    "device_handler_name" character varying(127) DEFAULT '' NOT NULL,
    "organization_id" integer,
    "device_type_id" integer,
    "device_input_id" integer,
    "device_output_id" integer,
    CONSTRAINT "device_handler_pkey" PRIMARY KEY ("device_handler_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "device_input";
DROP SEQUENCE IF EXISTS device_input_device_input_id_seq;
CREATE SEQUENCE device_input_device_input_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_input" (
    "device_input_id" integer DEFAULT nextval('device_input_device_input_id_seq') NOT NULL,
    "device_input_name" character varying(127) DEFAULT '' NOT NULL,
    "device_type_id" integer,
    "input_type" character varying(63) DEFAULT '' NOT NULL,
    "method" character varying(63),
    "path" text,
    "query" text,
    "data_type" character varying(31) DEFAULT 'json' NOT NULL,
    "data" text,
    "autorun" boolean DEFAULT false NOT NULL,
    "run_every_second" integer DEFAULT '0',
    "run_order" integer DEFAULT '0',
    "response_output_id" integer,
    CONSTRAINT "device_input_pkey" PRIMARY KEY ("device_input_id")
) WITH (oids = false);

INSERT INTO "device_input" ("device_input_id", "device_input_name", "device_type_id", "input_type", "method", "path", "query", "data_type", "data", "autorun", "run_every_second", "run_order", "response_output_id") VALUES
(1,	'SwitchMode',	8,	'mqtt',	NULL,	'/HERMES/${device.device_name}/control',	'{
  "command": "SwitchMode",
  "parameters": {
    "mode": "Protection"
  }
}',	'json',	'',	'f',	0,	0,	NULL),
(3,	'pomcube_login',	6,	'http',	'post',	'/login',	'{
  "email": _connection.username,
  "password: _connection.password
}',	'json',	NULL,	't',	300,	0,	5),
(4,	'pomcube_get_devices',	6,	'http',	'get',	'/devices',	'{
  "NS_pageInde":"1",
  "NS_pageSize":"20"
}',	'json',	NULL,	't',	60,	1,	6),
(5,	'pomcube_get_real',	6,	'http',	'get',	'/realData',	'{deviceId: _connection_keep?.deviceids?.find(x=>x.NS_DeviceSn==_flow.device_name).NS_Id}',	'json',	NULL,	't',	60,	2,	7),
(6,	'pomcube_bat_power',	6,	'',	NULL,	NULL,	NULL,	'json',	NULL,	'f',	0,	0,	NULL);

DROP TABLE IF EXISTS "device_output";
DROP SEQUENCE IF EXISTS device_output_device_output_id_seq;
CREATE SEQUENCE device_output_device_output_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_output" (
    "device_output_id" integer DEFAULT nextval('device_output_device_output_id_seq') NOT NULL,
    "device_output_name" character varying(127) DEFAULT '' NOT NULL,
    "device_type_id" integer,
    "output_type" character varying(63) DEFAULT '' NOT NULL,
    "path" text,
    "data_type" character varying(31) DEFAULT 'json' NOT NULL,
    "device_state_field" text,
    "device_error_code_field" text,
    "device_error_description_field" text,
    "is_store" boolean DEFAULT false NOT NULL,
    "store_tags" text,
    "store_fields" text,
    "data_schema" text,
    "properties" text,
    CONSTRAINT "device_output_pkey" PRIMARY KEY ("device_output_id")
) WITH (oids = false);

INSERT INTO "device_output" ("device_output_id", "device_output_name", "device_type_id", "output_type", "path", "data_type", "device_state_field", "device_error_code_field", "device_error_description_field", "is_store", "store_tags", "store_fields", "data_schema", "properties") VALUES
(7,	'pomcube_get_real',	6,	'http',	'/realData',	'json',	NULL,	NULL,	NULL,	't',	'{
  "DeviceName": _flow.device_name,
  "device_apiname": _connection_keep?.deviceids?.find(x=>x.NS_DeviceSn)?.NS_Id
}',	'{
  "SolarPower": NS_data.NS_SolarPower,
  "GenPower": NS_data?.NS_GenPower,
  "LoadPower": NS_data?.NS_LoadPower,
  "GridPower": NS_data?.NS_GridPower,
  "BatSoC": NS_data?.NS_Battery?.NS_SOC/10,
  "EnvTemp1": NS_data?.NS_Battery?.NS_MinCellTemp/10,
  "EnvTemp2": NS_data?.NS_Battery?.NS_MaxCellTemp/10,
  "BatCurr": NS_data?.NS_Battery?.NS_TotalCurr/100,
  "BatVolt": NS_data?.NS_Battery?.NS_TotalVolt/100
}',	'{
  "type": "object",
  "properties": {
    "device_name": {"type": "string"},
    "device_apiname": {"type": "string"},
    "SolarPower": {"type": "number"},
    "GenPower": {"type": "number"},
    "LoadPower": {"type": "number"},
    "GridPower": {"type": "number"},
    "BatSoC": {"type": "number"},
    "EnvTemp1": {"type": "number"},
    "EnvTemp2": {"type": "number"},
    "BatCurr": {"type": "number"},
    "BatVolt": {"type": "number"}
  },
  "required": [
    "device_name",
    "device_apiname"
  ]
}
',	NULL),
(6,	'pomcube_get_devices',	6,	'http',	'/devices',	'json',	NULL,	NULL,	NULL,	'f',	NULL,	'{
  "_connection_keep": {
    "deviceids": NS_data?.NS_list?.map(x=>{"NS_DeviceSn":x.NS_DeviceSn,"NS_Id":x.NS_Id})
  }
}',	NULL,	NULL),
(5,	'pomcube_login',	6,	'http',	NULL,	'json',	NULL,	NULL,	NULL,	'f',	NULL,	'{
  "_connection_keep": {
    "token": NS_token
  }
}',	NULL,	NULL),
(8,	'pomcube_get_statistics',	6,	'http',	'/statistics',	'json',	NULL,	NULL,	NULL,	't',	'{
  "DeviceName": _flow.device_name,
  "device_apiname": _connection_keep?.deviceids?.find(x=>x.NS_DeviceSn)?.NS_Id
}',	'{
  "GridEnergy": NS_data?.NS_GridFromTotal/1000,
  "LoadEnergy": NS_data?.NS_LoadToTotal/1000,
  "SolarEnergy": NS_data?.NS_PVTotal/1000,
  "GenEnergy": NS_data?.NS_GeneratorFromTotal/1000,
  "BatEnergy": NS_data?.NS_BatteryFromTotal/1000
}',	'{
  "type": "object",
  "properties": {
    "device_name": {"type": "string"},
    "device_apiname": {"type": "string"},
    "GridEnergy": {"type": "number"},
    "LoadEnergy": {"type": "number"},
    "SolarEnergy": {"type": "number"},
    "BatEnergy": {"type": "number"},
    "GenEnergy": {"type": "number"}
  },
  "required": [
    "device_name",
    "device_apiname"
  ]
}
',	NULL),
(10,	'hermes_today_power_value',	10,	'mqtt',	'/HERMES/+/ESS/+/today-power-value',	'json',	NULL,	NULL,	NULL,	't',	'{
  "DeviceName": _mqtt_topic
}',	'{
  "自發自用": 自發自用,
  "削峰填谷": 削峰填谷,
  "市電購電": 市電購電,
  "RevenueToday": 自發自用 + 削峰填谷 - 市電購電
}',	'{
  "type": "object",
  "properties": {
    "自發自用": {"type": "number"},
    "削峰填谷": {"type": "number"},
    "市電購電": {"type": "number"},
    "RevenueToday": {"type": "number"}
  }
}',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "_mqtt_topic"
  },
  "自發自用": {},
  "削峰填谷": {},
  "市電購電": {},
  "RevenueToday": {"src": "自發自用 + 削峰填谷 - 市電購電"}
}'),
(9,	'hermes_smartmeter_data',	9,	'mqtt',	'/HERMES/+/SMARTMETER/',	'json',	'(device_state!=null)?device_state:((Status=="Operational" || Status=="Standby" || Status=="Power Saving")?"running":"error")',	NULL,	NULL,	't',	'{
  "DeviceName": SmartMeter_ID,
  "Type": Type,
  "Status": Status
}',	'{
  "Power": Power,
  "Energy": Energy,
  "Timestamp": Timestamp
}',	'{
  "type": "object",
  "properties": {
    "SmartMeter_ID": {
      "type": "string"
    },
    "Type": {
      "type": "string"
    },
    "Status": {
      "type": "string"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "Power": {"type": "number"},
    "Energy": {"type": "number"}
  },
  "required": ["SmartMeter_ID"]
}',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "SmartMeter_ID"
  },
  "Type": {
    "tag": true,
    "type": "string"
  },
  "Status": {
    "type": "string"
  },
  "Power": {},
  "Energy": {}
}'),
(1,	'hermes_event',	10,	'mqtt',	'/HERMES/+/ESS/+/error',	'json',	NULL,	'ErrorCode',	'ErrorDescription',	't',	'{
  "DeviceName": ESS_ID,
  "DeviceType": "ess_hermes"
}',	'{
  "ErrorCode": ErrorCode,
  "ErrorDescription": ErrorDescription
}',	'{
  "type": "object",
  "properties": {
    "ESS_ID": {
      "type": "string"
    },
    "DeviceType": {
      "type": "string"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "ErrorCode": {
      "type": "string"
    },
    "ErrorDescription": {
      "type": "string"
    }
  },
  "required": ["ESS_ID"]
}',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "ESS_ID"
  },
  "DeviceType": {
    "type": "string"
  },
  "ErrorCode": {
    "type": "string"
  },
  "ErrorDescription": {
    "type": "string"
  }
}'),
(2,	'pomcube_data',	6,	'mqtt',	'/pomcube/k3/1/report',	'json',	NULL,	NULL,	NULL,	't',	'{
  "place_name": device_order,
  "DeviceName": device_sn,
  "device_apiname": device_name
}',	'{
  "GridEnergy": GridFromTotal/1000,
  "LoadEnergy": LoadToTotal/1000,
  "SolarEnergy": PVTotal/1000,
  "GenEnergy": GeneratorFromTotal/1000,
  "BatEnergy": BatteryFromTotal/1000,
  "SolarPower": SolarPower,
  "GenPower": GenPower,
  "LoadPower": LoadPower,
  "GridPower": GridPower,
  "BatSoC": SOC/10,
  "EnvTemp1": MinCellTemp/10,
  "EnvTemp2": MaxCellTemp/10,
  "BatCurr": TotalCurr/100,
  "BatVolt": TotalVolt/100
}',	'{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "device_name": {"type": "string"},
      "device_sn": {"type": "string"},
      "place_name": {"type": "integer"},
      "device_apiname": {"type": "string"},
      "GridEnergy": {"type": "number"},
      "LoadEnergy": {"type": "number"},
      "SolarEnergy": {"type": "number"},
      "BatEnergy": {"type": "number"},
      "GenEnergy": {"type": "number"},
      "SolarPower": {"type": "number"},
      "GenPower": {"type": "number"},
      "LoadPower": {"type": "number"},
      "GridPower": {"type": "number"},
      "BatSoC": {"type": "number"},
      "EnvTemp1": {"type": "number"},
      "EnvTemp2": {"type": "number"},
      "BatCurr": {"type": "number"},
      "BatVolt": {"type": "number"}
    },
    "required": [
      "device_name",
      "device_sn",
      "place_name"
    ]
  }
}',	'{
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "device_sn"
  },
  "PlaceName": {"type": "string"},
  "GridEnergy": {"src": "GridFromTotal/1000"},
  "LoadEnergy": {"src": "LoadToTotal/1000"},
  "SolarEnergy": {"src": "PVTotal/1000"},
  "BatEnergy": {"src": "GeneratorFromTotal/1000"},
  "GenEnergy": {"src": "BatteryFromTotal/1000"},
  "SolarPower": {"src": "SolarPower"},
  "GenPower": {"src": "GenPower"},
  "LoadPower": {"src": "LoadPower"},
  "GridPower": {"src": "GridPower"},
  "BatSoC": {"src": "SOC/10"},
  "EnvTemp1": {"src": "MinCellTemp/10"},
  "EnvTemp2": {"src": "MaxCellTemp/10"},
  "BatCurr": {"src": "TotalCurr/100"},
  "BatVolt": {"src": "TotalVolt/100"}
}'),
(11,	'hermes_smart_panel',	2,	'mqtt',	'/HERMES/+/SMARTPANEL/+/data',	'json',	NULL,	NULL,	NULL,	't',	NULL,	NULL,	NULL,	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "SmartPanel_ID"
  },
  "Transformers.Transformer_ID": {
    "tag": true,
    "type": "string"
  },
  "ACBs.ACB_ID": {
    "tag": true,
    "type": "string"
  },
  "Meters.Meter_ID": {
    "tag": true,
    "type": "string"
  },
  "Status": {"type": "string"},
  "Transformers.Temperature": {"type": "number"},
  "ACBs.Release_Protection": {},
  "ACBs.Closing_Abnormal": {},
  "ACBs.Release_Abnormal": {},
  "ACBs.ACB_Status": {"type": "integer"},
  "Meters.Voltage_R": {},
  "Meters.Voltage_S": {},
  "Meters.Voltage_T": {},
  "Meters.Current_R": {},
  "Meters.Current_S": {},
  "Meters.Current_T": {},
  "Meters.Line_Voltage_RS": {},
  "Meters.Line_Voltage_ST": {},
  "Meters.Line_Voltage_RT": {},
  "Meters.Line_Current_R": {},
  "Meters.Line_Current_S": {},
  "Meters.Line_Current_T": {},
  "Meters.ActivePower": {},
  "Meters.ReactivePower": {},
  "Meters.PowerFactor": {}
}'),
(4,	'hermes_report',	10,	'mqtt',	'/HERMES/+/ESS/+/data',	'json',	'(device_state!=null)?device_state:((Status=="Operational" || Status=="Standby" || Status=="Power Saving")?"running":"error")',	'ErrorCode',	'ErrorDescription',	't',	'{
  "DeviceName": ESS_ID,
  "Status": Status
}',	'{
  "GenPower": GenPower,
  "GridPower": GridPurchasePower-GridSellPower,
  "LoadPower": LoadPower,
  "SolarPower": SolarPower,
  "GenEnergy": GenEnergy,
  "GridEnergy": GridPurchaseEnergy-GridSellEnergy,
  "LoadEnergy": LoadEnergy,
  "SolarEnergy": SolarEnergy,
  "BatSoC": BatSoC,
  "BatCurr": BatCurr,
  "BatVolt": BatVolt,
  "BatTemp": BatTemp,
  "EnvTemp1": EnvTemp1,
  "EnvTemp2": EnvTemp2,
  "EnvHumidity1": EnvHumidity1,
  "EnvHumidity2": EnvHumidity2,
  "EnvCO": EnvCO,
  "EnvCO2": EnvCO2,
  "Irradiance": Irradiance,
  "PR": PR,
  "Timestamp": Timestamp
}',	'{
  "type": "object",
  "properties": {
    "ESS_ID": {
      "type": "string"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "Status": {
      "type": "string"
    },
    "GenPower": {"type": "number"},
    "GridPower": {"type": "number"},
    "LoadPower": {"type": "number"},
    "SolarPower": {"type": "number"},
    "GenEnergy": {"type": "number"},
    "GridPurchaseEnergy": {"type": "number"},
    "GridSellEnergy": {"type": "number"},
    "GridEnergy": {"type": "number"},
    "LoadEnergy": {"type": "number"},
    "SolarEnergy": {"type": "number"},
    "BatSoC": {"type": "number"},
    "BatCurr": {"type": "number"},
    "BatVolt": {"type": "number"},
    "BatTemp": {"type": "number"},
    "EnvTemp1": {"type": "number"},
    "EnvTemp2": {"type": "number"},
    "EnvHumidity1": {"type": "number"},
    "EnvHumidity2": {"type": "number"},
    "EnvCO": {"type": "number"},
    "EnvCO2": {"type": "number"},
    "Irradiance": {"type": "number"},
    "PR": {"type": "number"}
  },
  "required": ["ESS_ID"]
}',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "ESS_ID"
  },
  "Status": {"type": "string"},
  "GenPower": {},
  "GridPower": {"src": "GridPurchasePower-GridSellPower"},
  "LoadPower": {},
  "SolarPower": {},
  "GenEnergy": {},
  "GridPurchaseEnergy": {},
  "GridSellEnergy": {},
  "GridEnergy": {"src": "GridPurchaseEnergy-GridSellEnergy"},
  "LoadEnergy": {},
  "SolarEnergy": {},
  "BatSoC": {},
  "BatCurr": {},
  "BatVolt": {},
  "BatTemp": {},
  "EnvTemp1": {},
  "EnvTemp2": {},
  "EnvHumidity1": {},
  "EnvHumidity2": {},
  "EnvCO": {},
  "EnvCO2": {},
  "Irradiance": {},
  "PR": {}
}');

DROP TABLE IF EXISTS "device_type";
DROP SEQUENCE IF EXISTS device_type_device_type_id_seq;
CREATE SEQUENCE device_type_device_type_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_type" (
    "device_type_id" integer DEFAULT nextval('device_type_device_type_id_seq') NOT NULL,
    "device_type_name" character varying(255) DEFAULT '' NOT NULL,
    "device_type_alias_name" character varying(255) DEFAULT '' NOT NULL,
    "device_type_category_id" integer,
    "connection_params" text DEFAULT '' NOT NULL,
    "is_energy_storage" boolean DEFAULT false NOT NULL,
    CONSTRAINT "device_type_pkey" PRIMARY KEY ("device_type_id")
) WITH (oids = false);

INSERT INTO "device_type" ("device_type_id", "device_type_name", "device_type_alias_name", "device_type_category_id", "connection_params", "is_energy_storage") VALUES
(3,	'smart_pole',	'SmartPole',	NULL,	'',	't'),
(4,	'charging_pile',	'ChargingPile',	NULL,	'',	't'),
(6,	'pomcube',	'ESSCloud',	1,	'',	't'),
(10,	'ess_hermes',	'ESSHermes',	1,	'',	't'),
(8,	'pv_inverter',	'PVInverter',	2,	'',	't'),
(9,	'smart_meter',	'SmartMeter',	3,	'',	'f'),
(2,	'smart_panel_hermes',	'SmartPanelHermes',	4,	'',	't');

DROP TABLE IF EXISTS "device_type_category";
DROP SEQUENCE IF EXISTS device_type_category_device_type_category_id_seq;
CREATE SEQUENCE device_type_category_device_type_category_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."device_type_category" (
    "device_type_category_id" integer DEFAULT nextval('device_type_category_device_type_category_id_seq') NOT NULL,
    "device_type_category_name" character varying(255) DEFAULT '' NOT NULL,
    "device_type_category_alias_name" character varying(255) DEFAULT '' NOT NULL,
    CONSTRAINT "device_type_category_pkey" PRIMARY KEY ("device_type_category_id")
) WITH (oids = false);

INSERT INTO "device_type_category" ("device_type_category_id", "device_type_category_name", "device_type_category_alias_name") VALUES
(1,	'ess',	'ESS'),
(2,	'pv',	'PV'),
(3,	'smart_meter',	'SmartMeter'),
(4,	'smart_panel',	'SmartPanel');

DROP TABLE IF EXISTS "domain";
DROP SEQUENCE IF EXISTS domain_domain_id_seq;
CREATE SEQUENCE domain_domain_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."domain" (
    "domain_id" integer DEFAULT nextval('domain_domain_id_seq') NOT NULL,
    "domain_name" character varying(64) DEFAULT '' NOT NULL,
    "parent_domain_id" integer,
    "is_organization" boolean DEFAULT false NOT NULL,
    "address" character varying(255) DEFAULT '' NOT NULL,
    "lat" numeric(10,8),
    "lng" numeric(11,8),
    "zoom" double precision DEFAULT '7',
    "photos" text DEFAULT '' NOT NULL,
    "feed_in_tariff_now" double precision,
    "feed_in_tariffs" text,
    CONSTRAINT "domain_pkey" PRIMARY KEY ("domain_id")
) WITH (oids = false);

INSERT INTO "domain" ("domain_id", "domain_name", "parent_domain_id", "is_organization", "address", "lat", "lng", "zoom", "photos", "feed_in_tariff_now", "feed_in_tariffs") VALUES
(163,	'SiteA',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(161,	'AreaA',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(166,	'SiteB',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(159,	'TestA',	2,	't',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(167,	'Dev',	1,	't',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(175,	'SP站點',	174,	'f',	'',	25.08217852,	121.56453609,	17,	'',	NULL,	NULL),
(177,	'Bangkok',	118,	'f',	'',	13.81607727,	100.55648804,	11,	'',	NULL,	NULL),
(179,	'Demo',	178,	'f',	'',	13.74942632,	100.51750481,	18,	'',	NULL,	NULL),
(180,	'沙崙智慧綠能科學城-太陽能',	119,	'f',	'',	22.92146062,	120.28977871,	16,	'',	NULL,	NULL),
(122,	'沙崙智慧綠能科學城-儲能',	119,	'f',	'',	22.92104559,	120.29085159,	16,	'',	NULL,	NULL),
(188,	'台南工研院',	183,	'f',	'',	22.92071456,	120.29132903,	18,	'',	NULL,	NULL),
(182,	'工研院綠能所',	1,	't',	'',	23.73004056,	120.97045898,	8,	'',	NULL,	NULL),
(190,	'大台南會展中心',	183,	'f',	'',	22.92148039,	120.28542280,	16,	'',	NULL,	NULL),
(186,	'沙崙智慧綠能科學城-儲能',	183,	'f',	'',	22.92132228,	120.28968215,	17,	'',	NULL,	NULL),
(184,	'沙崙智慧綠能科學城-太陽能',	183,	'f',	'',	22.92129264,	120.28972507,	17,	'',	NULL,	NULL),
(169,	'泰國',	2,	'f',	'',	12.65105813,	106.00708008,	7,	'',	NULL,	NULL),
(173,	'E-Cube 2.0',	2,	'f',	'',	22.92086772,	120.29127538,	18,	'',	NULL,	NULL),
(171,	'K館',	2,	'f',	'',	22.92122346,	120.28972507,	18,	'',	NULL,	NULL),
(192,	'台北',	167,	'f',	'',	25.04128208,	121.56423569,	13,	'',	NULL,	NULL),
(194,	'內湖能耗分析A',	193,	'f',	'',	25.08213479,	121.56450391,	18,	'',	NULL,	NULL),
(123,	'K館',	122,	'f',	'',	22.92122841,	120.28976798,	18,	'',	NULL,	NULL),
(2,	'recycle',	1,	't',	'',	0.00000000,	0.00000000,	5,	'',	NULL,	NULL),
(124,	'台北',	118,	'f',	'',	25.04703639,	121.55891418,	12,	'',	NULL,	NULL),
(1,	'root',	NULL,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(126,	'內湖辦公室',	125,	'f',	'',	25.08211050,	121.56453609,	18,	'',	NULL,	NULL),
(133,	'潮州鐵道園區',	132,	'f',	'',	22.52706442,	120.53570677,	16,	'',	NULL,	NULL),
(119,	'台南',	118,	'f',	'',	22.96977343,	120.24810791,	11,	'',	NULL,	NULL),
(120,	'三井Outlet',	119,	'f',	'',	22.92555158,	120.28731108,	16,	'',	NULL,	NULL),
(129,	'鼎硯總部',	119,	'f',	'',	23.03047094,	120.24391294,	17,	'',	NULL,	NULL),
(125,	'內湖',	124,	'f',	'',	25.08212994,	121.56451464,	18,	'',	NULL,	NULL),
(134,	'E-Cube 2.0',	133,	'f',	'',	22.52733358,	120.53592503,	18,	'',	NULL,	NULL),
(130,	'辦公室',	129,	'f',	'',	23.03030308,	120.24390221,	18,	'',	NULL,	NULL),
(128,	'大台南會展中心',	119,	'f',	'',	22.92128275,	120.28529406,	16,	'',	NULL,	NULL),
(131,	'E-Cube 1.0',	128,	'f',	'',	22.92128275,	120.28529406,	16,	'',	NULL,	NULL),
(132,	'屏東',	118,	'f',	'',	22.66928220,	120.49631953,	10,	'',	NULL,	NULL),
(155,	'站點智慧電表',	2,	'f',	'',	25.08212994,	121.56450391,	18,	'',	NULL,	NULL),
(151,	'工作站',	150,	'f',	'',	25.08212994,	121.56450391,	18,	'',	NULL,	NULL),
(157,	'PV工作站',	150,	'f',	'',	22.98810605,	120.20896912,	12,	'',	NULL,	NULL),
(149,	'公司或組織',	1,	't',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(150,	'區域',	149,	'f',	'',	25.06569719,	121.54655457,	11,	'',	NULL,	NULL),
(152,	'站點',	151,	'f',	'',	25.03432210,	121.56421959,	18,	'',	NULL,	NULL),
(118,	'鼎硯',	1,	't',	'',	23.86072178,	120.96496582,	8,	'',	NULL,	'[
  {
    "start_time": "2023-12-31T16:00:00.000Z",
    "end_time": "2024-12-31T16:00:00.000Z",
    "tariff": 5
  }
]
'),
(153,	'台南工研院',	119,	'f',	'',	22.92083808,	120.29134512,	17,	'',	NULL,	NULL),
(154,	'E-Cube 2.0',	153,	'f',	'',	22.92079855,	120.29152751,	18,	'',	NULL,	NULL),
(158,	'PV站點',	157,	'f',	'',	22.98648624,	120.20763874,	15,	'',	NULL,	NULL),
(174,	'SP工作站',	150,	'f',	'',	25.08217852,	121.56453609,	17,	'',	NULL,	NULL),
(148,	'內湖能耗分析A',	125,	'f',	'',	25.08212994,	121.56451464,	18,	'',	NULL,	NULL),
(162,	'StationA',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(165,	'StationB',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(164,	'AreaB',	2,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(160,	'TestB',	2,	't',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL),
(176,	'內湖能耗分析B',	125,	'f',	'',	25.08212994,	121.56451464,	18,	'',	NULL,	NULL),
(178,	'DEDE',	177,	'f',	'',	13.74942632,	100.51750481,	18,	'',	NULL,	NULL),
(181,	'K館PV',	180,	'f',	'',	22.92122346,	120.28971970,	18,	'',	NULL,	NULL),
(187,	'K館儲能',	186,	'f',	'',	22.92121358,	120.28963387,	18,	'',	NULL,	NULL),
(189,	'E-Cube 2.0',	188,	'f',	'',	22.92081831,	120.29149532,	18,	'',	NULL,	NULL),
(191,	'E-Cube 1.0',	190,	'f',	'',	22.92122346,	120.28517604,	17,	'',	NULL,	NULL),
(183,	'台南',	182,	'f',	'',	22.92899026,	120.29170990,	12,	'',	NULL,	NULL),
(185,	'K館太陽能',	184,	'f',	'',	22.92121358,	120.28968215,	18,	'',	NULL,	NULL),
(172,	'台南工研院',	2,	'f',	'',	22.92086772,	120.29127538,	18,	'',	NULL,	NULL),
(170,	'沙崙',	2,	'f',	'',	22.92314050,	120.28960705,	15,	'',	NULL,	NULL),
(168,	'台南',	2,	'f',	'',	22.99253079,	120.24810791,	11,	'',	NULL,	NULL),
(193,	'內湖辦公室',	192,	'f',	'',	25.08221739,	121.56452537,	17,	'',	NULL,	NULL),
(195,	'內湖能耗分析B',	193,	'f',	'',	25.08214937,	121.56452000,	18,	'',	NULL,	NULL);

DROP TABLE IF EXISTS "event";
DROP SEQUENCE IF EXISTS event_event_id_seq;
CREATE SEQUENCE event_event_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."event" (
    "event_id" integer DEFAULT nextval('event_event_id_seq') NOT NULL,
    "event_name" character varying(63) DEFAULT '' NOT NULL,
    "event_type" character varying(63) DEFAULT '' NOT NULL,
    "domain_id" integer,
    "device_type_id" integer,
    "device_output_id" integer,
    "device_name" character varying(127) DEFAULT '' NOT NULL,
    "compare_function" text DEFAULT '' NOT NULL,
    "message" text DEFAULT '' NOT NULL,
    "not_trigger_second" integer DEFAULT '0' NOT NULL,
    "trigger_onchange" boolean DEFAULT false NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "notifys" text DEFAULT '' NOT NULL,
    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
) WITH (oids = false);

INSERT INTO "event" ("event_id", "event_name", "event_type", "domain_id", "device_type_id", "device_output_id", "device_name", "compare_function", "message", "not_trigger_second", "trigger_onchange", "enabled", "notifys") VALUES
(6,	'Pomcube 離線',	'device',	118,	6,	6,	'',	'data.OnLine!=null && data.OnLine==0',	'裝置 ${device.device_name} 發生離線',	0,	't',	't',	'[{"user_id":42,"mail":true,"email":false,"line_notify":true},{"user_id":41,"mail":true,"email":false,"line_notify":true}]');

DROP TABLE IF EXISTS "event_range_rule";
DROP SEQUENCE IF EXISTS event_range_rule_event_range_rule_id_seq;
CREATE SEQUENCE event_range_rule_event_range_rule_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."event_range_rule" (
    "event_range_rule_id" integer DEFAULT nextval('event_range_rule_event_range_rule_id_seq') NOT NULL,
    "device_type_id" integer,
    "device_id" integer,
    "field" character varying(63) DEFAULT '' NOT NULL,
    "min_value" double precision,
    "max_value" double precision,
    "code" character varying(31) DEFAULT '' NOT NULL,
    "description" text DEFAULT '' NOT NULL,
    "device_state" character varying(31) DEFAULT '' NOT NULL,
    CONSTRAINT "event_range_rule_pkey" PRIMARY KEY ("event_range_rule_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "mail";
DROP SEQUENCE IF EXISTS mail_mail_id_seq;
CREATE SEQUENCE mail_mail_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."mail" (
    "mail_id" integer DEFAULT nextval('mail_mail_id_seq') NOT NULL,
    "mail_type" character varying(63) DEFAULT '' NOT NULL,
    "user_id" integer,
    "content" text DEFAULT '' NOT NULL,
    "readed" boolean DEFAULT false NOT NULL,
    "repair_order_id" integer,
    "device_id" integer,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mail_pkey" PRIMARY KEY ("mail_id")
) WITH (oids = false);

INSERT INTO "mail" ("mail_id", "mail_type", "user_id", "content", "readed", "repair_order_id", "device_id", "create_time") VALUES
(105320,	'device',	41,	'裝置 AA-70-2209-01-0079-377 發生離線',	'f',	NULL,	85,	'2024-10-04 06:43:35.922'),
(105321,	'device',	42,	'裝置 AA-70-2209-01-0079-377 發生離線',	'f',	NULL,	85,	'2024-10-04 07:24:36.469'),
(105322,	'device',	41,	'裝置 AA-70-2209-01-0079-377 發生離線',	'f',	NULL,	85,	'2024-10-04 07:24:36.481');

DROP TABLE IF EXISTS "power_scheduler";
DROP SEQUENCE IF EXISTS power_scheduler_power_scheduler_id_seq;
CREATE SEQUENCE power_scheduler_power_scheduler_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."power_scheduler" (
    "power_scheduler_id" integer DEFAULT nextval('power_scheduler_power_scheduler_id_seq') NOT NULL,
    "domain_id" integer,
    "device_id" integer,
    "timezone" character varying(31),
    "crons" text,
    "notify_user_id" integer,
    "enabled" boolean DEFAULT false NOT NULL,
    CONSTRAINT "power_scheduler_pkey" PRIMARY KEY ("power_scheduler_id")
) WITH (oids = false);

INSERT INTO "power_scheduler" ("power_scheduler_id", "domain_id", "device_id", "timezone", "crons", "notify_user_id", "enabled") VALUES
(4,	123,	NULL,	'Asia/Taipei',	'[{"start_time":53100, "stop_time":53000, "power":-1500}]',	1,	't');

DROP TABLE IF EXISTS "repair_item";
DROP SEQUENCE IF EXISTS repair_item_repair_item_id_seq;
CREATE SEQUENCE repair_item_repair_item_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."repair_item" (
    "repair_item_id" integer DEFAULT nextval('repair_item_repair_item_id_seq') NOT NULL,
    "repair_order_id" integer,
    "repair_type_id" integer,
    "description" text DEFAULT '' NOT NULL,
    "repair_item_state" character varying(31) DEFAULT '' NOT NULL,
    "device_id" integer,
    "expect_end_date" date,
    "completeness" double precision DEFAULT '0' NOT NULL,
    "photos" text DEFAULT '' NOT NULL,
    "start_time" timestamp,
    "end_time" timestamp,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "repair_item_pkey" PRIMARY KEY ("repair_item_id")
) WITH (oids = false);

INSERT INTO "repair_item" ("repair_item_id", "repair_order_id", "repair_type_id", "description", "repair_item_state", "device_id", "expect_end_date", "completeness", "photos", "start_time", "end_time", "create_time") VALUES
(10,	NULL,	NULL,	'',	'',	17,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:09:30'),
(11,	NULL,	NULL,	'',	'',	17,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:10:12'),
(12,	NULL,	NULL,	'',	'',	17,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(13,	NULL,	NULL,	'',	'',	18,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(14,	NULL,	NULL,	'',	'',	19,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(15,	NULL,	NULL,	'',	'',	20,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(16,	NULL,	NULL,	'',	'',	21,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(17,	NULL,	NULL,	'',	'',	22,	NULL,	0,	'',	NULL,	NULL,	'2024-04-10 11:35:13'),
(66,	76,	NULL,	'',	'',	85,	NULL,	0,	'',	NULL,	NULL,	'2024-08-02 08:57:03.491889'),
(67,	80,	NULL,	'',	'',	91,	NULL,	0,	'',	NULL,	NULL,	'2024-08-02 10:12:19.801117'),
(68,	81,	NULL,	'',	'',	123,	NULL,	0,	'',	NULL,	NULL,	'2024-09-11 10:35:42.016');

DROP TABLE IF EXISTS "repair_order";
DROP SEQUENCE IF EXISTS repair_order_repair_order_id_seq;
CREATE SEQUENCE repair_order_repair_order_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."repair_order" (
    "repair_order_id" integer DEFAULT nextval('repair_order_repair_order_id_seq') NOT NULL,
    "domain_id" integer,
    "creator_id" integer,
    "title" character varying(127) DEFAULT '' NOT NULL,
    "contact_name" character varying(63) DEFAULT '' NOT NULL,
    "contact_phone" character varying(31) DEFAULT '' NOT NULL,
    "contact_email" character varying(127) DEFAULT '' NOT NULL,
    "priority" integer DEFAULT '0' NOT NULL,
    "custom_description" text DEFAULT '' NOT NULL,
    "repair_description" text DEFAULT '' NOT NULL,
    "expect_end_date" date,
    "repair_order_state" character varying(31) DEFAULT '' NOT NULL,
    "repair_order_type" character varying(31) DEFAULT '' NOT NULL,
    "completeness" double precision DEFAULT '0' NOT NULL,
    "photos" text DEFAULT '' NOT NULL,
    "supplier_id" integer,
    "assign_user_id" integer,
    "start_time" timestamp,
    "end_time" timestamp,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "repair_order_pkey" PRIMARY KEY ("repair_order_id")
) WITH (oids = false);

INSERT INTO "repair_order" ("repair_order_id", "domain_id", "creator_id", "title", "contact_name", "contact_phone", "contact_email", "priority", "custom_description", "repair_description", "expect_end_date", "repair_order_state", "repair_order_type", "completeness", "photos", "supplier_id", "assign_user_id", "start_time", "end_time", "create_time") VALUES
(78,	1,	1,	'',	'',	'',	'',	1,	'',	'',	NULL,	'pending_dispatch',	'report_order',	0,	'',	NULL,	NULL,	NULL,	NULL,	'2024-07-08 10:54:10.372356'),
(79,	1,	1,	'',	'',	'',	'',	2,	'',	'',	NULL,	'repairing',	'repair_order',	0,	'',	NULL,	NULL,	NULL,	NULL,	'2024-07-08 10:55:02.69885'),
(80,	132,	41,	'',	'',	'',	'',	0,	'',	'',	NULL,	'pending',	'report_order',	0,	'',	NULL,	NULL,	NULL,	NULL,	'2024-08-02 10:12:19.775874'),
(76,	119,	41,	'',	'',	'',	'',	0,	'',	'',	NULL,	'repairing',	'repair_order',	0,	'',	NULL,	42,	NULL,	NULL,	'2024-06-26 10:37:55.544074'),
(81,	150,	43,	'',	'',	'',	'',	0,	'報修測試',	'',	NULL,	'repairing',	'repair_order',	0,	'',	NULL,	45,	NULL,	NULL,	'2024-09-11 10:35:41.918736');

DROP TABLE IF EXISTS "repair_record";
DROP SEQUENCE IF EXISTS repair_record_repair_record_id_seq;
CREATE SEQUENCE repair_record_repair_record_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."repair_record" (
    "repair_record_id" integer DEFAULT nextval('repair_record_repair_record_id_seq') NOT NULL,
    "repair_order_id" integer,
    "repair_item_id" integer,
    "start_time" timestamp,
    "end_time" timestamp,
    "description" text DEFAULT '' NOT NULL,
    "photos" text DEFAULT '' NOT NULL,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "update_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "repair_record_pkey" PRIMARY KEY ("repair_record_id")
) WITH (oids = false);

INSERT INTO "repair_record" ("repair_record_id", "repair_order_id", "repair_item_id", "start_time", "end_time", "description", "photos", "create_time", "update_time") VALUES
(27,	81,	NULL,	NULL,	NULL,	'測試',	'',	'2024-09-13 11:28:52.476',	'2024-09-13 11:28:52.476');

DROP TABLE IF EXISTS "repair_type";
DROP SEQUENCE IF EXISTS repair_type_repair_type_id_seq;
CREATE SEQUENCE repair_type_repair_type_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."repair_type" (
    "repair_type_id" integer DEFAULT nextval('repair_type_repair_type_id_seq') NOT NULL,
    "repair_type_name" character varying(255) DEFAULT '' NOT NULL,
    "device_type_id" integer,
    CONSTRAINT "repair_type_pkey" PRIMARY KEY ("repair_type_id")
) WITH (oids = false);

INSERT INTO "repair_type" ("repair_type_id", "repair_type_name", "device_type_id") VALUES
(1,	'無法開機',	2),
(2,	'一般檢查',	2),
(3,	'太陽能無法充電',	2);

DROP TABLE IF EXISTS "repair_user_record";
DROP SEQUENCE IF EXISTS repair_user_record_repair_user_record_id_seq;
CREATE SEQUENCE repair_user_record_repair_user_record_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."repair_user_record" (
    "repair_user_record_id" integer DEFAULT nextval('repair_user_record_repair_user_record_id_seq') NOT NULL,
    "repair_record_id" integer,
    "user_id" integer,
    CONSTRAINT "repair_user_record_pkey" PRIMARY KEY ("repair_user_record_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "role";
DROP SEQUENCE IF EXISTS role_role_id_seq;
CREATE SEQUENCE role_role_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."role" (
    "role_id" integer DEFAULT nextval('role_role_id_seq') NOT NULL,
    "role_name" character varying(64) DEFAULT '' NOT NULL,
    "domain_id" integer,
    "page_permission" text DEFAULT '' NOT NULL,
    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
) WITH (oids = false);

INSERT INTO "role" ("role_id", "role_name", "domain_id", "page_permission") VALUES
(1,	'root',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"EnergyConsumption","permission":3},{"name":"CarbonEmission","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"ECOImport","permission":3},{"name":"ECOSetup","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]'),
(35,	'guest',	118,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":1},{"name":"ESSHermes","permission":1},{"name":"ESSCloud","permission":1},{"name":"CaseManagement","permission":1},{"name":"RequestForm","permission":1},{"name":"MaintenanceForm","permission":1},{"name":"CaseClosure","permission":1},{"name":"PowerGeneration","permission":1},{"name":"AccountManagement","permission":1},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"MessageBox","permission":1}]'),
(38,	'維運人員',	149,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"CaseManagement","permission":3},{"name":"RequestForm","permission":3},{"name":"MaintenanceForm","permission":3},{"name":"CaseClosure","permission":3},{"name":"PowerGeneration","permission":2},{"name":"AccountManagement","permission":2},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"MessageBox","permission":1}]'),
(36,	'文件說明管理員',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]'),
(43,	'Demo',	118,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"EnergyConsumption","permission":3},{"name":"CarbonEmission","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"CaseManagement","permission":2},{"name":"RequestForm","permission":2},{"name":"MaintenanceForm","permission":2},{"name":"CaseClosure","permission":2},{"name":"PowerGeneration","permission":2},{"name":"AccountManagement","permission":2},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":2},{"name":"DomainConfig","permission":1},{"name":"MessageBox","permission":2}]'),
(44,	'綠能所管理員',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]'),
(45,	'guest',	182,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":1},{"name":"ESSHermes","permission":1},{"name":"ESSCloud","permission":1},{"name":"CaseManagement","permission":1},{"name":"RequestForm","permission":1},{"name":"MaintenanceForm","permission":1},{"name":"CaseClosure","permission":1},{"name":"PowerGeneration","permission":1},{"name":"AccountManagement","permission":1},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"DomainConfig","permission":1},{"name":"MessageBox","permission":1}]'),
(42,	'DemoUser',	167,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":1},{"name":"ESSHermes","permission":1},{"name":"ESSCloud","permission":1},{"name":"SmartPanelHermes","permission":1},{"name":"CaseManagement","permission":1},{"name":"RequestForm","permission":1},{"name":"MaintenanceForm","permission":1},{"name":"CaseClosure","permission":1},{"name":"PowerGeneration","permission":1},{"name":"AccountManagement","permission":1},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"DomainConfig","permission":1},{"name":"MessageBox","permission":1}]'),
(41,	'開發管理員',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"EnergyConsumption","permission":3},{"name":"CarbonEmission","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"ECOImport","permission":3},{"name":"ECOSetup","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]'),
(34,	'鼎硯管理員',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"EnergyConsumption","permission":3},{"name":"CarbonEmission","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"ECOImport","permission":3},{"name":"ECOSetup","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]');

DROP TABLE IF EXISTS "role_permission";
DROP SEQUENCE IF EXISTS role_permission_role_permission_id_seq;
CREATE SEQUENCE role_permission_role_permission_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."role_permission" (
    "role_permission_id" integer DEFAULT nextval('role_permission_role_permission_id_seq') NOT NULL,
    "role_id" integer,
    "resource_name" character varying(127) DEFAULT '' NOT NULL,
    "method" character varying(31) DEFAULT '' NOT NULL,
    "condi" character varying(255) DEFAULT '' NOT NULL,
    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_permission_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "scheduler";
DROP SEQUENCE IF EXISTS scheduler_scheduler_id_seq;
CREATE SEQUENCE scheduler_scheduler_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."scheduler" (
    "scheduler_id" integer DEFAULT nextval('scheduler_scheduler_id_seq') NOT NULL,
    "scheduler_name" character varying(127) DEFAULT '' NOT NULL,
    "organization_id" integer,
    "device_type_id" integer,
    "device_input_id" integer,
    "device_id" integer,
    "cron" character varying(63),
    CONSTRAINT "scheduler_pkey" PRIMARY KEY ("scheduler_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "sensor_schema_old";
DROP SEQUENCE IF EXISTS sensor_schema_sensor_schema_id_seq;
CREATE SEQUENCE sensor_schema_sensor_schema_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."sensor_schema_old" (
    "sensor_schema_id" integer DEFAULT nextval('sensor_schema_sensor_schema_id_seq') NOT NULL,
    "sensor_schema_name" character varying(255) DEFAULT '' NOT NULL,
    "data_schema" text DEFAULT '' NOT NULL,
    "organization_id" integer,
    "device_type_id" integer,
    CONSTRAINT "sensor_schema_pkey" PRIMARY KEY ("sensor_schema_id")
) WITH (oids = false);

INSERT INTO "sensor_schema_old" ("sensor_schema_id", "sensor_schema_name", "data_schema", "organization_id", "device_type_id") VALUES
(5,	'hermes_control',	'{
     "type": "object",
     "properties": {
         "command": {
             "type": "string"
         },
         "parameters": {
             "type": "object",
             "properties": {
                 "mode": {
                     "type": "string"
                 }
             }
         }
     }
}',	NULL,	8),
(7,	'hermes_error',	'{
  "type": "object",
  "properties": {
    "EMS_ID": {
      "type": "string"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "ErrorCode": {
      "type": "string"
    },
    "ErrorDescription": {
      "type": "string"
    }
  },
  "required": ["EMS_ID"]
}',	NULL,	8),
(8,	'smart_meter_data',	'{
  "type": "object",
  "properties": {
    "Power": {"type": "number"}
  }
}',	NULL,	9),
(1,	'state',	'',	NULL,	NULL),
(2,	'pomcube_data',	'{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "device_name": {"type": "string"},
      "device_sn": {"type": "string"},
      "place_name": {"type": "integer"},
      "device_apiname": {"type": "string"},
      "GridEnergy": {"type": "number"},
      "LoadEnergy": {"type": "number"},
      "SolarEnergy": {"type": "number"},
      "BatEnergy": {"type": "number"},
      "GenEnergy": {"type": "number"},
      "SolarPower": {"type": "number"},
      "GenPower": {"type": "number"},
      "LoadPower": {"type": "number"},
      "GridPower": {"type": "number"},
      "BatSoC": {"type": "number"},
      "EnvTemp1": {"type": "number"},
      "EnvTemp2": {"type": "number"},
      "BatCurr": {"type": "number"},
      "BatVolt": {"type": "number"}
    },
    "required": [
      "device_name",
      "device_sn",
      "place_name"
    ]
  }
}',	NULL,	6),
(3,	'pomcube_control',	'',	NULL,	6),
(4,	'hermes_report',	'{
  "type": "object",
  "properties": {
    "EMS_ID": {
      "type": "string"
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "Status": {
      "type": "string"
    },
    "GenPower": {"type": "number"},
    "GridPower": {"type": "number"},
    "LoadPower": {"type": "number"},
    "SolarPower": {"type": "number"},
    "GenEnergy": {"type": "number"},
    "GridEnergy": {"type": "number"},
    "LoadEnergy": {"type": "number"},
    "SolarEnergy": {"type": "number"},
    "BatSoC": {"type": "number"},
    "BatCurr": {"type": "number"},
    "BatVolt": {"type": "number"},
    "BatTemp": {"type": "number"},
    "EnvTemp1": {"type": "number"},
    "EnvTemp2": {"type": "number"},
    "EnvHumidity1": {"type": "number"},
    "EnvHumidity2": {"type": "number"},
    "EnvCO": {"type": "number"},
    "EnvCO2": {"type": "number"},
    "Irradiance": {"type": "number"},
    "PR": {"type": "number"}
  },
  "required": ["EMS_ID"]
}',	NULL,	8);

DROP TABLE IF EXISTS "setting";
CREATE TABLE "public"."setting" (
    "setting_id" character varying(127) NOT NULL,
    "setting_value" text DEFAULT '' NOT NULL,
    CONSTRAINT "setting_pkey" PRIMARY KEY ("setting_id")
) WITH (oids = false);


DROP TABLE IF EXISTS "user";
DROP SEQUENCE IF EXISTS user_user_id_seq;
CREATE SEQUENCE user_user_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;

CREATE TABLE "public"."user" (
    "user_id" integer DEFAULT nextval('user_user_id_seq') NOT NULL,
    "user_account" character varying(64) NOT NULL,
    "user_name" character varying(64) DEFAULT '' NOT NULL,
    "user_password" character varying(64) DEFAULT '' NOT NULL,
    "domain_id" integer,
    "role_id" integer,
    "is_supplier" boolean DEFAULT false NOT NULL,
    "phone" character varying(32) DEFAULT '' NOT NULL,
    "email" character varying(63) DEFAULT '' NOT NULL,
    "contact_name" character varying(64) DEFAULT '' NOT NULL,
    "create_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "line_notify_token" character varying(127) DEFAULT '' NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id"),
    CONSTRAINT "user_user_account_key" UNIQUE ("user_account")
) WITH (oids = false);

INSERT INTO "user" ("user_id", "user_account", "user_name", "user_password", "domain_id", "role_id", "is_supplier", "phone", "email", "contact_name", "create_time", "line_notify_token") VALUES
(43,	'admin@Doc',	'管理員',	'123456',	149,	36,	'f',	'',	'',	'',	'2024-08-06 03:06:32.46217',	''),
(45,	'serviceA@Doc',	'維運人員A',	'serviceA',	149,	38,	'f',	'',	'',	'',	'2024-09-03 06:40:02.294779',	''),
(48,	'admin@Dev',	'Dev',	'123456',	167,	41,	'f',	'',	'',	'',	'2024-09-18 07:30:55.993515',	''),
(49,	'demo@Dev',	'UserDemo',	'userDemo',	167,	42,	'f',	'',	'',	'',	'2024-09-18 07:41:12.327119',	''),
(50,	'thai_demo',	'DemoUser',	'thai_demo',	118,	43,	'f',	'',	'',	'',	'2024-09-19 08:00:36.227472',	''),
(42,	'guest@dy',	'Guest',	'guest',	119,	35,	'f',	'',	'',	'',	'2024-06-20 07:37:32.142483',	''),
(51,	'admin@gel',	'管理員',	'admingel',	182,	44,	'f',	'',	'',	'',	'2024-09-25 10:02:05.251094',	''),
(52,	'guest@gel',	'Guest',	'guestgel',	182,	45,	'f',	'',	'',	'',	'2024-09-26 09:56:39.307004',	''),
(41,	'admin@Dingyang',	'管理員',	'123456',	118,	34,	'f',	'',	'',	'',	'2024-06-19 01:48:27.046507',	''),
(1,	'admin',	'root 管理員',	'123456',	1,	1,	'f',	'',	'',	'',	'2024-02-22 04:16:18',	'PGCiZZwne23XxgBUoiv97tYmnWi7Irgo87PhJgcwx4v');

ALTER TABLE ONLY "public"."device" ADD CONSTRAINT "device_device_connection_id_fkey" FOREIGN KEY (device_connection_id) REFERENCES device_connection(device_connection_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."device" ADD CONSTRAINT "device_device_type_category_id_fkey" FOREIGN KEY (device_type_category_id) REFERENCES device_type_category(device_type_category_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."device" ADD CONSTRAINT "device_device_type_id_fkey" FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."device" ADD CONSTRAINT "device_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."device_connection" ADD CONSTRAINT "device_connection_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."device_handler" ADD CONSTRAINT "device_handler_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."device_type" ADD CONSTRAINT "device_type_device_type_category_id_fkey" FOREIGN KEY (device_type_category_id) REFERENCES device_type_category(device_type_category_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."domain" ADD CONSTRAINT "domain_parent_domain_id_fkey" FOREIGN KEY (parent_domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."event" ADD CONSTRAINT "event_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."mail" ADD CONSTRAINT "mail_repair_order_id_fkey" FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id) ON DELETE SET NULL NOT DEFERRABLE;
ALTER TABLE ONLY "public"."mail" ADD CONSTRAINT "mail_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE SET NULL NOT DEFERRABLE;

ALTER TABLE ONLY "public"."power_scheduler" ADD CONSTRAINT "power_scheduler_device_id_fkey" FOREIGN KEY (device_id) REFERENCES device(device_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."power_scheduler" ADD CONSTRAINT "power_scheduler_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."power_scheduler" ADD CONSTRAINT "power_scheduler_notify_user_id_fkey" FOREIGN KEY (notify_user_id) REFERENCES "user"(user_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."repair_item" ADD CONSTRAINT "repair_item_repair_order_id_fkey" FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."repair_item" ADD CONSTRAINT "repair_item_repair_type_id_fkey" FOREIGN KEY (repair_type_id) REFERENCES repair_type(repair_type_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."repair_order" ADD CONSTRAINT "repair_order_assign_user_id_fkey" FOREIGN KEY (assign_user_id) REFERENCES "user"(user_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."repair_order" ADD CONSTRAINT "repair_order_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES "user"(user_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."repair_order" ADD CONSTRAINT "repair_order_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."repair_order" ADD CONSTRAINT "repair_order_supplier_id_fkey" FOREIGN KEY (supplier_id) REFERENCES "user"(user_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."repair_record" ADD CONSTRAINT "repair_record_repair_item_id_fkey" FOREIGN KEY (repair_item_id) REFERENCES repair_item(repair_item_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."repair_record" ADD CONSTRAINT "repair_record_repair_order_id_fkey" FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."repair_user_record" ADD CONSTRAINT "repair_user_record_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(user_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."role" ADD CONSTRAINT "role_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY (role_id) REFERENCES role(role_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."scheduler" ADD CONSTRAINT "scheduler_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."sensor_schema_old" ADD CONSTRAINT "sensor_schema_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES domain(domain_id) NOT DEFERRABLE;

ALTER TABLE ONLY "public"."user" ADD CONSTRAINT "user_domain_id_fkey" FOREIGN KEY (domain_id) REFERENCES domain(domain_id) NOT DEFERRABLE;
ALTER TABLE ONLY "public"."user" ADD CONSTRAINT "user_role_id_fkey" FOREIGN KEY (role_id) REFERENCES role(role_id) NOT DEFERRABLE;

-- 2024-10-04 06:45:02.037254+00