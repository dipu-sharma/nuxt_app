<template>
  <div>
    <ClientOnly>
      <UserSessions v-if="activeTab === 'sessions'" />
      <UserOrderHistory v-if="activeTab === 'orders'" />

      <UserDashboard
        v-if="activeTab === 'overview'"
        :orders="allOrders"
        :loading-orders="loadingDashboard"
        :cart-count="cartCount"
        :wishlist-count="wishlistCount"
        :user-first-name="profileData.first_name || authStore.user?.first_name || 'Guest'"
        :user-email="authStore.user?.username || ''"
        @navigate="activeTab = $event"
        @view-order="openOrderDetail"
      />

      <div v-if="activeTab === 'profile'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
        <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
          <Icon name="mdi:account-box-outline" class="text-primary w-6 h-6" /> Profile Details
        </h2>
        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">First Name</label>
              <div class="relative">
                <Icon name="mdi:account-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                <input v-model="profileData.first_name" type="text" required placeholder="First Name" class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Last Name</label>
              <div class="relative">
                <Icon name="mdi:account-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                <input v-model="profileData.last_name" type="text" required placeholder="Last Name" class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Phone Number</label>
              <div class="relative">
                <Icon name="mdi:phone-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                <input v-model="profileData.phone" type="tel" maxlength="10" @input="profileData.phone = filterDigits(profileData.phone, 10)" placeholder="10-digit number" class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Email</label>
              <div class="relative">
                <Icon name="mdi:email-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                <input :value="authStore.user?.username" type="email" disabled class="w-full pl-12 pr-4 py-3.5 bg-background/50 border border-border/60 rounded-xl text-sm text-text/60 cursor-not-allowed" />
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Bio</label>
            <textarea v-model="profileData.bio" rows="3" maxlength="500" placeholder="Tell us a little bit about yourself..." class="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text resize-none" />
          </div>
          <div class="flex justify-end pt-4">
            <button type="submit" :disabled="saving" class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.4)] transition-all duration-300 h-12 px-8 flex items-center justify-center disabled:opacity-50">
              <div class="absolute inset-0 bg-primary" />
              <div class="relative z-10 flex items-center justify-center gap-2">
                <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <Icon v-else name="mdi:content-save-outline" class="w-5 h-5" />
                Save Details
              </div>
            </button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'address'" class="space-y-6">
        <div class="flex flex-wrap justify-between items-center gap-4 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-md rounded-[1.5rem] p-6">
          <div>
            <h2 class="text-xl font-bold text-text flex items-center gap-2">
              <Icon name="mdi:map-marker-radius" class="text-primary w-6 h-6" /> Shipping Addresses
            </h2>
            <p class="text-xs text-text opacity-60 mt-1">Add and manage multiple delivery locations.</p>
          </div>
          <button @click="openNewAddress" class="px-5 py-2.5 rounded-xl bg-primary text-white hover:shadow-lg transition-all font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm">
            <Icon name="mdi:plus" class="w-4 h-4" /> Add New Address
          </button>
        </div>
        <div v-if="loadingAddresses" class="flex flex-col items-center justify-center py-20 bg-card/60 border border-white/10 rounded-[2rem]">
          <div class="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        </div>
        <div v-else-if="addresses.length === 0" class="text-center py-20 bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem]">
          <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/10">
            <Icon name="mdi:map-marker-off-outline" class="w-10 h-10 text-primary opacity-60" />
          </div>
          <h3 class="text-2xl font-bold text-text mb-2">No addresses saved</h3>
          <p class="text-text opacity-50 text-sm max-w-xs mx-auto">Please add a shipping address so you can place orders smoothly.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="addr in addresses" :key="addr.id" class="backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem] p-6 flex flex-col justify-between relative group hover:shadow-[0_0_20px_rgba(var(--color-primary),0.15)] hover:border-primary/50 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500" :class="addr.is_default ? 'bg-gradient-to-br from-card/80 to-emerald-500/5' : 'bg-card/60'">
            <div>
              <div class="flex justify-between items-start mb-4">
                <span v-if="addr.is_default" class="flex items-center gap-1.5 text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Default
                </span>
                <span v-else class="h-4" />
                <button v-if="!addr.is_used && !addr.has_orders && addr.is_editable !== false" @click="editAddress(addr)" class="w-8 h-8 rounded-full bg-secondary/80 text-text/75 hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-sm hover:scale-110 hover:shadow-lg duration-300" title="Edit Address">
                  <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                </button>
              </div>
              <p class="font-bold text-lg text-text">{{ addr.address_line1 }}</p>
              <p class="text-text opacity-60 text-sm mt-1" v-if="addr.address_line2">{{ addr.address_line2 }}</p>
              <p class="text-text opacity-60 text-sm mt-1">{{ addr.city }}, {{ addr.state }} - <span class="font-semibold text-text">{{ addr.pincode }}</span></p>
              <p class="text-text opacity-50 text-xs mt-2 uppercase tracking-widest font-bold">{{ addr.country }}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-border flex gap-2 justify-end">
              <button @click="setDefaultAddress(addr)" v-if="!addr.is_default" class="text-xs font-bold text-primary hover:underline">Set Default</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
        <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
          <Icon name="mdi:lock-check-outline" class="text-primary w-6 h-6" /> Change Password
        </h2>
        <form @submit.prevent="changePassword" class="space-y-6">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Current Password</label>
            <div class="relative">
              <Icon name="mdi:lock-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
              <input v-model="pwdForm.current" :type="showCurrentPwd ? 'text' : 'password'" required placeholder="Enter current password" class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
              <button type="button" @click="showCurrentPwd = !showCurrentPwd" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100">
                <Icon :name="showCurrentPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">New Password</label>
            <div class="relative">
              <Icon name="mdi:lock-reset" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
              <input v-model="pwdForm.new_password" :type="showNewPwd ? 'text' : 'password'" required placeholder="Minimum 6 characters" class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
              <button type="button" @click="showNewPwd = !showNewPwd" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100">
                <Icon :name="showNewPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Confirm New Password</label>
            <div class="relative">
              <Icon name="mdi:lock-check" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
              <input v-model="pwdForm.confirm" :type="showConfirmPwd ? 'text' : 'password'" required placeholder="Repeat new password" class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
              <button type="button" @click="showConfirmPwd = !showConfirmPwd" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100">
                <Icon :name="showConfirmPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button type="submit" :disabled="savingPwd" class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.4)] transition-all duration-300 h-12 px-8 flex items-center justify-center disabled:opacity-50">
              <div class="absolute inset-0 bg-primary" />
              <div class="relative z-10 flex items-center justify-center gap-2">
                <Icon v-if="savingPwd" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <Icon v-else name="mdi:key-change" class="w-5 h-5" />
                Update Password
              </div>
            </button>
          </div>
        </form>
      </div>
    </ClientOnly>

    <v-dialog v-model="detailDialog" max-width="720" transition="dialog-bottom-transition">
      <v-card v-if="selectedOrder" class="rounded-[2.5rem] overflow-hidden border-0 shadow-2xl bg-background">
        <div class="px-8 py-8 md:px-12 md:py-10">
          <div class="flex justify-between items-start mb-10">
            <div>
              <p class="text-text opacity-50 font-medium mb-2 tracking-widest uppercase text-[10px]">Order Details</p>
              <h2 class="text-3xl font-semibold tracking-tight text-text mb-2">#{{ selectedOrder.order_number || selectedOrder.id }}</h2>
              <p class="text-text opacity-70 font-medium tracking-wide text-sm">{{ formatDate(selectedOrder.created_at) }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" :class="statusBadgeClass(selectedOrder.status)">
              {{ selectedOrder.status }}
            </span>
          </div>
          <div class="space-y-4 mb-10">
            <div v-for="item in orderItems" :key="item.id" class="flex gap-6 items-center p-4 rounded-2xl hover:bg-card transition-colors">
              <div class="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 relative">
                <img v-if="item.image_url" :src="item.image_url" :alt="item.name" class="w-full h-full object-cover" />
                <Icon v-else name="mdi:image-outline" class="w-8 h-8 absolute inset-0 m-auto text-text opacity-30" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-text truncate text-lg">{{ item.name }}</p>
                <p class="text-text opacity-70 text-sm font-medium tracking-wide mt-1">Qty: {{ item.quantity }} <span class="mx-2 opacity-30">×</span> ₹{{ item.price?.toLocaleString('en-IN') }}</p>
              </div>
              <p class="font-light text-xl text-text whitespace-nowrap pl-4">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</p>
            </div>
          </div>
          <v-divider class="my-8 opacity-50 dark:opacity-20 border-border" />
          <div class="mb-10 pl-4 pr-4 md:pl-28">
            <div class="space-y-4 text-sm font-medium tracking-wide text-text opacity-80">
              <div class="flex justify-between items-center">
                <span>Subtotal</span>
                <span class="text-text">₹{{ orderSubtotal.toLocaleString('en-IN') }}</span>
              </div>
              <div v-if="orderDiscount" class="flex justify-between items-center text-primary">
                <span>Discount</span>
                <span>-₹{{ orderDiscount.toLocaleString('en-IN') }}</span>
              </div>
              <div class="flex justify-between items-end pt-4 border-t border-border mt-4">
                <span class="font-bold uppercase tracking-widest text-[10px] text-text opacity-50">Total</span>
                <span class="text-3xl font-light text-text tracking-tight">₹{{ orderTotal.toLocaleString('en-IN') }}</span>
              </div>
            </div>
          </div>
          <div v-if="tracking && tracking.tracking" class="bg-card rounded-3xl p-8 border border-border mb-10 relative overflow-hidden">
            <h3 class="text-lg font-bold mb-4">Tracking Information</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span class="font-medium text-text opacity-70">Status:</span> <span class="font-bold ml-1">{{ tracking.order_status }}</span></div>
              <div v-if="tracking.tracking.carrier"><span class="font-medium text-text opacity-70">Carrier:</span> <span class="font-bold ml-1">{{ tracking.tracking.carrier }}</span></div>
              <div v-if="tracking.tracking.tracking_number"><span class="font-medium text-text opacity-70">Tracking #:</span> <span class="font-bold ml-1">{{ tracking.tracking.tracking_number }}</span></div>
              <div v-if="tracking.tracking.tracking_url"><span class="font-medium text-text opacity-70">Link:</span> <a :href="tracking.tracking.tracking_url" target="_blank" class="text-primary hover:underline ml-1">View Details</a></div>
              <div v-if="tracking.tracking.shipped_at"><span class="font-medium text-text opacity-70">Shipped:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.shipped_at) }}</span></div>
              <div v-if="tracking.tracking.estimated_delivery"><span class="font-medium text-text opacity-70">Est. Delivery:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.estimated_delivery) }}</span></div>
              <div v-if="tracking.tracking.delivered_at"><span class="font-medium text-text opacity-70">Delivered:</span> <span class="font-bold ml-1">{{ formatDate(tracking.tracking.delivered_at) }}</span></div>
            </div>
            <div v-if="tracking.tracking.notes" class="mt-4 pt-4 border-t border-border">
              <span class="font-medium text-text opacity-70 block mb-1">Notes:</span>
              <p class="text-sm opacity-90">{{ tracking.tracking.notes }}</p>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
            <v-btn variant="text" size="x-large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="detailDialog = false">Close</v-btn>
            <v-btn v-if="['pending', 'processing'].includes(selectedOrder.status?.toLowerCase())" color="error" variant="tonal" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium" :loading="cancelling" @click="cancelOrder(selectedOrder.order_id)">Cancel Order</v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" size="x-large" class="flex-1 text-none tracking-widest font-medium text-white" :loading="loadingTracking" @click="loadTracking(selectedOrder.id)">Track Package</v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <div v-if="showAddressDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" @click.self="showAddressDialog = false">
      <div class="bg-card border border-white/20 rounded-[2rem] shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
        <button @click="showAddressDialog = false" class="absolute right-6 top-6 w-8 h-8 rounded-full bg-secondary/80 text-text/80 hover:bg-red-500 hover:text-white flex items-center justify-center">
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>
        <h3 class="text-2xl font-extrabold text-text mb-6">{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h3>
        <form @submit.prevent="saveAddress" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line 1</label>
            <input v-model="addressForm.address_line1" type="text" required maxlength="255" placeholder="House, Flat no, Building, Street" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line 2 (optional)</label>
            <input v-model="addressForm.address_line2" type="text" maxlength="255" placeholder="Apartment, Colony, Area, LandMark" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">City</label>
              <input v-model="addressForm.city" type="text" required maxlength="100" placeholder="City" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">State</label>
              <input v-model="addressForm.state" type="text" required maxlength="100" placeholder="State" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Country</label>
              <input v-model="addressForm.country" type="text" required maxlength="100" placeholder="India" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Pincode</label>
              <input v-model="addressForm.pincode" type="text" required maxlength="6" @input="addressForm.pincode = filterDigits(addressForm.pincode, 6)" placeholder="6-digit pincode" class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary transition-all text-text" />
            </div>
          </div>
          <div class="flex items-center gap-2 pt-2">
            <input v-model="addressForm.is_default" type="checkbox" id="is_default_idx" class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/30" />
            <label for="is_default_idx" class="text-sm font-bold text-text opacity-70 cursor-pointer">Set as default shipping address</label>
          </div>
          <div class="flex gap-4 pt-6">
            <button type="button" @click="showAddressDialog = false" class="flex-1 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase bg-secondary text-text/70 hover:bg-secondary/80">Cancel</button>
            <button type="submit" :disabled="savingAddress" class="flex-1 relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 transition-all h-12 flex items-center justify-center disabled:opacity-50">
              <div class="absolute inset-0 bg-primary" />
              <div class="relative z-10 flex items-center justify-center gap-2">
                <Icon v-if="savingAddress" name="mdi:loading" class="w-5 h-5 animate-spin" />
                <Icon v-else name="mdi:content-save" class="w-5 h-5" />
                Save Address
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'
import { useValidation } from '~/composables/useValidation'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'
import { useOrders } from '~/composables/useOrders'
import { useCart } from '~/composables/useCart'
import { useWishlist } from '~/composables/useWishlist'
import { useAddress } from '~/composables/useAddress'

definePageMeta({
  title: 'User Dashboard',
  description: 'Manage your user profile',
  middleware: ['auth-role'],
  role: ['User', 'ADMIN'],
  layout: 'user'
})

const authStore = useAuthStore()
const { validEmail } = useValidation()
const route = useRoute()

const activeTab = ref(route.query.tab || 'overview')
const saving = ref(false)
const savingAddress = ref(false)
const savingPwd = ref(false)
const loadingAddresses = ref(false)
const loadingDashboard = ref(false)
const loadingTracking = ref(false)
const cancelling = ref(false)
const showAddressDialog = ref(false)
const editingAddress = ref(null)
const addresses = ref([])
const allOrders = ref([])
const selectedOrder = ref(null)
const detailDialog = ref(false)
const tracking = ref(null)
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const cartCount = ref(0)
const wishlistCount = ref(0)

const profileData = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  phone: authStore.user?.phone || '',
  username: authStore.user?.username || '',
  bio: authStore.user?.bio || '',
  url: authStore.user?.url || '',
  avatar_url: authStore.user?.url || ''
})

const addressForm = ref({ address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false, latitude: null, longitude: null })
const pwdForm = ref({ current: '', new_password: '', confirm: '' })

const orderItems = computed(() => selectedOrder.value?.items || selectedOrder.value?.order_items || [])
const orderSubtotal = computed(() => selectedOrder.value?.subtotal || selectedOrder.value?.total_price || 0)
const orderDiscount = computed(() => selectedOrder.value?.discount || 0)
const orderTotal = computed(() => selectedOrder.value?.total_amount || selectedOrder.value?.total_price || 0)

const statusBadgeClass = (s) => {
  const map = {
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/50',
    processing: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400 border border-sky-200/50',
    shipped: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-200/50',
    delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border border-rose-200/50',
    accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/50'
  }
  return map[s?.toLowerCase()] || 'bg-secondary text-text opacity-80 border border-border'
}

const formatDate = (d) => d ? dayjs(d).format('MMM DD, YYYY') : 'N/A'
const filterDigits = (val, maxLen) => {
  if (!val) return ''
  return val.replace(/\D/g, '').substring(0, maxLen)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const { updateProfileImage } = useProfile()
    await updateProfileImage(file)
    await loadProfile()
  } catch { }
}

const loadProfile = async () => {
  try {
    const { getAuthMe } = useProfile()
    const meRes = await getAuthMe()
    if (meRes?.data) {
      Object.assign(profileData.value, {
        first_name: meRes.data.first_name || '',
        last_name: meRes.data.last_name || '',
        phone: meRes.data.phone || '',
        username: meRes.data.username || '',
        bio: meRes.data.bio || '',
        url: meRes.data.url || '',
        avatar_url: meRes.data.url || ''
      })
      authStore.addUser({
        ...authStore.user,
        ...meRes.data
      })
    }
    const { getProfile } = useProfile()
    const res = await getProfile()
    if (res?.data) {
      profileData.value.avatar_url = res.data.url || profileData.value.avatar_url
      authStore.addUser({
        ...authStore.user,
        avatar_url: profileData.value.avatar_url
      })
    }
  } catch { }
}

const loadDashboardData = async () => {
  loadingDashboard.value = true
  try {
    const { getOrders } = useOrders()
    const res = await getOrders({ page: 1, per_page: 10 })
    const rawOrders = Array.isArray(res?.data) ? res.data : (res?.data?.items || [])
    allOrders.value = rawOrders.map(order => ({
      ...order,
      order_number: order.order_number || order.order_id || `ord_${order.id}`,
      items: (order.items || order.order_items || []).map(item => ({
        ...item,
        price: item.price || item.price_per_unit || 0,
        name: item.product_name_snapshot || item.product?.product_name || item.name || `Product #${item.product_id}`,
        image_url: item.product?.images?.[0]?.url || item.product?.images?.[0]?.image_url || item.product?.images?.[0] || item.image_url || null
      })),
      total_amount: order.total_price || order.total_amount || 0
    }))
    const { getCart } = useCart()
    const cartRes = await getCart()
    cartCount.value = cartRes?.data?.items?.length || 0
    const { getWishlist } = useWishlist()
    const wishRes = await getWishlist()
    wishlistCount.value = Array.isArray(wishRes?.data) ? wishRes.data.length : 0
  } catch { }
  finally { loadingDashboard.value = false }
}

const openOrderDetail = (order) => {
  selectedOrder.value = order
  tracking.value = null
  detailDialog.value = true
}

const loadTracking = async (orderId) => {
  loadingTracking.value = true
  try {
    const { trackOrder } = useOrders()
    const id = selectedOrder.value?.order_id || orderId
    const res = await trackOrder(id)
    tracking.value = res?.data || {}
  } catch { }
  finally { loadingTracking.value = false }
}

const cancelOrder = async (orderId) => {
  cancelling.value = true
  try {
    const { cancelOrder: doCancel } = useOrders()
    await doCancel(orderId)
    toast.success('Order cancelled')
    detailDialog.value = false
    loadDashboardData()
  } catch { }
  finally { cancelling.value = false }
}

const loadAddresses = async () => {
  loadingAddresses.value = true
  try {
    const { getAddresses } = useAddress()
    const res = await getAddresses()
    addresses.value = res?.data || []
  } catch {
    toast.error('Failed to load addresses')
  } finally {
    loadingAddresses.value = false
  }
}

const saveProfile = async () => {
  if (!profileData.value.first_name?.trim() || !profileData.value.last_name?.trim()) {
    return toast.error('First and Last name are required')
  }
  if (profileData.value.phone && profileData.value.phone.length !== 10) {
    return toast.error('Phone number must be exactly 10 digits')
  }
  saving.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({
      first_name: profileData.value.first_name,
      last_name: profileData.value.last_name,
      phone: profileData.value.phone,
      bio: profileData.value.bio
    })
    await loadProfile()
    toast.success('Profile updated successfully!')
  } catch {
    toast.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const openNewAddress = () => {
  editingAddress.value = null
  addressForm.value = { address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false, latitude: null, longitude: null }
  showAddressDialog.value = true
}

const editAddress = (addr) => {
  editingAddress.value = addr
  Object.assign(addressForm.value, addr)
  showAddressDialog.value = true
}

const setDefaultAddress = async (addr) => {
  try {
    const { updateAddress } = useAddress()
    await updateAddress({ ...addr, is_default: true })
    toast.success('Default address updated')
    loadAddresses()
  } catch {
    toast.error('Failed to set default address')
  }
}

const saveAddress = async () => {
  if (!addressForm.value.address_line1?.trim()) return toast.error('Address Line 1 is required')
  if (!addressForm.value.city?.trim() || !addressForm.value.state?.trim()) return toast.error('City and State are required')
  if (!addressForm.value.pincode || addressForm.value.pincode.length !== 6) return toast.error('Pincode must be exactly 6 digits')
  savingAddress.value = true
  try {
    if (navigator.geolocation) {
      try {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        })
        addressForm.value.latitude = pos.coords.latitude
        addressForm.value.longitude = pos.coords.longitude
      } catch (err) {
        // Failed to get location, proceed without it
      }
    }
    const { addAddress, updateAddress } = useAddress()
    if (editingAddress.value) {
      await updateAddress({ ...addressForm.value, id: editingAddress.value.id })
    } else {
      await addAddress(addressForm.value)
    }
    toast.success('Address saved!')
    showAddressDialog.value = false
    editingAddress.value = null
    loadAddresses()
  } catch {
    toast.error('Failed to save address')
  } finally {
    savingAddress.value = false
  }
}

const changePassword = async () => {
  if (!pwdForm.value.current || !pwdForm.value.new_password) return toast.error('Fill in all password fields')
  if (pwdForm.value.new_password.length < 6) return toast.error('Password must be at least 6 characters')
  if (pwdForm.value.new_password !== pwdForm.value.confirm) return toast.error('Passwords do not match')
  savingPwd.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({ current_password: pwdForm.value.current, new_password: pwdForm.value.new_password })
    toast.success('Password changed!')
    pwdForm.value = { current: '', new_password: '', confirm: '' }
  } catch {
    toast.error('Failed to change password')
  } finally {
    savingPwd.value = false
  }
}

watch(() => route.query.tab, (tab) => {
  if (tab) activeTab.value = tab
})

onMounted(() => {
  loadProfile()
  loadAddresses()
  loadDashboardData()
})
</script>

<style scoped>
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
