<template>
    <div>
        <div>
            <v-col cols="3" >
                <!-- append-inner-icon="mdi-microphone" -->
                <v-autocomplete :items="items" class="mx-auto" density="comfortable" menu-icon=""
                    placeholder="Enter the keyword to search" prepend-inner-icon="mdi-magnify" style="max-width: 350px;"
                    theme="light" variant="solo" auto-select-first item-props rounded></v-autocomplete>
            </v-col>
        </div>
        <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
            :items-length="totalItems" :loading="loading" item-value="name"
            @update:options="loadItems"></v-data-table-server>

    </div>
</template>

<script>
const desserts = [
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
    async fetch({ page, itemsPerPage, sortBy }) {
        return new Promise(resolve => {
            setTimeout(() => {
                const start = (page - 1) * itemsPerPage
                const end = start + itemsPerPage
                const items = desserts.slice()

                if (sortBy.length) {
                    const sortKey = sortBy[0].key
                    const sortOrder = sortBy[0].order
                    items.sort((a, b) => {
                        const aValue = a[sortKey]
                        const bValue = b[sortKey]
                        return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
                    })
                }

                const paginated = items.slice(start, end)

                resolve({ items: paginated, total: items.length })
            }, 500)
        })
    },
}

export default {
    data: () => ({
        itemsPerPage: 5,
        headers: [
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
        ],
        serverItems: [],
        loading: true,
        totalItems: 0,
        dialog: false,
        items: [
            {
                prependIcon: 'mdi-clock-outline',
                title: 'recipe with chicken',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'best hiking trails near me',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'how to learn a new language',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'DIY home organization ideas',
            },
            {
                prependIcon: 'mdi-clock-outline',
                title: 'latest fashion trends',
            },
        ],
    }),
    methods: {
        loadItems({ page, itemsPerPage, sortBy }) {
            this.loading = true
            FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
                this.serverItems = items
                this.totalItems = total
                this.loading = false
            })
        },
    },
}
</script>

<style></style>