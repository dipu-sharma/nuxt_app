// src/composables/useCategories.ts
import { useApi } from './useApi'

export const useCategories = () => {
  const api = useApi()

  return {
    /** Get all categories (public) */
    async getCategories(params: Record<string, any> = {}) {
      return await api('/api/home/categories/', { method: 'GET', query: params })
    },

    /** Admin: Get all categories */
    async getAdminCategories(params: Record<string, any> = {}) {
      return await api('/api/admin/categories/', { method: 'GET', query: params })
    },

    /** Admin: Create category */
    async createCategory(payload: { name: string; description?: string; parent_id?: string }) {
      return await api('/api/admin/categories/', { method: 'POST', body: payload })
    },

    /** Admin: Update category */
    async updateCategory(id: string, payload: any) {
      return await api(`/api/admin/categories/${id}`, { method: 'PUT', body: payload })
    },

    /** Admin: Delete category */
    async deleteCategory(id: string) {
      return await api(`/api/admin/categories/${id}`, { method: 'DELETE' })
    },
  }
}
