<script setup>
import { ref, watchEffect } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const isLoggedIn = ref(!!localStorage.getItem("token"))

watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("token")
})

const logout = () => {
  localStorage.removeItem("token")
  isLoggedIn.value = false
  router.push("/login")
}
</script>

<template>
  <div class="app-shell">
    <header class="navbar">
      <div class="brand" @click="$router.push('/')">
        🛒 My Shop
      </div>

      <nav class="nav-links">
        <router-link to="/">Products</router-link>
        <router-link to="/cart">Cart</router-link>
        <router-link to="/orders">Orders</router-link>
        <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
        <button v-if="isLoggedIn" class="logout-btn" @click="logout">Logout</button>
      </nav>
    </header>

    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f6f8fb;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 32px;
  background: linear-gradient(135deg, #1f2937, #111827);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.brand {
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: 0.2s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.12);
}

.logout-btn {
  border: none;
  background: #ef4444;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}
</style>