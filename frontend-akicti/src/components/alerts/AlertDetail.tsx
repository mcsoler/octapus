import { useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppProvider';
import { Spinner } from '../ui/Spinner';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Pagination } from '../ui/Pagination';
import { Checkbox } from '../ui/Input';
import type { Severity, Status } from '../../types';

const severityStyles: Record<Severity, string> = {
  critical: 'bg-linear-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30',
  high: 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30',
  medium: 'bg-linear-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30',
  low: 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30'
};

const severityLabels: Record<Severity, string> = {
  critical: 'Critico',
  high: 'Alto',
  medium: 'Medio',
  low: 'Bajo'
};

const statusStyles: Record<Status, string> = {
  open: 'bg-primary-100 text-primary-700',
  investigating: 'bg-purple-100 text-purple-700',
  pending: 'bg-amber-100 text-amber-700',
  closed: 'bg-gray-100 text-gray-600'
};

const statusLabels: Record<Status, string> = {
  open: 'Abierto',
  investigating: 'Investigando',
  pending: 'Pendiente',
  closed: 'Cerrado'
};

export function AlertDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, fetchAlertDetail, fetchEvidences, updateEvidence, setEvidencePage } = useApp();
  const { alertDetail, evidences } = state;

  const alertId = parseInt(id || '0', 10);

  const totalPages = Math.ceil(evidences.count / evidences.pageSize);

  useEffect(() => {
    if (alertId > 0) {
      fetchAlertDetail(alertId);
      fetchEvidences(alertId);
    }
  }, [alertId, fetchAlertDetail, fetchEvidences]);

  useEffect(() => {
    if (alertId > 0) {
      fetchEvidences(alertId);
    }
  }, [evidences.page, alertId, fetchEvidences]);

  const handleEvidenceReview = useCallback(
    async (evidenceId: number, isReviewed: boolean) => {
      await updateEvidence(evidenceId, isReviewed);
    },
    [updateEvidence]
  );

  if (alertDetail.loading && !alertDetail.item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-gray-500 animate-pulse">Cargando alerta...</p>
      </div>
    );
  }

  if (alertDetail.error && !alertDetail.item) {
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
            <p className="font-semibold text-gray-800 mb-1">Error al cargar la alerta</p>
            <p className="text-sm text-gray-500 mb-4">{alertDetail.error}</p>
            <Button onClick={() => fetchAlertDetail(alertId)}>Reintentar</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!alertDetail.item) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Alerta no encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const alert = alertDetail.item;

  return (
    <div className="space-y-6">
      <Link
        to="/alerts"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors group"
      >
        <svg
          className="w-5 h-5 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Volver a Alertas</span>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{alert.title}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {alert.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${severityStyles[alert.severity]}`}>
                {severityLabels[alert.severity]}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${statusStyles[alert.status]}`}>
                {statusLabels[alert.status]}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Fecha de Creacion</p>
              </div>
              <p className="text-gray-800 font-semibold">
                {new Date(alert.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Hora</p>
              </div>
              <p className="text-gray-800 font-semibold">
                {new Date(alert.created_at).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Evidencias</p>
              </div>
              <p className="text-gray-800 font-semibold">{evidences.count}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Evidencias</h3>
                <p className="text-gray-500 text-sm">{evidences.count} registros encontrados</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {evidences.loading && evidences.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Spinner />
              <p className="text-gray-500 animate-pulse">Cargando evidencias...</p>
            </div>
          ) : evidences.error ? (
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
              <p className="font-semibold text-gray-800 mb-1">Error al cargar evidencias</p>
              <p className="text-sm text-gray-500 mb-4">{evidences.error}</p>
              <Button onClick={() => fetchEvidences(alertId)}>Reintentar</Button>
            </div>
          ) : evidences.items.length === 0 ? (
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
              <p className="text-gray-600 font-medium">No hay evidencias</p>
              <p className="text-gray-400 text-sm mt-1">Esta alerta no tiene evidencias asociadas</p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {evidences.items.map((evidence, index) => (
                  <div
                    key={evidence.id}
                    className="px-6 py-5 hover:bg-primary-50/30 transition-colors duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            {evidence.source}
                          </span>
                          {evidence.is_reviewed && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 text-xs font-medium text-green-700">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Revisado
                            </span>
                          )}
                        </div>
                        <p className="text-gray-800 leading-relaxed">{evidence.summary}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(evidence.created_at).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <label
                          htmlFor={`evidence-${evidence.id}`}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <Checkbox
                            id={`evidence-${evidence.id}`}
                            checked={evidence.is_reviewed}
                            onChange={async (e) => {
                              await handleEvidenceReview(evidence.id, e.target.checked);
                            }}
                            disabled={state.evidenceUpdate.loading}
                          />
                          <span className="text-sm text-gray-600 font-medium">Marcar revisado</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="px-6 py-5 border-t border-gray-100 bg-linear-to-r from-gray-50/30 to-transparent">
                  <Pagination
                    currentPage={evidences.page}
                    totalPages={totalPages}
                    totalCount={evidences.count}
                    pageSize={evidences.pageSize}
                    onPageChange={setEvidencePage}
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
