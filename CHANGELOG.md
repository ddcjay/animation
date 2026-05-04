# Changelog

## [2026-05-04]
- feat: 實作深色模式與搜尋過濾功能
  - 導入 `next-themes` 支援系統深淺色主題切換。
  - 修正 Tailwind V4 樣式中對於 `.dark` 類別的支援。
  - 實作 Header 即時搜尋功能，透過狀態提升至 `page.tsx` 進行標題與描述的關鍵字過濾。

- chore: 新增環境變數設定與測試準備
  - 建立 `.env.example` 範本檔案。
  - 協助開發者完成 `GEMINI_API_KEY` 設定以測試 AI 解析核心。

- feat: 實作 SQLite + Drizzle ORM 資料持久化儲存
  - 導入 `better-sqlite3` 與 `drizzle-orm`。
  - 建立 `animations` 資料表與對應的 Schema。
  - 新增 `GET /api/animations` 讀取資料清單。
  - 新增 `DELETE /api/animations/[id]` 提供刪除功能。
  - 更新 `POST /api/analyze`，解析成功後即時寫入資料庫並回傳紀錄。
  - 前台串接 API，改以 `useEffect` 載入真實資料，並於卡片新增刪除操作。
