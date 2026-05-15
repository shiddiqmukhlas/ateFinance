import mongoose from "mongoose";
import validator from "validator";
import bycrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "username harus diinput"],
        unique: [true, "username sudah digunakan"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email harus diinput"],
        unique: [true, "email sudah digunakan"],
        validate: [validator.isEmail, "email tidak valid"],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password harus diinput"],
        minlength: 6,
        trim: true,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }

})


userSchema.methods.comparePassword = async function (password) {
    if (!password || !this.password) {
        throw new Error("Password atau hashed password tidak tersedia.");
    }
    return await bycrypt.compare(password, this.password);
};


userSchema.pre("save", async function () {
    const salt = await bycrypt.genSalt(10)
    this.password = await bycrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User