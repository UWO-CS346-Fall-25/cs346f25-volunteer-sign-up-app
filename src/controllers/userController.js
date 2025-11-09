/**
 * User Controller
 *
 * Handles user-related operations:
 * - Registration
 * - Login/Logout
 * - Profile management
 * - Authentication
 */

// Import models
const User = require('../models/User');

/**
 * GET /register
 * Display registration form
 */
exports.getRegister = (req, res) => {
  res.render('users/register', {
    title: 'Register',
    csrfToken: req.csrfToken(),
  });
};

/**
 * POST /register
 * Process registration form
 */
exports.postRegister = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    // Validate input
    // Hash password
    // Create user in database
    const user = await User.create({ firstname, lastname, email, password });
    if (!user) {
      // TODO: log error
      res.redirect('/register');
      return;
    }

    const createdAt = Date.parse(user.created_at);
    const date = new Date(createdAt);

    // Set session
    req.session.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      creationDate: createdAt,
      dateStr: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    };

    // Redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /login
 * Display login form
 */
exports.getLogin = (req, res) => {
  res.render('users/login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
};

/**
 * POST /login
 * Process login form
 */
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);

    // Verify password
    if (!user || password != user.password) {
      return res.render('users/login', {
        title: 'Login',
        error: 'Invalid credentials',
        csrfToken: req.csrfToken(),
      });
    }
    
    const createdAt = Date.parse(user.created_at);
    const date = new Date(createdAt);

    // Set session
    req.session.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      creationDate: createdAt,
      dateStr: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    };

    // Redirect to home
    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /logout
 * Logout user
 */
exports.getLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/login');
  });
};

/**
 * GET /changepassword
 * Display change password form
 */
exports.getChangePassword = (req, res) => {
  res.render('users/changepassword', {
    title: 'Change Password',
    csrfToken: req.csrfToken(),
  });
};

/**
 * POST /changepassword
 * Change user password
 */
exports.postChangePassword = async (req, res, next) => {
  try {
    const { password, newpassword } = req.body;
    const email = req.session.user.email;

    // Find user by email
    let user = await User.findByEmail(email);

    // Verify password
    if (!user || password != user.password) {
      return res.render('profile', {
        title: 'Profile',
        error: 'Invalid credentials',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    user = await User.update(user.id, {
      password: newpassword
    });

    if (!user) {
      return res.render('profile', {
        title: 'Profile',
        error: 'Failed to update',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    // Redirect to profile
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
}

// Add more controller methods as needed
