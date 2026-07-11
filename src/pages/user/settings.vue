<template>
	<div class="p-6 bg-background text-text font-sans min-height: 100vh">
		<!-- Header -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
			style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-text mb-2">My Settings</h1>
				<p class="text-text opacity-70 text-sm font-medium tracking-wide">
					Manage your personal preferences and notification settings.
				</p>
			</div>
			<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="saveSettings"
				:loading="saving" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
				<template #prepend>
					<Icon name="mdi:content-save" class="w-4 h-4 mr-0.5" />
				</template>
				SAVE CHANGES
			</v-btn>
		</div>

		<!-- Loading -->
		<div v-if="loading" class="p-12 text-center">
			<v-progress-circular indeterminate color="primary" :size="40" :width="3" class="opacity-50" />
		</div>

		<!-- Form -->
		<div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Preferences -->
			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:cog-outline" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-semibold text-text">Preferences</h2>
				</div>

				<div class="space-y-5">
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Language</label>
						<div class="relative">
							<select v-model="form.language" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="en">English</option>
								<option value="hi">Hindi</option>
								<option value="ar">Arabic</option>
								<option value="es">Spanish</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Currency</label>
						<div class="relative">
							<select v-model="form.currency" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="INR">INR - Indian Rupee</option>
								<option value="USD">USD - US Dollar</option>
								<option value="EUR">EUR - Euro</option>
								<option value="GBP">GBP - British Pound</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Theme</label>
						<div class="relative">
							<select v-model="form.theme" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="light">Light</option>
								<option value="dark">Dark</option>
								<option value="system">System</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
				</div>
			</div>

			<!-- Notifications -->
			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:bell-outline" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-semibold text-text">Notifications</h2>
				</div>

				<div class="space-y-5">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Email Notifications</p>
							<p class="text-xs text-text opacity-50">Receive updates via email</p>
						</div>
						<v-switch v-model="form.email_notifications" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">SMS Notifications</p>
							<p class="text-xs text-text opacity-50">Receive updates via SMS</p>
						</div>
						<v-switch v-model="form.sms_notifications" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Push Notifications</p>
							<p class="text-xs text-text opacity-50">Receive browser push notifications</p>
						</div>
						<v-switch v-model="form.push_notifications" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Marketing Emails</p>
							<p class="text-xs text-text opacity-50">Receive promotional emails</p>
						</div>
						<v-switch v-model="form.marketing_emails" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Order Updates</p>
							<p class="text-xs text-text opacity-50">Get notified about order status changes</p>
						</div>
						<v-switch v-model="form.order_updates" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Wishlist Alerts</p>
							<p class="text-xs text-text opacity-50">Get notified when wishlist items go on sale</p>
						</div>
						<v-switch v-model="form.wishlist_alerts" color="primary" inset hide-details density="compact" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'My Settings',
	middleware: ['auth-role'],
	layout: 'user',
})

const { getUserSettings, updateUserSettings } = useSettings()

const loading = ref(true)
const saving = ref(false)

const form = ref({
	language: 'en',
	currency: 'INR',
	theme: 'light',
	email_notifications: true,
	sms_notifications: false,
	push_notifications: true,
	marketing_emails: false,
	order_updates: true,
	wishlist_alerts: true,
})

const fetchSettings = async () => {
	loading.value = true
	try {
		const res = await getUserSettings()
		const data = res?.data || res
		Object.keys(form.value).forEach((key) => {
			if (data[key] !== undefined) {
				form.value[key] = data[key]
			}
		})
	} catch (e) {
		console.error('Failed to load user settings', e)
	} finally {
		loading.value = false
	}
}

const saveSettings = async () => {
	saving.value = true
	try {
		await updateUserSettings(form.value)
		toast.success('Settings saved successfully!')
	} catch (e) {
		console.error('Failed to save settings', e)
	} finally {
		saving.value = false
	}
}

onMounted(fetchSettings)
</script>
