<template>
	
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/useProducts'

const route = useRoute()
const router = useRouter()

const category_name = route.params.category as string

const products = ref(null)
const loading = ref(true)
const error = ref(null)
const isFavorite = ref(false)
const { fetchPublic } = useProducts()

const fetchProduct = async () => {
	loading.value = true
	error.value = null

	try {
		const response = await fetchPublic(category_name)
		products.value = response.data || response
	} catch (err: any) {
		console.error('Failed to load product:', err)
		error.value = err.status === 404 ? 'Product not found' : 'Failed to load product details'
	} finally {
		loading.value = false
	}
}

watch(
	() => route.params.category,
	(newCategory, oldCategory) => {
		if (newCategory === oldCategory) return
		fetchProduct()
	},
	{ immediate: true },
)

const goBack = () => {
	router.back() 
}

const toggleFavorite = () => {
	isFavorite.value = !isFavorite.value
}
</script>

<style scoped>
/* Style */
</style>
