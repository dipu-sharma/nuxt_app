import { useApi } from './useApi'
import { useAuthStore } from '~/stores/auth'

export const useSettings = () => {
  const api = useApi()
  const authStore = useAuthStore()

  const getBusinessId = () => {
    return authStore.user?.business_id || authStore.user?.business?.id || ''
  }

  return {
    // ─── 1. Dynamic Settings (Form Generation) ───────────────────────────────
    async getDynamicSettings(query?: { group?: string; business_id?: string }) {
      return await api('/api/settings/dynamic', { method: 'GET', query })
    },
    async updateBusinessDynamicSettings(payload: Array<{ key: string; value: string }>, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/dynamic', {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },
    async createDynamicSettingDefinition(payload: any) {
      return await api('/api/settings/admin/dynamic', { method: 'POST', body: payload })
    },
    async updateDynamicSettingDefinition(settingId: string, payload: any) {
      return await api(`/api/settings/admin/dynamic/${settingId}`, { method: 'PUT', body: payload })
    },
    async deleteDynamicSettingDefinition(settingId: string) {
      return await api(`/api/settings/admin/dynamic/${settingId}`, { method: 'DELETE' })
    },

    // ─── 2. Business Capabilities (Admin Only) ───────────────────────────────
    async getBusinessCapabilities(businessId: string) {
      return await api('/api/settings/admin/business/capabilities', {
        method: 'GET',
        query: { business_id: businessId }
      })
    },
    async updateBusinessCapabilities(businessId: string, payload: any) {
      return await api('/api/settings/admin/business/capabilities', {
        method: 'PATCH',
        body: payload,
        query: { business_id: businessId }
      })
    },

    // ─── 3. Business Core Settings ───────────────────────────────────────────
    // General Settings
    async getBusinessGeneral(businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/general', {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },
    async updateBusinessGeneral(payload: any, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/general', {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },

    // Tax Settings
    async getBusinessTax(businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/tax', {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },
    async updateBusinessTax(payload: any, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/tax', {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },

    // Inventory Settings
    async getBusinessInventory(businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/inventory', {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },
    async updateBusinessInventory(payload: any, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/business/inventory', {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },

    // ─── 4. Employee Permissions ─────────────────────────────────────────────
    async getEmployeePermissions(userId: string, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api(`/api/settings/business/employees/${userId}/permissions`, {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },
    async updateEmployeePermissions(userId: string, payload: any, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api(`/api/settings/business/employees/${userId}/permissions`, {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },
    async getEffectivePermissions(businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/employee/permissions', {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },

    // ─── Employee settings preferences (Fallback Compatibility) ──────────────
    async getEmployeeSettings(businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/employee', {
        method: 'GET',
        query: id ? { business_id: id } : {}
      })
    },
    async updateEmployeeSettings(payload: any, businessId?: string) {
      const id = businessId || getBusinessId()
      return await api('/api/settings/employee', {
        method: 'PATCH',
        body: payload,
        query: id ? { business_id: id } : {}
      })
    },

    // ─── 5. End-User Preferences ────────────────────────────────────────────
    async getUserSettings() {
      return await api('/api/settings/user', { method: 'GET' })
    },
    async updateUserSettings(payload: any) {
      return await api('/api/settings/user', { method: 'PATCH', body: payload })
    },
  }
}
