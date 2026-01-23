import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { appReducer, initialState, AppAction, AppState } from './AppContext';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  fetchAlerts: () => Promise<void>;
  fetchAlertDetail: (id: number) => Promise<void>;
  fetchEvidences: (alertId: number) => Promise<void>;
  updateEvidence: (id: number, isReviewed: boolean) => Promise<void>;
  setAlertPage: (page: number) => void;
  setEvidencePage: (page: number) => void;
  setAlertFilters: (filters: Partial<AppState['alerts']['filters']>) => void;
  resetAlertFilters: () => void;
}

const AppContextValue = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const fetchAlerts = useCallback(async () => {
    const { api } = await import('../api');
    dispatch({ type: 'ALERTS_FETCH_START' });

    try {
      const response = await api.alerts.list({
        page: state.alerts.page,
        page_size: state.alerts.pageSize,
        severity: state.alerts.filters.severity.join(','),
        status: state.alerts.filters.status.join(','),
        search: state.alerts.filters.search || undefined
      });

      dispatch({
        type: 'ALERTS_FETCH_SUCCESS',
        payload: {
          items: response.results,
          count: response.count
        }
      });
    } catch (error) {
      dispatch({ type: 'ALERTS_FETCH_ERROR', payload: 'Failed to fetch alerts' });
    }
  }, [state.alerts.page, state.alerts.pageSize, state.alerts.filters]);

  const fetchAlertDetail = useCallback(async (id: number) => {
    const { api } = await import('../api');
    dispatch({ type: 'ALERT_DETAIL_FETCH_START' });

    try {
      const response = await api.alerts.get(id);
      dispatch({ type: 'ALERT_DETAIL_FETCH_SUCCESS', payload: response });
    } catch (error) {
      dispatch({ type: 'ALERT_DETAIL_FETCH_ERROR', payload: 'Failed to fetch alert detail' });
    }
  }, []);

  const fetchEvidences = useCallback(
    async (alertId: number) => {
      const { api } = await import('../api');
      dispatch({ type: 'EVIDENCES_FETCH_START' });

      try {
        const response = await api.alerts.evidences(alertId, {
          page: state.evidences.page,
          page_size: state.evidences.pageSize
        });

        dispatch({
          type: 'EVIDENCES_FETCH_SUCCESS',
          payload: {
            items: response.results,
            count: response.count
          }
        });
      } catch (error) {
        dispatch({ type: 'EVIDENCES_FETCH_ERROR', payload: 'Failed to fetch evidences' });
      }
    },
    [state.evidences.page, state.evidences.pageSize]
  );

  const updateEvidence = useCallback(
    async (id: number, isReviewed: boolean) => {
      const { api } = await import('../api');
      const originalEvidence = state.evidences.items.find((e) => e.id === id);

      if (!originalEvidence) return;

      dispatch({ type: 'EVIDENCE_UPDATE_OPTIMISTIC', payload: { id, is_reviewed: isReviewed } });

      try {
        const response = await api.evidences.update(id, { is_reviewed: isReviewed });
        dispatch({ type: 'EVIDENCE_UPDATE_SUCCESS', payload: response });
      } catch (_e) {
        dispatch({
          type: 'EVIDENCE_UPDATE_ROLLBACK',
          payload: { id, is_reviewed: originalEvidence.is_reviewed }
        });
        dispatch({ type: 'EVIDENCE_UPDATE_ERROR', payload: 'Failed to update evidence' });
      }
    },
    [state.evidences.items]
  );

  const setAlertPage = useCallback((page: number) => {
    dispatch({ type: 'ALERTS_SET_PAGE', payload: page });
  }, []);

  const setEvidencePage = useCallback((page: number) => {
    dispatch({ type: 'EVIDENCES_SET_PAGE', payload: page });
  }, []);

  const setAlertFilters = useCallback((filters: Partial<AppState['alerts']['filters']>) => {
    dispatch({ type: 'ALERTS_SET_FILTERS', payload: filters });
  }, []);

  const resetAlertFilters = useCallback(() => {
    dispatch({ type: 'ALERTS_RESET_FILTERS' });
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      fetchAlerts,
      fetchAlertDetail,
      fetchEvidences,
      updateEvidence,
      setAlertPage,
      setEvidencePage,
      setAlertFilters,
      resetAlertFilters
    }),
    [
      state,
      fetchAlerts,
      fetchAlertDetail,
      fetchEvidences,
      updateEvidence,
      setAlertPage,
      setEvidencePage,
      setAlertFilters,
      resetAlertFilters
    ]
  );

  return <AppContextValue.Provider value={value}>{children}</AppContextValue.Provider>;
}

export function useApp(): AppContextType {
  const context = useContext(AppContextValue);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
