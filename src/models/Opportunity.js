/**
 * Opportunity Model
 * 
 * A class holding all required data for an opportunity
 * and basic methods to query this data
 */

const supabase = require('./supabase');
const User = require('./User');

class Opportunity {
  /**
   * Opportunity constructor with all required data
   * @param {string} id The UUID of this opportunity
   * @param {string} title The title of this opportunity
   * @param {string} description The description of this opportunity
   * @param {number} startDate The start date of this opportunity
   * @param {number} endDate The end date of this opportunity
   * @param {[string]} organizers The email addresses of this opportunity's organizers
   * @param {string} image The path to the image for this opportunity
   * @param {number} zipCode The zip code associated with this opportunity
   * @param {boolean} isJoined Whether this opportunity has been joined
   * TODO: Attach isJoined and instance methods to user sessions rather than global data
   */
  constructor(id, title, description, startDate, endDate, organizers, image, zipCode, isJoined) {
    // Default values to ensure all properties are present in the class
    this.id = id ?? null;
    this.title = title ?? '[Title]';
    this.description = description ?? '[Description]';
    this.startDate = new Date(startDate ?? Date.now());
    this.endDate = new Date(endDate ?? Date.now());
    this.organizers = organizers ?? ['[Organizer]'];
    this.image = image ?? '/img/zybooks_cat.jpg';
    this.zipCode = zipCode ?? 12345;
    this.isJoined = isJoined ?? false;
    this.dateStr = `${this.startDate.getMonth() + 1}/${this.startDate.getDate()}/${this.startDate.getFullYear()}`;
    this.startTimeStr = `${this.startDate.getHours()}:${String(this.startDate.getMinutes()).padStart(2, '0')}`;
    this.endTimeStr = `${this.endDate.getHours()}:${String(this.endDate.getMinutes()).padStart(2, '0')}`;
  }

  /**
   * Determines whether this opportunity is currently in progress
   * @returns Whether the current date is between this opportunity's start/end
   */
  isActive() {
    let curDate = Date.now();
    return curDate >= this.startDate && curDate < this.endDate;
  }

  /**
   * Determines whether this opportunity has expired
   * @returns Whether the current date is later than this opportunity's end
   */
  isExpired() {
    return Date.now() >= this.endDate;
  }
}

let opportunities = [];

async function fetchOpportunities() {
  const { data, error } = await supabase.from('opportunities')
    .select('*')
    .limit(20);

  if (error) {
    console.error('Failed to fetch opportunities: ' + error.message);
    return;
  }

  const results = [];

  for (const opportunity of data) {
    opportunity.organizers.unshift(opportunity.created_by);
    const organizers = [];
    
    for (const organizer of opportunity.organizers) {
      organizers.push(await User.getNameById(organizer));
    }

    results.push(new Opportunity(
      opportunity.id,
      opportunity.title,
      opportunity.description,
      Date.parse(opportunity.event_begin),
      Date.parse(opportunity.event_end),
      organizers,
      null,
      opportunity.zip_code,
      false,
    ));
  }

  opportunities = results;
}

fetchOpportunities();

/**
 * Removes an opportunity from the database
 * @param {Opportunity} toRemove The opportunity to remove
 */
Opportunity.remove = async function(toRemove) {
  const { error } = await supabase.from('opportunities')
    .delete()
    .eq('id', toRemove.id);

  if (error) {
    console.error('Failed to delete opportunity with ID: ' + error.message);
    return null;
  }
  
  fetchOpportunities();
}

/**
 * Adds an opportunity to the database
 * @param {Opportunity} toAdd The opportunity to add
 * @returns {Promise<object>} The added opportunity
 */
Opportunity.add = async function(toAdd) {
  const createdBy = toAdd.organizers.shift();

  const { data, error } = await supabase.from('opportunities')
    .insert({
      title: toAdd.title,
      description: toAdd.description,
      event_begin: new Date(toAdd.startDate).toISOString(),
      event_end: new Date(toAdd.endDate).toISOString(),
      zip_code: toAdd.zipCode,
      created_by: createdBy,
      organizers: toAdd.organizers,
    })
    .select('*');

  if (error) {
    console.error('Failed to add opportunity: ' + error.message);
    return null;
  }

  const result = data[0];
  if (!result) {
    return null;
  }

  fetchOpportunities();

  toAdd.id = result.id;
  return toAdd;
}

/**
 * Updates an existing opportunity in the database
 * @param {Opportunity} toUpdate The opportunity to update
 * @param {{}} opportunityData Opportunity data to apply
 * @returns {Promise<object>} Updated opportunity object
 */
Opportunity.update = async function(toUpdate, opportunityData) {
  opportunityData.updated_at = new Date(Date.now()).toISOString();

  const { data, error } = await supabase.from('opportunities')
    .update(opportunityData)
    .eq('id', toUpdate.id)
    .select('*');

  if (error) {
    console.error('Failed to update opportunity: ' + error.message);
    return null;
  }

  const opportunity = data[0];
  if (!opportunity) {
    return null;
  }

  fetchOpportunities();

  return new Opportunity(
    id = opportunity.id,
    title = opportunity.title,
    description = opportunity.description,
    startDate = Date.parse(opportunity.event_begin),
    endDate = Date.parse(opportunity.event_end),
    organizers = opportunity.organizers,
    image = null,
    zipCode = opportunity.zip_code,
    isJoined = false,
  );
}

/**
 * Returns all opportunities from the database
 * @returns All opportunities from the database
 */
Opportunity.getAll = function() {
  return opportunities;
}

/**
 * Sorts all opportunities by their title
 * @param {boolean} ascending Whether to sort the array in ascending order
 * @param {[Opportunity]?} toSort An optional array of opportunities to sort
 * @returns A sorted array of opportunities
 */
Opportunity.getSorted = function(ascending, toSort) {
  let sorted = (toSort ?? opportunities).sort(function(a, b) {
    let titleA = a.title.toLowerCase();
    let titleB = b.title.toLowerCase();

    if (titleA === titleB) {
      return 0;
    }

    return titleA < titleB ? -1 : 1;
  });

  if (ascending) {
    return sorted;
  }

  return sorted.reverse();
}

/**
 * Returns all opportunities whose zip code matches the given value
 * @param {number} zipCode The zip code of all opportunities to fetch
 * @param {[Opportunity]?} toFilter An optional array of opportunities to filter
 * @returns All opportunities filtered by their zip code
 */
Opportunity.getFiltered = function(zipCode, toFilter) {
  return (toFilter ?? opportunities).filter(function(opportunity) {
    return opportunity.zipCode == zipCode;
  });
}

/**
 * Leaves an opportunity by marking it as not joined
 * @param {Opportunity} toLeave The opportunity to leave
 */
Opportunity.leave = function(toLeave) {
  toLeave.isJoined = false;
}

module.exports = Opportunity;
