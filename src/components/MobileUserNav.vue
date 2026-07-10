<template>
  <div class="fixed bottom-0 left-0 w-full z-[100] lg:hidden">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isMenuOpen"
        @click="isMenuOpen = false"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        style="z-index: -1;"
      />
    </Transition>

    <!-- More Menu Drawer -->
    <Transition name="slide-up">
      <div
        v-if="isMenuOpen"
        class="absolute left-0 right-0 bottom-full bg-card/98 backdrop-blur-3xl border-t border-white/10 rounded-t-[2rem] shadow-[0_-20px_60px_rgba(0,0,0,0.3)]"
        style="max-height: 75vh; overflow-y: auto;"
      >
        <div class="p-5 pb-6">
          <div class="w-10 h-1 bg-text/20 rounded-full mx-auto mb-5 cursor-pointer" @click="isMenuOpen = false" />
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-base font-extrabold text-text tracking-tight">More Options</h3>
            <button @click="isMenuOpen = false" class="w-7 h-7 rounded-full bg-secondary/80 flex items-center justify-center">
              <Icon name="mdi:close" class="w-4 h-4 text-text/60" />
            </button>
          </div>
          <div class="grid grid-cols-3 gap-3">
            <NuxtLink to="/user?tab=address" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
              :class="isActive('address') ? 'bg-primary/15 border border-primary/30' : 'bg-secondary/40 border border-border/40'">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="isActive('address') ? 'bg-primary/20' : 'bg-cyan-500/10'">
                <Icon name="mdi:map-marker-outline" class="w-5 h-5" :class="isActive('address') ? 'text-primary' : 'text-cyan-500'" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Addresses</span>
            </NuxtLink>
            <NuxtLink to="/user?tab=security" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
              :class="isActive('security') ? 'bg-primary/15 border border-primary/30' : 'bg-secondary/40 border border-border/40'">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="isActive('security') ? 'bg-primary/20' : 'bg-amber-500/10'">
                <Icon name="mdi:lock-outline" class="w-5 h-5" :class="isActive('security') ? 'text-primary' : 'text-amber-500'" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Security</span>
            </NuxtLink>
            <NuxtLink to="/user?tab=sessions" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
              :class="isActive('sessions') ? 'bg-primary/15 border border-primary/30' : 'bg-secondary/40 border border-border/40'">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="isActive('sessions') ? 'bg-primary/20' : 'bg-violet-500/10'">
                <Icon name="mdi:devices" class="w-5 h-5" :class="isActive('sessions') ? 'text-primary' : 'text-violet-500'" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Devices</span>
            </NuxtLink>
            <NuxtLink to="/user/wishlist" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-border/40 transition-all active:scale-95">
              <div class="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Icon name="mdi:heart-outline" class="w-5 h-5 text-rose-500" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Wishlist</span>
            </NuxtLink>
            <NuxtLink to="/user/invoices" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-border/40 transition-all active:scale-95">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Icon name="mdi:file-document-outline" class="w-5 h-5 text-emerald-500" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Invoices</span>
            </NuxtLink>
            <NuxtLink to="/products" @click="isMenuOpen = false"
              class="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary/40 border border-border/40 transition-all active:scale-95">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Icon name="mdi:store-outline" class="w-5 h-5 text-indigo-500" />
              </div>
              <span class="text-[10px] font-bold text-text/80 tracking-wide">Shop</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Bottom Nav Bar -->
    <div class="bg-card/95 backdrop-blur-3xl border-t border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] pb-safe relative z-10">
      <div class="flex items-center justify-around px-1 pt-2 pb-1">
        <NuxtLink to="/user?tab=overview" @click="isMenuOpen = false"
          class="flex flex-col items-center justify-center w-14 gap-0.5 py-1 transition-all duration-200 active:scale-90"
          :class="isActive('overview') ? 'text-primary' : 'text-text/40'">
          <div class="relative">
            <div v-if="isActive('overview')" class="absolute inset-0 bg-primary/20 rounded-xl scale-150 blur-sm" />
            <Icon :name="isActive('overview') ? 'mdi:view-dashboard' : 'mdi:view-dashboard-outline'" class="w-6 h-6 relative" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-0.5">Home</span>
          <div v-if="isActive('overview')" class="w-1 h-1 rounded-full bg-primary mt-0.5" />
        </NuxtLink>

        <NuxtLink to="/user?tab=orders" @click="isMenuOpen = false"
          class="flex flex-col items-center justify-center w-14 gap-0.5 py-1 transition-all duration-200 active:scale-90"
          :class="isActive('orders') ? 'text-primary' : 'text-text/40'">
          <div class="relative">
            <div v-if="isActive('orders')" class="absolute inset-0 bg-primary/20 rounded-xl scale-150 blur-sm" />
            <Icon :name="isActive('orders') ? 'mdi:package-variant' : 'mdi:package-variant-closed'" class="w-6 h-6 relative" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-0.5">Orders</span>
          <div v-if="isActive('orders')" class="w-1 h-1 rounded-full bg-primary mt-0.5" />
        </NuxtLink>

        <!-- Cart (Floating Center Button) -->
        <NuxtLink to="/user/cart" @click="isMenuOpen = false"
          class="flex flex-col items-center justify-center w-16 -mt-5 transition-all duration-200 active:scale-90">
          <div class="w-14 h-14 rounded-[1.2rem] flex items-center justify-center shadow-xl transition-all duration-300"
               :class="route.path === '/user/cart'
                 ? 'bg-gradient-to-br from-indigo-500 to-primary text-white shadow-[0_4px_20px_rgba(var(--color-primary),0.5)] scale-110'
                 : 'bg-card border-2 border-border text-text hover:border-primary/60'">
            <Icon :name="route.path === '/user/cart' ? 'mdi:cart' : 'mdi:cart-outline'" class="w-6 h-6" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-1.5" :class="route.path === '/user/cart' ? 'text-primary' : 'text-text/40'">Cart</span>
        </NuxtLink>

        <NuxtLink to="/user?tab=profile" @click="isMenuOpen = false"
          class="flex flex-col items-center justify-center w-14 gap-0.5 py-1 transition-all duration-200 active:scale-90"
          :class="isActive('profile') ? 'text-primary' : 'text-text/40'">
          <div class="relative">
            <div v-if="isActive('profile')" class="absolute inset-0 bg-primary/20 rounded-xl scale-150 blur-sm" />
            <Icon :name="isActive('profile') ? 'mdi:account' : 'mdi:account-outline'" class="w-6 h-6 relative" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-0.5">Profile</span>
          <div v-if="isActive('profile')" class="w-1 h-1 rounded-full bg-primary mt-0.5" />
        </NuxtLink>

        <button @click="isMenuOpen = !isMenuOpen"
          class="flex flex-col items-center justify-center w-14 gap-0.5 py-1 transition-all duration-200 active:scale-90"
          :class="isMenuOpen ? 'text-primary' : 'text-text/40'">
          <div class="relative">
            <div v-if="isMenuOpen" class="absolute inset-0 bg-primary/20 rounded-xl scale-150 blur-sm" />
            <Icon :name="isMenuOpen ? 'mdi:close-circle' : 'mdi:dots-horizontal-circle-outline'" class="w-6 h-6 relative" />
          </div>
          <span class="text-[9px] font-bold tracking-wide mt-0.5">{{ isMenuOpen ? 'Close' : 'More' }}</span>
          <div v-if="isMenuOpen" class="w-1 h-1 rounded-full bg-primary mt-0.5" />
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }
</style>

