import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { AuthManager } from '../auth/index.js';

export class ApiClient {
  private client: AxiosInstance;
  private auth: AuthManager;
  private apiUrl: string;
  private maxRetries: number;

  constructor(auth: AuthManager, apiUrl: string, maxRetries: number = 3, timeout: number = 30000) {
    this.auth = auth;
    this.apiUrl = apiUrl;
    this.maxRetries = maxRetries;

    this.client = axios.create({
      baseURL: apiUrl,
      timeout,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((config) => {
      const session = this.auth.getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };
        if (!originalRequest) return Promise.reject(error);

        const retryCount = originalRequest._retry || 0;

        if (error.response?.status === 401 && retryCount < this.maxRetries) {
          const refreshed = await this.auth.refreshToken(this.apiUrl);
          if (refreshed) {
            originalRequest._retry = retryCount + 1;
            const session = this.auth.getSession();
            if (session && originalRequest.headers) {
              (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${session.accessToken}`;
            }
            return this.client(originalRequest);
          }
        }

        if (retryCount < this.maxRetries && !error.response) {
          originalRequest._retry = retryCount + 1;
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return this.client(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, config);
    return res.data;
  }

  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, data, config);
    return res.data;
  }

  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, data, config);
    return res.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config);
    return res.data;
  }
}
