<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">My Wishlist</h1>
          <p class="text-slate-500 text-sm mt-1">{{ items.length }} saved item(s)</p>
        </div>
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <div v-else-if="!items.length" class="text-center py-20">
        <Icon name="mdi:heart-outline" class="w-20 h-20 text-slate-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-slate-600 mb-2">Your wishlist is empty</h2>
        <p class="text-slate-400 mb-6">Save items you love for later</p>
        <v-btn color="primary" rounded="lg" size="large" to="/products">
          <Icon name="mdi:shopping-outline" class="mr-2" /> Browse Products
        </v-btn>
      </div>

      <v-row v-else>
        <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
          <v-card rounded="xl" class="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <div class="relative">
              <img :src="item.image_url || '/placeholder-product.png'" :alt="item.name"
                class="w-full h-48 object-cover bg-slate-100" />
              <v-btn icon size="small" color="error" class="absolute top-2 right-2 shadow"
                :loading="removing === item.product_id" @click="removeItem(item.product_id)">
                <Icon name="mdi:heart" />
              </v-btn>
            </div>
            <div class="pa-4">
              <h3 class="font-semibold text-sm mb-1 line-clamp-2">{{ item.name }}</h3>
              <p class="text-indigo-600 font-bold text-base mb-3">
                ₹{{ item.price?.toLocaleString('en-IN') }}
              </p>
              <v-btn block color="primary" rounded="lg" size="small" variant="outlined"
                :loading="addingToCart === item.product_id" @click="addToCart(item)">
                <Icon name="mdi:cart-plus" class="mr-1" /> Add to Cart
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({ title: 'My Wishlist', middleware: ['auth-role'], layout: 'default' })

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
