
CREATE TABLE "setting" (
  setting_id VARCHAR(127) PRIMARY KEY NOT NULL,
  setting_value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE "domain" (
  domain_id SERIAL PRIMARY KEY,
  domain_name VARCHAR(64) NOT NULL DEFAULT '',
  parent_domain_id INT,
  is_organization BOOLEAN NOT NULL DEFAULT false,
  address VARCHAR(255) NOT NULL DEFAULT '',
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  zoom FLOAT DEFAULT 7,
  photos TEXT NOT NULL DEFAULT '',
  feed_in_tariffs TEXT,
  feed_in_tariff_now FLOAT,
  data_sources TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (parent_domain_id) REFERENCES domain(domain_id)
);

-- page_permission: [
--     { name: "TestPage", permission: ["read", "write", "delete"] },
--     { name: "DeniedPage", permission: [] },
-- ]
CREATE TABLE "role" (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(64) NOT NULL DEFAULT '',
  domain_id INT,
  page_permission TEXT NOT NULL DEFAULT '',
  user_permission TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (domain_id) REFERENCES domain(domain_id)
);

-- CREATE TABLE "role_permission" (
--   role_permission_id SERIAL PRIMARY KEY,
--   role_id INT,
--   resource_name VARCHAR(127) NOT NULL DEFAULT '',
--   method VARCHAR(31) NOT NULL DEFAULT '',
--   condi VARCHAR(255) NOT NULL DEFAULT '',
--   FOREIGN KEY (role_id) REFERENCES role(role_id)
-- );

CREATE TABLE "page_permission" (
  page_permission_id SERIAL PRIMARY KEY,
  page_name VARCHAR(64) NOT NULL DEFAULT '',
  permissions TEXT NOT NULL DEFAULT ''
);


CREATE TABLE "user" (
  user_id SERIAL PRIMARY KEY,
  user_account VARCHAR(64) NOT NULL UNIQUE,
  user_name VARCHAR(64) NOT NULL DEFAULT '',
  user_password VARCHAR(64) NOT NULL DEFAULT '',
  domain_id INT,
  role_id INT,
  is_supplier BOOLEAN NOT NULL DEFAULT false,
  phone VARCHAR(32) NOT NULL DEFAULT '',
  email VARCHAR(63) NOT NULL DEFAULT '',
  line_notify_token VARCHAR(127) NOT NULL DEFAULT '',
  contact_name VARCHAR(64) NOT NULL DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expire_time TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domain(domain_id),
  FOREIGN KEY (role_id) REFERENCES role(role_id)
);


CREATE TABLE "device_type_category" (
  device_type_category_id SERIAL PRIMARY KEY,
  device_type_category_name VARCHAR(255) NOT NULL DEFAULT '',
  device_type_category_alias_name VARCHAR(255) NOT NULL DEFAULT ''
);


CREATE TABLE "device_type" (
  device_type_id SERIAL PRIMARY KEY,
  device_type_name VARCHAR(255) NOT NULL DEFAULT '',
  device_type_alias_name VARCHAR(255) NOT NULL DEFAULT '',
  device_type_category_id INT,
  connection_params TEXT NOT NULL DEFAULT '',
  is_energy_storage BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (device_type_category_id) REFERENCES device_type_category(device_type_category_id)
);


-- device_connection_type: {"platform", "modbus", "mqtt", "mysql", "influxdb"}
CREATE TABLE "device_connection" (
  device_connection_id SERIAL PRIMARY KEY,
  device_connection_name VARCHAR(127) NOT NULL DEFAULT '',
  device_type_id INT,
  organization_id INT,
  url TEXT,
  host VARCHAR(255),
  port INT,
  username VARCHAR(127),
  password VARCHAR(127),
  token VARCHAR(255),
  org VARCHAR(127),
  database_name VARCHAR(63),
  enabled BOOLEAN NOT NULL DEFAULT true,
  extra TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id),
  FOREIGN KEY (organization_id) REFERENCES domain(domain_id)
);


-- src_type: {
--     platform: {
--     },
--     mqtt: {
--       src_device_connection_id: 1,
--       src_topic: "/devices/+/data"
--     },
--     http: {
--       src_method: "get"
--       src_token: "xxxx-xxxx-xxxx",
--       src_url: "http://xxx.xxx.xxx/oo"
--     },
--     influxdb: {
--       src_device_connection_id: 1,
--       src_org: "my-org",
--       src_token: "xxxx-xxxx-xxxx",
--       src_query: 'from(bucket: "bucket1") |> range(start: 0, stop: 100) |> filter(fn: (r) => r["_measurement"] == "measurement1")'
--     },
--     mysql: {
--       src_device_connection_id: 1,
--       src_query: "SELECT * FROM table1"
--     },
--     modbus: {
--       // device_id
--       src_port: "12"
--     }
-- }
-- dst_type: {
--     platform_device_state: {
--       dst_organization_id: 2,
--       dst_is_device_name_from_src_topic: true,
--       dst_device_name: "/devices/+/data",
--       dst_device_state: "DeviceState",
--       dst_device_error_code: "ErrorCode",
--       dst_device_error_description: "ErrorDescription",
--       dst_template: "{const1:'const1', var1:${var1}, all_data:${_data.alldata}}"
--     },
--     platform_influxdb: {
--       dst_organization_id: 2,
--       dst_sensor_schema_id: 5,
--       dst_tags: "{tag1:${tag1}, tag2:${tag2}}",
--       dst_fields: "{field1:${field1}, field2:${field2}}",
--       dst_data_time: "2024-03-08T07:29:34.786Z"
--     },
--     mqtt: {
--       dst_device_connection_id: 1,
--       dst_topic: "/${device.device_name}/control"
--       dst_template: "{a:${a}, b:${b}, all_data:${_data.alldata}}"
--     },
--     http: {
--       dst_method: "post"
--       dst_token: "xxxx-xxxx-xxxx",
--       dst_url: "http://xxx.xxx.xxx/oo"
--       dst_template: "{a:${a}, b:${b}, all_data:${_data.alldata}}"
--     },
--     influxdb: {
--       dst_device_connection_id: 1,
--       dst_org: "my-org",
--       dst_token: "xxxx-xxxx-xxxx",
--       dst_database_name: "bucket1",
--       dst_table_name: "measurement1",
--       dst_tags: "{tag1:${tag1}, tag2:${tag2}}",
--       dst_fields: "{field1:${field1}, field2:${field2}}",
--       dst_data_time: "2024-03-08T07:29:34.786Z"
--     },
--     mysql: {
--       dst_device_connection_id: 1,
--       dst_table_name: "table1",
--       dst_fields: "{field1:${field1}, field2:${field2}}"
--     },
--     modbus: {
--       // device_id
--       dst_port: 12,
--       dst_template: "${field1}"
--     }
-- }
-- trigger_method: {"active", "passive", "cron"}
-- data_type: {"number", "text", "json"}



-- output_type: ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"}
-- device_name_field: ex: "taipei_${object1.device_sn}" or "${_mqtt_topic}"
-- device_state_field: ex: "${device_state}"
-- device_error_code_field: ex: "${errno}"
-- device_error_description_field: ex: "${err_desc}"
-- store_tags: ex: '[{tag:"place_id",source:"place_id"}, {tag:"device_sn",source:"response.device_sn"}]'
-- store_fields: ex: '[{field:"temperature",source:"temperature"}, {fieldname:"humidity",source:"data.humidity"}]'
CREATE TABLE "device_output" (
  device_output_id SERIAL PRIMARY KEY,
  device_output_name VARCHAR(127) NOT NULL DEFAULT '',
  device_type_id INT,
  output_type VARCHAR(63) NOT NULL DEFAULT '',
  path TEXT,
  data_type VARCHAR(31) NOT NULL DEFAULT 'json',
  device_state_field TEXT,
  device_error_code_field TEXT,
  device_error_description_field TEXT,
  is_store BOOLEAN NOT NULL DEFAULT false,
  properties TEXT,
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id)
);


-- data: "{const1:'const1', var1:${var1}, all_data:${_data.alldata}}"
CREATE TABLE "device_input" (
  device_input_id SERIAL PRIMARY KEY,
  device_input_name VARCHAR(127) NOT NULL DEFAULT '',
  device_type_id INT,
  input_type VARCHAR(63) NOT NULL DEFAULT '',
  method VARCHAR(63),
  path TEXT,
  data_type VARCHAR(31) NOT NULL DEFAULT 'json',
  query TEXT,
  autorun BOOLEAN NOT NULL DEFAULT false,
  run_every_second INT NULL DEFAULT 0,
  run_order INT NULL DEFAULT 0,
  response_output_id INT,
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id),
  FOREIGN KEY (response_output_id) REFERENCES device_output(device_output_id)
);


CREATE TABLE "device" (
  device_id SERIAL PRIMARY KEY,
  device_name VARCHAR(127) NOT NULL DEFAULT '',
  place_name VARCHAR(127) NOT NULL DEFAULT '',
  device_alias_name VARCHAR(127) NOT NULL DEFAULT '',
  device_type_id INT,
  device_type_category_id INT,
  device_connection_id INT,
  domain_id INT,
  address VARCHAR(255) NOT NULL DEFAULT '',
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  is_online BOOLEAN NOT NULL DEFAULT false,
  output_power_capacity FLOAT,
  bat_capacity FLOAT,
  solar_capacity FLOAT,
  solar_area FLOAT,
  solar_eff FLOAT,
  device_state VARCHAR(31) NOT NULL DEFAULT '',
  error_code VARCHAR(63) NOT NULL DEFAULT '',
  error_description TEXT NOT NULL DEFAULT '',
  last_data TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT false,
  external_devices TEXT NOT NULL DEFAULT '',
  extra TEXT NOT NULL DEFAULT '',
  install_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_connect_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id),
  FOREIGN KEY (device_type_category_id) REFERENCES device_type_category(device_type_category_id),
  FOREIGN KEY (device_connection_id) REFERENCES device_connection(device_connection_id),
  FOREIGN KEY (domain_id) REFERENCES domain(domain_id)
);


CREATE TABLE "power_scheduler" (
  power_scheduler_id SERIAL PRIMARY KEY,
  domain_id INT,
  device_id INT,
  timezone VARCHAR(31),
  crons TEXT,
  notify_user_id INT,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  start_time TIMESTAMP,
  stop_time TIMESTAMP,
  running BOOLEAN NOT NULL DEFAULT false,
  info TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT false,
  FOREIGN KEY (domain_id) REFERENCES domain(domain_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id),
  FOREIGN KEY (notify_user_id) REFERENCES "user"(user_id)
);


CREATE TABLE "scheduler" (
  scheduler_id SERIAL PRIMARY KEY,
  scheduler_name VARCHAR(127) NOT NULL DEFAULT '',
  organization_id INT,
  device_type_id INT,
  device_input_id INT,
  device_id INT,
  cron VARCHAR(63),
  FOREIGN KEY (organization_id) REFERENCES domain(domain_id),
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id),
  FOREIGN KEY (device_input_id) REFERENCES device_input(device_input_id)
);


CREATE TABLE "repair_type" (
  repair_type_id SERIAL PRIMARY KEY,
  repair_type_name VARCHAR(255) NOT NULL DEFAULT '',
  device_type_id INT,
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id)
);


CREATE TABLE "repair_order" (
  repair_order_id SERIAL PRIMARY KEY,
  domain_id INT,
  creator_id INT,
  title VARCHAR(127) NOT NULL DEFAULT '',
  contact_name VARCHAR(63) NOT NULL DEFAULT '',
  contact_phone VARCHAR(31) NOT NULL DEFAULT '',
  contact_email VARCHAR(127) NOT NULL DEFAULT '',
  priority INT NOT NULL DEFAULT 0,
  custom_description TEXT NOT NULL DEFAULT '',
  repair_description TEXT NOT NULL DEFAULT '',
  expect_end_date DATE,
  repair_order_state VARCHAR(31) NOT NULL DEFAULT '',
  repair_order_type VARCHAR(31) NOT NULL DEFAULT '',
  completeness FLOAT NOT NULL DEFAULT 0,
  photos TEXT NOT NULL DEFAULT '',
  supplier_id INT,
  assign_user_id INT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES "domain"(domain_id),
  FOREIGN KEY (creator_id) REFERENCES "user"(user_id),
  FOREIGN KEY (supplier_id) REFERENCES "user"(user_id),
  FOREIGN KEY (assign_user_id) REFERENCES "user"(user_id)
);

CREATE TABLE "repair_order_history" (
  repair_order_history_id SERIAL PRIMARY KEY,
  repair_order_id INT,
  repair_item_id INT,
  repair_record_id INT,
  user_id INT,
  user_name VARCHAR(64) NOT NULL DEFAULT '',
  table_name VARCHAR(64) NOT NULL DEFAULT '',
  difference TEXT NOT NULL DEFAULT '',
  snapshot TEXT NOT NULL DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id),
  FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);


CREATE TABLE "repair_item" (
  repair_item_id SERIAL PRIMARY KEY,
  repair_order_id INT,
  repair_type_id INT,
  description TEXT NOT NULL DEFAULT '',
  repair_item_state VARCHAR(31) NOT NULL DEFAULT '',
  device_id INT,
  expect_end_date DATE,
  completeness FLOAT NOT NULL DEFAULT 0,
  photos TEXT NOT NULL DEFAULT '',
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repair_type_id) REFERENCES repair_type(repair_type_id),
  FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id),
  FOREIGN KEY (device_id) REFERENCES device(device_id)
);

-- 
-- snapshot: {
--     order: {
--         repair_order_id: 15,
--         title: 'order1',
--         ...
--     },
--     items: [
--         {
--             repair_item_id: 22,
--             description: "item1",
--             ...
--         }
--     ]
-- }
-- 
-- 

CREATE TABLE "repair_record" (
  repair_record_id SERIAL PRIMARY KEY,
  repair_order_id INT,
  repair_item_id INT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  description TEXT NOT NULL DEFAULT '',
  photos TEXT NOT NULL DEFAULT '',
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id),
  FOREIGN KEY (repair_item_id) REFERENCES repair_item(repair_item_id)
);

CREATE TABLE "repair_user_record" (
  repair_user_record_id SERIAL PRIMARY KEY,
  repair_record_id INT,
  user_id INT,
  FOREIGN KEY (repair_record_id) REFERENCES repair_record(repair_record_id),
  FOREIGN KEY (user_id) REFERENCES "user"(user_id)
);


CREATE TABLE "mail" (
  mail_id SERIAL PRIMARY KEY,
  mail_type VARCHAR(63) NOT NULL DEFAULT '',
  user_id INT,
  content TEXT NOT NULL DEFAULT '',
  readed BOOLEAN NOT NULL DEFAULT false,
  repair_order_id INT,
  device_id INT,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE SET NULL,
  FOREIGN KEY (repair_order_id) REFERENCES repair_order(repair_order_id) ON DELETE SET NULL,
  FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE SET NULL
);

-- event_type: {"user", "device", "repair_order"}
-- notifys: [{"user_id":3, "mail":true, "email":true, "line_notify":true}]
CREATE TABLE "event" (
  event_id SERIAL PRIMARY KEY,
  event_name VARCHAR(63) NOT NULL DEFAULT '',
  event_type VARCHAR(63) NOT NULL DEFAULT '',
  domain_id INT,
  device_type_id INT,
  device_output_id INT,
  device_name VARCHAR(127) NOT NULL DEFAULT '',
  compare_function TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  not_trigger_second INT NOT NULL DEFAULT 0,
  trigger_onchange BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT false,
  notifys TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (domain_id) REFERENCES domain(domain_id),
  FOREIGN KEY (device_type_id) REFERENCES device_type(device_type_id),
  FOREIGN KEY (device_output_id) REFERENCES device_output(device_output_id)
);

-- ALTER SEQUENCE device_output_device_output_id_seq RESTART WITH 11