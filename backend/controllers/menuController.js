import Menu from "../models/menuModel.js";
import fs from 'fs';
import path from 'path';


// Create Menu
export const createMenu = async (req, res) => {
    try {
      const { namaMenu, kategoriMenu, harga, status } = req.body;
      if (!namaMenu || !kategoriMenu || !harga || !status) {
        return res.status(400).json({ message: "Semua field wajib diisi!" });
      }
  
      const newMenu = new Menu({
        namaMenu,
        fotoMenu: req.file ? req.file.path.replace(/\\/g, '/') : null,
        kategoriMenu,
        harga: parseInt(harga),
        status,
      });
      console.log('File yang diupload:', req.file);

  
      await newMenu.save();
      res.status(201).json({ message: "Menu berhasil ditambahkan", data: newMenu });
    } catch (error) {
      res.status(400).json({ message: "Gagal menambahkan menu", error: error.message });
    }
  };



export const menuDetail = async (req, res) => {
    try {
        const { ids } = req.body;
        console.log("Request IDs:", ids); // Debug: Lihat apakah ID menu dikirim dengan benar
        const menus = await Menu.find({ _id: { $in: ids } });
        console.log("Found Menus:", menus); // Debug: Lihat hasil pencarian menu
        res.json(menus);
      } catch (error) {
        console.error("Error fetching menu details:", error);
        res.status(500).json({ error: "Gagal mengambil detail menu." });
      }
};

  

// Get Menus
export const getMenus = async (req, res) => {
    try {
        const { page = 1, limit = 6, keyword, category, status } = req.query;

        const filter = {};

        if (keyword) {
            const keywordRegex = { $regex: keyword, $options: "i" };
            filter.$or = [
                { namaMenu: keywordRegex },
                { kategoriMenu: keywordRegex },
            ];
        }

        if (category && category.trim() !== '') {
            filter.kategoriMenu = category.trim();
        }

        if (status && status.trim() !== '') {
            filter.status = status.trim();
        }

        const menus = await Menu.find(filter)
            .sort({ namaMenu: 1 }) // Urutkan berdasarkan namaMenu secara ascending
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Menu.countDocuments(filter);

        res.status(200).json({
            message: "Data menu berhasil diambil",
            data: menus.map(menu => ({
              _id: menu._id,
              namaMenu: menu.namaMenu,
              fotoMenu: menu.fotoMenu,
              kategoriMenu: menu.kategoriMenu,
              harga: menu.harga,
              status: menu.status,
            })),
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
          });
          
    } catch (error) {
        res.status(400).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

// Get Menu by ID
export const getMenuById = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

// Update Menu
export const updateMenu = async (req, res) => {
    try {
        const { namaMenu, kategoriMenu, harga, status } = req.body;

        const updatedData = {
            namaMenu,
            kategoriMenu,
            harga,
            status,
        };

        // Tambahkan logika untuk memperbarui foto jika ada unggahan file
        if (req.file) {
            updatedData.fotoMenu = req.file.path.replace(/\\/g, '/');
        }

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });
        res.status(200).json({ message: 'Menu berhasil diperbarui', data: menu });
    } catch (error) {
        res.status(400).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};




// Delete Menu
export const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) return res.status(404).json({ message: 'Menu tidak ditemukan' });

        // Hapus file gambar jika ada
        const fileName = path.basename(menu.fotoMenu);
        const filePath = path.join('uploads', fileName);

        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Gagal menghapus file gambar' });
                }
            });
        }

        res.status(200).json({ message: 'Menu berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
