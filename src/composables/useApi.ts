// src/composables/useApi.ts
import { toast } from 'vue3-toastify'
import { handleAxiosError } from '@/utils/ErrorHandle/error'

export const useApi = () => {
  const token = useCookie('auth_token')
  const config = useRuntimeConfig()
  const baseURL = config.public.API_BASE_URL || 'http://localhost:8001'

  return $fetch.create({
    baseURL: baseURL as string,
    async onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`
        }
      }
      // Standard headers
      options.headers = {
        ...options.headers,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    },
    async onResponseError({ response }) {
      // Global error handling using existing utility
      handleAxiosError(response.status, (response._data as any)?.message, toast)
    }
  })
}
