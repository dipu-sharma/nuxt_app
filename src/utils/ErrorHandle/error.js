import { useAuthStore } from '~/stores/auth'
export const handleAxiosError = (status_code, error, toast) => {
	const authStore = useAuthStore()
	let errorMessage = error?.message
	let errorStatus = 'UNKNOWN_ERROR'
	const message = error?.message || ''
	console.log('Error file _______________________________', status_code)

	if (status_code) {
		const statusCode = status_code
		switch (statusCode) {
			case 400:
				errorMessage = message || 'Bad Request'
				break
			case 401:
				errorMessage = 'Unauthorized. Please log in again.'
				authStore.doLogout()
				navigateTo('/login')
				break
			case 403:
				errorMessage = 'Forbidden. You do not have permission.'
				break
			case 404:
				errorMessage = 'Resource not found.'
				break
			case 406:
				errorMessage = message || 'Already Exists'
				break
			case 500:
				errorMessage = 'Internal server error.'
				break
			default:
				errorMessage = message || 'An error occurred.'
				break
		}
		errorStatus = statusCode
	}

	if (toast) {
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
