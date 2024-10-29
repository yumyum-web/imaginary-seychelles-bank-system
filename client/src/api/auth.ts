// src/api/auth.ts
import api from "./api";

interface LoginResponse {
  token: string;
  user: {
    levels: string[];
    customer?: {
      id: number;
      type: string;
    };
    employee?: {
      id: number;
    };
  };
}

interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login to the system.
 * @param {LoginRequest} credentials - The username and password.
 * @returns {Promise<LoginResponse>} - The response containing token and user information.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle error appropriately, or rethrow for further handling
    throw error.response?.data || new Error("Login failed");
  }
}

export async function logout(): Promise<void> {
  try {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userLevels");
    window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle error appropriately, or rethrow for further handling
    throw error.response?.data || new Error("Logout failed");
  }
}
