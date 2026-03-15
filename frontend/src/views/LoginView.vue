<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")

const login = async () => {
  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("token", data.token)
      alert("登入成功")
      router.push("/")
    } else {
      alert(data.message || "登入失敗")
    }
  } catch (err) {
    console.error("login error:", err)
  }
}

const register = async () => {
  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()
    alert(data.message || "註冊完成")
  } catch (err) {
    console.error("register error:", err)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>歡迎回來</h1>
        <p>登入或註冊你的帳號，開始購物</p>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="請輸入 Email" />
      </div>

      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="請輸入密碼" />
      </div>

      <div class="actions">
        <button class="register-btn" @click="register">註冊</button>
        <button class="login-btn" @click="login">登入</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
  border: 1px solid #e5e7eb;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  color: #111827;
}

.login-header p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  box-sizing: border-box;
  transition: 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}

.actions button {
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.register-btn {
  background: #e5e7eb;
  color: #111827;
}

.register-btn:hover {
  background: #d1d5db;
}

.login-btn {
  background: #2563eb;
  color: white;
}

.login-btn:hover {
  background: #1d4ed8;
}
</style>