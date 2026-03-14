<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const isLoggedIn = ref(!!localStorage.getItem("token"))

const logout = () => {
    localStorage.removeItem("token")
    isLoggedIn.value = false
    router.push("/login")
}
</script>

<template>
  <div class="navbar">
    <h2>My Shop</h2>

    <div class="nav-links">
      <router-link to="/">商品</router-link>
      <router-link to="/cart">購物車</router-link>
      <router-link to="/orders">訂單</router-link>
      <router-link v-if="!isLoggedIn" to="/login">登入</router-link>
      <button v-if="isLoggedIn" @click="logout">登出</button>
    </div>
  </div>

  <div class="page">
    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #222;
  color: white;
}

.nav-links {
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.page {
  padding: 24px;
}
</style>