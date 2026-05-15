import Income from "../models/incomeModel.js";
import Expense from "../models/expenseModel.js";

// Total income
export const getTotalIncome = async (req, res) => {
  try {
    const totalIncome = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);
    res.status(200).json({ totalIncome: totalIncome[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

export const getIncomeToday = async (req, res) => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
      const incomeToday = await Income.aggregate([
        {
          $match: {
            tanggal: { $gte: startOfDay, $lt: endOfDay }
          }
        },
        { $group: { _id: null, total: { $sum: "$nominal" } } }
      ]);
      res.status(200).json({ incomeToday: incomeToday[0]?.total || 0 });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  };
  

// Total income bulan ini
export const getIncomeThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const incomeThisMonth = await Income.aggregate([
      {
        $match: {
          tanggal: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);
    res.status(200).json({ incomeThisMonth: incomeThisMonth[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};


export const getAverageIncomeThisMonth = async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
      const incomeStats = await Income.aggregate([
        {
          $match: {
            tanggal: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: { $dayOfMonth: "$tanggal" },
            total: { $sum: "$nominal" }
          }
        }
      ]);
  
      const totalIncome = incomeStats.reduce((sum, day) => sum + day.total, 0);
      const averageIncome = totalIncome / incomeStats.length || 0;
  
      res.status(200).json({ averageIncome });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  };

  export const getIncomeByCategory = async (req, res) => {
    try {
      const incomeByCategory = await Income.aggregate([
        {
          $group: {
            _id: "$kategori",
            total: { $sum: "$nominal" }
          }
        }
      ]);
  
      res.status(200).json({ incomeByCategory });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  };

  
  export const getIncomeByRange = async (req, res) => {
    try {
      const { from, to } = req.query;
  
      if (!from || !to) {
        return res.status(400).json({ message: "Parameter 'from' dan 'to' wajib diisi" });
      }
  
      const startDate = new Date(from);
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);
  
      const incomeByRange = await Income.aggregate([
        {
          $match: {
            tanggal: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: { _id: null, total: { $sum: "$nominal" } }
        }
      ]);
  
      res.status(200).json({ incomeByRange: incomeByRange[0]?.total || 0 });
    } catch (error) {
      res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
  };

  


export const getTotalExpense = async (req, res) => {
  try {
    const totalExpense = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);
    res.status(200).json({ totalExpense: totalExpense[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

export const getExpenseByCategory = async (req, res) => {
  try {
    const expenseByCategory = await Expense.aggregate([
      {
        $group: {
          _id: "$kategori",
          total: { $sum: "$nominal" }
        }
      }
    ]);

    res.status(200).json({ expenseByCategory });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};



export const getBalance = async (req, res) => {
  try {
    const [totalIncome] = await Income.aggregate([
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);

    const [totalExpense] = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);

    const balance = (totalIncome?.total || 0) - (totalExpense?.total || 0);

    res.status(200).json({ balance });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};
