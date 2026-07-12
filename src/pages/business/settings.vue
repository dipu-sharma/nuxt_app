<template>
	<div class="p-6 bg-background text-text font-sans min-height: 100vh">
		<!-- Header -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
			style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-text mb-2">Business Settings</h1>
				<p class="text-text opacity-70 text-sm font-medium tracking-wide">
					Configure business core parameters, tax compliance, inventory control, and custom preference profiles.
				</p>
			</div>
			<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="saveSettings"
				:loading="saving" :disabled="activeTab === 'dynamic' && dynamicSettings.length === 0" 
				class="px-8 text-none tracking-widest font-semibold text-white shadow-sm" elevation="0">
				<template #prepend>
					<Icon name="mdi:content-save" class="w-4 h-4 mr-0.5" />
				</template>
				SAVE CHANGES
			</v-btn>
		</div>

		<!-- Navigation Tabs -->
		<div class="flex gap-1 p-1.5 rounded-[1.5rem] bg-card border border-border w-fit shadow-sm flex-wrap mb-8"
			style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
			<button v-for="tab in tabs" :key="tab.key" @click="changeTab(tab.key)"
				class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-100 uppercase tracking-wider"
				:class="activeTab === tab.key ? 'shadow-md hover:scale-102' : 'opacity-60'"
				:style="activeTab === tab.key
					? 'background-color: rgb(var(--color-primary)); color: white'
					: 'color: rgb(var(--color-text))'">
				{{ tab.label }}
			</button>
		</div>

		<!-- LOADING STATE -->
		<div v-if="loading" class="bg-card rounded-[2.5rem] p-12 border border-border text-center shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
			style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
			<v-progress-circular indeterminate color="primary" :size="40" :width="3" class="opacity-50" />
			<p class="mt-4 text-sm font-medium text-text opacity-50">Loading settings...</p>
		</div>

		<div v-else class="max-w-3xl">
			<!-- TAB 0: BUSINESS PROFILE SETTINGS -->
			<div v-if="activeTab === 'business'" class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] mb-6"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:store-outline" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-bold text-text">Business Profile Details</h2>
				</div>
				<div class="space-y-6">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Name *</label>
							<input v-model="businessForm.business_name" type="text" placeholder="e.g. My Shop" required
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Type *</label>
							<div class="relative">
								<select v-model="businessForm.business_type" required
									class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer"
									style="border-color: rgb(var(--color-border))">
									<option value="ECOMMERCE">ECOMMERCE</option>
									<option value="RETAIL">RETAIL</option>
									<option value="SERVICE">SERVICE</option>
									<option value="WHOLESALE">WHOLESALE</option>
									<option value="MANUFACTURING">MANUFACTURING</option>
								</select>
								<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
							</div>
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Email</label>
							<input v-model="businessForm.email" type="email" placeholder="e.g. contact@myshop.com"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Phone</label>
							<input v-model="businessForm.phone" type="text" placeholder="e.g. 9555282779"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Website URL</label>
							<input v-model="businessForm.website" type="text" placeholder="e.g. https://myshop.com"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Registration Number</label>
							<input v-model="businessForm.registration_number" type="text" placeholder="e.g. REG-12345"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Tax ID</label>
							<input v-model="businessForm.tax_id" type="text" placeholder="e.g. GST-12345 / PAN-ABCDE1234F"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
					</div>

					<!-- Headquarters Address -->
					<div class="border-t border-border/30 pt-4 space-y-4">
						<h3 class="font-bold text-sm text-text">Headquarters Address</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Address Line 1 *</label>
								<input v-model="businessForm.address.address_line_1" type="text" placeholder="e.g. Mundadih" required
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Address Line 2</label>
								<input v-model="businessForm.address.address_line_2" type="text" placeholder="e.g. Suite 400"
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">City *</label>
								<input v-model="businessForm.address.city" type="text" placeholder="e.g. Ballia" required
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">State *</label>
								<input v-model="businessForm.address.state" type="text" placeholder="e.g. Uttar Pradesh" required
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Country *</label>
								<input v-model="businessForm.address.country" type="text" placeholder="e.g. India" required
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Zip Code *</label>
								<input v-model="businessForm.address.zip_code" type="text" placeholder="e.g. 277201" required
									class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
									style="border-color: rgb(var(--color-border))" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- TAB 1: GENERAL SETTINGS -->
			<div v-if="activeTab === 'general'" class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:earth" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-bold text-text">General Configurations</h2>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Timezone</label>
						<div class="relative">
							<select v-model="generalForm.timezone" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="Asia/Kolkata">Asia/Kolkata</option>
								<option value="America/New_York">America/New_York</option>
								<option value="Europe/London">Europe/London</option>
								<option value="Asia/Dubai">Asia/Dubai</option>
								<option value="America/Los_Angeles">America/Los_Angeles</option>
								<option value="UTC">UTC</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Date Format</label>
						<div class="relative">
							<select v-model="generalForm.date_format" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 31/12/2026)</option>
								<option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 12/31/2026)</option>
								<option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-12-31)</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Language</label>
						<div class="relative">
							<select v-model="generalForm.language" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="en">English</option>
								<option value="hi">Hindi</option>
								<option value="ar">Arabic</option>
								<option value="es">Spanish</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Currency Display</label>
						<div class="relative">
							<select v-model="generalForm.currency_display" class="appearance-none w-full pl-4 pr-10 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer" style="border-color: rgb(var(--color-border))">
								<option value="INR">INR - Indian Rupee (₹)</option>
								<option value="USD">USD - US Dollar ($)</option>
								<option value="EUR">EUR - Euro (€)</option>
								<option value="GBP">GBP - British Pound (£)</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
				</div>
			</div>

			<!-- TAB 2: TAX SETTINGS -->
			<div v-else-if="activeTab === 'tax'" class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:percent-outline" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-bold text-text">Tax compliance Settings</h2>
				</div>
				<div class="space-y-5">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Tax Display Name</label>
							<input v-model="taxForm.tax_display_name" type="text" placeholder="e.g. GST / VAT"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Default Tax Rate (%)</label>
							<input v-model.number="taxForm.default_tax_rate" type="number" min="0" max="100"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">GST Number</label>
							<input v-model="taxForm.gst_number" type="text" placeholder="e.g. 29ABCDE1234F1Z5"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">PAN Number</label>
							<input v-model="taxForm.pan_number" type="text" placeholder="e.g. ABCDE1234F"
								class="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
								style="border-color: rgb(var(--color-border))" />
						</div>
					</div>

					<div class="border-t border-border/30 pt-4 space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Tax Inclusive Pricing</p>
								<p class="text-xs text-text opacity-50">Show product prices including all taxes</p>
							</div>
							<v-switch v-model="taxForm.tax_inclusive_pricing" color="primary" inset hide-details density="compact" />
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Enable Tax on Shipping</p>
								<p class="text-xs text-text opacity-50">Apply GST/VAT values onto shipping charges</p>
							</div>
							<v-switch v-model="taxForm.enable_tax_on_shipping" color="primary" inset hide-details density="compact" />
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Enable GST</p>
								<p class="text-xs text-text opacity-50">Enable GST collection calculations</p>
							</div>
							<v-switch v-model="taxForm.enable_gst" color="primary" inset hide-details density="compact" />
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Auto Apply Default Tax</p>
								<p class="text-xs text-text opacity-50">Automatically apply default tax rate to new items</p>
							</div>
							<v-switch v-model="taxForm.auto_apply_default_tax" color="primary" inset hide-details density="compact" />
						</div>
					</div>
				</div>
			</div>

			<!-- TAB 3: INVENTORY SETTINGS -->
			<div v-else-if="activeTab === 'inventory'" class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div class="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
					<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
						<Icon name="mdi:package-variant" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
					</div>
					<h2 class="text-lg font-bold text-text">Inventory Configurations</h2>
				</div>
				<div class="space-y-5">
					<div>
						<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Default Low Stock Threshold</label>
						<input v-model.number="inventoryForm.default_low_stock_threshold" type="number" min="0"
							class="w-full max-w-xs px-4 py-3 bg-background border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text"
							style="border-color: rgb(var(--color-border))" />
					</div>
					
					<div class="border-t border-border/30 pt-4 space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Allow Negative Stock</p>
								<p class="text-xs text-text opacity-50">Allow sales transactions when stock levels are below zero</p>
							</div>
							<v-switch v-model="inventoryForm.allow_negative_stock" color="primary" inset hide-details density="compact" />
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Auto Deduct on Order</p>
								<p class="text-xs text-text opacity-50">Automatically reduce stock quantities on checkout</p>
							</div>
							<v-switch v-model="inventoryForm.auto_deduct_on_order" color="primary" inset hide-details density="compact" />
						</div>
						<div class="flex items-center justify-between">
							<div>
								<p class="text-sm font-semibold text-text">Low Stock Alerts</p>
								<p class="text-xs text-text opacity-50">Enable notifications when threshold quantities are reached</p>
							</div>
							<v-switch v-model="inventoryForm.enable_low_stock_alerts" color="primary" inset hide-details density="compact" />
						</div>
					</div>
				</div>
			</div>

			<!-- TAB 4: DYNAMIC SETTINGS FORM -->
			<div v-else-if="activeTab === 'dynamic'" class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				
				<div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-border/50 pb-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: rgb(var(--color-primary) / 0.1)">
							<Icon name="mdi:tune-variant" class="w-5 h-5" style="color: rgb(var(--color-primary))" />
						</div>
						<div>
							<h2 class="text-lg font-bold text-text">Dynamic Preferences</h2>
							<p class="text-xs text-text opacity-50 font-medium">Custom settings fields parsed from server definitions</p>
						</div>
					</div>
					
					<!-- Group Filter Dropdown inside Dynamic Tab -->
					<div class="flex items-center gap-2">
						<span class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">Group</span>
						<div class="relative">
							<select v-model="activeDynamicGroup" @change="fetchDynamicSettings"
								class="appearance-none pl-4 pr-10 py-2 bg-background border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer min-w-[120px]"
								style="border-color: rgb(var(--color-border))">
								<option value="general">general</option>
								<option value="theme">theme</option>
								<option value="notifications">notifications</option>
								<option value="ecommerce">ecommerce</option>
								<option value="system">system</option>
							</select>
							<Icon name="mdi:chevron-down" class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
						</div>
					</div>
				</div>

				<div v-if="dynamicSettings.length === 0" class="py-12 text-center text-text opacity-50 italic text-sm">
					No custom dynamic settings configured under this group yet.
				</div>

				<div v-else class="space-y-6">
					<div v-for="item in dynamicSettings" :key="item.setting_id" class="border-b border-border/30 pb-5 last:border-0 last:pb-0">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import { useBusinessProfile } from '~/composables/useBusinessProfile'
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Business Settings',
	middleware: ['auth-role'],
	role: ['BUSINESS_OWNER', 'VENDOR', 'ADMIN', 'SUPERADMIN'],
	layout: 'admin',
})

const { 
	getBusinessGeneral, 
	updateBusinessGeneral,
	getBusinessTax, 
	updateBusinessTax,
	getBusinessInventory, 
	updateBusinessInventory,
	getDynamicSettings,
	updateBusinessDynamicSettings
} = useSettings()

const { getProfile, updateProfile } = useBusinessProfile()

const loading = ref(true)
const saving = ref(false)
const activeTab = ref('business')

// Core forms models
const businessForm = ref({
	business_name: '',
	business_type: 'ECOMMERCE',
	email: '',
	phone: '',
	website: '',
	registration_number: '',
	tax_id: '',
	address: {
		address_id: '',
		address_line_1: '',
		address_line_2: '',
		landmark: '',
		city: '',
		state: '',
		country: '',
		zip_code: '',
		latitude: null,
		longitude: null,
		is_default: true,
		is_billing: true,
	}
})

const generalForm = ref({ timezone: 'Asia/Kolkata', date_format: 'DD/MM/YYYY', language: 'en', currency_display: 'INR' })
const taxForm = ref({
	tax_inclusive_pricing: false,
	default_tax_rate: 18,
	gst_number: '',
	pan_number: '',
	enable_tax_on_shipping: false,
	enable_gst: true,
	tax_display_name: 'GST',
	auto_apply_default_tax: true
})
const inventoryForm = ref({ default_low_stock_threshold: 10, allow_negative_stock: false, auto_deduct_on_order: true, enable_low_stock_alerts: true })

// Dynamic settings models
const activeDynamicGroup = ref('general')
const dynamicSettings = ref([])
const dynamicForm = ref({})

const tabs = [
	{ key: 'business', label: 'Business Profile' },
	{ key: 'general', label: 'General' },
	{ key: 'tax', label: 'Taxes' },
	{ key: 'inventory', label: 'Inventory' },
	{ key: 'dynamic', label: 'Dynamic' },
]

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

const changeTab = (tabKey) => {
	activeTab.value = tabKey
	loadTabData()
}

const loadTabData = async () => {
	loading.value = true
	try {
		if (activeTab.value === 'business') {
			const res = await getProfile()
			const bizData = res?.data?.[0] || res?.data || res
			if (bizData) {
				businessForm.value = {
					business_name: bizData.business_name || '',
					business_type: bizData.business_type || 'ECOMMERCE',
					email: bizData.email || '',
					phone: bizData.phone || '',
					website: bizData.website || '',
					registration_number: bizData.registration_number || '',
					tax_id: bizData.tax_id || '',
					address: {
						address_id: bizData.address?.address_id || '',
						address_line_1: bizData.address?.address_line_1 || '',
						address_line_2: bizData.address?.address_line_2 || '',
						landmark: bizData.address?.landmark || '',
						city: bizData.address?.city || '',
						state: bizData.address?.state || '',
						country: bizData.address?.country || '',
						zip_code: bizData.address?.zip_code || '',
						latitude: bizData.address?.latitude || null,
						longitude: bizData.address?.longitude || null,
						is_default: bizData.address?.is_default ?? true,
						is_billing: bizData.address?.is_billing ?? true,
					}
				}
			}
		} else if (activeTab.value === 'general') {
			const res = await getBusinessGeneral()
			generalForm.value = { ...generalForm.value, ...(res?.data || res) }
		} else if (activeTab.value === 'tax') {
			const res = await getBusinessTax()
			taxForm.value = { ...taxForm.value, ...(res?.data || res) }
		} else if (activeTab.value === 'inventory') {
			const res = await getBusinessInventory()
			inventoryForm.value = { ...inventoryForm.value, ...(res?.data || res) }
		} else if (activeTab.value === 'dynamic') {
			await fetchDynamicSettings()
		}
	} catch (e) {
		console.error('Failed to load settings tab data', e)
		toast.error('Failed to load settings')
	} finally {
		loading.value = false
	}
}

const fetchDynamicSettings = async () => {
	try {
		const res = await getDynamicSettings({ group: activeDynamicGroup.value })
		dynamicSettings.value = res?.data || res || []
		
		const newForm = {}
		dynamicSettings.value.forEach(item => {
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
		console.error(e)
		toast.error('Failed to load custom dynamic fields')
	}
}

const saveSettings = async () => {
	saving.value = true
	try {
		if (activeTab.value === 'business') {
			const payload = {
				business_name: businessForm.value.business_name.trim(),
				business_type: businessForm.value.business_type,
				email: businessForm.value.email ? businessForm.value.email.trim() : null,
				phone: businessForm.value.phone ? businessForm.value.phone.trim() : null,
				website: businessForm.value.website ? businessForm.value.website.trim() : null,
				registration_number: businessForm.value.registration_number ? businessForm.value.registration_number.trim() : null,
				tax_id: businessForm.value.tax_id ? businessForm.value.tax_id.trim() : null,
				address: {
					address_id: businessForm.value.address.address_id || undefined,
					address_line_1: businessForm.value.address.address_line_1.trim(),
					address_line_2: businessForm.value.address.address_line_2 ? businessForm.value.address.address_line_2.trim() : null,
					landmark: businessForm.value.address.landmark ? businessForm.value.address.landmark.trim() : null,
					city: businessForm.value.address.city.trim(),
					state: businessForm.value.address.state.trim(),
					country: businessForm.value.address.country.trim(),
					zip_code: businessForm.value.address.zip_code.trim(),
					latitude: businessForm.value.address.latitude,
					longitude: businessForm.value.address.longitude,
					is_default: businessForm.value.address.is_default,
					is_billing: businessForm.value.address.is_billing,
				}
			}
			await updateProfile(payload)
			toast.success('Business Profile details saved successfully!')
		} else if (activeTab.value === 'general') {
			await updateBusinessGeneral(generalForm.value)
			toast.success('General settings saved successfully!')
		} else if (activeTab.value === 'tax') {
			await updateBusinessTax(taxForm.value)
			toast.success('Tax settings saved successfully!')
		} else if (activeTab.value === 'inventory') {
			await updateBusinessInventory(inventoryForm.value)
			toast.success('Inventory settings saved successfully!')
		} else if (activeTab.value === 'dynamic') {
			const payload = Object.keys(dynamicForm.value).map(key => ({
				key,
				value: String(dynamicForm.value[key])
			}))
			await updateBusinessDynamicSettings(payload)
			toast.success('Dynamic preferences saved successfully!')
			await fetchDynamicSettings()
		}
	} catch (e) {
		console.error(e)
		toast.error('Failed to save settings configurations')
	} finally {
		saving.value = false
	}
}

onMounted(loadTabData)
</script>
