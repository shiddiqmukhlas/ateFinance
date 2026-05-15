import mongoose from "mongoose";
import Menu from "./menuModel.js";

const transactionSchema = new mongoose.Schema({
    tanggalTransaksi: {
        type: Date,
        default: Date.now,
        required: [true, "Tanggal transaksi wajib diisi"],
    },
    items: [
        {
            menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
            quantity: { type: Number, required: true, min: 0 },
            totalHarga: { type: Number, required: true },
        },
    ],
    totalHarga: {
        type: Number,
        required: true,
    },

    isRetur: {
    type: Boolean,
    default: false,
    },
    originalTransaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: null,
    },
    alasanRetur: {
        type: String,
        default: "",
    },
});


transactionSchema.pre("save", async function (next) {
    try {
        if (this.items && this.items.length > 0) {
            let totalHargaTransaksi = 0;

            for (const item of this.items) {
                const menuData = await Menu.findById(item.menu);
                if (!menuData) {
                    throw new Error(`Menu dengan ID ${item.menu} tidak ditemukan`);
                }
                let itemTotal = menuData.harga * item.quantity;

                if (this.isRetur) {
                    itemTotal = -itemTotal;  // buat negatif jika transaksi retur
                }

                item.totalHarga = itemTotal;
                totalHargaTransaksi += itemTotal;
            }

            this.totalHarga = totalHargaTransaksi;
        }
        next();
    } catch (error) {
        next(error);
    }
});





const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
