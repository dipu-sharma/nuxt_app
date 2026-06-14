// src/composables/useAuth.ts
import { useApi } from './useApi'

export const useAuth = () => {
  const api = useApi()

  return {
    /**
     * Login & Token Generation
     * @param payload { username, password }
     */
    async login(payload: any) {
      return await api('/api/auth/login', {
        method: 'POST',
        body: payload
      })
    },

    /**
     * User Registration
     */
    async register(payload: any) {
      return await api('/api/auth/registration', {
        method: 'POST',
        body: payload
      })
    },

    /**
     * Get Current User Profile
     */
    async getMe() {
      return await api('/api/auth/me', {
        method: 'GET'
      })
    },

    /**
     * Email Verification
     */
    async verifyEmail(token: string) {
      return await api('/api/verify', {
        method: 'POST',
        body: { token }
      })
    },

    /**
     * SSO Callback Login
     */
    async ssoLogin(provider: string, code: string, state: string) {
      return await api(`/api/sso/${provider}/callback`, {
        method: 'POST',
        body: { code, state }
      })
    },

    /**
     * Set Cookie (Example helper)
     */
    async setCookie() {
      return await api('/api/set-cookie', { method: 'POST' })
    },

    /**
     * Get Cookie (Example helper)
     */
    async getCookie() {
      return await api('/api/get-cookie', { method: 'GET' })
    }
  }
}
