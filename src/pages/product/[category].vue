<template>
	
</template>

<script setup>
import cartApi from '~/api/cartApi'
import productApi from '~/api/productApi'

const route = useRoute()
const router = useRouter()

const category_name = route.params.category

const products = ref(null)
const loading = ref(true)
const error = ref(null)
const isFavorite = ref(false)
const { get_product_category_name } = productApi()

const fetchProduct = async () => {
	loading.value = true
	error.value = null

	try {
		const response = await get_product_category_name(category_name)
		products.value = response.data || response
	} catch (err) {
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
