import axios, { AxiosInstance, AxiosResponse } from "axios";
import { store } from "@/store";
import { logout } from "@/store/slices/authSlice";

import Constants from "expo-constants";

const API_BASE_URL: string =
  (Constants.expoConfig?.extra?.API_BASE_URL as string) ||
  (Constants.manifest?.extra as any)?.API_BASE_URL ||
  "http://127.0.0.1:8000/api/v1";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          store.dispatch(logout());
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.get<{ status: string }>("/health");
  }
}

export const apiService = new ApiService();
