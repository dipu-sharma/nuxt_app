<template>
  <div class="min-h-screen bg-background text-text font-sans">
    
    <!-- Sticky Search Header with Glassmorphism -->
    <div class="sticky top-0 z-10 py-6 px-4 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
          <input v-model="query" @input="onSearchInput" @keyup.enter="doSearch"
            placeholder="Search our collection..."
            class="w-full pl-12 pr-10 py-3.5 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-text" />
          
          <!-- Autocomplete Dropdown -->
          <div v-if="suggestions.length && query.length > 1"
            class="absolute top-full left-0 right-0 mt-3 rounded-[1.8rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden z-20 bg-card border border-border">
            <button v-for="s in suggestions" :key="s"
              @click="query = s; doSearch()"
              class="w-full px-6 py-3.5 text-left text-sm hover:bg-secondary transition-colors border-b last:border-b-0 border-border/40">
              🔍 <span class="ml-2 font-medium text-text">{{ s }}</span>
            </button>
          </div>
        </div>
        
        <v-btn color="primary" rounded="pill" size="x-large" @click="doSearch"
          class="px-8 text-none tracking-widest font-medium text-white shadow-sm w-full sm:w-auto" elevation="0">
          SEARCH
        </v-btn>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Filters Sidebar -->
        <aside class="lg:col-span-3">
          <div class="bg-card rounded-[2.5rem] p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] sticky top-28">
            <h3 class="text-xl font-light text-text tracking-tight mb-6 flex items-center gap-2">
              <Icon name="mdi:filter-variant" class="w-5 h-5 text-primary" />
              Filter By
            </h3>
            
            <!-- Category Filter -->
            <div class="mb-8">
              <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-3">Categories</p>
              <div class="space-y-1.5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <button v-for="cat in categories" :key="cat.id"
                  @click="selectedCategory = selectedCategory === cat.name ? '' : cat.name; doSearch()"
                  class="w-full text-left px-4 py-2.5 rounded-full text-sm transition-all duration-300"
                  :class="selectedCategory === cat.name
                    ? 'bg-primary text-white shadow-sm font-semibold'
                    : 'text-text opacity-70 hover:bg-secondary'">
                  {{ cat.name }}
                </button>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-3">Price Range</p>
              <div class="flex gap-2 items-center mb-4">
                <input v-model="minPrice" type="number" placeholder="Min" 
                  class="w-full px-4 py-2 bg-background border border-border rounded-full text-xs focus:outline-none focus:border-primary text-center text-text" />
                <span class="opacity-40 text-xs">—</span>
                <input v-model="maxPrice" type="number" placeholder="Max" 
                  class="w-full px-4 py-2 bg-background border border-border rounded-full text-xs focus:outline-none focus:border-primary text-center text-text" />
              </div>
              
              <v-btn color="primary" variant="outlined" rounded="pill" block size="small" class="text-none tracking-widest font-semibold" @click="doSearch">
                Apply Price
              </v-btn>
            </div>

            <!-- Clear -->
            <button @click="clearFilters" 
              class="w-full py-2.5 rounded-full text-xs font-medium border border-border text-text opacity-70 hover:bg-secondary transition-colors">
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Products Area -->
        <main class="lg:col-span-9">
          
          <!-- Search Header States -->
          <div v-if="!query && !hasSearched" class="mb-8">
            <div class="mb-8" v-if="trending.length">
              <h2 class="text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-3 flex items-center gap-1.5">
                <Icon name="mdi:fire" class="text-orange-550 w-4 h-4" />
                Trending Keywords
              </h2>
              <div class="flex flex-wrap gap-2">
                <button v-for="t in trending" :key="t" @click="query = t; doSearch()"
                  class="px-4 py-2 rounded-full text-xs border border-border hover:bg-secondary transition-all font-medium text-text">
                  {{ t }}
                </button>
              </div>
            </div>
            <h2 class="text-2xl font-light text-text tracking-tight">Popular Products</h2>
          </div>

          <!-- Results count -->
          <div v-if="hasSearched" class="mb-6 text-sm text-text opacity-70 font-medium">
            {{ products.length }} results found for <span class="text-text font-bold">"{{ query || selectedCategory || 'Filters' }}"</span>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i" class="bg-card rounded-[2rem] overflow-hidden animate-pulse border border-border">
              <div class="aspect-[4/3] w-full bg-secondary" />
              <div class="p-6 space-y-3">
                <div class="h-2.5 w-1/3 rounded bg-secondary" />
                <div class="h-4 rounded bg-secondary" />
                <div class="h-3 w-1/2 rounded bg-secondary" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="hasSearched && products.length === 0" 
            class="text-center py-24 px-6 bg-card rounded-[3rem] border border-border">
            <div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
              <Icon name="mdi:magnify-close" class="w-8 h-8 text-text opacity-30" />
            </div>
            <h3 class="text-xl font-light text-text mb-2">No products found</h3>
            <p class="text-text opacity-60 text-sm max-w-xs mx-auto">Try refining your keyword query or resetting categories.</p>
          </div>

          <!-- Products Catalog Component -->
          <div v-else>
            <Product :products="products" />
            
            <!-- Load More button -->
            <div v-if="hasMore" class="mt-12 text-center">
              <v-btn color="primary" variant="flat" rounded="pill" size="large" :loading="isLoadMoreLoading" @click="loadMore"
                class="px-10 text-none tracking-widest font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform" elevation="0">
                LOAD MORE
              </v-btn>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

definePageMeta({ title: 'Products', layout: 'default' })

const query = ref(useRoute().query.q || '')
const minPrice = ref('')
const maxPrice = ref('')
const selectedCategory = ref('')
const loading = ref(false)
const hasSearched = ref(false)
const products = ref([])
const suggestions = ref([])
const trending = ref([])
const categories = ref([])
const cursor = ref(null)
const hasMore = ref(false)
const isLoadMoreLoading = ref(false)

const doSearch = async () => {
  loading.value = true
  hasSearched.value = true
  suggestions.value = []
  cursor.value = null
  hasMore.value = false
  try {
    if (!query.value && !selectedCategory.value && !minPrice.value && !maxPrice.value) {
      const { getPopular } = useSearch()
      try {
        const res = await getPopular()
        products.value = res?.data?.products || res?.data?.items || res?.data || []
        cursor.value = res?.data?.next_cursor || null
        hasMore.value = !!res?.data?.has_more
      } catch {
        products.value = []
      }
      return
    }

    const { searchProducts } = useSearch()
    const params = { limit: 20 }
    if (query.value) params.q = query.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (minPrice.value) params.min_price = minPrice.value
    if (maxPrice.value) params.max_price = maxPrice.value

    try {
      const res = await searchProducts(params)
      products.value = res?.data?.products || res?.data?.items || res?.data || []
      cursor.value = res?.data?.next_cursor || null
      hasMore.value = !!res?.data?.has_more
    } catch {
      products.value = []
    }
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (isLoadMoreLoading.value || !hasMore.value) return
  isLoadMoreLoading.value = true
  try {
    const { searchProducts } = useSearch()
    const params = {
      limit: 20,
      cursor: cursor.value
    }
    if (query.value) params.q = query.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (minPrice.value) params.min_price = minPrice.value
    if (maxPrice.value) params.max_price = maxPrice.value

    const res = await searchProducts(params)
    const list = res?.data?.products || res?.data?.items || []
    products.value.push(...list)
    cursor.value = res?.data?.next_cursor || null
    hasMore.value = !!res?.data?.has_more
  } catch (err) {
    console.error('Failed to load more products:', err)
  } finally {
    isLoadMoreLoading.value = false
  }
}

const fetchAutocomplete = useDebounceFn(async (q) => {
  if (q.length < 2) { suggestions.value = []; return }
  try {
    const { autocomplete } = useSearch()
    const res = await autocomplete(q)
    suggestions.value = res?.data?.suggestions || res?.data || []
  } catch {
    suggestions.value = []
  }
}, 300)

const debouncedMainSearch = useDebounceFn(() => { doSearch() }, 600)

const onSearchInput = () => {
  if (query.value.length < 2) suggestions.value = []
  else fetchAutocomplete(query.value)
  
  debouncedMainSearch()
}

const clearFilters = () => {
  query.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  selectedCategory.value = ''
  hasSearched.value = false
  products.value = []
  cursor.value = null
  hasMore.value = false
  doSearch()
}

const { getTrending, getPublicCategories, getPopular } = useSearch()
const { data: initialSearchData } = await useAsyncData('initial-search-data', async () => {
  const [trendRes, catRes, popRes] = await Promise.allSettled([
    getTrending(),
    getPublicCategories(),
    getPopular()
  ])
  
  const trend = trendRes.status === 'fulfilled' && trendRes.value?.data?.length
    ? trendRes.value.data
    : []
    
  const cats = catRes.status === 'fulfilled'
    ? (catRes.value.value?.data?.items || catRes.value.value?.data || [])
    : []
    
  const pop = popRes.status === 'fulfilled'
    ? popRes.value.value?.data || {}
    : null
    
  return { trend, cats, pop }
})

trending.value = initialSearchData.value?.trend || []
categories.value = initialSearchData.value?.cats || []

const initialProductsList = initialSearchData.value?.pop?.products || initialSearchData.value?.pop?.items || initialSearchData.value?.pop || []
products.value = initialProductsList
cursor.value = initialSearchData.value?.pop?.next_cursor || null
hasMore.value = !!initialSearchData.value?.pop?.has_more

onMounted(() => {
  if (query.value) doSearch()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e7e5e4;
  border-radius: 9999px;
}
</style>
