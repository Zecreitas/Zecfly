import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { BookingProperty } from '../../services/booking';

interface HotelCardProps {
  hotel: BookingProperty;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all p-6 border border-gray-100 flex flex-col lg:flex-row gap-6">
      {/* Hotel Image */}
      <div className="lg:w-1/3">
        <img
          src={hotel.main_photo_url.replace(/square\d+/,'max500')}
          alt={hotel.name || 'Nome não disponível'}
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>
      {/* Hotel Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name || 'Nome não disponível'}</h3>
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
        </div>
        <div className="flex items-end justify-between mt-6">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: hotel.currencycode
              }).format(hotel.min_total_price)}
            </div>
            <div className="text-sm text-gray-500">por noite</div>
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
  );
};

export default HotelCard; 