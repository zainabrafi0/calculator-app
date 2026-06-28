const mongoose = require('mongoose'); // <-- ADD THIS LINE!
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    // NEW: The Regex Bouncer! This forces a strict name@domain.com format
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address with a domain (e.g., .com)']
  },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);