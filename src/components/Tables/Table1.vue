<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage"
            :server-items-length="totalItems" item-value="id" :loading="loading" show-select>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Data Table with Pagination</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <!-- <v-select v-model="itemsPerPage" :items="itemsPerPageOptions" label="Items per page" hide-details
                        dense /> -->
                </v-toolbar>
            </template>
            <!-- Action button -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn icon @click="editItem(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteItem(item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Pagination Control -->
        <v-pagination v-model="page" :length="totalPages" :total-visible="5"></v-pagination>
    </v-container>
</template>

<script setup>

// Define headers for the table
const headers = ref([
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Age', value: 'age' },
    { text: 'Actions', value: 'actions', sortable: false },
])

// Data variables
const items = ref([])
const loading = ref(false)
const totalItems = ref(0)
const totalPages = ref(1)

// Pagination settings
const page = ref(1)
const itemsPerPage = ref(10)
const itemsPerPageOptions = ref([5, 10, 15, 20])

// Methods for fetching data
const fetchData = async () => {
    loading.value = true
    // Simulate an API call for paginated data
    const { data, total } = await getDataFromServer(page.value, itemsPerPage.value)

    items.value = data
    totalItems.value = total
    totalPages.value = Math.ceil(total / itemsPerPage.value)
    loading.value = false
}

// Mock function for simulating data fetch
const getDataFromServer = async (page, itemsPerPage) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const data = [
                { id: 1, name: 'John', age: 25 },
                { id: 2, name: 'Jane', age: 30 },
                { id: 3, name: 'Mike', age: 28 },
                // Add more items as needed...
            ]
            const total = 50 // Total items in the data source
            resolve({ data, total })
        }, 1000)
    })
}

// Watch for changes in page or itemsPerPage and refetch data
watch([page, itemsPerPage], fetchData)

// Initially fetch data
fetchData()

// Methods for editing and deleting items
const editItem = (item) => {
    console.log('Edit item:', item)
}

const deleteItem = (item) => {
    console.log('Delete item:', item)
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>