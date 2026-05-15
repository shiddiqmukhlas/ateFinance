import Transaction from "../models/transactionModel.js";
import Menu from "../models/menuModel.js";

import axios from "axios";

// Get all transactions
export const getAllTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, from, to, category, transactionType } = req.query;

        if (category && !["makanan", "minuman", "cemilan", "tambahan"].includes(category.toLowerCase())) {
            return res.status(400).json({ message: "Kategori tidak valid." });
        }
        

        const skip = (page - 1) * limit;
        const match = {};

        // Filter berdasarkan rentang tanggal
        if (from && !isNaN(new Date(from))) {
            match.tanggalTransaksi = match.tanggalTransaksi || {};
            match.tanggalTransaksi.$gte = new Date(from);
        }
        if (to && !isNaN(new Date(to))) {
            match.tanggalTransaksi = match.tanggalTransaksi || {};
            match.tanggalTransaksi.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
        }

        // ✅ Filter isRetur jika diberikan
        if (transactionType === "asli") {
        match.isRetur = { $ne: true };
        } else if (transactionType === "retur") {
        match.isRetur = true;
        }

        // Query dengan aggregation pipeline
        const transactions = await Transaction.aggregate([
            { $unwind: "$items" }, // Pisahkan array items menjadi dokumen individual
            {
                $lookup: {
                    from: "menus", // Koleksi menu
                    localField: "items.menu", // ID menu di items
                    foreignField: "_id", // ID di koleksi menu
                    as: "menu",
                },
            },
            { $unwind: "$menu" }, // Pastikan menu menjadi objek
            {
                $match: {
                    ...match,
                    ...(keyword
                        ? {
                              $or: [
                                  { "menu.namaMenu": { $regex: keyword, $options: "i" } },
                                  { "menu.kategoriMenu": { $regex: keyword, $options: "i" } },
                              ],
                          }
                        : {}),
                    ...(category
                        ? { "menu.kategoriMenu": { $regex: category, $options: "i" } }
                        : {}),
                },
            },
            {
                $group: {
                    _id: "$_id",
                    tanggalTransaksi: { $first: "$tanggalTransaksi" },
                    grandTotal: { $sum: "$items.totalHarga" }, // Hitung total harga keseluruhan
                    items: {
                        $push: {
                            menuId: "$menu._id",
                            menu: "$menu.namaMenu",
                            category: "$menu.kategoriMenu",
                            price: "$menu.harga",
                            quantity: "$items.quantity",
                            subTotal: "$items.totalHarga", // Total harga per item
                        },
                    },
                },
            },
            { $sort: { tanggalTransaksi: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $project: {
                    _id: 1,
                    tanggalTransaksi: 1,
                    grandTotal: 1,
                    items: 1,
                },
            },
        ]);

        const total = await Transaction.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "menus",
                    localField: "items.menu",
                    foreignField: "_id",
                    as: "menu",
                },
            },
            { $unwind: "$menu" },
            {
                $match: {
                    ...match,
                    ...(keyword
                        ? {
                              $or: [
                                  { "menu.namaMenu": { $regex: keyword, $options: "i" } },
                                  { "menu.kategoriMenu": { $regex: keyword, $options: "i" } },
                              ],
                          }
                        : {}),
                    ...(category
                        ? { "menu.kategoriMenu": { $regex: category, $options: "i" } }
                        : {}),
                },
            },
            { $group: { _id: null, total: { $sum: 1 } } },
        ]);

        res.status(200).json({
            message: "Data transaksi berhasil diambil",
            data: transactions,
            total: total.length > 0 ? total[0].total : 0,
            page: parseInt(page),
            totalPages: Math.ceil((total.length > 0 ? total[0].total : 0) / limit),
        });
    } catch (error) {
        res.status(400).json({ message: "Terjadi kesalahan", error: error.message });
    }
};




// Get transaction by ID
export const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id).populate("items.menu");
        if (!transaction) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getEarliestTransactionDate = async (req, res) => {
    try {
        // Gunakan aggregation untuk memastikan pipeline lebih fleksibel jika ada modifikasi struktur di masa depan
        const earliestTransaction = await Transaction.aggregate([
            { $match: { tanggalTransaksi: { $exists: true } } }, // Pastikan field tanggalTransaksi ada
            { $sort: { tanggalTransaksi: 1 } }, // Urutkan berdasarkan tanggal paling awal
            { $limit: 1 }, // Ambil satu dokumen paling awal
            {
                $project: {
                    _id: 0, // Tidak perlu ID
                    tanggalTransaksi: 1,
                },
            },
        ]);

        if (!earliestTransaction.length) {
            return res.status(404).json({ message: "Tidak ada transaksi ditemukan." });
        }

        res.status(200).json({
            message: "Tanggal transaksi paling awal berhasil diambil.",
            date: earliestTransaction[0].tanggalTransaksi,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan.", error: error.message });
    }
};




export const createTransaction = async (req, res) => {
    try {
        const { items } = req.body;

        // Validasi payload
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items tidak valid atau kosong" });
        }

        // Validasi menu untuk setiap item
        const transactionItems = [];
        for (const item of items) {
            const menuData = await Menu.findOne({ namaMenu: item.namaMenu });
            if (!menuData) {
                return res.status(404).json({ message: `Menu "${item.namaMenu}" tidak ditemukan` });
            }

            transactionItems.push({
                menu: menuData._id,
                quantity: item.quantity,
                totalHarga: menuData.harga * item.quantity,
            });
        }

        // Simpan transaksi
        const totalHarga = transactionItems.reduce((sum, item) => sum + item.totalHarga, 0);
        const newTransaction = new Transaction({
            items: transactionItems,
            totalHarga,
            tanggalTransaksi: new Date(),
        });

        await newTransaction.save();

        // Panggil API untuk mencatat income dari transaksi
        try {
            await axios.post(`${process.env.API_BASE_URL}/api/income`, {
                nominal: totalHarga,
                deskripsi: `Pendapatan dari transaksi #${newTransaction._id}`,
                tanggal: newTransaction.tanggalTransaksi,
                kategori: 'pendapatan offline',
            });
            console.log('Income berhasil dicatat dari transaksi');
        } catch (incomeError) {
            console.error('Gagal mencatat income otomatis:', incomeError.message);
        }

        res.status(201).json({
            message: 'Transaksi berhasil dibuat',
            data: newTransaction,
        });
    } catch (error) {
        console.error("Error in createTransaction:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



  

// Update a transaction
export const updateTransaction = async (req, res) => {
    const { menu, quantity } = req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }

        if (menu) {
            const menuData = await Menu.findById(menu);
            if (!menuData) {
                return res.status(404).json({ message: "Menu tidak ditemukan" });
            }
            transaction.menu = menu;
        }

        if (quantity) {
            transaction.quantity = quantity;
        }

        await transaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaksi tidak ditemukan" });
        }
        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
