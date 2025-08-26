import { showToast } from '../utils/toastEmitter'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const API_KEY = import.meta.env.VITE_API_KEY as string | undefined

async function http<T>(input: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${input}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'x-bypass-token': API_KEY } : {}),
        ...(init?.headers || {}),
      },
      ...init,
    })
    if (!response.ok) {
      const text = await response.text()
      showToast(`Request failed: ${response.status}`, 'error')
      throw new Error(`HTTP ${response.status}: ${text}`)
    }
    showToast('Request successful', 'success')
    return response.json() as Promise<T>
  } catch (e) {
    if (init?.method !== 'GET') {
      showToast('Network error', 'error')
    }
    throw e
  }
}

function post<T>(input: string, body: unknown): Promise<T> {
  return http<T>(input, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export default {
  get: http,
  post,
} 