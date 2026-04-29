const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  placementPercentage: number;
  courses: string;
  type: string;
  established?: number;
  website?: string;
}

export interface PaginatedResponse {
  colleges: College[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface User {
  id: string;
  email: string;
  provider: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export const api = {
  // Auth
  async register(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async googleAuth(email: string, name?: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Google auth failed');
    }
    return res.json();
  },

  // Colleges
  async getColleges(params: Record<string, string> = {}): Promise<PaginatedResponse> {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/colleges?${query}`);
    if (!res.ok) throw new Error('Failed to fetch colleges');
    return res.json();
  },

  async getCollege(id: string): Promise<College> {
    const res = await fetch(`${API_URL}/colleges/${id}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error('College not found');
      throw new Error('Failed to fetch college');
    }
    return res.json();
  },

  async getLocations(): Promise<string[]> {
    const res = await fetch(`${API_URL}/colleges/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  // Saved
  async saveCollege(collegeId: string, token: string) {
    const res = await fetch(`${API_URL}/saved`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ collegeId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save college');
    }
    return res.json();
  },

  async getSaved(token: string) {
    const res = await fetch(`${API_URL}/saved`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch saved colleges');
    return res.json();
  },

  async unsaveCollege(collegeId: string, token: string) {
    const res = await fetch(`${API_URL}/saved/${collegeId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to unsave college');
    return res.json();
  },

  // Compare
  async compareColleges(ids: string[]): Promise<{ colleges: College[] }> {
    const res = await fetch(`${API_URL}/compare`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to compare colleges');
    return res.json();
  },
};
