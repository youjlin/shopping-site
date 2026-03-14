import { createRouter, createWebHistory } from "vue-router"

import HomeView from "../views/HomeView.vue"
import LoginView from "../views/LoginView.vue"
import CartView from "../views/CartView.vue"
import OrdersView from "../views/OrdersView.vue"
import ProductDetailView from "../views/ProductDetailView.vue"

const router = createRouter({
      history: createWebHistory(),
      routes: [
            { path: "/", component: HomeView },
            { path: "/login", component: LoginView },
            { path: "/cart", component: CartView },
            { path: "/orders", component: OrdersView },
            { path: "/products/:id", component: ProductDetailView }
      ]
})

export default router