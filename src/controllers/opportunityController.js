/**
 * Opportunity Controller
 * 
 * Handles routing and requests related to managing shown opportunities
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
const OpportunityModel = require('../models/Opportunity');

/**
 * GET /filter
 * Display the home page with filtered opportunities
 */
exports.getFilteredHome = async (req, res, next) => {
  let opportunities = OpportunityModel.getFiltered(req.zipCode);

  if (req.sort) {
    opportunities = OpportunityModel.getSorted(true, opportunities);
  }

  try {
    res.render('index', {
      title: 'Home',
      csrfToken: req.csrfToken(),
      opportunities: opportunities,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /dashboard/joined
 * Display the user dashboard with joined opportunities
 */
exports.getDashboardJoined = async (req, res, next) => {
  let opportunities = OpportunityModel.getJoined();
  let upcoming = opportunities.filter(function(opportunity) {
    return !opportunity.isExpired();
  });
  let expired = opportunities.filter(function(opportunity) {
    return opportunity.isExpired();
  });

  if (req.sortupcoming) {
    upcoming = OpportunityModel.getSorted(true, upcoming);
  }

  if (req.sortexpired) {
    expired = OpportunityModel.getSorted(true, expired);
  }

  try {
    res.render('dashboard', {
      title: 'Dashboard',
      csrfToken: req.csrfToken(),
      upcoming: upcoming,
      expired: expired,
    });
  } catch (error) {
    next(error);
  }
}
