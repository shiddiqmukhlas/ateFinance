import Expense from "../models/expenseModel.js";

// Helper function untuk format tanggal ke "YYYY-MM-DD"
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Create Expense
export const createExpense = async (req, res) => {
    try {
        const { nominal, deskripsi, tanggal, kategori } = req.body;
        const formattedDate = new Date(tanggal); // Pastikan tanggal valid
        const expense = new Expense({ nominal, deskripsi, tanggal: formattedDate, kategori });
        await expense.save();
        res.status(201).json({ message: 'Pengeluaran berhasil ditambahkan', data: expense });
    } catch (error) {
        res.status(400).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// Get Expenses
export const getExpenses = async (req, res) => {
    try {
        const { page = 1, limit = 11, keyword, from, to, category } = req.query;

        const filter = {};

        if (from) {
            filter.tanggal = { $gte: new Date(from) };
          }
  
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999); // Set waktu ke akhir hari
            filter.tanggal = {
                ...filter.tanggal,
                $lte: toDate,
            };
        }

        if (keyword) {
            const keywordRegex = { $regex: keyword, $options: "i" };

            filter.$or = [
                { deskripsi: keywordRegex },
                { kategori: keywordRegex },
            ];

            if (!isNaN(keyword)) {
                filter.$or.push({ nominal: parseFloat(keyword) });
            }

            const date = new Date(keyword);
            if (!isNaN(date)) {
                filter.$or.push({ tanggal: date });
            }
        }

        if (category && category.trim() !== '') {
            filter.kategori = category.trim();
        }

        if (from && !isNaN(new Date(from))) {
            filter.tanggal = filter.tanggal || {};
            filter.tanggal.$gte = new Date(from);
        }
        if (to && !isNaN(new Date(to))) {
            filter.tanggal = filter.tanggal || {};
            filter.tanggal.$lte = new Date(to);
        }

        const expenses = await Expense.find(filter)
            .sort({ tanggal: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Expense.countDocuments(filter);

        const formattedExpenses = expenses.map((expense) => ({
            _id: expense._id,
            tanggal: formatDate(expense.tanggal),
            deskripsi: expense.deskripsi,
            nominal: `Rp ${Number(expense.nominal).toLocaleString("id-ID")}`,
            kategori: expense.kategori,
        }));

        res.status(200).json({
            message: "Data pengeluaran berhasil diambil",
            data: formattedExpenses,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            oldestDate: res.locals.oldestDate || null,
        });
    } catch (error) {
        res.status(400).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Get Expense by ID
export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// Update Expense
export const updateExpense = async (req, res) => {
    try {
        const { nominal, deskripsi, tanggal, kategori } = req.body;
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            { nominal, deskripsi, tanggal, kategori },
            { new: true, runValidators: true }
        );
        if (!expense) return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
        res.status(200).json({ message: 'Pengeluaran berhasil diperbarui', data: expense });
    } catch (error) {
        res.status(400).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// Delete Expense
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Pengeluaran tidak ditemukan' });
        res.status(200).json({ message: 'Pengeluaran berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};


// Get Expense Chart Data
export const getExpenseChartData = async (req, res) => {
    try {
        const { range } = req.query;

        // Tentukan rentang waktu berdasarkan parameter range
        const endDate = new Date(); // Hari ini
        let startDate;
        switch (range) {
            case "lastYear":
                startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
                break;
            case "last6Months":
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
                break;
            case "last3Months":
                startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
                break;
            case "last30Days":
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 30);
                break;
            case "last7Days":
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() - 7);
                break;
            default:
                return res.status(400).json({ message: "Rentang waktu tidak valid" });
        }

        // Filter data expense berdasarkan rentang waktu
        const expenses = await Expense.aggregate([
            {
                $match: {
                    tanggal: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$tanggal" } },
                    total: { $sum: "$nominal" },
                },
            },
            { $sort: { _id: 1 } }, // Urutkan berdasarkan tanggal
        ]);

        res.status(200).json({
            message: "Data chart berhasil diambil",
            data: expenses,
        });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};
