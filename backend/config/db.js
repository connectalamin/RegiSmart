// backend/config/db.js
import mysql from 'mysql2';

// Create a connection pool to MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your DB username
  password: '1234', // Your DB password
  database: 'regismart_db', // Name of your DB
});

export default pool.promise(); // Exporting the connection pool
