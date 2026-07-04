<template>
  <div>
    <p class="text-text opacity-60 text-base font-medium tracking-wide mb-5">{{ items.length }} saved item(s)</p>

    <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

    <div v-else-if="!items.length" class="text-center py-20 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem]">
      <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
        <Icon name="mdi:heart-outline" class="w-12 h-12 text-primary opacity-60" />
      </div>
      <h2 class="text-3xl font-bold text-text mb-3">Your wishlist is empty</h2>
      <p class="text-text opacity-60 mb-8 max-w-sm mx-auto text-lg">Save items you love for later</p>
      <v-btn color="primary" rounded="pill" size="x-large" to="/products" class="px-8 text-none tracking-widest font-medium text-white shadow-lg">
        <Icon name="mdi:shopping-outline" class="mr-2" /> Browse Products
      </v-btn>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="item in items" :key="item.id"
        class="bg-card/60 backdrop-blur-xl border border-white/20 shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
        <div class="relative h-48 bg-secondary/40 overflow-hidden">
          <img :src="item.image_url || '/placeholder-product.png'" :alt="item.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <button @click="removeItem(item.product_id)"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-lg">
            <Icon name="mdi:heart" class="w-5 h-5" />
          </button>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-text text-base line-clamp-2 mb-1">{{ item.name }}</h3>
          <p class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 mb-4">₹{{ item.price?.toLocaleString('en-IN') }}</p>
          <button @click="addToCart(item)"
            class="w-full py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 border border-primary/20">
            <Icon name="mdi:cart-plus" class="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({ title: 'My Wishlist', middleware: ['auth-role'], layout: 'user' })

const loading = ref(false)
const removing = ref(null)
const addingToCart = ref(null)
const items = ref([])

const fetch = async () => {
  loading.value = true
  try {
    const { getWishlist } = useWishlist()
    const res = await getWishlist()
    items.value = res?.data?.items || res?.data || []
  } catch { toast.error('Failed to load wishlist') }
  finally { loading.value = false }
}

const removeItem = async (product_id) => {
  removing.value = product_id
  try {
    const { removeFromWishlist } = useWishlist()
    await removeFromWishlist(product_id)
    items.value = items.value.filter(i => i.product_id !== product_id)
    toast.success('Removed from wishlist')
  } catch { toast.error('Failed to remove item') }
  finally { removing.value = null }
}

const addToCart = async (item) => {
  addingToCart.value = item.product_id
  try {
    const { addToCart: doAdd } = useCart()
    await doAdd(item.product_id, 1)
    toast.success(`${item.name} added to cart!`)
  } catch { toast.error('Failed to add to cart') }
  finally { addingToCart.value = null }
}

onMounted(fetch)
</script>
