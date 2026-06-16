<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">My Profile</h1>

      <v-tabs v-model="activeTab" color="primary" class="mb-6">
        <v-tab value="profile"><Icon name="mdi:account-outline" class="mr-2" />Profile</v-tab>
        <v-tab value="address"><Icon name="mdi:map-marker-outline" class="mr-2" />Addresses</v-tab>
        <v-tab value="security"><Icon name="mdi:lock-outline" class="mr-2" />Security</v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Profile Tab -->
        <v-window-item value="profile">
          <v-card rounded="xl" class="pa-6">
            <!-- Avatar -->
            <div class="flex items-center gap-6 mb-8">
              <v-avatar size="90" color="primary" class="cursor-pointer" @click="triggerUpload">
                <img v-if="profileData.avatar_url" :src="profileData.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
                <Icon v-else name="mdi:account" class="w-12 h-12 text-white" />
              </v-avatar>
              <div>
                <p class="font-semibold text-lg">{{ profileData.first_name }} {{ profileData.last_name }}</p>
                <p class="text-slate-500 text-sm">{{ authStore.user?.username }}</p>
                <v-btn size="small" variant="outlined" class="mt-2" @click="triggerUpload">
                  <Icon name="mdi:camera" class="mr-1" /> Change Photo
                </v-btn>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              </div>
            </div>

            <v-form ref="profileForm" @submit.prevent="saveProfile">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="profileData.first_name" label="First Name"
                    prepend-inner-icon="mdi:account-outline" variant="outlined" rounded="lg"
                    :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="profileData.last_name" label="Last Name"
                    prepend-inner-icon="mdi:account-outline" variant="outlined" rounded="lg"
                    :rules="[rules.required]" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="profileData.phone" label="Phone Number"
                    prepend-inner-icon="mdi:phone-outline" variant="outlined" rounded="lg" />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="profileData.email" label="Email" type="email"
                    prepend-inner-icon="mdi:email-outline" variant="outlined" rounded="lg"
                    :rules="[rules.required, rules.validEmail]" />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="profileData.bio" label="Bio" variant="outlined" rounded="lg" rows="3" />
                </v-col>
              </v-row>
              <div class="flex justify-end mt-4">
                <v-btn color="primary" size="large" rounded="lg" type="submit" :loading="saving">
                  <Icon name="mdi:content-save-outline" class="mr-2" /> Save Changes
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-window-item>

        <!-- Address Tab -->
        <v-window-item value="address">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Saved Addresses</h2>
            <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="showAddressDialog = true">
              Add Address
            </v-btn>
          </div>

          <v-progress-circular v-if="loadingAddresses" indeterminate color="primary" class="d-flex mx-auto my-8" />

          <v-row v-else>
            <v-col v-for="addr in addresses" :key="addr.id" cols="12" sm="6">
              <v-card rounded="xl" variant="outlined" class="pa-4 h-full">
                <div class="flex justify-between items-start">
                  <div>
                    <v-chip v-if="addr.is_default" color="primary" size="small" class="mb-2">Default</v-chip>
                    <p class="font-medium">{{ addr.address_line1 }}</p>
                    <p class="text-slate-500 text-sm" v-if="addr.address_line2">{{ addr.address_line2 }}</p>
                    <p class="text-slate-500 text-sm">{{ addr.city }}, {{ addr.state }} {{ addr.pincode }}</p>
                    <p class="text-slate-500 text-sm">{{ addr.country }}</p>
                  </div>
                  <v-btn icon size="small" variant="text" @click="editAddress(addr)">
                    <Icon name="mdi:pencil-outline" />
                  </v-btn>
                </div>
              </v-card>
            </v-col>
            <v-col v-if="addresses.length === 0" cols="12">
              <div class="text-center py-12 text-slate-400">
                <Icon name="mdi:map-marker-off-outline" class="w-12 h-12 mb-3" />
                <p>No addresses saved yet.</p>
              </div>
            </v-col>
          </v-row>

          <!-- Address Dialog -->
          <v-dialog v-model="showAddressDialog" max-width="540">
            <v-card rounded="xl" class="pa-6">
              <h3 class="text-lg font-bold mb-4">{{ editingAddress ? 'Edit' : 'Add' }} Address</h3>
              <v-form @submit.prevent="saveAddress">
                <v-text-field v-model="addressForm.address_line1" label="Address Line 1" variant="outlined" rounded="lg" class="mb-3" :rules="[rules.required]" />
                <v-text-field v-model="addressForm.address_line2" label="Address Line 2 (optional)" variant="outlined" rounded="lg" class="mb-3" />
                <v-row>
                  <v-col cols="6"><v-text-field v-model="addressForm.city" label="City" variant="outlined" rounded="lg" :rules="[rules.required]" /></v-col>
                  <v-col cols="6"><v-text-field v-model="addressForm.state" label="State" variant="outlined" rounded="lg" :rules="[rules.required]" /></v-col>
                  <v-col cols="6"><v-text-field v-model="addressForm.country" label="Country" variant="outlined" rounded="lg" :rules="[rules.required]" /></v-col>
                  <v-col cols="6"><v-text-field v-model="addressForm.pincode" label="Pincode" variant="outlined" rounded="lg" :rules="[rules.required]" /></v-col>
                </v-row>
                <v-checkbox v-model="addressForm.is_default" label="Set as default address" color="primary" />
                <div class="flex gap-3 justify-end mt-2">
                  <v-btn variant="text" @click="showAddressDialog = false">Cancel</v-btn>
                  <v-btn color="primary" type="submit" :loading="savingAddress">Save</v-btn>
                </div>
              </v-form>
            </v-card>
          </v-dialog>
        </v-window-item>

        <!-- Security Tab -->
        <v-window-item value="security">
          <v-card rounded="xl" class="pa-6">
            <h2 class="text-lg font-semibold mb-6">Change Password</h2>
            <v-form @submit.prevent="changePassword">
              <v-text-field v-model="pwdForm.current" label="Current Password" :type="showCurrentPwd ? 'text' : 'password'"
                :append-inner-icon="showCurrentPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                @click:append-inner="showCurrentPwd = !showCurrentPwd"
                prepend-inner-icon="mdi:lock-outline" variant="outlined" rounded="lg" class="mb-4" />
              <v-text-field v-model="pwdForm.new_password" label="New Password" :type="showNewPwd ? 'text' : 'password'"
                :append-inner-icon="showNewPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                @click:append-inner="showNewPwd = !showNewPwd"
                prepend-inner-icon="mdi:lock-reset" variant="outlined" rounded="lg" class="mb-4" />
              <v-text-field v-model="pwdForm.confirm" label="Confirm New Password" :type="showConfirmPwd ? 'text' : 'password'"
                :append-inner-icon="showConfirmPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
                @click:append-inner="showConfirmPwd = !showConfirmPwd"
                prepend-inner-icon="mdi:lock-check" variant="outlined" rounded="lg" class="mb-4" />
              <v-btn color="primary" size="large" rounded="lg" type="submit" :loading="savingPwd">
                Update Password
              </v-btn>
            </v-form>
          </v-card>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { useValidation } from '~/composables/useValidation'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ title: 'My Profile', middleware: ['auth-role'], layout: 'default' })

const authStore = useAuthStore()
const { required, validEmail } = useValidation()
const rules = { required, validEmail }

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

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    const { uploadProfileImage } = useProfile()
    await uploadProfileImage(file)
    toast.success('Profile photo updated!')
    loadProfile()
  } catch { toast.error('Failed to upload photo') }
}

const loadProfile = async () => {
  try {
    const { getProfile } = useProfile()
    const res = await getProfile()
    Object.assign(profileData.value, res?.data || {})
  } catch { /* silently fail */ }
}

const loadAddresses = async () => {
  loadingAddresses.value = true
  try {
    const { getAddresses } = useAddress()
    const res = await getAddresses()
    addresses.value = res?.data || []
  } catch { toast.error('Failed to load addresses') }
  finally { loadingAddresses.value = false }
}

const saveProfile = async () => {
  saving.value = true
  try {
    const { updateProfile } = useProfile()
    await updateProfile(profileData.value)
    toast.success('Profile updated successfully!')
  } catch { toast.error('Failed to update profile') }
  finally { saving.value = false }
}

const editAddress = (addr) => {
  editingAddress.value = addr
  Object.assign(addressForm.value, addr)
  showAddressDialog.value = true
}

const saveAddress = async () => {
  savingAddress.value = true
  try {
    const { addAddress, updateAddress } = useAddress()
    if (editingAddress.value) {
      await updateAddress({ ...addressForm.value, id: editingAddress.value.id })
    } else {
      await addAddress(addressForm.value)
    }
    toast.success('Address saved!')
    showAddressDialog.value = false
    editingAddress.value = null
    addressForm.value = { address_line1: '', address_line2: '', city: '', state: '', country: 'India', pincode: '', is_default: false }
    loadAddresses()
  } catch { toast.error('Failed to save address') }
  finally { savingAddress.value = false }
}

const changePassword = async () => {
  if (pwdForm.value.new_password !== pwdForm.value.confirm)
    return toast.error('New passwords do not match')
  savingPwd.value = true
  try {
    const { updateMe } = useProfile()
    await updateMe({ current_password: pwdForm.value.current, new_password: pwdForm.value.new_password })
    toast.success('Password changed successfully!')
    pwdForm.value = { current: '', new_password: '', confirm: '' }
  } catch { toast.error('Failed to change password. Check your current password.') }
  finally { savingPwd.value = false }
}

onMounted(() => { loadProfile(); loadAddresses() })
</script>
