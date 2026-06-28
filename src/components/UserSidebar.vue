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
        <h3 class="font-extrabold text-lg text-text">
          {{ profileData?.first_name || authStore.user?.first_name || 'Guest' }} {{ profileData?.last_name || authStore.user?.last_name || '' }}
        </h3>
        <p class="text-text opacity-50 text-xs font-semibold mt-1">@{{ authStore.user?.username || 'user' }}</p>
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
      </div>

      <!-- Tab List Buttons -->
      <nav class="space-y-2 mt-6">
        <button v-if="isIndexPage" @click="changeTab('overview')"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="activeTab === 'overview'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:view-dashboard-outline" class="w-5 h-5" />
          Overview
        </button>

        <button v-if="isIndexPage" @click="changeTab('profile')"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="activeTab === 'profile'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:account-outline" class="w-5 h-5" />
          Profile Details
        </button>

        <button v-if="isIndexPage" @click="changeTab('address')"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="activeTab === 'address'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:map-marker-outline" class="w-5 h-5" />
          Saved Addresses
        </button>

        <button v-if="isIndexPage" @click="changeTab('security')"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="activeTab === 'security'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:lock-outline" class="w-5 h-5" />
          Password & Security
        </button>

        <button v-if="isIndexPage" @click="changeTab('orders')"
          class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
          :class="activeTab === 'orders'
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'">
          <Icon name="mdi:package-variant-closed" class="w-5 h-5" />
          My Orders
        </button>
      </nav>
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

const isIndexPage = computed(() => {
  return route.path === '/user' || route.path === '/user/'
})

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event) => {
  emit('handleImageUpload', event)
}

const changeTab = (tab) => {
  emit('update:activeTab', tab)
}
</script>
