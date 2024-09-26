<!-- components/DataTable.vue -->
<template>
    <v-data-table :headers="headers" :items="items" :page.sync="internalPage"
        :items-per-page.sync="internalItemsPerPage" :server-items-length="totalItems" item-value="id" :loading="loading"
        :search="true" v-model:search="search">
        <template v-slot:header.stock>
            <div class="text-end">Stock</div>
        </template>

        <template v-slot:item.image="{ item }">
            <v-card class="my-2" elevation="2" rounded>
                <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`" height="64"
                    cover></v-img>
            </v-card>
        </template>
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
    <v-pagination v-model="internalPage" :length="totalPages" :total-visible="5"></v-pagination>
</template>

<script setup>
import { ref, watch } from 'vue'
import { tr } from 'vuetify/locale';

// Props
const props = defineProps({
    headers: { type: Array, required: true },
    items: { type: Array, required: true },
    page: { type: Number, required: true },
    itemsPerPage: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    loading: { type: Boolean, default: false }
})

// Emit events for pagination changes
const emit = defineEmits(['update:page', 'update:itemsPerPage'])

// Local state to handle sync with parent
const internalPage = ref(props.page)
const internalItemsPerPage = ref(props.itemsPerPage)

// Watch for changes in local pagination and emit them to the parent
watch(internalPage, (newPage) => {
    emit('update:page', newPage)
})

watch(internalItemsPerPage, (newItemsPerPage) => {
    emit('update:itemsPerPage', newItemsPerPage)
})

// Handle edit and delete actions
const editItem = (item) => {
    console.log('Edit item:', item)
}

const deleteItem = (item) => {
    console.log('Delete item:', item)
}

// Total pages computed from totalItems and itemsPerPage
const totalPages = computed(() => Math.ceil(props.totalItems / internalItemsPerPage.value))

// Items per page options
const itemsPerPageOptions = ref([5, 10, 15, 20])
</script>

<style scoped>
/* Add custom styles if needed */
</style>