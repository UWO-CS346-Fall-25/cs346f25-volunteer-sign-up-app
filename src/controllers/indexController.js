/**
 * Index Controller
 * 
 * Handles routing and requests for the main site pages (home, dashboard, profile)
 */

// Import models
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

/**
 * Controller: Index
 * Purpose: Display the home page to the user
 * Output: Renders home EJS
 */
exports.getHome = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [IndexController] Retrieving home page...`);
  
  try {
    res.render('index', {
      title: 'Home',
      csrfToken: req.csrfToken(),
      opportunities: Opportunity.getAll(),
      session: req.session.user,
    });

    console.log(`[${new Date().toISOString()}] [IndexController] Successfully retrieved home page`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [IndexController] Retrieval failed:`, error.message);
    next(error);
  }
};

/**
 * Controller: Index
 * Purpose: Display the dashboard to the user
 * Output: Renders /dashboard EJS or redirects to home if an error occurs
 */
exports.getDashboard = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [IndexController] Retrieving dashboard...`);

  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [IndexController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

    const user = await User.findById(req.session.user.id);
    if (!user || !user.joined_events) {
      console.log(`[${new Date().toISOString()}] [IndexController] Invalid user, redirecting...`);
      res.redirect('/');
      return;
    }

    const opportunities = Opportunity.getAll().filter(function(opportunity) {
      return user.joined_events.includes(opportunity.id);
    });
    
    let upcoming = opportunities.filter(function(opportunity) {
      return !opportunity.isExpired();
    });
    let expired = opportunities.filter(function(opportunity) {
      return opportunity.isExpired();
    });

    if (req.query.sortupcoming) {
      console.log(`[${new Date().toISOString()}] [IndexController] Sorting upcoming entries...`);
      upcoming = Opportunity.getSorted(req.query.sortupcoming === 'true', upcoming);
    }
    if (req.query.sortexpired) {
      console.log(`[${new Date().toISOString()}] [IndexController] Sorting expired entries...`);
      expired = Opportunity.getSorted(req.query.sortexpired === 'true', expired);
    }

    res.render('dashboard', {
      title: 'Dashboard',
      csrfToken: req.csrfToken(),
      upcoming: upcoming,
      expired: expired,
      session: req.session.user,
    });

    console.log(`[${new Date().toISOString()}] [IndexController] Successfully retrieved dashboard`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [IndexController] Retrieval failed:`, error.message);
    next(error);
  }
};

/**
 * Controller: Index
 * Purpose: Display the user's profile to the user
 * Output: Renders /profile EJS or redirects to home if an error occurs
 */
exports.getProfile = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [IndexController] Retrieving profile...`);

  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [IndexController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

    res.render('profile', {
      title: 'Profile',
      csrfToken: req.csrfToken(),
      session: req.session.user,
    });
    
    console.log(`[${new Date().toISOString()}] [IndexController] Successfully retrieved profile`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [IndexController] Retrieval failed:`, error.message);
    next(error);
  }
};
