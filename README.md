# 購物網站練習

本專案為一個使用 **Vue + Express + SQLite** 開發的簡易全端購物網站。

---

# 使用技術 (Tech Stack)

## 前端 (Frontend)

- Vue 3
- Vite
- Vue Router

## 後端 (Backend)

- Node.js
- Express.js
- SQLite (better-sqlite3)

## 身分驗證

- JWT (JSON Web Token)
- bcrypt 密碼雜湊

---

# 專案結構

```

shopping-site
│
├─ frontend/          Vue 前端程式
│
├─ backend/           Express 後端 API
│
├─ README.md

````

---

# 安裝與執行方式

## 下載專案

```bash
git clone <你的-github-repo>
cd shopping-site
````

---

## 啟動 Backend

進入 backend 資料夾

```bash
cd backend
```

安裝套件

```bash
npm install
```

建立 `.env` 檔案

```
JWT_SECRET=your_secret_key
```

啟動後端伺服器

```bash
npm run dev
```

後端會運行在

```
http://localhost:3000
```

---

## 啟動 Frontend

開另一個 terminal

```bash
cd frontend
```

安裝套件

```bash
npm install
```

啟動前端

```bash
npm run dev
```

前端會運行在

```
http://localhost:5173
```

---

# 資料庫設計

## users

儲存使用者帳號資訊

| 欄位         | 型別      |
| ---------- | ------- |
| id         | INTEGER |
| email      | TEXT    |
| password   | TEXT    |
| created_at | TEXT    |

---

## products

儲存商品資訊

| 欄位          | 型別      |
| ----------- | ------- |
| id          | INTEGER |
| name        | TEXT    |
| description | TEXT    |
| price       | REAL    |
| image_url   | TEXT    |
| stock       | INTEGER |

---

## carts

儲存使用者購物車

| 欄位      | 型別      |
| ------- | ------- |
| id      | INTEGER |
| user_id | INTEGER |

---

## cart_items

儲存購物車內的商品

| 欄位         | 型別      |
| ---------- | ------- |
| id         | INTEGER |
| cart_id    | INTEGER |
| product_id | INTEGER |
| quantity   | INTEGER |

---

## orders

儲存訂單資訊

| 欄位         | 型別      |
| ---------- | ------- |
| id         | INTEGER |
| user_id    | INTEGER |
| total      | REAL    |
| created_at | TEXT    |

---

## order_items

儲存每筆訂單中的商品

| 欄位         | 型別      |
| ---------- | ------- |
| id         | INTEGER |
| order_id   | INTEGER |
| product_id | INTEGER |
| quantity   | INTEGER |
| price      | REAL    |

---

# 使用者驗證

本專案使用 JWT 進行登入驗證：

1. 使用者登入成功後
2. 後端會回傳 JWT Token
3. 前端將 Token 儲存在 `localStorage`
4. 後續 API 請求需附帶：

```
Authorization: Bearer <token>
```

---

# 系統功能

## 使用者功能

* 註冊帳號
* 登入
* 登出

---

## 商品瀏覽

使用者可以：

* 查看商品列表
* 查看商品詳細資訊

---

## 購物車功能

使用者可以：

* 將商品加入購物車
* 修改商品數量
* 刪除商品
* 查看購物車總價

---

## 訂單系統

使用者可以：

* 結帳購物車
* 建立訂單
* 查看歷史訂單
* 查看訂單詳細內容

---

# 使用流程

1. 註冊帳號
2. 登入系統
3. 瀏覽商品
4. 加入購物車
5. 修改購物車商品數量
6. 結帳
7. 查看歷史訂單
8. 查看訂單詳細資訊

---

# 說明

本專案為教學用途的簡易電商系統範例，主要練習：

* REST API 設計
* JWT 身分驗證
* 前後端分離架構
* 資料庫設計
