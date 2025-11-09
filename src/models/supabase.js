/**
 * Supabase Connection
 *
 * This file connects to a database in Supabase using the supabase-js library.
 *
 * Usage:
 * const supabase = require('./models/supabase');
 * const result = await supabase.from('users').select('*').eq('id', userId);
 */

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

module.exports = supabase;