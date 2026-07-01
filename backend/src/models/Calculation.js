const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expression: { type: String, required: true },
  result: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Calculation', calculationSchema);










//The Solution (ObjectId): MongoDB gives every single user a unique, ugly string of letters and numbers (like 64a1b2c3d4...) when they register. This line tells Mongoose: "Do not accept a normal word here. You must accept a valid MongoDB ID."

//The Connection (ref: 'User'): This tells Mongoose exactly where to look. It says: "This ID isn't just random; it specifically points to a blueprint inside the User collection." In the database world, this is called a Foreign Key. It permanently chains this math problem to a specific person.