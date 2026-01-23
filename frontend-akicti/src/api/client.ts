import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const CACHE_TTL = 300000;

interface CachedRequest {
  data: unknown;
  timestamp: number;
}

class ApiClient {
  private client: AxiosInstance;
  private cache: Map<string, CachedRequest>;
  private pendingRequests: Map<string, Promise<AxiosResponse>>;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    this.cache = new Map();
    this.pendingRequests = new Map();

    this.setupInterceptors();
  }

  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.config.method === 'get') {
          const cacheKey = this.getCacheKey(response.config.url || '', response.config.params);
          this.cache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.subscribeTokenRefresh((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              this.logout();
              return Promise.reject(error);
            }

            const response = await this.client.post('/api/v1/auth/token/refresh/', {
              refresh: refreshToken
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access);
            if (refresh) {
              localStorage.setItem('refresh_token', refresh);
            }

            this.isRefreshing = false;
            this.onTokenRefreshed(access);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.client(originalRequest);
        }

        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private getCacheKey(url: string, params?: unknown): string {
    return `${url}${JSON.stringify(params || {})}`;
  }

  private isCacheValid(entry: CachedRequest): boolean {
    return Date.now() - entry.timestamp < CACHE_TTL;
  }

  private handleError(error: AxiosError): void {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { detail?: string };

      switch (status) {
        case 400:
          toast.error(data?.detail || 'Error en la solicitud');
          break;
        case 401:
          toast.error('No autorizado');
          break;
        case 403:
          toast.error('No tiene permisos para realizar esta acción');
          break;
        case 404:
          toast.error('Recurso no encontrado');
          break;
        case 429:
          toast.error('Demasiadas solicitudes. Intente nuevamente más tarde');
          break;
        case 500:
          toast.error('Error interno del servidor');
          break;
        default:
          toast.error('Ocurrió un error inesperado');
      }
    } else if (error.request) {
      toast.error('Error de conexión con el servidor');
    } else {
      toast.error('Error al procesar la solicitud');
    }
  }

  private logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  async get<T>(url: string, params?: unknown, useCache = true): Promise<T> {
    const cacheKey = this.getCacheKey(url, params);

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (this.isCacheValid(cached)) {
        return cached.data as T;
      }
      this.cache.delete(cacheKey);
    }

    if (this.pendingRequests.has(cacheKey)) {
      return (await this.pendingRequests.get(cacheKey)!) as T;
    }

    const requestPromise = this.client.get<T>(url, { params });
    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const response = await requestPromise;
      return response.data;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  cancelAllRequests(): void {
    this.pendingRequests.clear();
  }
}

export const apiClient = new ApiClient();
