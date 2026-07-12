<template>
	<div class="w-full flex justify-center items-center py-6">
		<div class="glass-card-light flex flex-col w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 relative">
			<!-- Log Out Button -->
			<button 
				@click="handleLogout" 
				class="absolute top-6 right-6 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
			>
				<Icon name="mdi:logout" class="w-4 h-4" />
				<span>Sign Out</span>
			</button>

			<!-- Header -->
			<div class="mb-8 text-center sm:text-left">
				<h1 class="text-3xl font-extrabold text-slate-900 mb-2">
					{{ authStore.businessStatus === 'PENDING' ? 'Registration Status' : 'Business Profile Setup' }}
				</h1>
				<p class="text-slate-500">
					{{ authStore.businessStatus === 'PENDING' 
						? 'Your application is currently being reviewed by our system administrators.' 
						: 'Please complete your business details below to get started.' }}
				</p>
			</div>

			<!-- PENDING State Screen -->
			<div v-if="authStore.businessStatus === 'PENDING'" class="space-y-8 animate-fade-in">
				<div class="flex flex-col items-center justify-center p-8 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 rounded-2xl text-center">
					<div class="relative w-20 h-20 mb-6 flex items-center justify-center">
						<span class="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-25 animate-ping"></span>
						<div class="relative rounded-full bg-indigo-600 p-4 text-white shadow-lg">
							<Icon name="mdi:clock-check-outline" class="w-10 h-10" />
						</div>
					</div>
					<h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Pending Admin Approval</h2>
					<p class="text-sm text-slate-500 max-w-md">
						We are verifying your credentials and business registration. You will receive access to your sales and inventory dashboards once approved.
					</p>
				</div>

				<!-- Live Details Check -->
				<div class="border-t pt-6">
					<h3 class="font-bold text-slate-800 dark:text-slate-200 mb-4">Application Details</h3>
					<div class="grid grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
						<div>
							<span class="block text-xs font-semibold text-slate-400 uppercase">Business Name</span>
							<span class="font-medium text-slate-700 dark:text-slate-200">{{ bizProfile?.business_name || '—' }}</span>
						</div>
						<div>
							<span class="block text-xs font-semibold text-slate-400 uppercase">Business Type</span>
							<span class="font-medium text-slate-700 dark:text-slate-200">{{ bizProfile?.business_type || '—' }}</span>
						</div>
						<div class="col-span-2">
							<span class="block text-xs font-semibold text-slate-400 uppercase">Support Email</span>
							<span class="font-medium text-slate-700 dark:text-slate-200">{{ bizProfile?.email || '—' }}</span>
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-4 pt-4">
					<v-btn 
						color="primary" 
						size="large" 
						rounded="xl" 
						class="flex-1 shadow-lg py-4 font-bold text-base"
						:loading="checkingStatus"
						@click="checkStatus"
					>
						<Icon name="mdi:refresh" class="mr-2" />
						Check Status Now
					</v-btn>
				</div>
			</div>

			<!-- NOT_SET (Setup Form) State Screen -->
			<v-form v-else @submit.prevent="handleSubmit" class="space-y-6 animate-fade-in">
				<!-- Step 1: General Info -->
				<div class="space-y-4">
					<h3 class="font-bold text-slate-800 dark:text-slate-200 border-b pb-2">1. General Information</h3>
					<v-row>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.business_name" 
								label="Business Name *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. My Nuxt E-commerce"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-select 
								v-model="form.business_type" 
								label="Business Type *" 
								:items="['ECOMMERCE', 'RETAIL', 'SERVICE', 'WHOLESALE', 'MANUFACTURING']" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.email" 
								label="Business Email" 
								variant="outlined" 
								rounded="lg"
								placeholder="e.g. contact@mycompany.com"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.phone" 
								label="Business Phone" 
								variant="outlined" 
								rounded="lg"
								placeholder="e.g. +1234567890"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.website" 
								label="Website URL" 
								variant="outlined" 
								rounded="lg"
								placeholder="e.g. https://mycompany.com"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.registration_number" 
								label="Registration Number" 
								variant="outlined" 
								rounded="lg"
								placeholder="e.g. REG-1234"
							/>
						</v-col>
					</v-row>
				</div>

				<!-- Step 2: Address Info -->
				<div class="space-y-4 pt-2">
					<h3 class="font-bold text-slate-800 dark:text-slate-200 border-b pb-2">2. Headquarters Address</h3>
					<v-row>
						<v-col cols="12">
							<v-text-field 
								v-model="form.address.address_line_1" 
								label="Address Line 1 *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. 123 Tech Park"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.address.city" 
								label="City *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. San Francisco"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.address.state" 
								label="State *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. CA"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.address.country" 
								label="Country *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. USA"
							/>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field 
								v-model="form.address.zip_code" 
								label="ZIP Code *" 
								variant="outlined" 
								rounded="lg"
								:rules="[isRequired]"
								placeholder="e.g. 94105"
							/>
						</v-col>
					</v-row>
				</div>

				<div class="pt-4">
					<v-btn 
						color="primary" 
						size="large" 
						rounded="xl" 
						class="w-full shadow-lg py-4 font-bold text-base"
						type="submit"
						:loading="submitting"
					>
						Submit Profile Setup
					</v-btn>
				</div>
			</v-form>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useAuthStore } from '~/stores/auth'
import { useBusinessProfile } from '~/composables/useBusinessProfile'
import { useValidation } from '~/composables/useValidation'

definePageMeta({
	title: 'Business Setup',
	description: 'Setup your business profile',
	layout: 'login',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER']
})

const authStore = useAuthStore()
const { required: isRequired } = useValidation()
const { setupBusiness, getProfile } = useBusinessProfile()

const submitting = ref(false)
const checkingStatus = ref(false)
const bizProfile = ref(null)

const form = ref({
	business_name: '',
	business_type: 'ECOMMERCE',
	email: '',
	phone: '',
	website: '',
	registration_number: '',
	address: {
		address_line_1: '',
		city: '',
		state: '',
		country: 'India',
		zip_code: ''
	}
})

const fetchProfile = async () => {
	try {
		const res = await getProfile()
		const data = res?.data || res
		if (data && data.business_id) {
			bizProfile.value = data
			authStore.businessStatus = data.status || 'PENDING'
		}
	} catch (e) {
		// Expect 404/failure if no profile exists
		authStore.businessStatus = 'NOT_SET'
	}
}

const checkStatus = async () => {
	checkingStatus.value = true
	try {
		await fetchProfile()
		if (authStore.businessStatus === 'ACTIVE') {
			toast.success('Your business profile has been approved!')
			navigateTo('/business')
		} else {
			toast.info('Status is still pending. We appreciate your patience!')
		}
	} catch (e) {
		toast.error('Failed to retrieve current status')
	} finally {
		checkingStatus.value = false
	}
}

const handleSubmit = async () => {
	if (!form.value.business_name || !form.value.business_type || !form.value.address.address_line_1 || !form.value.address.city || !form.value.address.state || !form.value.address.zip_code) {
		return toast.error('Please complete all required fields (*)')
	}

	submitting.value = true
	try {
		const payload = {
			business_name: form.value.business_name.trim(),
			business_type: form.value.business_type,
			email: form.value.email?.trim() || null,
			phone: form.value.phone?.trim() || null,
			website: form.value.website?.trim() || null,
			registration_number: form.value.registration_number?.trim() || null,
			address: {
				address_line_1: form.value.address.address_line_1.trim(),
				city: form.value.address.city.trim(),
				state: form.value.address.state.trim(),
				country: form.value.address.country.trim(),
				zip_code: form.value.address.zip_code.trim()
			}
		}

		await setupBusiness(payload)
		toast.success('Setup request submitted! Waiting for Admin approval.')
		authStore.businessStatus = 'PENDING'
		await fetchProfile()
	} catch (e) {
		console.error(e)
		toast.error(e?.data?.message || e?.message || 'Failed to submit setup request')
	} finally {
		submitting.value = false
	}
}

const handleLogout = () => {
	authStore.doLogout()
}

onMounted(() => {
	fetchProfile()
})
</script>

<style scoped>
.animate-fade-in {
	animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
}
</style>
