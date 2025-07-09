import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, Building2, Clock, Star, Shield, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl mr-3">
                <Plane className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Zecfly
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/home" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Início</Link>
              <Link to="/flights" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Voos</Link>
              <Link to="/hotels" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Hotéis</Link>
              <Link to="/auth" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Entrar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <Link to="/home" className="block text-gray-700 hover:text-blue-600 font-medium">Início</Link>
              <Link to="/flights" className="block text-gray-700 hover:text-blue-600 font-medium">Voos</Link>
              <Link to="/hotels" className="block text-gray-700 hover:text-blue-600 font-medium">Hotéis</Link>
              <Link to="/auth" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full block text-center">
                Entrar
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Voe para onde 
              <span className="text-yellow-300 block">seus sonhos levam</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Compare preços, encontre as melhores rotas e reserve sua próxima aventura com total segurança
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/flights" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Buscar Voos
              </Link>
              <Link to="/hotels" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Buscar Hotéis
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Zecfly?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em viagens com preços competitivos e atendimento excepcional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Economia de Tempo</h3>
              <p className="text-gray-600">
                Compare preços e encontre as melhores ofertas em segundos, sem precisar visitar vários sites
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Melhores Preços</h3>
              <p className="text-gray-600">
                Garantimos os melhores preços do mercado com nossa tecnologia de comparação avançada
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Segurança Total</h3>
              <p className="text-gray-600">
                Sistema de pagamento 100% seguro e suporte 24/7 para qualquer necessidade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar sua aventura?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Crie sua conta gratuitamente e comece a planejar suas próximas viagens
          </p>
          <Link to="/auth" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
            Criar Conta
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-xl mr-3">
                  <Plane className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">Zecfly</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Sua plataforma confiável para encontrar e reservar os melhores voos e hotéis com os melhores preços.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Central de ajuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chat online</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Zecfly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 