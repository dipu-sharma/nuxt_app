<template>
  <div class="space-y-6">
    <!-- Elegant Header -->
    <div class="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-4xl sm:text-4xl font-semibold tracking-tight text-text mb-3">Purchase History</h1>
        <p class="text-text opacity-70 font-medium tracking-wide">
          Review and track your recent orders in one place.
        </p>
      </div>

      <!-- Minimalist Filter -->
      <div class="flex items-center gap-4">
        <div class="relative w-full md:w-64">
          <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
          <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search orders..."
            class="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" />
        </div>
      </div>
    </div>

    <!-- Organic Status Pills -->
    <div class="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
      <button v-for="status in ['All', ...statusOptions]" :key="status"
        @click="statusFilter = status === 'All' ? null : status"
        class="px-6 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 whitespace-nowrap border"
        :class="statusFilter === status || (status === 'All' && !statusFilter)
          ? 'bg-primary border-primary text-white shadow-md'
          : 'bg-transparent border-border text-text opacity-80 hover:bg-secondary'
          ">
        <span class="capitalize font-medium">{{ status }}</span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !orders.length" class="flex flex-col items-center justify-center py-32">
      <v-progress-circular indeterminate color="primary" :size="50" :width="2" class="mb-6 opacity-50" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!orders.length"
      class="text-center py-32 px-4 bg-card rounded-[3rem] border border-border shadow-sm">
      <div class="w-24 h-24 mx-auto mb-8 bg-secondary rounded-full flex items-center justify-center">
        <Icon name="mdi:leaf" class="w-10 h-10 text-primary opacity-70" />
      </div>
      <h2 class="text-2xl font-light text-text mb-4 tracking-tight">Your history is empty</h2>
      <p class="text-text opacity-60 max-w-sm mx-auto mb-10 font-medium leading-relaxed">
        You haven't made any purchases yet. Discover our curated collection.
      </p>
      <v-btn color="primary" rounded="pill" size="x-large" to="/products"
        class="px-12 text-none tracking-widest font-medium text-white shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_0_25px_rgba(var(--color-primary),0.5)] transition-all duration-300"
        elevation="0">
        EXPLORE SHOP
      </v-btn>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div v-for="(order, index) in orders" :key="order.id"
        class="group bg-card/60 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 cursor-pointer border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.15)] hover:-translate-y-1 hover:scale-[1.02] relative"
        @click="viewOrder(order)">
        <div class="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          <div class="flex items-center gap-6 w-full md:w-auto">
            <div
              class="w-16 h-16 flex-shrink-0 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:bg-primary/10 transition-colors duration-500">
              <Icon name="mdi:shopping-outline"
                class="w-6 h-6 text-text opacity-50 group-hover:text-primary transition-all group-hover:rotate-12 group-hover:scale-110 duration-500" />
            </div>
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-4 mb-2">
                <span class="text-xl font-medium tracking-tight text-text">#{{ order.order_number || order.id }}</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  :class="statusBadgeClass(order.status)">
                  {{ order.status }}
                </span>
              </div>
              <p class="text-sm text-text opacity-70 font-medium tracking-wide">
                {{ formatDate(order.created_at) }} <span class="mx-2 opacity-30">|</span>
                {{ order.items?.length || 0 }} Items
              </p>
            </div>
          </div>

          <div
            class="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-border pt-6 md:pt-0 mt-2 md:mt-0">
            <div class="text-left md:text-right">
              <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-1">
                Total
              </p>
              <p class="text-2xl font-light text-text tracking-tight">
                ₹{{ order.total_amount?.toLocaleString('en-IN') }}
              </p>
            </div>
            <div
              class="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white text-text opacity-50 transition-all duration-300">
              <Icon name="mdi:arrow-right" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-12 mb-8">
        <v-pagination v-model="page" :length="totalPages" rounded="circle" active-color="primary"
          @update:model-value="fetchOrders" />
      </div>
    </div>
  </div>

  <!-- Order Detail Dialog -->
  <v-dialog v-model="detailDialog" max-width="720" transition="dialog-bottom-transition">
    <v-card v-if="selectedOrder" class="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-background">
      <div class="px-8 py-8 md:px-12 md:py-10">
        <div class="flex justify-between items-start mb-10">
          <div>
            <p class="text-text opacity-50 font-medium mb-2 tracking-widest uppercase text-[10px]">
              Order Details
            </p>
            <h2 class="text-3xl font-semibold tracking-tight text-text mb-2">
              #{{ selectedOrder.order_number || selectedOrder.id }}
            </h2>
            <p class="text-text opacity-70 font-medium tracking-wide text-sm">
              {{ formatDate(selectedOrder.created_at) }}
            </p>
          </div>
          <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            :class="statusBadgeClass(selectedOrder.status)">
            {{ selectedOrder.status }}
          </span>
        </div>

        <!-- Order Items -->
        <div class="space-y-4 mb-10">
          <div v-for="item in selectedOrder.items" :key="item.id"
            class="flex gap-6 items-center p-4 rounded-2xl hover:bg-card transition-colors">
            <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 relative">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name"
                class="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
              <Icon v-else name="mdi:image-outline" class="w-8 h-8 absolute inset-0 m-auto text-text opacity-30" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-text truncate text-lg">{{ item.name }}</p>
              <p class="text-text opacity-70 text-sm font-medium tracking-wide mt-1">
                Qty: {{ item.quantity }} <span class="mx-2 opacity-30">×</span> ₹{{
                  item.price?.toLocaleString('en-IN')
                }}
              </p>
            </div>
            <p class="font-light text-xl text-text whitespace-nowrap pl-4">
              ₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}
            </p>
          </div>
        </div>

        <v-divider class="my-8 opacity-50 dark:opacity-20 border-border" />

        <!-- Totals -->
        <div class="mb-10 pl-4 pr-4 md:pl-28">
          <div class="space-y-4 text-sm font-medium tracking-wide text-text opacity-80">
            <div class="flex justify-between items-center">
              <span>Subtotal</span>
              <span class="text-text">₹{{ selectedOrder.subtotal?.toLocaleString('en-IN') }}</span>
            </div>
            <div v-if="selectedOrder.discount" class="flex justify-between items-center text-primary">
              <span>Discount</span>
              <span>-₹{{ selectedOrder.discount?.toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between items-end pt-4 border-t border-border mt-4">
              <span class="font-bold uppercase tracking-widest text-[10px] text-text opacity-50">Total</span>
              <span class="text-3xl font-light text-text tracking-tight">₹{{
                selectedOrder.total_amount?.toLocaleString('en-IN') }}</span>
            </div>
          </div>
        </div>

        <!-- Tracking Timeline -->
        <div v-if="tracking && tracking.tracking"
          class="bg-card rounded-3xl p-8 border border-border mb-10 relative overflow-hidden">
          <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-text opacity-70">Order Status:</span>
              <span class="font-bold ml-1">{{ tracking.order_status }}</span>
            </div>
            <div v-if="tracking.tracking.carrier">
              <span class="font-medium text-text opacity-70">Carrier:</span>
              <span class="font-bold ml-1">{{ tracking.tracking.carrier }}</span>
            </div>
            <div v-if="tracking.tracking.tracking_number">
              <span class="font-medium text-text opacity-70">Tracking #:</span>
              <span class="font-bold ml-1">{{ tracking.tracking.tracking_number }}</span>
            </div>
            <div v-if="tracking.tracking.tracking_url">
              <span class="font-medium text-text opacity-70">Tracking Link:</span>
              <a :href="tracking.tracking.tracking_url" target="_blank" class="text-primary hover:underline ml-1">View
                Details</a>
            </div>
            <div v-if="tracking.tracking.shipped_at">
              <span class="font-medium text-text opacity-70">Shipped At:</span>
              <span class="font-bold ml-1">{{ formatDate(tracking.tracking.shipped_at) }}</span>
            </div>
            <div v-if="tracking.tracking.estimated_delivery">
              <span class="font-medium text-text opacity-70">Est. Delivery:</span>
              <span class="font-bold ml-1">{{
                formatDate(tracking.tracking.estimated_delivery)
              }}</span>
            </div>
            <div v-if="tracking.tracking.delivered_at">
              <span class="font-medium text-text opacity-70">Delivered At:</span>
              <span class="font-bold ml-1">{{ formatDate(tracking.tracking.delivered_at) }}</span>
            </div>
          </div>
          <div v-if="tracking.tracking.notes" class="mt-4 pt-4 border-t border-border">
            <span class="font-medium text-text opacity-70 block mb-1">Notes:</span>
            <p class="text-sm opacity-90">{{ tracking.tracking.notes }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
          <v-btn variant="text" size="x-large"
            class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full"
            @click="detailDialog = false">
            Close
          </v-btn>
          <v-btn v-if="['pending', 'processing'].includes(selectedOrder.status?.toLowerCase())" color="error"
            variant="tonal" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium"
            :loading="cancelling" @click="cancelOrder(selectedOrder.order_id)">
            Cancel Order
          </v-btn>
          <v-btn color="primary" variant="flat" rounded="pill" size="x-large"
            class="flex-1 text-none tracking-widest font-medium text-white" :loading="loadingTracking"
            @click="loadTracking(selectedOrder.id)">
            Track Package
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import { useDebounceFn } from '@vueuse/core'

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

const statusOptions = ['pending', 'shipped', 'delivered', 'canceled']

const statusBadgeClass = (s) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]',
    processing: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border border-sky-200/50 shadow-[0_0_10px_rgba(56,189,248,0.2)]',
    shipped:
      'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]',
    delivered:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200/50 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  }
  return map[s?.toLowerCase()] || 'bg-secondary text-text opacity-80 border border-border'
}

const formatDate = (d) => (d ? dayjs(d).format('MMM DD, YYYY') : 'N/A')

const debouncedFetch = useDebounceFn(() => {
  fetchOrders()
}, 400)

const fetchOrders = async () => {
  loading.value = true
  try {
    const { getOrders } = useOrders()
    const res = await getOrders({
      page: page.value,
      per_page: 10,
      search: search.value,
      status: statusFilter.value,
    })

    const rawOrders = Array.isArray(res?.data) ? res.data : res?.data?.items || []
    orders.value = rawOrders.map((order) => {
      let computedSubtotal = 0
      let computedDiscount = 0

      const mappedItems = (order.items || order.order_items || []).map((item) => {
        const finalPrice = item.price || item.price_per_unit || 0
        const discountPct = item.product?.discount_percentage || 0
        // Calculate original price before the discount was applied
        const originalPrice = discountPct > 0 ? finalPrice / (1 - discountPct / 100) : finalPrice

        computedSubtotal += originalPrice * item.quantity
        computedDiscount += (originalPrice - finalPrice) * item.quantity

        return {
          ...item,
          price: finalPrice,
          name:
            item.product_name_snapshot ||
            item.product?.product_name ||
            item.name ||
            `Product #${item.product_id}`,
          image_url:
            item.product?.images?.[0]?.url ||
            item.product?.images?.[0]?.image_url ||
            item.product?.images?.[0] ||
            item.image_url ||
            null,
        }
      })

      const totalAmount = order.total_price || order.total_amount || 0

      return {
        ...order,
        order_number: order.order_number || order.order_id || `ord_${order.id}`,
        items: mappedItems,
        total_amount: totalAmount,
        subtotal: computedSubtotal > totalAmount ? computedSubtotal : totalAmount,
        discount: computedDiscount > 0 ? computedDiscount : order.discount || 0,
      }
    })

    const totalItems = res?.total || res?.data?.total || rawOrders.length
    totalPages.value = Math.ceil(totalItems / 10) || 1
  } catch (err) {
    console.error(err)
    toast.error('Failed to load orders')
  } finally {
    loading.value = false
  }
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
    // Use order_id string if available, fallback to numeric id
    const orderId = selectedOrder.value?.order_id || order_id
    const res = await trackOrder(orderId)
    tracking.value = res?.data || {}
  } catch {
    toast.error('Tracking info not available')
  } finally {
    loadingTracking.value = false
  }
}

const cancelOrder = async (order_id) => {
  cancelling.value = true
  try {
    const { cancelOrder: doCancel } = useOrders()
    await doCancel(order_id)
    toast.success('Order cancelled successfully')
    detailDialog.value = false
    fetchOrders()
  } catch {
    toast.error('Failed to cancel order')
  } finally {
    cancelling.value = false
  }
}

watch(statusFilter, fetchOrders)
onMounted(fetchOrders)
</script>

<style scoped></style>
