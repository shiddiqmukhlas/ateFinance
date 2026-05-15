import express from 'express';
import {
    createMenu,
    getMenus,
    getMenuById,
    updateMenu,
    deleteMenu,
    menuDetail
} from '../controllers/menuController.js';

import upload from '../middleware/upload.js';

const router = express.Router();

// POST /api/menu
router.post('/', upload.single('fotoMenu'), createMenu);

// GET /api/menu
router.get('/', getMenus);

// GET /api/menu/:id
router.get('/:id', getMenuById);

// PUT /api/menu/:id
router.put('/:id', upload.single('fotoMenu'), updateMenu);

// DELETE /api/menu/:id
router.delete('/:id', deleteMenu);


router.post("/details", menuDetail);




export default router;
