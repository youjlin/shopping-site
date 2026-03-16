<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const email = ref("")
const password = ref("")
const confirmPassword = ref("")

const register = async () => {

  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match")
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

    if (res.ok) {
      alert("Registration successful, please log in")
      router.push("/login")
    } else {
      alert("Registration failed")
    }

  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="register-page">

    <div class="register-card">

      <div class="left">
        <h1>Sign Up</h1>
        <p>Create an account to start shopping.</p>
      </div>

      <div class="right">

        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="email">
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password">
        </div>

        <div class="input-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password">
        </div>

        <button class="btn" @click="register">
          Register
        </button>

        <p class="bottom-text">
          Already have account?
          <router-link to="/login">Login</router-link>
        </p>

      </div>

    </div>

  </div>
</template>

<style scoped>

.register-page {
  min-height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f8fafc;
}

.register-card {
  width: 900px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.left {
  padding: 50px;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.left h1 {
  margin-bottom: 10px;
}

.right {
  padding: 50px;
}

.input-group {
  margin-bottom: 20px;
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