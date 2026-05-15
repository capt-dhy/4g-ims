const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://fourg-ims.onrender.com'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('ims_token')
}

export function setToken(token: string) {
  localStorage.setItem('ims_token', token)
  // Set cookie for middleware access
  if (typeof document !== 'undefined') {
    document.cookie = `ims_token=${token}; path=/; max-age=604800; SameSite=Lax`
  }
}

export function setUser(user: any) {
  localStorage.setItem('ims_user', JSON.stringify(user))
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('ims_user')
  return u ? JSON.parse(u) : null
}

export function clearAuth() {
  localStorage.removeItem('ims_token')
  localStorage.removeItem('ims_user')
  // Clear cookie
  if (typeof document !== 'undefined') {
    document.cookie = 'ims_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `API error: ${response.status}`)
  }

  return data
}

export async function apiUpload(path: string, file: File) {
  const token = getToken()
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `Upload error: ${response.status}`)
  }

  return data
}
