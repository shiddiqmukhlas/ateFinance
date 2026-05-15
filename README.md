git commit -m "initial commit"# 💰 ATEFinance

**ATEFinance** is a web-based finance management & Point of Sale (POS) application designed to help small and medium businesses track income, expenses, and sales transactions — all from a clean, real-time dashboard.

---

## 🚀 Features

- 🔐 **Authentication** — Register & Login with JWT + HTTP-only cookie session
- 📊 **Dashboard** — Financial summary with income vs expense charts (ApexCharts)
- 💵 **Income Management** — Add, edit, and delete income records
- 💸 **Expense Management** — Add, edit, and delete expense records
- 🛒 **Point of Sale (POS)** — Cashier system with shopping cart & product menu
- 📋 **Menu Management** — Full CRUD for products/menu items with image upload
- 🧾 **Transaction History** — View transaction details & process returns
- 🖨️ **Receipt Printing** — ESC/POS USB printer support
- 📄 **PDF Export** — Generate reports using jsPDF + AutoTable

---

## 🛠️ Tech Stack

### Frontend
| Technology | Description |
|---|---|
| [Vue 3](https://vuejs.org/) | Core framework (Composition API) |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Vue Router 4](https://router.vuejs.org/) | Client-side routing |
| [Pinia](https://pinia.vuejs.org/) | State management |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [ApexCharts](https://apexcharts.com/) | Interactive chart visualization |
| [Axios](https://axios-http.com/) | HTTP client |
| [jsPDF](https://github.com/parallax/jsPDF) | PDF report generation |
| [Flatpickr](https://flatpickr.js.org/) | Date picker |
| [Day.js](https://day.js.org/) | Date manipulation |

### Backend
| Technology | Description |
|---|---|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API server |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM |
| [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Authentication & password hashing |
| [Multer](https://github.com/expressjs/multer) | Image file upload |
| [ESC/POS](https://github.com/song940/node-escpos) | Receipt printer integration |
| [Nodemon](https://nodemon.io/) | Auto-restart server on file changes |
| [Concurrently](https://github.com/open-cli-tools/concurrently) | Run frontend & backend simultaneously |

---

## 📁 Project Structure

```
ATEFinance/
├── backend/
│   ├── app.js              # Express entry point
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handler logic
│   ├── middleware/         # Auth & error handler
│   ├── models/             # Mongoose schemas (User, Menu, Transaction, Income, Expense)
│   ├── routes/             # API route definitions
│   ├── uploads/            # Uploaded image files
│   └── .env                # Environment variables
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.vue
        ├── main.js
        ├── api.js              # Axios instance
        ├── router/             # Vue Router config
        ├── stores/             # Pinia stores
        ├── views/              # Main pages
        │   ├── DashboardView.vue
        │   ├── PemasukanView.vue
        │   ├── PengeluaranView.vue
        │   ├── PosView.vue
        │   ├── MenuView.vue
        │   ├── TransaksiView.vue
        │   ├── LoginView.vue
        │   └── RegisterView.vue
        ├── components/         # Reusable components
        ├── layouts/            # Layout wrappers
        ├── elements/           # Small UI elements
        └── utils/              # Helper functions
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB Atlas** account or a local MongoDB instance
- **npm** v9+

### 1. Clone the Repository
```bash
git clone https://github.com/username/ATEFinance.git
cd ATEFinance
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=6d
NODE_ENV=development
API_BASE_URL=http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Run the Application

**Option 1 — Run both servers at once (from `backend/` folder):**
```bash
cd backend
npm run dev
```
> This uses `concurrently` to start both the Express server and the Vite dev server simultaneously.

**Option 2 — Run separately:**
```bash
# Terminal 1 — Backend
cd backend && npm run server

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 5. Access the Application
| Service | URL |
|---|---|
| Frontend (Vue) | http://localhost:5173 |
| Backend (API) | http://localhost:5000 |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive token |
| `GET` | `/api/dashboard` | Get dashboard summary data |
| `GET/POST` | `/api/income` | Income management |
| `GET/POST` | `/api/expense` | Expense management |
| `GET/POST` | `/api/menu` | Menu/product management |
| `GET/POST` | `/api/transaction` | Transaction management |
| `GET/POST` | `/api/retur` | Return/refund management |

---

## 🔐 Authentication

The system uses **JWT (JSON Web Token)** stored in an **HTTP-only cookie** for secure session handling. Available roles:
- `user` — Standard cashier access
- `admin` — Full data management access

---

## 👤 Author

**Shiddiq Mukhlas**


