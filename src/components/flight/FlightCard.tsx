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
    <div className="bg-surface border border-muted rounded-2xl p-6 shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <img
          src={flight.logo}
          alt={flight.airline}
          className="w-12 h-12 object-contain rounded-xl shadow-md bg-white"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-lg font-semibold font-display">
            <span>{formatTime(flight.departure)}</span>
            <div className="flex items-center gap-1 text-muted">
              <div className="w-4 h-px bg-muted"></div>
              <div className="w-2 h-2 border border-muted rounded-full"></div>
              <div className="w-4 h-px bg-muted"></div>
            </div>
            <span>{formatTime(flight.arrival)}</span>
          </div>
          <div className="text-sm text-dark/60 truncate">
            <span>{flight.origin}</span> → <span>{flight.destination}</span> • <span>{flight.duration}</span> • <span>{flight.stops === 0 ? 'Direto' : `${flight.stops} paradas`}</span>
          </div>
          <div className="text-sm text-dark/40 truncate">
            {flight.airline} • {flight.aircraft}
          </div>
        </div>
      </div>
      <div className="text-right min-w-[140px]">
        <div className="text-2xl font-bold text-primary font-display">
          {formatPrice(flight.price)}
        </div>
        <div className="text-sm text-dark/60">por pessoa</div>
        {flight.bookingUrl ? (
          <a
            href={flight.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 w-full md:w-auto"
          >
            <Button variant="primary" className="w-full md:w-auto">
              Ver detalhes
            </Button>
          </a>
        ) : (
          <Button
            variant="primary"
            className="mt-2 w-full md:w-auto"
            onClick={() => onSelect?.(flight)}
          >
            Ver detalhes
          </Button>
        )}
      </div>
    </div>
  );
}; 