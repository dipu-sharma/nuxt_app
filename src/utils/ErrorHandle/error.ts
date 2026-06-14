// src/utils/ErrorHandle/error.ts
import { useAuthStore } from '~/stores/auth'

export const handleAxiosError = (status_code: number | undefined, error_message: string | undefined, toast: any) => {
	const authStore = useAuthStore()
	let errorMessage = error_message || 'An error occurred.'
	let errorStatus: string | number = 'UNKNOWN_ERROR'

	console.error('API Error:', { status_code, error_message })

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
				errorMessage = error_message || 'Internal server error.'
				authStore.doLogout()
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
