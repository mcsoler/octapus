import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/client';

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      import('../../api').then(({ api }) => {
        api.auth.logout(refreshToken).catch(() => {});
      });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    apiClient.clearCache();
    navigate('/login');
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 via-white to-accent-50">
      {!isLoginPage && isAuthenticated && (
        <header className="sticky top-0 z-50 glass-card border-b border-primary-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">AKICTI</h1>
                  <p className="text-xs text-gray-500">Alert Management System</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-1">
                <a
                  href="/alerts"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname.startsWith('/alerts')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Alertas
                </a>
              </nav>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 border border-primary-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-primary-700">Conectado</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                           text-gray-600 hover:text-red-600 hover:bg-red-50
                           transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Cerrar Sesion</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">{children}</div>
      </main>

      {!isLoginPage && (
        <footer className="border-t border-gray-100 bg-white/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                AKICTI Alert Management System
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
