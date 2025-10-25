/**
 * Opportunity Model
 * 
 * A class holding all required data for an opportunity
 * and basic methods to query this data
 * 
 * TODO: Connect to a database and add methods for database operations
 */

class Opportunity {
  /**
   * Opportunity constructor with all required data
   * @param {string} title The title of this opportunity
   * @param {string} description The description of this opportunity
   * @param {Date} startDate The start date of this opportunity
   * @param {Date} endDate The end date of this opportunity
   * @param {[string]} organizers The email addresses of this opportunity's organizers
   * @param {string} image The path to the image for this opportunity
   * @param {number} zipCode The zip code associated with this opportunity
   * @param {boolean} isJoined Whether this opportunity has been joined
   * TODO: Attach isJoined and instance methods to user sessions rather than global data
   */
  constructor(title, description, startDate, endDate, organizers, image, zipCode, isJoined) {
    // Default values to ensure all properties are present in the class
    this.title = title ?? '[Title]';
    this.description = description ?? '[Description]';
    this.startDate = startDate ?? Date.now();
    this.endDate = endDate ?? Date.now();
    this.organizers = organizers ?? ['[Organizer]'];
    this.image = image ?? '/img/zybooks_cat.jpg';
    this.zipCode = zipCode ?? 12345;
    this.isJoined = isJoined ?? false;
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

const opportunities = [

]

/**
 * Removes an opportunity from the existing opportunity list
 * @param {Opportunity} toRemove The opportunity to remove
 */
Opportunity.remove = function(toRemove) {
  opportunities = opportunities.filter(function(opportunity) {
    return opportunity !== toRemove;
  });
}

/**
 * Adds an opportunity to the existing opportunity list
 * @param {Opportunity} toAdd The opportunity to add
 */
Opportunity.add = function(toAdd) {
  opportunities.push(toAdd);
}

/**
 * Returns all currently stored opportunities
 * @returns A copy of all stored opportunities
 */
Opportunity.getAll = function() {
  return opportunities.values
}

/**
 * Returns all opportunities which have been joined
 * @returns An array of joined opportunities
 */
Opportunity.getJoined = function() {
  return opportunities.filter(function(opportunity) {
    return opportunity.isJoined;
  });
}

/**
 * Returns all opportunities which have not been joined
 * @returns An array of not joined opportunities
 */
Opportunity.getNotJoined = function() {
  return opportunities.filter(function(opportunity) {
    return !opportunity.isJoined;
  });
}

/**
 * Sorts all opportunities by their title
 * @param {boolean} ascending Whether to sort the array in ascending order
 * @returns A sorted array of opportunities
 */
Opportunity.getSorted = function(ascending) {
  let sorted = opportunities.sort(function(a, b) {
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
 * @returns All opportunities filtered by their zip code
 */
Opportunity.getFiltered = function(zipCode) {
  return opportunities.filter(function(opportunity) {
    return opportunity.zipCode === zipCode;
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
