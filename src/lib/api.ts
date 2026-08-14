const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errorType?: string;
  token?: string;
  user?: any;
  [key: string]: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred while processing your request',
        errorType: data.errorType || 'API_ERROR',
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error or backend unreachable',
      errorType: 'NETWORK_ERROR',
    };
  }
}
