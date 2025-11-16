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
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

/**
 * GET /filter
 * Display the home page with filtered opportunities
 */
exports.getFilteredHome = async (req, res, next) => {
  let opportunities = Opportunity.getAll();

  if (req.query.zipcode) {
    opportunities = Opportunity.getFiltered(req.query.zipcode, opportunities);
  }

  if (req.query.sort) {
    opportunities = Opportunity.getSorted(req.query.sort === 'true', opportunities);
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
  let opportunities = Opportunity.getJoined();
  let upcoming = opportunities.filter(function(opportunity) {
    return !opportunity.isExpired();
  });
  let expired = opportunities.filter(function(opportunity) {
    return opportunity.isExpired();
  });

  if (req.query.sortupcoming) {
    upcoming = Opportunity.getSorted(req.query.sortupcoming === 'true', upcoming);
  }

  if (req.query.sortexpired) {
    expired = Opportunity.getSorted(req.query.sortexpired === 'true', expired);
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

/**
 * GET /opportunity/create
 * Display create opportunity form
 */
exports.getOpportunityCreate = (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect('/login');
    }

    res.render('opportunities/create', {
      title: 'Create Opportunity',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /opportunity/create
 * Create new opportunity
 */
exports.postOpportunityCreate = async (req, res, next) => {
  try {
    const { title, description, zipcode, date } = req.body;
    const startDate = new Date(date).getTime()
    const endDate = new Date(date).getTime();
    
    // Create opportunity with data
    const toCreate = new Opportunity(
      null,
      title,
      description,
      startDate,
      endDate,
      [req.session.user.id],
      null,
      zipcode,
      false
    );

    const opportunity = await Opportunity.add(toCreate);

    if (!opportunity) {
      return res.render('opportunities/create', {
        title: 'Create Opportunity',
        error: 'Failed to create opportunity',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    // Redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /join
 * Join an opportunity
 */
exports.getOpportunityJoin = async (req, res, next) => {
  try {
    if (!req.session.user) {
      res.redirect('/login');
      return;
    }

    if (req.query.id) {
      const user = await User.findById(req.session.user.id);

      if (user && user.joined_events && !user.joined_events.includes(req.query.id)) {
        user.joined_events.push(req.query.id);
        User.update(user.id, {
          joined_events: user.joined_events
        });
      }
    }

    // Redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};