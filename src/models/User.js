/**
 * User Model
 *
 * This model handles all database operations related to users.
 * Use parameterized queries ($1, $2, etc.) to prevent SQL injection.
 *
 * Methods:
 * - findAll(): Get all users
 * - findById(id): Get user by ID
 * - findByEmail(email): Get user by email
 * - create(userData): Create a new user
 * - update(id, userData): Update a user
 * - delete(id): Delete a user
 */

const supabase = require('./supabase');

class User {
  /**
   * Find all users
   * @returns {Promise<Array>} Array of users
   */
  static async findAll() {
    const { data, error } = await supabase.from('users')
      .select('id, first_name, last_name, email, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Failed to return all users: ' + error.message);
      return [];
    }
    
    return data;
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<object|null>} User object or null
   */
  static async findById(id) {
    const { data, error } = await supabase.from('users')
      .select('id, first_name, last_name, email, created_at, joined_events')
      .eq('id', id);
    
    if (error) {
      console.error('Failed to find user by ID: ' + error.message);
      return null;
    }
    
    return data[0] || null;
  }

  /**
   * Get name of user by ID
   * @param {number} id - User ID
   * @returns {Promise<string>} Name of user
   */
  static async getNameById(id) {
    const { data, error } = await supabase.from('users')
      .select('first_name, last_name')
      .eq('id', id);
    
    if (error) {
      console.error('Failed to get name of user by ID: ' + error.message);
      return null;
    }

    const result = data[0];
    if (!result) {
      return null;
    }
    
    return result.first_name + ' ' + result.last_name;
  }

  /**
   * Find user by email (including password for authentication)
   * @param {string} email - User email
   * @returns {Promise<object|null>} User object or null
   */
  static async findByEmail(email) {
    const { data, error } = await supabase.from('users')
      .select('id, first_name, last_name, email, password, created_at, joined_events')
      .eq('email', email);
    
    if (error) {
      console.error('Failed to find user by email: ' + error.message);
      return null;
    }
    
    return data[0] || null;
  }

  /**
   * Create a new user
   * @param {object} userData - User data { username, email, password }
   * @returns {Promise<object>} Created user object
   */
  static async create(userData) {
    const { firstname, lastname, email, password } = userData;
    const { data, error } = await supabase.from('users')
      .insert({ first_name: firstname, last_name: lastname, email: email, password: password, joined_events: [] })
      .select('id, first_name, last_name, email, created_at, joined_events');

    if (error) {
      console.error('Unable to create user: ' + error.message);
      return null;
    }

    return data[0] || null;
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {object} userData - User data to update
   * @returns {Promise<object>} Updated user object
   */
  static async update(id, userData) {
    userData.updated_at = new Date(Date.now()).toISOString();

    const { data, error } = await supabase.from('users')
      .update(userData)
      .eq('id', id)
      .select('id, first_name, last_name, email, created_at, joined_events');
    
    if (error) {
      console.error('Failed to update user: ' + error.message);
      return null;
    }

    console.dir(data);

    return data[0] || null;
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const { data, error } = await supabase.from('users')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('Failed to delete user with ID: ' + error.message);
      return null;
    }
    
    return data[0] || null;
  }
}

module.exports = User;
