export interface Flight {
  id: string;
  airline: string;
  logo: string;
  departure: string;
  arrival: string;
  origin: string;
  destination: string;
  price: number;
  stops: number;
  duration: string;
  aircraft: string;
  bookingUrl?: string; // URL para redirecionamento externo
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  images: string[];
  amenities: string[];
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
}

export interface SearchFilters {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  type: 'flight' | 'hotel';
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  error?: string;
  required?: boolean;
} 