<template>
	<div class="p-6 bg-background text-text font-sans min-height: 100vh">
		<!-- Header -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
			style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-text mb-2">Admin Settings</h1>
				<p class="text-text opacity-70 text-sm font-medium tracking-wide">
					Manage business capabilities, platform configurations, and setting definitions schema.
				</p>
			</div>

			<!-- Top Mode Selector -->
			<div class="flex gap-1 p-1 rounded-xl bg-card border border-border w-fit shadow-sm"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<button @click="mode = 'capabilities'"
					class="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 uppercase tracking-wider"
					:class="mode === 'capabilities' ? 'shadow bg-primary text-white' : 'opacity-60 text-text'">
					Capabilities
				</button>
				<button @click="mode = 'configure'"
					class="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 uppercase tracking-wider"
					:class="mode === 'configure' ? 'shadow bg-primary text-white' : 'opacity-60 text-text'">
					Platform Values
				</button>
				<button @click="mode = 'definitions'"
					class="px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 uppercase tracking-wider"
					:class="mode === 'definitions' ? 'shadow bg-primary text-white' : 'opacity-60 text-text'">
					Definitions Schema
				</button>
			</div>
		</div>

		<!-- MODE 1: BUSINESS CAPABILITIES (Admin Only) -->
		<div v-if="mode === 'capabilities'">
			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] max-w-3xl mb-8"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				
				<div class="flex items-center gap-3 mb-6">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:domain" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<div>
						<h2 class="text-lg font-bold text-text">Tenant Capabilities Configuration</h2>
						<p class="text-xs text-text opacity-50 font-medium">Toggle module features and capabilities for specific businesses</p>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-4 mb-6">
					<div class="flex-1">
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business ID</label>
						<input v-model="targetBusinessId" type="text" placeholder="e.g. bus_AqE7zVXXK59GfZTa or 4"
							class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
							style="border-color: rgb(var(--color-border))" />
					</div>
					<div class="flex items-end">
						<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="loadCapabilities"
							:loading="loadingCapabilities" class="px-8 text-none tracking-wider font-semibold text-white shadow-sm" elevation="0">
							LOAD SCHEMAS
						</v-btn>
					</div>
				</div>

				<!-- Capabilities toggles -->
				<div v-if="capabilitiesLoaded" class="border-t border-border/40 pt-6 space-y-4">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div v-for="cap in capabilityFields" :key="cap.key" class="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/30">
							<div>
								<p class="text-sm font-semibold text-text capitalize">{{ formatCapLabel(cap.key) }}</p>
								<p class="text-[10px] text-text opacity-40 font-mono mt-0.5">{{ cap.key }}</p>
							</div>
							<v-switch v-model="capabilitiesForm[cap.key]" color="primary" inset hide-details density="compact" />
						</div>
					</div>

					<div class="flex justify-end pt-4">
						<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="saveCapabilities"
							:loading="savingCapabilities" class="px-8 text-none tracking-wider font-semibold text-white shadow-sm" elevation="0">
							SAVE CAPABILITIES
						</v-btn>
					</div>
				</div>
				<div v-else class="text-center py-8 text-text opacity-40 italic text-sm">
					Please input a Business ID and click Load to configure tenant capabilities.
				</div>
			</div>
		</div>

		<!-- MODE 2: PLATFORM CONFIG VALUES -->
		<div v-else-if="mode === 'configure'">
			<div v-if="loading" class="bg-card rounded-[2.5rem] p-12 border border-border text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<v-progress-circular indeterminate color="primary" :size="40" :width="3" class="opacity-50" />
			</div>

			<div v-else>
				<!-- Dynamic tabs based on unique groups -->
				<div v-if="uniqueGroups.length > 0" class="flex gap-1 p-1.5 rounded-[1.5rem] bg-card border border-border w-fit shadow-sm flex-wrap mb-8"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<button v-for="grp in uniqueGroups" :key="grp" @click="activeGroup = grp"
						class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-100 uppercase tracking-wider"
						:class="activeGroup === grp ? 'shadow-md hover:scale-102' : 'opacity-60'"
						:style="activeGroup === grp
							? 'background-color: rgb(var(--color-primary)); color: white'
							: 'color: rgb(var(--color-text))'">
						{{ grp }}
					</button>
				</div>

				<div v-if="filteredSettings.length === 0" class="bg-card rounded-[2.5rem] p-16 border border-border text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<p class="text-sm font-medium text-text opacity-50">No settings found. Use the Definitions Schema manager to configure fields.</p>
				</div>

				<div v-else class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] max-w-3xl"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					
					<div class="flex justify-between items-center mb-8 border-b border-border/50 pb-4">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl flex items-center justify-center"
								style="background-color: rgb(var(--color-primary) / 0.1)">
								<Icon name="mdi:cog-outline" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
							</div>
							<div>
								<h2 class="text-lg font-bold text-text uppercase tracking-wide">{{ activeGroup }} Settings</h2>
								<p class="text-xs text-text opacity-50 font-medium">Configure dynamic setting values globally</p>
							</div>
						</div>

						<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="saveSettings"
							:loading="saving" class="px-8 text-none tracking-widest font-semibold text-white" elevation="0">
							SAVE CHANGES
						</v-btn>
					</div>

					<div class="space-y-6">
						<div v-for="item in filteredSettings" :key="item.setting_id" class="border-b border-border/30 pb-5 last:border-0 last:pb-0">
							<!-- Checkbox / Toggle dynamic input -->
							<div v-if="item.field_type === 'checkbox'" class="flex items-center justify-between">
								<div>
									<p class="text-sm font-semibold text-text">{{ item.label }}</p>
									<p class="text-xs text-text opacity-40 font-mono mt-0.5">{{ item.key }}</p>
								</div>
								<v-switch v-model="dynamicForm[item.key]" color="primary" inset hide-details density="compact"
									:disabled="item.has_lock === 'locked'" />
							</div>

							<!-- Select dropdown dynamic input -->
							<div v-else-if="item.field_type === 'select'" class="space-y-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block">
									{{ item.label }} <span class="font-mono lowercase opacity-40">({{ item.key }})</span>
								</label>
								<div class="relative max-w-md">
									<select v-model="dynamicForm[item.key]" :disabled="item.has_lock === 'locked'"
										class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer"
										style="border-color: rgb(var(--color-border))">
										<option v-for="opt in parseOptions(item.field_options)" :key="opt" :value="opt">
											{{ opt }}
										</option>
									</select>
									<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
								</div>
							</div>

							<!-- Number dynamic input -->
							<div v-else-if="item.field_type === 'number' || item.field_type === 'integer'" class="space-y-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block">
									{{ item.label }} <span class="font-mono lowercase opacity-40">({{ item.key }})</span>
								</label>
								<input v-model.number="dynamicForm[item.key]" type="number" :disabled="item.has_lock === 'locked'"
									class="w-full max-w-md px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>

							<!-- Default text dynamic input -->
							<div v-else class="space-y-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block">
									{{ item.label }} <span class="font-mono lowercase opacity-40">({{ item.key }})</span>
								</label>
								<input v-model="dynamicForm[item.key]" type="text" :disabled="item.has_lock === 'locked'"
									class="w-full max-w-md px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- MODE 3: DEFINITIONS SCHEMA MANAGER -->
		<div v-else-if="mode === 'definitions'">
			<div v-if="loading" class="bg-card rounded-[2.5rem] p-12 border border-border text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<v-progress-circular indeterminate color="primary" :size="40" :width="3" class="opacity-50" />
			</div>

			<div v-else class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				
				<div class="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
					<h2 class="text-lg font-bold text-text uppercase tracking-wide">Setting Definitions</h2>
					<v-btn color="primary" variant="flat" rounded="pill" @click="openCreateDefModal"
						class="px-6 text-none tracking-widest font-semibold text-white shadow-sm" elevation="0">
						<template #prepend>
							<Icon name="mdi:plus" class="w-4 h-4 mr-0.5" />
						</template>
						CREATE FIELD
					</v-btn>
				</div>

				<div v-if="allSettingsList.length === 0" class="p-16 text-center text-text opacity-50 italic">
					No settings schema fields exist. Click Create Field to configure.
				</div>

				<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50" style="border-color: rgb(var(--color-border))">
					<v-data-table
						:headers="defHeaders"
						:items="allSettingsList"
						class="custom-data-table"
						hide-default-footer
						hover
					>
						<template #item.key="{ item }">
							<span class="font-mono text-xs font-bold text-primary">{{ item.key }}</span>
						</template>
						<template #item.label="{ item }">
							<span class="font-medium text-text">{{ item.label }}</span>
						</template>
						<template #item.group="{ item }">
							<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary uppercase">
								{{ item.group }}
							</span>
						</template>
						<template #item.field_type="{ item }">
							<span class="font-mono text-xs text-text opacity-70">{{ item.field_type }}</span>
						</template>
						<template #item.field_options="{ item }">
							<span class="text-xs opacity-65 truncate max-w-xs block font-mono">{{ item.field_options || '—' }}</span>
						</template>
						<template #item.value="{ item }">
							<span class="text-xs opacity-85">{{ item.value }}</span>
						</template>
						<template #item.has_lock="{ item }">
							<span v-if="item.has_lock === 'locked'" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest">
								Locked
							</span>
							<span v-else class="text-xs opacity-40">unlocked</span>
						</template>
						<template #item.display_order="{ item }">
							<span class="font-mono text-xs font-bold">{{ item.display_order }}</span>
						</template>
						<template #item.actions="{ item }">
							<div class="flex justify-end gap-1">
								<v-btn size="small" variant="text" color="primary" @click="openEditDefModal(item)">Edit</v-btn>
								<v-btn size="small" variant="text" color="error" :disabled="item.has_lock === 'locked'" @click="deleteDefAction(item)">Delete</v-btn>
							</div>
						</template>
					</v-data-table>
				</div>
			</div>
		</div>

		<!-- Dialog for Creating / Editing setting definition schema -->
		<v-dialog v-model="defDialog" max-width="500" persistent>
			<v-card class="rounded-[2rem] p-6 bg-card border border-border" style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<v-card-title class="px-0 pt-0 pb-4 font-bold text-lg border-b border-border/50 text-text">
					{{ isEditingDef ? 'Edit Setting Schema' : 'Create Setting Schema' }}
				</v-card-title>
				
				<v-card-text class="px-0 py-6 space-y-4">
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Setting Key *</label>
						<input v-model="defForm.key" type="text" placeholder="e.g. maintenance_mode" :disabled="isEditingDef"
							class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
							style="border-color: rgb(var(--color-border))" />
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Field Label *</label>
						<input v-model="defForm.label" type="text" placeholder="e.g. Maintenance Mode"
							class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
							style="border-color: rgb(var(--color-border))" />
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Group *</label>
							<input v-model="defForm.group" type="text" placeholder="e.g. general"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Field Type *</label>
							<div class="relative">
								<select v-model="defForm.field_type"
									class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer"
									style="border-color: rgb(var(--color-border))">
									<option value="text">text</option>
									<option value="checkbox">checkbox</option>
									<option value="select">select</option>
									<option value="number">number</option>
								</select>
								<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
							</div>
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Field Options (Select type only)</label>
						<input v-model="defForm.field_options" type="text" placeholder='e.g. ["Option1", "Option2"]'
							class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
							style="border-color: rgb(var(--color-border))" />
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Default Value</label>
							<input v-model="defForm.value" type="text" placeholder="e.g. false"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Display Order</label>
							<input v-model.number="defForm.display_order" type="number" placeholder="e.g. 1"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Lock Status</label>
						<div class="relative">
							<select v-model="defForm.has_lock"
								class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer"
								style="border-color: rgb(var(--color-border))">
								<option :value="null">unlocked</option>
								<option value="locked">locked</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
				</v-card-text>

				<v-card-actions class="px-0 pb-0 gap-3">
					<v-btn variant="outlined" rounded="pill" size="large" class="flex-1 text-none font-semibold text-text border-border" @click="defDialog = false">
						Cancel
					</v-btn>
					<v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none font-semibold text-white" :loading="savingDef" @click="saveDefAction">
						Save field
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Admin Settings',
	middleware: ['auth-role'],
	role: ['SUPERADMIN', 'ADMIN'],
	layout: 'admin',
})

const { 
	getDynamicSettings, 
	updateBusinessDynamicSettings, 
	createDynamicSettingDefinition, 
	updateDynamicSettingDefinition, 
	deleteDynamicSettingDefinition,
	getBusinessCapabilities,
	updateBusinessCapabilities
} = useSettings()

const loading = ref(true)
const saving = ref(false)
const mode = ref('capabilities') // 'capabilities', 'configure', 'definitions'
const activeGroup = ref('')
const allSettingsList = ref([])
const dynamicForm = ref({})

// Capabilities Form states
const targetBusinessId = ref('')
const loadingCapabilities = ref(false)
const capabilitiesLoaded = ref(false)
const savingCapabilities = ref(false)
const capabilitiesForm = ref({
	enable_inventory: true,
	enable_purchase_orders: true,
	enable_stock_transfers: true,
	enable_suppliers: true,
	enable_tax_management: true,
	enable_reports: true,
	enable_pos_selling: true,
	enable_multi_branch: true,
	enable_employee_management: true
})

const capabilityFields = [
	{ key: 'enable_inventory' },
	{ key: 'enable_purchase_orders' },
	{ key: 'enable_stock_transfers' },
	{ key: 'enable_suppliers' },
	{ key: 'enable_tax_management' },
	{ key: 'enable_reports' },
	{ key: 'enable_pos_selling' },
	{ key: 'enable_multi_branch' },
	{ key: 'enable_employee_management' },
]

// Definitions Schema form states
const defDialog = ref(false)
const isEditingDef = ref(false)
const savingDef = ref(false)
const editingDefId = ref(null)
const defForm = ref({
	key: '',
	label: '',
	group: 'general',
	field_type: 'text',
	field_options: null,
	value: '',
	has_lock: null,
	display_order: 1
})

const defHeaders = [
	{ title: 'Key', key: 'key', sortable: true },
	{ title: 'Label', key: 'label', sortable: true },
	{ title: 'Group', key: 'group', sortable: true },
	{ title: 'Type', key: 'field_type', sortable: true },
	{ title: 'Options', key: 'field_options', sortable: false },
	{ title: 'Default Value', key: 'value', sortable: false },
	{ title: 'Lock Status', key: 'has_lock', sortable: true },
	{ title: 'Order', key: 'display_order', sortable: true },
	{ title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const allSettingsListSorted = computed(() => {
	return [...allSettingsList.value].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
})

const uniqueGroups = computed(() => {
	const groups = new Set()
	allSettingsList.value.forEach(item => {
		if (item.group) groups.add(item.group)
	})
	return Array.from(groups)
})

const filteredSettings = computed(() => {
	return allSettingsListSorted.value.filter(item => item.group === activeGroup.value)
})

const parseOptions = (optionsStr) => {
	if (!optionsStr) return []
	try {
		const parsed = JSON.parse(optionsStr)
		if (Array.isArray(parsed)) return parsed
	} catch (e) {
		return optionsStr.split(',').map(o => o.trim())
	}
	return []
}

const formatCapLabel = (key) => {
	return key.replace('enable_', '').replace(/_/g, ' ')
}

// Watch unique groups to initialize activeGroup tab selection
watch(uniqueGroups, (newGroups) => {
	if (newGroups.length > 0 && !newGroups.includes(activeGroup.value)) {
		activeGroup.value = newGroups[0]
	}
}, { immediate: true })

const loadAllSettings = async () => {
	loading.value = true
	try {
		const res = await getDynamicSettings()
		allSettingsList.value = res?.data || res || []
		
		const newForm = {}
		allSettingsList.value.forEach(item => {
			if (item.field_type === 'checkbox') {
				newForm[item.key] = item.value === 'true'
			} else if (item.field_type === 'number' || item.field_type === 'integer') {
				newForm[item.key] = Number(item.value) || 0
			} else {
				newForm[item.key] = item.value || ''
			}
		})
		dynamicForm.value = newForm
	} catch (e) {
		console.error('Failed to load settings', e)
		toast.error('Failed to load platform settings')
	} finally {
		loading.value = false
	}
}

const saveSettings = async () => {
	saving.value = true
	try {
		const payload = Object.keys(dynamicForm.value).map(key => ({
			key,
			value: String(dynamicForm.value[key])
		}))
		await updateBusinessDynamicSettings(payload)
		toast.success('Platform configurations updated!')
		loadAllSettings()
	} catch (e) {
		console.error(e)
		toast.error('Failed to save configuration values')
	} finally {
		saving.value = false
	}
}

// Business Capabilities Logic
const loadCapabilities = async () => {
	if (!targetBusinessId.value) return toast.error('Please input a valid Business ID')
	loadingCapabilities.value = true
	try {
		const res = await getBusinessCapabilities(targetBusinessId.value)
		const data = res?.data || res
		capabilityFields.forEach(cap => {
			capabilitiesForm.value[cap.key] = data[cap.key] !== undefined ? !!data[cap.key] : true
		})
		capabilitiesLoaded.value = true
		toast.success('Capabilities loaded successfully!')
	} catch (e) {
		console.error(e)
		toast.error('Failed to load business capabilities')
		capabilitiesLoaded.value = false
	} finally {
		loadingCapabilities.value = false
	}
}

const saveCapabilities = async () => {
	if (!targetBusinessId.value) return
	savingCapabilities.value = true
	try {
		await updateBusinessCapabilities(targetBusinessId.value, capabilitiesForm.value)
		toast.success('Tenant capabilities updated successfully!')
	} catch (e) {
		console.error(e)
		toast.error('Failed to update tenant capabilities')
	} finally {
		savingCapabilities.value = false
	}
}

// Schema definitions manager actions
const openCreateDefModal = () => {
	isEditingDef.value = false
	editingDefId.value = null
	defForm.value = {
		key: '',
		label: '',
		group: 'general',
		field_type: 'text',
		field_options: null,
		value: '',
		has_lock: null,
		display_order: 1
	}
	defDialog.value = true
}

const openEditDefModal = (item) => {
	isEditingDef.value = true
	editingDefId.value = item.setting_id || item.id
	defForm.value = {
		key: item.key || '',
		label: item.label || '',
		group: item.group || 'general',
		field_type: item.field_type || 'text',
		field_options: item.field_options || null,
		value: item.value || '',
		has_lock: item.has_lock || null,
		display_order: item.display_order || 1
	}
	defDialog.value = true
}

const saveDefAction = async () => {
	if (!defForm.value.key || !defForm.value.label || !defForm.value.group) {
		return toast.error('Key, Label, and Group are required fields')
	}
	savingDef.value = true
	try {
		if (isEditingDef.value) {
			await updateDynamicSettingDefinition(editingDefId.value, {
				label: defForm.value.label,
				group: defForm.value.group,
				field_type: defForm.value.field_type,
				field_options: defForm.value.field_options,
				value: defForm.value.value,
				has_lock: defForm.value.has_lock,
				display_order: Number(defForm.value.display_order)
			})
			toast.success('Setting schema updated successfully!')
		} else {
			await createDynamicSettingDefinition({
				key: defForm.value.key,
				label: defForm.value.label,
				group: defForm.value.group,
				field_type: defForm.value.field_type,
				field_options: defForm.value.field_options,
				value: defForm.value.value,
				has_lock: defForm.value.has_lock,
				display_order: Number(defForm.value.display_order)
			})
			toast.success('Setting schema field created successfully!')
		}
		defDialog.value = false
		loadAllSettings()
	} catch (e) {
		console.error(e)
		toast.error('Failed to save setting schema field')
	} finally {
		savingDef.value = false
	}
}

const deleteDefAction = async (item) => {
	if (item.has_lock === 'locked') {
		return toast.error('Locked settings schemas cannot be deleted.')
	}
	if (!confirm(`Are you sure you want to delete settings field "${item.label || item.key}"?`)) return
	try {
		await deleteDynamicSettingDefinition(item.setting_id || item.id)
		toast.success('Setting schema field deleted!')
		loadAllSettings()
	} catch (e) {
		console.error(e)
		toast.error('Failed to delete setting schema field')
	}
}

onMounted(() => {
	loadAllSettings()
})
</script>

<style scoped>
.custom-data-table {
	background: transparent !important;
}
:deep(.v-data-table-header__content) {
	font-weight: 600 !important;
	text-transform: uppercase !important;
	font-size: 10px !important;
	letter-spacing: 0.1em !important;
	color: #a8a29e !important;
}
</style>
