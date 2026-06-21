// src/composables/useAddress.ts
import { useApi } from './useApi'

export const useAddress = () => {
  const api = useApi()

  return {
    /** Get all addresses for logged-in user */
    async getAddresses() {
      const res: any = await api('/api/address/', { method: 'GET' })
      // Normalize backend snake_case format to frontend keys
      const list = res?.data || res || []
      const normalized = (Array.isArray(list) ? list : []).map((addr: any) => ({
        ...addr,
        id: addr.address_id || addr.id, // Use address_id string as general frontend id
        db_id: addr.id, // Store numeric database id as db_id for updates
        address_line1: addr.address_line_1 || addr.address_line1 || '',
        address_line2: addr.address_line_2 || addr.address_line2 || '',
        pincode: addr.zip_code || addr.pincode || ''
      }))
      return { data: normalized }
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
      is_billing?: boolean
      is_home?: boolean
      landmark?: string
      label?: string
    }) {
      const backendPayload = {
        address_line_1: payload.address_line1,
        address_line_2: payload.address_line2 || '',
        city: payload.city,
        state: payload.state,
        country: payload.country || 'India',
        zip_code: payload.pincode,
        is_default: !!payload.is_default,
        is_billing: !!payload.is_billing,
        is_home: payload.is_home !== undefined ? !!payload.is_home : true,
        landmark: payload.landmark || '',
        label: payload.label || 'Home'
      }
      return await api('/api/address/', { method: 'POST', body: backendPayload })
    },

    /** Update an existing address */
    async updateAddress(payload: any) {
      const backendPayload = {
        id: payload.db_id || payload.id, // use numeric database id
        address_line_1: payload.address_line1,
        address_line_2: payload.address_line2 || '',
        city: payload.city,
        state: payload.state,
        country: payload.country || 'India',
        zip_code: payload.pincode,
        is_default: !!payload.is_default,
        is_billing: !!payload.is_billing,
        is_home: payload.is_home !== undefined ? !!payload.is_home : true,
        landmark: payload.landmark || '',
        label: payload.label || 'Home'
      }
      return await api('/api/address/', { method: 'PUT', body: backendPayload })
    },
  }
}
