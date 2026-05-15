import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
import asyncHandler from "../middleware/asyncHandler.js"

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expire: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false
    };

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role // Tambahkan role ke response
        }
    });
};


export const RegisterUser = asyncHandler(async (req, res) => {

    const isFirstAccount = (await User.countDocuments()) === 0

    const role = isFirstAccount ? "admin" : "user"
    
    const createUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role
    })
    
    createSendToken(createUser, 201, res)

})

export const LoginUser = asyncHandler(async (req, res) => {
    // cek jika email dan password tidak diisi
    if (!req.body.email || !req.body.password) {
        res.status(400)
        throw new Error('Tolong isi email dan password')
        
    }

    // Cari user berdasarkan email
    const userData = await User.findOne({ email: req.body.email }).select('+password');
    if (!userData) {
        res.status(404); // Status 404 untuk email tidak ditemukan
        throw new Error('Email tidak terdaftar');
    }

    // Cek password
    const isPasswordValid = await userData.comparePassword(req.body.password);
    if (!isPasswordValid) {
        res.status(401); // Status 401 untuk password salah
        throw new Error('Password salah');
    }

    // cek jika email yg diinput sudah terdaftar di database
    if (userData && (await userData.comparePassword(req.body.password))) {
        createSendToken(userData, 200, res)
    }else{
        res.status(400)
        throw new Error('invalid user')
    }

})

export const LogoutUser = (req, res) => {
    res.cookie('jwt', '', {
        expire : new Date(0),
        httpOnly: true,
        security: false
    })

    res.status(200).json({
        message : "anda berhasil logout"
    })
}

export const getUser = async (req, res) => {
    const user = await User.findById(req.user.id).select({ password: 0 })

    if (user) {
        return res.status(200).json({ user })
    }

    return res.status(401).json({
        message : "user tidak ditemukan"
    })
}