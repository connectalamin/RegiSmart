import mysql from 'mysql2';

// Create a connection pool to MySQL database
const pool = mysql.createPool({
<<<<<<< HEAD
  host: 'localhost',
  user: 'root', // Your DB username
  password: '1234', // Your DB password
  database: 'regismart_db', // Name of your DB
});

export default pool.promise(); // Exporting the connection pool
=======
  host: 'localhost',        // Your MySQL server host
  user: 'root',             // Your MySQL username
  password: '',             // Your MySQL password
  database: 'regismart_db'  // Your database name
});

export default pool.promise(); // Export the pool with promise support
>>>>>>> ec80512d974e167c79741673d759e5626e9cadd7
