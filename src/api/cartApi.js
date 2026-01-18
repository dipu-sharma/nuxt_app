import { handleAxiosError } from '~/utils/ErrorHandle/error'
import { toast } from 'vue3-toastify'

export default function () {
    const { callApi } = useApiCall()

    const add_to_cart = async (items) => {
        try {
            const response = await callApi(
                'POST',
                '/user/cart/',
                { items },
                null,
                true,
            );
            return response;
        } catch (error) {
            if (import.meta.client) {
                handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
            }
        }
    };

    return {
        add_to_cart,
    };
}