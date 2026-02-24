const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testdb() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully...");
    connection.release();
  } catch (error) {
    console.log("Database connection error:", error.message);
  }
}

testdb();

module.exports = { db };