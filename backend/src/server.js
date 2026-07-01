// 1. IMPORT DEPENDENCIES (The Tools)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Loads the hidden secrets from your .env file

// 2. IMPORT ROUTES (The Switchboard Operators)
const authRoutes = require('./routes/authRoutes');
const calcRoutes = require('./routes/calcRoutes');

// 3. INITIALIZE EXPRESS (Build the Nightclub)
const app = express();

// 4. CONFIGURE MIDDLEWARE (The Bouncers and Translators)
// The CORS Bouncer: Only let the React Delivery Truck in, and allow it to carry safes (cookies)
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));

// The Translators: Parse incoming JSON packages and crack open secure cookies
app.use(express.json());
app.use(cookieParser());

// 5. MOUNT THE ROUTES (Directing the Traffic)
// "If a request starts with /api/auth, send it to the authRoutes file!"
app.use('/api/auth', authRoutes);

// "If a request starts with /api/calculations, send it to the calcRoutes file!"
app.use('/api/calculations', calcRoutes);

// 6. CONNECT TO DATABASE & START SERVER (The Power Switch)
const PORT = process.env.PORT || 5000;

// Step A: Attempt to unlock the MongoDB Atlas vault
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    
    // Step B: ONLY if the vault opens, turn on the Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is actively running and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    // Step C: If the IP Whitelist blocks you, log the error so you can fix it
    console.error('❌ Failed to connect to MongoDB:', error.message);
  });