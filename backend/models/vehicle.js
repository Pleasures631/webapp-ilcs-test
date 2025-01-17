const express = require("express");
const app = express();
const mysql = require("mysql2");
const db = require("../config/db.js");

exports.getAllVehicles = (callback) => {
  db.query("SELECT * FROM t_vehicle", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

exports.addTx = (data, callback) => {
    const { namaPembeli, tanggalPembelian, jenisMotor, pilihanAngsuran } = data;
    
    if (!namaPembeli || !tanggalPembelian || !jenisMotor || !pilihanAngsuran) {
        return callback(new Error('Semua field harus diisi'));
    }

    
    db.query("SELECT price FROM t_vehicle WHERE VEHICLE_TYPE = ?", [jenisMotor], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        
        if (results.length === 0) {
            return callback(new Error('Jenis motor tidak ditemukan'), null);
        }

        const hargaPokok = parseFloat(results[0].price);
        let totalHarga = hargaPokok;

        
        if (pilihanAngsuran === 5) {
            totalHarga += totalHarga * 0.30;
        } else if (pilihanAngsuran === 10) {
            totalHarga += totalHarga * 0.50;
        } else if (pilihanAngsuran === 15) {
            totalHarga += totalHarga * 0.80;
        }
        
        const query = `
            INSERT INTO t_transaction (BUYER_NAME, TX_DATE, VEHICLE_TYPE, INSTALLMENT, TOTAL_PRICE) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [namaPembeli, tanggalPembelian, jenisMotor, pilihanAngsuran, totalHarga], (err, result) => {
            if (err) {
                console.error('Error inserting transaction:', err);
                return callback(err);
            }

            callback(null, result.insertId, totalHarga, namaPembeli, tanggalPembelian, jenisMotor, pilihanAngsuran);
        });
    });
};





