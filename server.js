// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');  // PostgreSQL client

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // To parse JSON body data

// PostgreSQL Client
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Create Contacts Table if it doesn't exist
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

createTable();

// API Route to handle form submission
app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate that all fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert data into the contacts table
    const result = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    // Respond with success message
    res.status(201).json({ message: 'Message received', contact: result.rows[0] });
  } catch (err) {
    console.error('Error inserting into database:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Serve static files from React's build folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Default route to serve React's index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
