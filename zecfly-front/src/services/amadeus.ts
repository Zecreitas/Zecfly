import axios from 'axios';

const AMADEUS_API_URL = 'https://test.api.amadeus.com/v1';
const AMADEUS_FLIGHT_API_URL = 'https://test.api.amadeus.com/v2';
const AMADEUS_CLIENT_ID = '5Jxqq8soVQhl9qWDognyys6jTwW1d1zI';
const AMADEUS_CLIENT_SECRET = 'yGyEnAoOs6y5KO0H';

interface AmadeusToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface City {
  name: string;
  iataCode: string;
  address: {
    cityCode: string;
    cityName: string;
    countryName: string;
  };
}

const amadeusApi = axios.create({
  baseURL: AMADEUS_API_URL
});

const amadeusFlightApi = axios.create({
  baseURL: AMADEUS_FLIGHT_API_URL
});

let token: AmadeusToken | null = null;
let tokenExpiration: number = 0;

const getToken = async () => {
  if (token && Date.now() < tokenExpiration) {
    return token.access_token;
  }

  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${AMADEUS_CLIENT_ID}&client_secret=${AMADEUS_CLIENT_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    token = response.data;
    tokenExpiration = Date.now() + (token.expires_in * 1000);
    return token.access_token;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
};

// Helper function to remove diacritics (accents)
const removeDiacritics = (str: string): string => {
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
};

export const amadeusService = {
  searchFlights: async (params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    travelClass: string;
  }) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Failed to get token'); // Fix linter error
      const response = await amadeusFlightApi.get('/shopping/flight-offers', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          originLocationCode: params.originLocationCode,
          destinationLocationCode: params.destinationLocationCode,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults,
          travelClass: params.travelClass,
          currencyCode: 'BRL',
          max: 5
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },

  searchCities: async (keyword: string): Promise<City[]> => {
    console.log('Searching cities with keyword:', keyword);
    if (keyword.length < 2) {
      console.log('Keyword too short, returning empty list.');
      return [];
    }

    // Remove diacritics from the keyword for API v1 compatibility attempt
    const cleanedKeyword = removeDiacritics(keyword);
    console.log('Cleaned keyword for API v1:', cleanedKeyword);

    try {
      const token = await getToken();
       if (!token) throw new Error('Failed to get token'); // Fix linter error
      console.log('Obtained token for city search.');
      const response = await amadeusApi.get('/reference-data/locations', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          subType: 'CITY',
          keyword: cleanedKeyword,
          'page[limit]': 30
        }
      });

      console.log('Raw API response for cities:', response);

      if (response.data && Array.isArray(response.data.data)) {
        const cities = response.data.data.map((item: any) => ({
          name: `${item.address.cityName}, ${item.address.countryName}`,
          iataCode: item.iataCode,
          address: {
            cityCode: item.address.cityCode,
            cityName: item.address.cityName,
            countryName: item.address.countryName
          }
        }));
        console.log('Formatted cities:', cities);
        return cities;
      } else {
        console.error('Invalid API response format for cities:', response.data);
        // Tratar caso a API retorne sucesso mas com formato inesperado
        return [];
      }

    } catch (error) {
      console.error('Error searching cities:', error);
      // Re-lançar o erro para ser tratado pelo componente, se necessário
      throw error;
    }
  }
}; 