# Skills 說明

本專案已成功安裝多項開發技能 (Skills)，這些技能為 AI 代理提供了針對不同領域與技術的專家知識、最佳實踐及架構指引。以下為目前專案中可用的技能清單與功能說明：

## 🎨 前端與 UI 模式 (Frontend & UI)

*   **`frontend-patterns`**
    *   **功能**：提供 React、Next.js 應用的前端架構最佳實踐。
    *   **涵蓋範圍**：元件設計、狀態管理、效能最佳化（如避免不必要的 Re-render）、Server Components 與 Client Components 的正確劃分。
*   **`design-system`**
    *   **功能**：指導如何建立與維護一套擴展性高的設計系統 (Design System)。
    *   **涵蓋範圍**：Design Tokens 結構、元件抽象化、文件撰寫及樣式隔離。
*   **`accessibility`**
    *   **功能**：確保開發的網頁符合無障礙 (a11y) 標準。
    *   **涵蓋範圍**：ARIA 標籤的正確使用、鍵盤導航邏輯、色彩對比度及螢幕閱讀器友善設計。
*   **`frontend-slides`**
    *   **功能**：專注於前端互動展示、投影片或卡片式介面的設計模式。
    *   **涵蓋範圍**：視覺層級、轉場特效架構及回應式排版。

## ⚙️ 後端、API 與資料庫 (Backend, API & DB)

*   **`backend-patterns`**
    *   **功能**：提供 Node.js / Next.js API Routes 的後端架構指引。
    *   **涵蓋範圍**：三層架構 (Controller/Service/Repository)、錯誤處理統一格式、中介軟體實作及依賴注入。
*   **`api-design`**
    *   **功能**：RESTful API 與系統介面的設計準則。
    *   **涵蓋範圍**：路由命名規範、資源層級、HTTP 狀態碼的正確應用及分頁/過濾機制。
*   **`database-migrations`**
    *   **功能**：資料庫 Schema 管理與遷移策略。
    *   **涵蓋範圍**：零停機部署 (Zero-downtime deployment) 的資料庫異動、回滾機制及 ORM (如 Drizzle) 最佳實踐。

## 🤖 AI 與 Agent 開發 (AI & Agents)

*   **`data-scraper-agent`**
    *   **功能**：建構高可用性的資料抓取與處理代理。
    *   **涵蓋範圍**：排程爬蟲、利用 AI (如 Gemini) 進行資料清理與豐富化，以及規避反爬蟲機制的策略。
*   **`ai-first-engineering`**
    *   **功能**：在專案設計初期即考量 AI 整合的工程模式。
    *   **涵蓋範圍**：Prompt 管理、模型回退機制 (Fallback)、串流回應 (Streaming) 及不可靠 LLM 輸出的防錯設計。
*   **`agentic-engineering`**
    *   **功能**：構建自主 AI 代理系統的進階模式。
    *   **涵蓋範圍**：工具呼叫 (Tool Calling) 的抽象化、記憶管理、狀態機設計及多代理協作架構。

## 🏗️ 系統架構與測試 (Architecture & Testing)

*   **`architecture-decision-records`**
    *   **功能**：標準化架構決策紀錄 (ADR)。
    *   **涵蓋範圍**：規範如何撰寫、評估並留存技術選型或架構異動的上下文與原因。
*   **`coding-standards`**
    *   **功能**：跨語言的通用程式碼品質標準。
    *   **涵蓋範圍**：Clean Code 原則、命名慣例、單一職責原則 (SRP) 及防禦性程式設計。
*   **`e2e-testing`**
    *   **功能**：使用 Playwright 等工具進行端到端測試的策略。
    *   **涵蓋範圍**：Page Object Model (POM) 模式、環境隔離、CI/CD 整合及 Flaky Test 防範。
*   **`browser-qa`**
    *   **功能**：自動化瀏覽器層級的品質保證。
    *   **涵蓋範圍**：跨瀏覽器相容性測試、視覺回歸測試 (Visual Regression) 及效能稽核 (Performance Audits)。

---
*備註：這些技能檔案統一放置於 `.agents/skills/` 目錄下，AI 助理在執行相關任務時會自動讀取並遵循其中的指導原則。*
