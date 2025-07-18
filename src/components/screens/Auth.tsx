import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, Building2, Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
          {/* Left Side - Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-8">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <Plane className="w-8 h-8" />
                </div>
                <span className="text-3xl font-display font-bold">Zecfly</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
              </h1>
              <p className="text-lg opacity-90 mb-8">
                {isLogin
                  ? 'Entre para acessar suas reservas e continuar planejando suas viagens.'
                  : 'Junte-se a nós e comece a planejar suas próximas aventuras.'}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Melhores preços</h3>
                    <p className="text-sm opacity-80">Encontre as melhores ofertas em voos e hotéis</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Reservas seguras</h3>
                    <p className="text-sm opacity-80">Sistema de pagamento 100% seguro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Form */}
          <div className="lg:w-1/2 bg-surface rounded-3xl p-8 lg:p-12 shadow-xl">
            <div className="max-w-md mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-muted rounded-full p-1 flex gap-2">
                  <Button
                    variant={isLogin ? 'primary' : 'outline'}
                    className={`px-6 py-2 rounded-full font-medium`}
                    onClick={() => setIsLogin(true)}
                  >
                    Entrar
                  </Button>
                  <Button
                    variant={!isLogin ? 'primary' : 'outline'}
                    className={`px-6 py-2 rounded-full font-medium`}
                    onClick={() => setIsLogin(false)}
                  >
                    Cadastrar
                  </Button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <Input
                    label="Nome completo"
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Digite seu nome"
                    required
                  />
                )}
                <Input
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
                <Input
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="Digite sua senha"
                  required
                />
                {!isLogin && (
                  <Input
                    label="Confirmar senha"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                )}
                <Button
                  type="submit"
                  className="w-full text-lg py-4 mt-2"
                >
                  {isLogin ? 'Entrar' : 'Criar conta'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {isLogin && (
                  <p className="text-center text-dark/60">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-primary hover:underline font-medium"
                    >
                      Cadastre-se
                    </button>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth; 