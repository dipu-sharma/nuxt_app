<template>
  <div class="container mx-auto p-5">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-center pt-5">Admin Products Page</h1>
    </div>

    <!-- Planning Data Input -->
    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Save for Planning: <span class="font-normal">{{
        projectStore.save_for_planning }}</span></h3>

      <!-- Input field for planning data -->
      <input v-model="planningData" placeholder="Enter planning data"
        class="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <!-- Save Button -->
      <button @click="savePlanningData"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200">
        Save Planning Data
      </button>
    </div>
    <UploadImage />
    <h1>Selected Products</h1>
    <div class="d-flex gap-4">
      <div v-if="selectedSystems.length > 0" @click="SaveMilestone"
        class="text-white bg-gradient-to-r from-[#FF9C06] to-[#F42C00] focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 text-center cursor-pointer">
        Save
      </div>
      <div v-if="selectedSystems.length > 0" @click="exportToExcel"
        class="text-white bg-gradient-to-r from-[#FF9C06] to-[#F42C00] focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 text-center cursor-pointer">
        Download Template
      </div>
    </div>

    <div v-for="(system_item, index) in datatable.multiple_items" :key="index" class="table_data">
      <div class="d-flex rr-items-center">
        <!-- Checkbox for selecting systems -->
        <input type="checkbox" :value="system_item" v-model="selectedSystems" class="mr-2 p-4" />
      </div>

      <!-- Editable Table component -->
      <!-- <TablesTable1 :items="system_item" :headers="datatable.header" :isLoading="isTableLoading"
        :totalItems="datatable.total_items[index]" :itemsPerPage="6" /> -->
    </div>
    <v-container>
      <TablesTable2 :headers="table2_datatable.headers" :items="table2_datatable.items" :page="table2_datatable.page"
        :itemsPerPage="itemsPerPage" :totalItems="totalItems" :loading="loading" @update:page="updatePage"
        @update:itemsPerPage="updateItemsPerPage" />
    </v-container>
  </div>
</template>

<script setup>
import { useProjectStore } from '~/stores/projects'
import { multiple_items } from '~/utils/repository'
import * as XLSX from 'xlsx' // Import xlsx library

definePageMeta({
  layout: 'admin'
})

const projectStore = useProjectStore()
const planningData = ref('')
const selectedSystems = ref([])
const loading = ref(false)
const page = ref(0)
const items = ref([])
let totalItems = 100
const itemsPerPage = ref([])

const datatable = ref({
  total_items: [],
  multiple_items: [],
  itemsPerPageOptions: [5, 10, 50, 100, 200, -1],
  header: [
    { title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
    { title: 'Milestone No', value: 'milestone_no', sortable: false, align: 'left' },
    { title: 'Task', value: 'task', sortable: false, align: 'left' },
    { title: 'Description', value: 'description', sortable: false, align: 'left' },
    { title: 'Comment', value: 'comment', sortable: false, align: 'left' },
    { title: 'Location', value: 'location', sortable: false, align: 'left' },
    { title: 'Configuration', value: 'configuration', sortable: false, align: 'left' },
    { title: 'Start Date', value: 'start_date', sortable: false, align: 'center', width: '200px' },
    { title: 'End Date', value: 'end_date', sortable: false, align: 'left', width: '120px' },
    { title: 'Working Days', value: 'working_days', sortable: false, align: 'left', width: '100px' },
    { title: 'Man Power', value: 'man_power', sortable: false, align: 'left' },
    { title: 'Quantity', value: 'quantity', sortable: false, align: 'left' },
  ],
})


const table2_datatable = ref({
  items: [],
  loading: false,
  totalItems: 0,
  page: 1,
  itemsPerPage: 5,
  headers: [
    { title: 'Sr No.', value: 'index', sortable: false, align: 'left' },
    { title: 'Milestone No', value: 'milestone_no', sortable: false, align: 'left' },
    { title: 'Task', value: 'task', sortable: false, align: 'left' },
    { title: 'Description', value: 'description', sortable: false, align: 'left' },
    { title: 'Comment', value: 'comment', sortable: false, align: 'left' },
    { title: 'Location', value: 'location', sortable: false, align: 'left' },
    { title: 'Configuration', value: 'configuration', sortable: false, align: 'left' },
    { title: 'Start Date', value: 'start_date', sortable: false, align: 'center', width: '200px' },
    { title: 'End Date', value: 'end_date', sortable: false, align: 'left', width: '120px' },
    { title: 'Working Days', value: 'working_days', sortable: false, align: 'left', width: '100px' },
    { title: 'Man Power', value: 'man_power', sortable: false, align: 'left' },
    { title: 'Quantity', value: 'quantity', sortable: false, align: 'left' },
    { title: 'Stock', value: 'image', sortable: false, align: 'left' },
  ],

})
const savePlanningData = () => {
  projectStore.SaveForPlanning(planningData.value.split(','))
}

datatable.value.multiple_items = multiple_items
table2_datatable.value.items = multiple_items
table2_datatable.value.totalItems = multiple_items.length

const SaveMilestone = () => {
  if (selectedSystems.value.length > 0) {
    console.log("Selected Systems:", selectedSystems.value);
  }
}

// Function to export selected systems to Excel
const exportToExcel = () => {
  const ws_data = selectedSystems.value.map((system, index) => ({
    'Sr No.': index + 1,
    'System Name': system[0].system_name,
    'Module No': system[0]?.module_no,
    'Location': system[0]?.location,
    'Task': system[0]?.task,
    'Start Date': system[0]?.start_date,
    'End Date': system[0]?.end_date,
    'Working Days': system[0]?.working_days,
    'Man Power': system[0]?.man_power,
    'Quantity': system[0]?.quantity
  }));

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(ws_data);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Systems");

  // Generate an XLSX file and trigger the download
  XLSX.writeFile(workbook, "selected_systems.xlsx");
}
const fetchData = async () => {
  loading.value = true
  const { data, total } = await getDataFromServer(page.value, itemsPerPage.value)

  items.value = data
  totalItems = total || 100
  loading.value = false
}

const getDataFromServer = async (page, itemsPerPage) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data = [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
        { id: 3, name: 'Mike', age: 28 },
        // More items...
      ]
      const total = 50 // Total number of items in the server
      resolve({ data, total })
    }, 1000)
  })
}

// Methods to handle pagination changes
const updatePage = (newPage) => {
  page.value = newPage
  fetchData() // Refetch data when the page changes
}

const updateItemsPerPage = (newItemsPerPage) => {
  itemsPerPage.value = newItemsPerPage
  fetchData() // Refetch data when items per page changes
}

// Initially fetch data
fetchData()
watch(
  () => projectStore.save_for_planning,
  (newVal, oldVal) => {
    console.log('Save for Planning changed from', oldVal, 'to', newVal)
  }
)
</script>
