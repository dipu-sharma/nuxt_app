import { useAuthStore } from '@/stores/auth'
import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'
export default function () {
	const { token } = useAuthStore()
	const config = useRuntimeConfig()
	const BASE_URL = config.public.API_BASE_URL

	const get_vendor_product_list = async (payload) => {
		const { data, error } = await useFetch(`${BASE_URL}/vendor/product/list`, {
			method: 'GET',
			...payload,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (error?.value) {
			if (import.meta.client) {
				handleAxiosError(error?.value?.statusCode, error?.value?.data?.detail, toast)
			}
		}

		return data.value
	}

	const create_product = async (payload) => {
		const { data, error } = await useFetch(`${BASE_URL}/vendor/product`, {
			method: 'POST',
			...payload,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		if (error?.value) {
			handleAxiosError(error?.value?.statusCode, error?.value?.data?.detail, toast)
		}
		return data.value
	}

	const edit_product = async (payload, product_id) => {
		const { data, error } = await useFetch(`${BASE_URL}/vendor/product?product_id=${product_id}`, {
			method: 'PUT',
			...payload,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		if (error?.value) {
			handleAxiosError(error?.value?.statusCode, error?.value?.data?.detail, toast)
		}
		return data.value
	}

	return {
		get_vendor_product_list,
		create_product,
		edit_product,
	}
}
