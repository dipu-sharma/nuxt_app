// src/composables/useAuth.ts
import { useApi } from './useApi'

export const useAuth = () => {
  const api = useApi()

  return {
    /** Login & Token Generation */
    async login(payload: any) {
      return await api('/api/auth/login', { method: 'POST', body: payload })
    },

    /** User Registration */
    async register(payload: any) {
      return await api('/api/auth/registration', { method: 'POST', body: payload })
    },

    /** Get Current User Profile */
    async getMe() {
      return await api('/api/auth/me', { method: 'GET' })
    },

    /** Email Verification — FIXED: was /api/verify */
    async verifyEmail(token: string) {
      return await api('/api/auth/verify-email', {
        method: 'POST',
        body: { token }
      })
    },

    /** Forgot Password — send OTP/reset link to email */
    async forgotPassword(email: string) {
      return await api('/api/auth/forgot-password', {
        method: 'POST',
        body: { email }
      })
    },

    /** Verify OTP (for forgot-password flow) */
    async verifyOTP(email: string, otp: string) {
      return await api('/api/auth/verify_otp', {
        method: 'POST',
        body: { email, otp }
      })
    },

    /** Reset Password using verified token */
    async resetPassword(token: string, new_password: string) {
      return await api('/api/auth/reset-password', {
        method: 'PUT',
        body: { token, new_password }
      })
    },

    /** Generate OTP */
    async generateOTP(email: string) {
      return await api('/api/home/otp-generate', {
        method: 'POST',
        body: { email }
      })
    },

    /** SSO Callback Login */
    async ssoLogin(provider: string, code: string, state: string) {
      return await api(`/api/sso/${provider}/callback`, {
        method: 'POST',
        body: { code, state }
      })
    },

    /** Logout */
    async logout() {
      return await api('/api/auth/logout', { method: 'POST' })
    },
  }
}
