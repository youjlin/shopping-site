import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import Database from "better-sqlite3";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 建立或開啟 SQLite 檔案
const db = new Database("dev.db");

// 建立 users 資料表（如果不存在）
db.exec(`
CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
`);

db.exec(`
CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      stock INTEGER NOT NULL
);
`);

const productCount = db.prepare("SELECT COUNT(*) AS count FROM products").get();

if (productCount.count === 0) {
      db.prepare(`
            INSERT INTO products (name, description, price, image_url, stock)
            VALUES (?, ?, ?, ?, ?)
      `).run("Apple", "Fresh apple", 25, "https://example.com/apple.jpg", 10);

      db.prepare(`
            INSERT INTO products (name, description, price, image_url, stock)
            VALUES (?, ?, ?, ?, ?)      
      `).run("Banana", "Sweet banana", 15, "https://example.com/banana.jpg", 20);

      db.prepare(`
            INSERT INTO products (name, description, price, image_url, stock)
            VALUES (?, ?, ?, ?, ?)      
      `).run("Milk", "Fresh milk", 35, "https://example.com/milk.jpg", 8);
}

db.exec(`
CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS cart_items (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(cart_id) REFERENCES carts(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
);      
`);

db.exec(`
CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
);
`);

app.get("/health", (req, res) => {
      res.json({ ok: true });
});

function auth(req, res, next) {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
            return res.status(401).json({ message: "No token" });
      }

      try{
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.userId = decoded.userId;
            next();
      } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
      }
      
};

app.post("/register", async (req, res) => {
      const { email, password } = req.body ?? {};

      if (!email || !password) {
      return res.status(400).json({
      message: "email and password are required"
      });
      }

      const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

      if (existingUser) {
      return res.status(400).json({
      message: "Email already exists"
      });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)"
      ).run(email, hashedPassword);

      return res.json({
      message: "User registered successfully"
      });
});

app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
});

app.post("/login", async (req, res) => {
      const { email, password } = req.body ?? {};
      
      const user = db
            .prepare("SELECT id, email, password FROM users WHERE email = ?")
            .get(email);
      
      if (!user) {
            return res.status(400).json({
                  message: "Invalid email or password"
            });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
            return res.status(400).json({
                  message: "Invalid email or password"
            });
      }

      const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
      );

      return res.json({ token });
});

app.get("/products", (req, res) => {
      const products = db.prepare("SELECT * FROM products").all();

      return res.json({ products: products });
});

app.post("/cart/items", auth, (req, res) => {
      const { productId, quantity } = req.body;

      let cart = db
            .prepare("SELECT * FROM carts WHERE user_id = ?")
            .get(req.userId);

      if (!cart) {
            db.prepare("INSERT INTO carts (user_id) VALUES (?)").run(req.userId);

            cart = db
                  .prepare("SELECT * FROM carts WHERE user_id = ?")
                  .get(req.userId);
      }

      db.prepare("INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)")
        .run(cart.id, productId, quantity);

      return res.json({ message: "added" });
});

app.get("/cart", auth, (req, res) => {
      let cart = db
            .prepare("SELECT * FROM carts WHERE user_id = ?")
            .get(req.userId);
      
      if (!cart) {
            return res.json({
                  items: [],
                  total: 0
            });
      }

      const items = db
            .prepare(`
                  SELECT
                        ci.id AS cartItemId,
                        p.id AS productId,
                        p.name,
                        p.price,
                        ci.quantity
                  FROM cart_items ci
                  JOIN products p ON ci.product_id = p.id 
                  WHERE ci.cart_id = ?      
            `)
            .all(cart.id);
      
      for (let item of items) {
            item.subtotal = item.price * item.quantity;
      }

      const total = items.reduce((sum, item) => sum + item.subtotal, 0);

      return res.json({
            items: items,
            total: total
      });
});

app.patch("/cart/items/:id", auth, (req, res) => {
      const cartItemId = req.params.id;
      const { quantity } = req.body;

      if (quantity <= 0) {
            db.prepare("DELETE FROM cart_items WHERE id = ?")
              .run(cartItemId);
            
            return res.json({
                  message: "item removed"
            });
      }

      db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?")
        .run(quantity, cartItemId);

      return res.json({
            message: "quantity updated"
      });
});

app.post("/orders", auth, (req, res) => {
      const cart = db
            .prepare("SELECT * FROM carts WHERE user_id = ?")
            .get(req.userId);

      if (!cart) {
            return res.status(400).json({
                  message: "cart not found"
            });
      }

      const items = db
            .prepare(`
                  SELECT
                        p.id AS productId,
                        p.price,
                        p.stock,
                        ci.quantity
                  FROM cart_items ci
                  JOIN products p ON ci.product_id = p.id
                  WHERE ci.cart_id = ?
            `)
            .all(cart.id);

      if (items.length === 0) {
            return res.status(400).json({
                  message: "cart is empty"
            });
      }

      for (let item of items){
            if (item.stock < item.quantity) {
                  return res.status(400).json({
                        message: `stock not enough for product ${item.productId}`
                  });
            }
      }

      const total = items.reduce((sum, item) => {
            return sum + item.price * item.quantity;
      }, 0);

      const result = db
            .prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)")
            .run(req.userId, total);

      const orderId = result.lastInsertRowid;

      for (let item of items) {
            db.prepare(`
                  INSERT INTO order_items (order_id, product_id, quantity, price)
                  VALUES (?, ?, ?, ?)
            `).run(orderId, item.productId, item.quantity, item.price);

            db.prepare(`
                  UPDATE products
                  SET stock = stock - ?
                  WHERE id = ?      
            `).run(item.quantity, item.productId);
      }

      db.prepare("DELETE FROM cart_items WHERE cart_id = ?")
        .run(cart.id);

      return res.json({
            message: "order created",
            orderId: orderId
      });
});

app.get("/products/:id", (req, res) => {
      const productId = req.params.id;

      const product = db
            .prepare("SELECT * FROM products WHERE id = ?")
            .get(productId);
      
      if (!product) {
            return res.status(404).json({
                  message: "product not found"
            });
      }

      return res.json({ product });
});

app.delete("/cart/items/:id", auth, (req, res) => {
      const cartItemId = req.params.id;

      db.prepare("DELETE FROM cart_items WHERE id = ?").run(cartItemId);

      return res.json({
            message: "item removed"
      });
});

app.get("/orders", auth, (req, res) => {
      const orders = db
            .prepare(`
                  SELECT id, total, created_at
                  FROM orders
                  WHERE user_id = ?
                  ORDER BY id DESC
            `)
            .all(req.userId);

      return res.json({ orders });
});

app.get("/orders/:id", auth, (req, res) => {
      const orderId = req.params.id;

      const order = db
            .prepare(`
                  SELECT id, user_id, total, created_at
                  FROM orders
                  WHERE id = ? AND user_id = ?
            `)
            .get(orderId, req.userId);

      if (!order) {
            return res.status(404).json({
                  message: "order not found"
            });
      }

      const items = db
            .prepare(`
                  SELECT
                  oi.id,
                  oi.product_id AS productId,
                  p.name,
                  oi.quantity,
                  oi.price
                  FROM order_items oi
                  JOIN products p ON oi.product_id = p.id
                  WHERE oi.order_id = ?
            `)
            .all(orderId);

      return res.json({
            order,
            items
      });
});