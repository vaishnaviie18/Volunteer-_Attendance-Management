const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'attendance_management',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to Database:', err);
    return;
  }
  console.log('MySQL Connection established successfully!');
});

connection.on('error', (err) => {
  console.log('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Reconnecting to database...');
    connection.connect();
  }
});

// Convert to promise-based for async/await
const promiseConnection = connection.promise();

module.exports = promiseConnection;