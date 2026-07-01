const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 3. Create and save the new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    // 4. Generate the JWT (The VIP Pass)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    //Creates(JWT). It embeds the user's unique database ID inside the token, signs it with your hidden .env secret key, and makes it valid for exactly 1 hour.

    // 5. Securely send the Cookie and the user data (Auto-Login)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour
    }).status(201).json({ //201 Created success message
      user: { id: user._id, name: user.name, email: user.email } 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript (and hackers) from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Must be true if using HTTPS
      sameSite: 'strict', // Prevents Cross-Site Request Forgery (CSRF)
      maxAge: 3600000 // Cookie expires in 1 hour (matches your JWT)
    }).json({ 
      user: { id: user._id, name: user.name, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteAccount = async (req, res) => {
  try {
    // 1. Remove the user ID from their calculations so it is truly anonymous
    const Calculation = require('../models/Calculation');
    await Calculation.updateMany({ userId: req.user.id }, { $unset: { userId: "" } });

    // 2. Delete the user's personal profile
    await User.findByIdAndDelete(req.user.id);

    // 3. Send success message back to the frontend
    res.json({ message: 'Account deleted, but history preserved anonymously.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  // res.clearCookie must match the exact settings used when the cookie was created
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({ message: 'Logged out successfully' });
};

exports.updateProfile = async (req, res) => {
  try {
    // 1. Find the user by the ID attached to the secure cookie
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2. Update the name if they typed a new one
    if (req.body.name) {
      user.name = req.body.name;
    }

    // 3. Update and hash the password if they typed a new one
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    // 4. Save the changes to MongoDB
    await user.save();

    // 5. Send back the updated user info to React
    res.json({
      message: 'Profile updated successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};