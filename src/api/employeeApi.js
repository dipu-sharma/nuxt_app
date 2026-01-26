import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'
export default () => {
	const { callApi } = useApiCall()

	const get_employee_list  = async (params) => {
		try {
			const response = await callApi('GET', '/business/members', null, params, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const get_employe_details = async (employeeId) => {
		try {
			const response = await callApi('GET', `/business/members/${employeeId}`, null, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const create_employee = async (payload) => {
		try {
			const response = await callApi('POST', '/business/members', payload, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const edit_employee = async (payload, employeeId) => {
		try {
			const response = await callApi('PUT', `/business/members/${employeeId}`, payload, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const delete_employee = async (employeeId) => {
		try {
			const response = await callApi('DELETE', `/business/members/${employeeId}`, null, null, true)
			return response	
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const bulk_delete_employees = async (employeeIds) => {
		try {
			const response = await callApi('POST', '/business/members/bulk-delete', { ids: employeeIds }, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const bulk_update_employees = async (employeeIds, updates) => {
		try {
			const response = await callApi('PUT', '/business/members/bulk-update', { ids: employeeIds, updates: updates }, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	

	return {
		get_employee_list,
		get_employe_details,
		create_employee,
		edit_employee,
		delete_employee,
		bulk_delete_employees,
		bulk_update_employees,
	}
}