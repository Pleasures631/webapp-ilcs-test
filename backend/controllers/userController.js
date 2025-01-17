const Vehicle = require("../models/vehicle.js");
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

exports.getVehicle = (req, res) => {
  Vehicle.getAllVehicles((err, vehicles) => {
    if (err) {
      console.error("Error fetching vehicles:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(vehicles);
  });
};

exports.addTx = (req, res) => {
  const formData = req.body;

  Vehicle.addTx(formData, (err, transactionId, totalHarga, namaPembeli, tanggalPembelian, jenisMotor, pilihanAngsuran) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to save transaction' });
      }

      // Generate report data
      const reportData = [
          ["No", "Nama Pembeli", "Tanggal Pembelian", "Jenis Motor", "Angsuran (Bulan)", "Harga Pokok", "Angsuran per Bulan"],
          [1, namaPembeli, tanggalPembelian, jenisMotor, `${pilihanAngsuran} Bulan`, totalHarga, totalHarga / pilihanAngsuran]
      ];

      const ws = xlsx.utils.aoa_to_sheet(reportData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Report Angsuran');

      const reportsDir = path.join(__dirname, '..', '..', 'reports'); // ke backend/reports
      if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
      }

      const fileName = `angsuran_${namaPembeli}_${tanggalPembelian}.xlsx`;
      const filePath = path.join(reportsDir, fileName);

      xlsx.writeFile(wb, filePath);

      res.json(filePath);
      
      // res.download(filePath, (err) => {
      //     if (err) {
      //         console.error('Error downloading the file:', err);
      //         return res.status(500).json({ error: 'Failed to download the report' });
      //     }
          
      //     fs.unlink(filePath, (err) => {
      //         if (err) {
      //             console.error('Error deleting the file:', err);
      //         }
      //     });
      // });
  });
};

// exports.addTx = (req, res) => {
//   const { namaPembeli, tanggalPembelian, jenisMotor, pilihanAngsuran } =
//     req.body;

//   if (!namaPembeli || !tanggalPembelian || !jenisMotor || !pilihanAngsuran) {
//     return res.status(400).json({ error: "Semua field harus diisi" });
//   }

//   Vehicle.addTx(req.body, (err, data) => {
//     if (err) {
//       console.error("Error insert data:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }

//     const reportData = [
//       [
//         "No",
//         "Nama Pembeli",
//         "Tanggal Pembelian",
//         "Jenis Motor",
//         "Angsuran (Bulan)",
//         "Harga Pokok",
//         "Angsuran per Bulan",
//       ],
//       [
//         1,
//         namaPembeli,
//         tanggalPembelian,
//         jenisMotor,
//         `${pilihanAngsuran} Bulan`,
//         totalHarga,
//         totalHarga / pilihanAngsuran,
//       ],
//     ];

//     const ws = xlsx.utils.aoa_to_sheet(reportData);
//     const wb = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(wb, ws, "Report Angsuran");

//     const fileName = `angsuran_${namaPembeli}_${tanggalPembelian}.xlsx`;
//     const filePath = path.join(__dirname, "reports", fileName);

//     xlsx.writeFile(wb, filePath);

//     res.download(filePath, (err) => {
//       if (err) {
//         console.error("Error downloading the file:", err);
//         return res.status(500).json({ error: "Failed to download the report" });
//       }

//       fs.unlink(filePath, (err) => {
//         if (err) {
//           console.error("Error deleting the file:", err);
//         }
//         res
//           .status(201)
//           .json({
//             message: "Transaction successfully added",
//             transactionId: data,
//           });
//       });
//     });
//   });
// };
