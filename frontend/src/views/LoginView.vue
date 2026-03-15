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
            <div class="login-box">
                  <h1>登入 / 註冊</h1>

                  <input v-model="email" placeholder="Email" />
                  <input v-model="password" type="password" placeholder="Password" />

                  <div class="actions">
                        <button @click="register">註冊</button>
                        <button @click="login">登入</button>
                  </div>
            </div>
      </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 28px;
  background: white;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.login-box h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

.login-box input {
  width: 100%;
  margin-bottom: 14px;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  flex: 1;
  border: none;
  background: #2563eb;
  color: white;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
}

.actions button:hover {
  background: #1d4ed8;
}
</style>