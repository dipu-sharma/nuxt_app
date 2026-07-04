<template>
  <div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30 py-1 lg:py-12">
    <!-- Abstract Cool Color Gradient Blobs -->
    <div
      class="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-transparent rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none animate-blob">
    </div>
    <div
      class="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none animate-blob" style="animation-delay: 2s;">
    </div>
    <div
      class="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-rose-500/10 via-orange-500/10 to-transparent rounded-full blur-[100px] translate-y-1/3 pointer-events-none animate-blob" style="animation-delay: 4s;">
    </div>

    <div class="relative z-10 w-full px-4 sm:px-8 xl:px-12 pt-16">

      <!-- NEW HERO SECTION -->
      <div class="flex flex-col items-center justify-center text-center py-16 lg:py-24 relative">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-8 animate-fade-in-up">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          New Arrivals
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up-delay-1 max-w-4xl">
          Elevate Your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Lifestyle</span>
        </h1>
        
        <p class="text-lg md:text-xl text-text opacity-70 mb-10 max-w-2xl animate-fade-in-up-delay-2 leading-relaxed">
          Discover our handcrafted, premium collection of goods designed to bring beauty, function, and elegance to your everyday life.
        </p>
        
        <div class="flex gap-4 animate-fade-in-up" style="animation-delay: 0.6s;">
          <button @click="scrollToCatalog" class="relative group overflow-hidden rounded-[2rem] font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all h-14 px-10 flex items-center bg-gradient-to-r from-indigo-600 to-purple-600">
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span class="relative z-10">Shop Now</span>
          </button>
        </div>
      </div>

      <!-- Divider -->
      <div class="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-12 opacity-50"></div>
      
      <!-- Catalog Section Header -->
      <div id="catalog-section" class="mb-8 border-b border-border/50 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 class="text-3xl font-bold tracking-tight mb-2">Curated Collection</h2>
          <p class="text-text opacity-70 font-medium tracking-wide text-sm">
            Find exactly what you're looking for with our advanced filters.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <!-- Left Sidebar Filter Card -->
        <aside class="lg:col-span-2">
          <div
            class="bg-card/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 sticky top-28 overflow-hidden relative">
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none">
            </div>

            <h2 class="text-xl font-bold text-text tracking-tight mb-6 flex items-center gap-2 relative z-10">
              <Icon name="mdi:tune-variant" class="w-5 h-5 text-primary" />
              Filter Catalog
            </h2>

            <!-- Search Filter -->
            <div class="mb-6 relative z-10">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-3">
                Search
              </label>
              <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Search products..."
                  class="w-full pl-10 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text shadow-sm" />
                <Icon name="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
              </div>
            </div>

            <!-- Category Filter -->
            <div class="mb-8 relative z-10">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-3">
                Category
              </label>
              <div class="relative">
                <select v-model="selectedCategory"
                  class="w-full pl-5 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-text shadow-sm">
                  <option v-for="cat in categoriesList" :key="cat.category_id" :value="cat.category_id">
                    {{ cat.name }}
                  </option>
                </select>
                <Icon name="mdi:chevron-down"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-40 pointer-events-none w-5 h-5" />
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-4 relative z-10">
              <div class="flex justify-between items-center mb-4">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">
                  Price Limit
                </label>
                <span
                  class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  ₹{{ amount_range[0] }} - ₹{{ amount_range[1] }}
                </span>
              </div>
              <v-range-slider v-model="amount_range" :min="1" :max="100000" :step="50" hide-details color="primary"
                track-color="secondary" thumb-color="primary" class="pt-2 px-1" />
            </div>

            <!-- Reset Filter Button -->
            <button v-if="searchQuery || selectedCategory || amount_range[0] > 10 || amount_range[1] < 100000" @click="resetFilters"
              class="w-full mt-6 py-3 rounded-xl text-sm font-bold bg-secondary/50 text-text/70 hover:bg-primary hover:text-white transition-all shadow-sm relative z-10">
              Reset Filters
            </button>
          </div>
        </aside>

        <!-- Right Product Grid Section -->
        <main class="lg:col-span-8">
          <ClientOnly>
            <!-- Empty State -->
            <div v-if="filteredProducts.length === 0"
              class="text-center py-24 px-6 bg-card/60 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
              <div
                class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
                <Icon name="mdi:leaf" class="w-12 h-12 text-primary opacity-60" />
              </div>
              <h3 class="text-3xl font-bold text-text mb-3">No matching products</h3>
              <p class="text-text opacity-60 text-lg max-w-sm mx-auto">Try adjusting your category selection or expanding
                your price range limit.</p>
            </div>

            <!-- Products component -->
            <div v-else>
              <Product :products="filteredProducts" />
            </div>
            <template #fallback>
              <div class="flex justify-center p-12"><div class="animate-pulse font-bold text-primary">Loading products...</div></div>
            </template>
          </ClientOnly>
        </main>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useProducts } from '~/composables/useProducts'
import { useSearch } from '~/composables/useSearch'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  title: 'Home',
  layout: 'default',
})

useSeoMeta({
  title: 'D-Shop - Premium Handcrafted Goods',
  description: 'Welcome to D-Shop. Explore our curated collection of premium, handcrafted products designed to elevate your lifestyle.',
  ogTitle: 'D-Shop - Premium Handcrafted Goods',
  ogDescription: 'Discover our handcrafted & curated goods designed for your lifestyle.',
  twitterCard: 'summary_large_image',
})

const { fetchPublic } = useProducts()
const { getPublicCategories, getProductsByCategoryId } = useSearch()

const amount_range = ref([10, 100000])
const selectedCategory = ref('')
const searchQuery = ref('')

const fetchParams = computed(() => {
  const params = { limit: 50 }
  if (selectedCategory.value) params.category_id = selectedCategory.value
  if (searchQuery.value) params.search = searchQuery.value
  return params
})

const { data: productResponse, refresh } = await useAsyncData('homeProducts', () => {
  if (selectedCategory.value) {
    return getProductsByCategoryId({ category_id: selectedCategory.value, limit: 50 }).catch(() => null)
  }
  return fetchPublic(fetchParams.value).catch(() => null)
})

const categoriesData = ref([])

onMounted(async () => {
  try {
    const res = await getPublicCategories()
    categoriesData.value = res?.data || []
  } catch (e) {}

  if (products.value.length === 0) {
    refresh()
  }
})

// Debounce the refresh function so we don't spam the API on every keystroke
const debouncedRefresh = useDebounceFn(() => {
  refresh()
}, 500)

watch([searchQuery, selectedCategory], () => {
  debouncedRefresh()
})

const products = computed(() => {
  return productResponse.value?.data?.items || productResponse.value?.data || []
})

const categoriesList = computed(() => {
  const list = [{ category_id: '', name: 'All Categories' }]
  categoriesData.value.forEach(p => {
    const category_id = p.category_id || p.id || ''
    const name = p.name || p.category_name || (typeof p === 'string' ? p : '')
    if (category_id || name) list.push({ category_id, name })
  })
  return list
})

const filteredProducts = computed(() => {
  let list = products.value

  list = list.filter(p => {
    const price = p.selling_price || p.price || 0
    return price >= amount_range.value[0] && price <= amount_range.value[1]
  })

  return list
})

const resetFilters = () => {
  amount_range.value = [10, 100000]
  selectedCategory.value = ''
  searchQuery.value = ''
}

const scrollToCatalog = () => {
  const el = document.getElementById('catalog-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped></style>
