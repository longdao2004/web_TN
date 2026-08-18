const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('SERVER_ERROR');
    }

    return res.json();
  },
};
