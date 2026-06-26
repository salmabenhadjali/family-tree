const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ft_token');
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(!(init.body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    invite: (data: { name: string; email: string }) =>
      request('/auth/invite', { method: 'POST', body: JSON.stringify(data) }),
    acceptInvite: (data: { token: string; password: string }) =>
      request('/auth/accept-invite', { method: 'POST', body: JSON.stringify(data) }),
  },
  people: {
    getAll: () => request('/people'),
    getOne: (id: string) => request(`/people/${id}`),
    search: (q: string) => request(`/people/search?q=${encodeURIComponent(q)}`),
    create: (form: FormData) => request('/people', { method: 'POST', body: form }),
    update: (id: string, form: FormData) => request(`/people/${id}`, { method: 'PATCH', body: form }),
    delete: (id: string) => request(`/people/${id}`, { method: 'DELETE' }),
  },
};
