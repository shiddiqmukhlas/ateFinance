// import express from 'express';
// import upload from '../middleware/upload.js';

// const router = express.Router();

// router.put('/:id', upload.single('fotoMenu'), async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { namaMenu, kategoriMenu, harga, status } = req.body;
  
//       const updateData = { namaMenu, kategoriMenu, harga, status };
  
//       // Tambahkan file foto jika ada
//       if (req.file) {
//         updateData.fotoMenu = `/uploads/${req.file.filename}`; // Path relatif file
//       }
  
//       const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, { new: true });
  
//       if (!updatedMenu) {
//         return res.status(404).json({ message: 'Menu tidak ditemukan' });
//       }
  
//       res.json({ message: 'Menu berhasil diperbarui', menu: updatedMenu });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Gagal memperbarui menu', error: error.message });
//     }
//   });
  

// export default router;
