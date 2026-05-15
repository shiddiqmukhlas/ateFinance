import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

// Router
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import returRoutes from './routes/returRoutes.js'

import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Definisikan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware untuk file statis
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware
app.use(cookieParser())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}



// Postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }))




// Parent Routes
app.use('/api/auth', authRoutes)
app.use('/api/income', incomeRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/expense', expenseRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/retur', returRoutes)

app.use(notFound)
app.use(errorHandler)


// MongoDB Connection
connectDB();


// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));