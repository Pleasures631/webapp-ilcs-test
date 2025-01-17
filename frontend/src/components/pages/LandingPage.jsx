import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Grid, MenuItem, Select, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, FormControl } from "@mui/material";

function LandingPage() {

    const [formData, setFormData] = useState({
        namaPembeli: '',
        tanggalPembelian: '',
        jenisMotor: '',
        pilihanAngsuran: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [allDataVehicle, setAllDataVehicle] = useState([]);
    const [specificUser, setSpecificUser] = useState();


    useEffect(() => {
        fetch("http://localhost:3000/vehicle")
            .then((response) => response.json())
            .then((data) => {
                setAllDataVehicle(data);
            })
            .catch((error) => alert("Error Fetching Data:", error));
    }, [])

    const submitData = (() => {
        fetch("http://localhost:3000/transaction", {
            method: "POST",  
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            if (data) {                
                downloadFile(data);
            } else {
                alert("Data berhasil dikirim, namun tidak ada file untuk didownload.");
            }
            console.log(data);
        })
        .catch(error => {
            alert("Terjadi kesalahan saat mengirim data");
            console.error(error);
        });
    });
    
    const downloadFile = (filePath) => {
        fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filePath.split('/').pop();
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                alert("Terjadi kesalahan saat mendownload file");
                console.error(error);
            });
    };
    

    return (
        <div>
            <Box>
                <Typography variant="h3" gutterBottom>
                    Form Pembelian Sepeda Motor
                </Typography>

                <TextField
                    fullWidth
                    label="Nama Pembeli"
                    name="namaPembeli"
                    value={formData.namaPembeli}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                <TextField
                    fullWidth
                    label="Tanggal Pembelian"
                    name="tanggalPembelian"
                    type="date"
                    value={formData.tanggalPembelian}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Jenis Sepeda Motor</InputLabel>
                    <Select
                        name="jenisMotor"
                        value={formData.jenisMotor}
                        onChange={handleChange}
                        label="Jenis Sepeda Motor"
                    >
                        {allDataVehicle.map((data, index) => (
                            <MenuItem key={index} value={data.VEHICLE_TYPE}>  {/* Gunakan 'data' sebagai value */}
                                {data.VEHICLE_NAME}  {/* Menampilkan data sesuai */}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Pilihan Angsuran</InputLabel>
                    <Select
                        name="pilihanAngsuran"
                        value={formData.pilihanAngsuran}
                        onChange={handleChange}
                        label="Pilihan Angsuran"
                    >
                        <MenuItem value="5">5 Bulan</MenuItem>
                        <MenuItem value="10">10 Bulan</MenuItem>
                        <MenuItem value="15">15 Bulan</MenuItem>
                    </Select>
                </FormControl>

                <Button onClick={submitData} type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Submit
                </Button>
            </Box>
        </div>
    );
}

export default LandingPage;
