import useApiCall from '@/composables/useApiCall'

export default function () {
	const { callApi } = useApiCall()

	const login_user = async (payload) => {
		return callApi('post', '/login', payload)
	}

	const get_current_user = async (payload) => {
		return callApi('get', '/me', payload, true)
	}

	const resetEmployeePassword = async (payload) => {
		return callApi('put', '/employee/resetEmployeePassword', payload)
	}

	const resetEmployeePasswordByAdmin = async (payload) => {
		return callApi('put', '/employee/admin/resetEmployeePasswordByAdmin', payload, true)
	}

	return {
		login_user,
		get_current_user,
		resetEmployeePassword,
		resetEmployeePasswordByAdmin,
	}
}
