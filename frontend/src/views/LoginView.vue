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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem("token", data.token)
      router.push("/")
    } else {
      alert("Login failed")
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">

      <h1>Login</h1>

      <div class="input-group">
        <label>Email</label>
        <input v-model="email" type="email" />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input v-model="password" type="password" />
      </div>

      <button class="btn" @click="login">
        Login
      </button>

      <p class="bottom-text">
        Don't have an account?
        <router-link to="/register">Sign up</router-link>
      </p>

    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}

.login-card {
  width: 420px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 18px rgba(0,0,0,0.05);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 22px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.btn:hover {
  background: #1d4ed8;
}

.bottom-text {
  margin-top: 16px;
  text-align: center;
}
</style>