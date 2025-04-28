import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export default function () {
	const { token } = useAuthStore()
	const config = useRuntimeConfig()
	const BASE_URL = config.public.API_BASE_URL

	// Create axios instance with base URL
	const api = axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})

	const login_user = async (payload) => {
		try {
			const response = await api.post('/login', payload)
			return response.data
		} catch (error) {
			console.error('Error during login:', error.response?.data || error.message)
			return error.response?.data || { message: error.message }
		}
	}

	const getCorrentUser = async (token) => {
		try {
			const response = await api.get('/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			console.error('Error fetching user data:', error.response?.data || error.message)
			return error.response?.data || { message: error.message }
		}
	}

	const resetEmployeePassword = async (payload) => {
		try {
			const response = await api.put('/employee/resetEmployeePassword', payload)
			return response.data
		} catch (error) {
			console.error('Error resetting password:', error.response?.data || error.message)
			return error.response?.data || { message: error.message }
		}
	}

	const resetEmployeePasswordByAdmin = async (payload) => {
		try {
			const response = await api.put('/employee/admin/resetEmployeePasswordByAdmin', payload, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			console.error('Error resetting password by admin:', error.response?.data || error.message)
			return error.response?.data || { message: error.message }
		}
	}

	return {
		login_user,
		getCorrentUser,
		resetEmployeePassword,
		resetEmployeePasswordByAdmin,
	}
}
