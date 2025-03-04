<div style="text-align: center; margin-top: 50px;">
    <img src="./document/derui_logo.png" alt="公司標誌" style="width: 200px; height: auto;" />
</div>

<br />

<div style="text-align: center; margin-top: 20px;">
    <h1 style="font-size: 36px; font-weight: bold;">AEGIS APIs - for K 館</h1>
</div>

<br />
<br />
<br />

<div style="text-align: center; margin-top: 60px;">
    <p style="font-size: 18px;">文件編號：AEGIS_K0005</p>
    <p style="font-size: 18px;">版本號：1.5</p>
    <p style="font-size: 18px;">日期：2024-12-20</p>
</div>

<div style="text-align: center; margin-top: 60px;">
    <p style="font-size: 18px;">編寫者：Bomb</p>
</div>


<div style="break-after: page; page-break-after: always;"></div> 

# AEGIS APIs - for K館

### 簡介

  透過這個 AEGIS APIs 文件，使用者可以取得 K 館的電力數據及電力調度，包括以下內容：

  1. 即時/歷史太陽能功率
  2. 即時/歷史市電功率
  3. 即時/歷史負載功率
  4. 即時/歷史電池電量 (SOC)
  5. 根據時間查詢該站點的太陽能發電預測
  6. 電力調度

### API 路徑

  - Swagger 路徑
    - Swagger - [https://drtech.com.tw:20080/api](https://drtech.com.tw:20080/api)

### 範疇

  只要用到下面4個 API, 其他都用不到
  1. 登入 AEGIS - POST /auth/login
  2. 取得單一裝置資料 - GET /device_datas/query
  3. 取得站點統計資料 - GET /domain_datas/query
  4. K館電力調度 - PATCH /api/power_schedulers/4
  
### 使用流程

  1. 使用 POST /auth/login 登入
     1. 帳號 (user_account): "admin@gel"
     2. 密碼 (user_password): "admingel"
  2. 利用 GET /device_datas/query 查詢設備資料

### Device
  
目前能查詢的裝置(device)有下面幾台：

device_type_category_name: 裝置類型群組, 目前有:
  - "ess": 儲能設備
  - "pv": 太陽能發電設備
  - "sun_photometer": 光照計
  - "smart_meter": 智慧電表

device_type_name: 裝置類型, 目前有:
  - "pomcube": Pomcube
  - "ess_hermes": hermes 儲能設備
  - "pv_inverter": hermes 太陽能逆變器
  - "sun_photometer_hermes": hermes 光度計
  - "smart_meter": hermes 智慧電表

device_output_name: 裝置的輸出埠名稱, 各 device_type 對應的輸出埠如下:
  - "pomcube": "pomcube_data"
  - "ess_hermes": "hermes_ess_data"
  - "pv_inverter": "hermes_pv_inverter_data"
  - "sun_photometer_hermes": "hermes_sun_photometer_data"
  - "smart_meter": "hermes_smartmeter_data"

裝置列表如下:

  | device_name | 裝置說明 | device_type_category_name | device_type_name | device_output_name |
  |---|---|---|---|---|
  | AA-70-2211-01-0078-938 | Pomcube | ess | pomcube | pomcube_data |
  | AA-70-2211-01-0217-874 | Pomcube | ess | pomcube | pomcube_data |
  | AA-70-2212-01-0028-070 | Pomcube | ess | pomcube | pomcube_data |
  | HERMES_ESS000001 | CyberPower | ess | ess_hermes | hermes_ess_data |
  | HERMES_ESS000002 | CyberPower | ess | ess_hermes | hermes_ess_data |
  | HERMES_ESS000003 | CyberPower | ess | ess_hermes | hermes_ess_data |
  | HERMES_PV000001 | 太陽能逆變器 | pv | pv_inverter | hermes_pv_inverter_data |
  | HERMES_PV000002 | 太陽能逆變器 | pv | pv_inverter | hermes_pv_inverter_data |
  | HERMES_SP000001 | 光度計 | sun_photometer | sun_photometer_hermes | hermes_sun_photometer_data |
  | HERMES_SP000002 | 光度計 | sun_photometer | sun_photometer_hermes | hermes_sun_photometer_data |
  | HERMES_SM000001 | 電表 智慧電盤迴路：Ma1 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000002 | 電表 智慧電盤迴路：Ma2 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000003 | 電表 智慧電盤迴路：Ma3 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000004 | 電表 智慧電盤迴路：Ba4 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000005 | 電表 智慧電盤迴路：Ba5 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000006 | 電表 智慧電盤迴路：Ba6 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000007 | 電表 智慧電盤迴路：Ba7 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000008 | 電表 智慧電盤迴路：Ba8 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000009 | 電表 智慧電盤迴路：Ba9 | smart_meter | smart_meter | hermes_smartmeter_data |
  | HERMES_SM000010 | 電表 K_Master(AEGIS Server對能管中心) | smart_meter | smart_meter | hermes_smartmeter_data |


### Domain

  Domain 為樹狀結構, 用來區分擺放位置, 目前所有裝置都放在K館.
  下面為已經建立在資料庫中的結構, 所以查詢時 organization_id 必須為 182

  - root
    - 工研院綠能所 (domain_id=182, organization_id=182)
    - 台南 (domain_id=183)
      - 沙崙智慧綠能科學城 (domain_id=186)
        - K館 (domain_id=187)
          - AA-70-2211-01-0078-938
          - AA-70-2211-01-0217-874
          - AA-70-2212-01-0028-070
          - HERMES_ESS000001
          - HERMES_ESS000002
          - HERMES_ESS000003
          - HERMES_PV000001
          - HERMES_PV000002
          - HERMES_SP000001
          - HERMES_SP000002
          - HERMES_SM000001
          - HERMES_SM000002
          - HERMES_SM000003
          - HERMES_SM000004
          - HERMES_SM000005
          - HERMES_SM000006
          - HERMES_SM000007
          - HERMES_SM000008
          - HERMES_SM000009
          - HERMES_SM000010


### 登入系統 - POST "/auth/login"
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
  "user_account": "admin@gel",
  "user_password": "admingel"
}
```

傳回結果：
```javascript
{
  "access_token": "ey.123.xx",
  "user_id": 51,
  "user_name": "管理員",
  "role_id": 44,
  "domain_id": 182,
  "domain_name": "工研院綠能所",
  "organization_id": 182
}
```

### 單一裝置查詢 - GET "/device_datas/query"

  - API說明：
    - 查詢裝置資料
  - HTTP Header：
    - Authorization: login 傳回來的 access_token。例如: "Bearer ey.123.xx"

  - 參數說明
    - organization_id: (必填) 組織 ID
    - device_type_category_name: 裝置類型群組。 ex: "smart_meter,pv,ess"
    - device_type_name: 裝置類型名稱
    - device_output_name: (必填) 輸出埠名稱. 目前必須是下面兩種
      - "pomcube_data": pomcube的資料
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
      - mean: 平均值
      - spread: 區間內 (最大-最小)
      - integral: 積分 (值*秒差)
    - group_function: 將 "多個群組" 合併成 "一個時間群組"。ex: one of ['min', 'max', 'mean', 'median', 'count', 'sum']
    - pivot_columns: 是否將不同 table 的值，依據時間區間，合併 欄位(ex:"_field") 或 tag(ex:"LoadPower") 成為一筆紀錄。ex: "_field"
    - limit: 每個 table 最多幾筆
    - debug: 偵錯使用。可為 "false" 或 "true"。預設 "false"

#### pivot_columns 範例

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


## 單一裝置查詢 - GET "/api/device_datas/query" 使用範例

### 太陽能功率預測 (單台)
```javascript
{
  organization_id: 182,
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
  organization_id: 182,
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
  organization_id: 182,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "pomcube_data",
  start: 0,
  fields: "SolarPower,LoadPower",
  time_function: "last",
  group_by: "_field"
}
```


### pomcube 目前太陽能發電功率 (多台)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  device_output_name: "pomcube_data",
  start: 0,
  fields: "SolarPower",
  time_function: "last",
  group_by: "!DeviceName,_field",
  group_function: "sum"
}
```

### pv及ess目前太陽能發電功率總和 (多台)
```javascript
{
  organization_id: 182,
  domain_id: 187,
  device_type_category_name: "pv,ess",
  start: 0,
  fields: "SolarPower",
  time_function: "last",
  group_by: "!DeviceName,_field",
  group_function: "sum"
}
```

### 每日歷史功率圖 (單台)
```javascript
{
  organization_id: 182,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  domain_id: 187,
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  domain_id: 187,
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  device_names: 'AA-70-2212-01-0028-070',
  device_output_name: "pomcube_data",
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
  organization_id: 182,
  domain_id: 187,
  device_output_name: "pomcube_data",
  start: '-24h',
  fields: "SolarEnergy,LoadEnergy",
  differenceNonNegativeSource: "true",
  timezone: "Asia/Taipei",
  time_function: "sum",
  group_by: "!DeviceName,_field",
  group_function: "sum",
}
```



## 站點查詢 - GET "/api/domain_datas/query 使用範例

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



### 每15分鐘平均功率圖 (站點)
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

## 電力調度

### 取得調度資訊

> 可以利用 "GET /api/power_schedulers/4" 來取得目前電力調度的資訊, 傳回範例如下:

```javascript
[
  {
    "power_scheduler_id": 4,
    "domain_id": 187,
    "device_id": null,
    "timezone": "Asia/Taipei",
    "crons": "[{\"start_time\":61200, \"stop_time\":68400, \"power\":-20000}, {\"start_time\":3600, \"stop_time\":10800, \"power\":10000}]",
    "notify_user_id": 1,
    "update_time": "2024-12-06T10:25:38.178Z",
    "start_time": "2024-12-09T17:04:32.870Z",
    "stop_time": "2024-12-09T19:04:19.201Z",
    "info": "{\"start\":{\"time\":\"2024-12-09T17:04:32.870Z\",\"error\":null,\"devices\":[{\"DeviceName\":\"AA-70-2211-01-0078-938\",\"SoC\":31,\"SolarPower\":0,\"GridPower\":3224},{\"DeviceName\":\"AA-70-2211-01-0217-874\",\"SoC\":30,\"SolarPower\":0,\"GridPower\":3274},{\"DeviceName\":\"AA-70-2212-01-0028-070\",\"SoC\":30,\"SolarPower\":0,\"GridPower\":3281}]},\"sell_energy\":0,\"purchase_energy\":19.407999999999987,\"stop\":{\"time\":\"2024-12-09T19:04:19.201Z\",\"error\":null,\"devices\":[{\"DeviceName\":\"AA-70-2211-01-0078-938\",\"SoC\":58,\"SolarPower\":0,\"GridPower\":0},{\"DeviceName\":\"AA-70-2211-01-0217-874\",\"SoC\":58,\"SolarPower\":0,\"GridPower\":0},{\"DeviceName\":\"AA-70-2212-01-0028-070\",\"SoC\":58,\"SolarPower\":0,\"GridPower\":0}]}}",
    "enabled": true
  }
]
```

各欄位的說明如下:

|  名稱  |  說明  | 
|-------|-------|
| power_scheduler_id | 排程編號 |
| domain_id | 站點編號 |
| device_id | 裝置編號 |
| timezone | 時區, 台灣是 "Asia/Taipei" |
| crons | 排程設定 |
| update_time | 設定排程時的時間 |
| start_time | 最後一次的排程啟動時間 |
| stop_time | 最後一次的排程停止時間 |
| info | 最後一次的排程運作資訊 |
| enabled | 排程是否有效 |

- 是否調度中 = (start_time!=null && stop_time==null) || start_time>stop_time

唯一要更改的欄位是 crons, 範例如下:
```javascript
[
  {
    "start_time":61200,
    "stop_time":68400,
    "power":-20000
  }, {
    "start_time":3600,
    "stop_time":10800,
    "power":10000
  }
]
```

- start_time 及 stop_time 代表開始及結束時間。單位是距離 00:00:00 的秒數。例如 60 代表 00:01:00，61200 代表 17:00:00
- power 為功率，正值為充電，負值為放電。

### 設定電力調度

API 名稱:
> PATCH /api/power_schedulers/4

範例:

設定
每天 01:00:00 到 03:00:00 以 10000w 充電，
每天 17:00:00 到 19:00:00 以 20000w 放電，


PATCH /api/power_schedulers/4
```javascript
  {
    "crons": "[{\"start_time\":61200, \"stop_time\":68400, \"power\":-20000}, {\"start_time\":3600, \"stop_time\":10800, \"power\":10000}]"
  }
```


### 取得歷史調度資訊

API 名稱:
> 可以利用 "GET /api/power_schedulers/4/history" 來取得電力調度的歷史資訊, 傳回範例如下:

```javascript
{
  "running": false,
  "complete_count": 0,
  "purchase_energy": 73.6569999999999,
  "sell_energy": 113.58799999999962,
  "records": [
    {
      "table": 0,
      "_time": "2024-12-09T17:00:32.582Z",
      "type": "start",
      "data": "{\"charge_power\":10000}",
      "message": "電池排程已啟動, 預定充電功率 10000 w",
      "purchase_energy": null,
      "sell_energy": null
    },
    {
      "table": 0,
      "_time": "2024-12-09T17:04:32.873Z",
      "type": "start_stable",
      "data": "{\"AA-70-2211-01-0078-938\":{\"BatSoC\":31,\"GridPower\":3224,\"SolarPower\":0},\"AA-70-2211-01-0217-874\":{\"BatSoC\":30,\"GridPower\":3274,\"SolarPower\":0},\"AA-70-2212-01-0028-070\":{\"BatSoC\":30,\"GridPower\":3281,\"SolarPower\":0}}",
      "message": "目前裝置狀態\r\nAA-70-2211-01-0078-938\r\n  SoC : 31 %\r\n  SolarPower : 0 w\r\n  GridPower : 3224 w\r\nAA-70-2211-01-0217-874\r\n  SoC : 30 %\r\n  SolarPower : 0 w\r\n  GridPower : 3274 w\r\nAA-70-2212-01-0028-070\r\n  SoC : 30 %\r\n  SolarPower : 0 w\r\n  GridPower : 3281 w\r\n",
      "purchase_energy": null,
      "sell_energy": null
    },
    {
      "table": 0,
      "_time": "2024-12-09T19:00:18.938Z",
      "type": "stop",
      "data": "{\"charge_power\":null}",
      "message": "電池排程已停止",
      "purchase_energy": null,
      "sell_energy": null
    },
    {
      "table": 0,
      "_time": "2024-12-09T19:04:19.218Z",
      "type": "stop_stable",
      "data": "{\"AA-70-2211-01-0078-938\":{\"BatSoC\":58,\"GridPower\":0,\"SolarPower\":0},\"AA-70-2211-01-0217-874\":{\"BatSoC\":58,\"GridPower\":0,\"SolarPower\":0},\"AA-70-2212-01-0028-070\":{\"BatSoC\":58,\"GridPower\":0,\"SolarPower\":0}}",
      "message": "目前裝置狀態\r\nAA-70-2211-01-0078-938\r\n  SoC : 58 %\r\n  SolarPower : 0 w\r\n  GridPower : 0 w\r\nAA-70-2211-01-0217-874\r\n  SoC : 58 %\r\n  SolarPower : 0 w\r\n  GridPower : 0 w\r\nAA-70-2212-01-0028-070\r\n  SoC : 58 %\r\n  SolarPower : 0 w\r\n  GridPower : 0 w\r\n",
      "purchase_energy": 19.407999999999987,
      "sell_energy": 0
    }
  ]
}
```

欄位說明：

| 名稱 | 說明 |
| --- | --- |
| running | 是否正在調度中 |
| complete_count | 已完成次數 |
| purchase_energy | 從市電取得的度數 |
| sell_energy | 回送給市電的度數 |
| purchase_energy | 從市電取得的度數 |
| purchase_energy | 從市電取得的度數 |

records 欄位說明：

| 名稱 | 說明 |
| --- | --- |
| _time | 事件時間 |
| type | 事件類型，分別為 {"create":"建立排程", "update":"更新排程", "start":"排程開始", "start_stable":"開始後4分鐘", "stop":"排程停止", "stop_stable":"排程停止後4分鐘"} |
| data | 事件的資訊 |
| message | 事件的訊息 |


## A棟電表

> GET "/api/device_datas/query"

欄位說明:
  1. Active_Power: 電表功率 (w)
  2. InputEnergy: 電表度數 (kWh)

傳入:
```javascript
{
  "organization_id": 182,
  "device_output_name": "hermes_smartmeter_data",
  "device_names": "HERMES_SM000010",
  "fields": "Active_Power,InputEnergy",
  "start": "2024-12-18T00:00:00+08:00",
  "group_by": "!DeviceName,_field",
  "timezone": "Asia/Taipei",
  "time_function": "last",
  "pivot_columns": "_field"
}
```

傳出:
```javascript
[
  {
    "table": 0,
    "_time": "2024-12-17T16:05:00Z",
    "Active_Power": 2775.977373123169,
    "InputEnergy": 48530.28125
  },
  {
    "table": 0,
    "_time": "2024-12-17T16:10:00Z",
    "Active_Power": 2693.185329437256,
    "InputEnergy": 48530.51171875
  }
]
```