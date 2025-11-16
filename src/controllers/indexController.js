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
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

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
      opportunities: Opportunity.getAll(),
      session: req.session.user,
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
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }

    const user = await User.findById(req.session.user.id);
    if (!user || !user.joined_events) {
      res.redirect('/');
      return;
    }

    const opportunities = Opportunity.getAll().filter(function(opportunity) {
      return user.joined_events.includes(opportunity.id);
    });

    res.render('dashboard', {
      title: 'Dashboard',
      csrfToken: req.csrfToken(),
      upcoming: opportunities.filter(function(opportunity) {
        return !opportunity.isExpired();
      }),
      expired: opportunities.filter(function(opportunity) {
        return opportunity.isExpired();
      }),
      session: req.session.user,
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
      session: req.session.user,
    });
  } catch (error) {
    next(error);
  }
};
