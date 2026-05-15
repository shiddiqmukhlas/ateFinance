import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const authMiddleware = async (req, res, next) => {
    let token
    token = req.cookies.jwt

    if (!token) {
        return next(
            res.status(401).json({
                message: "anda tidak boleh mengakses halaman ini"
            })
        )
    }

    let decoded
    try {
        decoded = await jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return next(
            res.status(401).json({
                message: "token yang dimasukkan salah/tidak ada"
            })
        )
    }

    const currentUser = await User.findById(decoded.id)

    if (!currentUser) {
        return next(
            res.status(401).json({
                message: "user tidak ditemukan"
            })
        )
    }

    req.user = currentUser
    next()


}


export const permissionUser = (...roles) =>{
    return (req, res, next) => {
        // ["admin", "user"]
        if (!roles.includes(req.user.role)) {
            return next(
                res.status(403).json({
                    message: "role anda tidak memiliki akses untuk halaman ini"
                })
            )
        }
        next()
    }
}
