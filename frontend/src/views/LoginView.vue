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
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 24px;
  background: white;
}

.login-box input {
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>