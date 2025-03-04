<div style="text-align: center; margin-top: 50px;">
    <img src="./document/derui_logo.png" alt="公司標誌" style="width: 200px; height: auto;" />
</div>

<br />

<div style="text-align: center; margin-top: 20px;">
    <h1 style="font-size: 36px; font-weight: bold;">AEGIS APIs - for 智邦科技</h1>
</div>

<br />
<br />
<br />

<div style="text-align: center; margin-top: 60px;">
    <p style="font-size: 18px;">文件編號：AEGIS0002</p>
    <p style="font-size: 18px;">版本號：1.2</p>
    <p style="font-size: 18px;">日期：2024-10-23</p>
</div>

<div style="text-align: center; margin-top: 60px;">
    <p style="font-size: 18px;">編寫者：Bomb</p>
</div>


<div style="break-after: page; page-break-after: always;"></div> 

# AEGIS APIs - for 智邦科技

### 簡介

  透過這個 AEGIS APIs 文件，使用者可以取得工研院 K 館在台南燈會期間（2024 年 2 月 24 日至 2024 年 3 月 10 日）的電力數據，包括以下內容：

  1. 即時/歷史太陽能功率
  2. 即時/歷史市電功率
  3. 即時/歷史負載功率
  4. 即時/歷史電池電量 (SOC)
  5. 根據時間查詢該站點的太陽能發電預測

  此外，使用者還可以取得七月以後的實時數據，提供全面的能源管理與分析能力。透過這些資料，能有效監控和管理工研院 K 館的能源使用情況，提升能源效率，並進行預測分析。


### API 路徑

  - Swagger 路徑
    - Swagger - [https://drtech.com.tw:34080/api](https://drtech.com.tw:34080/api)

### 範疇

  這次只要用到下面兩個 API, 其他都用不到
  1. POST /auth/login
  2. GET /device_datas/query
  
### 使用流程

  1. 使用 POST /auth/login 登入
     1. 帳號 (user_account): "accton_admin"
     2. 密碼 (user_password): "111"
  2. 利用 GET /device_datas/query 查詢設備資料

### 歷史資料

  目前能查詢的範圍為 K 館資料
  1. 燈會期間資料 2024-02-24 ~ 2024-03-10
  2. 2024-07-08 之後的資料

### Device (Pomcube)

  Pomcube為一個家用儲能設備(Device), 能夠接太陽能, 也能夠接發電裝置, 目前能查詢的 Pomcube 有下面六台 (DeviceName):
   - AA-70-2211-01-0217-874
   - AA-70-2212-01-0028-070
   - AA-70-2209-01-0079-377
   - AA-70-2211-01-0078-938
   - AA-70-2211-01-0155-160
   - AA-70-2211-01-0090-153

### Domain

  Domain 為樹狀結構, 用來區分擺放位置, 有三台目前在用的放在K館, 其餘目前沒在用的放在K館倉庫.
  下面為已經建立在資料庫中的結構, 所以查詢時 organization_id 必須為 2

  - root
    - accton (domain_id=2, organization_id=2)
    - 台南 (domain_id=3)
      - 沙崙智慧綠能科學城 (domain_id=4)
        - K館 (domain_id=5) 存放目前仍在使用的 pomcube
          - AA-70-2211-01-0217-874
          - AA-70-2212-01-0028-070
          - AA-70-2211-01-0078-938
        - K館倉庫 (domain_id=6) 存放燈會期間使用, 但目前沒在使用的 pomcube
          - AA-70-2209-01-0079-377
          - AA-70-2211-01-0155-160
          - AA-70-2211-01-0090-153


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
  "user_account": "accton_admin",
  "user_password": "111"
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
  "domain_name": "accton",
  "organization_id": 2
}
```

### Data API 路徑 - GET "/device_datas/query"

  - API說明：
    - 查詢裝置資料
  - HTTP Header：
    - Authorization: login 傳回來的 access_token。例如: "Bearer ey.123.xx"

  - 參數說明
    - organization_id: (必填) 組織 ID
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

### 傳回範例

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


### Pomcube 相關欄位 (device_output_name="pomcube_data")

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

### 太陽能預測相關欄位 (device_output_name="solar_prediction")
  - DirectRadiation: 日照功率，太陽光照射到太陽能板的強度，通常表示為瓦特每平方米 (W/m²)
  - SolarArea: 太陽能板面積 (m²)
  - SolarEff: 太陽能板發電效率 (0~1) (0%~100%)
  - SolarPower: 發電功率 (W)



## 使用範例

### 太陽能預測 (站點)
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
  device_output_name: "pomcube_data",
  start: 0,
  fields: "SolarPower,LoadPower",
  time_function: "last",
  group_by: "_field"
}
```


### 目前太陽能發電功率 (站點)
```javascript
{
  organization_id: 2,
  domain_id: 4,
  device_output_name: "pomcube_data",
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
  organization_id: 2,
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

### 每日歷史功率圖 (站點)
```javascript
{
  organization_id: 2,
  domain_id: 4,
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
  organization_id: 2,
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
  organization_id: 2,
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


### 每月太陽能發電度數及用電度數 (站點)
```javascript
{
  organization_id: 2,
  domain_id: 4,
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
  organization_id: 2,
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


### 最近24小時太陽能發電度數及用電度數 (站點)
```javascript
{
  organization_id: 2,
  domain_id: 4,
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
