// src/utils/ErrorHandle/error.ts
import { useAuthStore } from '~/stores/auth'

export const handleAxiosError = (status_code: number | undefined, error_message: string | undefined, toast: any) => {
	const authStore = useAuthStore()
	let errorMessage = error_message || 'An error occurred.'
	let errorStatus: string | number = 'UNKNOWN_ERROR'

	if (status_code) {
		const statusCode = status_code
		switch (statusCode) {
			case 400:
				errorMessage = error_message || 'Bad Request'
				break
			case 401:
				errorMessage = error_message || 'Unauthorized. Please log in again.'
				authStore.doLogout()
				break
			case 403:
				errorMessage = error_message || 'Forbidden. You do not have permission.'
				break
			case 404:
				errorMessage = error_message || 'Resource not found.'
				break
			case 406:
				errorMessage = error_message || 'Already Exists'
				break
			case 500:
				// Server errors should NOT log the user out — it may be a temporary outage
				errorMessage = error_message || 'Internal server error. Please try again later.'
				break
			default:
				errorMessage = error_message || 'An error occurred.'
				break
		}
		errorStatus = statusCode
	}

	if (toast && typeof toast.error === 'function') {
		toast.error(errorMessage, {
			position: 'top-right',
			autoClose: 2000,
			limit: 1,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
		})
	}

	return {
		message: errorMessage,
		status: errorStatus,
	}
}
