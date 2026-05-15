import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan folder 'uploads/' ada
const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // Membuat folder jika belum ada
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Gunakan path yang sudah dipastikan ada
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik dengan timestamp
  },
});

const upload = multer({ storage: storage });

export default upload;
