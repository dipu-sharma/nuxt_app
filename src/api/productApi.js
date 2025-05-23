import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'

export default function () {
	const { callApi } = useApiCall()

	const get_vendor_product_list = async (queryParams = {}) => {
		try {
			const response = await callApi(
				'GET',
				'/vendor/product/list',
				null,
				queryParams,
				true,
			)
			return response
		} catch (error) {
			if (import.meta.client) {
				handleAxiosError(error?.statusCode, error?.data?.detail, toast)
			}
			throw error
		}
	}

	const create_product = async (payload) => {
		try {
			const response = await callApi('POST', '/vendor/product', payload, null, true)
			return response
		} catch (error) {
			handleAxiosError(error?.statusCode, error?.data?.detail, toast)
			throw error
		}
	}

	const edit_product = async (payload, product_id) => {
		try {
			const response = await callApi('PUT', '/vendor/product', payload, { product_id }, true)
			return response
		} catch (error) {
			handleAxiosError(error?.statusCode, error?.data?.detail, toast)
			throw error
		}
	}

	return {
		get_vendor_product_list,
		create_product,
		edit_product,
	}
}
