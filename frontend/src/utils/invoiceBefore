import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "@/assets/ATELogoBlack.png"; // Pastikan path sesuai
import qrCode from "@/assets/qr.png"; // Pastikan path sesuai

export const generateInvoice = (invoiceData) => {
  const doc = new jsPDF({
    unit: "mm",
    format: [58, 60], // Ukuran kertas diperbesar menjadi 58x60mm
  });

  const pageWidth = 58; // Lebar halaman
  const pageCenterX = pageWidth / 2; // Tengah halaman

  // Header dengan Logo
  const logoWidth = 10; // Lebar logo lebih kecil
  const logoHeight = 3; // Tinggi logo lebih kecil
  doc.addImage(
    logo,
    "PNG",
    pageCenterX - logoWidth / 2, // Posisi X di tengah
    2, // Posisi Y
    logoWidth,
    logoHeight
  );

  // Judul dan Alamat
  doc.setFontSize(5);
  doc.text("EAT ATE Sukaraja", pageCenterX, 7, { align: "center" });
  doc.setFontSize(4);
  doc.text("Jl. Mega Asri 3 no 3, Sukaraja, Bandung", pageCenterX, 10, { align: "center" });

  // Divider
  doc.line(3, 12, 55, 12); // Divider lebih pendek

  // Detail Invoice
  doc.setFontSize(4);
  doc.text(`Invoice: ${invoiceData.invoiceNumber}`, 3, 14);
  doc.text(`Tanggal: ${invoiceData.date}`, 3, 17);
  doc.text("Catatan:", 3, 20);

  // Item Table Header (Manual)
  doc.setFontSize(4);
  doc.text("Item", 3, 23);
  doc.text("Qty", 25, 23, { align: "right" });
  doc.text("Harga", 35, 23, { align: "right" });
  doc.text("Total", 55, 23, { align: "right" });

  // Divider
  doc.line(3, 25, 55, 25);

  // Item List
  let yPosition = 27; // Awal Y posisi untuk item
  invoiceData.items.forEach((item) => {
    doc.text(item.name, 3, yPosition); // Nama item
    doc.text(`${item.quantity}`, 25, yPosition, { align: "right" }); // Kuantitas
    doc.text(`Rp ${item.price.toLocaleString()}`, 35, yPosition, { align: "right" }); // Harga satuan
    doc.text(`Rp ${item.total.toLocaleString()}`, 55, yPosition, { align: "right" }); // Total harga
    yPosition += 3; // Spasi antar item
  });

  // Divider
  doc.line(3, yPosition, 55, yPosition);

  // Total Harga
  yPosition += 3;
  doc.setFontSize(5);
  doc.text("Total", 35, yPosition, { align: "right" });
  doc.text(`Rp ${invoiceData.total.toLocaleString()}`, 55, yPosition, { align: "right" });

  // QR Code
  const qrSize = 6; // Ukuran QR Code lebih kecil
  const qrCodePositionY = yPosition + 5;
  doc.text("Scan Here:", pageCenterX, qrCodePositionY, { align: "center" });
  doc.addImage(
    qrCode,
    "PNG",
    pageCenterX - qrSize / 2, // Posisi X di tengah
    qrCodePositionY + 1, // Posisi Y sedikit di bawah teks
    qrSize,
    qrSize // Bentuk persegi
  );

  // Footer
  const footerY = qrCodePositionY + qrSize + 3;
  doc.setFontSize(4);
  doc.text("Thank You for Your Order!", pageCenterX, footerY, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`);
};
