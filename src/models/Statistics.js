/**
 * Statistics Model
 *
 * This model handles API requests for US Census Bureau data
 * for volunteer work collected in September 2023
 *
 * Methods:
 * - getVolunteerFrequency(): Get frequency of volunteer work
 */

let cache = {}

// Group census data by responses for easy analysis
function aggregateData(data) {
  let results = {};
  
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
    if (cache[dataKey]) {
      return cache[dataKey];
    }

    const response = await fetch('https://api.census.gov/data/2023/cps/volunteer/sep?get=' + dataKey);

    if (!response.ok) {
      throw new Error('Failed to fetch key: ' + dataKey);
    }

    const data = await response.json();

    if (data) {
      const aggregated = aggregateData(data);
      cache[dataKey] = aggregated;
      return aggregated;
    }
  } catch (error) {
    console.error('Failed to fetch data: ', error);
  }
}

class Statistics {
  
}

module.exports = Statistics;
