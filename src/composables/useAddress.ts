// src/composables/useAddress.ts
import { useApi } from './useApi'

export const useAddress = () => {
  const api = useApi()

  return {
    /** Get all addresses for logged-in user */
    async getAddresses() {
      return await api('/api/address/', { method: 'GET' })
    },

    /** Add a new address */
    async addAddress(payload: {
      address_line1: string
      address_line2?: string
      city: string
      state: string
      country: string
      pincode: string
      is_default?: boolean
    }) {
      return await api('/api/address/', { method: 'POST', body: payload })
    },

    /** Update an existing address */
    async updateAddress(payload: any) {
      return await api('/api/address/', { method: 'PUT', body: payload })
    },
  }
}
