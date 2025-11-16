/**
 * Index Routes
 *
 * Define routes for the main pages of your application here.
 * Routes connect HTTP requests to controller functions.
 *
 * Example usage:
 * const express = require('express');
 * const router = express.Router();
 * const indexController = require('../controllers/indexController');
 *
 * router.get('/', indexController.getHome);
 * router.get('/about', indexController.getAbout);
 *
 * module.exports = router;
 */

const express = require('express');
const router = express.Router();

// Import controllers
const indexController = require('../controllers/indexController');
const opportunityController = require('../controllers/opportunityController');

// Define routes
router.get('/', indexController.getHome);
router.get('/dashboard', indexController.getDashboard);
router.get('/profile', indexController.getProfile);

router.get('/filter', opportunityController.getFilteredHome);

module.exports = router;
