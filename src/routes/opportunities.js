/**
 * Opportunity Routes
 *
 * Define routes related to opportunity operations here.
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const opportunityController = require('../controllers/opportunityController');
 *
 * router.get('/opportunity/create', opportunityController.getOpportunityCreate);
 * router.post('/opportunity/create', opportunityController.postOpportunityCreate);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/opportunityController');

// Define routes
router.get('/opportunity/create', userController.getOpportunityCreate);
router.post('/opportunity/create', userController.postOpportunityCreate);

module.exports = router;
