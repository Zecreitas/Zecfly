import React from 'react';

interface FiltrosSidebarProps {
  priceRange: { min: number; max: number };
  setPriceRange: (cb: (prev: { min: number; max: number }) => { min: number; max: number }) => void;
  selectedStars: number[];
  setSelectedStars: React.Dispatch<React.SetStateAction<number[]>>;
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}

const FiltrosSidebar: React.FC<FiltrosSidebarProps> = ({ priceRange, setPriceRange, selectedStars, setSelectedStars, selectedAmenities, setSelectedAmenities }) => {
  return (
    <aside className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-gray-900">Filtros</h3>
        <span className="text-blue-500 font-bold text-lg">&#9881;</span>
      </div>
      {/* Preço */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800">Preço</h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            value={priceRange.min}
            onChange={e => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Mínimo"
            min="0"
            max={priceRange.max}
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={e => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
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
      {/* Estrelas */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4 text-gray-800">Classificação por Estrelas</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(stars => (
            <label key={stars} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="mr-3 w-4 h-4 text-primary rounded focus:ring-primary"
                checked={selectedStars.includes(stars)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedStars([...selectedStars, stars]);
                  } else {
                    setSelectedStars(selectedStars.filter(s => s !== stars));
                  }
                }}
              />
              <div className="flex items-center">
                {[...Array(stars)].map((_, i) => (
                  <span key={i} className="w-4 h-4 text-yellow-400">★</span>
                ))}
                <span className="ml-2 text-gray-700 group-hover:text-primary transition-colors">
                  {stars} {stars === 1 ? 'estrela' : 'estrelas'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Comodidades */}
      <div className="mb-8">
        <h4 className="font-semibold mb-4 text-gray-800">Comodidades</h4>
        <div className="space-y-3">
          {['Café da manhã', 'Cancelamento grátis'].map(amenity => (
            <label key={amenity} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="mr-3 w-4 h-4 text-primary rounded focus:ring-primary"
                checked={selectedAmenities.includes(amenity)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedAmenities([...selectedAmenities, amenity]);
                  } else {
                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                  }
                }}
              />
              <span className="text-gray-700 group-hover:text-primary transition-colors">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Limpar Filtros */}
      <button
        onClick={() => {
          setPriceRange(() => ({ min: 0, max: 10000 }));
          setSelectedStars([]);
          setSelectedAmenities([]);
        }}
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-primary/10 transition-colors mt-4"
      >
        Limpar Filtros
      </button>
    </aside>
  );
};

export default FiltrosSidebar; 