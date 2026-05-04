# Changelog

## [2026-05-04]
- feat: 實作 SQLite + Drizzle ORM 資料持久化儲存
  - 導入 `better-sqlite3` 與 `drizzle-orm`。
  - 建立 `animations` 資料表與對應的 Schema。
  - 新增 `GET /api/animations` 讀取資料清單。
  - 新增 `DELETE /api/animations/[id]` 提供刪除功能。
  - 更新 `POST /api/analyze`，解析成功後即時寫入資料庫並回傳紀錄。
  - 前台串接 API，改以 `useEffect` 載入真實資料，並於卡片新增刪除操作。
