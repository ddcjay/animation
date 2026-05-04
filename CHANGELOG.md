# Changelog

## [2026-05-04] (Slider Test Page)
- feat: 實作拖拽與鍵盤驅動照片輪播測試頁面 (`/test-slider`)
  - 基於 GSAP Timeline 與 Observer 建立全局進度 (`progress`) 管理。
  - 實作滑鼠/觸控垂直拖拽與滾輪偵測切換照片。
  - 實作鍵盤上下/左右方向鍵觸發照片切換。
  - 加入滑鼠釋放時的自動吸附 (Snap) 動畫。
  - 實作背景照片視差 (Parallax) 與文字垂直切片錯位進場動畫。

## [2026-05-04] (Puppeteer Preview)
- feat: 實作 Puppeteer 動畫即時截圖預覽功能
  - 安裝 `puppeteer` 套件以支援後端網頁截圖。
  - 更新資料庫 schema，為 `animations` 表格加入 `previewType` 與 `previewUrl` 欄位並執行 push。
  - 新增 `src/lib/puppeteer.ts` 建立 `captureScreenshot` 工具函式，將截圖儲存至 `public/previews/`。
  - 於 `/api/analyze/route.ts` 整合截圖流程，並同步更新資料庫的預覽欄位。
  - 調整 `AnimationCard` 與 `AnimationModal` 前端元件，成功抓取截圖時顯示 `img` 圖片，取代原有的佔位文字。
## [2026-05-04]
- fix: 增強 AI 伺服器錯誤處理與 JSON 格式解析穩定度
  - 優化 `route.ts` 擷取 JSON 的邏輯，使用 Regex 過濾雜訊以避免 `SyntaxError`。
  - 當 Gemini 服務異常時，拋出明確的錯誤訊息供前端顯示。

- feat: 實作動態 AI 模型切換功能
  - 於新增動畫卡片視窗加入模型選擇機制。
  - 將核心分析模型預設為 `gemini-3.1-flash-lite-preview`。

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
