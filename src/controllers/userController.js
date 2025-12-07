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
// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

/**
 * Controller: user
 * Purpose: Display a register form to the user
 * Output: Renders /register EJS
 */
exports.getRegister = (req, res) => {
  console.log(`[${new Date().toISOString()}] [UserController] Retrieving register form...`);

  try {
    res.render('users/register', {
    title: 'Register',
    csrfToken: req.csrfToken(),
  });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Retrieval failed:`, error.message);
  }
};

/**
 * Controller: User
 * Purpose: Process a request to register a user
 * Input:
 *   req.body.firstname (string)
 *   req.body.lastname (string)
 *   req.body.email (string)
 *   req.body.password (string)
 * Output: Redirects to home or refreshes /register if an error occurs
 */
exports.postRegister = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [UserController] Registering new user...`);

  try {
    const { firstname, lastname, email, password } = req.body;

    // Hash password
    console.log(`[${new Date().toISOString()}] [UserController] Hashing password...`);
    const hash = await bcrypt.hash(password, 10);
    
    // Create user in database
    console.log(`[${new Date().toISOString()}] [UserController] Creating user...`);
    const user = await User.create({ firstname, lastname, email, password: hash });
    if (!user) {
      console.log(`[${new Date().toISOString()}] [UserController] Creation failed, redirecting...`);
      res.redirect('/register');
      return;
    }

    console.log(`[${new Date().toISOString()}] [UserController] Creation succeeded`);
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
    console.log(`[${new Date().toISOString()}] [UserController] Redirecting...`);
    res.redirect('/');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Register failed:`, error.message);
    next(error);
  }
};

/**
 * Controller: User
 * Purpose: Display a login form to the user
 * Output: Renders /login EJS
 */
exports.getLogin = (req, res) => {
  console.log(`[${new Date().toISOString()}] [UserController] Retrieving login form...`);
  
  try {
    res.render('users/login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Retrieval failed:`, error.message);
  }
};

/**
 * Controller: User
 * Purpose: Process a request to login to an account
 * Input:
 *   req.body.email (string)
 *   req.body.password (string)
 * Output: Redirects to home or refreshes /login if an error occurs
 */
exports.postLogin = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [UserController] Logging in user...`);

  try {
    const { email, password } = req.body;

    // Find user by email
    console.log(`[${new Date().toISOString()}] [UserController] Retrieving user details...`);
    const user = await User.findByEmail(email);

    // Verify password
    console.log(`[${new Date().toISOString()}] [UserController] Checking user details...`);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`[${new Date().toISOString()}] [UserController] Login failed, redirecting...`);
      return res.render('users/login', {
        title: 'Login',
        error: 'Invalid credentials',
        csrfToken: req.csrfToken(),
      });
    }
    
    console.log(`[${new Date().toISOString()}] [UserController] Login succeeded`);
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
    console.log(`[${new Date().toISOString()}] [UserController] Redirecting...`);
    res.redirect('/');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Login failed:`, error.message);
    next(error);
  }
};


/**
 * Controller: User
 * Purpose: Process a request to log out a user
 * Output: Redirects to /login
 */
exports.getLogout = (req, res) => {
  console.log(`[${new Date().toISOString()}] [UserController] Logging out user...`);

  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(`[${new Date().toISOString()}] [UserController] Logout failed:`, err.message);
      }

      console.log(`[${new Date().toISOString()}] [UserController] Redirecting...`);
      res.redirect('/login');
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Logout failed:`, error.message);
  }
};

/**
 * Controller: User
 * Purpose: Display a change password form to the user
 * Output: Renders /changepassword EJS
 */
exports.getChangePassword = (req, res) => {
  console.log(`[${new Date().toISOString()}] [UserController] Retrieving change password form...`);
  
  try {
    res.render('users/changepassword', {
      title: 'Change Password',
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Retrieval failed:`, error.message);
  }
};

/**
 * Controller: User
 * Purpose: Process a request to change a password
 * Input:
 *   req.body.password (string)
 *   req.body.newpassword (string)
 * Output: Redirects to home or refreshes /changepassword if an error occurs
 */
exports.postChangePassword = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [UserController] Changing password...`);
  
  try {
    if (!req.session || !req.session.user) {
      console.log(`[${new Date().toISOString()}] [UserController] Not logged in, redirecting...`);
      res.redirect('/');
      return;
    }

    const { password, newpassword } = req.body;
    const email = req.session.user.email;

    // Find user by email
    console.log(`[${new Date().toISOString()}] [UserController] Retrieving user credentials...`);
    let user = await User.findByEmail(email);

    // Verify password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`[${new Date().toISOString()}] [UserController] Invalid credentials, redirecting...`);
      return res.render('users/changepassword', {
        title: 'Change Password',
        error: 'Invalid credentials',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    // Hash new password
    console.log(`[${new Date().toISOString()}] [UserController] Hashing new password...`);
    const hash = await bcrypt.hash(newpassword, 10);

    console.log(`[${new Date().toISOString()}] [UserController] Updating user credentials...`);
    user = await User.update(user.id, {
      password: hash
    });

    if (!user) {
      console.log(`[${new Date().toISOString()}] [UserController] Update failed, redirecting...`);
      return res.render('profile', {
        title: 'Profile',
        error: 'Failed to update',
        csrfToken: req.csrfToken(),
        session: req.session.user,
      });
    }

    // Redirect to profile
    console.log(`[${new Date().toISOString()}] [UserController] Redirecting...`);
    res.redirect('/profile');
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [UserController] Failed to change password:`, error.message);
    next(error);
  }
}
