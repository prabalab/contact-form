// server.js

require('dotenv').config(); // For loading environment variables from .env file
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
  connectionString: process.env.DATABASE_URL, // The database URL from your .env file
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

// Call the createTable function to ensure the contacts table exists when the app starts
createTable();

// API Route to handle form submission (POST request)
app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;  // Extract data from the request body

  // Validate that all fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert the contact data into the database
    const result = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    
    // Return a success response with the inserted contact data
    res.status(201).json({
      message: 'Message received and stored successfully!',
      contact: result.rows[0]  // The contact that was just inserted into the database
    });
  } catch (err) {
    console.error('Error inserting into database:', err);  // Log any errors
    res.status(500).json({ error: 'Database error' });  // Send a generic database error response
  }
});

// Serve static files (React build) in production
const path = require('path');
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Serve React's index.html on the default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
