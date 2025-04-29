import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export default function useApiCall() {
	const config = useRuntimeConfig()
	const BASE_URL = config.public.API_BASE_URL
	const authStore = useAuthStore()

	// Create Axios instance
	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})

	/**
	 * Generic API request handler
	 * @param {string} method - HTTP method (get, post, put, delete, etc.)
	 * @param {string} endpoint - API endpoint (e.g., '/login')
	 * @param {object} payload - Request payload (optional)
	 * @param {boolean} isTokenRequired - Whether to include auth token (default: false)
	 */
	const callApi = async (method, endpoint, payload = null, isTokenRequired = false) => {
		try {
			const headers = {}

			if (isTokenRequired && authStore.token) {
				headers['Authorization'] = `Bearer ${authStore.token}`
			}

			const response = await api({
				method,
				url: endpoint,
				data: payload,
				headers,
			})

			return response.data
		} catch (error) {
			console.error(`API Error (${endpoint}):`, error.response?.data || error.message)
			return error.response?.data || { message: error.message }
		}
	}

	return {
		callApi,
	}
}
