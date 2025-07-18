/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',      // Azul principal
        secondary: '#00b8a9',    // Verde-água
        accent: '#ff9f43',       // Laranja para promoções
        background: '#f7f9fa',   // Fundo claro moderno
        surface: '#ffffff',      // Cartões e superfícies
        muted: '#e0e7ef',        // Cinza claro para bordas e divisores
        dark: '#22223b',         // Texto escuro
        success: '#4ade80',      // Verde sucesso
        error: '#f87171',        // Vermelho erro
        warning: '#facc15',      // Amarelo alerta
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(60,72,88,0.08)',
        'md': '0 4px 16px 0 rgba(60,72,88,0.12)',
        'xl': '0 8px 32px 0 rgba(60,72,88,0.16)',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}