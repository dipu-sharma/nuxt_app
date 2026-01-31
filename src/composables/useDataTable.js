// src/composables/useDataTable.js
import { ref, watch, computed, onMounted } from 'vue';
import { useFilterStore } from '~/stores/filterStore';
import { toast } from 'vue3-toastify';
import { handleAxiosError } from '~/utils/ErrorHandle/error';
import { useAuthStore } from '~/stores/auth';


export function useDataTable({ apiFetchFunction, initialItemsPerPage = 10, responseDataTransformer = null }) {
    const filterStore = useFilterStore();
    const AuthStore = useAuthStore();

    const items = ref([]);
    const isLoading = ref(false);
    const search = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(initialItemsPerPage);
    const total_data = ref(0);
    const stats = ref({});


    const queryParams = computed(() => {
        const params = {
            page: currentPage.value,
            per_page: itemsPerPage.value,
            is_paginate: true,
            search: search.value,
            sort_by: '-created_at',
        };
        if (filterStore.startDate) {
            params.startDate = filterStore.startDate.toISOString();
        }
        if (filterStore.endDate) {
            params.endDate = filterStore.endDate.toISOString();
        }
        return params;
    });

    const fetchData = async () => {
        isLoading.value = true;
        try {
            const response = await apiFetchFunction(queryParams.value);
            
            if (response?.data?.detail?.status_code === 401) {
                AuthStore.doLogout();
                navigateTo('/login');
                return;
            }

            let transformedItems = response?.data?.items || [];
            if (responseDataTransformer) {
                 transformedItems = responseDataTransformer(transformedItems);
            }
            
            items.value = transformedItems.map((item, i) => ({
                ...item,
                index: (currentPage.value - 1) * itemsPerPage.value + i + 1,
            }));

            total_data.value = response?.data?.total ?? 0;
            if(response?.data?.stats) {
                stats.value = response.data.stats;
            }

        } catch (error) {
            handleAxiosError(error?.response?.data?.status_code, error?.response?.data?.message, toast)
        } finally {
            isLoading.value = false;
        }
    };

    watch([() => filterStore.startDate, () => filterStore.endDate, search], () => {
        fetchData();
    });
    
    onMounted(fetchData);

    const handlePageChange = (newPage) => {
        currentPage.value = newPage;
        fetchData();
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        itemsPerPage.value = newItemsPerPage;
        currentPage.value = 1;
        fetchData();
    };

    const handleSearch = (search_keyword) => {
        search.value = search_keyword;
        currentPage.value = 1;
    };

    return {
        items,
        isLoading,
        search,
        currentPage,
        itemsPerPage,
        total_data,
        stats,
        fetchData,
        handlePageChange,
        handleItemsPerPageChange,
        handleSearch,
    };
}
