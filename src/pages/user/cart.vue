<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">My Cart</h1>
          <p class="text-slate-500 text-sm mt-1">{{ cartItems.length }} item(s) in your cart</p>
        </div>
        <v-btn v-if="cartItems.length" variant="outlined" color="error" prepend-icon="mdi:trash-can-outline"
          rounded="lg" @click="confirmClear">Clear Cart</v-btn>
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <!-- Empty State -->
      <div v-else-if="!cartItems.length" class="text-center py-20">
        <Icon name="mdi:cart-outline" class="w-20 h-20 text-slate-300 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-slate-600 mb-2">Your cart is empty</h2>
        <p class="text-slate-400 mb-6">Browse products and add items to your cart</p>
        <v-btn color="primary" rounded="lg" size="large" to="/products">
          <Icon name="mdi:shopping-outline" class="mr-2" /> Browse Products
        </v-btn>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <v-card v-for="item in cartItems" :key="item.product_id" rounded="xl" class="pa-4">
            <div class="flex gap-4">
              <img :src="item.image_url || '/placeholder-product.png'" :alt="item.name"
                class="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-100" />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-base truncate">{{ item.name }}</h3>
                <p class="text-slate-500 text-sm">{{ item.variant || '' }}</p>
                <p class="text-indigo-600 font-bold mt-1">₹{{ item.price?.toLocaleString('en-IN') }}</p>
              </div>
              <div class="flex flex-col items-end justify-between">
                <v-btn icon size="small" variant="text" color="error" @click="removeItem(item.product_id)">
                  <Icon name="mdi:close" />
                </v-btn>
                <!-- Quantity Controls -->
                <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                  <v-btn icon size="x-small" variant="text" :disabled="item.quantity <= 1"
                    @click="updateQty(item, item.quantity - 1)">
                    <Icon name="mdi:minus" />
                  </v-btn>
                  <span class="px-3 font-semibold text-sm">{{ item.quantity }}</span>
                  <v-btn icon size="x-small" variant="text" @click="updateQty(item, item.quantity + 1)">
                    <Icon name="mdi:plus" />
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Order Summary -->
        <div>
          <v-card rounded="xl" class="pa-6 sticky top-6">
            <h2 class="text-lg font-bold mb-4">Order Summary</h2>

            <!-- Coupon Code -->
            <div class="flex gap-2 mb-6">
              <v-text-field v-model="couponCode" label="Coupon Code" variant="outlined" rounded="lg"
                density="compact" hide-details class="flex-1" />
              <v-btn color="primary" rounded="lg" :loading="applyingCoupon" @click="applyCoupon">Apply</v-btn>
            </div>
            <v-chip v-if="discount > 0" color="success" closable @click:close="removeCoupon" class="mb-4">
              Coupon applied! -₹{{ discount }}
            </v-chip>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-500">Subtotal</span>
                <span class="font-medium">₹{{ subtotal.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{{ discount.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Shipping</span>
                <span class="font-medium text-green-600">Free</span>
              </div>
              <v-divider class="my-2" />
              <div class="flex justify-between text-base font-bold">
                <span>Total</span>
                <span class="text-indigo-600">₹{{ total.toLocaleString('en-IN') }}</span>
              </div>
            </div>

            <v-btn block color="primary" size="large" rounded="lg" class="mt-6"
              prepend-icon="mdi:credit-card-outline" @click="proceedToCheckout">
              Proceed to Checkout
            </v-btn>
            <v-btn block variant="text" class="mt-2" to="/products">Continue Shopping</v-btn>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Checkout Dialog -->
    <v-dialog v-model="checkoutDialog" max-width="520">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">Complete Your Order</h2>
        <v-select v-model="selectedAddress" :items="addresses" item-title="address_line1" item-value="id"
          label="Delivery Address" variant="outlined" rounded="lg" class="mb-4" />
        <v-radio-group v-model="paymentMethod" label="Payment Method" class="mb-4">
          <v-radio label="Cash on Delivery" value="cod" />
          <v-radio label="Online Payment" value="online" />
        </v-radio-group>
        <v-textarea v-model="orderNotes" label="Order Notes (optional)" variant="outlined" rounded="lg" rows="2" class="mb-4" />
        <div class="flex gap-3">
          <v-btn variant="text" @click="checkoutDialog = false">Cancel</v-btn>
          <v-btn color="primary" rounded="lg" flex-1 :loading="placingOrder" @click="placeOrder">
            Place Order — ₹{{ total.toLocaleString('en-IN') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({ title: 'My Cart', middleware: ['auth-role'], layout: 'default' })

const loading = ref(false)
const cartItems = ref([])
const addresses = ref([])
const couponCode = ref('')
const applyingCoupon = ref(false)
const discount = ref(0)
const appliedCouponId = ref(null)
const checkoutDialog = ref(false)
const selectedAddress = ref(null)
const paymentMethod = ref('cod')
const orderNotes = ref('')
const placingOrder = ref(false)

const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.quantity, 0))
const total = computed(() => Math.max(0, subtotal.value - discount.value))

const loadCart = async () => {
  loading.value = true
  try {
    const { getCart } = useCart()
    const res = await getCart()
    const rawItems = res?.data?.items || []
    cartItems.value = rawItems.map(item => ({
      product_id: item.product?.product_id,
      name: item.product?.product_name || item.product?.name,
      price: item.product?.selling_price || item.product?.price || 0,
      image_url: item.product?.images?.[0]?.url || item.product?.images?.[0]?.image_url || '',
      quantity: item.quantity,
      id: item.id
    }))
  } catch { toast.error('Failed to load cart') }
  finally { loading.value = false }
}

const loadAddresses = async () => {
  try {
    const { getAddresses } = useAddress()
    const res = await getAddresses()
    addresses.value = res?.data || []
    if (addresses.value.length) selectedAddress.value = addresses.value.find(a => a.is_default)?.id || addresses.value[0].id
  } catch {}
}

const removeItem = async (product_id) => {
  try {
    const { removeFromCart } = useCart()
    await removeFromCart(product_id)
    cartItems.value = cartItems.value.filter(i => i.product_id !== product_id)
    toast.success('Item removed')
  } catch { toast.error('Failed to remove item') }
}

const updateQty = async (item, qty) => {
  if (qty < 1) return
  try {
    const { syncCart } = useCart()
    item.quantity = qty
    await syncCart(cartItems.value.map(i => ({ product_id: i.product_id, quantity: i.quantity })))
  } catch { toast.error('Failed to update quantity') }
}

const confirmClear = async () => {
  try {
    const { clearCart } = useCart()
    await clearCart()
    cartItems.value = []
    toast.success('Cart cleared')
  } catch { toast.error('Failed to clear cart') }
}

const applyCoupon = async () => {
  if (!couponCode.value) return
  applyingCoupon.value = true
  try {
    const { validateCoupon } = useCoupons()
    const res = await validateCoupon(couponCode.value, subtotal.value)
    discount.value = res?.data?.discount_amount || 0
    toast.success(`Coupon applied! You save ₹${discount.value}`)
  } catch { toast.error('Invalid or expired coupon') }
  finally { applyingCoupon.value = false }
}

const removeCoupon = () => { couponCode.value = ''; discount.value = 0 }

const proceedToCheckout = () => {
  loadAddresses()
  checkoutDialog.value = true
}

const placeOrder = async () => {
  if (!selectedAddress.value) return toast.error('Please select a delivery address')
  placingOrder.value = true
  try {
    const { createOrder } = useOrders()
    const res = await createOrder({
      address_id: selectedAddress.value,
      payment_method: paymentMethod.value,
      coupon_code: couponCode.value || undefined,
      notes: orderNotes.value || undefined,
    })
    toast.success('Order placed successfully! 🎉')
    checkoutDialog.value = false
    navigateTo('/user/order')
  } catch { toast.error('Failed to place order. Please try again.') }
  finally { placingOrder.value = false }
}

onMounted(() => { loadCart(); loadAddresses() })
</script>