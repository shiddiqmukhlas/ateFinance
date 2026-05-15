import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    namaMenu: {
        type: String,
        required: [true, 'Nama menu wajib diisi'],
    },
    fotoMenu: {
        type: String,
        required: [true, 'Foto menu wajib diunggah'],
    },
    kategoriMenu: {
        type: String,
        required: [true, 'Kategori menu wajib diisi'],
        enum: {
            values: ['makanan', 'tambahan', 'cemilan', 'minuman'],
            message: 'Kategori tidak valid',
        },
    },
    harga: {
        type: Number,
        required: [true, 'Harga wajib diisi'],
        min: [1, 'Harga harus lebih besar dari 0'],
    },
    status: {
        type: String,
        required: [true, 'Status wajib diisi'],
        enum: {
            values: ['aktif', 'stok habis'],
            message: 'Status tidak valid',
        },
    },
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
