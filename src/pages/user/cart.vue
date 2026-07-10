<template>
  <div class="text-text">
    <div class="flex items-center justify-between mb-4 sm:mb-5">
      <p class="text-text opacity-60 text-sm sm:text-base font-medium tracking-wide">{{ cartItems.length }} item(s) waiting for you</p>
      <button v-if="cartItems.length" @click="confirmClear"
        class="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center gap-1 sm:gap-2 shadow-sm">
        <Icon name="mdi:trash-can-outline" class="w-4 h-4 sm:w-4 sm:h-4" /> <span class="hidden sm:inline">Clear Cart</span><span class="sm:hidden">Clear</span>
      </button>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
      <div class="relative">
        <div class="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <div class="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse" />
      </div>
    </div>

    <div v-else-if="!cartItems.length"
      class="text-center py-24 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[3rem]">
      <div class="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-6 shadow-inner border border-white/10">
        <Icon name="mdi:cart-outline" class="w-12 h-12 text-primary opacity-60" />
      </div>
      <h2 class="text-3xl font-bold text-text mb-3">Your cart is empty</h2>
      <p class="text-text opacity-60 mb-8 max-w-sm mx-auto text-lg">Looks like you haven't added anything yet. Let's find something special!</p>
      <NuxtLink to="/" class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all text-lg">
        <Icon name="mdi:shopping-outline" class="w-6 h-6" /> Browse Collection
      </NuxtLink>
    </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Items List -->
        <div class="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6">
          <div v-for="item in cartItems" :key="item.product_id"
            class="bg-card/60 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5 rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 flex flex-row gap-3 sm:gap-6 transition-all hover:shadow-xl group">
            <div
              class="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-secondary/30 rounded-[1rem] sm:rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <img v-if="item.image_url || item.url || item.image" :src="item.image_url || item.url || item.image"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <Icon v-else name="mdi:image-outline" class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div class="flex justify-between items-start gap-2">
                <div>
                  <h3 class="font-bold text-sm sm:text-xl text-text line-clamp-2 leading-tight mb-0.5 sm:mb-1">{{ item.name }}</h3>
                  <p class="text-text opacity-50 text-[11px] sm:text-sm font-medium">{{ item.variant || '' }}</p>
                </div>
                <button @click="removeItem(item.id)"
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon name="mdi:close" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              <!-- Stock Warning -->
              <div v-if="item.quantity > item.total_available_quantity"
                class="mt-2 text-xs font-bold text-red-500 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                <Icon name="mdi:alert-circle-outline" class="w-4 h-4 flex-shrink-0" />
                <span>Only {{ item.total_available_quantity }} units available. Please reduce quantity or remove
                  item.</span>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-4 mt-2 sm:mt-auto sm:pt-4">
                <span
                  class="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">₹{{
                    item.price?.toLocaleString('en-IN') }}</span>

                <!-- Quantity Controls -->
                <div
                  class="flex items-center bg-background border border-border/60 rounded-full overflow-hidden shadow-inner p-1">
                  <button :disabled="item.quantity <= 1" @click="updateQty(item, item.quantity - 1)"
                    class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-text hover:bg-secondary disabled:opacity-30 disabled:hover:bg-transparent transition-colors">
                    <Icon name="mdi:minus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <span class="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm">{{ item.quantity }}</span>
                  <button @click="updateQty(item, item.quantity + 1)"
                    class="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-text hover:bg-secondary transition-colors">
                    <Icon name="mdi:plus" class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-5 xl:col-span-4 sticky top-8">
          <div
            class="bg-card/80 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 relative overflow-hidden">
            <div
              class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none">
            </div>

            <h2 class="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-text">Order Summary</h2>

            <!-- Coupon Code -->
            <div class="mb-8">
              <p class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50 mb-3">Promo Code</p>
              <div class="flex gap-2">
                <input v-model="couponCode" type="text" placeholder="Enter code"
                  class="flex-1 bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
                <button @click="applyCoupon" :disabled="applyingCoupon"
                  class="px-6 py-3 bg-secondary text-text font-bold rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50">
                  <span v-if="!applyingCoupon">Apply</span>
                  <Icon v-else name="mdi:loading" class="w-5 h-5 animate-spin" />
                </button>
              </div>
              <div v-if="discount > 0"
                class="mt-3 flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2.5 text-green-600 text-sm font-semibold">
                <span class="flex items-center gap-2">
                  <Icon name="mdi:check-circle" /> Coupon Applied!
                </span>
                <button @click="removeCoupon" class="hover:text-green-800">
                  <Icon name="mdi:close" />
                </button>
              </div>
            </div>

            <div class="space-y-4 text-sm font-medium border-t border-border/50 pt-6">
              <div class="flex justify-between text-text/70">
                <span>Subtotal</span>
                <span>₹{{ subtotal.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="discount > 0" class="flex justify-between text-emerald-500">
                <span>Discount</span>
                <span>-₹{{ discount.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between text-text/70">
                <span>Shipping</span>
                <span
                  class="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Free</span>
              </div>
            </div>

            <div class="border-t border-border/50 mt-6 pt-6">
              <div class="flex justify-between items-end">
                <span class="text-text opacity-70 font-semibold uppercase tracking-widest text-xs">Total Amount</span>
                <span
                  class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">₹{{
                    total.toLocaleString('en-IN') }}</span>
              </div>
            </div>

            <button @click="proceedToCheckout" :disabled="hasOutOfStockItems"
              class="w-full mt-8 relative group overflow-hidden rounded-[1.5rem] font-bold text-lg text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all h-14 disabled:opacity-50 disabled:pointer-events-none">
              <div
                class="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 transition-transform duration-500 group-hover:scale-105">
              </div>
              <div class="relative flex items-center justify-center gap-2 h-full">
                Checkout
                <Icon name="mdi:arrow-right" class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <router-link to="/"
              class="block text-center mt-6 text-sm font-bold text-text opacity-50 hover:opacity-100 hover:text-primary transition-colors tracking-wide">
              ← Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Dialog -->
    <v-dialog v-model="checkoutDialog" max-width="600" :fullscreen="$vuetify.display.smAndDown" persistent>
      <div v-if="paymentStep === 1" class="bg-card/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-t-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 h-full flex flex-col">
        <h2 class="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 text-text flex items-center gap-3 mt-4 sm:mt-0">
          <Icon name="mdi:lock-outline" class="text-primary w-6 h-6 sm:w-8 sm:h-8" /> Secure Checkout
        </h2>

        <div class="space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Delivery
              Address</label>
            <v-select v-model="selectedAddress" :items="addresses" item-title="address_line1" item-value="id"
              placeholder="Select your address" variant="outlined" rounded="lg" hide-details />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Payment
              Method</label>
            <div class="grid grid-cols-2 gap-4">
              <button @click="paymentMethod = 'COD'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-semibold text-center"
                :class="paymentMethod === 'COD' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text/70 hover:border-primary/30'">
                <Icon name="mdi:cash" class="w-6 h-6 mb-1" /> Cash on Delivery
              </button>
              <button @click="paymentMethod = 'UPI'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-semibold text-center"
                :class="paymentMethod === 'UPI' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text/70 hover:border-primary/30'">
                <Icon name="mdi:qrcode" class="w-6 h-6 mb-1" /> UPI Payment
              </button>
              <button @click="paymentMethod = 'DEBIT_CARD'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-semibold text-center"
                :class="paymentMethod === 'DEBIT_CARD' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text/70 hover:border-primary/30'">
                <Icon name="mdi:credit-card-outline" class="w-6 h-6 mb-1" /> Debit Card
              </button>
              <button @click="paymentMethod = 'CREDIT_CARD'"
                class="p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-sm font-semibold text-center"
                :class="paymentMethod === 'CREDIT_CARD' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text/70 hover:border-primary/30'">
                <Icon name="mdi:credit-card-check-outline" class="w-6 h-6 mb-1" /> Credit Card
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Order Notes
              (Optional)</label>
            <textarea v-model="orderNotes" rows="2" placeholder="Any special instructions?"
              class="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text resize-none"></textarea>
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 mb-4 sm:mb-0">
          <button @click="cancelCheckout"
            class="px-6 py-3.5 rounded-xl font-bold text-text/70 hover:bg-secondary transition-colors w-full sm:w-auto">
            Cancel
          </button>
          <button @click="placeOrder" :disabled="placingOrder"
            class="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 py-3.5">
          <Icon v-if="placingOrder" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <span v-else>Confirm & Pay ₹{{ total.toLocaleString('en-IN') }}</span>
          </button>
        </div>
      </div>

      <div v-else-if="paymentStep === 2" class="bg-card border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-xl p-5 sm:p-8 h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto relative animate-[scaleIn_0.3s_ease-out] flex flex-col">
        <h2 class="text-xl sm:text-2xl font-black text-text mb-4 sm:mb-6 flex items-center gap-2 mt-4 sm:mt-0">
          <Icon name="mdi:credit-card-outline" class="text-primary w-6 h-6 sm:w-8 sm:h-8" /> Complete Payment
        </h2>
        
        <div id="payment-element" class="min-h-[250px] mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border border-border bg-background">
          <div v-if="!elementsObj" class="flex justify-center items-center h-[200px]">
             <Icon name="mdi:loading" class="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>

        <div class="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-auto sm:mt-8 pt-4 sm:pt-0 mb-4 sm:mb-0">
          <button @click="cancelCheckout"
            class="px-6 py-3.5 rounded-xl font-bold text-text/70 hover:bg-secondary transition-colors w-full sm:w-auto">
            Cancel
          </button>
          <button @click="confirmOnlinePayment" :disabled="processingPayment || !elementsObj"
            class="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all flex items-center justify-center gap-2 py-3.5">
            <Icon v-if="processingPayment" name="mdi:loading" class="w-5 h-5 animate-spin" />
            <span v-else>Pay ₹{{ total.toLocaleString('en-IN') }}</span>
          </button>
        </div>
      </div>
    </v-dialog>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '~/composables/useCart'
import { useCoupons } from '~/composables/useCoupons'
import { useOrders } from '~/composables/useOrders'
import { useAddress } from '~/composables/useAddress'
import { usePayments } from '~/composables/usePayments'
import { useCartStore } from '~/stores/cartStore'
import { computed, ref, onMounted } from 'vue'

definePageMeta({ title: 'My Cart', middleware: ['auth-role'], layout: 'user' })

useSeoMeta({
  title: 'My Shopping Cart | D-Shop',
  description: 'Review your items and proceed to checkout.',
  ogTitle: 'My Shopping Cart | D-Shop',
  robots: 'noindex, nofollow' // We do not want search engines indexing the private cart page
})

const cartStore = useCartStore()

const loading = computed(() => cartStore.loading)
const cartId = computed(() => cartStore.cartId)

const cartItems = computed(() => {
  if (!Array.isArray(cartStore.items)) return []
  return cartStore.items.map(item => ({
    product_id: item.product?.product_id,
    name: item.product?.product_name || item.product?.name,
    price: item.product?.selling_price || item.product?.price || 0,
    image_url: item.product?.images?.[0]?.url || item.product?.images?.[0]?.image_url || '',
    quantity: item.quantity,
    id: item.id,
    total_available_quantity: item.product?.total_available_quantity !== undefined ? item.product.total_available_quantity : 999999
  }))
})

const addresses = ref([])
const couponCode = ref('')
const applyingCoupon = ref(false)
const discount = ref(0)
const appliedCouponId = ref(null)
const checkoutDialog = ref(false)
const selectedAddress = ref(null)
const paymentMethod = ref('COD')
const orderNotes = ref('')
const placingOrder = ref(false)

// Stripe state
const paymentStep = ref(1)
const stripeObj = ref(null)
const elementsObj = ref(null)
const clientSecret = ref(null)
const paymentIntentId = ref(null)
const processingPayment = ref(false)

const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.quantity, 0))
const total = computed(() => Math.max(0, subtotal.value - discount.value))
const hasOutOfStockItems = computed(() => {
  return cartItems.value.some(item => item.quantity > item.total_available_quantity)
})

const loadCart = async () => {
  await cartStore.fetchCart()
}

const loadAddresses = async () => {
  try {
    const { getAddresses } = useAddress()
    const res = await getAddresses()
    addresses.value = res?.data || []
    if (addresses.value.length) selectedAddress.value = addresses.value.find(a => a.is_default)?.id || addresses.value[0].id
  } catch { }
}

const removeItem = async (item_id) => {
  try {
    const { removeFromCart } = useCart()
    await removeFromCart(item_id)
    await cartStore.fetchCart()
    toast.success('Item removed')
  } catch { toast.error('Failed to remove item') }
}

const updateQty = async (item, qty) => {
  if (qty < 1) return
  try {
    const { updateCart } = useCart()
    const itemsPayload = cartItems.value.map(i => ({
      product_id: i.product_id,
      quantity: i.product_id === item.product_id ? qty : i.quantity
    }))
    await updateCart(cartId.value, itemsPayload)
    await cartStore.fetchCart()
  } catch { toast.error('Failed to update quantity') }
}

const confirmClear = async () => {
  if (!cartId.value) return
  try {
    const { clearCart } = useCart()
    await clearCart(cartId.value)
    await cartStore.fetchCart()
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
    const mappedPaymentMethod = paymentMethod.value === 'CREDIT_CARD' || paymentMethod.value === 'DEBIT_CARD' ? 'card' : 
                                paymentMethod.value === 'UPI' ? 'upi' : 'cod'
    
    // 1. Create the DRAFT Order First
    const res = await createOrder({
      address_id: selectedAddress.value,
      payment_method: mappedPaymentMethod,
      coupon_code: couponCode.value || undefined,
      notes: orderNotes.value || undefined,
    })
    
    // 2. Grab the Draft Order ID and initialize payment
    const orderId = res?.data?.order_id || res?.data?.id
    if (!orderId) throw new Error('Order creation failed on backend')

    await initializeStripe(orderId, mappedPaymentMethod)
    
  } catch (err) {
    console.error(err)
    toast.error('Failed to initiate order checkout')
  } finally {
    placingOrder.value = false
  }
}

const initializeStripe = async (orderId, mappedPaymentMethod) => {
  try {
    const { getConfig, createIntent } = usePayments()
    
    // Pass the Draft Order ID and selected method to the backend
    const intentRes = await createIntent({
      order_id: orderId,
      currency: 'inr',
      payment_method: mappedPaymentMethod
    })
    
    // If client_secret is null, it's an offline method like COD! Checkout is complete.
    const secret = intentRes?.data?.client_secret || intentRes?.client_secret
    if (!secret) {
      toast.success('Order placed successfully!')
      checkoutDialog.value = false
      cartItems.value = []
      navigateTo('/user?tab=orders')
      return
    }
    
    // Otherwise, it's an online method. Transition to Step 2 and mount Stripe.
    paymentStep.value = 2
    clientSecret.value = secret
    paymentIntentId.value = intentRes?.data?.stripe_payment_intent_id || intentRes?.data?.payment_intent_id || intentRes?.payment_intent_id
    
    const confRes = await getConfig()
    const pubKey = confRes?.data?.publishable_key || confRes?.publishable_key
    if (!pubKey) throw new Error('Stripe config missing')
    
    stripeObj.value = await loadStripe(pubKey)
    elementsObj.value = stripeObj.value.elements({ clientSecret: clientSecret.value })
    const paymentElement = elementsObj.value.create('payment')
    
    setTimeout(() => {
      paymentElement.mount('#payment-element')
    }, 200)
    
  } catch (err) {
    console.error(err)
    toast.error('Failed to initialize payment gateway')
  }
}

const confirmOnlinePayment = async () => {
  if (!stripeObj.value || !elementsObj.value) return
  processingPayment.value = true
  try {
    const { error, paymentIntent } = await stripeObj.value.confirmPayment({
      elements: elementsObj.value,
      redirect: 'if_required'
    })
    
    if (error) {
      toast.error(error.message)
      return
    }
    
    // Payment successful! Now strictly confirm it with the backend
    const { confirmPayment } = usePayments()
    await confirmPayment({ payment_intent_id: paymentIntent.id || paymentIntentId.value })
    
    toast.success('Payment completed and order placed successfully!')
    cancelCheckout()
    cartItems.value = []
    navigateTo('/user?tab=orders')
    
  } catch (err) {
    console.error(err)
    toast.error('Payment confirmation failed on server')
  } finally {
    processingPayment.value = false
  }
}

const cancelCheckout = () => {
  checkoutDialog.value = false
  setTimeout(() => { paymentStep.value = 1 }, 300)
}

onMounted(() => { loadCart(); loadAddresses() })
</script>