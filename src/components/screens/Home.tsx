import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Building2, Clock, Star, Shield, ArrowRight } from 'lucide-react';
import Header from '../common/Header';
import Footer from '../common/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Voe para onde <span className="text-warning block">seus sonhos levam</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              Compare preços, encontre as melhores rotas e reserve sua próxima aventura com total segurança
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/flights" className="bg-surface text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-soft hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Buscar Voos
              </Link>
              <Link to="/hotels" className="bg-surface text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-soft hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Buscar Hotéis
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-dark mb-4">
              Por que escolher a Zecfly?
            </h2>
            <p className="text-xl text-dark/60 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em viagens com preços competitivos e atendimento excepcional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-2xl shadow-soft border border-muted hover:shadow-xl transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Economia de Tempo</h3>
              <p className="text-dark/60">
                Compare preços e encontre as melhores ofertas em segundos, sem precisar visitar vários sites
              </p>
            </div>
            <div className="bg-surface p-8 rounded-2xl shadow-soft border border-muted hover:shadow-xl transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Melhores Preços</h3>
              <p className="text-dark/60">
                Garantimos os melhores preços do mercado com nossa tecnologia de comparação avançada
              </p>
            </div>
            <div className="bg-surface p-8 rounded-2xl shadow-soft border border-muted hover:shadow-xl transition-all">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-3">Segurança Total</h3>
              <p className="text-dark/60">
                Sistema de pagamento 100% seguro e suporte 24/7 para qualquer necessidade
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Pronto para começar sua aventura?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Crie sua conta gratuitamente e comece a planejar suas próximas viagens
          </p>
          <Link to="/auth" className="bg-surface text-primary px-8 py-4 rounded-xl font-semibold text-lg shadow-soft hover:shadow-xl transition-all transform hover:scale-105 inline-flex items-center gap-2">
            Criar Conta
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home; 