
INSERT INTO "role" ("role_id", "role_name", "domain_id", "page_permission", "user_permission") VALUES
(1,	'root',	1,	'[{"name":"OverView","permission":3},{"name":"DeviceStatus","permission":3},{"name":"StatusMonitor","permission":3},{"name":"SecurityMonitor","permission":3},{"name":"ECOImport","permission":3},{"name":"ECOSetup","permission":3},{"name":"DeviceInfo","permission":3},{"name":"PVInverter","permission":3},{"name":"ESSHermes","permission":3},{"name":"ESSCloud","permission":3},{"name":"SmartPanelHermes","permission":3},{"name":"SmartMeter","permission":3},{"name":"SunPhotometerHermes","permission":3},{"name":"CaseManagement","permission":4},{"name":"RequestForm","permission":4},{"name":"MaintenanceForm","permission":4},{"name":"CaseClosure","permission":4},{"name":"PowerGeneration","permission":3},{"name":"AccountManagement","permission":3},{"name":"PermissionManagement","permission":3},{"name":"SystemInfo","permission":3},{"name":"AlarmManagement","permission":3},{"name":"DomainConfig","permission":3},{"name":"MessageBox","permission":3}]',	'["all_perm","view:role","get:/device_datas/query/last","get:/power_schedulers/4/history","get:/device_datas/+/+/write","get:/device_types"]');

ALTER SEQUENCE role_role_id_seq RESTART WITH 2;

INSERT INTO "domain" ("domain_id", "domain_name", "parent_domain_id", "is_organization", "address", "lat", "lng", "zoom", "photos", "feed_in_tariff_now", "feed_in_tariffs", "data_sources") VALUES
(1,	'root',	NULL,	'f',	'',	23.83057624,	120.93750000,	8,	'',	NULL,	NULL,	''),
(2,	'recycle',	1,	't',	'',	0.00000000,	0.00000000,	5,	'',	NULL,	NULL,	'');

ALTER SEQUENCE domain_domain_id_seq RESTART WITH 3;

INSERT INTO "user" ("user_id", "user_account", "user_name", "user_password", "domain_id", "role_id", "is_supplier", "phone", "email", "contact_name", "create_time", "line_notify_token", "expire_time") VALUES
(1,	'admin',	'root管理員',	'Dr90098551',	1,	1,	'f',	'',	'',	'',	'2024-02-22 06:00:00',	'',	NULL);

ALTER SEQUENCE user_user_id_seq RESTART WITH 2;

INSERT INTO "device_type_category" ("device_type_category_id", "device_type_category_name", "device_type_category_alias_name") VALUES
(1,	'ess',	'ESS'),
(2,	'pv',	'PV'),
(3,	'smart_meter',	'SmartMeter'),
(4,	'smart_panel',	'SmartPanel'),
(5,	'sun_photometer',	'Sun Photometer');

ALTER SEQUENCE device_type_category_device_type_category_id_seq RESTART WITH 6;


INSERT INTO "device_type" ("device_type_id", "device_type_name", "device_type_alias_name", "device_type_category_id", "connection_params", "is_energy_storage") VALUES
(2,	'smart_panel_hermes',	'SmartPanelHermes',	4,	'',	't'),
(3,	'smart_pole',	'SmartPole',	NULL,	'',	't'),
(4,	'charging_pile',	'ChargingPile',	NULL,	'',	't'),
(6,	'pomcube',	'ESSCloud',	1,	'',	't'),
(8,	'pv_inverter',	'PVInverter',	2,	'',	't'),
(9,	'smart_meter',	'SmartMeter',	3,	'',	'f'),
(10,	'ess_hermes',	'ESSHermes',	1,	'',	't'),
(11,	'sun_photometer_hermes',	'SunPhotometerHermes',	5,	'',	'f');

ALTER SEQUENCE device_type_device_type_id_seq RESTART WITH 12;

INSERT INTO "device_output" ("device_output_id", "device_output_name", "device_type_id", "output_type", "path", "data_type", "device_state_field", "device_error_code_field", "device_error_description_field", "is_store", "properties") VALUES
(10,	'hermes_today_power_value',	10,	'mqtt',	'/HERMES/+/ESS/+/today-power-value',	'json',	NULL,	NULL,	NULL,	't',	'{
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
(1,	'hermes_event',	10,	'mqtt',	'/HERMES/+/ESS/+/error',	'json',	NULL,	'ErrorCode',	'ErrorDescription',	't',	'{
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
(11,	'hermes_smart_panel',	2,	'mqtt',	'/HERMES/+/SMARTPANEL/+/data',	'json',	'(Status=="Operational" || Status=="Standby")?"running":"error"',	NULL,	NULL,	't',	'{
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
(9,	'hermes_smartmeter_data',	9,	'mqtt',	'/HERMES/+/SMARTMETER/+/data',	'json',	'(device_state!=null)?device_state:((Status=="Operational" || Status=="Standby")?"running":"error")',	NULL,	NULL,	't',	'{
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
  "Phase": {
    "tag": true,
    "type": "string"
  },
  "Status": {
    "type": "string"
  },
  "Voltage": {},
  "Current": {},
  "Frequency": {},
  "Active_Power": {},
  "Apparent_Power": {},
  "Reactive_Power": {},
  "Power_Factor": {},
  "Power": {},
  "InputEnergy": {},
  "OutputEnergy": {}
}'),
(2,	'pomcube_data',	6,	'mqtt',	'/pomcube/k3/1/report',	'json',	NULL,	NULL,	NULL,	't',	'{
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "device_sn"
  },
  "PlaceName": {"type": "string"},
  "BatteryChargeEnergy": {"src": "BatteryToTotal/1000"},
  "BatteryDischargeEnergy": {"src": "BatteryFromTotal/1000"},
  "GridSellEnergy": {"src": "GridToTotal/1000"},
  "GridPurchaseEnergy": {"src": "GridFromTotal/1000"},
  "LoadEnergy": {"src": "LoadToTotal/1000"},
  "SolarEnergy": {"src": "PVTotal/1000"},
  "GenEnergy": {"src": "GeneratorFromTotal/1000"},
  "SolarPower": {"src": "SolarPower"},
  "GenPower": {"src": "GenPower"},
  "LoadPower": {"src": "LoadPower"},
  "GridPower": {"src": "GridPower"},
  "BatSoC": {"src": "SOC/10"},
  "EnvTemp1": {"src": "MinCellTemp/10"},
  "EnvTemp2": {"src": "MaxCellTemp/10"},
  "BatCurr": {"src": "TotalCurr/100"},
  "BatVolt": {"src": "TotalVolt/100"},
  "BatteryPower": {"src": "BatteryPower"}
}'),
(13,	'hermes_pv_inverter_data',	8,	'mqtt',	'/HERMES/+/PV/+/data',	'json',	'(Status=="Operational" || Status=="Operating" || Status=="Standby" || Status=="Power Saving")?"running":(Status=="Warning"?"warning":"error")',	NULL,	NULL,	't',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "PV_ID"
  },
  "Status": {},
  "SolarPower": {},
  "SolarEnergy": {},
  "Irradiance": {
    "external": {
      "device_output_name": "hermes_sun_photometer_data",
      "field": "Irradiance"
    }
  },
  "Temperature": {
    "external": {
      "device_output_name": "hermes_sun_photometer_data",
      "field": "Temperature"
    }
  }
}'),
(14,	'hermes_sun_photometer_data',	11,	'mqtt',	'/HERMES/+/SunPhotometer/+/data',	'json',	'(Status=="Operational" || Status=="Operating" || Status=="Standby")?"running":(Status=="Warning"?"warning":"error")',	NULL,	NULL,	't',	'{
  "time": {
    "type": "string",
    "format": "date-time",
    "src": "Timestamp"
  },
  "DeviceName": {
    "tag": true,
    "type": "string",
    "src": "SunPhotometer_ID"
  },
  "Status": {"type": "string"},
  "Irradiance": {},
  "Temperature": {}
}'),
(12,	'hermes_ess_data',	10,	'mqtt',	'/HERMES/+/ESS/+/data',	'json',	'(Status=="Operational" || Status=="Standby" || Status=="Power Saving")?"running":"error"',	NULL,	NULL,	't',	'{
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
  "GridSellPower": {},
  "GridPurchasePower": {},
  "GridPower": {"src": "(()=>{if (GridPurchasePower!=null && GridSellPower!=null) {return GridPurchasePower-GridSellPower} if (GridPurchasePower!=null && GridSellPower==null) {return GridPurchasePower} if (GridPurchasePower==null && GridSellPower!=null) {return -GridSellPower} return null;})()"},
  "LoadPower": {},
  "SolarPower": {},
  "BatteryDischargePower": {},
  "BatteryChargePower": {},
  "BatteryPower": {"src": "(()=>{ if (BatteryChargePower!=null && BatteryDischargePower!=null) {return BatteryChargePower-BatteryDischargePower} if (BatteryChargePower!=null && BatteryDischargePower==null) {return BatteryChargePower} if (BatteryChargePower==null && BatteryDischargePower!=null) {return -BatteryDischargePower} return null; })()"},
  "GenEnergy": {},
  "GridSellEnergy": {},
  "GridPurchaseEnergy": {},
  "GridEnergy": {"src": "(()=>{ if (GridPurchaseEnergy!=null && GridSellEnergy!=null) {return GridPurchaseEnergy-GridSellEnergy} if (GridPurchaseEnergy!=null && GridSellEnergy==null) {return GridPurchaseEnergy} if (GridPurchaseEnergy==null && GridSellEnergy!=null) {return -GridSellEnergy} return null; })()"},
  "LoadEnergy": {},
  "SolarEnergy": {},
  "BatteryDischargeEnergy": {},
  "BatteryChargeEnergy": {},
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
  "Irradiance2": {},
  "Irradiance3": {},
  "PR": {}
}');

ALTER SEQUENCE device_output_device_output_id_seq RESTART WITH 15;