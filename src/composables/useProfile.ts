// src/composables/useProfile.ts
import { useApi } from './useApi'

export const useProfile = () => {
  const api = useApi()

  return {
    /** Get user profile */
    async getProfile() {
      return await api('/api/user/profile', { method: 'GET' })
    },

    /** Update user profile (text fields) */
    async updateProfile(payload: any) {
      return await api('/api/user/profile', { method: 'PUT', body: payload })
    },

    /** Get authenticated user details */
    async getAuthMe() {
      return await api('/api/auth/me', { method: 'GET' })
    },

    /** Upload profile image (multipart/form-data) */
    async uploadProfileImage(file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await api('/api/user/profile', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': undefined as any }, // let browser set boundary
      })
    },
    // Update profile image using PUT (multipart/form-data)
    async updateProfileImage(file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return await api('/api/user/profile', {
        method: 'PUT',
        body: formData,
        headers: { 'Content-Type': undefined as any }, // let browser set boundary
      })
    },

    /** Delete user profile */
    async deleteProfile() {
      return await api('/api/user/profile', { method: 'DELETE' })
    },

    /** Update user account details (email/username) */
    async updateMe(payload: any) {
      return await api('/api/user/me', { method: 'PUT', body: payload })
    },
    /** Patch user profile (partial update) */
    async patchProfile(payload: any) {
      return await api('/api/user/profile', { method: 'PATCH', body: payload })
    },

    /** Get business profile */
    async getBusinessProfile() {
      return await api('/api/business/profile', { method: 'GET' })
    },

    /** Update business profile */
    async updateBusinessProfile(payload: any) {
      return await api('/api/business/profile', { method: 'PUT', body: payload })
    },

    /** Get admin profile */
    async updateAdminProfile(payload: any) {
      return await api('/api/admin/profile', { method: 'PUT', body: payload })
    },
    
    /** Add a bank account */
    async addBankAccount(payload: any) {
      return await api('/api/user/add_bank_account', { method: 'POST', body: payload })
    },

    /** Basic user search */
    async searchUsers(payload: any) {
      return await api('/api/user/search', { method: 'POST', body: payload })
    },

    /** Advanced user search */
    async advancedUserSearch(payload: any) {
      return await api('/api/user/search/advanced', { method: 'POST', body: payload })
    },
  }
}
