<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-semibold text-text tracking-tight mb-2">Order Management</h1>
        <p class="text-sm text-text/60 mt-1">View and manage all system orders</p>
      </div>

      <div
        v-if="(authStore.role === 'ADMIN' || authStore.role === 'SUPERADMIN') && businessesList.length > 0"
        class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
      >
        <span class="text-xs font-bold text-text/60 uppercase tracking-wider whitespace-nowrap">Filter Business:</span>
        <div class="relative min-w-[240px]">
          <select
            v-model="selectedBusinessId"
            @change="onFilterChange"
            class="appearance-none w-full pl-4 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
            style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))"
          >
            <option :value="null">All Businesses (Global)</option>
            <option
              v-for="biz in businessesList"
              :key="biz.id || biz.business_id"
              :value="biz.business_id || biz.id"
            >
              {{ biz.name || biz.business_name || `Business #${biz.business_id || biz.id}` }}
            </option>
          </select>
          <Icon
            name="mdi:chevron-down"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/50 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <v-card class="mb-6 rounded-2xl shadow-sm border border-border/50 bg-card" elevation="0">
      <v-card-text>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <v-text-field
            v-model="filters.search"
            label="Search Orders"
            prepend-inner-icon="mdi-magnify"
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
            @update:model-value="onFilterChange"
          />
          <v-text-field
            v-model="filters.from_date"
            type="date"
            label="From Date"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="onFilterChange"
          />
          <v-text-field
            v-model="filters.to_date"
            type="date"
            label="To Date"
            variant="outlined"
            density="comfortable"
            hide-details
            @update:model-value="onFilterChange"
          />
        </div>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card class="rounded-2xl shadow-sm border border-border/50 bg-card overflow-hidden" elevation="0">
      <div v-if="loading" class="p-12 text-center">
        <v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
      </div>
      
      <div v-else-if="orders.length === 0" class="p-16 text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-secondary/50 rounded-full flex items-center justify-center">
          <Icon name="mdi:clipboard-text-outline" class="w-8 h-8 text-text/40" />
        </div>
        <p class="text-text/60 text-sm font-medium">No orders found matching your criteria.</p>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="orders"
        :loading="loading"
        :items-per-page="limit"
        class="bg-transparent"
        hover
      >
        <template #bottom>
          <!-- Hide default navigation -->
        </template>

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
          <span class="font-bold text-text">₹{{ (item.total_price || item.total_amount || 0).toLocaleString('en-IN') }}</span>
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
          <v-btn icon="mdi-eye-outline" variant="text" size="small" color="primary" @click="openDetails(item)" />
        </template>
      </v-data-table>

      <!-- Cursor-Based Pagination Control -->
      <div v-if="orders.length > 0 || page > 1" class="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-border/50">
        <div class="flex items-center gap-4">
          <div class="text-xs font-bold uppercase tracking-widest text-text/70">
            Showing page {{ page }} ({{ orders.length }} rows)
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-text/70">Rows per page:</span>
            <select :value="limit" @change="updateLimit(Number($event.target.value))" 
              class="px-3 py-1 bg-background border border-border rounded-full text-xs font-semibold text-text focus:outline-none focus:border-primary cursor-pointer shadow-sm">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <v-btn
            variant="outlined"
            size="small"
            rounded="pill"
            :disabled="page <= 1 && !previousCursor"
            @click="goToPreviousPage"
            class="px-4 text-xs font-bold uppercase tracking-widest border-border text-text hover:bg-primary/5 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            <Icon name="mdi:chevron-left" class="w-4 h-4 mr-1" />
            Previous
          </v-btn>
          
          <div class="px-4 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
            Page {{ page }}
          </div>

          <v-btn
            variant="outlined"
            size="small"
            rounded="pill"
            :disabled="!hasMore && !nextCursor"
            @click="goToNextPage"
            class="px-4 text-xs font-bold uppercase tracking-widest border-border text-text hover:bg-primary/5 hover:text-primary hover:border-primary transition-all shadow-sm"
          >
            Next
            <Icon name="mdi:chevron-right" class="w-4 h-4 ml-1" />
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Order Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="800" scrollable>
      <v-card class="rounded-3xl bg-card border border-white/20 shadow-2xl">
        <v-card-title class="flex justify-between items-center p-6 border-b border-border/50">
          <div>
            <h2 class="text-2xl font-black text-text">Order Details</h2>
            <p class="text-sm font-mono text-text/60 mt-1">{{ selectedOrder?.order_id }}</p>
          </div>
          <v-btn icon="mdi-close" variant="tonal" size="small" @click="detailsDialog = false" />
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
import { useAdminUsers } from '~/composables/useAdminUsers'
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

const authStore = useAuthStore()

definePageMeta({ title: 'Manage Orders', layout: 'admin', middleware: ['auth-role'] })

const { getAdminOrders, getAdminOrderDetail, updateOrderStatus } = useOrders()

const loading = ref(true)
const orders = ref([])
const page = ref(1)
const limit = ref(10)
const nextCursor = ref(null)
const previousCursor = ref(null)
const hasMore = ref(false)
const cursorHistory = ref([null])

const businessesList = ref([])
const selectedBusinessId = ref(null)

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
    page.value = 1
    cursorHistory.value = [null]
    loadOrders()
  }, 500)
}

const onFilterChange = () => {
  page.value = 1
  cursorHistory.value = [null]
  loadOrders()
}

const loadOrders = async (cursor = null) => {
  loading.value = true
  try {
    const params = {
      limit: limit.value,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.status && { status: filters.value.status }),
      ...(filters.value.from_date && { from_date: dayjs(filters.value.from_date).startOf('day').toISOString() }),
      ...(filters.value.to_date && { to_date: dayjs(filters.value.to_date).endOf('day').toISOString() }),
      ...(selectedBusinessId.value && { business_id: selectedBusinessId.value })
    }
    const activeCursor = cursor !== null && cursor !== undefined ? cursor : (cursorHistory.value[page.value - 1] || null)
    if (activeCursor) {
      params.cursor = activeCursor
    }
    
    const res = await getAdminOrders(params)
    const data = res?.data || res || {}
    orders.value = data?.items || (Array.isArray(data) ? data : [])
    hasMore.value = !!data?.has_more
    nextCursor.value = data?.next_cursor || null
    previousCursor.value = data?.previous_cursor || null
    if (data?.limit && !isNaN(Number(data.limit))) {
      limit.value = Number(data.limit)
    }
  } catch (err) {
    console.error(err)
    toast.error('Failed to load orders')
    orders.value = []
    hasMore.value = false
    nextCursor.value = null
    previousCursor.value = null
  } finally {
    loading.value = false
  }
}

const updateLimit = (val) => {
  limit.value = val
  page.value = 1
  cursorHistory.value = [null]
  loadOrders()
}

const goToNextPage = () => {
  if (!hasMore.value && !nextCursor.value) return
  cursorHistory.value[page.value] = nextCursor.value
  page.value++
  loadOrders(nextCursor.value)
}

const goToPreviousPage = () => {
  if (page.value <= 1 && !previousCursor.value) return
  if (page.value > 1) {
    page.value--
    const prevCursor = cursorHistory.value[page.value - 1] || previousCursor.value || null
    loadOrders(prevCursor)
  } else if (previousCursor.value) {
    loadOrders(previousCursor.value)
  }
}

const loadBusinesses = async () => {
  if (authStore.role === 'ADMIN' || authStore.role === 'SUPERADMIN') {
    try {
      const { getBusinesses } = useAdminUsers()
      const bizRes = await getBusinesses({ limit: 100 })
      const resData =
        bizRes?.data?.items ||
        bizRes?.data?.data ||
        bizRes?.data ||
        (Array.isArray(bizRes) ? bizRes : [])
      businessesList.value = Array.isArray(resData) ? resData : []
    } catch (e) {
      console.error('Failed to resolve admin businesses', e)
    }
  }
}

// Order Details Modal
const detailsDialog = ref(false)
const loadingDetails = ref(false)
const selectedOrder = ref(null)
const selectedOrderId = ref(null)
const updateStatusValue = ref(null)
const updatingStatus = ref(false)

const openDetails = async (order) => {
  detailsDialog.value = true
  loadingDetails.value = true
  selectedOrder.value = null
  selectedOrderId.value = order.order_id || order.id
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
  const targetId = selectedOrder.value?.order_id || selectedOrderId.value
  if (!targetId || !updateStatusValue.value) return
  updatingStatus.value = true
  try {
    const res = await updateOrderStatus(targetId, updateStatusValue.value)
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

onMounted(async () => {
  await loadBusinesses()
  loadOrders()
})
</script>
