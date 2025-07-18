import axios from 'axios';

const bookingApi = axios.create({
  baseURL: 'https://booking-com15.p.rapidapi.com/api/v1',
  headers: {
    'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
    'x-rapidapi-key': import.meta.env.VITE_BOOKING_API_KEY
  }
});

export interface BookingSearchParams {
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

export interface BookingProperty {
  hotel_id: number;
  name: string;
  main_photo_url: string;
  review_score: number;
  review_score_word: string;
  review_nr: number;
  min_total_price: number;
  currencycode: string;
  address: {
    city: string;
    country: string;
    street: string;
    zip: string;
    district?: string;
  };
  distance_to_cc: string;
  distance_to_cc_formatted: string;
  hotel_include_breakfast: number;
  is_free_cancellable: number;
  class: number;
  class_is_estimated: number;
  preferred: number;
  preferred_plus: number;
  districts: string[];
  main_photo_id: number;
  timezone: string;
  url: string;
}

export interface BookingResponse {
  result: BookingProperty[];
  count: number;
  total_count_with_filters: number;
  unfiltered_count: number;
  search_id: string;
}

export const bookingService = {
  searchHotels: async (params: any) => {
    const response = await bookingApi.get('/hotels/searchHotels', { params });
    return response.data;
  },
  searchDestination: async (params: any) => {
    const response = await bookingApi.get('/hotels/searchDestination', { params });
    return response.data;
  }
}; 