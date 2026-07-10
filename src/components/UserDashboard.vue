<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl border border-white/10 shadow-xl rounded-[2rem] p-6 sm:p-8 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-purple-500/5 pointer-events-none" />
      <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/10 via-indigo-500/5 to-transparent rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/8 to-transparent rounded-full blur-[60px] pointer-events-none" />
      <div class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">Dashboard Overview</p>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-3 flex-wrap">
            <span>Welcome back, {{ userFirstName }}!</span>
            <span class="text-3xl">👋</span>
          </h2>
          <p class="text-text/60 text-sm sm:text-base mt-2 max-w-xl">
            Here's what's happening with your account today.
          </p>
        </div>
        <NuxtLink to="/products"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all flex-shrink-0 self-start sm:self-auto">
          <Icon name="mdi:shopping-outline" class="w-4 h-4" /> Shop Now
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group cursor-default">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          :style="`background: radial-gradient(circle at top right, ${stat.glowColor}, transparent 70%)`" />
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center" :class="stat.iconBg">
              <Icon :name="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
            </div>
            <span v-if="!stat.loading" class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" :class="stat.badge">{{ stat.trend }}</span>
          </div>
          <p class="text-2xl sm:text-3xl font-black text-text tracking-tight">{{ stat.loading ? '...' : stat.value }}</p>
          <p class="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-text/50 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
      <!-- Recent Orders -->
      <div class="xl:col-span-2 bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg rounded-[2rem] p-5 sm:p-6 md:p-8">
        <div class="flex items-center justify-between mb-5 sm:mb-6">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-text">Recent Orders</h3>
            <p class="text-[11px] sm:text-xs text-text/50 font-medium mt-0.5">Your latest purchases at a glance</p>
          </div>
          <button @click="$emit('navigate', 'orders')"
            class="text-xs font-bold text-primary hover:underline flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/8 hover:bg-primary/15 transition-colors">
            View All <Icon name="mdi:arrow-right" class="w-3.5 h-3.5" />
          </button>
        </div>

        <div v-if="loadingOrders" class="space-y-3">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-16 sm:h-20 bg-card/80 rounded-2xl border border-border/50" />
          </div>
        </div>

        <div v-else-if="!recentOrders.length" class="text-center py-10 sm:py-12">
          <div class="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-secondary/60 flex items-center justify-center">
            <Icon name="mdi:package-variant-closed" class="w-7 h-7 sm:w-8 sm:h-8 text-text/30" />
          </div>
          <p class="text-text/50 font-medium text-sm">No orders yet</p>
          <p class="text-xs text-text/40 mt-1">Start shopping to see your orders here</p>
        </div>

        <div v-else class="space-y-2 sm:space-y-3">
          <div v-for="order in recentOrders" :key="order.id"
            class="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all duration-300 cursor-pointer group"
            @click="$emit('view-order', order)">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary/70 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
              <Icon name="mdi:receipt-text-outline" class="w-4 h-4 sm:w-5 sm:h-5 text-text/60 group-hover:text-primary transition-colors" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="font-semibold text-xs sm:text-sm text-text truncate">#{{ order.order_number || order.order_id || order.id }}</span>
                <span class="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex-shrink-0" :class="statusClass(order.status)">
                  {{ order.status }}
                </span>
              </div>
              <p class="text-[10px] sm:text-xs text-text/50">{{ formatDate(order.created_at) }} · {{ order.items?.length || 0 }} items</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-bold text-sm sm:text-base text-text">₹{{ (order.total_price || order.total_amount || 0).toLocaleString('en-IN') }}</p>
              <Icon name="mdi:chevron-right" class="w-4 h-4 text-text/30 ml-auto mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Activity -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg rounded-[2rem] p-6 md:p-8">
          <h3 class="text-lg font-bold text-text mb-5">Quick Actions</h3>
          <div class="space-y-3">
            <button @click="$emit('navigate', 'orders')"
              class="w-full flex items-center gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                <Icon name="mdi:package-variant-closed" class="w-5 h-5 text-indigo-500" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-text">My Orders</p>
                <p class="text-[10px] text-text/50 font-medium">Track & manage orders</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-text/30 ml-auto" />
            </button>

            <button @click="$emit('navigate', 'wishlist')"
              class="w-full flex items-center gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group">
              <div class="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                <Icon name="mdi:heart-outline" class="w-5 h-5 text-rose-500" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-text">Wishlist</p>
                <p class="text-[10px] text-text/50 font-medium">{{ stats[2].value }} saved items</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-text/30 ml-auto" />
            </button>

            <button @click="$emit('navigate', 'cart')"
              class="w-full flex items-center gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Icon name="mdi:cart-outline" class="w-5 h-5 text-emerald-500" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-text">Shopping Cart</p>
                <p class="text-[10px] text-text/50 font-medium">{{ stats[3].value }} items in cart</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-text/30 ml-auto" />
            </button>

            <NuxtLink to="/products"
              class="flex items-center gap-4 p-3.5 rounded-xl bg-background/50 border border-border/40 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md transition-all duration-300 group">
              <div class="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <Icon name="mdi:store-outline" class="w-5 h-5 text-cyan-500" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-text">Browse Products</p>
                <p class="text-[10px] text-text/50 font-medium">Explore our catalog</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-text/30 ml-auto" />
            </NuxtLink>
          </div>
        </div>

        <!-- Account Summary -->
        <div class="bg-card/60 backdrop-blur-xl border border-white/10 shadow-lg rounded-[2rem] p-6 md:p-8">
          <h3 class="text-lg font-bold text-text mb-5">Account</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="mdi:shield-check-outline" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <p class="text-sm font-bold text-text">Email Verified</p>
                <p class="text-[10px] text-text/50">{{ userEmail }}</p>
              </div>
              <Icon name="mdi:check-circle" class="w-5 h-5 text-emerald-500 ml-auto flex-shrink-0" />
            </div>
            <button @click="$emit('navigate', 'security')"
              class="w-full flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all group">
              <div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Icon name="mdi:key-outline" class="w-5 h-5 text-amber-500" />
              </div>
              <div class="text-left">
                <p class="text-sm font-bold text-text">Password & Security</p>
                <p class="text-[10px] text-text/50 font-medium">Update your credentials</p>
              </div>
              <Icon name="mdi:chevron-right" class="w-5 h-5 text-text/30 ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  orders: { type: Array, default: () => [] },
  loadingOrders: { type: Boolean, default: false },
  cartCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 },
  userFirstName: { type: String, default: 'Guest' },
  userEmail: { type: String, default: '' }
})

defineEmits(['navigate', 'view-order'])

const recentOrders = computed(() => props.orders.slice(0, 5))

const ordersSummary = computed(() => {
  const total = props.orders.length
  const pending = props.orders.filter(o => ['pending', 'processing'].includes(o.status?.toLowerCase())).length
  const delivered = props.orders.filter(o => o.status?.toLowerCase() === 'delivered').length
  return { total, pending, delivered }
})

const stats = computed(() => [
  {
    label: 'Total Orders', icon: 'mdi:package-variant-closed',
    value: ordersSummary.value.total,
    loading: props.loadingOrders,
    iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-500',
    glowColor: 'rgba(99,102,241,0.06)',
    trend: 'All time', badge: 'bg-indigo-500/10 text-indigo-500'
  },
  {
    label: 'Pending', icon: 'mdi:clock-outline',
    value: ordersSummary.value.pending,
    loading: props.loadingOrders,
    iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500',
    glowColor: 'rgba(245,158,11,0.06)',
    trend: 'Active', badge: 'bg-amber-500/10 text-amber-500'
  },
  {
    label: 'Wishlist', icon: 'mdi:heart-outline',
    value: props.wishlistCount,
    loading: false,
    iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500',
    glowColor: 'rgba(244,63,94,0.06)',
    trend: 'Saved', badge: 'bg-rose-500/10 text-rose-500'
  },
  {
    label: 'Cart Items', icon: 'mdi:cart-outline',
    value: props.cartCount,
    loading: false,
    iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500',
    glowColor: 'rgba(16,185,129,0.06)',
    trend: 'Ready', badge: 'bg-emerald-500/10 text-emerald-500'
  }
])

const statusClass = (s) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50',
    processing: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border border-sky-200/50',
    shipped: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200/50',
    delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200/50',
    accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50'
  }
  return map[s?.toLowerCase()] || 'bg-secondary text-text opacity-80 border border-border'
}

const formatDate = (d) => d ? dayjs(d).format('MMM DD, YYYY') : 'N/A'
</script>
