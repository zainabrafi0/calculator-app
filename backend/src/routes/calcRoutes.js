const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calcController');
const authenticateUser = require('../middleware/auth');

// All calculation routes require the user to be logged in, so we can apply 
// the middleware directly to specific routes
router.post('/', authenticateUser, calcController.createCalculation);
router.get('/', authenticateUser, calcController.getHistory);
router.delete('/:id', authenticateUser, calcController.deleteCalculation);
router.delete('/', authenticateUser, calcController.clearHistory);

module.exports = router;