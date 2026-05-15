// utils/exportPDF.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Fungsi untuk mengekspor data pemasukan ke dalam file PDF.
 * @param {Array} data - Data pemasukan untuk diekspor
 * @param {String} title - Judul laporan
 */
export const exportIncomeToPDF = (data, title = "Laporan Pemasukan") => {
  const doc = new jsPDF();

  // Tambahkan judul
  doc.setFontSize(16);
  doc.text(title, 10, 10);

  // Tambahkan tabel
  doc.autoTable({
    startY: 20,
    head: [['Tanggal', 'Deskripsi', 'Nominal', 'Kategori']],
    body: data.map(item => [
      item.tanggal, 
      item.deskripsi, 
      `${item.nominal.toLocaleString('id-ID')}`, 
      item.kategori
    ]),
  });

  // Simpan file PDF
  doc.save('laporan-pemasukan.pdf');
};


export const exportExpenseToPDF = (data, title = "Laporan Pengeluaran") => {
  const doc = new jsPDF();

  // Tambahkan judul
  doc.setFontSize(16);
  doc.text(title, 10, 10);

  // Tambahkan tabel
  doc.autoTable({
    startY: 20,
    head: [['Tanggal', 'Deskripsi', 'Nominal', 'Kategori']],
    body: data.map(item => [
      item.tanggal, 
      item.deskripsi, 
      `${item.nominal.toLocaleString('id-ID')}`, 
      item.kategori
    ]),
  });

  // Simpan file PDF
  doc.save('laporan-pengeluaran.pdf');
};
