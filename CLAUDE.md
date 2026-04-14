# 全域系統指令與開發規範 (Global Rules)

這份文件用於規範 AI 助手與開發者共同協作時的通用守則。

## 溝通與回覆
- **強制使用繁體中文 (Traditional Chinese)**：所有回覆、程式碼註解、以及撰寫的開發文件都必須使用繁體中文。

## 程式碼開發守則
- **更新任務進度**：每次完成特定階段或重要組件開發後，請同步更新 `doc/03_開發任務進度紀錄.md` 或是您的任務追蹤神器 (Task list)。
- **程式碼風格**：
  - 前端基於 `Next.js App Router` 與 `Tailwind CSS` 撰寫。
  - 動態效果主要採用 `GSAP` 或 `Framer Motion`，並注重效能。

## 版本控制 (Git)
- **自動化 Commit**：對於所有提交的 Code Changes，若有進行版本控管，必須生成帶有明確描述的 Git commit messages (包含更動了哪些檔案、為了解決什麼問題)。
