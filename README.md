# Foodie Mobile App 🍔📱

Foodie is a modern food delivery mobile application built using **React Native** and **TypeScript**. It allows users to browse foods, order food, and track deliveries in real time. The app is backed by a robust **Node.js & Express.js** API with a **PostgreSQL** database for storing user orders, foods details, and menu items. **Redux** is used for state management, and **Lucide Icons** enhance the UI.

---

## 🚀 Features

✅ Browse & search for foods 🍽️  
✅ Place food orders with a simple UI 🛒  
✅ Real-time order tracking 📍  
✅ Secure authentication & user profiles 🔐  
✅ Integrated payment gateway 💳  
✅ Dark mode support 🌙  
✅ Optimized for both Android & iOS 📱  

---

## 🛠️ Tech Stack

### **Frontend (Mobile App)**
- **React Native** with **TypeScript**
- **Redux** for state management
- **Lucide Icons** for UI enhancements

### **Backend**
- **Node.js** with **Express.js**
- **PostgreSQL** as the database
- **JWT Authentication** for security

---

## 📸 Screenshots

| Home Screen | Restaurant Details | Cart |
|------------|------------------|------|
| ![Home](screenshots/home.png) | ![Details](screenshots/details.png) | ![Cart](screenshots/cart.png) |

---

## 🚀 Installation & Setup

### **1. Clone the Repository**
```sh
git clone https://github.com/yourusername/Foodie-App.git
cd Foodie-App
```

### **2. Install Dependencies**
```sh
yarn install  # or npm install
```

### **3. Start the Development Server**
```sh
yarn start  # or npm start
```

### **4. Run on Android / iOS**
```sh
yarn android  # for Android
yarn ios  # for iOS (Mac required)
```

---

## 📡 Backend Setup

### **1. Clone & Install Backend**
```sh
git clone https://github.com/yourusername/Foodie-Backend.git
cd Foodie-Backend
npm install
```

### **2. Configure Environment Variables** (Create a `.env` file)
```sh
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
```

### **3. Start Backend Server**
```sh
npm run dev
```

---

## 🛠️ API Endpoints

| Method | Endpoint         | Description            |
|--------|-----------------|------------------------|
| GET    | /api/foods       | Fetch all foods       |
| GET    | /api/orders      | Get user orders       |
| POST   | /api/orders      | Place a new order     |
| POST   | /api/auth/login  | User login            |
| POST   | /api/auth/signup | User registration     |

---

## 🏗️ Future Improvements

🚀 Push notifications for order updates 🔔  
🚀 Multi-language support 🌍  
🚀 Advanced analytics for restaurant owners 📊  

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to improve.

---

## 📜 License

This project is **open-source** and available under the **MIT License**.

---

## 💬 Contact

📧 Email: salongautam4@gmail.com  
🔗 GitHub: [github.com/yourusername](https://github.com/yourusername)  
🚀 LinkedIn: [linkedin.com/in/salongautam](https://linkedin.com/in/salongautam)

---

💡 *Happy Coding!* 🚀
