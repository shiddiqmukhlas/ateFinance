import express from 'express';
import { calculateDateRange } from '../middleware/dateRangeHandler.js';
import { createExpense, getExpenses, getExpenseById, updateExpense, deleteExpense, getExpenseChartData } from '../controllers/expenseController.js';
import ExpenseModel from '../models/expenseModel.js';

const router = express.Router();

// POST /api/expense
router.post('/', createExpense);

router.get("/chart", getExpenseChartData);

// GET /api/expense
router.get('/', calculateDateRange(ExpenseModel), getExpenses);

// GET /api/expense/:id
router.get('/:id', getExpenseById);

// PUT /api/expense/:id
router.put('/:id', updateExpense);

// DELETE /api/expense/:id
router.delete('/:id', deleteExpense);

export default router;
