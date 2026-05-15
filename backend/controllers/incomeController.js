import Income from "../models/incomeModel.js";



// Helper function untuk format tanggal ke "YYYY-MM-DD"
const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Create Income
export const createIncome = async (req, res) => {
    try {
        const { nominal, deskripsi, tanggal, kategori } = req.body;
        const formattedDate = new Date(tanggal); // Pastikan tanggal valid
        const income = new Income({ nominal, deskripsi, tanggal: formattedDate, kategori });
        await income.save();
        res.status(201).json({ message: 'Pemasukan berhasil ditambahkan', data: income });
    } catch (error) {
        res.status(400).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};


// Get Income
export const getIncomes = async (req, res) => {
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
                { deskripsi: keywordRegex }, // Cocokkan pada kolom deskripsi
                { kategori: keywordRegex }, // Cocokkan pada kolom kategori
            ];

            // Hanya tambahkan filter untuk nominal jika keyword adalah angka
            if (!isNaN(keyword)) {
                filter.$or.push({ nominal: parseFloat(keyword) });
            }

            // Hanya tambahkan filter untuk tanggal jika keyword adalah tanggal yang valid
            const date = new Date(keyword);
            if (!isNaN(date)) {
                filter.$or.push({ tanggal: date });
            }
        }

        // Hanya tambahkan kategori ke filter jika tidak kosong
        if (category && category.trim() !== '') {
            filter.kategori = category.trim();
        }

        // Filter berdasarkan rentang tanggal
        if (from && !isNaN(new Date(from))) {
            filter.tanggal = filter.tanggal || {};
            filter.tanggal.$gte = new Date(from);
        }
        if (to && !isNaN(new Date(to))) {
            filter.tanggal = filter.tanggal || {};
            filter.tanggal.$lte = new Date(to);
        }

        const incomes = await Income.find(filter)
            .sort({ tanggal: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Income.countDocuments(filter);

        const formattedIncomes = incomes.map((income) => ({
            _id: income._id,
            tanggal: formatDate(income.tanggal), // Format ke YYYY-MM-DD
            deskripsi: income.deskripsi,
            nominal: `Rp ${Number(income.nominal).toLocaleString("id-ID")}`, // Format nominal ke Rupiah
            kategori: income.kategori,
        }));

        res.status(200).json({
            message: "Data pemasukan berhasil diambil",
            data: formattedIncomes,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            oldestDate: res.locals.oldestDate || null,
        });
    } catch (error) {
        res.status(400).json({ message: "Terjadi kesalahan", error: error.message });
    }
};



  
  // Get Income by ID
  export const getIncomeById = async (req, res) => {
    try {
      const income = await Income.findById(req.params.id);
      if (!income) return res.status(404).json({ message: 'Pemasukan tidak ditemukan' });
      res.status(200).json(income);
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  };
  
  // Update Income
  export const updateIncome = async (req, res) => {
    try {
      const { nominal, deskripsi, tanggal, kategori } = req.body;
      const income = await Income.findByIdAndUpdate(
        req.params.id,
        { nominal, deskripsi, tanggal, kategori },
        { new: true, runValidators: true }
      );
      if (!income) return res.status(404).json({ message: 'Pemasukan tidak ditemukan' });
      res.status(200).json({ message: 'Pemasukan berhasil diperbarui', data: income });
    } catch (error) {
      res.status(400).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  };
  
  // Delete Income
  export const deleteIncome = async (req, res) => {
    try {
      const income = await Income.findByIdAndDelete(req.params.id);
      if (!income) return res.status(404).json({ message: 'Pemasukan tidak ditemukan' });
      res.status(200).json({ message: 'Pemasukan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  };


  // Get Income Chart Data
export const getIncomeChartData = async (req, res) => {
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

      // Filter data income berdasarkan rentang waktu
      const incomes = await Income.aggregate([
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
          data: incomes,
      });
  } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};





