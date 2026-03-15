<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const register = async () => {

  if (password.value !== confirmPassword.value) {
    alert("兩次輸入的密碼不一致")
    return
  }

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

    if (res.ok) {
      alert("註冊成功，請登入")
      router.push("/login")
    } else {
      alert(data.message || "註冊失敗")
    }

  } catch (err) {
    console.error("register error:", err)
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>註冊</h1>
      <p class="subtitle">建立你的新帳號</p>

      <input v-model="email" type="email" placeholder="Email" />

      <input
        v-model="password"
        type="password"
        placeholder="密碼"
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="確認密碼"
      />

      <button class="primary-btn" @click="register">
        註冊
      </button>

      <p class="switch-text">
        已經有帳號？
        <router-link to="/login">前往登入</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.subtitle {
  color: #6b7280;
  margin-bottom: 20px;
}

.auth-card input {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  box-sizing: border-box;
}

.primary-btn {
  width: 100%;
  border: none;
  background: #2563eb;
  color: white;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.primary-btn:hover {
  background: #1d4ed8;
}

.switch-text {
  margin-top: 16px;
  text-align: center;
}
</style>