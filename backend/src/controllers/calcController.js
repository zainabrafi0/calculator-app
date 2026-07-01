const Calculation = require('../models/Calculation');

exports.createCalculation = async (req, res) => {
  try {
    const { expression } = req.body; // Now accepts a full string like "10 + 5 * 2"
    
    if (!expression) {
      return res.status(400).json({ message: 'Expression is required' });
    }

    // Safety check: prevent division by zero
    if (expression.includes('/ 0') || expression.includes('/0')) {
      return res.status(400).json({ message: 'Division by zero is not allowed' });
    }

    // Safely evaluate the mathematical string
    // Using Function is a safer alternative to direct eval() for basic math
    const sanitizedExpression = expression.replace(/[^0-9+\-*/. ()]/g, '');
    const result = new Function(`return ${sanitizedExpression}`)();

    if (isNaN(result) || !isFinite(result)) {
      return res.status(400).json({ message: 'Invalid mathematical expression' });
    }

    const calc = new Calculation({ 
      userId: req.user.id, 
      expression: sanitizedExpression, 
      result: Number(result.toFixed(4)) // Round to 4 decimal places for clean UI
    });
    
    await calc.save();
    res.status(201).json(calc);
  } catch (error) {
    res.status(400).json({ message: 'Could not calculate expression' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // Extract query parameters from the request, setting defaults if they aren't provided
    const { page = 1, limit = 10, search = '', sort = 'desc' } = req.query;
    
    // Build the query: Match the logged-in user AND search for the expression
    const query = { 
      userId: req.user.id, 
      expression: { $regex: search, $options: 'i' } // 'i' makes the search case-insensitive
    };

    // Fetch the data with sorting, limiting, and skipping for pagination
    const history = await Calculation.find(query)
      .sort({ createdAt: sort === 'desc' ? -1 : 1 }) // -1 is Newest First, 1 is Oldest First
      .limit(limit * 1) // Convert string to number
      .skip((page - 1) * limit);

    // Get the total count of documents for pagination math
    const count = await Calculation.countDocuments(query);
    
    // Send back the formatted response
    res.json({ 
      history, 
      totalPages: Math.ceil(count / limit), 
      currentPage: Number(page) 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// --------------------------------------------------------

exports.deleteCalculation = async (req, res) => {
  try {
    await Calculation.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Calculation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await Calculation.deleteMany({ userId: req.user.id });
    res.json({ message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};