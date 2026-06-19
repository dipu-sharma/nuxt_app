<template>
  <div class="min-h-screen bg-background text-text py-12 px-4 sm:px-6 font-sans">
    <div class="max-w-7xl mx-auto">
      
      <!-- Elegant Header Section -->
      <div class="mb-12 border-b border-border pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl sm:text-5xl font-light tracking-tight text-text mb-3">
            Welcome to D-Shop
          </h1>
          <p class="text-text opacity-70 font-medium tracking-wide">
            Handcrafted & curated goods designed for your lifestyle.
          </p>
        </div>
        
        <v-btn color="primary" rounded="pill" size="large" to="/products" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
          BROWSE ALL PRODUCTS
        </v-btn>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Sidebar Filter Card -->
        <aside class="lg:col-span-3">
          <div class="bg-card rounded-[2.5rem] p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] sticky top-28">
            <h2 class="text-xl font-light text-text tracking-tight mb-6 flex items-center gap-2">
              <Icon name="mdi:tune-variant" class="w-5 h-5 text-primary" />
              Filter Catalog
            </h2>

            <!-- Category Filter -->
            <div class="mb-8">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-3">
                Category
              </label>
              <div class="relative">
                <select v-model="selectedCategory"
                  class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-text">
                  <option v-for="cat in categoriesList" :key="cat" :value="cat === 'All Categories' ? '' : cat">
                    {{ cat }}
                  </option>
                </select>
                <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-40 pointer-events-none w-5 h-5" />
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-4">
              <div class="flex justify-between items-center mb-4">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">
                  Price Limit
                </label>
                <span class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
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
              class="w-full mt-6 py-2.5 rounded-full text-xs font-medium border border-border text-text opacity-70 hover:bg-secondary transition-colors">
              Reset Filters
            </button>
          </div>
        </aside>

        <!-- Right Product Grid Section -->
        <main class="lg:col-span-9">
          <!-- Empty State -->
          <div v-if="filteredProducts.length === 0" 
            class="text-center py-24 px-6 bg-card rounded-[3rem] border border-border">
            <div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="mdi:leaf-outline" class="w-8 h-8 text-primary opacity-50" />
            </div>
            <h3 class="text-xl font-light text-text mb-2">No matching products</h3>
            <p class="text-text opacity-60 text-sm max-w-xs mx-auto">Try adjusting your category selection or expanding your price range limit.</p>
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
  description: 'Handcrafted products',
  layout: 'default',
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
