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
   */
  constructor(title, description, startDate, endDate, organizers, image) {
    // Default values to ensure all properties are present in the class
    this.title = title ?? '[Title]';
    this.description = description ?? '[Description]';
    this.startDate = startDate ?? Date.now();
    this.endDate = endDate ?? Date.now();
    this.organizers = organizers ?? ['[Organizer]'];
    this.image = image ?? '/img/zybooks_cat.jpg';
    this.zipCode = this.zipCode ?? 12345;
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

module.exports = Opportunity;
