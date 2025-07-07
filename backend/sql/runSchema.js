const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Log environment variables (excluding sensitive data)
console.log('Checking environment setup...');
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
}
console.log('✅ DATABASE_URL is configured');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect()
    .then(client => {
        console.log('✅ Successfully connected to database');
        client.release();
    })
    .catch(err => {
        console.error('❌ Failed to connect to database:', err.message);
        process.exit(1);
    });

const schemaPath = path.join(__dirname, 'schema.sql');
console.log('Reading schema file from:', schemaPath);

try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file read successfully');

    pool.query(schema)
        .then(() => {
            console.log('✅ Schema executed successfully');
            pool.end();
        })
        .catch((err) => {
            console.error('❌ Error executing schema:', err);
            pool.end();
        });
} catch (err) {
    console.error('❌ Error reading schema file:', err);
    process.exit(1);
}
