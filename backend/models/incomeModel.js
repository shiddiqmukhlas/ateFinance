import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    nominal: {
      type: Number,
      required: [true, 'Nominal wajib diisi'],
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
          values: ['pendapatan offline', 'pendapatan online', 'investasi', 'retur penjualan', 'lainnya'],
          message: 'Kategori tidak valid',
        },
    },
  });
  

  const Income = mongoose.model("Income", incomeSchema)
  
  export default Income