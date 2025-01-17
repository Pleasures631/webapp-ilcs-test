const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(bodyParser.json());

app.use(cors());

const approuters = require('./app-routers')(app);

// Menjalankan server
app.listen(port, () => {
  console.log(`Backend Server running at http://localhost:${port}`);
});
