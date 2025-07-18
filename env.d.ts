/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMADEUS_CLIENT_ID: string
  readonly VITE_AMADEUS_CLIENT_SECRET: string
  readonly VITE_BOOKING_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 