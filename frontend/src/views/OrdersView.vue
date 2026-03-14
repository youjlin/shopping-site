<script setup>
import { ref, onMounted } from "vue"

const orders = ref([])
const selectedOrder = ref(null)

const loadOrders = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
            orders.value = []
            return
      }

      try {
            const res = await fetch("http://localhost:3000/orders", {
                  headers: {
                        Authorization: "Bearer " + token
                  }
            })

            const data = await res.json()
            orders.value = data.orders
      } catch (err) {
            console.error("loadOrders error:", err)
      }
}

const loadOrderDetail = async (orderId) => {
      const token = localStorage.getItem("token")

      if (!token) return

      try {
            const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
                  headers: {
                        Authorization: "Bearer " + token
                  }
            })

            const data = await res.json()
            selectedOrder.value = data
      } catch (err) {
            console.error("order detail error:", err)
      }
}

onMounted(() => {
      loadOrders()
})
</script>

<template>
      <div>
            <h1>歷史訂單</h1>

            <div v-if="orders.length === 0">
                  目前沒有訂單
            </div>

            <div v-else>
                  <div v-for="order in orders" :key="order.id" class="card">
                        <p>訂單編號：{{ order.id }}</p>
                        <p>總價：{{ order.total }}</p>
                        <p>建立時間：{{ order.created_at }}</p>

                        <button @click="loadOrderDetail(order.id)">
                              查看訂單詳情
                        </button>
                  </div>
            </div>

            <div v-if="selectedOrder" class="card detail-card">
                  <h2>訂單詳情</h2>

                  <p>訂單編號：{{ selectedOrder.order.id }}</p>
                  <p>總價：{{ selectedOrder.order.total }}</p>
                  <p>建立時間：{{ selectedOrder.order.created_at }}</p>

                  <h3>商品</h3>

                  <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
                        <p>商品：{{ item.name }}</p>
                        <p>數量：{{ item.quantity }}</p>
                        <p>單價：{{ item.price }}</p>
                  </div>
            </div>
      </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  background: white;
  margin-bottom: 16px;
}

.detail-card {
  margin-top: 24px;
}

.order-item {
  border-top: 1px solid #eee;
  padding-top: 8px;
  margin-top: 8px;
}
</style>