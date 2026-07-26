// src/composables/useNotifications.ts
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '~/stores/auth'

export const useNotifications = () => {
  const ws = ref<WebSocket | null>(null)
  const authStore = useAuthStore()

  const connectWebSocket = () => {
    // Only connect if the user is authenticated and we have their ID
    if (!authStore.user?.id) return

    const config = useRuntimeConfig()
    const apiBase = config.public.API_BASE_URL || 'http://192.168.157.128'
    
    // Replace http:// or https:// with ws:// or wss://
    let wsBase = apiBase.replace(/^http/, 'ws')
    // If the base URL didn't have a protocol for some reason, prepend ws://
    if (!wsBase.startsWith('ws')) {
      wsBase = 'ws://192.168.157.128'
    }

    const wsUrl = `${wsBase}/ws/notifications?user_id=${authStore.user.id}`
    
    // Avoid creating multiple connections
    if (ws.value && ws.value.readyState === WebSocket.OPEN) return

    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      console.log('Notification WebSocket connected.')
    }

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        switch (data.type) {
          case 'INVOICE_GENERATED':
            toast.success(`Invoice #${data.invoice_id || ''} is ready for download!`)
            break
          case 'ORDER_DELIVERED':
            toast.success(`Order #${data.order_id || ''} has been delivered! 🎉`)
            break
          case 'ORDER_SHIPPED':
            toast.info(`Order #${data.order_id || ''} has been shipped! 🚚`)
            break
          case 'PAYMENT_FAILED':
            toast.error(`Payment failed for Order #${data.order_id || ''}.`)
            break
          default:
            console.log('Received unknown notification:', data)
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err)
      }
    }

    ws.value.onerror = (error) => {
      console.error('WebSocket Error:', error)
    }

    ws.value.onclose = () => {
      console.log('Notification WebSocket closed.')
    }
  }

  const disconnectWebSocket = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
  }

  // Usually called in app.vue or a global layout
  onMounted(() => {
    if (authStore.user?.id) {
      connectWebSocket()
    }
  })

  // Re-connect if user changes (e.g., login)
  watch(() => authStore.user?.id, (newId) => {
    if (newId) {
      connectWebSocket()
    } else {
      disconnectWebSocket()
    }
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  return {
    connectWebSocket,
    disconnectWebSocket
  }
}
