<!-- components/DataTable.vue -->
<template>
    <div class="w-full">
        <!-- Search Bar -->
        <div class="flex gap-6 justify-between">
            <p class="text-2xl font-bold">Table</p>
            <input v-model="search" type="text" placeholder="Single Search"
                class="w-64 border-2 border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2" />
        </div>

        <!-- Data Table -->
        <v-data-table :headers="headers" :items="items" :page.sync="internalPage"
            :items-per-page.sync="internalItemsPerPage" :server-items-length="totalItems" item-value="id"
            :loading="loading" v-model:search="search">
            <!-- Custom Header for Stock -->
            <template v-slot:header.stock>
                <div class="text-end">Stock</div>
            </template>

            <!-- Custom Item Template for Image -->
            <template v-slot:item.image="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`" height="64"
                        cover></v-img>
                </v-card>
            </template>

            <!-- Custom Item Template for Actions -->
            <template v-slot:item.actions="{ item }">
                <div class="flex justify-between gap-2">
                    <v-btn icon @click="editItem(item)">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteItem(item)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </template>
        </v-data-table>

        <!-- Pagination Control -->
        <v-pagination v-model="internalPage" :length="totalPages" :total-visible="5"></v-pagination>
    </div>
</template>

<script setup>

const props = defineProps({
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    page: { type: Number, required: true },
    itemsPerPage: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:page', 'update:itemsPerPage'])

const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)

const search = ref('')

watch(internalPage, (newPage) => {
    emit('update:page', newPage)
})

watch(internalItemsPerPage, (newItemsPerPage) => {
    emit('update:itemsPerPage', newItemsPerPage)
})

const totalPages = computed(() =>
    Math.ceil(props.totalItems / internalItemsPerPage.value)
)

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
