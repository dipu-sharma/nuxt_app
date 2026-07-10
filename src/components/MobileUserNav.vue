<template>
  <div class="fixed bottom-0 left-0 w-full z-[100] lg:hidden">
    <!-- Backdrop for Menu -->
    <div 
      v-if="isMenuOpen" 
      @click="isMenuOpen = false"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10"
    ></div>

    <!-- More Menu Drawer -->
    <div
      class="absolute left-0 right-0 bottom-full bg-card/95 backdrop-blur-3xl border-t border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-transform duration-300 transform -z-10"
      :class="isMenuOpen ? 'translate-y-0' : 'translate-y-full'"
      style="max-height: 80vh; overflow-y: auto;"
    >
      <div class="p-6 pb-8">
        <div class="w-12 h-1.5 bg-text/20 rounded-full mx-auto mb-6" @click="isMenuOpen = false"></div>
        <h3 class="text-lg font-bold text-text mb-4">More Options</h3>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink to="/user?tab=address" @click="isMenuOpen = false" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-primary/10 transition-colors">
            <Icon name="mdi:map-marker-outline" class="w-6 h-6 text-primary" />
            <span class="text-xs font-semibold text-text">Addresses</span>
          </NuxtLink>
          <NuxtLink to="/user?tab=security" @click="isMenuOpen = false" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-primary/10 transition-colors">
            <Icon name="mdi:lock-outline" class="w-6 h-6 text-primary" />
            <span class="text-xs font-semibold text-text">Security</span>
          </NuxtLink>
          <NuxtLink to="/user?tab=sessions" @click="isMenuOpen = false" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-primary/10 transition-colors">
            <Icon name="mdi:devices" class="w-6 h-6 text-primary" />
            <span class="text-xs font-semibold text-text">Devices</span>
          </NuxtLink>
          <NuxtLink to="/user/wishlist" @click="isMenuOpen = false" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-primary/10 transition-colors">
            <Icon name="mdi:heart-outline" class="w-6 h-6 text-primary" />
            <span class="text-xs font-semibold text-text">Wishlist</span>
          </NuxtLink>
          <NuxtLink to="/user/invoices" @click="isMenuOpen = false" class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-primary/10 transition-colors">
            <Icon name="mdi:file-document-outline" class="w-6 h-6 text-primary" />
            <span class="text-xs font-semibold text-text">Invoices</span>
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Bottom Nav Bar -->
    <div class="bg-card/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] pb-safe relative z-10">
      <div class="flex items-center justify-around px-2 py-3">
        <NuxtLink 
          to="/user?tab=overview" 
          class="flex flex-col items-center justify-center w-16 gap-1 transition-all"
          :class="isActive('overview') ? 'text-primary scale-110' : 'text-text/50 hover:text-text'"
          @click="isMenuOpen = false"
        >
          <Icon :name="isActive('overview') ? 'mdi:view-dashboard' : 'mdi:view-dashboard-outline'" class="w-6 h-6" />
          <span class="text-[9px] font-bold tracking-wide">Home</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/user?tab=orders" 
          class="flex flex-col items-center justify-center w-16 gap-1 transition-all"
          :class="isActive('orders') ? 'text-primary scale-110' : 'text-text/50 hover:text-text'"
          @click="isMenuOpen = false"
        >
          <Icon :name="isActive('orders') ? 'mdi:package-variant' : 'mdi:package-variant-closed'" class="w-6 h-6" />
          <span class="text-[9px] font-bold tracking-wide">Orders</span>
        </NuxtLink>

        <!-- Cart Button (Prominent) -->
        <NuxtLink 
          to="/user/cart" 
          class="flex flex-col items-center justify-center w-16 -mt-6 transition-all"
          @click="isMenuOpen = false"
        >
          <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all"
               :class="route.path === '/user/cart' ? 'bg-primary text-white scale-110 shadow-[0_0_15px_rgba(var(--color-primary),0.4)]' : 'bg-card border-2 border-border text-text hover:border-primary/50 hover:text-primary'">
            <Icon :name="route.path === '/user/cart' ? 'mdi:cart' : 'mdi:cart-outline'" class="w-6 h-6" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-1" :class="route.path === '/user/cart' ? 'text-primary' : 'text-text/50'">Cart</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/user?tab=profile" 
          class="flex flex-col items-center justify-center w-16 gap-1 transition-all"
          :class="isActive('profile') ? 'text-primary scale-110' : 'text-text/50 hover:text-text'"
          @click="isMenuOpen = false"
        >
          <Icon :name="isActive('profile') ? 'mdi:account' : 'mdi:account-outline'" class="w-6 h-6" />
          <span class="text-[9px] font-bold tracking-wide">Profile</span>
        </NuxtLink>
        
        <button 
          @click="isMenuOpen = !isMenuOpen" 
          class="flex flex-col items-center justify-center w-16 gap-1 transition-all"
          :class="isMenuOpen ? 'text-primary scale-110' : 'text-text/50 hover:text-text'"
        >
          <Icon :name="isMenuOpen ? 'mdi:close' : 'mdi:dots-horizontal'" class="w-6 h-6" />
          <span class="text-[9px] font-bold tracking-wide">{{ isMenuOpen ? 'Close' : 'More' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMenuOpen = ref(false)

const isActive = (tab) => {
  return route.path === '/user' && (route.query.tab === tab || (!route.query.tab && tab === 'overview'))
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
