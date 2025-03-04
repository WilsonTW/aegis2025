
# AEGIS 系統簡介及安裝

## 系統簡介
這是一個包含維運的電力管理系統

## 相關服務
此系統需搭配 postgres, influxdb, nodered 等背景服務才能運作。此處以 Docker 方式在背景服務，詳細定義在"docker-compose.yml"，可用下方指令開關背景服務

> 啟動背景服務
```bash
./start_docker.sh
```

> 停止背景服務
```bash
./stop_docker.sh
```


## AEGIS 安裝

### 安裝 nodejs
此程式由 nodejs 寫成，請先到 nodejs 官網下載並安裝

### 安裝相關套件
```bash
$ npm install
```

### 在 macOS 可能出現 canvas 無法安裝的問題 (若無問題可跳過)
> 安裝 node-gyp
```
sudo npm install -g npm
sudo npm install -g node-gyp
```

> 安裝系統套件
```
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas
```

> 若還是有問題,從原始碼編譯 (沒問題可跳過)
```
npm install canvas --build-from-source
```

### 創建root
```
http://127.0.0.1:8080
```

```
Login:
System: PostgreSQL
Server: aegis_postgres
Username: postgres
Password: abcd1234
```
```
DB: aegis -> user -> New item
user_account: root
user_name: root
user_password: 123456
```

### 創建tables
```
psql -h 127.0.0.1 -U postgres -d aegis
```
複製aegis_db_postgres.sql檔案的內容，貼上執行

## 執行

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API 測試網頁

- Restful API - [http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)

- GraphQL - [http://127.0.0.1:3000/graphql](http://127.0.0.1:3000/graphql)


## 登入系統 - POST "/auth/login"
  - API說明：
    - 用來登入系統
  - HTTP Header：
    - Content-Type: application/json
  - 欄位說明：
    - user_account: 帳號
    - user_password: 密碼

欄位範例：
```javascript
{
  "user_account": "admin",
  "user_password": "xxx"
}
```

傳回結果：
```javascript
{
  "access_token": "ey.123.xx",
  "user_id": 2,
  "user_name": "Accton Admin",
  "role_id": 2,
  "domain_id": 2,
  "domain_name": "taipei",
  "organization_id": 2
}
```

## Restful API 測試
> 查詢裝置資料
  - GET "/api/domains"
    - HTTP Header：
      - Authorization: login 傳回來的 access_token。例如: "Bearer ey.123.xx"
  - 傳回
```
[
  {
    "domain_id": 48,
    "domain_name": "Test-domain",
    "parent_domain_id": 2,
    "is_organization": false,
    "address": "",
    "lat": "23.75518177",
    "lng": "120.80566406",
    "zoom": 7,
    "photos": "",
    "feed_in_tariffs": null,
    "feed_in_tariff_now": null
  }
]
```

## GraphQL 測試
> 取得 device 狀態
 - 用瀏覽器打開 [http://127.0.0.1:3000/graphql](http://127.0.0.1:3000/graphql)
 - 左方輸入
```graphql
query {
  device(device_id:1) {
    device_state
  }
}
```
 - 按中央的三角形查詢傳回下面結果
```
"data": {
  "device": {
    "device_state": "running"
  }
}
```

<div class="page"/>

# 資料庫

## 資料表定義
| Name                   | Description    |
|------------------------|----------------|
| Setting                | 設置           |
| Domain                 | 域             |
| Role                   | 角色           |
| Role Permission        | 角色權限       |
| User                   | 用戶           |
| Device Type            | 裝置類型       |
| Device Connection      | 裝置連線       |
| Device Output          | 裝置輸出       |
| Device Input           | 裝置輸入       |
| Device                 | 裝置           |
| Scheduler              | 排程器         |
| Repair Type            | 維修類型       |
| Repair Order           | 維修訂單       |
| Repair Item            | 維修項目       |
| Repair Order History   | 維修訂單歷史   |
| Repair Record          | 維修記錄       |
| Repair User Record     | 維修派工記錄   |
| Mail                   | 郵件           |
| Event                  | 事件           |

<div class="page"/>

## 資料庫關聯圖

![Database](./document/aegis_db.png "Database")



## Setting (設置)

### 說明
用來儲存設置的鍵值對

### 欄位定義
| Name          | Type          | Description    |
|---------------|---------------|----------------|
| setting_id    | VARCHAR(127)  | 設置ID         |
| setting_value | TEXT          | 設置值         |

---

## Domain (域)

### 說明
定義系統中的域，支持層級結構

### 欄位定義
| Name                    | Type            | Description        |
|-------------------------|-----------------|--------------------|
| domain_id               | SERIAL          | 域ID               |
| domain_name             | VARCHAR(64)     | 域名稱             |
| parent_domain_id        | INT             | 父域ID             |
| is_organization         | BOOLEAN         | 是否為組織         |
| address                 | VARCHAR(255)    | 地址               |
| lat                     | DECIMAL(10,8)   | 緯度               |
| lng                     | DECIMAL(11,8)   | 經度               |
| zoom                    | FLOAT           | 地圖縮放級別       |
| photos                  | TEXT            | 照片               |
| feed_in_tariffs          | TEXT            | 躉售費率           |
| feed_in_tariff_now       | FLOAT           | 當前躉售費率       |

---

### 其它 API
  - PUT /api/domains/{domain_id}/replace_photo
    - 說明: domain 照片上傳
    - 參數:
      - domain_id: 域ID
      - multipart/form-data
        - file: 要上傳的照片

## Role (角色)

### 說明
定義角色和其所屬域的權限

### 欄位定義
| Name             | Type           | Description      |
|------------------|----------------|------------------|
| role_id          | SERIAL         | 角色ID           |
| role_name        | VARCHAR(64)    | 角色名稱         |
| domain_id        | INT            | 所屬域ID         |
| page_permission  | TEXT           | 頁面權限         |

---

## User (用戶)

### 說明
系統中的用戶信息

### 欄位定義
| Name                | Type           | Description       |
|---------------------|----------------|-------------------|
| user_id             | SERIAL         | 用戶ID            |
| user_account        | VARCHAR(64)    | 用戶帳號          |
| user_name           | VARCHAR(64)    | 用戶名稱          |
| user_password       | VARCHAR(64)    | 用戶密碼          |
| domain_id           | INT            | 所屬域ID          |
| role_id             | INT            | 角色ID            |
| is_supplier         | BOOLEAN        | 是否為供應商      |
| phone               | VARCHAR(32)    | 電話              |
| email               | VARCHAR(63)    | 電子郵件          |
| line_notify_token   | VARCHAR(127)   | Line 通知令牌     |
| contact_name        | VARCHAR(64)    | 聯絡人名稱        |
| create_time         | TIMESTAMP      | 創建時間          |

---

## Device Type Category (裝置類型群組)

### 說明
用來定義裝置的類型群組

### 欄位定義
| Name                             | Type           | Description       |
|----------------------------------|----------------|-------------------|
| device_type_category_id          | SERIAL         | 裝置類型群組 ID     |
| device_type_category_name        | VARCHAR(255)   | 裝置類型群組名稱     |
| device_type_category_alias_name  | VARCHAR(255)   | 裝置類型群組別名     |

---

## Device Type (裝置類型)

### 說明
用來定義裝置的類型

### 欄位定義
| Name                    | Type           | Description      |
|-------------------------|----------------|------------------|
| device_type_id          | SERIAL         | 裝置類型ID       |
| device_type_name        | VARCHAR(255)   | 裝置類型名稱     |
| device_type_alias_name  | VARCHAR(255)   | 裝置類型別名     |
| connection_params       | TEXT           | 連線時需要的參數 |
| is_energy_storage       | BOOLEAN        | 是否為儲能裝置   |

---

## Device Connection (裝置連線)

### 說明
定義裝置的連線配置, 例如 mqtt 或 mysql 等需要常連線的連線方式必須使用

### 欄位定義
| Name                    | Type           | Description         |
|-------------------------|----------------|---------------------|
| device_connection_id    | SERIAL         | 裝置連線ID          |
| device_connection_name  | VARCHAR(127)   | 裝置連線名稱        |
| device_type_id          | INT            | 裝置類型ID          |
| organization_id         | INT            | 組織ID              |
| url                     | TEXT           | 連接URL            |
| host                    | VARCHAR(255)   | 主機               |
| port                    | INT            | 埠號               |
| username                | VARCHAR(127)   | 使用者名稱         |
| password                | VARCHAR(127)   | 密碼               |
| token                   | VARCHAR(255)   | 令牌               |
| org                     | VARCHAR(127)   | 組織               |
| database_name           | VARCHAR(63)    | 數據庫名稱         |
| enabled                 | BOOLEAN        | 是否啟用           |
| extra                   | TEXT           | 額外信息           |

---


## Device Output (裝置輸出)

### 說明
定義裝置的輸出信息

### 欄位定義
| Name                         | Type           | Description                 |
|------------------------------|----------------|-----------------------------|
| device_output_id             | SERIAL         | 裝置輸出ID                  |
| device_output_name           | VARCHAR(127)   | 裝置輸出名稱                |
| device_type_id               | INT            | 裝置類型ID                  |
| output_type                  | VARCHAR(63)    | 輸出類型, ex: one of {"mqtt", "modbus", "http"} |
| path                         | TEXT           | 路徑。 <pre>當 "output_type" 為下面值的範例:<br>modbus: 用來指定 modbus device_id. ex:"1"<br>mqtt: 用來指定 mqtt topic. ex:"/path/to/topic1"<br>http: 用來指定 http url. ex:"http://127.0.0.1:3000/test.html"</pre>|
| data_type                    | VARCHAR(31)    | 數據類型 ex: one of {"text", "json"} |
| device_state_field           | VARCHAR(63)    | 更新 device_state 的欄位 |
| device_error_code_field      | VARCHAR(63)    | 更新 device_error_code 的欄位 |
| device_error_description_field | TEXT          | 更新 device_error_description 的欄位 |
| is_store                     | BOOLEAN        | 是否儲存                    |
| store_tags                   | TEXT           | <pre>influxdb tag<br>ex:[<br>{"tag":"place_name","source":"device_order"}, {"tag":"device_name","source":"device_name"}, {"tag":"device_sn","source":"device_sn"}<br>]</pre> |
| store_fields                 | TEXT           | <pre>influxdb field<br>ex:[<br>{"field":"LoadPower","source":"LoadPower"}, {"field":"SOC","source":"SOC"}<br>]</pre> |
| data_schema                  | TEXT           | 數據模式                    |

---

### data_schema
data_schema 須符合 "json schema" 的規範, 請參照下面網址:
- JSON Schema: https://json-schema.org/
- JSON Schema Builder: https://bjdash.github.io/JSON-Schema-Builder/
- JSON Schema validator: https://github.com/ajv-validator/ajv

下面範例中 "productId" 和 "productName" 為欄位名稱，型態分別為整數和字串。

```json
{
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date"
    },
    "updatedDateTime": {
      "type": "string",
      "format": "date-time"
    },
  }
}
```

```json
{   
  "type": "array",
  "items": {
    "type": "string"
  },
  "minItems": 1
}
```






## Device Input (裝置輸入) (目前未實做)

### 說明
定義裝置的輸入信息

### 欄位定義
| Name                         | Type           | Description                 |
|------------------------------|----------------|-----------------------------|
| device_input_id              | SERIAL         | 裝置輸入ID                  |
| device_input_name            | VARCHAR(127)   | 裝置輸入名稱                |
| device_type_id               | INT            | 裝置類型ID                  |
| input_type                   | VARCHAR(63)    | 輸入類型ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"} |
| method                       | VARCHAR(63)    | 存取方式 ex: one of {"get", "post", "patch", "put", "delete"} |
| path                         | TEXT           | 路徑                        |
| data_type                    | VARCHAR(31)    | 數據類型 ex: one of {"text", "json"} |
| query                        | TEXT           | 查詢語法                      |
| autorun                      | BOOLEAN        | 是否自動運行                |
| run_every_second             | INT            | 每秒運行                   |
| run_order                    | INT            | 運行順序                    |
| response_output_id           | INT            | 當 "input_type" 使用 "http" 時, 觸發的回應 output 處理方式 |

---

### query 查詢語法說明

"query" 及 "path" 欄位可用 "${xxx}" 來替換變數, 目前可用的項目如下：
  - ${param.xxx} 會被替換成 "/device_types/{device_type_id}/trigger" API 中的 "param.xxx" 欄位
  - ${device.device_name} 會被替換成 "/device_types/{device_type_id}/trigger" API 中, "domain_id" 及 "device_name" 所包含的裝置名稱

當 "input_type" 為下面值的範例:
```
modbus:
  path:
    1
  query:
    123

mqtt:
  path:
    /devices/${device.device_name}/control
  query:
    data_type=="text"
      ${param}
    data_type=="json"
      {const1:'const1', var1:${param.var1}, all_data:${data}}

http:
  method:
    post
  path:
    /devices/${device.device_name}/control
  query:
    data_type=="text"
      ${param}
    data_type=="json"
      {const1:'const1', var1:${param.var1}, all_data:${data}}


mysql:
  query:
    SELECT * FROM user

influxdb:
  query:
    from(bucket: "bucket1") \|> range(start: 0, stop: 100) \|> filter(fn: (r) => r["_measurement"] == "measurement1")
```


## Device (裝置)

### 說明
定義裝置的信息

### 欄位定義
| Name                         | Type           | Description                 |
|------------------------------|----------------|-----------------------------|
| device_id                    | SERIAL         | 裝置ID                      |
| device_name                  | VARCHAR(127)   | 裝置名稱                    |
| place_name                   | VARCHAR(127)   | 地點名稱                    |
| device_alias_name            | VARCHAR(127)   | 裝置別名                    |
| device_type_category_id      | INT            | 裝置類型群組 ID              |
| device_type_id               | INT            | 裝置類型ID                  |
| device_connection_id         | INT            | 裝置連線ID                  |
| domain_id                    | INT            | 所屬域ID                    |
| address                      | VARCHAR(255)   | 地址                        |
| lat                          | DECIMAL(10,8)  | 緯度                        |
| lng                          | DECIMAL(11,8)  | 經度                        |
| is_online                    | BOOLEAN        | 是否在線                    |
| output_power_capacity        | FLOAT          | 輸出功率容量                |
| bat_capacity                 | FLOAT          | 電池容量                    |
| solar_capacity               | FLOAT          | 太陽能容量                  |
| solar_area                   | FLOAT          | 太陽能面積                  |
| solar_eff                    | FLOAT          | 太陽能效率                  |
| device_state                 | VARCHAR(31)    | 裝置狀態                    |
| error_code                   | VARCHAR(63)    | 錯誤代碼                    |
| error_description            | TEXT           | 錯誤描述                    |
| last_data                    | TEXT           | 最後數據                    |
| enabled                      | BOOLEAN        | 是否啟用                    |
| extra                        | TEXT           | 額外信息                    |
| install_time                 | TIMESTAMP      | 安裝時間                    |
| create_time                  | TIMESTAMP      | 創建時間                    |
| last_connect_time            | TIMESTAMP      | 最後連接時間                |

---

### device_state
  - 正常運作中 running
  - 警告 warning
  - 錯誤 error


## Scheduler (排程器) (目前未實做)

### 說明
定義排程器的排程信息

### 欄位定義
| Name                    | Type           | Description       |
|-------------------------|----------------|-------------------|
| scheduler_id           | SERIAL         | 排程器ID          |
| scheduler_name         | VARCHAR(127)   | 排程器名稱        |
| organization_id        | INT            | 組織ID            |
| device_type_id         | INT            | 裝置類型ID        |
| device_input_id        | INT            | 要觸發的裝置輸入ID  |
| device_id              | INT            | 裝置ID            |
| cron                   | VARCHAR(63)    | CRON 表達式       |

---


### cron 設定範例
```
# 每天早上 8 點 30 分執行
30 08 * * *

# 每週日下午 6 點 30 分執行
30 18 * * 0

# 每週日下午 6 點 30 分執行
30 18 * * Sun

# 每年 6 月 10 日早上 8 點 30 分執行
30 08 10 06 *

# 每月 1 日、15 日、29 日晚上 9 點 30 分各執行一次
30 21 1,15,29 * *

# 每隔 10 分鐘執行一次
*/10 * * * *

# 從早上 9 點到下午 6 點，凡遇到整點就執行
00 09-18 * * *
```


## Repair Type (維修類型)

### 說明
定義維修類型

### 欄位定義
| Name                    | Type           | Description       |
|-------------------------|----------------|-------------------|
| repair_type_id          | SERIAL         | 維修類型ID        |
| repair_type_name        | VARCHAR(255)   | 維修類型名稱      |
| device_type_id          | INT            | 裝置類型ID        |

---


### 傳送資料給裝置

POST /device_types/{device_type_id}/trigger
```javascript
{
  "domain_id": 3, // (選填) 傳送給此 domain 下所有裝置
  "device_name": "device1", // (選填) 傳送單一裝置
  "device_input_id": 1, // (必填) 裝置的哪個輸入端
  "param": {"temp":12}  // (選填) 帶入參數, 可將 "DeviceInput" 中, "path" 及 "query" 中的 ${param.temp} 替換成 12
}
```


## Repair Order (維修訂單)

### 說明
維修訂單的詳細信息

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| repair_order_id         | SERIAL         | 維修訂單ID            |
| domain_id               | INT            | 所屬域ID              |
| creator_id              | INT            | 創建者ID              |
| title                   | VARCHAR(127)   | 標題                  |
| contact_name            | VARCHAR(63)    | 聯絡人名稱            |
| contact_phone           | VARCHAR(31)    | 聯絡電話              |
| contact_email           | VARCHAR(127)   | 聯絡郵件              |
| priority                | INT            | 優先級                |
| custom_description      | TEXT           | 自定義描述            |
| repair_description      | TEXT           | 維修描述              |
| expect_end_date         | DATE           | 預期完成日期          |
| repair_order_state      | VARCHAR(31)    | 維修訂單狀態          |
| repair_order_type       | VARCHAR(31)    | 維修訂單類型          |
| completeness            | FLOAT          | 完整性                |
| photos                  | TEXT           | 照片                  |
| supplier_id             | INT            | 供應商ID              |
| assign_user_id          | INT            | 指派用戶ID            |
| start_time              | TIMESTAMP      | 開始時間              |
| end_time                | TIMESTAMP      | 結束時間              |
| create_time             | TIMESTAMP      | 創建時間              |

---



### repair_order_state, repair_order_type

- 故障回報單 report_order
  - 待處理 pending
  - 已拒絕 rejected

- 維修單 repair_order
  - 未派工 not_dispatched
  - 待處理 pending
  - 維修中 repairing
  - 維修完成 completed

- 已結案 closed
  - 正常結案 normal
  - 異常結案 abnormal


### 其它 API
  - PUT /api/repair_orders/{repair_order_id}/replace_photo
    - 說明: repair_order 照片上傳
    - 參數:
      - repair_order_id: repair_order ID
      - multipart/form-data
        - file: 要上傳的照片


## Repair Item (維修項目)

### 說明
維修訂單中的維修項目

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| repair_item_id          | SERIAL         | 維修項目ID            |
| repair_order_id         | INT            | 維修訂單ID            |
| repair_type_id          | INT            | 維修類型ID            |
| description             | TEXT           | 描述                  |
| repair_item_state       | VARCHAR(31)    | 維修項目狀態          |
| device_id               | INT            | 裝置ID                |
| expect_end_date         | DATE           | 預期完成日期          |
| completeness            | FLOAT          | 完整性                |
| photos                  | TEXT           | 照片                  |
| start_time              | TIMESTAMP      | 開始時間              |
| end_time                | TIMESTAMP      | 結束時間              |
| create_time             | TIMESTAMP      | 創建時間              |

---

## Repair Order History (維修訂單歷史)

### 說明
維修訂單的歷史紀錄

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| repair_order_history_id | SERIAL         | 維修訂單歷史ID        |
| repair_order_id         | INT            | 維修訂單ID            |
| user_id                 | INT            | 用戶ID                |
| snapshot                | TEXT           | 快照                  |
| create_time             | TIMESTAMP      | 創建時間              |

---

## Repair Record (維修記錄)

### 說明
維修記錄的詳細信息

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| repair_record_id        | SERIAL         | 維修記錄ID            |
| repair_order_id         | INT            | 維修訂單ID            |
| repair_item_id          | INT            | 維修項目ID            |
| start_time              | TIMESTAMP      | 開始時間              |
| end_time                | TIMESTAMP      | 結束時間              |
| description             | TEXT           | 描述                  |
| photos                  | TEXT           | 照片                  |
| create_time             | TIMESTAMP      | 創建時間              |
| update_time             | TIMESTAMP      | 更新時間              |

---

### 其它 API
  - PUT /api/repair_records/{repair_record_id}/replace_photo
    - 說明: repair_record 照片上傳
    - 參數:
      - repair_record_id: repair_record ID
      - multipart/form-data
        - file: 要上傳的照片


## Repair User Record (維修派工記錄)

### 說明
維修派工記錄

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| repair_user_record_id   | SERIAL         | 派工記錄ID        |
| repair_record_id        | INT            | 維修記錄ID            |
| user_id                 | INT            | 用戶ID                |

---

## Mail (郵件)

### 說明
用於管理郵件通知

### 欄位定義
| Name                    | Type           | Description           |
|-------------------------|----------------|-----------------------|
| mail_id                | SERIAL         | 郵件ID                |
| mail_type              | VARCHAR(63)    | 郵件類型              |
| user_id                | INT            | 用戶ID                |
| content                | TEXT           | 內容                  |
| readed                 | BOOLEAN        | 是否已讀              |
| repair_order_id        | INT            | 維修訂單ID            |
| device_id              | INT            | 裝置ID                |
| create_time            | TIMESTAMP      | 創建時間              |

---


### 其它 API
  - DELETE /api/mails/multi/{ids}
    - 說明: 一次刪除多個 mail
    - 參數:
      - ids: 要刪除的 mail_id, 以 "," 隔開。例如："12,34,56"


## Event (觸發事件的規則)

### 說明
觸發事件的規則

### 欄位定義
| Name                    | Type           | Description         |
|-------------------------|----------------|---------------------|
| event_id                | SERIAL         | 事件ID             |
| event_name              | VARCHAR(63)    | 事件名稱           |
| event_type              | VARCHAR(63)    | 事件類型, 可以是下面三種 {"user":"使用者觸發", "device":"裝置觸發", "repair_order":"維修單觸發"} |
| domain_id               | INT            | 所屬域ID       |
| device_type_id          | INT            | 裝置類型ID (for event_type="device") |
| device_output_id        | INT            | 裝置輸出ID         |
| device_name             | VARCHAR(127)   | 裝置名稱 (for event_type="device") |
| compare_function        | TEXT           | 比較函數,必須傳回true或false, 傳回true時觸發事件 (for event_type="device") |
| message                 | TEXT           | 訊息               |
| not_trigger_second      | INT            | 單一裝置幾秒內不要重複觸發 (for event_type="device") |
| trigger_onchange        | BOOLEAN        | 是否觸發變更       |
| enabled                 | BOOLEAN        | 是否啟用           |
| notifys                 | TEXT           | 要通知的對象           |


### notifys 範例
```javascript
[
  {
    "user_id": 35,
    "mail": true,
    "email": false,
    "line_notify": true
  }
]
```

### 比較函數 compare_function

當 event_type="device" 時, 設定觸發的條件, 語言為 javascript, 內建有兩個參數
- device:Device - 觸發的裝置
- data:any - 裝置傳來的資料

下面是範例
```javascript
device.device_name=='device1' && data.temperature>50
```

### 訊息文字 message

下面是範例
```
裝置${device.device_name}的溫度過高, 目前是${data.temperature}度
```

<div class="page"/>

# GraphQL

## 維修單查詢範例
> Request

```graphql
query {
  domains {
    domain_name
    users {
      user_name
    }
    devices{
      device_name
    }
    repair_orders{
      custom_description
      repair_description
      repair_items {
        description
      }
      repair_records {
        description
        repair_item {
          description
        }
        repair_user_records{
          user{
            user_name
          }
        }
      }
    }
  }
}
```

> Response

```json
{
  "data": {
    "domains": [
      {
        "domain_name": "root",
        "users": [
          {
            "user_name": "root 管理員"
          }
        ],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "台北市",
        "users": [
          {
            "user_name": "台北管理員"
          }
        ],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "台中市",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "台南市",
        "users": [
          {
            "user_name": "台南管理員"
          },
          {
            "user_name": "工程師1"
          },
          {
            "user_name": "訂單管理員1"
          }
        ],
        "devices": [
          {
            "device_name": "AA-70-2209-01-0079-377"
          },
          {
            "device_name": "AA-70-2211-01-0155-160"
          },
          {
            "device_name": "AA-70-2211-01-0217-874"
          },
          {
            "device_name": "AA-70-2211-01-0225-889"
          },
          {
            "device_name": "AA-70-2212-01-0028-070"
          },
          {
            "device_name": "AA-70-2212-01-0092-973"
          }
        ],
        "repair_orders": [
          {
            "custom_description": "發電機無法充電",
            "repair_description": "",
            "repair_items": [],
            "repair_records": []
          }
        ]
      },
      {
        "domain_name": "高雄市",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "新北市",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "桃園市",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "萬華區",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "內湖區",
        "users": [],
        "devices": [],
        "repair_orders": []
      },
      {
        "domain_name": "永康區",
        "users": [
          {
            "user_name": "台南永康管理員"
          },
          {
            "user_name": "維修人員1"
          },
          {
            "user_name": "維修人員2"
          }
        ],
        "devices": [],
        "repair_orders": [
          {
            "custom_description": "讀取數值時好時壞",
            "repair_description": "訊號線過長",
            "repair_items": [],
            "repair_records": []
          }
        ]
      },
      {
        "domain_name": "安南區",
        "users": [
          {
            "user_name": "維修人員3"
          }
        ],
        "devices": [],
        "repair_orders": [
          {
            "custom_description": "太陽能無法充電",
            "repair_description": "太陽能接線鬆脫",
            "repair_items": [],
            "repair_records": []
          },
          {
            "custom_description": "機台無法開機",
            "repair_description": "主控版故障",
            "repair_items": [
              {
                "description": "前往廠區檢查"
              },
              {
                "description": "更換主機板"
              }
            ],
            "repair_records": [
              {
                "description": "前去檢查發現主機板出問題",
                "repair_item": {
                  "description": "前往廠區檢查"
                },
                "repair_user_records": [
                  {
                    "user": {
                      "user_name": "維修人員1"
                    }
                  }
                ]
              },
              {
                "description": "把壞掉的主機板換掉",
                "repair_item": {
                  "description": "更換主機板"
                },
                "repair_user_records": [
                  {
                    "user": {
                      "user_name": "維修人員1"
                    }
                  },
                  {
                    "user": {
                      "user_name": "維修人員2"
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```


## Domain 內資料查詢範例
> Request

```graphql
query{
  domain(domain_id:118) {
    domain_name
    child_domains{
      domain_name
    }
    all_domains{
      domain_name
    }
    all_users{
      user_name
    }
    all_repair_orders {
      repair_description
    }
    all_devices {
      device_name
    }
  }
}
```


> Response

```json
{
  "data": {
    "domain": {
      "domain_name": "X公司",
      "child_domains": [
        {
          "domain_name": "台北"
        }
      ],
      "all_domains": [
        {
          "domain_name": "X公司"
        },
        {
          "domain_name": "台北"
        },
        {
          "domain_name": "內湖"
        }
      ],
      "all_users": [
        {
          "user_name": "管理員"
        },
        {
          "user_name": "訪客"
        }
      ],
      "all_repair_orders": [
        {
          "repair_description": "太陽能板接頭鬆脫"
        }
      ],
      "all_devices": [
        {
          "device_name": "AA-70-2212-01-0076-123"
        },
        {
          "device_name": "AA-70-2209-01-0079-567"
        }
      ]
    }
  }
}
```

## Device 裝置類型查詢
> Request

```graphql
query {
  device_type_categorys {
    device_type_category_id
    device_type_category_name
    device_types{
      device_type_name
    }
  }
  domain(domain_id: 12) {
    domain_name
    all_devices(device_type_category_id: 3) {
      device_name
    }
  }
}
```


> Response

```json
{
  "data": {
    "device_type_categorys": [
      {
        "device_type_category_id": 1,
        "device_type_category_name": "ess",
        "device_types": [
          {
            "device_type_name": "pomcube"
          },
          {
            "device_type_name": "ess_hermes"
          }
        ]
      },
      {
        "device_type_category_id": 2,
        "device_type_category_name": "pv",
        "device_types": [
          {
            "device_type_name": "pv_inverter"
          }
        ]
      },
      {
        "device_type_category_id": 3,
        "device_type_category_name": "smart_meter",
        "device_types": [
          {
            "device_type_name": "smart_meter"
          }
        ]
      }
    ],
    "domain": {
      "domain_name": "X Company",
      "all_devices": [
        {
          "device_name": "SM000001"
        },
        {
          "device_name": "SM000002"
        }
      ]
    }
  }
}
```

## Device 連線狀態查詢
> Request

```graphql
query{
  device_types{
    device_type_id
    device_type_name
  }
  domain(domain_id:118) {
    all_ess:all_devices(device_type_id:6) {
      device_name
      is_online
    }
    all_pv_inverter:all_devices(device_type_id:8) {
      device_name
      is_online
    }
  }
}
```

> Response

```json
{
  "data": {
    "device_types": [
      {
        "device_type_id": 6,
        "device_type_name": "ess"
      },
      {
        "device_type_id": 8,
        "device_type_name": "pv_inverter"
      }
    ],
    "domain": {
      "all_ess": [
        {
          "device_name": "AA-70-2212-01-0076-789",
          "is_online": true
        },
        {
          "device_name": "AA-70-2209-01-0079-321",
          "is_online": false
        },
      ],
      "all_pv_inverter": [
        {
          "device_name": "EMS000002",
          "is_online": true
        },
        {
          "device_name": "EMS000003",
          "is_online": true
        }
      ]
    }
  }
}
```

<div class="page"/>

# 裝置資料查詢與寫入 (Data API)

## 簡介

  透過 Data API，使用者可以取得裝置的相關數據，並利用這些資料提供全面的能源管理與分析能力，它包括以下內容：

  1. 即時/歷史太陽能功率
  2. 即時/歷史市電功率
  3. 即時/歷史負載功率
  4. 即時/歷史電池電量 (SOC)
  5. 根據時間查詢該站點的太陽能發電預測


## Data API 路徑

查詢裝置
> GET /api/device_datas/query

查詢 Domain
> GET /api/domain_datas/query
  
## 使用流程

  1. 使用 POST /auth/login 登入
     1. 帳號 (user_account): "admin"
     2. 密碼 (user_password): "xxx"
  2. 利用 GET /api/device_datas/query 查詢設備資料


## Data API - GET "/api/device_datas/query"

  - API說明：
    - 查詢裝置資料
  - HTTP Header：
    - Authorization: login 傳回來的 access_token。例如: "Bearer ey.123.xx"

  - 參數說明
    - organization_id: (必填) 組織 ID
    - device_type_name: 裝置類型名稱
    - device_output_name: (必填) 輸出埠名稱. 目前必須是下面兩種
      - "ess_data": ess的資料
      - "solar_prediction": 太陽能預測的資料
    - domain_id: 查詢此 domain 所有 device, 忽略時等同於 organization_id
    - device_names: 要查詢的 device 名稱, 多個裝置以 "," 隔開, ex: "device1,device2,device3", 忽略時等同於 organization_id 下所有裝置
    - place_names: 要查詢的 place 名稱, 多個 place 以 "," 隔開, ex: "place1,place2,place3"
    - start: 開始時間, ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"
    - stop: 結束時間, ex: "2023-09-01T00:00:00.000Z"
    - fields: (必填) 要查詢的欄位, 每個欄位用 "," 隔開. ex: "field1,field2"
    - where: 查詢條件. 例如 '{"domain_id":"1","device_name":["device1","device2"]}' 代表 (domain_id==1 && (device_name=="device1" || device_name=="device2")) 。 查詢欄位必須是 tag
    - differenceNonNegativeSource: 是否在統計前, 先把後一筆的值減去前一筆的值, 若減完結果為負值則為null。可為 "false" 或 "true"。預設 "false"
    - group_by: 需要群組的欄位，欄位名稱用 ',' 隔開。若欄位名稱開頭有 '!' ，則此欄位僅在統計前群組，統計後不群組。ex: "!DeviceName,_field"
    - every: 每段統計的時間區間, 需搭配 "time_function" 一起使用
    - create_empty: 每段統計的時間區間值為 null 時, 是否仍建立此時間。可為 "false" 或 "true"。預設 "false"
    - time_src: 每段統計的時間要使用 開頭時間('_start') 或 結束時間('_stop')。 ex: one of ["_start", "_stop"]
    - timezone: 當使用 every 或其他具時區的查詢時用到，例如 "每日" 
    - difference: 是否將後一時間段的值減去前一時間段的值。可為 "false" 或 "true"。預設 "false"
    - time_function: "每段時間" 的統計 function。 ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread','integral']
      - last: 最後一筆
      - min: 最小
      - mean: 平均值
      - count: 個數
      - sum: 總計
      - spread: 區間內 (最大-最小)
      - integral: 積分 (值*秒差)
    - group_function: 將 "多個群組" 合併成 "一個時間群組"。ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']
    - pivot_columns: 是否將不同 table 的值，依據時間區間，合併 欄位(ex:"_field") 或 tag(ex:"LoadPower") 成為一筆紀錄。ex: "_field"
    - limit: 每個 table 最多幾筆
    - output_format: 輸出格式。one of ['json', 'influx_line_protocol']. default is 'json'
    - output_zip: 是否輸出壓縮檔. one of ['true', 'false']. default is 'false'
    - debug: 偵錯使用。可為 "false" 或 "true"。預設 "false"


## Data API - GET "/api/domain_datas/query"

  - API說明：
    - 查詢Domain資料
  - HTTP Header：
    - Authorization: login 傳回來的 access_token。例如: "Bearer ey.123.xx"

  - 參數說明
    - organization_id: (必填) 組織 ID
    - device_type_name: 裝置類型名稱
    - domain_id: 查詢此 domain 所有 device, 忽略時等同於 organization_id
    - start: 開始時間, ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"
    - stop: 結束時間, ex: "2023-09-01T00:00:00.000Z"
    - fields: (必填) 要查詢的欄位, 每個欄位用 "," 隔開. ex: "field1,field2"
    - every: 每段統計的時間區間, 需搭配 "time_function" 一起使用
    - create_empty: 每段統計的時間區間值為 null 時, 是否仍建立此時間。可為 "false" 或 "true"。預設 "false"
    - time_src: 每段統計的時間要使用 開頭時間('_start') 或 結束時間('_stop')。 ex: one of ["_start", "_stop"]
    - timezone: 當使用 every 或其他具時區的查詢時用到，例如 "每日" 
    - time_function: "每段時間" 的統計 function。 ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread','integral']
      - last: 最後一筆
      - min: 最小
      - mean: 平均值
      - count: 個數
      - sum: 總計
      - spread: 區間內 (最大-最小)
      - integral: 積分 (值*秒差)
    - group_function: 將 "多個群組" 合併成 "一個時間群組"。ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']
    - pivot_columns: 是否將不同 table 的值，依據時間區間，合併 欄位(ex:"_field") 或 tag(ex:"LoadPower") 成為一筆紀錄。ex: "_field"
    - limit: 每個 table 最多幾筆
    - output_format: 輸出格式。one of ['json', 'influx_line_protocol']. default is 'json'
    - output_zip: 是否輸出壓縮檔. one of ['true', 'false']. default is 'false'
    - debug: 偵錯使用。可為 "false" 或 "true"。預設 "false"


## 傳回範例

 - 一般傳回格式
```javascript
[
  {
    "table": 0,
    "_time": "2024-07-03T08:57:01.303Z",
    "_value": 673,
    "DeviceName": "AA-70-2211-01-0217-874",
    "_field": "LoadPower"
  },
  {
    "table": 1,
    "_time": "2024-07-03T08:57:01.303Z",
    "_value": 863,
    "DeviceName": "AA-70-2211-01-0217-874",
    "_field": "SolarPower"
  }
]
```

 - pivot_columns = "_field"
```javascript
[
  {
    "table": 0,
    "_time": "2024-07-03T08:51:01.007Z",
    "DeviceName": "AA-70-2211-01-0217-874",
    "LoadPower": 655,
    "SolarPower": 539
  }
]
```


### Pomcube,ess_hermes 相關欄位 (device_output_name="pomcube_data", device_output_name="ess_hermes")

  - **GenPower**: 發電機功率 (W)，顯示當前發電機的輸出功率。
  - **GridPower**: 市電功率 (W)，表示從市電網獲得的功率。
  - **LoadPower**: 負載功率 (W)，表示當前負載消耗的功率。
  - **SolarPower**: 太陽能功率 (W)，顯示太陽能板產生的功率。
  - **GenEnergy**: 發電機累積度數（kWh)，表示發電機自安裝以來產生的總電量。
  - **GridEnergy**: 市電累積度數（kWh)，顯示從市電網累積獲得的總電量。
  - **LoadEnergy**: 負載累積度數（kWh)，代表負載自安裝以來消耗的總電量。
  - **SolarEnergy**: 太陽能累積度數（kWh)，表示太陽能板自安裝以來產生的總電量。
  - **BatSoC**: 電池容量（%），顯示當前電池的剩餘容量比例。
  - **BatCurr**: 總電流 (A)，表示系統的總電流。
  - **BatVolt**: 總電壓 (V)，表示系統的總電壓。
  - **BatTemp**: 電池溫度 (degC)，表示電池區的溫度。
  - **EnvTemp1 & EnvTemp2**: 環境溫度 1 & 2 (degC)，分別表示兩個不同位置的環境溫度。
  - **EnvHumidity1 & EnvHumidity2**: 環境濕度 1 & 2 (%)，分別表示兩個不同位置的環境濕度。
  - **EnvCO & EnvCO2**: 一氧化碳和二氧化碳濃度 (PPM)，分別表示當前空氣中的 CO 和 CO2 濃度。
  - **Irradiance**: 日照功率，太陽光照射到太陽能板的強度，通常表示為瓦特每平方米 (W/m²)
  - **PR**: Performance Ratio 效能比，意即用來評估一個太陽能電站的效能表現。

### hermes 太陽能逆變器 (device_output_name="pv_inverter")

  - **PV_ID**: 光伏逆變器的唯一識別碼，用於標識特定的光伏逆變器單元。
  - **Timestamp**: 數據記錄的時間戳記，遵循ISO 8601格式，表示數據被記錄的精確時間。
  - **Status**: 光伏逆變器的當前狀態，例如"Operating"表明光伏逆變器正常運作。
  - **SolarPower**: 輸出功率 (W)，表示 PV Inverter 轉換後的輸出功率。
  - **SolarEnergy**: 太陽能累積度數（kWh)，表示太陽能板自安裝以來產生的總電量。

### hermes 光度計 (device_output_name="sun_photometer_hermes")

  - **SunPhotometer_ID**: 日照計的唯一識別碼。
  - **Timestamp**: 數據記錄的時間戳記，遵循ISO 8601格式，表示數據被記錄的精確時間。
  - **Status**: 日照計的當前狀態，例如"Operating"表明日照計正常運作。
  - **Irradiance**: 日照強度 (W/m²)，表示太陽光照射到日照計的強度。
  - **Temperature**: 溫度 (degC)，表示日照計運行環境的溫度。

### hermes 智慧電表 (device_output_name="smart_meter")

- **SmartMeter_ID**: SmartMeter 的唯一識別碼，用於標識具體的SmartMeter實例。
- **Timestamp**: 記錄數據的時間戳記，遵循ISO 8601格式，表示數據被記錄的精確時間。
- **Status**: 表示 Smart Meter 的當前運行狀態。常見的狀態包括：
  - **Operating**: 表示智能電表正在正常運行並收集數據。
  - **Standby**: 智能電表處於待機狀態，暫時不收集數據。
  - **Fault**: 智能電表出現故障，無法正常運行。
  - **Maintenance**: 智能電表正在進行維護，可能會暫停數據收集或報告。
- **Type**: 表示測量的功率類型，例如 "Grid"（電網）、"Load"（負載）、"Solar"（太陽能）、"AirConditioning"（空調）、"Lighting"（照明）等。可以根據實際應用場景擴展為其他類型。
- **Phase**: 表示所測量的相位。
  - 3P：三相系統中所有相位的總測量值。
  - 3PL1：三相系統中相位1的測量值。
  - 3PL2：三相系統中相位2的測量值。
  - 3PL3：三相系統中相位3的測量值。
  - 2P：裂相系統中兩相的總測量值。
  - 2PL1：裂相系統中相位1的測量值。
  - 2PL2：裂相系統中相位2的測量值。
- **Voltage**: 相應相位的電壓值 (V)。
- **Frequency**: 電網頻率 (Hz)。
- **Current**: 相應相位的電流值 (A)。
- **Active_Power**: 有功功率 (W)，表示當前消耗或輸出的實際功率。
- **Apparent_Power**: 視在功率 (VA)，表示電壓和電流乘積的總功率。
- **Reactive_Power**: 無功功率 (VAr)，表示電路中未實際消耗但存在於系統中的功率。
- **Power_Factor**: 功率因數，用於表示負載的功率效率。
- **Power**: Smart Meter 測量的瞬時功率值 (W)。
- **InputEnergy**: 累積能量值 (kWh)，Type為Grid表示購電，Type為Battery表示充電，Type為Load表示負載用電。
- **OutputEnergy**: 累積能量值 (kWh)，Type為Grid表示售電或逆送電力，Type為Battery表示放電，Type為Solar或Gen表示產生的電能。


### 太陽能預測相關欄位 (device_output_name="solar_prediction")
  - DirectRadiation: 日照功率，太陽光照射到太陽能板的強度，通常表示為瓦特每平方米 (W/m²)
  - SolarArea: 太陽能板面積 (m²)
  - SolarEff: 太陽能板發電效率 (0~1) (0%~100%)
  - SolarPower: 發電功率 (W)



## 裝置查詢 "/api/device_datas/query" 使用範例

### 太陽能預測 (多台)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "solar_prediction",
  start: '2024-06-26T16:00:00Z',
  stop: '2024-06-28T16:00:00Z',
  fields: "SolarPower",
  timezone: "Asia/Taipei",
  group_by: "_time",
  group_function: "sum"
}
```

### 太陽能預測 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "solar_prediction",
  start: '2024-06-26T16:00:00Z',
  stop: '2024-06-28T16:00:00Z',
  fields: "DirectRadiation,SolarArea,SolarEff,SolarPower",
  timezone: "Asia/Taipei",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 每日太陽能度數預測 (單台日照量轉換 "W/m²" -> "Ws/m²")
- 將輸出結果 DirectRadiation / (60*60) 就可以把 "Ws/m²" 轉成 "Wh/m²"
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "solar_prediction",
  start: '2024-06-26T16:00:00Z',
  stop: '2024-06-28T16:00:00Z',
  fields: "DirectRadiation",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "integral",
  time_src: '_start',
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 目前功率 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "ess_data",
  start: 0,
  fields: "SolarPower,LoadPower",
  time_function: "last",
  group_by: "_field"
}
```


### 目前太陽能發電功率 (多台)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "ess_data",
  start: 0,
  fields: "SolarPower",
  time_function: "last",
  group_by: "!DeviceName,_field",
  group_function: "sum"
}
```


### 裝置規格(單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  start: '2024-11-25T00:00:00+08:00',
  fields: "SolarEff,SolarArea",
  every: "1h",
  time_function: "first",
  timezone: "Asia/Taipei",
  time_src: '_start',
  group_by: "_field",
  pivot_columns: "_field"
}
```


### 每日歷史功率圖 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "ess_data",
  start: '2024-05-31T16:00:00Z',
  stop: '2024-06-30T16:00:00Z',
  fields: "SolarPower,LoadPower,GenPower,GridPower",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "mean",
  create_empty: "true",  // 此欄位非必須
  time_src: '_start',
  group_by: "_field",
  pivot_columns: "_field"  // 此欄位非必須
}
```

### 每日歷史功率圖 (多台)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "ess_data",
  start: '2024-05-31T16:00:00Z',
  stop: '2024-06-30T16:00:00Z',
  fields: "SolarPower,LoadPower,GenPower,GridPower",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "mean",
  create_empty: "true",  // 此欄位非必須
  time_src: '_start',
  group_by: "!DeviceName,_field",
  group_function: "sum",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 每日電表累計度數 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "ess_data",
  start: '2024-05-30T16:00:00Z',
  stop: '2024-06-30T16:00:00Z',
  fields: "SolarEnergy,LoadEnergy",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "last",
  create_empty: "true",  // 此欄位非必須
  group_by: "_field",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 每日太陽能發電度數及用電度數 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "ess_data",
  start: '2024-05-30T16:00:00Z',
  stop: '2024-06-30T16:00:00Z',
  fields: "SolarEnergy,LoadEnergy",
  differenceNonNegativeSource: "true",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "sum",
  create_empty: "true",
  time_src: '_start',
  group_by: "_field",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 每月太陽能發電度數及用電度數 (多台)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "ess_data",
  start: '2023-11-30T16:00:00Z',
  stop: '2024-12-31T16:00:00Z',
  fields: "SolarEnergy,LoadEnergy",
  differenceNonNegativeSource: "true",
  every: "1mo",
  timezone: "Asia/Taipei",
  time_function: "sum",
  create_empty: "true",
  time_src: '_start',
  group_by: "!DeviceName,_field",
  group_function: "sum",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 每日太陽能發電度數及用電度數 (單台)
```javascript
{
  organization_id: 2,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "ess_data",
  start: '2024-05-30T16:00:00Z',
  stop: '2024-06-30T16:00:00Z',
  fields: "SolarEnergy,LoadEnergy",
  differenceNonNegativeSource: "true",
  every: "1d",
  timezone: "Asia/Taipei",
  time_function: "sum",
  create_empty: "true",
  time_src: '_start',
  group_by: "_field",
  pivot_columns: "_field"  // 此欄位非必須
}
```


### 最近24小時太陽能發電度數及用電度數 (多台)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "ess_data",
  start: '-24h',
  fields: "SolarEnergy,LoadEnergy",
  differenceNonNegativeSource: "true",
  timezone: "Asia/Taipei",
  time_function: "sum",
  group_by: "!DeviceName,_field",
  group_function: "sum",
}
```


## 站點(Domain) 查詢 "/api/domain_datas/query" 使用範例


### /api/domain_datas/query 增加欄位
  - **SolarEffArea**: sum(太陽能板發電效率*太陽能板面積)，單位為 (m²)
  - **Irradiance**: 日照計日照量，單位為 (W/m²)
  - **PhotometerSolarPower**: 日照計預期發電功率，單位為 (w)
  - **PredictionIrradiance**: 太陽能預測日照量，單位為 (W/m²)
  - **PredictionSolarPower**: 太陽能預測功率，單位為 (w)
  - **BatCapacity**: 電池建置容量，單位為 (kWh)
  - **BatRemainEnergy**: 電池剩餘電量，單位為 (kWh)
  - **BatSoC**: 電池電量百分比，0~100，100為100%，單位為 (%)
  - **CurtailmentRatio**: 棄電比，0~100，100為100%，單位為 (%)
  - **PR**: 效能比 Performance Ratio (PR) 值，0~100，100為100%，單位為 (%)
  - **BatteryChargeEnergy**: 電池充電度數 (kWh)
  - **BatteryDischargeEnergy**: 電池放電度數 (kWh)
  - **SolarEnergy**: 太陽能發電度數，單位為 (kWh)
  - **PredictionSolarEnergy**: 太陽能預測發電度數，單位為 (kWh)

### 今日能耗度數 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  fields: "SolarEnergy,LoadEnergy,GridEnergy",
  every: "1d",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```

### 即時功率 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: 0,
  fields: "SolarPower,LoadPower,GridPower,GenPower",
  timezone: "Asia/Taipei",
  time_function: "last"
}
```

### 即時 SoC,剩餘電量 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: 0,
  fields: "BatRemainEnergy,BatSoC",
  timezone: "Asia/Taipei",
  time_function: "last"
}
```

### 光照計照量 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  fields: "Irradiance",
  every: "1h",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```

### 每15分鐘平均SoC (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "BatSoC",
  every: "15m",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```

### 預計發電功率 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "PredictionSolarPower",
  every: "15m",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```

### 預計發電度數 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "PredictionSolarEnergy",
  every: "1d",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```


### 棄電比 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "CurtailmentRatio",
  every: "1d",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```


### 效能比 Performance Ratio (PR) 值 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "PR",
  every: "1d",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```



### 功率圖 (站點)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  start: '2024-11-25T00:00:00+08:00',
  stop: '2024-11-30T00:00:00+08:00',
  fields: "SolarPower,LoadPower,GridPower,GenPower",
  every: "15m",
  timezone: "Asia/Taipei",
  time_src: '_start'
}
```


## 其他 API

### GET /api/device_datas/curtailment_ratio

計算棄電比，間隔(every) 最小為 30m  

下面是8月1日到8月3日的棄電比範例:

> 參數：
```javascript
{
  organization_id: 118,
  domain_id: 123,
  device_output_name: 'ess_data',
  start: '2024-07-31T16:00:00Z',
  stop: '2024-08-03T16:00:00Z',
  every: '1d',
  time_src: '_start',
  timezone: 'Asia/Taipei'
}
```
> 傳回
```javascript
{
  "times": [
    "2024-07-31T16:00:00Z",
    "2024-08-01T16:00:00Z",
    "2024-08-02T16:00:00Z"
  ],
  "solar_energys": [
    12.400999999999975,
    13.861000000000118,
    13.541000000000036
  ],
  "prediction_energys": [
    98.65232999999996,
    103.13860499999996,
    102.13276499999996
  ],
  "curtailment_ratios": [
    87.42959238773177,
    86.5608032995985,
    86.74176695402299
  ]
}
```


### GET /api/device_datas/pr

計算PR值，間隔(every) 最小為 1h  

下面是8月1日到8月3日的 PR 值範例:

> 參數：
```javascript
{
  organization_id: 118,
  domain_id: 126,
  device_output_name: 'hermes_report',
  start: '2024-07-31T16:00:00Z',
  stop: '2024-08-03T16:00:00Z',
  every: '1d',
  time_src: '_start',
  timezone: 'Asia/Taipei'
}
```
> 傳回
```javascript
[
  {
    "_time": "2024-07-31T16:00:00Z",
    "SolarEnergy": 6526.429,
    "SolarCapacity": 1500,
    "Irradiance": 5147.997,
    "PR": 84.52
  },
  {
    "_time": "2024-08-01T16:00:00Z",
    "SolarEnergy": 7574.601,
    "SolarCapacity": 1500,
    "Irradiance": 5323.197,
    "PR": 94.86
  },
  {
    "_time": "2024-08-02T16:00:00Z",
    "SolarEnergy": 7201.811,
    "SolarCapacity": 1500,
    "Irradiance": 4938.476,
    "PR": 97.22
  }
]
```


### GET /api/device_datas/device_event

取得裝置事件

下面是取得裝置事件的範例:

> 參數：
```javascript
{
  organization_id: 118,
  device_names: 'EMS000003',
  start: '2024-08-05T10:00:00Z',
  stop: '2024-08-05T10:05:00Z',
  time_src: '_start',
  timezone: 'Asia/Taipei'
}
```
> 傳回
```javascript
[
  {
    "_time": "2024-08-05T10:00:33.387Z",
    "DeviceName": "EMS000003",
    "DeviceType": "pv_inverter",
    "ErrorCode": "E1004",
    "ErrorDescription": "E-dRag排程狀態發生錯誤"
  },
  {
    "_time": "2024-08-05T10:04:33.368Z",
    "DeviceName": "EMS000003",
    "DeviceType": "pv_inverter",
    "ErrorCode": "E1001",
    "ErrorDescription": "Aggregator聚合器運行發生錯誤"
  }
]
```


### GET /api/device_datas/report

> 說明

產生報表

> 參數說明

| Name              | Description                 |
|-------------------|-----------------------------|
| report_type       | 報表類型: "pv" 或 "ess"       |
| time_type         | 年報或月報 "year" 或 "month"  |
| domain_id         | 域ID                         |
| device_type_id    | 裝置類型                      |
| year              | 年 ex: 2024                  |
| month             | 月 0:一月, 11:十二月           |
| timezone          | 時區 ex: "Asia/Taipei"       |

---


### GET /api/feed_in_tariff

> 說明

取得此 domain 的躉售費率表

> 參數說明

| Name              | Description                 |
|-------------------|-----------------------------|
| domain_id         | 域ID                         |

> 傳回範例
```javascript
[
  {
    "time": "2023-12-31T16:00:00.000Z",
    "tariff": 4.5
  },
  {
    "time": "2024-05-31T16:00:00.000Z",
    "tariff": 5
  },
  {
    "time": "2024-12-31T16:00:00.000Z",
    "tariff": null
  }
]
```

上面的傳回結果代表 2024 年  
1月1日~5月31日的躉售費率是每度4.5元。  
6月1日~12月31日的躉售費率是每度5元。  



### GET /api/generate_money

> 說明

取得此 domain 賺了多少錢

> 參數說明

| Name              | Description                 |
|-------------------|-----------------------------|
| domain_id         | 域ID                        |
| device_type_id    | 裝置類型                     |
| start_time        | 開始時間                     |
| end_time          | 結束時間                     |

> 傳回範例
```javascript
{
  "tariffs": [
    {
      "time": "2023-12-31T16:00:00.000Z",
      "tariff": 5
    },
    {
      "time": "2024-12-31T16:00:00.000Z",
      "tariff": null
    }
  ],
  "incomes": [
    {
      "time": "2024-06-30T16:00:00.000Z",
      "tariff": 5,
      "diff_energy": 2500,
      "amount": 12500
    },
    {
      "time": "2024-07-31T16:00:00.000Z",
      "tariff": 5
    }
  ],
  "total_income": 12500
}
```
上面的傳回結果代表7月總共產生了2500度電, 每度5元, 共賺了12500元


## 裝置資料的寫入
  - API: POST /api/device_datas/{organization_id}/{measurement_name}/write
  - 說明: 用來寫入裝置資料
  - 參數:
    - organization_id: 組織 ID
    - measurement_name: 資料表名稱
    - [post data]: 一層結構的 JSON 物件陣列，例如: "[{'DeviceName':'device1','temp':26.3,'humi':35.2},{'DeviceName':'device2','temp':27.9,'humi':33.6}]"，DeviceName 必須為存在的裝置


## 權限管理


角色:
1. root
    1. 所有權限
2. domain admin
    1. 此 domain 下所有權限
3. 維修單管理員
    1. 此 domain 下所有維修單的管理
    2. 人員指派
4. 維修人員
    1. 可建立維修單
    2. 可編輯自己建立的維修單
    3. 可檢視別人派給他的維修單
5. domain 檢視人員
    1. 此 domain 下都可檢視
6. 報修人員
    1. 建立報修單
    2. 檢視報修進度
7. 智慧電表管理員
    1. 管理智慧電表


role 資料表:
    page_permission: [{"name":"OverView","permission":1},{"name":"DeviceStatus","permission":1},{"name":"StatusMonitor","permission":1},{"name":"SecurityMonitor","permission":1},{"name":"DeviceInfo","permission":1},


頁面關聯表:

1. OverView: {"read":["view_domain_all"]}
2. DeviceStatus: {"read":["view_domain_all"]}
3. StatusMonitor: {"read":["view_domain_all"], "edit":["edit_domain_datasource"]}
4. SecurityMonitor: {"read":["view_video"]}
5. ECOImport: {"read":["view_electricity_bill"], "edit":["edit_electricity_bill"]}
6. ECOSetup: {"read":["view_domain_all"], "edit":["edit_eco_goals"]}
7. DeviceInfo: {"read":["view_device"]}
8. SmartPanelHermes: {"read":["view_device(device_type=\"smart_panel_hermes\")"], "edit":["edit_device(device_type=\"smart_panel_hermes\")"], "manage":["manage_device(device_type=\"smart_panel_hermes\")"]}
9. PVInverter: {"read":["view_device(device_type=\"pv_inverter\")"], "edit":["edit_device(device_type=\"pv_inverter\")"], "manage":["manage_device(device_type=\"pv_inverter\")"]}
10. ESSHermes: {"read":["view_device(device_type=\"ess_hermes\")"], "edit":["edit_device(device_type=\"ess_hermes\")"], "manage":["manage_device(device_type=\"ess_hermes\")"]}
11. ESSCloud: {"read":["view_device(device_type=\"pomcube\")"], "edit":["edit_device(device_type=\"pomcube\")"], "manage":["manage_device(device_type=\"pomcube\")"]}
12. SmartMeter: {"read":["view_device(device_type=\"smart_meter\")"], "edit":["edit_device(device_type=\"smart_meter\")"], "manage":["manage_device(device_type=\"smart_meter\")"]}
13. SunPhotometerHermes: {"read":["view_device(device_type=\"sun_photometer_hermes\")"], "edit":["edit_device(device_type=\"sun_photometer_hermes\")"], "manage":["manage_device(device_type=\"sun_photometer_hermes\")"]}
14. CaseManagement: {"read":["view_repair_order"], "edit":["edit_repair_order"], "manage":["manage_repair_order"], "complete":["complete_repair_order"]}
15. RequestForm: {"read":[1,3,5], "edit":[2,4]}
16. MaintenanceForm: {"read":[1,3,5], "edit":[2,4]}
17. CaseClosure: {"read":[1,3,5], "edit":[2,4]}
18. PowerGeneration: {"read":["export_report"]}
19. AccountManagement: {"read":["view_user"], "edit":["edit_user"], "manage":["manage_user"]}
20. PermissionManagement: {"read":["view_role"], "edit":["edit_role"], "manage":["manage_role"]}
21. SystemInfo: {"read":[]}
22. AlarmManagement: {"read":["view_domain_all"], "edit":["edit_domain_all"]}
23. DomainConfig: {"read":["view_domain"], "edit":["edit_domain"], "manage":["manage_domain"]}
24. MessageBox: {"read":["view_domain_all"], "edit":["edit_domain_all"]}


權限:
1. view_domain_all
2. edit_domain_all
3. manage_domain
4. edit_domain_datasource
5. view_video
6. view_electricity_bill
7. edit_eco_goals
8. view_device
9. edit_device
10. manage_device
11. view_repair_order
12. edit_repair_order
13. manage_repair_order
14. complete_repair_order
15. export_report
16. view_user
17. edit_user
18. manage_user



2. (view_domain_video) 檢視 domain 影片
2. (edit_domain_datasource) 設定 domain 資料來源
3. (edit_repair_order) domain 維修單管理
4. (assign_repair_order_user) 人員指派
5. (create_repair_order) 可建立維修單
6. (edit_self_repair_order) 可編輯自己建立的維修單
7. (view_self_repair_order) 可檢視別人派給他的維修單
8. (view_domain_device) 可檢視 domain 下所有裝置
9. 可檢視維修單的裝置
10. 建立 user
11. 檢視 user
12. 管理智慧電表
13. 管理日照計









## XXXXXXXX

1. 權限管理
   1. Domain 低層不能要到高層資料
   2. /device_data/query 及 /domain_data/query 不能存取到不能存取的裝置
   3. 特殊權限處理, 例如能看到高domain指派給自己的維修單
   4. GraphQL 權限管理
2. 看 2030.5 文件及規劃
   1. 看 2030.5文件
   2. 專案項目規劃
   

待辦事項
  1. 排程取消(2h)
  2. user 增加 is_expired 欄位(1h)
  3. refresh token(1h)
  4. 維修單歷史紀錄(4h)
  5. 連續性排程(8h)
  6. 手機推播通知
  7. 開機自動啟動 aegis


```javascript
{
    "devices": {
        "meter1": {
            "SolarEnergy": {
                "field": "SolarPower",
                "計算方式": "積分"
            }
        },
        "meter2": {
            "SolarEnergy": {
                "field": "SolarEnergy",
                "計算方式": "度數差"
            }
        },
        "meter3": {
            "SolarPower": {
                "field": "SolarPower",
                "計算方式": "last"
            }
        }
    },
    "outs": {
        "SolarEnergy": {
            "類型": "度數"
            "裝置": [
                "meter1", "meter2"
            ]
        },
        "SolarPower": {
            "類型": "功率"
            "裝置": [
                "meter3"
            ]
        }
    }
}
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## IEEE 2030.5

### Server

1. 將 se_list.txt, sep_wadl.xml, sep.xsd 轉換成前端網頁
2. 憑證處理
   1. 建立 CA 憑證
   2. 用 CA 憑證簽署 Server 憑證
   3. DER Client 匯入 CA 憑證
   4. 產生Client憑證,由憑證雜湊成 lFDI 和 sFDI
   5. PIN 碼的產生
   6. 加密方式 TLS_ECDHE_ECDSA_WITH_AES_128_CCM_8
3. DNS-SD - 自動偵測裝置加入區網
4. Subscription/Notification - 訂閱及通知
5. DERProgram(DER排程控制), DemandResponseProgram(非DER排程控制), MessagingProgram(文字處理排程控制)
6. Response - 收到指令, 開始處理指令, 指令完成, 指令取消
7. Metering - UsagePoint(從Server讀取電表數值), MirrorUsagePoint(DER Client或人工對Server寫入電表數值)
8. 群組管理 - 多層 Domain 下的 DERProgram, 需有 Domain 管理頁面, 並能設定 FunctionSetAssignments, DERProgram
9. Aggregator 編輯頁面, 需能編輯 Aggregator 下面有哪些 DER Client
10. 其他功能集 - File, Pricing, Billing, Prepayment, FlowReservation
11. 和 Aegis 的整合, 部分整合或全整合

### Client
1. DNS-SD
2. 憑證處理
3. Subscription/Notification - 訂閱及通知
4. DERProgram(DER排程控制), DemandResponseProgram(非DER排程控制), MessagingProgram(文字處理排程控制)
5. 群組管理 - 多層 Domain 下的 DERProgram 解析
   1. 規則不衝突則都執行
   2. 規則衝突情況, 越接近 DER Client 的規則優先
   3. 沒有能執行的規則時, 執行 DefaultDERControl
6. Response - 收到指令, 開始處理指令, 指令完成, 指令取消
7. DER Client 的規格
   1. 出廠規格 - /edev/1/der/4/dercap
   2. 目前可使用規格 - /edev/1/der/4/derg
8. 定期回報DER狀態，參考 IEEE 2030.5 Implementation Guide for Smart Inverters 4.6
   1. DeviceStatus - /edev/1/dstat
   2. DERStatus - /edev/1/der/4/ders - 參考 SPEC Table E.2—Monitoring information
   3. PowerStatus - /edev/1/ps
   4. Alarms - 參考 SPEC - Table 41 (Metering LogEvents)
9.  Metering - MirrorUsagePoint(DER Client或人工對Server寫入電表數值), 回報不在 DERStatus 上的資訊
10. Aggregators 設計及裝置管理, Aggregators 自己也算是一個 DER Device
11. Event - 延遲隨機幾秒啟動，幾秒內完成
12. DERCurve - 充放電控制曲線的解析

### 測試流程

1. 系統開機
2. Client 發出 DNS-SD 找到 Server 的 dcap 網址
3. Aggregator 透過 /edev 取得 Aggregator 所管理的所有裝置列表(EndDeviceList)
4. 每個裝置透過 FunctionSetAssignments 得知有哪些功能集可用
5. 若有 DERProgram 功能集, 則透過上述規則解析出哪些 DER Control 或 DERCurve 需要執行
6. 將解析後的控制指令下給實體裝置
7. 訂閱或輪詢下面資源,輪詢秒數 pollRate 預設 900 秒, 可從 GET /edev 取得
   1. /edev (Aggregator需要)
   2. /edev/1/fsa
   3. /derp
   4. /derp/1
   5. /derp/1/dderc
   6. /derp/1/derc
   7. /derp/1/derc/1
8. 當 DER Control 變更, Client 收到指令需透過 replyTo 得知 Response 網址,當responseRequired="00"不回報, 當responseRequired="01"回報
9. 定期回報 Status 及 Metering 資料





[
    {
        "power_scheduler_id": 4,
        "domain_id": 187,
        "device_id": null,
        "timezone": "Asia/Taipei",
        "crons": "[{\"start_time\":56700,\"stop_time\":0,\"power\":-300}]",
        "notify_user_id": 1,
        "update_time": "2024-12-23T07:39:57.710Z",
        "start_time": "2024-12-20T00:04:30.327Z",
        "stop_time": "2024-12-20T00:20:00.000Z",
        "running": false,
        "info": "",
        "enabled": false
    }
]

978*3
00:00~00:00
