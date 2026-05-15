import express from "express";
import { getTotalIncome, getIncomeThisMonth, getIncomeToday, getIncomeByCategory, getIncomeByRange, getAverageIncomeThisMonth, getTotalExpense, getExpenseByCategory, getBalance } from "../controllers/dashboardController.js";
import { get } from "mongoose";

const router = express.Router();

// get/api/dashboard
router.get("/total-income", getTotalIncome);

// get/api/dashboard
router.get("/income-today", getIncomeToday);

// get/api/dashboard
router.get("/income-this-month", getIncomeThisMonth);

// get/api/dashboard
router.get("/income-by-category", getIncomeByCategory);

// get/api/dashboard
router.get("/income-by-range", getIncomeByRange);

// get/api/dashboard
router.get("/average-income-this-month", getAverageIncomeThisMonth);


router.get("/total-expense", getTotalExpense);


router.get("/expense-by-category", getExpenseByCategory);

router.get("/balance", getBalance);




// Endpoint lainnya (total expense, saldo) bisa ditambahkan di sini

export default router;
