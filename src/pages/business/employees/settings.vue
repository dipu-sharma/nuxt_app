<template>
	<div class="p-6 bg-background text-text font-sans min-height: 100vh">
		<!-- Header -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
			style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-text mb-2">Employee Settings</h1>
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
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Timezone</label>
						<div class="relative">
							<select v-model="form.timezone" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="Asia/Kolkata">Asia/Kolkata</option>
								<option value="America/New_York">America/New_York</option>
								<option value="Europe/London">Europe/London</option>
								<option value="Asia/Dubai">Asia/Dubai</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Dashboard Layout</label>
						<div class="relative">
							<select v-model="form.dashboard_layout" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="default">Default</option>
								<option value="compact">Compact</option>
								<option value="expanded">Expanded</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Inventory View Mode</label>
						<div class="relative">
							<select v-model="form.inventory_view_mode" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="table">Table</option>
								<option value="card">Card</option>
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
							<p class="text-xs text-text opacity-50">Receive email updates</p>
						</div>
						<v-switch v-model="form.email_notifications" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Low Stock Alerts</p>
							<p class="text-xs text-text opacity-50">Get notified for low stock items</p>
						</div>
						<v-switch v-model="form.low_stock_alerts" color="primary" inset hide-details density="compact" />
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-semibold text-text">Order Alerts</p>
							<p class="text-xs text-text opacity-50">Get notified for new orders</p>
						</div>
						<v-switch v-model="form.order_alerts" color="primary" inset hide-details density="compact" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Employee Settings',
	middleware: 'auth-role',
	layout: 'admin',
})

const { getEmployeeSettings, updateEmployeeSettings } = useSettings()

const loading = ref(true)
const saving = ref(false)

const form = ref({
	language: 'en',
	timezone: 'Asia/Kolkata',
	dashboard_layout: 'default',
	inventory_view_mode: 'table',
	default_branch_id: '',
	email_notifications: true,
	low_stock_alerts: true,
	order_alerts: false,
})

const fetchSettings = async () => {
	loading.value = true
	try {
		const res = await getEmployeeSettings()
		const data = res?.data || res
		Object.keys(form.value).forEach((key) => {
			if (data[key] !== undefined) {
				form.value[key] = data[key]
			}
		})
	} catch (e) {
		console.error('Failed to load employee settings', e)
	} finally {
		loading.value = false
	}
}

const saveSettings = async () => {
	saving.value = true
	try {
		await updateEmployeeSettings(form.value)
		toast.success('Employee settings saved successfully!')
	} catch (e) {
		console.error('Failed to save employee settings', e)
	} finally {
		saving.value = false
	}
}

onMounted(fetchSettings)
</script>
