/**
 * Index Controller
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
 * GET /
 * Display the home page
 */
exports.getHome = async (req, res, next) => {
  try {
    // Fetch any data needed for the home page
    // const data = await SomeModel.findAll();

    res.render('index', {
      title: 'Home',
      // data: data,
      csrfToken: req.csrfToken(),
      opportunities: OpportunityModel.getAll(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /dashboard
 * Display the user dashboard
 */
exports.getDashboard = async (req, res, next) => {
  try {
    res.render('dashboard', {
      title: 'Dashboard',
      csrfToken: req.csrfToken(),
      upcoming: OpportunityModel.getJoined().filter(function(opportunity) {
        return !opportunity.isExpired();
      }),
      expired: OpportunityModel.getJoined().filter(function(opportunity) {
        return opportunity.isExpired();
      }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /profile
 * Display the user profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect('/login');
    }

    res.render('profile', {
      title: 'Profile',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
