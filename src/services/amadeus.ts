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
  searchFlights: async (params: any) => {
    const response = await fetch('https://zecfly-api.onrender.com/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Erro ao buscar voos');
    return await response.json();
  },
  // Mantém searchCities como está, pois depende do token Amadeus
}; 