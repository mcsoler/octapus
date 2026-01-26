import { apiClient } from './client';
import type {
  Alert,
  AlertDetail,
  PaginatedAlertsResponse,
  PaginatedEvidencesResponse,
  Evidence,
  AuthLogin,
  AuthRegister,
  AuthResponse,
  CreateAlert,
  UpdateEvidence,
  UpdateAlert
} from '../types';

export const api = {
  auth: {
    register: (data: AuthRegister): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/v1/auth/register/', data);
    },

    login: (data: AuthLogin): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/v1/auth/login/', data);
    },

    logout: (refresh: string): Promise<{ detail: string }> => {
      return apiClient.post<{ detail: string }>('/api/v1/auth/logout/', { refresh });
    },

    refreshToken: (refresh: string): Promise<AuthResponse> => {
      return apiClient.post<AuthResponse>('/api/v1/auth/token/refresh/', { refresh });
    }
  },

  alerts: {
    list: (params?: {
      page?: number;
      page_size?: number;
      severity?: string;
      status?: string;
      search?: string;
    }): Promise<PaginatedAlertsResponse> => {
      return apiClient.get<PaginatedAlertsResponse>('/api/v1/alerts/', params);
    },

    get: (id: number): Promise<AlertDetail> => {
      return apiClient.get<AlertDetail>(`/api/v1/alerts/${id}/`, undefined, false);
    },

    create: (data: CreateAlert): Promise<Alert> => {
      return apiClient.post<Alert>('/api/v1/alerts/', data);
    },

    update: (id: number, data: UpdateAlert): Promise<AlertDetail> => {
      return apiClient.patch<AlertDetail>(`/api/v1/alerts/${id}/`, data);
    },

    evidences: (
      id: number,
      params?: { page?: number; page_size?: number }
    ): Promise<PaginatedEvidencesResponse> => {
      return apiClient.get<PaginatedEvidencesResponse>(
        `/api/v1/alerts/${id}/evidences/`,
        params,
        false
      );
    }
  },

  evidences: {
    update: (id: number, data: UpdateEvidence): Promise<Evidence> => {
      return apiClient.patch<Evidence>(`/api/v1/evidences/${id}/`, data);
    }
  }
};
