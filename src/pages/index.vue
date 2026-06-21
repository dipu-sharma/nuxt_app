<template>
  <div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30 py-8 lg:py-12">
    <!-- Abstract Cool Color Gradient Blobs -->
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-transparent rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
      
      <!-- Elegant Header Section -->
      <div class="mb-12 border-b border-border/50 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 leading-tight mb-3">
            Welcome to D-Shop
          </h1>
          <p class="text-text opacity-70 font-medium tracking-wide">
            Handcrafted & curated goods designed for your lifestyle.
          </p>
        </div>
        
        <router-link to="/products" class="relative group overflow-hidden rounded-[1.5rem] font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all h-12 px-8 flex items-center">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-transform duration-500 group-hover:scale-105"></div>
          <div class="relative z-10 flex items-center justify-center gap-2">
            BROWSE ALL PRODUCTS
          </div>
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Filter Card -->
        <aside class="lg:col-span-3">
          <div class="bg-card/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 sticky top-28 overflow-hidden relative">
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <h2 class="text-xl font-bold text-text tracking-tight mb-6 flex items-center gap-2 relative z-10">
              <Icon name="mdi:tune-variant" class="w-5 h-5 text-primary" />
              Filter Catalog
            </h2>

            <!-- Category Filter -->
            <div class="mb-8 relative z-10">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-3">
                Category
              </label>
              <div class="relative">
                <select v-model="selectedCategory"
                  class="w-full pl-5 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-text shadow-sm">
                  <option v-for="cat in categoriesList" :key="cat" :value="cat === 'All Categories' ? '' : cat">
                    {{ cat }}
                  </option>
                </select>
                <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-40 pointer-events-none w-5 h-5" />
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-4 relative z-10">
              <div class="flex justify-between items-center mb-4">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">
                  Price Limit
                </label>
                <span class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  ₹{{ amount_range[0] }} - ₹{{ amount_range[1] }}
                </span>
              </div>
              <v-range-slider
                v-model="amount_range"
                :min="1"
                :max="100000"
                :step="50"
                hide-details
                color="primary"
                track-color="secondary"
                thumb-color="primary"
                class="pt-2 px-1"
              />
            </div>
            
            <!-- Reset Filter Button -->
            <button v-if="selectedCategory || amount_range[0] > 10 || amount_range[1] < 100000"
              @click="resetFilters" 
              class="w-full mt-6 py-3 rounded-xl text-sm font-bold bg-secondary/50 text-text/70 hover:bg-primary hover:text-white transition-all shadow-sm relative z-10">
              Reset Filters
            </button>
          </div>
        </aside>

        <!-- Right Product Grid Section -->
        <main class="lg:col-span-9">
          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" 
            class="text-center py-24 px-6 bg-card/60 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
              <Icon name="mdi:leaf-outline" class="w-12 h-12 text-primary opacity-60" />
            </div>
            <h3 class="text-3xl font-bold text-text mb-3">No matching products</h3>
            <p class="text-text opacity-60 text-lg max-w-sm mx-auto">Try adjusting your category selection or expanding your price range limit.</p>
          </div>

          <!-- Products component -->
          <div v-else>
            <Product :products="filteredProducts" />
          </div>
        </main>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useProducts } from '~/composables/useProducts'

definePageMeta({
  title: 'Home',
  layout: 'default',
})

useSeoMeta({
  title: 'D-Shop - Premium Handcrafted Goods',
  description: 'Welcome to D-Shop. Explore our curated collection of premium, handcrafted products designed to elevate your lifestyle.',
  ogTitle: 'D-Shop - Premium Handcrafted Goods',
  ogDescription: 'Explore our curated collection of premium, handcrafted products designed to elevate your lifestyle.',
  ogImage: 'https://via.placeholder.com/1200x630.png?text=D-Shop+Premium+Store',
  twitterCard: 'summary_large_image',
})

const { fetchPublic } = useProducts()
const { data: productResponse } = await useAsyncData('homeProducts', () => fetchPublic().catch(() => null))

const products = computed(() => {
  return productResponse.value?.data?.items || productResponse.value?.data || []
})

const amount_range = ref([10, 100000])
const selectedCategory = ref('')

const categoriesList = computed(() => {
  const list = new Set()
  products.value.forEach(p => {
    const cat = p.category?.name || p.category_name
    if (cat) list.add(cat)
  })
  return ['All Categories', ...Array.from(list)]
})

const filteredProducts = computed(() => {
  let list = products.value
  
  list = list.filter(p => {
    const price = p.selling_price || p.price || 0
    return price >= amount_range.value[0] && price <= amount_range.value[1]
  })
  
  if (selectedCategory.value) {
    list = list.filter(p => {
      const catName = p.category?.name || p.category_name || ''
      return catName.toLowerCase() === selectedCategory.value.toLowerCase()
    })
  }
  
  return list
})

const resetFilters = () => {
  amount_range.value = [10, 100000]
  selectedCategory.value = ''
}
</script>

<style scoped>
</style>
