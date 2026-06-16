// src/composables/useReviews.ts
import { useApi } from './useApi'

export const useReviews = () => {
  const api = useApi()

  return {
    /** Get reviews for a product (public) */
    async getProductReviews(product_id: string, params: Record<string, any> = {}) {
      return await api(`/api/home/reviews/${product_id}`, { method: 'GET', query: params })
    },

    /** Submit a product review */
    async submitReview(payload: {
      product_id: string
      rating: number
      comment: string
    }) {
      return await api('/api/user/reviews/', { method: 'POST', body: payload })
    },

    /** Update own review */
    async updateReview(review_id: string, payload: { rating?: number; comment?: string }) {
      return await api(`/api/user/reviews/${review_id}`, { method: 'PUT', body: payload })
    },

    /** Delete own review */
    async deleteReview(review_id: string) {
      return await api(`/api/user/reviews/${review_id}`, { method: 'DELETE' })
    },

    // ── Admin ──────────────────────────────────
    /** Admin: Get all reviews */
    async getAdminReviews(params: Record<string, any> = {}) {
      return await api('/api/admin/reviews/', { method: 'GET', query: params })
    },

    /** Admin: Approve review */
    async approveReview(review_id: string) {
      return await api(`/api/admin/reviews/${review_id}/approve`, { method: 'PUT' })
    },

    /** Admin: Delete review */
    async deleteAdminReview(review_id: string) {
      return await api(`/api/admin/reviews/${review_id}`, { method: 'DELETE' })
    },
  }
}
