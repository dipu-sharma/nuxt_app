<template>
  <aside class="lg:col-span-4 xl:col-span-3">
    <div
      class="bg-card/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 relative overflow-hidden">
      <!-- Sidebar avatar summary -->
      <div class="flex flex-col items-center text-center pb-6 border-b border-border/50">
        <div class="relative group cursor-pointer mb-4" @click="triggerUpload">
          <div
            class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary/40 flex items-center justify-center relative shadow-inner">
            <img v-if="profileData?.avatar_url" :src="profileData.avatar_url" alt="Avatar"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <Icon v-else name="mdi:account" class="w-12 h-12 text-text opacity-40" />
          </div>
          <!-- Hover Edit Overlay -->
          <div
            class="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Icon name="mdi:camera" class="w-6 h-6 text-white" />
          </div>
        </div>
        <ClientOnly>
          <h3 class="font-extrabold text-lg text-text">
            {{ profileData?.first_name || authStore.user?.first_name || 'Guest' }} {{ profileData?.last_name || authStore.user?.last_name || '' }}
          </h3>
          <p class="text-text opacity-50 text-xs font-semibold mt-1">@{{ authStore.user?.username || 'user' }}</p>
          <template #fallback>
            <h3 class="font-extrabold text-lg text-text">Guest </h3>
            <p class="text-text opacity-50 text-xs font-semibold mt-1">@user</p>
          </template>
        </ClientOnly>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
      </div>

      <!-- Tab List Buttons -->
      <nav class="space-y-2 mt-6">
        <NuxtLink to="/user?tab=overview"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="isActive('overview')
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:view-dashboard-outline" class="w-5 h-5" />
          Overview
        </NuxtLink>

        <NuxtLink to="/user?tab=profile"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="isActive('profile')
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:account-outline" class="w-5 h-5" />
          Profile
        </NuxtLink>

        <NuxtLink to="/user?tab=address"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="isActive('address')
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:map-marker-outline" class="w-5 h-5" />
          Addresses
        </NuxtLink>

        <NuxtLink to="/user?tab=security"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="isActive('security')
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:lock-outline" class="w-5 h-5" />
          Security
        </NuxtLink>

        <NuxtLink to="/user?tab=orders"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="isActive('orders')
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
          Orders
        </NuxtLink>
      </nav>

      <!-- Divider -->
      <div class="my-4 border-t border-border/40" />

      <!-- Page Links -->
      <div class="space-y-1">
        <p class="px-4 text-[9px] font-black uppercase tracking-widest text-text/40 mb-2">Quick Access</p>
        <NuxtLink to="/user/cart"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all"
          :class="route.path === '/user/cart' ? 'bg-primary/10 text-primary' : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:cart-outline" class="w-5 h-5" />
          Shopping Cart
        </NuxtLink>
        <NuxtLink to="/user/wishlist"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all"
          :class="route.path === '/user/wishlist' ? 'bg-primary/10 text-primary' : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:heart-outline" class="w-5 h-5" />
          Wishlist
        </NuxtLink>
        <NuxtLink to="/user/invoices"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all"
          :class="route.path === '/user/invoices' ? 'bg-primary/10 text-primary' : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:file-document-outline" class="w-5 h-5" />
          Invoices
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  profileData: {
    type: Object,
    default: () => ({})
  },
  activeTab: {
    type: String,
    default: 'overview'
  }
})

const emit = defineEmits(['update:activeTab', 'handleImageUpload'])

const authStore = useAuthStore()
const route = useRoute()
const fileInput = ref(null)

const isActive = (tab) => {
  return route.path === '/user' && (route.query.tab === tab || (!route.query.tab && tab === 'overview'))
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event) => {
  emit('handleImageUpload', event)
}
</script>
