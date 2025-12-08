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
const opportunityController = require('../controllers/opportunityController');

// Define routes
router.get('/opportunity/create', opportunityController.getOpportunityCreate);
router.post('/opportunity/create', opportunityController.postOpportunityCreate);
router.get('/opportunity/join', opportunityController.getOpportunityJoin);
router.get('/opportunity/leave', opportunityController.getOpportunityLeave);
router.get('/opportunity/delete', opportunityController.getOpportunityDelete);

module.exports = router;
