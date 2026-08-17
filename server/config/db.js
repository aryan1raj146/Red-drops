const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      //username - root
    password: '',      
    database: 'red_drops_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }
    console.log('Successfully connected to XAMPP MySQL database.');
});

module.exports = db;