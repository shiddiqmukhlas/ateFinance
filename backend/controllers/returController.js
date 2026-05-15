import Transaction from "../models/transactionModel.js";
import axios from "axios";

export const createReturTransaction = async (req, res) => {
  try {
    const { originalTransactionId, returnedItems, reason } = req.body;

    console.log("📥 req.body:", JSON.stringify(req.body, null, 2));

    const original = await Transaction.findById(originalTransactionId).populate("items.menu");
    if (!original) return res.status(404).json({ message: "Transaksi asli tidak ditemukan." });

    const returItems = [];
    let totalHargaRetur = 0;

    for (const returItem of returnedItems) {
        console.log("🔁 Cek returItem:", returItem);
      const originalItem = original.items.find(i => i.menu._id.toString() === returItem.id);
      if (!originalItem) {
        return res.status(400).json({ message: `Item dengan ID ${returItem.id} tidak ditemukan.` });
      }

      const qtyRetur = parseInt(returItem.qtyReturned);
      console.log(`🧮 Cek qtyRetur: ${qtyRetur} vs original qty: ${originalItem.quantity}`);
      if (qtyRetur > originalItem.quantity) {
        return res.status(400).json({ message: `Qty retur melebihi jumlah pembelian untuk ${originalItem.menu.namaMenu}` });
      }

      const totalHarga = qtyRetur * originalItem.menu.harga;
      totalHargaRetur += -totalHarga;

      returItems.push({
        menu: originalItem.menu._id,
        quantity: qtyRetur,
        totalHarga: -totalHarga,
      });
    }

    const returTransaction = await Transaction.create({
      items: returItems,
      totalHarga: totalHargaRetur,
      isRetur: true,
      originalTransactionId,
      alasanRetur: reason,
      tanggalTransaksi: new Date(),
    });

    // Catat pengurangan income (nominal negatif)
    try {
      await axios.post(`${process.env.API_BASE_URL}/api/income`, {
        nominal: totalHargaRetur,
        deskripsi: `Retur transaksi #${returTransaction._id} dari transaksi #${originalTransactionId}`,
        tanggal: returTransaction.tanggalTransaksi,
        kategori: 'retur penjualan',
      });
      console.log('Income retur berhasil dicatat');
    } catch (incomeError) {
      console.error('Gagal mencatat income retur otomatis:', incomeError.message);
    }

    res.status(201).json({ message: "Retur berhasil", returTransaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan saat membuat retur." });
  }
};

export const getReturById = async (req, res) => {
  try {
    const retur = await Transaction.findById(req.params.id)
      .populate('items.menu')
      .populate('originalTransactionId');

    if (!retur || !retur.isRetur) {
      return res.status(404).json({ message: "Data retur tidak ditemukan." });
    }

    res.json({
      _id: retur._id,
      originalTransactionId: retur.originalTransactionId?._id || null,
      originalTransactionDetail: retur.originalTransactionId || null,
      items: retur.items,
      totalHarga: retur.totalHarga,
      alasanRetur: retur.alasanRetur, // Tambahkan alasan retur di response
      tanggalTransaksi: retur.tanggalTransaksi,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data retur." });
  }
};



// returController.js
export const getAllRetur = async (req, res) => {
  try {
    const returs = await Transaction.find({ isRetur: true }).populate('items.menu originalTransactionId');
    res.json(returs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil daftar retur.' });
  }
};
