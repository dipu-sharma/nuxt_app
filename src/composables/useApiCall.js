import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'
import { handleAxiosError } from '@/utils/ErrorHandle/error' // Import handleAxiosError

export default function useApiCall() {
	const config = useRuntimeConfig()
	const BASE_URL = config.public.API_BASE_URL
	const authStore = useAuthStore()
	axios.defaults.withCredentials = true

	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		withCredentials: true,
	})

	const callApi = async (method, endpoint, payload = null, queryParams = null, isTokenRequired = false) => {
		try {
			const headers = {}

			if (isTokenRequired && authStore.token) {
				headers['Authorization'] = `Bearer ${authStore.token}`
			}
			let url = endpoint
			if (queryParams) {
				const queryString = new URLSearchParams(queryParams).toString()
				url += `?${queryString}`
			}

			const response = await api({
				method,
				url,
				data: payload,
				headers,
			})

			return response.data
		} catch (error) {
			const status_code = error.response?.status
			// Pass toast to handleAxiosError for consistent toast notifications
			handleAxiosError(status_code, error, toast)
			// Re-throw the error so that calling functions can also handle it if needed
			throw error
		}
	}

	return {
		callApi,
	}
}
