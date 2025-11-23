/**
 * Statistics Controller
 * 
 * Handles routing and requests related to displaying volunteer statistics
 *
 * Controllers handle the business logic for routes.
 * They process requests, interact with models, and send responses.
 *
 * Best practices:
 * - Keep controllers focused on request/response handling
 * - Move complex business logic to separate service files
 * - Use models to interact with the database
 * - Handle errors appropriately
 */

// Import models if needed
// const SomeModel = require('../models/SomeModel');
const Statistics = require('../models/Statistics');

/**
 * GET /statistics
 * Display various statistics on volunteer work from the US Census API
 */
exports.getStatistics = async (req, res, next) => {
  try {
    res.render('statistics', {
      title: 'Statistics',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
}
