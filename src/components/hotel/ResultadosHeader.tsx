import React from 'react';

interface ResultadosHeaderProps {
  loading: boolean;
  quantidade: number;
  location: string;
  checkIn: string;
  checkOut: string;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const ResultadosHeader: React.FC<ResultadosHeaderProps> = ({ loading, quantidade, location, checkIn, checkOut, sortBy, setSortBy }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? 'Buscando hotéis...' : `${quantidade} hotéis encontrados`}
        </h2>
        <p className="text-gray-600">
          {location} • {checkIn} - {checkOut}
        </p>
      </div>
      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary text-gray-700 bg-white shadow-sm hover:border-primary transition-all"
        aria-label="Ordenar hotéis por"
      >
        <option value="popularity">Mais populares</option>
        <option value="price">Menor preço</option>
        <option value="review_score">Melhor avaliação</option>
        <option value="distance">Mais próximos</option>
      </select>
    </div>
  );
};

export default ResultadosHeader; 