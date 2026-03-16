<script setup>
import { ref, onMounted } from "vue"

const cartItems = ref([])
const cartTotal = ref(0)

const loadCart = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
            cartItems.value = []
            cartTotal.value = 0
            return
      }

      try {
            const res = await fetch("http://localhost:3000/cart", {
                  headers: {
                        Authorization: "Bearer " + token
                  }
            })

            const data = await res.json()
            cartItems.value = data.items
            cartTotal.value = data.total
      } catch (err) {
            console.error("cart error:", err)
      }
}

const updateQuantity = async (cartItemId, newQuantity) => {
      const token = localStorage.getItem("token")

      if (!token) {
            alert("Please log in first.")
            return
      }

      try {
            const res = await fetch(`http://localhost:3000/cart/items/${cartItemId}`, {
                  method: "PATCH",
                  headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                  },
                  body: JSON.stringify({
                        quantity: newQuantity
                  })
            })

            const data = await res.json()
            console.log("updateQuantity:", data)

            await loadCart()
      } catch (err) {
            console.error("updateQuantity error:", err)
      }
}

const removeCartItem = async (cartItemId) => {
      const token = localStorage.getItem("token")

      if (!token) return

      try {
            const res = await fetch(`http://localhost:3000/cart/items/${cartItemId}`, {
                  method: "DELETE",
                  headers: {
                        Authorization: "Bearer " + token
                  }
            })

            const data = await res.json()
            console.log("remove item:", data)

            await loadCart()
      } catch (err) {
            console.error("removeCartItem error:", err)
      }
}

const checkout = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
            alert("Please log in first.")
            return
      }

      try {
            const res = await fetch("http://localhost:3000/orders", {
                  method: "POST",
                  headers: {
                        Authorization: "Bearer " + token
                  }
            })

            const data = await res.json()

            if (res.ok) {
                  alert("Order created successfully.")
                  await loadCart()
            } else {
                  alert(data.message || "Checkout failed.")
            }
      } catch (err) {
            console.error("checkout error:", err)
      }
}

onMounted(() => {
      loadCart()
})
</script>

<template>
      <div>
            <h1>Cart</h1>

            <div v-if="cartItems.length === 0">
                  Your cart is empty.
            </div>

            <div v-else>
                  <div v-for="item in cartItems" :key="item.cartItemId" class="card">
                        <h3>{{ item.name }}</h3>
                        <p>Unit Price: {{ item.price }}</p>
                        <p>
                              Quantity:
                              <button @click="updateQuantity(item.cartItemId, item.quantity - 1)">-</button>
                              {{ item.quantity }}
                              <button @click="updateQuantity(item.cartItemId, item.quantity + 1)">+</button>
                              <button @click="removeCartItem(item.cartItemId)">Remove</button>
                        </p>
                        <p>Subtotal: {{ item.subtotal }}</p>
                  </div>

                  <h3>Total: {{ cartTotal }}</h3>
                  <button @click="checkout">Checkout</button>
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
</style>