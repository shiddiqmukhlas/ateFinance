import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    nominal: {
        type: Number,
        required: [true, 'Nominal wajib diisi'],
        min: [1, 'Nominal harus lebih besar dari 0'],
    },
    deskripsi: {
        type: String,
        required: [true, 'Deskripsi wajib diisi'],
    },
    tanggal: {
        type: Date,
        required: [true, 'Tanggal wajib diisi'],
    },
    kategori: {
        type: String,
        required: [true, 'Kategori wajib diisi'],
        enum: {
            values: ['peralatan', 'bahan baku', 'kemasan', 'gaji karyawan', 'tagihan', 'lainnya'],
            message: 'Kategori tidak valid',
        },
    },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
