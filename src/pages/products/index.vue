<template>
	<div class="min-h-screen" style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text))">
		<!-- Search Header -->
		<div class="sticky top-0 z-10 py-4 px-6 shadow-sm" style="background-color: rgb(var(--color-card)); border-bottom: 1px solid rgb(var(--color-border))">
			<div class="max-w-6xl mx-auto flex gap-3">
				<div class="relative flex-1">
					<input v-model="query" @input="onSearchInput" @keyup.enter="doSearch"
						placeholder="Search products..."
						class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2"
						style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
					<svg class="absolute left-3 top-3 w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" />
					</svg>
					<!-- Autocomplete Dropdown -->
					<div v-if="suggestions.length && query.length > 1"
						class="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg overflow-hidden z-20"
						style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
						<button v-for="s in suggestions" :key="s"
							@click="query = s; doSearch()"
							class="w-full px-4 py-2.5 text-left text-sm hover:opacity-80 transition-opacity border-b last:border-b-0"
							style="border-color: rgb(var(--color-border))">
							🔍 {{ s }}
						</button>
					</div>
				</div>
				<button @click="doSearch" class="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
					style="background-color: rgb(var(--color-primary))">Search</button>
			</div>
		</div>

		<div class="max-w-6xl mx-auto p-6">
			<div class="flex gap-6">
				<!-- Filters Sidebar -->
				<aside class="hidden lg:block w-64 flex-shrink-0">
					<div class="rounded-xl p-5 sticky top-24" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
						<h3 class="font-semibold mb-4">Filters</h3>
						<!-- Category Filter -->
						<div class="mb-5">
							<p class="text-xs font-medium opacity-60 mb-2 uppercase tracking-wide">Category</p>
							<div class="space-y-1">
								<button v-for="cat in categories" :key="cat.id"
									@click="selectedCategory = cat.name; doSearch()"
									class="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors"
									:style="selectedCategory === cat.name
										? 'background-color: rgb(var(--color-primary)); color: white'
										: 'color: rgb(var(--color-text))'">
									{{ cat.name }}
								</button>
							</div>
						</div>
						<!-- Price Range -->
						<div class="mb-5">
							<p class="text-xs font-medium opacity-60 mb-2 uppercase tracking-wide">Price Range</p>
							<div class="flex gap-2 items-center">
								<input v-model="minPrice" type="number" placeholder="Min" class="w-full px-3 py-1.5 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
								<span class="opacity-40">—</span>
								<input v-model="maxPrice" type="number" placeholder="Max" class="w-full px-3 py-1.5 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<button @click="doSearch" class="w-full mt-2 py-1.5 rounded-lg text-xs font-medium text-white"
								style="background-color: rgb(var(--color-primary))">Apply</button>
						</div>
						<!-- Clear -->
						<button @click="clearFilters" class="w-full py-2 rounded-lg text-sm border opacity-70"
							style="border-color: rgb(var(--color-border))">Clear Filters</button>
					</div>
				</aside>

				<!-- Products Grid -->
				<div class="flex-1">
					<!-- Trending / Popular (no search) -->
					<div v-if="!query && !hasSearched">
						<div class="mb-8">
							<h2 class="text-lg font-semibold mb-4">🔥 Trending</h2>
							<div class="flex flex-wrap gap-2">
								<button v-for="t in trending" :key="t" @click="query = t; doSearch()"
									class="px-4 py-1.5 rounded-full text-sm border hover:opacity-80 transition-opacity"
									style="border-color: rgb(var(--color-border))">{{ t }}</button>
							</div>
						</div>
						<h2 class="text-lg font-semibold mb-4">⭐ Popular Products</h2>
					</div>

					<!-- Results count -->
					<div v-if="hasSearched" class="mb-4 text-sm opacity-60">
						{{ products.length }} results for "{{ query }}"
					</div>

					<!-- Loading -->
					<div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div v-for="i in 6" :key="i" class="rounded-xl overflow-hidden animate-pulse"
							style="background-color: rgb(var(--color-card))">
							<div class="h-48 w-full" style="background-color: rgb(var(--color-border))" />
							<div class="p-4 space-y-2">
								<div class="h-3 rounded" style="background-color: rgb(var(--color-border))" />
								<div class="h-3 w-2/3 rounded" style="background-color: rgb(var(--color-border))" />
							</div>
						</div>
					</div>

					<!-- Empty -->
					<div v-else-if="hasSearched && products.length === 0" class="text-center py-16 opacity-50">
						<div class="text-5xl mb-4">🔍</div>
						<p>No products found for "{{ query }}"</p>
					</div>

					<!-- Products -->
					<div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
						<NuxtLink v-for="product in products" :key="product.id" :to="`/product/${product.id}`"
							class="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow group"
							style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
							<div class="relative overflow-hidden h-48">
								<img v-if="product.images?.[0]?.url" :src="product.images[0].url" :alt="product.name"
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
								<div v-else class="w-full h-full flex items-center justify-center text-4xl"
									style="background-color: rgb(var(--color-background))">🛍️</div>
							</div>
							<div class="p-4">
								<p class="font-medium text-sm line-clamp-2">{{ product.name }}</p>
								<p class="text-xs opacity-50 mt-1">{{ product.category?.name || product.category_name }}</p>
								<div class="flex items-center justify-between mt-2">
									<p class="font-bold text-base" style="color: rgb(var(--color-primary))">${{ product.price }}</p>
									<div v-if="product.rating" class="text-xs opacity-60">⭐ {{ product.rating }}</div>
								</div>
							</div>
						</NuxtLink>
					</div>
					<!-- Load More -->
					<div v-if="hasMore" class="mt-8 text-center">
						<button @click="loadMore" :disabled="isLoadMoreLoading"
							class="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity disabled:opacity-50"
							style="background-color: rgb(var(--color-primary))">
							{{ isLoadMoreLoading ? 'Loading...' : 'Load More' }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
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
let autocompleteTimer = null

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

let debounceTimer = null
const onSearchInput = () => {
	clearTimeout(autocompleteTimer)
	clearTimeout(debounceTimer)
	
	if (query.value.length < 2) {
		suggestions.value = []
	} else {
		autocompleteTimer = setTimeout(async () => {
			try {
				const { autocomplete } = useSearch()
				const res = await autocomplete(query.value)
				suggestions.value = res?.data?.suggestions || res?.data || []
			} catch {
				suggestions.value = []
			}
		}, 300)
	}

	debounceTimer = setTimeout(doSearch, 600)
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
}

// SSR Data Initialization using useAsyncData
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

// Set layout references from SSR fetched data
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
