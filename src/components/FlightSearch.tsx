import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { amadeusService } from '../services/amadeus';
import { FaPlane, FaCalendarAlt, FaUser, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface City {
  name: string;
  iataCode: string;
  address: {
    cityCode: string;
    cityName: string;
    countryName: string;
  };
}

const FlightSearch: React.FC = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originCities, setOriginCities] = useState<City[]>([]);
  const [destinationCities, setDestinationCities] = useState<City[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<City | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<City | null>(null);

  useEffect(() => {
    const searchOriginCities = async () => {
      console.log('Searching origin cities for:', origin);
      if (origin.length >= 2) {
        try {
          setLoading(true);
          console.log('Calling Amadeus API for origin cities...');
          const cities = await amadeusService.searchCities(origin);
          console.log('Received cities:', cities);
          setOriginCities(cities);
          setShowOriginSuggestions(true);
        } catch (error) {
          console.error('Error searching origin cities:', error);
          setError('Erro ao buscar cidades. Por favor, tente novamente.');
        } finally {
          setLoading(false);
        }
      } else {
        setOriginCities([]);
        setShowOriginSuggestions(false);
      }
    };

    const searchDestinationCities = async () => {
      console.log('Searching destination cities for:', destination);
      if (destination.length >= 2) {
        try {
          setLoading(true);
          console.log('Calling Amadeus API for destination cities...');
          const cities = await amadeusService.searchCities(destination);
          console.log('Received cities:', cities);
          setDestinationCities(cities);
          setShowDestinationSuggestions(true);
        } catch (error) {
          console.error('Error searching destination cities:', error);
          setError('Erro ao buscar cidades. Por favor, tente novamente.');
        } finally {
          setLoading(false);
        }
      } else {
        setDestinationCities([]);
        setShowDestinationSuggestions(false);
      }
    };

    const originTimeout = setTimeout(searchOriginCities, 500);
    const destinationTimeout = setTimeout(searchDestinationCities, 500);

    return () => {
      clearTimeout(originTimeout);
      clearTimeout(destinationTimeout);
    };
  }, [origin, destination]);

  const handleOriginSelect = (city: City) => {
    setSelectedOrigin(city);
    setOrigin(city.name);
    setShowOriginSuggestions(false);
    setError(null);
  };

  const handleDestinationSelect = (city: City) => {
    setSelectedDestination(city);
    setDestination(city.name);
    setShowDestinationSuggestions(false);
    setError(null);
  };

  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Origin input changed:', e.target.value);
    setOrigin(e.target.value);
    setSelectedOrigin(null);
    setError(null);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Destination input changed:', e.target.value);
    setDestination(e.target.value);
    setSelectedDestination(null);
    setError(null);
  };

  const handleSearch = async () => {
    if (!selectedOrigin || !selectedDestination) {
      setError('Por favor, selecione uma cidade de origem e destino válida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = {
        currencyCode: 'BRL',
        originDestinations: [
          {
            id: '1',
            originLocationCode: selectedOrigin.iataCode,
            destinationLocationCode: selectedDestination.iataCode,
            departureDateTimeRange: { date: departureDate }
          },
          ...(tripType === 'roundtrip' && returnDate ? [{
            id: '2',
            originLocationCode: selectedDestination.iataCode,
            destinationLocationCode: selectedOrigin.iataCode,
            departureDateTimeRange: { date: returnDate }
          }] : [])
        ],
        travelers: Array.from({ length: passengers }, (_, i) => ({
          id: (i + 1).toString(),
          travelerType: 'ADULT'
        })),
        sources: ['GDS'],
        ...(travelClass && { travelClass })
      };

      const results = await amadeusService.searchFlights(searchParams);
      navigate('/results', { state: { results, searchParams } });
    } catch (error) {
      setError('Erro ao buscar voos. Por favor, tente novamente.');
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLocations = () => {
    const tempOrigin = origin;
    const tempSelectedOrigin = selectedOrigin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(tempSelectedOrigin);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            className={`px-4 py-2 rounded-lg ${
              tripType === 'oneway' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
            onClick={() => setTripType('oneway')}
          >
            Ida
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              tripType === 'roundtrip' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
            onClick={() => setTripType('roundtrip')}
          >
            Ida e Volta
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origem
            </label>
            <div className="relative">
              <input
                type="text"
                value={origin}
                onChange={handleOriginChange}
                placeholder="Cidade de origem"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showOriginSuggestions && originCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {originCities.map((city) => (
                    <div
                      key={city.iataCode}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleOriginSelect(city)}
                    >
                      <div className="font-medium">{city.address.cityName}</div>
                      <div className="text-sm text-gray-500">{city.address.countryName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSwapLocations}
            className="mt-6 p-2 text-gray-600 hover:text-blue-600"
          >
            <FaExchangeAlt />
          </button>

          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destino
            </label>
            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Cidade de destino"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showDestinationSuggestions && destinationCities.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {destinationCities.map((city) => (
                    <div
                      key={city.iataCode}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleDestinationSelect(city)}
                    >
                      <div className="font-medium">{city.address.cityName}</div>
                      <div className="text-sm text-gray-500">{city.address.countryName}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Ida
            </label>
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
              <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          {tripType === 'roundtrip' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Volta
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={departureDate || new Date().toISOString().split('T')[0]}
                />
                <FaCalendarAlt className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passageiros
            </label>
            <div className="relative">
              <input
                type="number"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                min="1"
                max="9"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaUser className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              value={travelClass}
              onChange={(e) => setTravelClass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ECONOMY">Econômica</option>
              <option value="PREMIUM_ECONOMY">Econômica Premium</option>
              <option value="BUSINESS">Executiva</option>
              <option value="FIRST">Primeira Classe</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
            loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors duration-200`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando voos...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FaPlane className="mr-2" />
              Buscar Voos
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default FlightSearch; 