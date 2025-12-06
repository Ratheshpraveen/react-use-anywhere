/**
 * Generic fetcher function for data retrieval using fetch API
 * @param {string} url - The URL to fetch data from
 * @param {Object} [options] - Optional fetch configuration
 * @returns {Promise} - Resolves with parsed JSON data
 */
export const fetcher = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetcher Error:', error);
    throw error;
  }
};

/**
 * POST request helper
 * @param {string} url - The URL to send POST request
 * @param {Object} data - The data to send
 * @returns {Promise} - Resolves with parsed JSON response
 */
export const postFetcher = (url, data) => 
  fetcher(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export default fetcher;
