const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Automatically apply schema on startup
try {
  const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
  pool.query(schema).catch(err => console.error('Failed to apply schema:', err.message));
} catch (err) {
  console.error('Failed to read schema file:', err.message);
}

module.exports = { pool };
