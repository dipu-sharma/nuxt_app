// src/composables/useReviews.ts
import { useApi } from './useApi'

export const useReviews = () => {
  const api = useApi()

  return {
    /** Get reviews for a product (public) */
    async getProductReviews(product_id: string | number, params: Record<string, any> = {}) {
      return await api(`/api/reviews/product/${product_id}`, { method: 'GET', query: params })
    },

    /** Submit a product review */
    async submitReview(payload: {
      product_id: string | number
      rating: number
      comment: string
    }) {
      return await api('/api/reviews/', { method: 'POST', body: payload })
    },

    /** Update own review */
    async updateReview(review_id: string | number, payload: { rating?: number; comment?: string }) {
      return await api(`/api/reviews/${review_id}`, { method: 'PUT', body: payload })
    },

    /** Delete own review */
    async deleteReview(review_id: string | number) {
      return await api(`/api/reviews/${review_id}`, { method: 'DELETE' })
    },

    // ── Admin ──────────────────────────────────
    /** Admin: Get all reviews */
    async getAdminReviews(params: Record<string, any> = {}) {
      return await api('/api/admin/reviews/', { method: 'GET', query: params })
    },

    /** Admin/User: Approve review */
    async approveReview(review_id: string | number) {
      return await api(`/api/reviews/${review_id}/approve`, { method: 'POST' })
    },

    /** Admin/User: Reject review */
    async rejectReview(review_id: string | number) {
      return await api(`/api/reviews/${review_id}/reject`, { method: 'POST' })
    },

    /** Admin: Delete review */
    async deleteAdminReview(review_id: string | number) {
      return await api(`/api/admin/reviews/${review_id}`, { method: 'DELETE' })
    },
  }
}
