import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'

export default function () {
	const { callApi } = useApiCall()

	const get_home_product_details = async (product_id) => {
		try {
			const response = await callApi(
				'GET',
				`/home/products/${product_id}`,
				null,
				null,
				false,
			)
			return response
		} catch (error) {
			if (import.meta.client) {
				handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			}
			throw error
		}
	}

	const get_product_category_name = async (name) => {
		try {
			const response = await callApi(
				'GET',
				`/home/products/category/${name}`,
				null,
				null,
				false,
			)
			return response
		} catch (error) {
			if (import.meta.client) {
				handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			}
			throw error
		}
	}

	const get_home_product_list = async (queryParams = {}) => {
		try {
			const response = await callApi(
				'GET',
				'/home/products',
				null,
				queryParams,
				false,
			)
			return response
		} catch (error) {
			if (import.meta.client) {
				handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			}
			throw error
		}
	}

	const get_business_product_list = async (queryParams = {}) => {
		try {
			const response = await callApi(
				'GET',
				'/business/products',
				null,
				queryParams,
				true,
			)
			return response
		} catch (error) {
			if (import.meta.client) {
				handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			}
			throw error
		}
	}

	const create_product = async (payload) => {
		try {
			const response = await callApi('POST', '/business/products', payload, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const edit_product = async (payload, product_id) => {
		try {
			const response = await callApi('PUT', `/business/products/${product_id}`, payload, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	const delete_product = async (product_id) => {
		try {
			const response = await callApi('DELETE', `/business/products/${product_id}`, null, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	return {
		get_home_product_details,
		get_product_category_name,
        get_home_product_list,
		get_business_product_list,
		create_product,
		edit_product,
		delete_product,
	}
}
