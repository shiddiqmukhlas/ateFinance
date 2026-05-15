import express from 'express'
import { authMiddleware, permissionUser } from '../middleware/authMiddleware.js';
import { RegisterUser, LoginUser, LogoutUser, getUser } from '../controllers/authController.js';

const router = express.Router();

// post/api/auth/register
router.post('/register', RegisterUser)

// post/api/auth/login
router.post('/login', LoginUser)

// get/api/auth/logout
router.get('/logout', LogoutUser)

// get/api/auth/getUser
router.get('/getUser', authMiddleware, getUser)

// get/api/auth/test
router.get('/test/', authMiddleware, permissionUser("admin"), (req, res) => {
    res.send("berhasil")
})



export default router