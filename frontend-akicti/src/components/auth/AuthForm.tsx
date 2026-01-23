import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authLoginSchema, authRegisterSchema } from '../../types';

type AuthMode = 'login' | 'register';

export function AuthForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { api } = await import('../../api');

      if (mode === 'register') {
        const registerData = authRegisterSchema.parse(formData);
        const response = await api.auth.register(registerData);
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      } else {
        const loginData = authLoginSchema.parse(formData);
        const response = await api.auth.login(loginData);
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
      }

      navigate('/alerts');
    } catch (err) {
      console.error('Auth error:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err.response as { data?: { detail?: string } };
        const errorData = errorResponse.data;
        setError(errorData?.detail || 'Error de autenticacion. Por favor intente nuevamente.');
      } else {
        setError('Error de autenticacion. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-lg shadow-primary-500/30 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text">AKICTI</h1>
          <p className="text-gray-500 mt-2">Sistema de Gestion de Alertas</p>
        </div>

        <Card className="animate-slide-up">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
              </h2>
              <p className="text-gray-500 mt-1 text-sm">
                {mode === 'login'
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Completa el formulario para registrarte'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Electronico
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nombre
                      </label>
                      <Input
                        id="first_name"
                        name="first_name"
                        type="text"
                        placeholder="Juan"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Apellido
                      </label>
                      <Input
                        id="last_name"
                        name="last_name"
                        type="text"
                        placeholder="Perez"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuario
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  placeholder="nombre_usuario"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contrasena
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="password_confirm"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirmar Contrasena
                  </label>
                  <Input
                    id="password_confirm"
                    name="password_confirm"
                    type="password"
                    required
                    placeholder="********"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" loading={loading}>
                {mode === 'login' ? 'Iniciar Sesion' : 'Crear Cuenta'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                {mode === 'login' ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError(null);
                  }}
                  disabled={loading}
                  className="ml-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {mode === 'login' ? 'Registrate aqui' : 'Inicia sesion'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
