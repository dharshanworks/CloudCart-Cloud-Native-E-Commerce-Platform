/**
 * Pexels API Service
 * Fetches product images from Pexels API
 */

const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export const fetchProductImageFromPexels = async (query) => {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  console.log(
    '🔑 PEXELS KEY:',
    PEXELS_API_KEY ? 'FOUND' : 'MISSING'
  );

  if (!PEXELS_API_KEY) {
    console.warn(
      '⚠️ PEXELS_API_KEY not configured. Skipping image fetch from Pexels.'
    );
    return null;
  }

  try {
    const response = await fetch(
      `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.warn(
        `⚠️ Pexels API error: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      console.warn(`⚠️ No images found on Pexels for query: "${query}"`);
      return null;
    }

    return (
      data.photos[0].src.large2x ||
      data.photos[0].src.large ||
      data.photos[0].src.medium
    );
  } catch (error) {
    console.error(
      '❌ Error fetching from Pexels API:',
      error.message
    );
    return null;
  }
};

export default {
  fetchProductImageFromPexels
};