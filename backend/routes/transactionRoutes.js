import express from 'express';


import {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getEarliestTransactionDate
} from '../controllers/transactionController.js';

const router = express.Router();

// POST /api/transactions
router.post('/', createTransaction);

// router.post('/', (req, res) => {
//     console.log('Incoming Request to /transaction:', req.body); // Debug
//     res.status(201).json({ message: 'Transaction created successfully' });
//   });
  

router.get("/earliest-date", getEarliestTransactionDate);

// GET /api/transactions
router.get('/', getAllTransactions);

// GET /api/transactions/:id
router.get('/:id', getTransactionById);


// PUT /api/transactions/:id
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id
router.delete('/:id', deleteTransaction);

export default router;