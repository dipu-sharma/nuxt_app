<template>
  <div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30 font-sans">
    <!-- Abstract Cool Color Gradient Blobs -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/20 via-purple-500/20 to-transparent rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-transparent rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none">
    </div>

    <!-- Sticky Search Header with Glassmorphism -->
    <div
      class="sticky top-0 z-20 py-6 px-4 sm:px-8 xl:px-12 bg-background/80 backdrop-blur-2xl border-b border-border/50 transition-all duration-300">
      <div class="w-full mx-auto flex flex-col sm:flex-row gap-4 items-center relative">
        <div class="relative flex-1 w-full group">
          <Icon name="mdi:magnify"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5 group-focus-within:text-primary group-focus-within:opacity-100 transition-colors" />
          <input v-model="query" @input="onSearchInput" @keyup.enter="doSearch" placeholder="Search our collection..."
            class="w-full pl-12 pr-10 py-4 bg-card/60 backdrop-blur-xl border border-white/20 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-text" />

          <!-- Autocomplete Dropdown -->
          <div v-if="suggestions.length && query.length > 1"
            class="absolute top-[calc(100%+12px)] left-0 right-0 rounded-[1.8rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-30 bg-card/95 backdrop-blur-2xl border border-white/20">
            <button v-for="s in suggestions" :key="s" @click="query = s; doSearch()"
              class="w-full px-6 py-4 text-left text-sm hover:bg-secondary transition-colors border-b last:border-b-0 border-border/40 flex items-center gap-3">
              <Icon name="mdi:magnify" class="w-4 h-4 opacity-40" />
              <span class="font-medium text-text">{{ s }}</span>
            </button>
          </div>
        </div>

        <button @click="doSearch"
          class="relative overflow-hidden rounded-full font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all h-14 px-10 w-full sm:w-auto flex-shrink-0 group">
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-transform duration-500 group-hover:scale-105">
          </div>
          <div class="relative z-10 flex items-center justify-center">SEARCH</div>
        </button>
      </div>
    </div>

    <div class="relative z-10 w-full mx-auto px-4 sm:px-8 xl:px-12 py-8">
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        <!-- Filters Sidebar -->
        <aside class="xl:col-span-2 2xl:col-span-2">
          <div
            class="bg-card/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-6 sticky top-36 overflow-hidden relative">
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none">
            </div>

            <h3 class="text-xl font-bold text-text tracking-tight mb-6 flex items-center gap-2 relative z-10">
              <Icon name="mdi:filter-variant" class="w-5 h-5 text-primary" />
              Filter By
            </h3>

            <!-- Category Filter -->
            <div class="mb-8 relative z-10">
              <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-3">Categories</p>
              <div class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                <button v-for="cat in categories" :key="cat.id || cat.name || cat"
                  @click="selectedCategory = selectedCategory === (cat.id || cat.name || cat) ? '' : (cat.id || cat.name || cat); doSearch()"
                  class="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent"
                  :class="selectedCategory === (cat.id || cat.name || cat)
                    ? 'bg-gradient-to-r from-indigo-600/10 to-cyan-500/10 border-indigo-500/20 text-indigo-600 shadow-sm'
                    : 'text-text opacity-70 hover:bg-secondary/80 hover:border-border'">
                  {{ cat.name || cat }}
                </button>
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="mb-6 relative z-10">
              <div class="flex justify-between items-center mb-4">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">
                  Price Limit
                </label>
                <span
                  class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  ₹{{ amount_range[0] }} - ₹{{ amount_range[1] }}
                </span>
              </div>
              <v-range-slider v-model="amount_range" :min="10" :max="100000" :step="50" hide-details color="primary"
                track-color="secondary" thumb-color="primary" class="pt-2 px-1 mb-6" />

              <button @click="doSearch"
                class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 transition-all text-center">
                Apply Price
              </button>
            </div>

            <!-- Clear -->
            <button @click="clearFilters"
              class="w-full py-3 rounded-xl text-sm font-bold bg-secondary/50 text-text/70 hover:bg-red-500 hover:text-white transition-all shadow-sm relative z-10">
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Products Area -->
        <main class="xl:col-span-10 2xl:col-span-10">

          <!-- Search Header States -->
          <div v-if="!query && !hasSearched" class="mb-4">
            <div class="mb-4" v-if="trending.length">
              <h2
                class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50 mb-4 flex items-center gap-2">
                <Icon name="mdi:fire" class="text-orange-500 w-4 h-4" />
                Trending Keywords
              </h2>
              <div class="flex flex-wrap gap-2.5">
                <button v-for="t in trending" :key="t" @click="query = t; doSearch()"
                  class="px-5 py-2.5 rounded-full text-xs bg-card/60 backdrop-blur-md border border-white/20 hover:border-primary/40 hover:bg-primary/5 transition-all font-bold text-text shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  {{ t }}
                </button>
              </div>
            </div>
            <h2
              class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 tracking-tight">
              Popular Products</h2>
          </div>

          <!-- Results count -->
          <div v-if="hasSearched"
            class="mb-8 text-sm text-text opacity-70 font-semibold bg-secondary/30 inline-block px-4 py-2 rounded-full border border-border/50">
            {{ products.length }} results found for <span class="text-primary font-bold">"{{ query || selectedCategory
              || 'Filters' }}"</span>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div v-for="i in 6" :key="i"
              class="bg-card/60 backdrop-blur-xl rounded-[2rem] overflow-hidden animate-pulse border border-white/20 shadow-lg">
              <div class="aspect-[4/3] w-full bg-secondary/80 relative overflow-hidden">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]">
                </div>
              </div>
              <div class="p-6 space-y-4">
                <div class="h-3 w-1/3 rounded-full bg-secondary" />
                <div class="h-5 w-3/4 rounded-full bg-secondary" />
                <div class="h-4 w-1/2 rounded-full bg-secondary" />
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="hasSearched && products.length === 0"
            class="text-center py-24 px-6 bg-card/60 backdrop-blur-2xl rounded-[3rem] border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
            <div
              class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
              <Icon name="mdi:magnify-close" class="w-12 h-12 text-primary opacity-60" />
            </div>
            <h3 class="text-3xl font-bold text-text mb-3">No products found</h3>
            <p class="text-text opacity-60 text-lg max-w-sm mx-auto">Try refining your keyword query or resetting
              categories.</p>
          </div>

          <!-- Products Catalog Component -->
          <div v-else>
            <Product :products="products" />

            <!-- Load More button -->
            <div v-if="hasMore" class="mt-16 text-center">
              <button @click="loadMore" :disabled="isLoadMoreLoading"
                class="relative group overflow-hidden rounded-[1.5rem] font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all h-14 px-12 inline-flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="relative z-10 flex items-center justify-center gap-2">
                  <Icon v-if="isLoadMoreLoading" name="mdi:loading" class="w-5 h-5 animate-spin" />
                  <span v-else>LOAD MORE PRODUCTS</span>
                </div>
              </button>
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

const query = ref(useRoute().query.query || useRoute().query.q || '')
const selectedCategory = ref(useRoute().query.category_id || useRoute().query.category || '')

useSeoMeta({
  title: computed(() => {
    if (query.value) return `Search results for "${query.value}" | D-Shop`
    if (selectedCategory.value) {
      const found = categories.value.find(c => c.id === selectedCategory.value || c.name === selectedCategory.value)
      return `${found ? found.name : selectedCategory.value} Products | D-Shop`
    }
    return 'Shop All Products | D-Shop'
  }),
  description: 'Browse our complete catalog of premium products. Find exactly what you are looking for at D-Shop.',
  ogTitle: computed(() => {
    if (query.value) return `Search results for "${query.value}" | D-Shop`
    if (selectedCategory.value) {
      const found = categories.value.find(c => c.id === selectedCategory.value || c.name === selectedCategory.value)
      return `${found ? found.name : selectedCategory.value} Products | D-Shop`
    }
    return 'Shop All Products | D-Shop'
  }),
  ogDescription: 'Browse our complete catalog of premium products. Find exactly what you are looking for at D-Shop.',
  twitterCard: 'summary_large_image',
})

const amount_range = ref([10, 100000])
const loading = ref(false)
const hasSearched = ref(false)
const products = ref([])
const suggestions = ref([])
const trending = ref([])
const categories = ref([])
const cursor = ref(null)
const hasMore = ref(false)
const isLoadMoreLoading = ref(false)

const extractArray = (res) => {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.products)) return res.products
  if (Array.isArray(res.items)) return res.items
  if (res.data) {
    if (Array.isArray(res.data.products)) return res.data.products
    if (Array.isArray(res.data.items)) return res.data.items
    if (Array.isArray(res.data.data)) return res.data.data
  }
  return []
}

const doSearch = async () => {
  loading.value = true
  hasSearched.value = true
  suggestions.value = []
  cursor.value = null
  hasMore.value = false
  try {
    if (!query.value && !selectedCategory.value && amount_range.value[0] === 10 && amount_range.value[1] === 100000) {
      const { getPopular } = useSearch()
      try {
        const res = await getPopular()
        products.value = extractArray(res)
        cursor.value = res?.data?.next_cursor || null
        hasMore.value = !!res?.data?.has_more
      } catch {
        products.value = []
      }
      return
    }

    const { searchProducts } = useSearch()
    const params = { limit: 20 }
    if (query.value) params.query = query.value
    if (selectedCategory.value) params.category_id = selectedCategory.value
    if (amount_range.value[0] > 10) params.min_price = amount_range.value[0]
    if (amount_range.value[1] < 100000) params.max_price = amount_range.value[1]

    try {
      const res = await searchProducts(params)
      products.value = extractArray(res)
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
    if (query.value) params.query = query.value
    if (selectedCategory.value) params.category_id = selectedCategory.value
    if (amount_range.value[0] > 10) params.min_price = amount_range.value[0]
    if (amount_range.value[1] < 100000) params.max_price = amount_range.value[1]

    const res = await searchProducts(params)
    const list = extractArray(res)
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
  amount_range.value = [10, 100000]
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

  const trend = trendRes.status === 'fulfilled'
    ? (trendRes.value?.data?.searches || trendRes.value?.data || [])
    : []

  const cats = catRes.status === 'fulfilled'
    ? extractArray(catRes.value)
    : []

  const pop = popRes.status === 'fulfilled'
    ? extractArray(popRes.value)
    : []

  return { trend, cats, pop }
})

trending.value = initialSearchData.value?.trend || []
categories.value = initialSearchData.value?.cats || []

products.value = extractArray(initialSearchData.value?.pop)
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
