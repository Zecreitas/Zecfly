import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Plane, Clock, Star, Filter, ArrowRight, ArrowUpDown, Building2 } from 'lucide-react';
import { amadeusService } from '../../services/amadeus';
import { AIRPORTS_BR } from './airportsBR';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { FlightCard } from '../flight/FlightCard';

interface FlightOffer {
  id: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
  numberOfBookableSeats: number;
  class: string;
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

// Adicionar mapeamento de códigos de companhias aéreas
const airlineNames: { [key: string]: string } = {
  'LA': 'LATAM Airlines',
  'G3': 'GOL Linhas Aéreas',
  'AD': 'Azul Linhas Aéreas',
  'JJ': 'TAM Airlines',
};

// Lista de aeroportos nacionais
const AIRPORTS = [
  { name: 'Aeroporto Internacional de Guarulhos', iata: 'GRU', city: 'São Paulo', country: 'Brasil' },
  { name: 'Aeroporto Internacional do Galeão', iata: 'GIG', city: 'Rio de Janeiro', country: 'Brasil' },
  { name: 'Aeroporto Internacional de Brasília', iata: 'BSB', city: 'Brasília', country: 'Brasil' },
  { name: 'Aeroporto Internacional de Viracopos', iata: 'VCP', city: 'Campinas', country: 'Brasil' },
  { name: 'Aeroporto Internacional de Confins', iata: 'CNF', city: 'Belo Horizonte', country: 'Brasil' },
  // ... adicione mais aeroportos nacionais se desejar ...
];

const Flights: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripType, setTripType] = useState('roundtrip');
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    passengers: 1,
    class: 'ECONOMY'
  });

  // Modificar os estados para incluir mais opções de filtro
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  // Modificar os estados para incluir os voos originais
  const [originalFlights, setOriginalFlights] = useState<FlightOffer[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<FlightOffer[]>([]);

  // Modificar a função searchFlights para garantir que os códigos IATA sejam usados
  const searchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        currencyCode: 'BRL',
        originDestinations: [
          {
            id: '1',
            originLocationCode: formData.origin,
            destinationLocationCode: formData.destination,
            departureDateTimeRange: { date: formData.departureDate }
          },
          ...(tripType === 'roundtrip' ? [{
            id: '2',
            originLocationCode: formData.destination,
            destinationLocationCode: formData.origin,
            departureDateTimeRange: { date: formData.returnDate }
          }] : [])
        ],
        travelers: Array.from({ length: formData.passengers }, (_, i) => ({
          id: (i + 1).toString(),
          travelerType: 'ADULT'
        })),
        sources: ['GDS'],
        ...(formData.class && { travelClass: formData.class })
      };
      const response = await amadeusService.searchFlights(searchParams);

      if (response && response.data) {
        setOriginalFlights(response.data);
        applyFilters(response.data);
      } else {
        setError('Nenhum voo encontrado para os critérios selecionados.');
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Erro ao buscar voos. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Separar a lógica de filtragem em uma função reutilizável
  const applyFilters = (flights: FlightOffer[]) => {
    const filtered = flights.filter(flight => {
      const price = parseFloat(flight.price.total);
      
      // Filtro de preço - garantir que a comparação seja feita corretamente
      if (price < priceRange.min || price > priceRange.max) return false;

      // Filtro de companhias aéreas
      if (selectedAirlines.length > 0) {
        const airlineCode = flight.itineraries[0].segments[0].carrierCode;
        if (!selectedAirlines.includes(airlineCode)) return false;
      }

      // Filtro de escalas
      if (selectedStops.length > 0) {
        const stops = flight.itineraries[0].segments.length - 1;
        const stopType = stops === 0 ? 'direct' : stops === 1 ? 'one-stop' : 'two-plus-stops';
        if (!selectedStops.includes(stopType)) return false;
      }

      // Filtro de horário
      if (selectedTimes.length > 0) {
        const departureTime = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
        let timeSlot = '';
        if (departureTime >= 6 && departureTime < 12) timeSlot = 'morning';
        else if (departureTime >= 12 && departureTime < 18) timeSlot = 'afternoon';
        else if (departureTime >= 18 && departureTime < 23) timeSlot = 'evening';
        else timeSlot = 'night';
        if (!selectedTimes.includes(timeSlot)) return false;
      }

      // Filtro de duração
      if (selectedDurations.length > 0) {
        const duration = calculateFlightDuration(
          flight.itineraries[0].segments[0].departure.at,
          flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at
        );
        let durationType = '';
        if (duration <= 180) durationType = 'short';
        else if (duration <= 360) durationType = 'medium';
        else durationType = 'long';
        if (!selectedDurations.includes(durationType)) return false;
      }

      return true;
    });

    setFilteredFlights(filtered);
  };

  // Função para calcular a duração do voo em minutos
  const calculateFlightDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure).getTime();
    const arr = new Date(arrival).getTime();
    return Math.round((arr - dep) / (1000 * 60));
  };

  // Modificar a função updateFilters para usar a nova função applyFilters
  const updateFilters = () => {
    applyFilters(originalFlights);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'origin') {
      setFormData(prev => ({ ...prev, origin: value.toString() }));
      searchOriginCities(value.toString());
    } else if (field === 'destination') {
      setFormData(prev => ({ ...prev, destination: value.toString() }));
      searchDestinationCities(value.toString());
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const swapCities = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  // Modificar o handler do preço para atualizar imediatamente
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    setPriceRange(prev => {
      const newRange = { ...prev, [type]: value };
      return newRange;
    });
    // Chamar updateFilters após atualizar o estado
    setTimeout(updateFilters, 0);
  };

  const [originCities, setOriginCities] = useState<City[]>([]);
  const [destinationCities, setDestinationCities] = useState<City[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState<City | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<City | null>(null);

  const searchOriginCities = async (keyword: string) => {
    console.log('Searching origin cities with keyword:', keyword);
    if (keyword.length < 2) {
      console.log('Keyword too short, returning empty list.');
      setOriginCities([]);
      setShowOriginSuggestions(false);
      return;
    }

    try {
      const cities = await amadeusService.searchCities(keyword);
      console.log('Received cities for origin:', cities);
      setOriginCities(cities);
      if (cities.length > 0) {
        setShowOriginSuggestions(true);
        console.log('Setting showOriginSuggestions to true');
      } else {
        setShowOriginSuggestions(false);
        console.log('Setting showOriginSuggestions to false (no cities)');
      }
    } catch (error) {
      console.error('Error searching origin cities:', error);
      setOriginCities([]);
      setShowOriginSuggestions(false);
      console.log('Setting showOriginSuggestions to false (error)');
    }
  };

  const searchDestinationCities = async (keyword: string) => {
    console.log('Searching destination cities with keyword:', keyword);
    if (keyword.length < 2) {
      console.log('Keyword too short, returning empty list.');
      setDestinationCities([]);
      setShowDestinationSuggestions(false);
      return;
    }

    try {
      const cities = await amadeusService.searchCities(keyword);
      console.log('Received cities for destination:', cities);
      setDestinationCities(cities);
      if (cities.length > 0) {
        setShowDestinationSuggestions(true);
        console.log('Setting showDestinationSuggestions to true');
      } else {
        setShowDestinationSuggestions(false);
        console.log('Setting showDestinationSuggestions to false (no cities)');
      }
    } catch (error) {
      console.error('Error searching destination cities:', error);
      setDestinationCities([]);
      setShowDestinationSuggestions(false);
      console.log('Setting showDestinationSuggestions to false (error)');
    }
  };

  const handleOriginSelect = (city: City) => {
    console.log('Origin city selected:', city);
    setFormData(prev => ({ ...prev, origin: city.iataCode }));
    // Keep the full name in the input for better UX until search is triggered
    const originInput = document.getElementById('origin-input') as HTMLInputElement;
    if (originInput) originInput.value = city.name;
    // setSelectedOrigin(city); // No longer needed as we use formData.origin IATA code for search
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelect = (city: City) => {
    console.log('Destination city selected:', city);
    setFormData(prev => ({ ...prev, destination: city.iataCode }));
    // Keep the full name in the input for better UX until search is triggered
    const destinationInput = document.getElementById('destination-input') as HTMLInputElement;
    if (destinationInput) destinationInput.value = city.name;
    // setSelectedDestination(city); // No longer needed
    setShowDestinationSuggestions(false);
  };

  // Função utilitária para priorizar cidades brasileiras
  function sortBrazilFirst(cities: City[]) {
    return [...cities].sort((a, b) => {
      const isBrazilA = a.address?.countryName === 'Brazil';
      const isBrazilB = b.address?.countryName === 'Brazil';
      if (isBrazilA && !isBrazilB) return -1;
      if (!isBrazilA && isBrazilB) return 1;
      return 0;
    });
  }

  // Estado para sugestões de aeroportos
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);

  // Função para filtrar aeroportos nacionais conforme o usuário digita
  const handleOriginInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, origin: value }));
    if (value.length > 1) {
      const filtered = AIRPORTS_BR.filter(a =>
        (a.name.toLowerCase().includes(value.toLowerCase()) ||
          a.iata.toLowerCase().includes(value.toLowerCase()) ||
          a.city.toLowerCase().includes(value.toLowerCase()))
      );
      setOriginSuggestions(filtered.slice(0, 8));
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestinationInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, destination: value }));
    if (value.length > 1) {
      const filtered = AIRPORTS_BR.filter(a =>
        (a.name.toLowerCase().includes(value.toLowerCase()) ||
          a.iata.toLowerCase().includes(value.toLowerCase()) ||
          a.city.toLowerCase().includes(value.toLowerCase()))
      );
      setDestinationSuggestions(filtered.slice(0, 8));
    } else {
      setDestinationSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Search Header */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                Encontre seu voo ideal
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Compare preços, encontre as melhores rotas e reserve sua próxima aventura com total segurança
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-6xl mx-auto">
              {/* Trip Type Selector */}
              <div className="flex flex-wrap gap-4 mb-6">
                <button
                  onClick={() => setTripType('roundtrip')}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    tripType === 'roundtrip' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Plane className="w-5 h-5" />
                  Ida e volta
                </button>
                <button
                  onClick={() => setTripType('oneway')}
                  className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                    tripType === 'oneway' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Plane className="w-5 h-5" />
                  Somente ida
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Campo de origem (autocomplete nacional) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.origin || ''}
                      onChange={e => handleOriginInputChange(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Digite o nome, cidade ou código IATA do aeroporto de origem"
                      autoComplete="off"
                    />
                    {originSuggestions.length > 0 && (
                      <ul className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {originSuggestions.map((airport) => (
                          <li
                            key={airport.iata}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-600 text-blue-700 hover:text-white transition-colors"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, origin: airport.iata }));
                              setOriginSuggestions([]);
                            }}
                          >
                            {airport.name} ({airport.iata}) - {airport.city}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-1 text-xs text-gray-500">Digite o nome, cidade ou código IATA do aeroporto de origem</div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex items-end justify-center pb-3">
                  <button
                    onClick={() => {
                      const tempOrigin = selectedOrigin;
                      const tempDestination = selectedDestination;
                      setSelectedOrigin(tempDestination);
                      setSelectedDestination(tempOrigin);
                      setFormData(prev => ({
                        ...prev,
                        origin: prev.destination,
                        destination: prev.origin
                      }));
                    }}
                    className="p-3 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors"
                    title="Trocar origem e destino"
                  >
                    <ArrowUpDown className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Campo de destino (autocomplete nacional) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destino</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.destination || ''}
                      onChange={e => handleDestinationInputChange(e.target.value)}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Digite o nome, cidade ou código IATA do aeroporto de destino"
                      autoComplete="off"
                    />
                    {destinationSuggestions.length > 0 && (
                      <ul className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {destinationSuggestions.map((airport) => (
                          <li
                            key={airport.iata}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-600 text-blue-700 hover:text-white transition-colors"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, destination: airport.iata }));
                              setDestinationSuggestions([]);
                            }}
                          >
                            {airport.name} ({airport.iata}) - {airport.city}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-1 text-xs text-gray-500">Digite o nome, cidade ou código IATA do aeroporto de destino</div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Ida</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) => handleInputChange('departureDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {tripType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Volta</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => handleInputChange('returnDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                )}

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passageiros</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.passengers}
                      onChange={(e) => handleInputChange('passengers', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value={1}>1 passageiro</option>
                      <option value={2}>2 passageiros</option>
                      <option value={3}>3 passageiros</option>
                      <option value={4}>4 passageiros</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Search Button */}
              <div className="mt-8 text-center">
                <Button 
                  onClick={searchFlights}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Buscar Voos
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl text-gray-900">Filtros</h3>
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                
                {/* Price Filter */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Preço</h4>

                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        handlePriceChange('min', value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mínimo"
                      min="0"
                      max={priceRange.max}
                    />
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : Number(e.target.value);
                        handlePriceChange('max', value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Máximo"
                      min={priceRange.min}
                      max="30000"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>R$ 0</span>
                    <span>R$ 30.000</span>
                  </div>
                </div>
                
                {/* Duration Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-800">Duração do Voo</h4>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedDurations.includes('short')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDurations([...selectedDurations, 'short']);
                          } else {
                            setSelectedDurations(selectedDurations.filter(d => d !== 'short'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Até 3 horas</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedDurations.includes('medium')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDurations([...selectedDurations, 'medium']);
                          } else {
                            setSelectedDurations(selectedDurations.filter(d => d !== 'medium'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">3-6 horas</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedDurations.includes('long')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDurations([...selectedDurations, 'long']);
                          } else {
                            setSelectedDurations(selectedDurations.filter(d => d !== 'long'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Mais de 6 horas</span>
                    </label>
                  </div>
                </div>

                {/* Airlines Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-800">Companhias Aéreas</h4>
                  <div className="space-y-3">
                    {Object.entries(airlineNames).map(([code, name]) => (
                      <label key={code} className="flex items-center group cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          checked={selectedAirlines.includes(code)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAirlines([...selectedAirlines, code]);
                            } else {
                              setSelectedAirlines(selectedAirlines.filter(c => c !== code));
                            }
                            updateFilters();
                          }}
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stops Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-800">Escalas</h4>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedStops.includes('direct')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStops([...selectedStops, 'direct']);
                          } else {
                            setSelectedStops(selectedStops.filter(stop => stop !== 'direct'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Direto</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedStops.includes('one-stop')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStops([...selectedStops, 'one-stop']);
                          } else {
                            setSelectedStops(selectedStops.filter(stop => stop !== 'one-stop'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">1 escala</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedStops.includes('two-plus-stops')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStops([...selectedStops, 'two-plus-stops']);
                          } else {
                            setSelectedStops(selectedStops.filter(stop => stop !== 'two-plus-stops'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">2+ escalas</span>
                    </label>
                  </div>
                </div>

                {/* Time Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold mb-4 text-gray-800">Horário de Partida</h4>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedTimes.includes('morning')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimes([...selectedTimes, 'morning']);
                          } else {
                            setSelectedTimes(selectedTimes.filter(time => time !== 'morning'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Manhã (6h - 12h)</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedTimes.includes('afternoon')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimes([...selectedTimes, 'afternoon']);
                          } else {
                            setSelectedTimes(selectedTimes.filter(time => time !== 'afternoon'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Tarde (12h - 18h)</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedTimes.includes('evening')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimes([...selectedTimes, 'evening']);
                          } else {
                            setSelectedTimes(selectedTimes.filter(time => time !== 'evening'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Noite (18h - 23h)</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedTimes.includes('night')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTimes([...selectedTimes, 'night']);
                          } else {
                            setSelectedTimes(selectedTimes.filter(time => time !== 'night'));
                          }
                          updateFilters();
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">Madrugada (23h - 6h)</span>
                    </label>
                  </div>
                </div>

                {/* Reset Filters Button */}
                <Button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 10000 });
                    setSelectedAirlines([]);
                    setSelectedStops([]);
                    setSelectedTimes([]);
                    setSelectedDurations([]);
                    updateFilters();
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
            
            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {loading ? 'Buscando voos...' : `${filteredFlights.length} voos encontrados`}
                  </h2>
                  <p className="text-gray-600">
                    {formData.origin} → {formData.destination} • {formData.departureDate}
                    {tripType === 'roundtrip' && ` • ${formData.returnDate}`}
                  </p>
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700"
                  aria-label="Ordenar voos por"
                >
                  <option value="price">Menor preço</option>
                  <option value="duration">Menor duração</option>
                  <option value="departure">Horário de partida</option>
                </select>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6" role="alert">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status">
                    <span className="sr-only">Carregando...</span>
                  </div>
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-600 mb-4">Nenhum voo encontrado com os filtros selecionados.</p>
                  <Button
                    onClick={() => {
                      setPriceRange({ min: 0, max: 10000 });
                      setSelectedAirlines([]);
                      setSelectedStops([]);
                      setSelectedTimes([]);
                      setSelectedDurations([]);
                      updateFilters();
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar filtros
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFlights.map((flight) => {
                    const segment = flight.itineraries[0].segments[0];
                    const lastSegment = flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
                    const airlineCode = segment.carrierCode;
                    const airline = airlineNames[airlineCode] || airlineCode;
                    const logo = `/logo.jpg`;
                    const departure = segment.departure.at;
                    const arrival = lastSegment.arrival.at;
                    const origin = segment.departure.iataCode;
                    const destination = lastSegment.arrival.iataCode;
                    const price = parseFloat(flight.price.total);
                    const stops = flight.itineraries[0].segments.length - 1;
                    const duration = (() => {
                      const dep = new Date(segment.departure.at).getTime();
                      const arr = new Date(lastSegment.arrival.at).getTime();
                      const mins = Math.round((arr - dep) / (1000 * 60));
                      const h = Math.floor(mins / 60);
                      const m = mins % 60;
                      return `${h}h${m > 0 ? ` ${m}m` : ''}`;
                    })();
                    const aircraft = segment.aircraft?.code || '';
                    const departureDate = departure.split('T')[0];
                    const skyscannerDate = departureDate.replace(/-/g, '').slice(2, 8); // YYMMDD
                    const bookingUrl = `https://www.skyscanner.com.br/transport/flights/${origin}/${destination}/${skyscannerDate}/`;
                    return (
                      <FlightCard
                        key={flight.id}
                        flight={{
                          id: flight.id,
                          airline,
                          logo,
                          departure,
                          arrival,
                          origin,
                          destination,
                          price,
                          stops,
                          duration,
                          aircraft,
                          bookingUrl
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Flights; 