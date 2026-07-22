<template>
  <div class="px-16 mt-4">
    <ClientOnly>
      <div class="mb-8 border-b border-border pb-6"
        style="border-color: rgb(var(--color-border))">
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-text mb-2">My Profile</h1>
          <p class="text-text opacity-70 text-sm font-medium tracking-wide">
            Manage your personal profile details, contact information, and security preferences.
          </p>
        </div>
      </div>

      <div class="flex gap-1 p-1.5 rounded-[1.5rem] bg-card border border-border w-fit shadow-sm flex-wrap mb-8"
        style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
        <button @click="activeTab = 'profile'"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-100 uppercase tracking-wider"
          :class="activeTab === 'profile' ? 'shadow-md hover:scale-102' : 'opacity-60'"
          :style="activeTab === 'profile'
            ? 'background-color: rgb(var(--color-primary)); color: white'
            : 'color: rgb(var(--color-text))'">
          Personal Details
        </button>
        <button @click="activeTab = 'security'"
          class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-100 uppercase tracking-wider"
          :class="activeTab === 'security' ? 'shadow-md hover:scale-102' : 'opacity-60'"
          :style="activeTab === 'security'
            ? 'background-color: rgb(var(--color-primary)); color: white'
            : 'color: rgb(var(--color-text))'">
          Security
        </button>
      </div>

      <div v-if="activeTab === 'profile'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] overflow-hidden">
        <div class="relative h-24 sm:h-28 bg-gradient-to-br from-indigo-500/20 via-primary/15 to-cyan-500/10">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10" />
        </div>
        <div class="px-5 sm:px-8 pb-6 sm:pb-8">
          <div class="flex items-end gap-4 -mt-8 mb-6">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-card bg-secondary/50 flex items-center justify-center overflow-hidden shadow-xl flex-shrink-0">
              <Icon name="mdi:account-box-outline" class="text-primary w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div class="pb-1">
              <h2 class="text-xl sm:text-2xl font-bold text-text">Profile Details</h2>
              <p class="text-xs text-text/50 mt-0.5">Keep your information up to date</p>
            </div>
          </div>
          <form @submit.prevent="saveProfile" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
            <div class="flex justify-end pt-2">
              <button type="submit" :disabled="saving" class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.4)] transition-all duration-300 h-12 px-8 flex items-center justify-center disabled:opacity-50">
                <div class="absolute inset-0 bg-gradient-to-r from-primary to-indigo-500" />
                <div class="relative z-10 flex items-center justify-center gap-2">
                  <Icon v-if="saving" name="mdi:loading" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="mdi:content-save-outline" class="w-5 h-5" />
                  Save Details
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="activeTab === 'security'" class="bg-card/60 backdrop-blur-2xl border border-white/20 shadow-xl rounded-[2rem] overflow-hidden">
        <div class="relative h-20 sm:h-24 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-primary/10">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/5" />
        </div>
        <div class="px-5 sm:px-8 pb-6 sm:pb-8">
          <div class="flex items-end gap-4 -mt-8 mb-6">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-card bg-amber-500/10 flex items-center justify-center shadow-xl flex-shrink-0">
              <Icon name="mdi:lock-check-outline" class="text-amber-500 w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div class="pb-1">
              <h2 class="text-xl sm:text-2xl font-bold text-text">Change Password</h2>
              <p class="text-xs text-text/50 mt-0.5">Secure your account with a strong password</p>
            </div>
          </div>
          <form @submit.prevent="changePassword" class="space-y-5">
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
            <div class="flex justify-end pt-2">
              <button type="submit" :disabled="savingPwd" class="relative group overflow-hidden rounded-xl font-bold text-sm tracking-widest uppercase text-white shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.4)] transition-all duration-300 h-12 px-8 flex items-center justify-center disabled:opacity-50">
                <div class="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-400" />
                <div class="relative z-10 flex items-center justify-center gap-2">
                  <Icon v-if="savingPwd" name="mdi:loading" class="w-5 h-5 animate-spin" />
                  <Icon v-else name="mdi:key-change" class="w-5 h-5" />
                  Update Password
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { useAuthStore } from '~/stores/auth'
import { useProfile } from '~/composables/useProfile'

definePageMeta({
  title: 'My Profile',
  description: 'Manage your personal profile',
  middleware: ['auth-role'],
  role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
  layout: 'admin'
})

const authStore = useAuthStore()

const activeTab = ref('profile')
const saving = ref(false)
const savingPwd = ref(false)
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)

const profileData = ref({
  first_name: authStore.user?.first_name || '',
  last_name: authStore.user?.last_name || '',
  phone: authStore.user?.phone || '',
  username: authStore.user?.username || '',
  bio: authStore.user?.bio || '',
})

const pwdForm = ref({ current: '', new_password: '', confirm: '' })

const filterDigits = (val, maxLen) => {
  if (!val) return ''
  return val.replace(/\D/g, '').substring(0, maxLen)
}

const loadProfile = async () => {
  try {
    const { getAuthMe } = useProfile()
    const res = await getAuthMe()
    if (res?.data) {
      Object.assign(profileData.value, {
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        phone: res.data.phone || '',
        username: res.data.username || '',
        bio: res.data.bio || '',
      })
      authStore.addUser({ ...authStore.user, ...res.data })
    }
  } catch { }
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

onMounted(() => {
  loadProfile()
})
</script>
