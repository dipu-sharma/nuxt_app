import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'

export default function () {
	const { callApi } = useApiCall()

	const purchase_stock = async (payload) => {
		try {
			const response = await callApi(
				'POST',
				'/business/inventory/purchase',
				payload,
				null,
				true,
			)
			return response
		} catch (error) {
			handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
			throw error
		}
	}

	return {
		purchase_stock,
	}
}
