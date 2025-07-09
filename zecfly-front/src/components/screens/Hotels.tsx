import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Building2, Star, Filter, ArrowRight, ArrowUpDown } from 'lucide-react';
import { bookingService, BookingProperty } from '../../services/booking';

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
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

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
      setHotels(response.result);
    } catch (err) {
      setError('Erro ao buscar hotéis. Por favor, tente novamente.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl mr-3">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Zecfly
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Início</Link>
              <Link to="/flights" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Voos</Link>
              <Link to="/hotels" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Hotéis</Link>
              <Link to="/auth" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Entrar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link to="/home" className="block text-gray-700 hover:text-blue-600 font-medium">Início</Link>
              <Link to="/flights" className="block text-gray-700 hover:text-blue-600 font-medium">Voos</Link>
              <Link to="/hotels" className="block text-gray-700 hover:text-blue-600 font-medium">Hotéis</Link>
              <Link to="/auth" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full block text-center">
                Entrar
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-16 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
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
                  <span className="text-blue-600 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(priceRange.min)} - {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(priceRange.max)}
                  </span>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mínimo"
                      min="0"
                      max={priceRange.max}
                    />
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Máximo"
                      min={priceRange.min}
                      max="10000"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>R$ 0</span>
                    <span>R$ 10.000</span>
                  </div>
                </div>
              </div>
              
              {/* Star Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-gray-800">Classificação por Estrelas</h4>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <label key={stars} className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedStars.includes(stars)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStars([...selectedStars, stars]);
                          } else {
                            setSelectedStars(selectedStars.filter(s => s !== stars));
                          }
                        }}
                      />
                      <div className="flex items-center">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                          {stars} {stars === 1 ? 'estrela' : 'estrelas'}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 text-gray-800">Comodidades</h4>
                <div className="space-y-3">
                  {[
                    'Wi-Fi gratuito',
                    'Piscina',
                    'Estacionamento',
                    'Café da manhã',
                    'Academia',
                    'Spa',
                    'Restaurante',
                    'Bar'
                  ].map(amenity => (
                    <label key={amenity} className="flex items-center group cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity]);
                          } else {
                            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                          }
                        }}
                      />
                      <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setPriceRange({ min: 0, max: 10000 });
                  setSelectedStars([]);
                  setSelectedAmenities([]);
                  setSelectedDistricts([]);
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
          
          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {loading ? 'Buscando hotéis...' : `${hotels.length} hotéis encontrados`}
                </h2>
                <p className="text-gray-600">
                  {formData.location} • {formData.checkIn} - {formData.checkOut}
                </p>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700"
                aria-label="Ordenar hotéis por"
              >
                <option value="popularity">Mais populares</option>
                <option value="price">Menor preço</option>
                <option value="review_score">Melhor avaliação</option>
                <option value="distance">Mais próximos</option>
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
            ) : hotels.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-600 mb-4">Nenhum hotel encontrado com os filtros selecionados.</p>
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 10000 });
                    setSelectedStars([]);
                    setSelectedAmenities([]);
                    setSelectedDistricts([]);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <div key={hotel.hotel_id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Hotel Image */}
                      <div className="lg:w-1/3">
                        <img
                          src={hotel.main_photo_url.replace(/square\d+/,'max500')}
                          alt={hotel.name}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(Math.floor(hotel.class))].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                              {hotel.class_is_estimated === 1 && (
                                <span className="ml-2 text-xs text-gray-500">(Classificação estimada)</span>
                              )}
                              {hotel.preferred === 1 && (
                                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Preferido</span>
                              )}
                              {hotel.preferred_plus === 1 && (
                                <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">Preferido Plus</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: hotel.currencycode
                              }).format(hotel.min_total_price)}
                            </div>
                            <div className="text-sm text-gray-500">por noite</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                          {hotel.hotel_include_breakfast === 1 && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                              Café da manhã incluído
                            </span>
                          )}
                          {hotel.is_free_cancellable === 1 && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              Cancelamento grátis
                            </span>
                          )}
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            {hotel.distance_to_cc_formatted} do centro
                          </span>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                              {hotel.review_score_word}
                            </div>
                            <span className="text-gray-600">
                              {hotel.review_nr} avaliações
                            </span>
                          </div>
                          <a
                            href={hotel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                          >
                            Ver detalhes
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl mr-3">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">Zecfly</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Sua plataforma confiável para encontrar e reservar os melhores hotéis com os melhores preços.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Central de ajuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat online</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Zecfly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hotels; 