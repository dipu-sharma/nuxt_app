import { useAuthStore } from '~/stores/auth'
export const handleAxiosError = (status_code, error_message, toast) => {
	const authStore = useAuthStore()
	let errorMessage = error_message
	let errorStatus = 'UNKNOWN_ERROR'
	console.log('Error message _______________________________', error_message)
	console.log('Error file _______________________________', status_code)

	if (status_code) {
		const statusCode = status_code
		// For standardized errors, the specific message is already in error_message
		// No need for a special 'out of stock' check here
		switch (statusCode) {
			case 400:
				errorMessage = error_message || 'Bad Request'
				break
			case 401:
				errorMessage = error_message || 'Unauthorized. Please log in again.'
				authStore.doLogout()
				navigateTo('/login')
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
				navigateTo('/login')
				break
			default:
				errorMessage = error_message || 'An error occurred.'
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
