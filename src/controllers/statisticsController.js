/**
 * Statistics Controller
 * 
 * Handles routing and requests related to displaying volunteer statistics
 */

// Import models
const Statistics = require('../models/Statistics');

/**
 * GET /statistics
 * Display various statistics on volunteer work from the US Census API
 */
exports.getStatistics = async (req, res, next) => {
  console.log(`[${new Date().toISOString()}] [StatisticsController] Fetching statistics...`);

  try {
    res.render('statistics', {
      title: 'Statistics',
      csrfToken: req.csrfToken(),
      volunteerFreq: await Statistics.getVolunteerFrequency(),
      childrenActFreq: await Statistics.getVolunteerChildrensActivityFrequency(),
      onlineFreq: await Statistics.getVolunteerOnlineFrequency(),
      avgHours: await Statistics.getAverageVolunteerHours(),
      medHours: await Statistics.getMedianVolunteerHours(),
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [StatisticsController] Fetch failed:`, error.message);
    next(error);
  }
}
