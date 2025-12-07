/**
 * Opportunity Controller
 * 
 * Handles routing and requests related to managing shown opportunities
 */

// Import models
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

/**
 * GET /filter
 * Display the home page with filtered opportunities
 */
exports.getFilteredHome = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [OpportunityController] Retrieving filtered home...`);

  try {
    let opportunities = Opportunity.getAll();

    if (req.query.zipcode) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Filtering by zipcode...`);
      opportunities = Opportunity.getFiltered(req.query.zipcode, opportunities);
    }

    if (req.query.sort) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Sorting opportunities...`);
      opportunities = Opportunity.getSorted(req.query.sort === 'true', opportunities);
    }

    res.render('index', {
      title: 'Home',
      csrfToken: req.csrfToken(),
      opportunities: opportunities,
    });

    console.log(`[${new Date().toISOString()}] [OpportunityController] Successfully retrieved filtered home...`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [OpportunityController] Retrieval failed:`, error.message);
    next(error);
  }
}

/**
 * GET /opportunity/create
 * Display create opportunity form
 */
exports.getOpportunityCreate = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [OpportunityController] Retrieving creation page...`);
  
  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

    res.render('opportunities/create', {
      title: 'Create Opportunity',
      csrfToken: req.csrfToken(),
    });

    console.log(`[${new Date().toISOString()}] [OpportunityController] Successfully retrieved creation page`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [OpportunityController] Retrieval failed:`, error.message);
    next(error);
  }
};

/**
 * POST /opportunity/create
 * Create new opportunity
 */
exports.postOpportunityCreate = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [OpportunityController] Processing creation request...`);

  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

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

    console.log(`[${new Date().toISOString()}] [OpportunityController] Creating opportunity...`);
    const opportunity = await Opportunity.add(toCreate);

    if (!opportunity) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Creation failed, sending error...`);
      return res.render('opportunities/create', {
        title: 'Create Opportunity',
        error: 'Failed to create opportunity',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    // Redirect to home
    console.log(`[${new Date().toISOString()}] [OpportunityController] Creation succeeded, redirecting...`);
    res.redirect('/');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [OpportunityController] Creation failed:`, error.message);
    next(error);
  }
}

/**
 * GET /opportunity/join
 * Join an opportunity
 */
exports.getOpportunityJoin = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [OpportunityController] Joining opportunity...`);

  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

    if (req.query.id) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Retrieving user...`);
      const user = await User.findById(req.session.user.id);

      if (user && user.joined_events && !user.joined_events.includes(req.query.id)) {
        console.log(`[${new Date().toISOString()}] [OpportunityController] User found, processing join...`);
        user.joined_events.push(req.query.id);
        await User.update(user.id, {
          joined_events: user.joined_events
        });
      }
    } else {
      console.log(`[${new Date().toISOString()}] [OpportunityController] No ID given, skipping request...`);
    }

    // Redirect to home
    console.log(`[${new Date().toISOString()}] [OpportunityController] Redirecting...`);
    res.redirect('/');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [OpportunityController] Join failed:`, error.message);
    next(error);
  }
};

/**
 * GET /opportunity/leave
 * Leave an opportunity
 */
exports.getOpportunityLeave = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [OpportunityController] Leaving opportunity...`);
  
  try {
    if (!req.session.user) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Not logged in, redirecting...`);
      res.redirect('/login');
      return;
    }

    if (req.query.id) {
      console.log(`[${new Date().toISOString()}] [OpportunityController] Retrieving user...`);
      const user = await User.findById(req.session.user.id);

      if (user && user.joined_events && user.joined_events.includes(req.query.id)) {
        console.log(`[${new Date().toISOString()}] [OpportunityController] User found, processing leave...`);
        const joined = user.joined_events.filter(function(opportunityId) {
          return opportunityId !== req.query.id;
        });

        await User.update(user.id, {
          joined_events: joined
        });
      }
    } else {
      console.log(`[${new Date().toISOString()}] [OpportunityController] No ID given, skipping request...`);
    }

    // Redirect to dashboard
    console.log(`[${new Date().toISOString()}] [OpportunityController] Redirecting...`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [OpportunityController] Leave failed:`, error.message);
    next(error);
  }
};