import { useAuthStore } from '@/stores/auth'
import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'
export default function () {
	const { token } = useAuthStore()
	const config = useRuntimeConfig()
	const BASE_URL = config.public.API_BASE_URL

	const get_vendor_product_list = async (payload) => {
		const { data, error } = useFetch(`${BASE_URL}/vendor/product/list`, {
			method: 'GET',
			...payload,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (error) {
			console.log('Error________________________', error.value.data)
			handleAxiosError(error?.value?.statusCode, error?.value?.data?.detail, toast)
		}

		return data.value
	}

	return {
		get_vendor_product_list,
	}
}
