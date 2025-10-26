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
  let opportunities = OpportunityModel.getAll();

  if (req.query.zipcode) {
    opportunities = OpportunityModel.getFiltered(req.query.zipcode, opportunities);
  }

  if (req.query.sort) {
    opportunities = OpportunityModel.getSorted(req.query.sort === 'true', opportunities);
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

  if (req.query.sortupcoming) {
    upcoming = OpportunityModel.getSorted(req.query.sortupcoming === 'true', upcoming);
  }

  if (req.query.sortexpired) {
    expired = OpportunityModel.getSorted(req.query.sortexpired === 'true', expired);
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
