/**
 * Statistics Model
 *
 * This model handles API requests for US Census Bureau data
 * for volunteer work collected in September 2023
 *
 * Note: Only collecting 'Yes' / 'No' answers for the sake of cleaner data
 * See also: https://api.census.gov/data/2023/cps/volunteer/sep/variables.html
 *
 * Methods:
 * - getVolunteerFrequency(): Get frequency of volunteer work
 * - getVolunteerChildrensActivityFrequency(): Get frequency of volunteer work in children's activities relative to all volunteers
 * - getVolunteerOnlineFrequency(): Get frequency of online volunteer work relative to all volunteers
 * - getAverageVolunteerHours(): Get average number of worked hours relative to all volunteers
 * - getMedianVolunteerHours(): Get median number of worked hours relative to all volunteers
 */

let cache = {}

// Group census data by responses for easy analysis
function aggregateData(data) {
  let results = {};
  
  // Count duplicate entries in data
  for (const entry of data) {
    const value = entry[0];
    
    if (!(value in results)) {
      results[value] = 0;
    }

    results[value]++;
  }

  return results;
}

// Send a query to the US Census API with a given data key
async function fetchData(dataKey) {
  try {
    // Check cache for already retrieved data to avoid duplicate fetches
    if (cache[dataKey]) {
      return cache[dataKey];
    }

    const response = await fetch('https://api.census.gov/data/2023/cps/volunteer/sep?get=' + dataKey);

    if (!response.ok) {
      throw new Error('Failed to fetch key: ' + dataKey + ' - ' + response.status);
    }

    const data = await response.json();

    if (data) {
      const aggregated = aggregateData(data);
      // Cache results for later lookups
      cache[dataKey] = aggregated;
      return aggregated;
    }
  } catch (error) {
    console.error('Failed to fetch data: ', error);
  }
}

class Statistics {
  // Get the number of responders who have volunteered as a proportion
  static async getVolunteerFrequency() {
    let data = fetchData('PES16');
    // 1: Yes
    let numVolunteers = data['1'] ?? 0;
    // 2: No
    let numNonVolunteers = data['2'] ?? 0;

    // Handle divide by zero errors
    if (numVolunteers + numNonVolunteers == 0) {
      return 0;
    }

    return numVolunteers / (numVolunteers + numNonVolunteers);
  }

  // Get the number of responders who volunteer to work with children
  // as a proportion relative to the number of volunteer responders
  static async getVolunteerChildrensActivityFrequency() {
    let data = fetchData('PES16A');
    // 1: Yes
    let numChildrensActivityVolunteers = data['1'] ?? 0;
    // 2: No
    let numGeneralVolunteers = data['2'] ?? 0;

    // Handle divide by zero errors
    if (numChildrensActivityVolunteers + numGeneralVolunteers == 0) {
      return 0;
    }

    return numChildrensActivityVolunteers / (numChildrensActivityVolunteers + numGeneralVolunteers);
  }

  // Get the number of responders who volunteer for online work
  // as a proportion relative to the number of volunteer responders
  static async getVolunteerOnlineFrequency() {
    let data = fetchData('PES16F');
    let numVolunteers = 0;
    let onlineScore = 0;
    // 1: All in-person
    numVolunteers += data['1'] ?? 0;
    // 2: More in-person than online
    onlineScore += data['2'] ?? 0;
    numVolunteers += data['2'] ?? 0;
    // 3: Evenly split
    onlineScore += 2 * (data['3'] ?? 0);
    numVolunteers += data['3'] ?? 0;
    // 4: More online than in-person
    onlineScore += 3 * (data['4'] ?? 0);
    numVolunteers += data['4'] ?? 0;
    // 5: All online
    onlineScore += 4 * (data['5'] ?? 0);
    numVolunteers += data['5'] ?? 0;

    // Handle divide by zero errors
    if (numVolunteers == 0) {
      return 0;
    }

    return (onlineScore / 4) / numVolunteers;
  }

  // Get the average number of hours a volunteer works for
  static async getAverageVolunteerHours() {
    let data = fetchData('PTS16E');
    let sumHours = 0;
    let numVolunteers = 0;

    // Hour range: [1,500]
    for (let i = 1; i <= 500; i++) {
      sumHours += i * (data[i.toString()] ?? 0);
      numVolunteers += data[i.toString()] ?? 0;
    }

    // Handle divide by zero errors
    if (numVolunteers == 0) {
      return 0;
    }

    return sumHours / numVolunteers;
  }

  // Get the median number of hours a volunteer works for
  static async getMedianVolunteerHours() {
    let data = fetchData('PTS16E');
    let numVolunteers = 0;

    // Hour range: [1,500]
    for (let i = 1; i <= 500; i++) {
      numVolunteers += data[i.toString()] ?? 0;
    }

    // Default to 0 if no data
    if (numVolunteers == 0) {
      return 0;
    }

    let counter = numVolunteers / 2;

    // Hour range: [1,500]
    for (let i = 1; i <= 500; i++) {
      counter -= data[i.toString()] ?? 0;
      if (counter < 0) {
        return i;
      }
    }

    return 0;
  }
}

module.exports = Statistics;
