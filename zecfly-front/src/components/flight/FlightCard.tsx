import { Flight } from '../../types';
import { Button } from '../ui/Button';

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
}

export const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={flight.logo}
            alt={flight.airline}
            className="w-12 h-12 object-contain"
          />
          <div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <span>{formatTime(flight.departure)}</span>
              <div className="flex items-center space-x-1 text-gray-400">
                <div className="w-4 h-px bg-gray-300"></div>
                <div className="w-2 h-2 border border-gray-300 rounded-full"></div>
                <div className="w-4 h-px bg-gray-300"></div>
              </div>
              <span>{formatTime(flight.arrival)}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span>{flight.origin}</span> → <span>{flight.destination}</span> •{' '}
              <span>{flight.duration}</span> •{' '}
              <span>{flight.stops === 0 ? 'Direto' : `${flight.stops} paradas`}</span>
            </div>
            <div className="text-sm text-gray-500">
              {flight.airline} • {flight.aircraft}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(flight.price)}
          </div>
          <div className="text-sm text-gray-600">por pessoa</div>
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => onSelect?.(flight)}
          >
            Ver detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}; 