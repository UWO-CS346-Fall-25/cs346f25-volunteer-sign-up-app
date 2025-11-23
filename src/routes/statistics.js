/**
 * Statistics Routes
 *
 * Define routes related to statistics operations here.
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const statisticsController = require('../controllers/statisticsController');
 *
 * router.get('/statistics', statisticsController.getStatistics);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
const statisticsController = require('../controllers/statisticsController');

// Define routes
router.get('/statistics', statisticsController.getStatistics);

module.exports = router;
