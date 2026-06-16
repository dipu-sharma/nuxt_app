<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">My Orders</h1>

      <!-- Filters -->
      <div class="flex gap-3 mb-6 flex-wrap">
        <v-select v-model="statusFilter" :items="statusOptions" label="Filter by Status" variant="outlined"
          rounded="lg" density="compact" hide-details style="max-width:200px" clearable />
        <v-text-field v-model="search" label="Search orders..." prepend-inner-icon="mdi:magnify"
          variant="outlined" rounded="lg" density="compact" hide-details style="max-width:260px"
          @update:model-value="debouncedFetch" />
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <!-- Empty -->
      <div v-else-if="!orders.length" class="text-center py-20">
        <Icon name="mdi:package-variant-closed" class="w-20 h-20 text-slate-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-slate-600 mb-2">No orders yet</h2>
        <p class="text-slate-400 mb-6">Start shopping to see your orders here</p>
        <v-btn color="primary" rounded="lg" size="large" to="/products">Shop Now</v-btn>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-4">
        <v-card v-for="order in orders" :key="order.id" rounded="xl" class="pa-5 cursor-pointer hover:shadow-md transition-shadow"
          @click="viewOrder(order)">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span class="font-bold text-base">#{{ order.order_number || order.id }}</span>
                <v-chip :color="statusColor(order.status)" size="small" variant="flat">{{ order.status }}</v-chip>
              </div>
              <p class="text-slate-500 text-sm">{{ formatDate(order.created_at) }}</p>
              <p class="text-sm mt-1">{{ order.items?.length || 0 }} item(s)</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-indigo-600">₹{{ order.total_amount?.toLocaleString('en-IN') }}</p>
              <p class="text-xs text-slate-400">{{ order.payment_method?.toUpperCase() }}</p>
            </div>
          </div>
        </v-card>

        <!-- Pagination -->
        <div class="flex justify-center mt-6">
          <v-pagination v-model="page" :length="totalPages" rounded @update:model-value="fetchOrders" />
        </div>
      </div>
    </div>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="640">
      <v-card v-if="selectedOrder" rounded="xl" class="pa-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-bold">#{{ selectedOrder.order_number || selectedOrder.id }}</h2>
            <p class="text-slate-500 text-sm">{{ formatDate(selectedOrder.created_at) }}</p>
          </div>
          <v-chip :color="statusColor(selectedOrder.status)" variant="flat">{{ selectedOrder.status }}</v-chip>
        </div>

        <!-- Order Items -->
        <div class="space-y-3 mb-6">
          <div v-for="item in selectedOrder.items" :key="item.id" class="flex gap-3 items-center">
            <img :src="item.image_url || '/placeholder-product.png'" :alt="item.name"
              class="w-12 h-12 object-cover rounded-lg bg-slate-100" />
            <div class="flex-1">
              <p class="font-medium text-sm">{{ item.name }}</p>
              <p class="text-slate-500 text-xs">Qty: {{ item.quantity }}</p>
            </div>
            <p class="font-semibold text-sm">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</p>
          </div>
        </div>

        <v-divider class="mb-4" />

        <!-- Totals -->
        <div class="space-y-2 text-sm mb-6">
          <div class="flex justify-between"><span class="text-slate-500">Subtotal</span><span>₹{{ selectedOrder.subtotal?.toLocaleString('en-IN') }}</span></div>
          <div v-if="selectedOrder.discount" class="flex justify-between text-green-600">
            <span>Discount</span><span>-₹{{ selectedOrder.discount?.toLocaleString('en-IN') }}</span>
          </div>
          <div class="flex justify-between font-bold text-base">
            <span>Total</span><span class="text-indigo-600">₹{{ selectedOrder.total_amount?.toLocaleString('en-IN') }}</span>
          </div>
        </div>

        <!-- Tracking -->
        <div v-if="tracking" class="bg-slate-50 rounded-xl p-4 mb-4">
          <h3 class="font-semibold mb-2 flex items-center gap-2">
            <Icon name="mdi:truck-outline" /> Tracking
          </h3>
          <p class="text-sm text-slate-600">{{ tracking.status }} — {{ tracking.location }}</p>
          <p class="text-xs text-slate-400 mt-1">{{ tracking.updated_at }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <v-btn v-if="['pending','processing'].includes(selectedOrder.status?.toLowerCase())"
            color="error" variant="outlined" rounded="lg" :loading="cancelling" @click="cancelOrder(selectedOrder.id)">
            Cancel Order
          </v-btn>
          <v-btn color="primary" variant="outlined" rounded="lg" :loading="loadingTracking"
            @click="loadTracking(selectedOrder.id)">
            <Icon name="mdi:map-marker-outline" class="mr-1" /> Track Order
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="detailDialog = false">Close</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

definePageMeta({ title: 'My Orders', middleware: ['auth-role'], layout: 'default' })

const loading = ref(false)
const orders = ref([])
const page = ref(1)
const totalPages = ref(1)
const search = ref('')
const statusFilter = ref(null)
const detailDialog = ref(false)
const selectedOrder = ref(null)
const tracking = ref(null)
const cancelling = ref(false)
const loadingTracking = ref(false)

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const statusColor = (s) => ({
  pending: 'warning', processing: 'info', shipped: 'primary',
  delivered: 'success', cancelled: 'error'
}[s?.toLowerCase()] || 'default')

const formatDate = (d) => dayjs(d).format('DD MMM YYYY, hh:mm A')

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchOrders, 400)
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const { getOrders } = useOrders()
    const res = await getOrders({ page: page.value, per_page: 10, search: search.value, status: statusFilter.value })
    orders.value = res?.data?.items || []
    totalPages.value = Math.ceil((res?.data?.total || 0) / 10)
  } catch { toast.error('Failed to load orders') }
  finally { loading.value = false }
}

const viewOrder = async (order) => {
  selectedOrder.value = order
  tracking.value = null
  detailDialog.value = true
}

const loadTracking = async (order_id) => {
  loadingTracking.value = true
  try {
    const { trackOrder } = useOrders()
    const res = await trackOrder(order_id)
    tracking.value = res?.data
  } catch { toast.error('Tracking info not available') }
  finally { loadingTracking.value = false }
}

const cancelOrder = async (order_id) => {
  cancelling.value = true
  try {
    const { cancelOrder: doCancel } = useOrders()
    await doCancel(order_id)
    toast.success('Order cancelled successfully')
    detailDialog.value = false
    fetchOrders()
  } catch { toast.error('Failed to cancel order') }
  finally { cancelling.value = false }
}

watch(statusFilter, fetchOrders)
onMounted(fetchOrders)
</script>
