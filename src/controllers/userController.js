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
// const User = require('../models/User');

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
    // const user = await User.create({ username, email, password: hashedPassword });

    const date = new Date(Date.now());

    // Set session
    req.session.user = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      // TODO: Password hashing
      password: password,
      creationDate: Date.now(),
      dateStr: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    };

    // Redirect to home or dashboard
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
    // const user = await User.findByEmail(email);

    // Verify password
    // if (!user || !await verifyPassword(password, user.password)) {
    //   return res.render('users/login', {
    //     title: 'Login',
    //     error: 'Invalid credentials',
    //     csrfToken: req.csrfToken(),
    //   });
    // }

    // Set session
    req.session.user = {
      firstName: 'DefaultFN',
      lastName: 'DefaultLN',
      email: email,
      // TODO: Password hashing
      password: password,
      creationDate: Date.now(),
      dateStr: '11/1/2025',
    };

    // Redirect to home or dashboard
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

// Add more controller methods as needed
