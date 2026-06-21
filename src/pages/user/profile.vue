<template>
  <div class="min-h-screen relative overflow-hidden bg-background text-text selection:bg-primary/30 py-8 lg:py-12">
    <!-- Cool Background Gradient Blobs -->
    <div
      class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none">
    </div>
    <div
      class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none">
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Title Header -->
      <div class="mb-10">
        <h1 class="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text to-text/60 leading-tight">
          User Settings
        </h1>
        <p class="text-text opacity-60 text-base mt-2 font-medium tracking-wide">
          Manage your personal details, saved shipping addresses, and security settings.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sidebar Navigation Menu -->
        <aside class="lg:col-span-4 xl:col-span-3">
          <div class="bg-card/70 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[2rem] p-6 relative overflow-hidden">
            <!-- Sidebar avatar summary -->
            <div class="flex flex-col items-center text-center pb-6 border-b border-border/50">
              <div class="relative group cursor-pointer mb-4" @click="triggerUpload">
                <div class="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary/40 flex items-center justify-center relative shadow-inner">
                  <img v-if="profileData.avatar_url" :src="profileData.avatar_url" alt="Avatar" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <Icon v-else name="mdi:account" class="w-12 h-12 text-text opacity-40" />
                </div>
                <!-- Hover Edit Overlay -->
                <div class="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Icon name="mdi:camera" class="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 class="font-extrabold text-lg text-text">
                {{ profileData.first_name || 'Guest' }} {{ profileData.last_name || '' }}
              </h3>
              <p class="text-text opacity-50 text-xs font-semibold mt-1">@{{ authStore.user?.username || 'user' }}</p>
              <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
            </div>

            <!-- Tab List Buttons -->
            <nav class="space-y-2 mt-6">
              <button
                @click="activeTab = 'profile'"
                class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                :class="activeTab === 'profile'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'"
              >
                <Icon name="mdi:account-outline" class="w-5 h-5" />
                Profile Details
              </button>

              <button
                @click="activeTab = 'address'"
                class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                :class="activeTab === 'address'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'"
              >
                <Icon name="mdi:map-marker-outline" class="w-5 h-5" />
                Saved Addresses
              </button>

              <button
                @click="activeTab = 'security'"
                class="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide uppercase transition-all"
                :class="activeTab === 'security'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-text opacity-70 hover:opacity-100 hover:bg-secondary/60'"
              >
                <Icon name="mdi:lock-outline" class="w-5 h-5" />
                Password & Security
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Workspace Tab Forms -->
        <main class="lg:col-span-8 xl:col-span-9">
          <!-- Profile Form Pane -->
          <div v-if="activeTab === 'profile'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
            <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
              <Icon name="mdi:account-box-outline" class="text-primary w-6 h-6" /> Profile Details
            </h2>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- First Name -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">First Name</label>
                  <div class="relative">
                    <Icon name="mdi:account-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input
                      v-model="profileData.first_name"
                      type="text"
                      required
                      placeholder="First Name"
                      class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                    />
                  </div>
                </div>

                <!-- Last Name -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Last Name</label>
                  <div class="relative">
                    <Icon name="mdi:account-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input
                      v-model="profileData.last_name"
                      type="text"
                      required
                      placeholder="Last Name"
                      class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                    />
                  </div>
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Phone Number</label>
                  <div class="relative">
                    <Icon name="mdi:phone-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input
                      v-model="profileData.phone"
                      type="tel"
                      maxlength="10"
                      @input="profileData.phone = filterDigits(profileData.phone, 10)"
                      placeholder="10-digit number"
                      class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                    />
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Email Address</label>
                  <div class="relative">
                    <Icon name="mdi:email-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                    <input
                      v-model="profileData.email"
                      type="email"
                      required
                      placeholder="email@example.com"
                      class="w-full pl-12 pr-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                    />
                  </div>
                </div>
              </div>

              <!-- Bio -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Bio / Description</label>
                <textarea
                  v-model="profileData.bio"
                  rows="4"
                  maxlength="500"
                  placeholder="Tell us a little bit about yourself..."
                  class="w-full bg-background border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text resize-none"
                ></textarea>
              </div>

              <!-- Action button -->
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="saving"
                  class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/20 transition-all h-12 px-8 flex items-center justify-center disabled:opacity-50"
                >
                  <div class="absolute inset-0 bg-primary"></div>
                  <div class="relative z-10 flex items-center justify-center gap-2">
                    <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
                    <Icon v-else name="mdi:content-save-outline" class="w-5 h-5" />
                    Save Details
                  </div>
                </button>
              </div>
            </form>
          </div>

          <!-- Address Management Pane -->
          <div v-if="activeTab === 'address'" class="space-y-6">
            <div class="flex flex-wrap justify-between items-center gap-4 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-md rounded-[1.5rem] p-6">
              <div>
                <h2 class="text-xl font-bold text-text flex items-center gap-2">
                  <Icon name="mdi:map-marker-radius" class="text-primary w-6 h-6" /> Shipping Addresses
                </h2>
                <p class="text-xs text-text opacity-60 mt-1">Add and manage multiple delivery locations.</p>
              </div>
              <button
                @click="openNewAddress"
                class="px-5 py-2.5 rounded-xl bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all font-bold text-xs tracking-widest uppercase flex items-center gap-2 shadow-sm"
              >
                <Icon name="mdi:plus" class="w-4 h-4" /> Add New Address
              </button>
            </div>

            <!-- Loader -->
            <div v-if="loadingAddresses" class="flex flex-col items-center justify-center py-20 bg-card/60 border border-white/10 rounded-[2rem]">
              <div class="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
            </div>

            <!-- Empty address placeholder -->
            <div v-else-if="addresses.length === 0" class="text-center py-20 bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem]">
              <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/10">
                <Icon name="mdi:map-marker-off-outline" class="w-10 h-10 text-primary opacity-60" />
              </div>
              <h3 class="text-2xl font-bold text-text mb-2">No addresses saved</h3>
              <p class="text-text opacity-50 text-sm max-w-xs mx-auto">Please add a shipping address so you can place orders smoothly.</p>
            </div>

            <!-- Addresses Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                v-for="addr in addresses"
                :key="addr.id"
                class="bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem] p-6 flex flex-col justify-between relative group hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div class="flex justify-between items-start mb-4">
                    <span
                      v-if="addr.is_default"
                      class="text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase border border-emerald-500/20"
                    >
                      Default
                    </span>
                    <span v-else class="h-4"></span>
                    
                    <button
                      @click="editAddress(addr)"
                      class="w-8 h-8 rounded-full bg-secondary/80 text-text/75 hover:bg-primary hover:text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Icon name="mdi:pencil-outline" class="w-4 h-4" />
                    </button>
                  </div>

                  <p class="font-bold text-lg text-text">{{ addr.address_line1 }}</p>
                  <p class="text-text opacity-60 text-sm mt-1" v-if="addr.address_line2">{{ addr.address_line2 }}</p>
                  <p class="text-text opacity-60 text-sm mt-1">
                    {{ addr.city }}, {{ addr.state }} - <span class="font-semibold text-text">{{ addr.pincode }}</span>
                  </p>
                  <p class="text-text opacity-50 text-xs mt-2 uppercase tracking-widest font-bold">{{ addr.country }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Password & Security Pane -->
          <div v-if="activeTab === 'security'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] p-6 sm:p-8">
            <h2 class="text-2xl font-bold mb-6 text-text flex items-center gap-2">
              <Icon name="mdi:lock-check-outline" class="text-primary w-6 h-6" /> Change Password
            </h2>

            <form @submit.prevent="changePassword" class="space-y-6">
              <!-- Current password -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Current Password</label>
                <div class="relative">
                  <Icon name="mdi:lock-outline" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                  <input
                    v-model="pwdForm.current"
                    :type="showCurrentPwd ? 'text' : 'password'"
                    required
                    placeholder="Enter current password"
                    class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                  />
                  <button
                    type="button"
                    @click="showCurrentPwd = !showCurrentPwd"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity"
                  >
                    <Icon :name="showCurrentPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- New password -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">New Password</label>
                <div class="relative">
                  <Icon name="mdi:lock-reset" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                  <input
                    v-model="pwdForm.new_password"
                    :type="showNewPwd ? 'text' : 'password'"
                    required
                    placeholder="Minimum 6 characters"
                    class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                  />
                  <button
                    type="button"
                    @click="showNewPwd = !showNewPwd"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity"
                  >
                    <Icon :name="showNewPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Confirm password -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Confirm New Password</label>
                <div class="relative">
                  <Icon name="mdi:lock-check" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
                  <input
                    v-model="pwdForm.confirm"
                    :type="showConfirmPwd ? 'text' : 'password'"
                    required
                    placeholder="Repeat new password"
                    class="w-full pl-12 pr-12 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
                  />
                  <button
                    type="button"
                    @click="showConfirmPwd = !showConfirmPwd"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-45 hover:opacity-100 transition-opacity"
                  >
                    <Icon :name="showConfirmPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Save button -->
              <div class="flex justify-end pt-4">
                <button
                  type="submit"
                  :disabled="savingPwd"
                  class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/20 transition-all h-12 px-8 flex items-center justify-center disabled:opacity-50"
                >
                  <div class="absolute inset-0 bg-primary"></div>
                  <div class="relative z-10 flex items-center justify-center gap-2">
                    <Icon v-if="savingPwd" name="mdi:loading" class="w-5 h-5 animate-spin" />
                    <Icon v-else name="mdi:key-change" class="w-5 h-5" />
                    Update Password
                  </div>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>

    <!-- Address Dialog Modal overlay -->
    <div
      v-if="showAddressDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
      @click.self="showAddressDialog = false"
    >
      <div class="bg-card border border-white/20 rounded-[2rem] shadow-2xl w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto relative animate-[scaleIn_0.3s_ease-out]">
        <!-- Close button -->
        <button
          @click="showAddressDialog = false"
          class="absolute right-6 top-6 w-8 h-8 rounded-full bg-secondary/80 text-text/80 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
        >
          <Icon name="mdi:close" class="w-4 h-4" />
        </button>

        <h3 class="text-2xl font-extrabold text-text mb-6">
          {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
        </h3>

        <form @submit.prevent="saveAddress" class="space-y-4">
          <!-- Line 1 -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line 1</label>
            <input
              v-model="addressForm.address_line1"
              type="text"
              required
              maxlength="255"
              placeholder="House, Flat no, Building, Street"
              class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
            />
          </div>

          <!-- Line 2 -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Address Line 2 (optional)</label>
            <input
              v-model="addressForm.address_line2"
              type="text"
              maxlength="255"
              placeholder="Apartment, Colony, Area, LandMark"
              class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
            />
          </div>

          <!-- Grid row: City, State -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">City</label>
              <input
                v-model="addressForm.city"
                type="text"
                required
                maxlength="100"
                placeholder="City"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">State</label>
              <input
                v-model="addressForm.state"
                type="text"
                required
                maxlength="100"
                placeholder="State"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
              />
            </div>
          </div>

          <!-- Grid row: Country, Pincode -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Country</label>
              <input
                v-model="addressForm.country"
                type="text"
                required
                maxlength="100"
                placeholder="India"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-widest text-text opacity-50 mb-2">Pincode</label>
              <input
                v-model="addressForm.pincode"
                type="text"
                required
                maxlength="6"
                @input="addressForm.pincode = filterDigits(addressForm.pincode, 6)"
                placeholder="6-digit pincode"
                class="w-full px-4 py-3.5 bg-background border border-border/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text"
              />
            </div>
          </div>

          <!-- Checkbox default -->
          <div class="flex items-center gap-2 pt-2">
            <input
              v-model="addressForm.is_default"
              type="checkbox"
              id="is_default"
              class="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/30"
            />
            <label for="is_default" class="text-sm font-bold text-text opacity-70 cursor-pointer">
              Set as default shipping address
            </label>
          </div>

          <!-- Footer save -->
          <div class="flex gap-4 pt-6">
            <button
              type="button"
              @click="showAddressDialog = false"
              class="flex-1 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase bg-secondary text-text/70 hover:bg-secondary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="savingAddress"
              class="flex-1 relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-0.5 transition-all h-12 flex items-center justify-center disabled:opacity-50"
            >
              <div class="absolute inset-0 bg-primary"></div>
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
import { useValidation } from '~/composables/useValidation'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ title: 'My Profile', middleware: ['auth-role'], layout: 'default' })

const authStore = useAuthStore()
const { validEmail } = useValidation()

const activeTab = ref('profile')
const saving = ref(false)
const savingAddress = ref(false)
const savingPwd = ref(false)
const loadingAddresses = ref(false)
const showAddressDialog = ref(false)
const editingAddress = ref(null)
const fileInput = ref(null)
const addresses = ref([])
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const profileData = ref({ first_name: '', last_name: '', phone: '', email: '', bio: '', avatar_url: '' })
const addressForm = ref({ address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false })
const pwdForm = ref({ current: '', new_password: '', confirm: '' })

const triggerUpload = () => fileInput.value?.click()

const filterDigits = (val, maxLen) => {
  if (!val) return ''
  const digits = val.replace(/\D/g, '')
  return digits.substring(0, maxLen)
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const { uploadProfileImage } = useProfile()
    await uploadProfileImage(file)
    toast.success('Profile photo updated successfully!')
    loadProfile()
  } catch {
    toast.error('Failed to upload photo')
  }
}

const loadProfile = async () => {
  try {
    const { getProfile } = useProfile()
    const res = await getProfile()
    Object.assign(profileData.value, res?.data || {})
  } catch {
    // silently fail
  }
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
  if (profileData.value.email && !validEmail(profileData.value.email)) {
    return toast.error('Please enter a valid email address')
  }
  if (profileData.value.phone && profileData.value.phone.length !== 10) {
    return toast.error('Phone number must be exactly 10 digits')
  }

  saving.value = true
  try {
    const { updateProfile } = useProfile()
    await updateProfile(profileData.value)
    toast.success('Profile details updated successfully!')
  } catch {
    toast.error('Failed to update profile')
  } finally {
    saving.value = false
  }
}

const openNewAddress = () => {
  editingAddress.value = null
  addressForm.value = { address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false }
  showAddressDialog.value = true
}

const editAddress = (addr) => {
  editingAddress.value = addr
  Object.assign(addressForm.value, addr)
  showAddressDialog.value = true
}

const saveAddress = async () => {
  if (!addressForm.value.address_line1?.trim()) {
    return toast.error('Address Line 1 is required')
  }
  if (!addressForm.value.city?.trim() || !addressForm.value.state?.trim()) {
    return toast.error('City and State are required')
  }
  if (!addressForm.value.pincode || addressForm.value.pincode.length !== 6) {
    return toast.error('Pincode must be exactly 6 digits')
  }

  savingAddress.value = true
  try {
    const { addAddress, updateAddress } = useAddress()
    if (editingAddress.value) {
      await updateAddress({ ...addressForm.value, id: editingAddress.value.id })
    } else {
      await addAddress(addressForm.value)
    }
    toast.success('Address saved successfully!')
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
  if (!pwdForm.value.current || !pwdForm.value.new_password) {
    return toast.error('Please fill in all password fields')
  }
  if (pwdForm.value.new_password.length < 6) {
    return toast.error('New password must be at least 6 characters long')
  }
  if (pwdForm.value.new_password !== pwdForm.value.confirm) {
    return toast.error('Passwords do not match')
  }

  savingPwd.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({ current_password: pwdForm.value.current, new_password: pwdForm.value.new_password })
    toast.success('Password changed successfully!')
    pwdForm.value = { current: '', new_password: '', confirm: '' }
  } catch {
    toast.error('Failed to change password. Check your current password.')
  } finally {
    savingPwd.value = false
  }
}

onMounted(() => {
  loadProfile()
  loadAddresses()
})
</script>

<style scoped>
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
