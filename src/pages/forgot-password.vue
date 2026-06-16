<template>
  <div class="min-h-screen flex items-center justify-center" style="background-color: rgb(var(--color-background))">
    <div class="w-full max-w-md mx-4">
      <!-- Step Indicator -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div v-for="(label, i) in steps" :key="i"
          class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            :class="step >= i + 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'">
            <Icon v-if="step > i + 1" name="mdi:check" class="w-4 h-4" />
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="text-sm font-medium hidden sm:block"
            :class="step >= i + 1 ? 'text-indigo-600' : 'text-slate-400'">{{ label }}</span>
          <div v-if="i < steps.length - 1" class="w-8 h-px bg-slate-200" />
        </div>
      </div>

      <v-card class="rounded-2xl shadow-xl pa-8">
        <!-- Step 1: Email -->
        <div v-if="step === 1">
          <h1 class="text-2xl font-bold text-slate-800 mb-2">Forgot Password</h1>
          <p class="text-slate-500 mb-6">Enter your email and we'll send you an OTP to reset your password.</p>
          <v-text-field v-model="email" label="Email Address" type="email" prepend-inner-icon="mdi:email-outline"
            variant="outlined" rounded="lg" :rules="[rules.required, rules.validEmail]" class="mb-4" />
          <v-btn block color="primary" size="large" rounded="lg" :loading="loading" @click="sendOTP">
            Send OTP
          </v-btn>
          <p class="text-center text-slate-500 mt-6 text-sm">
            Remember your password?
            <NuxtLink to="/login" class="text-indigo-600 font-semibold hover:underline">Sign in</NuxtLink>
          </p>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-if="step === 2">
          <h1 class="text-2xl font-bold text-slate-800 mb-2">Enter OTP</h1>
          <p class="text-slate-500 mb-6">We sent a 6-digit code to <strong>{{ email }}</strong></p>
          <v-otp-input v-model="otp" length="6" type="number" class="mb-4" />
          <v-btn block color="primary" size="large" rounded="lg" :loading="loading" @click="verifyOTP">
            Verify OTP
          </v-btn>
          <v-btn block variant="text" class="mt-2" :disabled="resendCooldown > 0" @click="sendOTP">
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP' }}
          </v-btn>
        </div>

        <!-- Step 3: New Password -->
        <div v-if="step === 3">
          <h1 class="text-2xl font-bold text-slate-800 mb-2">New Password</h1>
          <p class="text-slate-500 mb-6">Choose a strong password for your account.</p>
          <v-text-field v-model="newPassword" label="New Password" :type="showPwd ? 'text' : 'password'"
            prepend-inner-icon="mdi:lock-outline"
            :append-inner-icon="showPwd ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
            @click:append-inner="showPwd = !showPwd"
            variant="outlined" rounded="lg" :rules="[rules.required]" class="mb-4" />
          <v-text-field v-model="confirmPassword" label="Confirm Password" :type="showConfirm ? 'text' : 'password'"
            prepend-inner-icon="mdi:lock-check-outline"
            :append-inner-icon="showConfirm ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
            @click:append-inner="showConfirm = !showConfirm"
            variant="outlined" rounded="lg"
            :rules="[rules.required, v => v === newPassword || 'Passwords do not match']" class="mb-4" />
          <v-btn block color="primary" size="large" rounded="lg" :loading="loading" @click="resetPassword">
            Reset Password
          </v-btn>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { useValidation } from '~/composables/useValidation'

definePageMeta({ layout: 'login', title: 'Forgot Password' })

const { required, validEmail } = useValidation()
const rules = { required, validEmail }

const step = ref(1)
const steps = ['Email', 'Verify OTP', 'New Password']
const loading = ref(false)
const email = ref('')
const otp = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPwd = ref(false)
const showConfirm = ref(false)
const resetToken = ref('')
const resendCooldown = ref(0)

const startCooldown = () => {
  resendCooldown.value = 60
  const interval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(interval)
  }, 1000)
}

const sendOTP = async () => {
  if (!email.value) return toast.error('Please enter your email')
  loading.value = true
  try {
    const { forgotPassword } = useAuth()
    await forgotPassword(email.value)
    toast.success('OTP sent to your email!')
    step.value = 2
    startCooldown()
  } catch (e) {
    toast.error('Failed to send OTP. Please check your email.')
  } finally {
    loading.value = false
  }
}

const verifyOTP = async () => {
  if (!otp.value || otp.value.length < 6) return toast.error('Please enter the 6-digit OTP')
  loading.value = true
  try {
    const { verifyOTP: verify } = useAuth()
    const res = await verify(email.value, otp.value)
    resetToken.value = res?.data?.token || otp.value
    toast.success('OTP verified!')
    step.value = 3
  } catch (e) {
    toast.error('Invalid or expired OTP. Please try again.')
  } finally {
    loading.value = false
  }
}

const resetPassword = async () => {
  if (!newPassword.value || newPassword.value !== confirmPassword.value)
    return toast.error('Passwords do not match')
  loading.value = true
  try {
    const { resetPassword: doReset } = useAuth()
    await doReset(resetToken.value, newPassword.value)
    toast.success('Password reset successfully! Please login.')
    navigateTo('/login')
  } catch (e) {
    toast.error('Failed to reset password. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
