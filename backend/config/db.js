const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sgo12345!',
    database: 'ilcs'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database' + err.stack);
        return;
    }

    console.log('Connected to MySQL as id ' + connection.threadId)
});

module.exports = connection;