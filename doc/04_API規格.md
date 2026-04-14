# API 規格書

本文件紀錄供前端與後台呼叫的 API 路由與資料格式。

## `POST /api/analyze`

**用途**：接收目標網站的 URL，透過爬蟲與 LLM 分析該頁面中所使用的動畫技術架構，並嘗試提取核心程式碼。

### Request
- **Headers**:
  - `Content-Type`: `application/json`
- **Body**:
  ```json
  {
    "url": "https://example.com/animation-demo"
  }
  ```

### Response (Success 200)
- **Body**:
  ```json
  {
    "success": true,
    "data": {
      "title": "範例動畫名稱",
      "categories": ["GSAP", "ScrollTrigger", "CSS"],
      "description": "這是一個利用 GSAP 達成的捲動視差效果。",
      "techStack": [
        "GSAP (v3.12)",
        "React",
        "Tailwind CSS"
      ],
      "codeSnippet": "// 擷取出的一段核心程式碼\ngsap.to('.box', { x: 100 });"
    }
  }
  ```

### Response (Error 400 / 500)
- **Body**:
  ```json
  {
    "success": false,
    "error": "無法抓取該網站或解析失敗"
  }
  ```
