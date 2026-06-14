// src/composables/useInventory.ts
import { useApi } from './useApi'

export const useInventory = () => {
  const api = useApi()

  return {
    async purchaseStock(payload: any) {
      return await api('/api/business/inventory/purchase', {
        method: 'POST',
        body: payload
      })
    }
  }
}
