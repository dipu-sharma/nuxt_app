<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-extrabold text-text tracking-tight">Order Management</h1>
        <p class="text-sm text-text/60 mt-1">View and manage all system orders</p>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-6 rounded-2xl shadow-sm border border-border/50 bg-card" elevation="0">
      <v-card-text>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <v-text-field
            v-model="filters.search"
            label="Search Orders"
            prepend-inner-icon="mdi:magnify"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @update:model-value="debouncedLoad"
          />
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            label="Filter by Status"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
            @update:model-value="loadOrders"
          />
          <v-text-field
            v-model="filters.from_date"
            type="date"
            label="From Date"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="loadOrders"
          />
          <v-text-field
            v-model="filters.to_date"
            type="date"
            label="To Date"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="loadOrders"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="rounded-2xl shadow-sm border border-border/50 bg-card overflow-hidden" elevation="0">
      <v-data-table-server
        v-model:options="tableOptions"
        :headers="headers"
        :items="orders"
        :items-length="totalOrders"
        :loading="loading"
        class="bg-transparent"
        @update:options="loadOrders"
        hover
      >
        <template #item.order_id="{ item }">
          <div class="font-mono text-sm font-semibold text-primary cursor-pointer hover:underline" @click="openDetails(item)">
            {{ item.order_id }}
          </div>
        </template>
        <template #item.user_id="{ item }">
          <div class="flex flex-col" v-if="item.user">
            <span class="font-medium text-text">{{ item.user.first_name }} {{ item.user.last_name }}</span>
            <span class="text-xs text-text/60">{{ item.user.username }}</span>
          </div>
          <span v-else class="font-medium text-text/80">ID: {{ item.user_id }}</span>
        </template>
        <template #item.created_at="{ item }">
          <span class="text-sm text-text/70">{{ formatDate(item.created_at) }}</span>
        </template>
        <template #item.total_price="{ item }">
          <span class="font-bold text-text">₹{{ item.total_price?.toLocaleString('en-IN') }}</span>
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            class="font-bold uppercase tracking-wider text-[10px]"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi:eye-outline" variant="text" size="small" color="primary" @click="openDetails(item)" />
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Order Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800" scrollable>
      <v-card class="rounded-3xl bg-card border border-white/20 shadow-2xl">
        <v-card-title class="flex justify-between items-center p-6 border-b border-border/50">
          <div>
            <h2 class="text-2xl font-black text-text">Order Details</h2>
            <p class="text-sm font-mono text-text/60 mt-1">{{ selectedOrder?.order_id }}</p>
          </div>
          <v-btn icon="mdi:close" variant="tonal" size="small" @click="detailsDialog = false" />
        </v-card-title>
        
        <v-card-text class="p-6" v-if="loadingDetails">
          <div class="flex justify-center items-center h-48">
            <v-progress-circular indeterminate color="primary" size="48" />
          </div>
        </v-card-text>

        <v-card-text class="p-6" v-else-if="selectedOrder">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="p-5 rounded-2xl bg-secondary/30 border border-border">
              <h3 class="text-xs font-bold uppercase tracking-widest text-text/50 mb-4">Summary</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between"><span class="text-text/70">Placed On</span><span class="font-medium text-text">{{ formatDate(selectedOrder.created_at) }}</span></div>
                <div class="flex justify-between"><span class="text-text/70">Payment Method</span><span class="font-bold text-text uppercase">{{ selectedOrder.payment_method }}</span></div>
                <div class="flex justify-between" v-if="selectedOrder.user">
                  <span class="text-text/70">Customer</span>
                  <div class="text-right">
                    <div class="font-medium text-text">{{ selectedOrder.user.first_name }} {{ selectedOrder.user.last_name }}</div>
                    <div class="text-xs text-text/60">{{ selectedOrder.user.username }}</div>
                  </div>
                </div>
                <div class="flex justify-between" v-else><span class="text-text/70">User ID</span><span class="font-medium text-text">{{ selectedOrder.user_id }}</span></div>
                <div class="flex justify-between text-base mt-2 pt-2 border-t border-border/50"><span class="font-bold text-text">Total</span><span class="font-black text-primary">₹{{ selectedOrder.total_price?.toLocaleString('en-IN') }}</span></div>
              </div>
            </div>
            
            <div class="p-5 rounded-2xl bg-secondary/30 border border-border">
              <h3 class="text-xs font-bold uppercase tracking-widest text-text/50 mb-4">Manage Status</h3>
              <v-select
                v-model="updateStatusValue"
                :items="['DRAFT', 'PENDING', 'ACCEPTED', 'PICKED', 'ONWAY', 'SHIPPED', 'DELIVERED', 'CANCELED', 'RECEIVED']"
                label="Current Status"
                variant="outlined"
                density="comfortable"
                hide-details
                class="mb-4"
              />
              <v-btn 
                block 
                color="primary" 
                size="large" 
                class="rounded-xl font-bold tracking-wide" 
                :loading="updatingStatus"
                @click="updateStatus"
              >
                Update Order Status
              </v-btn>
            </div>
          </div>

          <h3 class="text-lg font-bold text-text mb-4">Order Items</h3>
          <div class="space-y-4">
            <div v-for="item in selectedOrder.order_items" :key="item.id" class="flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 items-center">
              <div class="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary">
                <Icon name="mdi:package-variant-closed" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-text">{{ item.product_name_snapshot }}</h4>
                <p class="text-xs text-text/60 font-mono">SKU: {{ item.product_sku_snapshot }}</p>
              </div>
              <div class="text-right">
                <div class="font-bold text-text">₹{{ item.price_per_unit?.toLocaleString('en-IN') }}</div>
                <div class="text-xs text-text/60">Qty: {{ item.quantity }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useOrders } from '~/composables/useOrders'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

definePageMeta({ title: 'Manage Orders', layout: 'admin', middleware: ['auth-role'] })

const { getAdminOrders, getAdminOrderDetail, updateOrderStatus } = useOrders()

const loading = ref(true)
const orders = ref([])
const totalOrders = ref(0)
const tableOptions = ref({ page: 1, itemsPerPage: 10, sortBy: [] })

const filters = ref({
  search: '',
  status: null,
  from_date: null,
  to_date: null
})

const statusOptions = ['PENDING', 'ACCEPTED', 'PICKED', 'ONWAY', 'SHIPPED', 'DELIVERED', 'CANCELED', 'RECEIVED']

const headers = [
  { title: 'Order ID', key: 'order_id', align: 'start' },
  { title: 'Customer', key: 'user_id' },
  { title: 'Date', key: 'created_at' },
  { title: 'Total Amount', key: 'total_price' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false }
]

let searchTimeout = null
const debouncedLoad = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    tableOptions.value.page = 1
    loadOrders()
  }, 500)
}

const loadOrders = async () => {
  loading.value = true
  try {
    const params = {
      page: tableOptions.value.page,
      per_page: tableOptions.value.itemsPerPage,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.from_date && { from_date: dayjs(filters.value.from_date).startOf('day').toISOString() }),
      ...(filters.value.to_date && { to_date: dayjs(filters.value.to_date).endOf('day').toISOString() })
    }
    
    // Convert Vuetify sorting to API format
    if (tableOptions.value.sortBy.length) {
      const sort = tableOptions.value.sortBy[0]
      params.sort_by = sort.order === 'desc' ? `-${sort.key}` : sort.key
    }
    
    const res = await getAdminOrders(params)
    orders.value = res?.data || []
    totalOrders.value = res?.total || res?.data?.length || 0 // Provide fallback
  } catch (err) {
    console.error(err)
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
}

// Order Details Modal
const detailsDialog = ref(false)
const loadingDetails = ref(false)
const selectedOrder = ref(null)
const updateStatusValue = ref(null)
const updatingStatus = ref(false)

const openDetails = async (order) => {
  detailsDialog.value = true
  loadingDetails.value = true
  selectedOrder.value = null
  updateStatusValue.value = order.status
  try {
    const res = await getAdminOrderDetail(order.order_id)
    selectedOrder.value = res?.data
  } catch (err) {
    console.error(err)
    toast.error('Failed to load order details')
    detailsDialog.value = false
  } finally {
    loadingDetails.value = false
  }
}

const updateStatus = async () => {
  if (!selectedOrder.value || !updateStatusValue.value) return
  updatingStatus.value = true
  try {
    const res = await updateOrderStatus(selectedOrder.value.order_id, updateStatusValue.value)
    selectedOrder.value = res?.data || selectedOrder.value
    selectedOrder.value.status = updateStatusValue.value
    toast.success('Status updated successfully')
    loadOrders() // Refresh background table
  } catch (err) {
    console.error(err)
    toast.error('Failed to update status')
  } finally {
    updatingStatus.value = false
  }
}

const formatDate = (dateStr) => dateStr ? dayjs(dateStr).format('MMM D, YYYY - h:mm A') : 'N/A'

const getStatusColor = (status) => {
  if (!status) return 'grey'
  switch (status.toUpperCase()) {
    case 'DELIVERED': case 'RECEIVED': return 'success'
    case 'CANCELED': return 'error'
    case 'PENDING': case 'DRAFT': return 'warning'
    case 'ACCEPTED': case 'PICKED': return 'info'
    case 'SHIPPED': case 'ONWAY': return 'primary'
    default: return 'grey'
  }
}

onMounted(() => loadOrders())
</script>
