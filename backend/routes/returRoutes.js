import express from 'express';


import {
    createReturTransaction, 
    getReturById,
    getAllRetur,
} from '../controllers/returController.js';

const router = express.Router();

// POST untuk buat retur
router.post('/', createReturTransaction);

// GET untuk ambil detail retur berdasarkan ID
router.get('/:id', getReturById);

// GET untuk ambil semua retur
router.get('/', getAllRetur);

export default router;