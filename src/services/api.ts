
'use server';
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  user: {
    username: string;
    role: string;
  };
}

const simulateApiDelay = (ms: number = 1000) =>
  new Promise(resolve => setTimeout(resolve, ms));

class AuthAPI {
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      await simulateApiDelay();

      // Use server-side environment variables directly without NEXT_PUBLIC_ prefix
      const correctUsername = process.env.ADMIN_USERNAME;
      const correctPassword = process.env.ADMIN_PASSWORD;

      if (!correctUsername || !correctPassword) {
        console.error('Server configuration error: Admin credentials are not set in .env');
        return {
          success: false,
          error: 'Server configuration error. Please contact administrator.'
        };
      }

      if (credentials.username !== correctUsername || credentials.password !== correctPassword) {
        return {
          success: false,
          error: 'Invalid username or password'
        };
      }
      
      return {
        success: true,
        data: {
          user: {
            username: credentials.username,
            role: 'admin'
          }
        }
      };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        error: 'An error occurred during login. Please try again.'
      };
    }
  }
}

export const authAPI = new AuthAPI();
export default authAPI;
