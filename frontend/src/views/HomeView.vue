<script setup>
import { ref, onMounted } from "vue"

const products = ref([])
const selectedProduct = ref(null)

const loadProducts = async () => {
      try {
            const res = await fetch("http://localhost:3000/products")
            const data = await res.json()
            products.value = data.products
      } catch (err) {
            console.error("fetch error:", err)
      }
}

const loadProductDetail = async (productId) => {
      try {
            const res = await fetch(`http://localhost:3000/products/${productId}`)
            const data = await res.json()
            selectedProduct.value = data.product
      } catch (err) {
            console.error("product detail error:", err)
      }
}

const addToCart = async (productId) => {
      const token = localStorage.getItem("token")

      if (!token) {
            alert("請先登入")
            return
      }

      try {
            const res = await fetch("http://localhost:3000/cart/items", {
                  method: "POST",
                  headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                  },
                  body: JSON.stringify({
                        productId,
                        quantity: 1
                  })
            })

            const data = await res.json()
            console.log("addToCart result:", data)
            alert(data.message || "已加入購物車")
      } catch (err) {
            console.error("addToCart error:", err)
      }
}

onMounted(() => {
  loadProducts()
})
</script>

<template>
      <div>
            <h1>商品列表</h1>

            <div class="product-list">
                  <div v-for="p in products" :key="p.id" class="card">
                        <img :src="p.image_url" alt="" class="product-image" />
                        <h3>{{ p.name }}</h3>
                        <p>{{ p.description }}</p>
                        <p>價格：{{ p.price }}</p>
                        <p>庫存：{{ p.stock }}</p>
                        <button @click="loadProductDetail(p.id)">查看詳情</button>
                        <button @click="addToCart(p.id)">加入購物車</button>
                  </div>
            </div>

            <div v-if="selectedProduct" class="card detail-card">
                  <h2>商品詳情</h2>
                  <h3>{{ selectedProduct.name }}</h3>
                  <p>{{ selectedProduct.description }}</p>
                  <p>價格：{{ selectedProduct.price }}</p>
                  <p>庫存：{{ selectedProduct.stock }}</p>
                  <img :src="selectedProduct.image_url" alt="" style="max-width: 200px;" />
            </div>
      </div>
</template>

<style scoped>
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #e5e7eb;
  padding: 18px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.card h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 28px;
}

.card p {
  margin: 8px 0;
  color: #374151;
  line-height: 1.5;
}

.card button {
  margin-right: 8px;
  margin-top: 12px;
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.card button:hover {
  background: #1d4ed8;
}

.detail-card {
  margin-top: 28px;
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #f3f4f6;
}
</style>