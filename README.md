# <span style="color: orange">**LokRise**
---
### ROUTES
- 🔐 **Register/Login**
- 📊 **Dashboard** [*Seller* **&** *Buyer*]
- ℹ️ **About**

---
---

### SCHEMAS
- 🧑‍💼 **User**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: "farmer" | "buyer" | "admin",
  phone: String,
  address: {
    village: String,
    district: String,
    state: String,
    pinCode: String
  },
  language: "hi" | "bn" | "en",
  createdAt: Date,
  updatedAt: Date
}
```
- 📦 **Product**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId,  // Ref to User
  title: String,
  description: String,  // Generated by Groq
  imageUrl: String,
  category: String, // e.g., handicraft, foodgrain, textile
  price: Number,
  unit: String,  // e.g., "kg", "piece"
  location: String,  // auto-fill from seller address
  updatedAt: Date
}
```
- 📄 **Order**
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId,
  sellerId: ObjectId,
  productId: ObjectId,
  quantity: Number,
  totalAmount: Number,
  paymentStatus: "pending" | "success" | "failed",
  deliveryStatus: "placed" | "confirmed" | "shipped" | "delivered",
  transactionId: String, // from Monad or Base
  createdAt: Date,
}
```
---
---

## Environment Variables Setup

### Server Configuration
Create a `.env` file in the `server` directory using `.env.example` as a template:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=your-email@gmail.com

# Chat API Configuration
GROQ_API_KEY=your_groq_api_key
```

### Client Configuration
Create a `.env` file in the `client` directory using `.env.example` as a template:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Chat Bot Configuration 
VITE_CHAT_BOT_API_KEY=your_groq_api_key
```

Make sure to replace all placeholder values with your actual configuration data. Never commit the actual `.env` files to version control.
