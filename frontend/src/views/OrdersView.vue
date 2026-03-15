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

    <div class="orders-layout">
      <div class="orders-list">
        <div v-if="orders.length === 0" class="card">
          目前沒有訂單
        </div>

        <div v-else>
          <div v-for="order in orders" :key="order.id" class="card order-card">
            <p>訂單編號：{{ order.id }}</p>
            <p>總價：{{ order.total }}</p>
            <p>建立時間：{{ order.created_at }}</p>

            <button @click="loadOrderDetail(order.id)">
              查看訂單詳情
            </button>
          </div>
        </div>
      </div>

      <div class="orders-detail">
        <div v-if="selectedOrder" class="card detail-card">
          <h2>訂單詳情</h2>

          <p>訂單編號：{{ selectedOrder.order.id }}</p>
          <p>總價：{{ selectedOrder.order.total }}</p>
          <p>建立時間：{{ selectedOrder.order.created_at }}</p>

          <h3>商品</h3>

          <div
            v-for="item in selectedOrder.items"
            :key="item.id"
            class="order-item"
          >
            <p>商品：{{ item.name }}</p>
            <p>數量：{{ item.quantity }}</p>
            <p>單價：{{ item.price }}</p>
          </div>
        </div>

        <div v-else class="card">
          請從左側選擇一筆訂單查看詳情
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-layout {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
  align-items: start;
}

.orders-list,
.orders-detail {
  min-width: 0;
}

.card {
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 12px;
  background: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.order-card button {
  margin-top: 8px;
  border: none;
  background: #2563eb;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.order-card button:hover {
  background: #1d4ed8;
}

.detail-card h2,
.detail-card h3 {
  margin-top: 0;
}

.order-item {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-top: 10px;
}

@media (max-width: 900px) {
  .orders-layout {
    grid-template-columns: 1fr;
  }
}
</style>