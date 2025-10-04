import { apiService } from "./api";
import { User, UserProfile, LoginRequest, SignupRequest } from "@/types";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>("/auth/login", credentials);
  }

  async signup(userData: SignupRequest): Promise<User> {
    return apiService.post<User>("/auth/signup", userData);
  }

  async getCurrentUser(): Promise<UserProfile> {
    return apiService.get<UserProfile>("/auth/me");
  }

  async logout(): Promise<void> {
    // Since we're using JWT, logout is handled client-side
    // by removing the token from storage
    return Promise.resolve();
  }
}

export const authService = new AuthService();
