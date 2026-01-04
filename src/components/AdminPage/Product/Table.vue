<template>
    <div>
        <div>
            <v-col cols="3" >
                <v-autocomplete
                    v-model="searchQuery"
                    :items="[]"
                    class="mx-auto"
                    density="comfortable"
                    menu-icon=""
                    placeholder="Enter the keyword to search"
                    prepend-inner-icon="mdi-magnify"
                    style="max-width: 350px;"
                    theme="light"
                    variant="solo"
                    auto-select-first
                    item-props
                    rounded
                ></v-autocomplete>
            </v-col>
        </div>
        <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="serverItems"
            :items-length="totalItems"
            :loading="loading"
            item-value="name"
            @update:options="loadItems"
        ></v-data-table-server>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const products = [
    {
        name: 'Frozen Yogurt',
        calories: 159,
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1',
    },
    {
        name: 'Jelly bean',
        calories: 375,
        fat: 0.0,
        carbs: 94,
        protein: 0.0,
        iron: '0',
    },
    {
        name: 'KitKat',
        calories: 518,
        fat: 26.0,
        carbs: 65,
        protein: 7,
        iron: '6',
    },
    {
        name: 'Eclair',
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7',
    },
    {
        name: 'Gingerbread',
        calories: 356,
        fat: 16.0,
        carbs: 49,
        protein: 3.9,
        iron: '16',
    },
    {
        name: 'Ice cream sandwich',
        calories: 237,
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1',
    },
    {
        name: 'Lollipop',
        calories: 392,
        fat: 0.2,
        carbs: 98,
        protein: 0,
        iron: '2',
    },
    {
        name: 'Cupcake',
        calories: 305,
        fat: 3.7,
        carbs: 67,
        protein: 4.3,
        iron: '8',
    },
    {
        name: 'Honeycomb',
        calories: 408,
        fat: 3.2,
        carbs: 87,
        protein: 6.5,
        iron: '45',
    },
    {
        name: 'Donut',
        calories: 452,
        fat: 25.0,
        carbs: 51,
        protein: 4.9,
        iron: '22',
    },
]

const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy, searchQuery }) {
        return new Promise(resolve => {
            setTimeout(() => {
                let filteredItems = products.slice()

                if (searchQuery) {
                    filteredItems = filteredItems.filter(item =>
                        item.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                }

                if (sortBy.length) {
                    const sortKey = sortBy[0].key
                    const sortOrder = sortBy[0].order
                    filteredItems.sort((a, b) => {
                        const aValue = a[sortKey]
                        const bValue = b[sortKey]
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
                    })
                }

                const start = (page - 1) * itemsPerPage
                const end = start + itemsPerPage
                const paginated = filteredItems.slice(start, end)

                resolve({ items: paginated, total: filteredItems.length })
            }, 500)
        })
    },
}

const itemsPerPage = ref(5)
const headers = ref([
    {
        title: 'Dessert (100g serving)',
        align: 'start',
        sortable: false,
        key: 'name',
    },
    { title: 'Calories', key: 'calories', align: 'end' },
    { title: 'Fat (g)', key: 'fat', align: 'end' },
    { title: 'Carbs (g)', key: 'carbs', align: 'end' },
    { title: 'Protein (g)', key: 'protein', align: 'end' },
    { title: 'Iron (%)', key: 'iron', align: 'end' },
])
const serverItems = ref([])
const loading = ref(true)
const totalItems = ref(0)
const dialog = ref(false)
const searchQuery = ref('')

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    loading.value = true
    const { items, total } = await FakeAPI.fetch({ page, itemsPerPage, sortBy, searchQuery: searchQuery.value })
    serverItems.value = items
    totalItems.value = total
    loading.value = false
}

// Debounce function
const debounce = (func, delay) => {
    let timeout;
    return function executed(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
    };
};

const debouncedLoadItems = debounce(loadItems, 300);

watch(searchQuery, () => {
    debouncedLoadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
});

onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
});
</script>