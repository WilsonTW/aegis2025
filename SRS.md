# **軟體需求規格書 (SRS) - 能源管理系統**

## **1. 系統概述**
本系統為一個完整的能源管理後端，提供設備管理、能源排程、報修管理、事件與通知管理、用戶與權限管理，以及財務報表功能。

### **1.1 目標與範圍**
- 透過 API 管理不同類型的設備 (創能、儲能、負載設備)
- 提供能源排程控制與智能調度
- 整合報修管理與事件通知
- 提供用戶與角色權限管理
- 允許查詢設備數據並進行數據分析
- 透過智慧化調整提高能源使用效率

---

## **2. 功能需求**

### **2.1 設備管理**
| 方法 | 路徑 | 說明 |
|------|------------------------------|------------------------|
| GET  | `/api/devices`               | 查詢所有設備 |
| POST | `/api/devices`               | 新增設備 |
| PATCH| `/api/devices/{id}`          | 修改設備 |
| DELETE | `/api/devices/{id}`        | 刪除設備 |
| GET  | `/api/device_datas/query`    | 查詢設備狀態與歷史數據 |
| GET  | `/api/device_types`          | 查詢設備類型 (創能/儲能/負載) |

### **2.2 能源排程管理**
| 方法 | 路徑 | 說明 |
|------|--------------------------------|----------------------|
| GET  | `/api/power_schedulers`        | 查詢排程 |
| POST | `/api/power_schedulers`        | 新增排程 |
| PATCH| `/api/power_schedulers/{id}`   | 修改排程 |
| DELETE | `/api/power_schedulers/{id}` | 刪除排程 |
| POST | `/api/power_schedulers/update_cron_tasks` | 更新 CRON 任務 |
| GET  | `/api/power_schedulers/load_balance` | 查詢負載狀況並建議調整 |
| POST | `/api/power_schedulers/adjust_schedule` | 動態調整排程 |
| GET  | `/api/power_schedulers/price_optimization` | 根據電價調整運行策略 |

### **2.3 儲能設備管理**
| 方法 | 路徑 | 說明 |
|------|-----------------------------|----------------|
| POST | `/api/storage/charge_control` | 設定儲能充放電策略 |
| GET  | `/api/storage/status`        | 查詢儲能設備狀態 |
| GET  | `/api/storage/grid_export`   | 電網輸出限制 |

### **2.4 創能設備管理**
| 方法 | 路徑 | 說明 |
|------|-------------------------------|----------------|
| POST | `/api/generation/set_priority` | 設定發電設備優先策略 |
| POST | `/api/generation/adjust_output` | 即時調整發電輸出 |
| GET  | `/api/generation/status` | 查詢發電設備狀態 |

### **2.5 事件與通知管理**
| 方法 | 路徑 | 說明 |
|------|-------------------------------|----------------|
| POST | `/api/notify_phone`           | 手機通知 |
| GET  | `/api/events`                 | 查詢事件 |
| POST | `/api/events`                 | 創建事件 |
| PATCH| `/api/events/{id}`            | 修改事件 |
| DELETE | `/api/events/{id}`          | 刪除事件 |
| GET  | `/api/alerts`                 | 設備異常通知 |
| GET  | `/api/repair_orders/updates`  | 查詢報修狀態更新 |

### **2.6 用戶與權限管理**
| 方法 | 路徑 | 說明 |
|------|-------------------------------|----------------|
| GET  | `/api/users`                  | 查詢用戶 |
| POST | `/api/users`                  | 創建用戶 |
| PATCH| `/api/users/{id}`             | 修改用戶 |
| DELETE | `/api/users/{id}`           | 刪除用戶 |
| GET  | `/api/roles`                  | 查詢角色權限 |
| POST | `/api/auth/login`             | 用戶登入 |
| POST | `/api/auth/refresh_token`     | 刷新 Token |

### **2.7 數據分析與報表**
| 方法 | 路徑 | 說明 |
|------|-----------------------------|----------------|
| GET  | `/api/device_datas/trend_analysis` | 設備數據趨勢分析 |
| GET  | `/api/device_datas/report` | 取得設備報表 |
| GET  | `/api/device_datas/pr` | 查詢 PR 值 |
| GET  | `/api/device_datas/curtailment_ratio` | 查詢棄電比 |

(完整 API 列表已更新，包含所有現有 API 和新規劃的 API)

---

## **3. 數據流與業務邏輯**
### **3.1 能源排程邏輯**
1. **系統根據設備的類型 (創能/儲能/負載) 計算排程**
2. **用戶設定排程 (開關時間 / 負載策略)**
3. **系統根據負載情況與電價調整計劃**
4. **根據優先級決定設備的開關順序**
5. **設備運行並記錄數據**

### **3.2 儲能與發電策略**
1. **系統監測電價與發電量**
2. **低電價時充電，高電價時放電**
3. **過載時優先釋放儲能電力**

---

## **4. 未來擴展性與開發建議**
### **4.1 可能的擴展方向**
- **AI 預測能源需求，進一步優化排程**
- **增加 WebSocket，提供即時監測設備狀態**
- **整合區塊鏈，支援能源交易功能**

### **4.2 開發建議**
- **使用 NestJS 作為後端框架，確保可擴展性**
- **採用 InfluxDB 儲存時序數據，提高查詢效能**
- **前端可使用 Vue.js 或 React 作為 UI 框架**

---

## **5. 結論**
本 SRS 文件詳細描述了能源管理系統的功能與 API，並提供了未來擴展性建議。可作為開發團隊的參考指南，以確保系統符合需求並具有良好的可擴展性。

---

**📌 這份 SRS 文件可以作為開發團隊的參考，請確認是否還需要進一步調整！** 🚀

