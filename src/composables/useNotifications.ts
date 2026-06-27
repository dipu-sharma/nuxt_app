// src/composables/useNotifications.ts
import { useApi } from './useApi'

export const useNotifications = () => {
  const api = useApi()

  return {
    /** Get all notifications */
    async getNotifications(params: Record<string, any> = {}) {
      return await api('/api/notifications/', { method: 'GET', query: params })
    },

    /** Mark a single notification as read */
    async markAsRead(id: string | number) {
      return await api(`/api/notifications/${id}/read`, { method: 'POST' })
    },

    /** Mark all notifications as read */
    async markAllRead() {
      return await api('/api/notifications/mark-all-read', { method: 'POST' })
    },

    /** Get unread notification count */
    async getUnreadCount() {
      return await api('/api/notifications/unread-count', { method: 'GET' })
    },

    /** Clear all notifications */
    async clearAll() {
      return await api('/api/notifications/clear/all', { method: 'DELETE' })
    },

    /** Clear all read notifications */
    async clearRead() {
      return await api('/api/notifications/clear/read', { method: 'DELETE' })
    },

    /** Update notification preferences */
    async updatePreferences(payload: any) {
      return await api('/api/notifications/preferences', { method: 'PUT', body: payload })
    },
  }
}
