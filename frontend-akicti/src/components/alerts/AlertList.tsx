import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppProvider';
import { useDebounce } from '../../hooks/useDebounce';
import { Spinner } from '../ui/Spinner';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import type { Severity, Status } from '../../types';

const severityOptions: { value: Severity; label: string; color: string }[] = [
  { value: 'critical', label: 'Critico', color: 'from-red-500 to-red-600' },
  { value: 'high', label: 'Alto', color: 'from-orange-500 to-orange-600' },
  { value: 'medium', label: 'Medio', color: 'from-yellow-500 to-yellow-600' },
  { value: 'low', label: 'Bajo', color: 'from-green-500 to-green-600' }
];

const statusOptions: { value: Status; label: string }[] = [
  { value: 'open', label: 'Abierto' },
  { value: 'investigating', label: 'Investigando' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'closed', label: 'Cerrado' }
];

const severityStyles: Record<Severity, string> = {
  critical: 'bg-linear-to-r from-red-500 to-red-600 text-white shadow-sm shadow-red-500/30',
  high: 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-sm shadow-orange-500/30',
  medium: 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-sm shadow-yellow-500/30',
  low: 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-sm shadow-green-500/30'
};

const statusStyles: Record<Status, string> = {
  open: 'bg-primary-100 text-primary-700 border border-primary-200',
  investigating: 'bg-purple-100 text-purple-700 border border-purple-200',
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  closed: 'bg-gray-100 text-gray-600 border border-gray-200'
};

export function AlertList() {
  const { state, fetchAlerts, setAlertPage, setAlertFilters, resetAlertFilters } = useApp();
  const { alerts } = state;

  const totalPages = Math.ceil(alerts.count / alerts.pageSize);

  const debouncedFetch = useDebounce(fetchAlerts, 300);

  useEffect(() => {
    debouncedFetch();
  }, [state.alerts.page, state.alerts.filters]);

  const handleSearchChange = (value: string) => {
    setAlertFilters({ search: value });
  };

  const handleSeverityToggle = (severity: Severity) => {
    const newSeverities = alerts.filters.severity.includes(severity)
      ? alerts.filters.severity.filter((s) => s !== severity)
      : [...alerts.filters.severity, severity];
    setAlertFilters({ severity: newSeverities });
  };

  const handleStatusToggle = (status: Status) => {
    const newStatuses = alerts.filters.status.includes(status)
      ? alerts.filters.status.filter((s) => s !== status)
      : [...alerts.filters.status, status];
    setAlertFilters({ status: newStatuses });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      (alerts.filters?.severity?.length ?? 0) > 0 ||
      (alerts.filters?.status?.length ?? 0) > 0 ||
      (alerts.filters?.search?.length ?? 0) > 0
    );
  }, [alerts.filters]);

  if (alerts.loading && (alerts.items?.length ?? 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 animate-pulse">Cargando alertas...</p>
      </div>
    );
  }

  if (alerts.error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="font-semibold text-gray-800 mb-1">Error al cargar alertas</p>
            <p className="text-sm text-gray-500 mb-4">{alerts.error}</p>
            <Button onClick={fetchAlerts}>Reintentar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Alertas</h2>
              <p className="text-gray-500 text-sm mt-1">
                {alerts.count > 0 ? `${alerts.count} alertas encontradas` : 'Sin alertas'}
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetAlertFilters} disabled={alerts.loading}>
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Buscar por titulo..."
                value={alerts.filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={alerts.loading}
                className="pl-12"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Severidad</p>
                <div className="flex flex-wrap gap-2">
                  {severityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSeverityToggle(option.value)}
                      disabled={alerts.loading}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        alerts.filters.severity.includes(option.value)
                          ? `bg-linear-to-r ${option.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Estado</p>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusToggle(option.value)}
                      disabled={alerts.loading}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        alerts.filters.status.includes(option.value)
                          ? 'bg-linear-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {(alerts.items?.length ?? 0) === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">
                {hasActiveFilters ? 'No hay alertas que coincidan con los filtros' : 'No hay alertas'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {hasActiveFilters ? 'Intenta ajustar los filtros de busqueda' : 'Las alertas apareceran aqui'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-gray-50 to-transparent border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Titulo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Severidad
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(alerts.items ?? []).map((alert, index) => (
                      <tr
                        key={alert.id}
                        className="hover:bg-primary-50/50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/alerts/${alert.id}`}
                            className="font-medium text-gray-800 hover:text-primary-600 transition-colors"
                          >
                            {alert.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg ${severityStyles[alert.severity]}`}
                          >
                            {alert.severity === 'critical' ? 'Critico' :
                             alert.severity === 'high' ? 'Alto' :
                             alert.severity === 'medium' ? 'Medio' : 'Bajo'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${statusStyles[alert.status]}`}
                          >
                            {alert.status === 'open' ? 'Abierto' :
                             alert.status === 'investigating' ? 'Investigando' :
                             alert.status === 'pending' ? 'Pendiente' : 'Cerrado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-gray-100 bg-linear-to-r from-gray-50/30 to-transparent">
                  <Pagination
                    currentPage={alerts.page}
                    totalPages={totalPages}
                    totalCount={alerts.count}
                    pageSize={alerts.pageSize}
                    onPageChange={setAlertPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
