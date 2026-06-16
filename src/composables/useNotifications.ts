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
    async markAsRead(id: string) {
      return await api(`/api/notifications/${id}/read`, { method: 'PUT' })
    },

    /** Mark all notifications as read */
    async markAllRead() {
      return await api('/api/notifications/read-all', { method: 'PUT' })
    },

    /** Get unread notification count */
    async getUnreadCount() {
      return await api('/api/notifications/unread-count', { method: 'GET' })
    },
  }
}
