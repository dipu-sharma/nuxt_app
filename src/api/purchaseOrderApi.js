import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'

export default function () {
	const { callApi } = useApiCall()

	const createPurchaseOrder = async (payload) => {
		try {
			const response = await callApi(
				'POST',
				'/business/inventory/purchase-order',
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

    const getPurchaseOrders = async (queryParams) => {
        try {
            const response = await callApi(
                'GET',
                '/business/inventory/purchase-order',
                null,
                queryParams,
                true,
            )
            return response
        } catch (error) {
            handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
            throw error
        }
    }

	return {
		createPurchaseOrder,
        getPurchaseOrders,
	}
}
