import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Building2, Star, Filter, ArrowRight, ArrowUpDown } from 'lucide-react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { bookingService, BookingProperty } from '../../services/booking';
import HotelCard from '../hotel/HotelCard';
import FiltrosSidebar from '../hotel/FiltrosSidebar';
import ResultadosHeader from '../hotel/ResultadosHeader';

interface HotelSearchParams {
  arrival_date: string;
  departure_date: string;
  room_qty: string;
  guest_qty: string;
  bbox: string;
  search_id?: string;
  children_age?: string;
  price_filter_currencycode?: string;
  categories_filter?: string;
  languagecode?: string;
  travel_purpose?: 'leisure' | 'business';
  children_qty?: number;
  order_by?: 'popularity' | 'distance' | 'class_descending' | 'class_ascending' | 'deals' | 'review_score' | 'price';
  offset?: number;
}

// Função utilitária para buscar coordenadas da cidade
async function getCityCoordinates(city: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=Brazil&format=json&limit=1`,
      { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'zecfly-app/1.0' } }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch (e) {
    return null;
  }
}

const Hotels: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hotels, setHotels] = useState<BookingProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [showFilters, setShowFilters] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    location: 'São Paulo',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    rooms: 1,
    guests: 1,
    children: 0,
    childrenAges: [] as number[]
  });

  // Estados dos filtros
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  // Remover setSelectedDistricts e selectedDistricts

  const CIDADES_BRASIL = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Curitiba',
    'Manaus',
    'Recife',
    'Porto Alegre',
    'Belém',
    'Goiânia',
    'Guarulhos',
    'Campinas',
    'São Luís',
    'São Gonçalo',
    'Maceió',
    'Duque de Caxias',
    'Natal',
    'Teresina',
    'Campo Grande',
    'São Bernardo do Campo',
    'João Pessoa',
    'Nova Iguaçu',
    'São José dos Campos',
    'Santo André',
    'Ribeirão Preto',
    'Jaboatão dos Guararapes',
    'Osasco',
    'Uberlândia',
    'Contagem',
    'Sorocaba',
    'Aracaju',
    'Feira de Santana',
    'Cuiabá',
    'Joinville',
    'Aparecida de Goiânia',
    'Londrina',
    'Juiz de Fora',
    'Ananindeua',
    'Porto Velho',
    'Serra',
    'Niterói',
    'Belford Roxo',
    'Caxias do Sul',
    'Campos dos Goytacazes',
    'Macapá',
    'Florianópolis',
    'Vila Velha',
    'Mauá',
    'São João de Meriti',
    'Mogi das Cruzes',
    'Betim',
    'Santos',
    'Diadema',
    'Campina Grande',
    'Jundiaí',
    'Carapicuíba',
    'Olinda',
    'Piracicaba',
    'Cariacica',
    'Bauru',
    'Montes Claros',
    'Canoas',
    'Franca',
    'Blumenau',
    'Ponta Grossa',
    'Petrópolis',
    'Paulista',
    'Volta Redonda',
    'Vitória',
    'Santa Maria',
    'Arapiraca',
    'Boa Vista',
    'Governador Valadares',
    'Barueri',
    'Foz do Iguaçu',
    'Várzea Grande',
    'Taubaté',
    'Embu das Artes',
    'Caucaia',
    'Itaquaquecetuba',
    'Limeira',
    'Suzano',
    'São José do Rio Preto',
    'Marília',
    'Divinópolis',
    'Novo Hamburgo',
    'São Vicente',
    'Praia Grande',
    'Itaboraí',
    'Cascavel',
    'Ferraz de Vasconcelos',
    'Rondonópolis',
    'Pelotas',
    'Rio Branco',
    'Parnamirim',
    'Cabo de Santo Agostinho',
    'Itabuna',
    'Americana',
    'Sete Lagoas',
    'Dourados',
    'Magé',
    'Santa Luzia',
    'Camaçari',
    'Mossoró',
    'São Carlos',
    'Sumaré',
    'Presidente Prudente',
    'Águas Lindas de Goiás',
    'Gravataí',
    'Rio Grande',
    'Ibirité',
    'Viamão',
    'Juazeiro do Norte',
    'Itapevi',
    'Parauapebas',
    'Hortolândia',
    'Passo Fundo',
    'Colombo',
    'Alvorada',
    'Marabá',
    'Criciúma',
    'Itajaí',
    'Luziânia',
    'São José',
    'Cachoeiro de Itapemirim',
    'Rio Verde',
    'Abaetetuba',
    'Açailândia',
    'Afonso Cláudio',
    'Água Boa',
    'Água Branca',
    'Águas Belas',
    'Águas de Lindóia',
    'Aimorés',
    'Aiquara',
    'Alagoinhas',
    'Alcântara',
    'Alegrete',
    'Além Paraíba',
    'Alfenas',
    'Almenara',
    'Altamira',
    'Alto Araguaia',
    'Alto Paraíso de Goiás',
    'Alvorada',
    'Amargosa',
    'Amparo',
    'Anápolis',
    'Andradina',
    'Angra dos Reis',
    'Anicuns',
    'Anísio de Abreu',
    'Antonina',
    'Aparecida',
    'Aparecida do Taboado',
    'Aparecida de Goiânia',
    'Apucarana',
    'Aquidauana',
    'Aracaju',
    'Aragarças',
    'Araguari',
    'Araguaína',
    'Araguatins',
    'Aral Moreira',
    'Aramari',
    'Araraquara',
    'Araras',
    'Arari',
    'Araripina',
    'Araruama',
    'Araxá',
    'Arcos',
    'Areia Branca',
    'Ariquemes',
    'Arraial do Cabo',
    'Arroio do Meio',
    'Arroio do Tigre',
    'Arroio Grande',
    'Arvorezinha',
    'Assaí',
    'Assis',
    'Assis Chateaubriand',
    'Astorga',
    'Atibaia',
    'Augustinópolis',
    'Augusto Corrêa',
    'Augusto Pestana',
    'Aurelino Leal',
    'Auriflama',
    'Avaré',
    'Avelino Lopes',
    'Axixá',
  ];

  const CIDADES_GRANDES = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Brasília',
    'Salvador',
    'Fortaleza',
    'Curitiba',
    'Manaus',
    'Recife',
    'Porto Alegre',
    'Belém',
    'Goiânia',
    'Florianópolis',
    'Campo Grande',
    'Cuiabá',
    'Palmas',
    'Maceió',
    'Natal',
    'João Pessoa',
    'Aracaju',
    'Teresina',
    'São Luís',
    'Vitória',
    // ... pode adicionar mais cidades grandes se desejar ...
  ];

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

  const searchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      // Buscar coordenadas da cidade digitada
      const coords = await getCityCoordinates(formData.location);
      if (!coords) {
        setError('Cidade não encontrada. Tente outra localização.');
        setLoading(false);
        setHotels([]); // <- garantir array vazio
        return;
      }
      // Montar bbox de 0.2 grau ao redor do centro da cidade
      const delta = 0.2;
      const bbox = `${coords.lat - delta},${coords.lat + delta},${coords.lon - delta},${coords.lon + delta}`;
      const params: HotelSearchParams = {
        arrival_date: formData.checkIn,
        departure_date: formData.checkOut,
        room_qty: formData.rooms.toString(),
        guest_qty: formData.guests.toString(),
        bbox,
        languagecode: 'pt-br',
        travel_purpose: 'leisure',
        order_by: sortBy as any,
        price_filter_currencycode: 'BRL'
      };
      if (formData.children > 0) {
        params.children_qty = formData.children;
        params.children_age = formData.childrenAges.join(',');
      }
      const response = await bookingService.searchHotels(params);
      // Garante que sempre será array
      setHotels((response && response.result) ? response.result : []);
    } catch (err) {
      setError('Erro ao buscar hotéis. Por favor, tente novamente.');
      setHotels([]); // <- garantir array vazio em erro
      console.error('Error searching hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'location') {
      setFormData(prev => ({ ...prev, location: value.toString() }));
      if (typeof value === 'string' && value.length > 1) {
        const filtered = CIDADES_GRANDES.filter(cidade => cidade.toLowerCase().includes(value.toString().toLowerCase()));
        setCitySuggestions(filtered.slice(0, 8));
      } else {
        setCitySuggestions([]);
      }
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChildrenAgeChange = (index: number, value: number) => {
    const newAges = [...formData.childrenAges];
    newAges[index] = value;
    setFormData(prev => ({ ...prev, childrenAges: newAges }));
  };

  const addChild = () => {
    if (formData.children < 6) {
      setFormData(prev => ({
        ...prev,
        children: prev.children + 1,
        childrenAges: [...prev.childrenAges, 0]
      }));
    }
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children - 1,
      childrenAges: prev.childrenAges.filter((_, i) => i !== index)
    }));
  };

  // Novo estado para hotéis filtrados
  const [filteredHotels, setFilteredHotels] = useState<BookingProperty[]>([]);

  // Função para aplicar filtros locais
  const applyFilters = () => {
    let filtered = Array.isArray(hotels) ? hotels : [];
    // Filtro de preço
    filtered = filtered.filter(hotel => hotel.min_total_price >= priceRange.min && hotel.min_total_price <= priceRange.max);
    // Filtro de estrelas
    if (selectedStars.length > 0) {
      filtered = filtered.filter(hotel => selectedStars.includes(Math.floor(hotel.class)));
    }
    // Filtro de comodidades
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel => {
        return selectedAmenities.every(amenity => {
          if (amenity === 'Café da manhã') return hotel.hotel_include_breakfast === 1;
          if (amenity === 'Cancelamento grátis') return hotel.is_free_cancellable === 1;
          return true;
        });
      });
    }
    // Ordenação local
    if (sortBy === 'price') {
      filtered = [...filtered].sort((a, b) => a.min_total_price - b.min_total_price);
    } else if (sortBy === 'review_score') {
      filtered = [...filtered].sort((a, b) => b.review_score - a.review_score);
    } else if (sortBy === 'distance') {
      filtered = [...filtered].sort((a, b) => {
        // Tenta converter distance_to_cc para número (em km)
        const getDist = (h: any) => parseFloat((h.distance_to_cc || '0').replace(',', '.'));
        return getDist(a) - getDist(b);
      });
    } // 'popularity' mantém a ordem original
    setFilteredHotels(filtered);
  };

  // Atualizar filtros sempre que hotéis ou filtros mudarem
  useEffect(() => {
    applyFilters();
  }, [hotels, priceRange, selectedStars, selectedAmenities, sortBy]);

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
                Encontre seu hotel ideal
              </h1>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Compare preços, encontre as melhores localizações e reserve sua próxima estadia com total segurança
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-6xl mx-auto">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Para onde você vai?"
                      autoComplete="off"
                    />
                    {citySuggestions.length > 0 && (
                      <ul className="absolute z-20 left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {citySuggestions.map((cidade) => (
                          <li
                            key={cidade}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-600 text-blue-700 hover:text-white transition-colors"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, location: cidade }));
                              setCitySuggestions([]);
                            }}
                          >
                            {cidade}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Check-in Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hóspedes</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.guests}
                      onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'hóspede' : 'hóspedes'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Children Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Crianças</label>
                  {formData.children < 6 && (
                    <button
                      onClick={addChild}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Adicionar criança
                    </button>
                  )}
                </div>
                
                {formData.childrenAges.map((age, index) => (
                  <div key={index} className="flex items-center gap-4 mt-2">
                    <select
                      value={age}
                      onChange={(e) => handleChildrenAgeChange(index, parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Selecione a idade</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'ano' : 'anos'}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeChild(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Search Button */}
              <div className="mt-8 text-center">
                <button 
                  onClick={searchHotels}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Buscar Hotéis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <FiltrosSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedStars={selectedStars}
              setSelectedStars={setSelectedStars}
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
            />
            
            {/* Results */}
            <div className="lg:col-span-3">
              <ResultadosHeader
                loading={loading}
                quantidade={filteredHotels.length}
                location={formData.location}
                checkIn={formData.checkIn}
                checkOut={formData.checkOut}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
              
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
              ) : filteredHotels.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <p className="text-gray-600 mb-4">Nenhum hotel encontrado com os filtros selecionados.</p>
                  <button
                    onClick={() => {
                      setPriceRange({ min: 0, max: 10000 });
                      setSelectedStars([]);
                      setSelectedAmenities([]);
                      // Remover setSelectedDistricts e selectedDistricts
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard hotel={hotel} />
                  ))}
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

export default Hotels; 