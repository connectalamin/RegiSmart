import mysql from 'mysql2';

// Create a connection pool to MySQL database
const pool = mysql.createPool({
  host: 'localhost',        // Your MySQL server host
  user: 'root',             // Your MySQL username
  password: '',             // Your MySQL password
  database: 'regismart_db'  // Your database name
});

export default pool.promise(); // Export the pool with promise support