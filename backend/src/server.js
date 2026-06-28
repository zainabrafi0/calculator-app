const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// 1. Import your new modular route files
const authRoutes = require('./routes/authRoutes');
const calcRoutes = require('./routes/calcRoutes');

const app = express();

// STRICT CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// THE TRANSLATORS
app.use(express.json()); 
app.use(cookieParser()); 

// 2. MOUNT THE ROUTES
// This tells Express: "If the URL starts with /api/auth, send it to the authRoutes file!"
app.use('/api/auth', authRoutes);

// "If the URL starts with /api/calculations, send it to the calcRoutes file!"
app.use('/api/calculations', calcRoutes);


// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`)))
  .catch((err) => console.log(err));