import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SearchFilters } from '../../types';

export const SearchForm = () => {
  const [searchType, setSearchType] = useState<'flight' | 'hotel'>('flight');
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'flight',
    passengers: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search filters:', filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            searchType === 'flight'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-white'
          }`}
          onClick={() => setSearchType('flight')}
        >
          Voos
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md ${
            searchType === 'hotel'
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-white'
          }`}
          onClick={() => setSearchType('hotel')}
        >
          Hotéis
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {searchType === 'flight' ? (
            <>
              <div className="md:col-span-1">
                <Input
                  label="Origem"
                  name="origin"
                  placeholder="Cidade ou aeroporto"
                  value={filters.origin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="md:col-span-1">
                <Input
                  label="Destino"
                  name="destination"
                  placeholder="Cidade ou aeroporto"
                  value={filters.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Ida"
                  type="date"
                  name="departureDate"
                  value={filters.departureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Volta"
                  type="date"
                  name="returnDate"
                  value={filters.returnDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passageiros
                </label>
                <select
                  name="passengers"
                  value={filters.passengers}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    passengers: Number(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>1 Passageiro</option>
                  <option value={2}>2 Passageiros</option>
                  <option value={3}>3 Passageiros</option>
                  <option value={4}>4 Passageiros</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <Input
                  label="Destino"
                  name="destination"
                  placeholder="Cidade, hotel ou região"
                  value={filters.destination}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Check-in"
                  type="date"
                  name="departureDate"
                  value={filters.departureDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Check-out"
                  type="date"
                  name="returnDate"
                  value={filters.returnDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hóspedes
                </label>
                <select
                  name="passengers"
                  value={filters.passengers}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    passengers: Number(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>1 Hóspede</option>
                  <option value={2}>2 Hóspedes</option>
                  <option value={3}>3 Hóspedes</option>
                  <option value={4}>4 Hóspedes</option>
                </select>
              </div>
            </>
          )}
        </div>

        <Button
          type="submit"
          className="w-full md:w-auto mt-6 bg-accent text-white hover:bg-orange-600"
        >
          {searchType === 'flight' ? 'Buscar Voos' : 'Buscar Hotéis'}
        </Button>
      </form>
    </div>
  );
}; 