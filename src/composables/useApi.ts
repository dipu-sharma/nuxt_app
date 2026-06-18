// src/composables/useApi.ts
import { toast } from 'vue3-toastify'
import { handleAxiosError } from '@/utils/ErrorHandle/error'

/**
 * Read a cookie value directly from document.cookie (always fresh, client-only).
 * Falls back to null on server.
 */
const getRawCookie = (name: string): string | null => {
  if (!process.client) return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = (config.public.API_BASE_URL || 'http://192.168.157.128:8001') as string

  // Nuxt reactive cookie ref — works on server and initially on client
  const tokenCookie = useCookie('auth_token')

  return $fetch.create({
    baseURL,
    async onRequest({ options }) {
      // Priority: Nuxt cookie ref → document.cookie (raw, always fresh) → nothing
      const token = tokenCookie.value || getRawCookie('auth_token')

      const headers = {
        Accept: 'application/json',
        ...(options.headers as Record<string, string> || {}),
      }

      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      options.headers = headers
    },
    async onResponseError({ response }) {
      const message =
        (response._data as any)?.message ||
        (response._data as any)?.detail ||
        'An error occurred'

      if (response.status === 401) {
        tokenCookie.value = null
        navigateTo('/login')
        return
      }

      if (response.status !== 403) {
        handleAxiosError(response.status, message, toast)
      }
    }
  })
}
