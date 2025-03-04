INSERT INTO "page_permission" ("page_permission_id", "page_name", "permissions") VALUES
(7,	'DeviceInfo',	'{"read":["view_device"]}'),
(18,	'PowerGeneration',	'{"read":["view:domain","view:device"]}'),
(21,	'SystemInfo',	'{"read":[]}'),
(19,	'AccountManagement',	'{
"read":["view:role","view:domain","view:user"],
"edit":["edit:user"],
"manage":["manage:user"]
}'),
(3,	'StatusMonitor',	'{"read":["view:domain","view:device","get:/domain_datas/query","get:/device_datas/query"], "edit":["edit:domain"]}'),
(20,	'PermissionManagement',	'{
"read":["view:role","view:domain"],
"edit":["edit:role"],
"manage":["manage:role"]
}'),
(4,	'SecurityMonitor',	'{"read":["view:domain"]}'),
(5,	'ECOImport',	'{"read":["view:domain"]}'),
(6,	'ECOSetup',	'{"read":["view:domain"]}'),
(8,	'SmartPanelHermes',	'{"read":["view:device_connection","view:device:device_type=\"smart_panel_hermes\""], "edit":["edit:device_connection","edit:device:device_type=\"smart_panel_hermes\""], "manage":["manage:device_connection","manage:device:device_type=\"smart_panel_hermes\""]}'),
(9,	'PVInverter',	'{"read":["view:device_connection","view:device:device_type=\"pv_inverter\""], "edit":["edit:device_connection","edit:device:device_type=\"pv_inverter\""], "manage":["manage:device_connection","manage:device:device_type=\"pv_inverter\""]}'),
(10,	'ESSHermes',	'{"read":["view:device_connection","view:device:device_type=\"ess_hermes\""], "edit":["edit:device_connection","edit:device:device_type=\"ess_hermes\""], "manage":["manage:device_connection","manage:device:device_type=\"ess_hermes\""]}'),
(11,	'ESSCloud',	'{"read":["view:device_connection","view:device:device_type=\"pomcube\""], "edit":["edit:device_connection","edit:device:device_type=\"pomcube\""], "manage":["manage:device_connection","manage:device:device_type=\"pomcube\""]}'),
(12,	'SmartMeter',	'{"read":["view:device_connection","view:device:device_type=\"smart_meter\""], "edit":["edit:device_connection","edit:device:device_type=\"smart_meter\""], "manage":["manage:device_connection","manage:device:device_type=\"smart_meter\""]}'),
(13,	'SunPhotometerHermes',	'{"read":["view:device_connection","view:device:device_type=\"sun_photometer_hermes\""], "edit":["edit:device_connection","edit:device:device_type=\"sun_photometer_hermes\""], "manage":["manage:device_connection","manage:device:device_type=\"sun_photometer_hermes\""]}'),
(14,	'CaseManagement',	'{
"read":["view:repair_order", "view:repair_item", "view:repair_record"],
"edit":["edit:repair_order", "edit:repair_item", "edit:repair_record"],
"manage":["manage:repair_order", "manage:repair_item", "manage:repair_record"],
"complete":["manage:repair_order", "manage:repair_item", "manage:repair_record"]
}'),
(15,	'RequestForm',	'{
"read":["view:repair_order", "view:repair_item", "view:repair_record"],
"edit":["edit:repair_order", "edit:repair_item", "edit:repair_record"],
"manage":["manage:repair_order", "manage:repair_item", "manage:repair_record"],
"complete":["manage:repair_order", "manage:repair_item", "manage:repair_record"]
}'),
(16,	'MaintenanceForm',	'{
"read":["view:repair_order", "view:repair_item", "view:repair_record"],
"edit":["edit:repair_order", "edit:repair_item", "edit:repair_record"],
"manage":["manage:repair_order", "manage:repair_item", "manage:repair_record"],
"complete":["manage:repair_order", "manage:repair_item", "manage:repair_record"]
}'),
(17,	'CaseClosure',	'{
"read":["view:repair_order", "view:repair_item", "view:repair_record"],
"edit":["edit:repair_order", "edit:repair_item", "edit:repair_record"],
"manage":["manage:repair_order", "manage:repair_item", "manage:repair_record"],
"complete":["manage:repair_order", "manage:repair_item", "manage:repair_record"]
}'),
(22,	'AlarmManagement',	'{
"read":["view:user","view:role","view:event"],
"edit":["edit:event"]
}'),
(23,	'DomainConfig',	'{"read":["view:domain"], "edit":["edit:domain"], "manage":["manage:domain"]}'),
(24,	'MessageBox',	'{"read":["view:mail"], "edit":["edit:mail"], "manage":["manage:mail"]}'),
(1,	'OverView',	'{"read":["view:domain","get:/domain_datas/query","get:/domain_datas/query/today"]}'),
(2,	'DeviceStatus',	'{"read":["view:domain","view:device","view:repair_order","view:repair_item","get:/device_datas/device_event"]}');


INSERT INTO "role" ("role_id", "role_name", "domain_id", "page_permission", "user_permission") VALUES
(45,	'GuestGel',	182,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":1},{"name":"ESSHermes","permission":1},{"name":"ESSCloud","permission":1},{"name":"SmartMeter","permission":1},{"name":"SunPhotometerHermes","permission":1},{"name":"AccountManagement","permission":1},{"name":"SystemInfo","permission":1}]',	'["get:/device_datas/query/last","get:/power_schedulers/4/history"]'),
(44,	'工研院API用戶',	182,	'[]',	'["get:/domain_datas/query","get:/device_datas/query","get:/power_schedulers/4","get:/domain_datas/query/today","patch:/power_schedulers/4","get:/power_schedulers/4/history","view:user","view:device","edit:domain"]'),
(35,	'guestDr',	118,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},{"name":"CaseManagement","permission":1},{"name":"RequestForm","permission":1},{"name":"MaintenanceForm","permission":1},{"name":"CaseClosure","permission":1},{"name":"AccountManagement","permission":2},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"DomainConfig","permission":1},{"name":"MessageBox","permission":1},{"name":"ESSCloud","permission":1},{"name":"ESSHermes","permission":1},{"name":"PVInverter","permission":1},{"name":"SmartMeter","permission":1},{"name":"SunPhotometerHermes","permission":1}]',	''),
(54,	'DomainTest',	118,	'[{"name":"AccountManagement","permission":2},{"name":"PermissionManagement","permission":1}]',	''),
(48,	'綠能所管理員',	182,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":2},{"name":"ECOImport","permission":3},{"name":"ECOSetup","permission":3},{"name":"DeviceInfo","permission":1},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"SunPhotometerHermes","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]',	'["get:/device_datas/query/last","get:/power_schedulers/4/history"]'),
(34,	'德叡管理員',	118,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":1},{"name":"ECOManagement","permission":3},{"name":"DeviceMap","permission":1},{"name":"DeviceInfo","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"ReportManagement","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3},{"name":"ESSCloud","permission":3},{"name":"ESSHermes","permission":3},{"name":"PVInverter","permission":3},{"name":"SmartMeter","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SunPhotometerHermes","permission":3}]',	'["get:/device_datas/query/last","get:/power_schedulers/+/history","get:/device_types"]'),
(43,	'demoDr',	118,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":2},{"name":"DeviceInfo","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"AccountManagement","permission":2},{"name":"PermissionManagement","permission":1},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3},{"name":"ESSCloud","permission":3},{"name":"ESSHermes","permission":3},{"name":"PVInverter","permission":3},{"name":"SmartMeter","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SunPhotometerHermes","permission":3}]',	''),
(53,	'創建測試',	118,	'[{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":2},{"name":"DeviceInfo","permission":1},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":2},{"name":"MaintenanceForm","permission":1},{"name":"CaseClosure","permission":1},{"name":"AccountManagement","permission":2},{"name":"SystemInfo","permission":1},{"name":"AlarmManagement","permission":1},{"name":"DomainConfig","permission":2},{"name":"MessageBox","permission":2},{"name":"ESSCloud","permission":1},{"name":"ESSHermes","permission":1},{"name":"PVInverter","permission":1},{"name":"SmartMeter","permission":1}]',	''),
(50,	'測試用權限',	118,	'[{"name":"DeviceStatus","permission":1},{"name":"AccountManagement","permission":2}]',	'');
