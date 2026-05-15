import express from 'express'
import { calculateDateRange } from '../middleware/dateRangeHandler.js';
import { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome, getIncomeChartData } from '../controllers/incomeController.js';
import IncomeModel from '../models/incomeModel.js';


const router = express.Router();

// post/api/income
router.post('/', createIncome);

router.get("/chart", getIncomeChartData);

// get/api/income
router.get('/', calculateDateRange(IncomeModel), getIncomes);

// get/api/income
router.get('/:id', getIncomeById);

// put/api/income

router.put('/:id', updateIncome);

// delete/api/income
router.delete('/:id', deleteIncome);





export default router