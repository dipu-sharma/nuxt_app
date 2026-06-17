// src/composables/useAdminUsers.ts
import { useApi } from './useApi'

export const useAdminUsers = () => {
  const api = useApi()

  return {
    // User list with optional filters
    async getUserList(payload: any = {}) {
      return await api('/api/admin/user_list', { method: 'POST', body: payload })
    },

    // Promote user to business
    async updateVendorDetails(payload: any) {
      return await api('/api/admin/update-vendor_details', { method: 'PUT', body: payload })
    },

    // Admin profile
    async getAdminMe() {
      return await api('/api/admin/me', { method: 'GET' })
    },
    async updateAdminMe(payload: any) {
      return await api('/api/admin/me', { method: 'PUT', body: payload })
    },
    async updateAdminProfile(formData: FormData) {
      return await api('/api/admin/profile', { method: 'PUT', body: formData })
    },

    // Business management
    async getBusinesses(params: any = {}) {
      return await api('/api/admin/businesses', { method: 'GET', params })
    },
    async createBusiness(payload: any) {
      return await api('/api/admin/businesses/create', { method: 'POST', body: payload })
    },
    async approveBusiness(businessId: string | number) {
      return await api(`/api/admin/businesses/${businessId}/approve`, { method: 'POST' })
    },
    async suspendBusiness(businessId: string | number) {
      return await api(`/api/admin/businesses/${businessId}/suspend`, { method: 'POST' })
    },
    async updateSubscription(businessId: string | number, payload: any) {
      return await api(`/api/admin/businesses/${businessId}/subscription`, { method: 'PUT', body: payload })
    },

    // Products
    async getAllProducts(params: any = {}) {
      return await api('/api/admin/products', { method: 'GET', params })
    },
  }
}
