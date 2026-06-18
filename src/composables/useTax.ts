// src/composables/useTax.ts
import { useApi } from './useApi'

export const useTax = () => {
  const api = useApi()

  return {
    async getTaxRates() {
      return await api('/api/tax/rates', { method: 'GET' })
    },
    async createTaxRate(payload: { name: string; rate: number; is_default?: boolean }) {
      return await api('/api/tax/rates', { method: 'POST', body: payload })
    },
    async createTaxRule(payload: any) {
      return await api('/api/tax/rules', { method: 'POST', body: payload })
    },
    async getTaxRules(taxRateId: string | number) {
      return await api(`/api/tax/rules/${taxRateId}`, { method: 'GET' })
    },
  }
}
