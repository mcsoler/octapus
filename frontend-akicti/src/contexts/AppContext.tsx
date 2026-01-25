import type { Alert, AlertDetail, Evidence } from '../types';
import type { Severity, Status } from '../types';

export type AppState = {
  alerts: {
    items: Alert[];
    count: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
    filters: {
      severity: Severity[];
      status: Status[];
      search: string;
    };
  };
  alertDetail: {
    item: AlertDetail | null;
    loading: boolean;
    error: string | null;
  };
  evidences: {
    items: Evidence[];
    count: number;
    page: number;
    pageSize: number;
    loading: boolean;
    error: string | null;
  };
  evidenceUpdate: {
    loading: boolean;
    error: string | null;
  };
};

export type AppAction =
  | { type: 'ALERTS_FETCH_START' }
  | { type: 'ALERTS_FETCH_SUCCESS'; payload: { items: Alert[]; count: number } }
  | { type: 'ALERTS_FETCH_ERROR'; payload: string }
  | { type: 'ALERTS_SET_PAGE'; payload: number }
  | { type: 'ALERTS_SET_FILTERS'; payload: Partial<AppState['alerts']['filters']> }
  | { type: 'ALERTS_RESET_FILTERS' }
  | { type: 'ALERT_DETAIL_FETCH_START' }
  | { type: 'ALERT_DETAIL_FETCH_SUCCESS'; payload: AlertDetail }
  | { type: 'ALERT_DETAIL_FETCH_ERROR'; payload: string }
  | { type: 'EVIDENCES_FETCH_START' }
  | { type: 'EVIDENCES_FETCH_SUCCESS'; payload: { items: Evidence[]; count: number } }
  | { type: 'EVIDENCES_FETCH_ERROR'; payload: string }
  | { type: 'EVIDENCES_SET_PAGE'; payload: number }
  | { type: 'EVIDENCE_UPDATE_START' }
  | { type: 'EVIDENCE_UPDATE_SUCCESS'; payload: Evidence }
  | { type: 'EVIDENCE_UPDATE_ERROR'; payload: string }
  | { type: 'EVIDENCE_UPDATE_OPTIMISTIC'; payload: { id: number; is_reviewed: boolean } }
  | { type: 'EVIDENCE_UPDATE_ROLLBACK'; payload: { id: number; is_reviewed: boolean } }
  | { type: 'RESET_STATE' };

export const initialState: AppState = {
  alerts: {
    items: [],
    count: 0,
    page: 1,
    pageSize: 15,
    loading: false,
    error: null,
    filters: {
      severity: [],
      status: [],
      search: ''
    }
  },
  alertDetail: {
    item: null,
    loading: false,
    error: null
  },
  evidences: {
    items: [],
    count: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    error: null
  },
  evidenceUpdate: {
    loading: false,
    error: null
  }
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ALERTS_FETCH_START':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          loading: true,
          error: null
        }
      };

    case 'ALERTS_FETCH_SUCCESS':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          items: action.payload.items,
          count: action.payload.count,
          loading: false,
          error: null
        }
      };

    case 'ALERTS_FETCH_ERROR':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          loading: false,
          error: action.payload
        }
      };

    case 'ALERTS_SET_PAGE':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          page: action.payload
        }
      };

    case 'ALERTS_SET_FILTERS':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          filters: {
            ...state.alerts.filters,
            ...action.payload
          },
          page: 1
        }
      };

    case 'ALERTS_RESET_FILTERS':
      return {
        ...state,
        alerts: {
          ...state.alerts,
          filters: {
            severity: [],
            status: [],
            search: ''
          },
          page: 1
        }
      };

    case 'ALERT_DETAIL_FETCH_START':
      return {
        ...state,
        alertDetail: {
          ...state.alertDetail,
          loading: true,
          error: null
        }
      };

    case 'ALERT_DETAIL_FETCH_SUCCESS':
      return {
        ...state,
        alertDetail: {
          item: action.payload,
          loading: false,
          error: null
        }
      };

    case 'ALERT_DETAIL_FETCH_ERROR':
      return {
        ...state,
        alertDetail: {
          ...state.alertDetail,
          loading: false,
          error: action.payload
        }
      };

    case 'EVIDENCES_FETCH_START':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          loading: true,
          error: null
        }
      };

    case 'EVIDENCES_FETCH_SUCCESS':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          items: action.payload.items,
          count: action.payload.count,
          loading: false,
          error: null
        }
      };

    case 'EVIDENCES_FETCH_ERROR':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          loading: false,
          error: action.payload
        }
      };

    case 'EVIDENCES_SET_PAGE':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          page: action.payload
        }
      };

    case 'EVIDENCE_UPDATE_START':
      return {
        ...state,
        evidenceUpdate: {
          loading: true,
          error: null
        }
      };

    case 'EVIDENCE_UPDATE_SUCCESS':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          items: state.evidences.items.map((evidence) =>
            evidence.id === action.payload.id ? action.payload : evidence
          )
        },
        evidenceUpdate: {
          loading: false,
          error: null
        }
      };

    case 'EVIDENCE_UPDATE_ERROR':
      return {
        ...state,
        evidenceUpdate: {
          loading: false,
          error: action.payload
        }
      };

    case 'EVIDENCE_UPDATE_OPTIMISTIC':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          items: state.evidences.items.map((evidence) =>
            evidence.id === action.payload.id
              ? { ...evidence, is_reviewed: action.payload.is_reviewed }
              : evidence
          )
        }
      };

    case 'EVIDENCE_UPDATE_ROLLBACK':
      return {
        ...state,
        evidences: {
          ...state.evidences,
          items: state.evidences.items.map((evidence) =>
            evidence.id === action.payload.id
              ? { ...evidence, is_reviewed: action.payload.is_reviewed }
              : evidence
          )
        }
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
};
