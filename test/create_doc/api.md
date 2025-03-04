
## POST /api/auth/login
### 說明
User login
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|user_account|string|User account|
|user_password|string|Password|
### 傳回結果
#### HTTP Status(200) - Login successful
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
#### HTTP Status(401) - Unauthorized

## POST /api/users
### 說明
新增 user
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|user_account|string|用戶帳號|
|user_name|string|用戶名稱|
|user_password|string|用戶密碼|
|domain_id|number|所屬域ID|
|role_id|number|角色ID|
|is_supplier|boolean|是否為供應商|
|phone|string|電話|
|email|string|電子郵件|
|line_notify_token|string|Line 通知令牌|
|contact_name|string|聯絡人名稱|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/users
### 說明
取得 user
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The User records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|user_id|number|用戶ID|
|user_account|string|用戶帳號|
|user_name|string|用戶名稱|
|user_password|string|用戶密碼|
|domain_id|number|所屬域ID|
|role_id|number|角色ID|
|is_supplier|boolean|是否為供應商|
|phone|string|電話|
|email|string|電子郵件|
|line_notify_token|string|Line 通知令牌|
|contact_name|string|聯絡人名稱|
|create_time|string|創建時間|

## GET /api/users/{id}
### 說明
取得 user
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The User record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|user_id|number|用戶ID|
|user_account|string|用戶帳號|
|user_name|string|用戶名稱|
|user_password|string|用戶密碼|
|domain_id|number|所屬域ID|
|role_id|number|角色ID|
|is_supplier|boolean|是否為供應商|
|phone|string|電話|
|email|string|電子郵件|
|line_notify_token|string|Line 通知令牌|
|contact_name|string|聯絡人名稱|
|create_time|string|創建時間|

## PATCH /api/users/{id}
### 說明
修改 user
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|user_account|string|用戶帳號|
|user_name|string|用戶名稱|
|user_password|string|用戶密碼|
|domain_id|number|所屬域ID|
|role_id|number|角色ID|
|is_supplier|boolean|是否為供應商|
|phone|string|電話|
|email|string|電子郵件|
|line_notify_token|string|Line 通知令牌|
|contact_name|string|聯絡人名稱|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/users/{id}
### 說明
刪除 user
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/notify_device
### 說明

### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(201)

## POST /api/settings
### 說明
新增 setting
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|setting_value|string|設置值|
### 傳回結果
#### HTTP Status(201)

## GET /api/settings
### 說明
取得 setting
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Setting records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|setting_id|string|設置ID|
|setting_value|string|設置值|

## GET /api/settings/{id}
### 說明
取得 setting
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Setting record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|setting_id|string|設置ID|
|setting_value|string|設置值|

## DELETE /api/settings/{id}
### 說明
刪除 setting
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## DELETE /api/domains/{id}
### 說明
刪除 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## GET /api/domains/{id}
### 說明
取得 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Domain record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_id|number|域ID|
|domain_name|string|域名稱|
|parent_domain_id|number|父域ID|
|is_organization|boolean|是否為組織|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|zoom|number|地圖縮放級別|
|photos|string|照片|
|feed_in_tariffs|string|躉售費率|
|feed_in_tariff_now|number|當前躉售費率|

## PATCH /api/domains/{id}
### 說明
修改 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_name|string|域名稱|
|parent_domain_id|number|父域ID|
|is_organization|boolean|是否為組織|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|zoom|number|地圖縮放級別|
|photos|string|照片|
|feed_in_tariffs|string|躉售費率|
|feed_in_tariff_now|number|當前躉售費率|
### 傳回結果
#### HTTP Status(204)

## POST /api/domains/{domain_id}/upload_photo
### 說明
新增 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|domain_id|true|true|域ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(201)

## PUT /api/domains/{domain_id}/replace_photo
### 說明
更新 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|domain_id|true|true|域ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(200)

## DELETE /api/domains/{domain_id}/photos/{filename}
### 說明
刪除 domain
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|domain_id|true|true|ex: "3"|
|filename|true|true|ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"|
### 傳回結果
#### HTTP Status(200)

## POST /api/domains
### 說明
新增 domain
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_name|string|域名稱|
|parent_domain_id|number|父域ID|
|is_organization|boolean|是否為組織|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|zoom|number|地圖縮放級別|
|photos|string|照片|
|feed_in_tariffs|string|躉售費率|
|feed_in_tariff_now|number|當前躉售費率|
### 傳回結果
#### HTTP Status(201)

## GET /api/domains
### 說明
取得 domain
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Domain records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|domain_id|number|域ID|
|domain_name|string|域名稱|
|parent_domain_id|number|父域ID|
|is_organization|boolean|是否為組織|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|zoom|number|地圖縮放級別|
|photos|string|照片|
|feed_in_tariffs|string|躉售費率|
|feed_in_tariff_now|number|當前躉售費率|

## POST /api/roles
### 說明
新增 role
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|role_name|string|角色名稱|
|domain_id|number|所屬域ID|
|page_permission|string|頁面權限|
### 傳回結果
#### HTTP Status(201)

## GET /api/roles
### 說明
取得 role
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Role records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|role_id|number|角色ID|
|role_name|string|角色名稱|
|domain_id|number|所屬域ID|
|page_permission|string|頁面權限|

## GET /api/roles/{id}
### 說明
取得 role
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Role record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|role_id|number|角色ID|
|role_name|string|角色名稱|
|domain_id|number|所屬域ID|
|page_permission|string|頁面權限|

## PATCH /api/roles/{id}
### 說明
修改 role
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|role_name|string|角色名稱|
|domain_id|number|所屬域ID|
|page_permission|string|頁面權限|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/roles/{id}
### 說明
刪除 role
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_type_categorys
### 說明
新增 device_type_category
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_category_name|string|裝置類型群組名稱|
|device_type_category_alias_name|string|裝置類型群組別名|
### 傳回結果
#### HTTP Status(201)

## GET /api/device_type_categorys
### 說明
取得 device_type_category
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The DeviceTypeCategory records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_type_category_id|number|裝置類型群組 ID|
|device_type_category_name|string|裝置類型群組名稱|
|device_type_category_alias_name|string|裝置類型群組別名|

## GET /api/device_type_categorys/{id}
### 說明
取得 device_type_category
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The DeviceTypeCategory record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_category_id|number|裝置類型群組 ID|
|device_type_category_name|string|裝置類型群組名稱|
|device_type_category_alias_name|string|裝置類型群組別名|

## PATCH /api/device_type_categorys/{id}
### 說明
修改 device_type_category
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_category_name|string|裝置類型群組名稱|
|device_type_category_alias_name|string|裝置類型群組別名|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/device_type_categorys/{id}
### 說明
刪除 device_type_category
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_types
### 說明
新增 device_type
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_name|string|裝置類型名稱|
|device_type_alias_name|string|裝置類型別名|
|device_type_category_id|number|裝置類型群組 ID|
|connection_params|string|連線時需要的參數|
|is_energy_storage|boolean|是否為儲能裝置|
### 傳回結果
#### HTTP Status(201)

## GET /api/device_types
### 說明
取得 device_type
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The DeviceType records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_type_id|number|裝置類型ID|
|device_type_name|string|裝置類型名稱|
|device_type_alias_name|string|裝置類型別名|
|device_type_category_id|number|裝置類型群組 ID|
|connection_params|string|連線時需要的參數|
|is_energy_storage|boolean|是否為儲能裝置|

## GET /api/device_types/{id}
### 說明
取得 device_type
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The DeviceType record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_id|number|裝置類型ID|
|device_type_name|string|裝置類型名稱|
|device_type_alias_name|string|裝置類型別名|
|device_type_category_id|number|裝置類型群組 ID|
|connection_params|string|連線時需要的參數|
|is_energy_storage|boolean|是否為儲能裝置|

## PATCH /api/device_types/{id}
### 說明
修改 device_type
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_type_name|string|裝置類型名稱|
|device_type_alias_name|string|裝置類型別名|
|device_type_category_id|number|裝置類型群組 ID|
|connection_params|string|連線時需要的參數|
|is_energy_storage|boolean|是否為儲能裝置|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/device_types/{id}
### 說明
刪除 device_type
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_connections/update_all
### 說明
新增 device_connection
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(201)

## POST /api/device_connections
### 說明
新增 device_connection
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_connection_name|string|裝置連線名稱|
|device_type_id|number|裝置類型ID|
|organization_id|number|組織ID|
|url|string|連接URL|
|host|string|主機|
|port|number|埠號|
|username|string|使用者名稱|
|password|string|密碼|
|token|string|令牌|
|org|string|組織ID|
|database_name|string|數據庫名稱|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
### 傳回結果
#### HTTP Status(201)

## GET /api/device_connections
### 說明
取得 device_connection
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The DeviceConnection records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_connection_id|number|裝置連線ID|
|device_connection_name|string|裝置連線名稱|
|device_type_id|number|裝置類型ID|
|organization_id|number|組織ID|
|url|string|連接URL|
|host|string|主機|
|port|number|埠號|
|username|string|使用者名稱|
|password|string|密碼|
|token|string|令牌|
|org|string|組織ID|
|database_name|string|數據庫名稱|
|enabled|boolean|是否啟用|
|extra|string|額外信息|

## PATCH /api/device_connections/{id}
### 說明
修改 device_connection
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_connection_name|string|裝置連線名稱|
|device_type_id|number|裝置類型ID|
|organization_id|number|組織ID|
|url|string|連接URL|
|host|string|主機|
|port|number|埠號|
|username|string|使用者名稱|
|password|string|密碼|
|token|string|令牌|
|org|string|組織ID|
|database_name|string|數據庫名稱|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/device_connections/{id}
### 說明
刪除 device_connection
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## GET /api/device_connections/{id}
### 說明
取得 device_connection
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The DeviceConnection record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_connection_id|number|裝置連線ID|
|device_connection_name|string|裝置連線名稱|
|device_type_id|number|裝置類型ID|
|organization_id|number|組織ID|
|url|string|連接URL|
|host|string|主機|
|port|number|埠號|
|username|string|使用者名稱|
|password|string|密碼|
|token|string|令牌|
|org|string|組織ID|
|database_name|string|數據庫名稱|
|enabled|boolean|是否啟用|
|extra|string|額外信息|

## POST /api/devices/{device_id}/trigger
### 說明
新增 device
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|device_id|true|true|裝置ID|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_id|number|所屬域ID|
|device_name|string|裝置名稱|
|device_input_id|number|要觸發的裝置輸入ID|
|param|object||
### 傳回結果
#### HTTP Status(201)

## POST /api/devices
### 說明
新增 device
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_name|string|裝置名稱|
|place_name|string|地點名稱|
|device_alias_name|string|裝置別名|
|device_type_id|number|裝置類型ID|
|device_type_category_id|number|裝置類型群組 ID|
|device_connection_id|number|裝置連線ID|
|domain_id|number|所屬域ID|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|is_online|boolean|是否在線|
|output_power_capacity|number|輸出功率容量|
|bat_capacity|number|電池容量|
|solar_capacity|number|太陽能容量|
|solar_area|number|太陽能面積|
|solar_eff|number|太陽能效率|
|device_state|string|裝置狀態|
|error_code|string|錯誤代碼|
|error_description|string|錯誤描述|
|last_data|string|最後數據|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
|install_time|string|安裝時間|
|create_time|string|創建時間|
|last_connect_time|string|最後連接時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/devices
### 說明
取得 device
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Device records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_id|number|裝置ID|
|device_name|string|裝置名稱|
|place_name|string|地點名稱|
|device_alias_name|string|裝置別名|
|device_type_id|number|裝置類型ID|
|device_type_category_id|number|裝置類型群組 ID|
|device_connection_id|number|裝置連線ID|
|domain_id|number|所屬域ID|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|is_online|boolean|是否在線|
|output_power_capacity|number|輸出功率容量|
|bat_capacity|number|電池容量|
|solar_capacity|number|太陽能容量|
|solar_area|number|太陽能面積|
|solar_eff|number|太陽能效率|
|device_state|string|裝置狀態|
|error_code|string|錯誤代碼|
|error_description|string|錯誤描述|
|last_data|string|最後數據|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
|install_time|string|安裝時間|
|create_time|string|創建時間|
|last_connect_time|string|最後連接時間|

## GET /api/devices/{id}
### 說明
取得 device
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Device record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_id|number|裝置ID|
|device_name|string|裝置名稱|
|place_name|string|地點名稱|
|device_alias_name|string|裝置別名|
|device_type_id|number|裝置類型ID|
|device_type_category_id|number|裝置類型群組 ID|
|device_connection_id|number|裝置連線ID|
|domain_id|number|所屬域ID|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|is_online|boolean|是否在線|
|output_power_capacity|number|輸出功率容量|
|bat_capacity|number|電池容量|
|solar_capacity|number|太陽能容量|
|solar_area|number|太陽能面積|
|solar_eff|number|太陽能效率|
|device_state|string|裝置狀態|
|error_code|string|錯誤代碼|
|error_description|string|錯誤描述|
|last_data|string|最後數據|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
|install_time|string|安裝時間|
|create_time|string|創建時間|
|last_connect_time|string|最後連接時間|

## PATCH /api/devices/{id}
### 說明
修改 device
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_name|string|裝置名稱|
|place_name|string|地點名稱|
|device_alias_name|string|裝置別名|
|device_type_id|number|裝置類型ID|
|device_type_category_id|number|裝置類型群組 ID|
|device_connection_id|number|裝置連線ID|
|domain_id|number|所屬域ID|
|address|string|地址|
|lat|string|緯度|
|lng|string|經度|
|is_online|boolean|是否在線|
|output_power_capacity|number|輸出功率容量|
|bat_capacity|number|電池容量|
|solar_capacity|number|太陽能容量|
|solar_area|number|太陽能面積|
|solar_eff|number|太陽能效率|
|device_state|string|裝置狀態|
|error_code|string|錯誤代碼|
|error_description|string|錯誤描述|
|last_data|string|最後數據|
|enabled|boolean|是否啟用|
|extra|string|額外信息|
|install_time|string|安裝時間|
|create_time|string|創建時間|
|last_connect_time|string|最後連接時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/devices/{id}
### 說明
刪除 device
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_items
### 說明
新增 repair_item
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|repair_type_id|number|維修類型ID|
|description|string|描述|
|repair_item_state|string|維修項目狀態|
|device_id|number|裝置ID|
|expect_end_date|string|預期完成日期|
|completeness|number|完整性|
|photos|string|照片|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/repair_items
### 說明
取得 repair_item
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The RepairItem records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|repair_item_id|number|維修項目ID|
|repair_order_id|number|維修訂單ID|
|repair_type_id|number|維修類型ID|
|description|string|描述|
|repair_item_state|string|維修項目狀態|
|device_id|number|裝置ID|
|expect_end_date|string|預期完成日期|
|completeness|number|完整性|
|photos|string|照片|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|

## GET /api/repair_items/{id}
### 說明
取得 repair_item
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The RepairItem record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_item_id|number|維修項目ID|
|repair_order_id|number|維修訂單ID|
|repair_type_id|number|維修類型ID|
|description|string|描述|
|repair_item_state|string|維修項目狀態|
|device_id|number|裝置ID|
|expect_end_date|string|預期完成日期|
|completeness|number|完整性|
|photos|string|照片|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|

## PATCH /api/repair_items/{id}
### 說明
修改 repair_item
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|repair_type_id|number|維修類型ID|
|description|string|描述|
|repair_item_state|string|維修項目狀態|
|device_id|number|裝置ID|
|expect_end_date|string|預期完成日期|
|completeness|number|完整性|
|photos|string|照片|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/repair_items/{id}
### 說明
刪除 repair_item
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_order_historys
### 說明
新增 repair_order_history
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|user_id|number|用戶ID|
|snapshot|string|快照|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/repair_order_historys
### 說明
取得 repair_order_history
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The RepairOrderHistory records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|repair_order_history_id|number|維修訂單歷史ID|
|repair_order_id|number|維修訂單ID|
|user_id|number|用戶ID|
|snapshot|string|快照|
|create_time|string|創建時間|

## GET /api/repair_order_historys/{id}
### 說明
取得 repair_order_history
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The RepairOrderHistory record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_history_id|number|維修訂單歷史ID|
|repair_order_id|number|維修訂單ID|
|user_id|number|用戶ID|
|snapshot|string|快照|
|create_time|string|創建時間|

## PATCH /api/repair_order_historys/{id}
### 說明
修改 repair_order_history
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|user_id|number|用戶ID|
|snapshot|string|快照|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/repair_order_historys/{id}
### 說明
刪除 repair_order_history
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_records/{repair_record_id}/upload_photo
### 說明
新增 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_record_id|true|true|維修記錄ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(201)

## PUT /api/repair_records/{repair_record_id}/replace_photo
### 說明
更新 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_record_id|true|true|維修記錄ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(200)

## DELETE /api/repair_records/{repair_record_id}/photos/{filename}
### 說明
刪除 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_record_id|true|true|ex: "3"|
|filename|true|true|ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_records
### 說明
新增 repair_record
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|repair_item_id|number|維修項目ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|description|string|描述|
|photos|string|照片|
|create_time|string|創建時間|
|update_time|string|更新時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/repair_records
### 說明
取得 repair_record
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The RepairRecord records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|repair_record_id|number|維修記錄ID|
|repair_order_id|number|維修訂單ID|
|repair_item_id|number|維修項目ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|description|string|描述|
|photos|string|照片|
|create_time|string|創建時間|
|update_time|string|更新時間|

## GET /api/repair_records/{id}
### 說明
取得 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The RepairRecord record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_record_id|number|維修記錄ID|
|repair_order_id|number|維修訂單ID|
|repair_item_id|number|維修項目ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|description|string|描述|
|photos|string|照片|
|create_time|string|創建時間|
|update_time|string|更新時間|

## PATCH /api/repair_records/{id}
### 說明
修改 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|repair_item_id|number|維修項目ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|description|string|描述|
|photos|string|照片|
|create_time|string|創建時間|
|update_time|string|更新時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/repair_records/{id}
### 說明
刪除 repair_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_user_records
### 說明
新增 repair_user_record
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_record_id|number|維修記錄ID|
|user_id|number|用戶ID|
### 傳回結果
#### HTTP Status(201)

## GET /api/repair_user_records
### 說明
取得 repair_user_record
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The RepairUserRecord records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|repair_user_record_id|number|派工記錄ID|
|repair_record_id|number|維修記錄ID|
|user_id|number|用戶ID|

## GET /api/repair_user_records/{id}
### 說明
取得 repair_user_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The RepairUserRecord record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_user_record_id|number|派工記錄ID|
|repair_record_id|number|維修記錄ID|
|user_id|number|用戶ID|

## PATCH /api/repair_user_records/{id}
### 說明
修改 repair_user_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_record_id|number|維修記錄ID|
|user_id|number|用戶ID|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/repair_user_records/{id}
### 說明
刪除 repair_user_record
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## DELETE /api/mails/multi/{ids}
### 說明
刪除 mail
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|ids|true|true|id to delete. split with ",". ex: "12,34,56"|
### 傳回結果
#### HTTP Status(200)

## POST /api/mails
### 說明
新增 mail
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|mail_type|string|郵件類型|
|user_id|number|用戶ID|
|content|string|內容|
|readed|boolean|是否已讀|
|repair_order_id|number|維修訂單ID|
|device_id|number|裝置ID|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/mails
### 說明
取得 mail
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Mail records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|mail_id|number|郵件ID|
|mail_type|string|郵件類型|
|user_id|number|用戶ID|
|content|string|內容|
|readed|boolean|是否已讀|
|repair_order_id|number|維修訂單ID|
|device_id|number|裝置ID|
|create_time|string|創建時間|

## GET /api/mails/{id}
### 說明
取得 mail
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Mail record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|mail_id|number|郵件ID|
|mail_type|string|郵件類型|
|user_id|number|用戶ID|
|content|string|內容|
|readed|boolean|是否已讀|
|repair_order_id|number|維修訂單ID|
|device_id|number|裝置ID|
|create_time|string|創建時間|

## PATCH /api/mails/{id}
### 說明
修改 mail
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|mail_type|string|郵件類型|
|user_id|number|用戶ID|
|content|string|內容|
|readed|boolean|是否已讀|
|repair_order_id|number|維修訂單ID|
|device_id|number|裝置ID|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/mails/{id}
### 說明
刪除 mail
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/events
### 說明
新增 event
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|event_name|string|事件名稱|
|event_type|string|事件類型, 可以是下面三種 {"user":"使用者觸發", "device":"裝置觸發", "repair_order":"維修單觸發"}|
|domain_id|number|所屬域ID|
|device_type_id|number|裝置類型ID (for event_type="device")|
|device_output_id|number|裝置輸出ID|
|device_name|string|裝置名稱 (for event_type="device")|
|compare_function|string|比較函數,必須傳回true或false, 傳回true時觸發事件 (for event_type="device")|
|message|string|訊息|
|not_trigger_second|number|單一裝置幾秒內不要重複觸發 (for event_type="device")|
|trigger_onchange|boolean|是否觸發變更|
|enabled|boolean|是否啟用|
|notifys|string|要通知的對象|
### 傳回結果
#### HTTP Status(201)

## GET /api/events
### 說明
取得 event
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The Event records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|event_id|number|事件ID|
|event_name|string|事件名稱|
|event_type|string|事件類型, 可以是下面三種 {"user":"使用者觸發", "device":"裝置觸發", "repair_order":"維修單觸發"}|
|domain_id|number|所屬域ID|
|device_type_id|number|裝置類型ID (for event_type="device")|
|device_output_id|number|裝置輸出ID|
|device_name|string|裝置名稱 (for event_type="device")|
|compare_function|string|比較函數,必須傳回true或false, 傳回true時觸發事件 (for event_type="device")|
|message|string|訊息|
|not_trigger_second|number|單一裝置幾秒內不要重複觸發 (for event_type="device")|
|trigger_onchange|boolean|是否觸發變更|
|enabled|boolean|是否啟用|
|notifys|string|要通知的對象|

## GET /api/events/{id}
### 說明
取得 event
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The Event record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|event_id|number|事件ID|
|event_name|string|事件名稱|
|event_type|string|事件類型, 可以是下面三種 {"user":"使用者觸發", "device":"裝置觸發", "repair_order":"維修單觸發"}|
|domain_id|number|所屬域ID|
|device_type_id|number|裝置類型ID (for event_type="device")|
|device_output_id|number|裝置輸出ID|
|device_name|string|裝置名稱 (for event_type="device")|
|compare_function|string|比較函數,必須傳回true或false, 傳回true時觸發事件 (for event_type="device")|
|message|string|訊息|
|not_trigger_second|number|單一裝置幾秒內不要重複觸發 (for event_type="device")|
|trigger_onchange|boolean|是否觸發變更|
|enabled|boolean|是否啟用|
|notifys|string|要通知的對象|

## PATCH /api/events/{id}
### 說明
修改 event
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|event_name|string|事件名稱|
|event_type|string|事件類型, 可以是下面三種 {"user":"使用者觸發", "device":"裝置觸發", "repair_order":"維修單觸發"}|
|domain_id|number|所屬域ID|
|device_type_id|number|裝置類型ID (for event_type="device")|
|device_output_id|number|裝置輸出ID|
|device_name|string|裝置名稱 (for event_type="device")|
|compare_function|string|比較函數,必須傳回true或false, 傳回true時觸發事件 (for event_type="device")|
|message|string|訊息|
|not_trigger_second|number|單一裝置幾秒內不要重複觸發 (for event_type="device")|
|trigger_onchange|boolean|是否觸發變更|
|enabled|boolean|是否啟用|
|notifys|string|要通知的對象|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/events/{id}
### 說明
刪除 event
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_inputs
### 說明
新增 device_input
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_input_name|string|裝置輸入名稱|
|device_type_id|number|裝置類型ID|
|input_type|string|輸入類型ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"}|
|method|string|存取方式 ex: one of {"get", "post", "patch", "put", "delete"}|
|path|string|路徑|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|query|string|查詢語法|
|autorun|boolean|是否自動運行|
|run_every_second|number|每秒運行|
|run_order|number|運行順序|
|response_output_id|number|當 "input_type" 使用 "http" 時, 觸發的回應 output 處理方式|
### 傳回結果
#### HTTP Status(201)

## GET /api/device_inputs
### 說明
取得 device_input
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The DeviceInput records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_input_id|number|裝置輸入ID|
|device_input_name|string|裝置輸入名稱|
|device_type_id|number|裝置類型ID|
|input_type|string|輸入類型ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"}|
|method|string|存取方式 ex: one of {"get", "post", "patch", "put", "delete"}|
|path|string|路徑|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|query|string|查詢語法|
|autorun|boolean|是否自動運行|
|run_every_second|number|每秒運行|
|run_order|number|運行順序|
|response_output_id|number|當 "input_type" 使用 "http" 時, 觸發的回應 output 處理方式|

## GET /api/device_inputs/{id}
### 說明
取得 device_input
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The DeviceInput record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_input_id|number|裝置輸入ID|
|device_input_name|string|裝置輸入名稱|
|device_type_id|number|裝置類型ID|
|input_type|string|輸入類型ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"}|
|method|string|存取方式 ex: one of {"get", "post", "patch", "put", "delete"}|
|path|string|路徑|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|query|string|查詢語法|
|autorun|boolean|是否自動運行|
|run_every_second|number|每秒運行|
|run_order|number|運行順序|
|response_output_id|number|當 "input_type" 使用 "http" 時, 觸發的回應 output 處理方式|

## PATCH /api/device_inputs/{id}
### 說明
修改 device_input
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_input_name|string|裝置輸入名稱|
|device_type_id|number|裝置類型ID|
|input_type|string|輸入類型ex: one of {"mqtt", "modbus", "http", "mysql", "influxdb"}|
|method|string|存取方式 ex: one of {"get", "post", "patch", "put", "delete"}|
|path|string|路徑|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|query|string|查詢語法|
|autorun|boolean|是否自動運行|
|run_every_second|number|每秒運行|
|run_order|number|運行順序|
|response_output_id|number|當 "input_type" 使用 "http" 時, 觸發的回應 output 處理方式|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/device_inputs/{id}
### 說明
刪除 device_input
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_outputs
### 說明
新增 device_output
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_output_name|string|裝置輸出名稱|
|device_type_id|number|裝置類型ID|
|output_type|string|輸出類型, ex: one of {"mqtt", "modbus", "http"}|
|path|string|路徑。 <pre>當 "output_type" 為下面值的範例:<br>modbus: 用來指定 modbus device_id. ex:"1"<br>mqtt: 用來指定 mqtt topic. ex:"/path/to/topic1"<br>http: 用來指定 http url. ex:"http://127.0.0.1:3000/test.html"</pre>|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|device_state_field|string|更新 device_state 的欄位|
|device_error_code_field|string|更新 device_error_code 的欄位|
|device_error_description_field|string|更新 device_error_description 的欄位|
|is_store|boolean|是否儲存|
|store_tags|string|<pre>influxdb tag<br>ex:[<br>{"tag":"place_name","source":"device_order"}, {"tag":"device_name","source":"device_name"}, {"tag":"device_sn","source":"device_sn"}<br>]</pre>|
|store_fields|string|<pre>influxdb field<br>ex:[<br>{"field":"LoadPower","source":"LoadPower"}, {"field":"SOC","source":"SOC"}<br>]</pre>|
|data_schema|string|數據模式|
### 傳回結果
#### HTTP Status(201)

## GET /api/device_outputs
### 說明
取得 device_output
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The DeviceOutput records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|device_output_id|number|裝置輸出ID|
|device_output_name|string|裝置輸出名稱|
|device_type_id|number|裝置類型ID|
|output_type|string|輸出類型, ex: one of {"mqtt", "modbus", "http"}|
|path|string|路徑。 <pre>當 "output_type" 為下面值的範例:<br>modbus: 用來指定 modbus device_id. ex:"1"<br>mqtt: 用來指定 mqtt topic. ex:"/path/to/topic1"<br>http: 用來指定 http url. ex:"http://127.0.0.1:3000/test.html"</pre>|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|device_state_field|string|更新 device_state 的欄位|
|device_error_code_field|string|更新 device_error_code 的欄位|
|device_error_description_field|string|更新 device_error_description 的欄位|
|is_store|boolean|是否儲存|
|store_tags|string|<pre>influxdb tag<br>ex:[<br>{"tag":"place_name","source":"device_order"}, {"tag":"device_name","source":"device_name"}, {"tag":"device_sn","source":"device_sn"}<br>]</pre>|
|store_fields|string|<pre>influxdb field<br>ex:[<br>{"field":"LoadPower","source":"LoadPower"}, {"field":"SOC","source":"SOC"}<br>]</pre>|
|data_schema|string|數據模式|

## GET /api/device_outputs/{id}
### 說明
取得 device_output
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The DeviceOutput record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_output_id|number|裝置輸出ID|
|device_output_name|string|裝置輸出名稱|
|device_type_id|number|裝置類型ID|
|output_type|string|輸出類型, ex: one of {"mqtt", "modbus", "http"}|
|path|string|路徑。 <pre>當 "output_type" 為下面值的範例:<br>modbus: 用來指定 modbus device_id. ex:"1"<br>mqtt: 用來指定 mqtt topic. ex:"/path/to/topic1"<br>http: 用來指定 http url. ex:"http://127.0.0.1:3000/test.html"</pre>|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|device_state_field|string|更新 device_state 的欄位|
|device_error_code_field|string|更新 device_error_code 的欄位|
|device_error_description_field|string|更新 device_error_description 的欄位|
|is_store|boolean|是否儲存|
|store_tags|string|<pre>influxdb tag<br>ex:[<br>{"tag":"place_name","source":"device_order"}, {"tag":"device_name","source":"device_name"}, {"tag":"device_sn","source":"device_sn"}<br>]</pre>|
|store_fields|string|<pre>influxdb field<br>ex:[<br>{"field":"LoadPower","source":"LoadPower"}, {"field":"SOC","source":"SOC"}<br>]</pre>|
|data_schema|string|數據模式|

## PATCH /api/device_outputs/{id}
### 說明
修改 device_output
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|device_output_name|string|裝置輸出名稱|
|device_type_id|number|裝置類型ID|
|output_type|string|輸出類型, ex: one of {"mqtt", "modbus", "http"}|
|path|string|路徑。 <pre>當 "output_type" 為下面值的範例:<br>modbus: 用來指定 modbus device_id. ex:"1"<br>mqtt: 用來指定 mqtt topic. ex:"/path/to/topic1"<br>http: 用來指定 http url. ex:"http://127.0.0.1:3000/test.html"</pre>|
|data_type|string|數據類型 ex: one of {"text", "json"}|
|device_state_field|string|更新 device_state 的欄位|
|device_error_code_field|string|更新 device_error_code 的欄位|
|device_error_description_field|string|更新 device_error_description 的欄位|
|is_store|boolean|是否儲存|
|store_tags|string|<pre>influxdb tag<br>ex:[<br>{"tag":"place_name","source":"device_order"}, {"tag":"device_name","source":"device_name"}, {"tag":"device_sn","source":"device_sn"}<br>]</pre>|
|store_fields|string|<pre>influxdb field<br>ex:[<br>{"field":"LoadPower","source":"LoadPower"}, {"field":"SOC","source":"SOC"}<br>]</pre>|
|data_schema|string|數據模式|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/device_outputs/{id}
### 說明
刪除 device_output
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)

## POST /api/device_datas/{organization_id}/{measurement_name}/write
### 說明
對平台寫入裝置資料
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|organization_id|true|true||
|measurement_name|true|true||
### 傳回結果
#### HTTP Status(201)

## GET /api/device_datas/query
### 說明
查詢裝置資料
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|organization_id||true|ex: "3"|
|device_output_name||false|ex: "pomcube_data,hermes_smartmeter_data,hermes_report"|
|device_type_category_name||false|ex: "smart_meter,pv,ess"|
|device_type_name||false|ex: "pomcube,ess_hermes,pv_inverter,smart_meter"|
|domain_id||false|ex: "5"|
|device_names||false|ex: "device1,device2,device3"|
|place_names||false|ex: "place1,place2,place3"|
|start||false|ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"|
|stop||false|ex: "2023-09-01T00:00:00.000Z"|
|fields||true|ex: "field1,field2"|
|where||false|ex: '{"domain_id":"1","device_name":["device1","device2"]}' means (domain_id==1 && (device_name=="device1" || device_name=="device2"))|
|differenceNonNegativeSource||false|Difference NonNegative between subsequent values. one of ['true', 'false']. default is 'false'|
|group_by||false|Regroups input data by modifying group key of input tables. If first char of group key is "!", this group key will only be grouped before calculation. ex: "!DeviceName,_field"|
|every||false|ex: one of ["10s", "1m", "2h", "1d", "1w", "1mo", "1y"]|
|create_empty||false|Create empty tables for empty window. Default is false. ex: one of [false, true]|
|time_src||false|Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]|
|timezone||false|ex: "Asia/Taipei"|
|time_function||false|ex: one of ['first', 'last', 'min', 'max', 'mean', 'median', 'count', 'sum', 'spread', 'integral']|
|difference||false|difference between subsequent values. one of ['true', 'false']. default is 'false'|
|group_function||false|ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']|
|pivot_columns||false|collects unique values stored vertically (column-wise) and aligns them horizontally (row-wise) into logical sets. ex: '_field' or 'tag1,tag2'|
|limit||false||
|output_format||false|one of ['json', 'influx_line_protocol']. default is 'json'|
|output_zip||false|Output zip file. one of ['true', 'false']. default is 'false'|
|debug||false|one of ['true', 'false']. default is 'false'|
### 傳回結果
#### HTTP Status(200)

## GET /api/device_datas/curtailment_ratio
### 說明
查詢棄電比
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|organization_id||true|ex: "3"|
|device_output_name||false|ex: "device_type1_data"|
|device_type_category_name||false|ex: "smart_meter,pv,ess"|
|device_type_name||false|ex: "device_type1"|
|domain_id||false|ex: "5"|
|device_names||false|ex: "device1,device2,device3"|
|place_names||false|ex: "place1,place2,place3"|
|start||false|ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"|
|stop||false|ex: "2023-09-01T00:00:00.000Z"|
|every||false|ex: one of ["1m", "2h", "1d", "1w", "1mo", "1y"]. min is "30m"|
|time_src||false|Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]|
|timezone||false|ex: "Asia/Taipei"|
### 傳回結果
#### HTTP Status(200)

## GET /api/device_datas/pr
### 說明
查詢 PR 值
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|organization_id||true|ex: "3"|
|device_output_name||false|ex: "device_type1_data"|
|device_type_category_name||false|ex: "smart_meter,pv,ess"|
|device_type_name||false|ex: "device_type1"|
|domain_id||false|ex: "5"|
|device_names||false|ex: "device1,device2,device3"|
|place_names||false|ex: "place1,place2,place3"|
|start||false|ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"|
|stop||false|ex: "2023-09-01T00:00:00.000Z"|
|every||false|ex: one of ["1m", "2h", "1d", "1w", "1mo", "1y"]. min is "30m"|
|time_src||false|Column to use as the source of the new time value for aggregate values. Default is "_stop". ex: one of ["_start", "_stop"]|
|timezone||false|ex: "Asia/Taipei"|
### 傳回結果
#### HTTP Status(200)

## GET /api/device_datas/device_event
### 說明
取得裝置的事件
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|organization_id||true|ex: "97"|
|domain_id||false|ex: "5"|
|device_names||false|ex: "device1,device2,device3"|
|start||false|ex: "2023-09-01T00:00:00.000Z", "1621726200", "-10s", "-30m", "-6h", "-7d", "-1mo", "-1y"|
|stop||false|ex: "2023-09-01T00:00:00.000Z"|
### 傳回結果
#### HTTP Status(200)

## GET /api/device_datas/report
### 說明
取得報表
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|report_type||true|ex: one of {"pv", "ess"}|
|time_type||true|ex: one of {"year", "month"}|
|domain_id||true|ex: "66"|
|device_type_id||false|ex: "8"|
|year||true|ex: "2024"|
|month||false|0~11 ex: "0:January, 1:February, ..., 11:December"|
|timezone||false|ex: "Asia/Taipei"|
|fake_data||false|one of ['true', 'false']. default is 'false'|
### 傳回結果
#### HTTP Status(200)

## GET /api/feed_in_tariff
### 說明
取得 domain 的躉售費率
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|domain_id||true|ex: "5"|
### 傳回結果
#### HTTP Status(200)

## GET /api/generate_money
### 說明
計算收入金額
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|domain_id||true|ex: "66"|
|device_type_id||false|ex: "8"|
|start_time||false|ex: "2024-04-30T16:00:00Z"|
|end_time||false|ex: "2024-05-31T16:00:00Z"|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_orders/{repair_order_id}/upload_photo
### 說明
新增 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_order_id|true|true|維修訂單ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(201)

## PUT /api/repair_orders/{repair_order_id}/replace_photo
### 說明
更新 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_order_id|true|true|維修訂單ID|
### 資料段格式
multipart/form-data
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|file|binary||
### 傳回結果
#### HTTP Status(200)

## DELETE /api/repair_orders/{repair_order_id}/photos/{filename}
### 說明
刪除 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|repair_order_id|true|true|ex: "3"|
|filename|true|true|ex: "9d8e47e2-2b02-49c7-b3d5-039827bf9ce9.webp"|
### 傳回結果
#### HTTP Status(200)

## POST /api/repair_orders
### 說明
新增 repair_order
### 參數說明
此 API 沒有參數
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_id|number|所屬域ID|
|creator_id|number|創建者ID|
|title|string|標題|
|contact_name|string|聯絡人名稱|
|contact_phone|string|聯絡電話|
|contact_email|string|聯絡郵件|
|priority|number|優先級|
|custom_description|string|自定義描述|
|repair_description|string|維修描述|
|expect_end_date|string|預期完成日期|
|repair_order_state|string|維修訂單狀態|
|repair_order_type|string|維修訂單類型|
|completeness|number|完整性|
|photos|string|照片|
|supplier_id|number|供應商ID|
|assign_user_id|number|指派用戶ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(201)

## GET /api/repair_orders
### 說明
取得 repair_order
### 參數說明
此 API 沒有參數
### 傳回結果
#### HTTP Status(200) - The RepairOrder records
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
array
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|domain_id|number|所屬域ID|
|creator_id|number|創建者ID|
|title|string|標題|
|contact_name|string|聯絡人名稱|
|contact_phone|string|聯絡電話|
|contact_email|string|聯絡郵件|
|priority|number|優先級|
|custom_description|string|自定義描述|
|repair_description|string|維修描述|
|expect_end_date|string|預期完成日期|
|repair_order_state|string|維修訂單狀態|
|repair_order_type|string|維修訂單類型|
|completeness|number|完整性|
|photos|string|照片|
|supplier_id|number|供應商ID|
|assign_user_id|number|指派用戶ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|

## GET /api/repair_orders/{id}
### 說明
取得 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200) - The RepairOrder record
##### 傳回資料格式
application/json
##### 傳回資料欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|repair_order_id|number|維修訂單ID|
|domain_id|number|所屬域ID|
|creator_id|number|創建者ID|
|title|string|標題|
|contact_name|string|聯絡人名稱|
|contact_phone|string|聯絡電話|
|contact_email|string|聯絡郵件|
|priority|number|優先級|
|custom_description|string|自定義描述|
|repair_description|string|維修描述|
|expect_end_date|string|預期完成日期|
|repair_order_state|string|維修訂單狀態|
|repair_order_type|string|維修訂單類型|
|completeness|number|完整性|
|photos|string|照片|
|supplier_id|number|供應商ID|
|assign_user_id|number|指派用戶ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|

## PATCH /api/repair_orders/{id}
### 說明
修改 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 資料段格式
application/json
### 資料段欄位說明
object
| Name | Type | Description |
|------|------|-------------|
|domain_id|number|所屬域ID|
|creator_id|number|創建者ID|
|title|string|標題|
|contact_name|string|聯絡人名稱|
|contact_phone|string|聯絡電話|
|contact_email|string|聯絡郵件|
|priority|number|優先級|
|custom_description|string|自定義描述|
|repair_description|string|維修描述|
|expect_end_date|string|預期完成日期|
|repair_order_state|string|維修訂單狀態|
|repair_order_type|string|維修訂單類型|
|completeness|number|完整性|
|photos|string|照片|
|supplier_id|number|供應商ID|
|assign_user_id|number|指派用戶ID|
|start_time|string|開始時間|
|end_time|string|結束時間|
|create_time|string|創建時間|
### 傳回結果
#### HTTP Status(204)

## DELETE /api/repair_orders/{id}
### 說明
刪除 repair_order
### 參數說明
| Name | In Path | Required | Description |
|------|---------|----------|-------------|
|id|true|true|識別碼|
### 傳回結果
#### HTTP Status(200)
