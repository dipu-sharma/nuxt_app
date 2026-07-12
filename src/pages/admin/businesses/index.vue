<template>
	<div class="p-6"
		style="background-color: rgb(var(--color-background)); color: rgb(var(--color-text)); min-height: 100vh">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h1 class="text-2xl font-bold">Business Management</h1>
				<p class="text-sm opacity-60 mt-1">Approve, suspend and manage businesses</p>
			</div>
			<button @click="showCreateModal = true"
				class="px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2"
				style="background-color: rgb(var(--color-primary))">
				+ Create Business
			</button>
		</div>

		<!-- Businesses Grid -->
		<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="i in 6" :key="i" class="h-40 rounded-xl animate-pulse"
				style="background-color: rgb(var(--color-card))" />
		</div>
		<div v-else-if="businesses.length === 0" class="text-center py-16 opacity-50">
			<div class="text-5xl mb-4">🏢</div>
			<p>No businesses registered yet</p>
		</div>
		<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="biz in businesses" :key="biz.id" class="rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg border flex flex-col justify-between"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				
				<div>
					<!-- Header -->
					<div class="flex items-start justify-between mb-4">
						<div>
							<div class="flex items-center gap-1.5 flex-wrap">
								<h3 class="font-bold text-base text-text leading-tight">{{ biz.business_name || biz.name }}</h3>
								<v-icon v-if="biz.is_verified" color="success" size="16" class="mt-0.5" icon="mdi:checkbox-marked-circle" title="Verified Business" />
							</div>
							<p class="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{{ biz.business_type || '—' }}</p>
						</div>
						<span class="px-2 py-0.5 text-[10px] rounded-full font-bold uppercase tracking-wider"
							:class="bizStatusClass(biz.status || biz.is_active)">
							{{ biz.status || (biz.is_active ? 'Active' : 'Inactive') }}
						</span>
					</div>

					<!-- Grid Details -->
					<div class="space-y-2.5 mb-6 text-xs text-text/80">
						<!-- Contact -->
						<div class="flex items-center gap-2">
							<span class="opacity-60 text-sm">📧</span>
							<a :href="`mailto:${biz.email || biz.business_email}`" class="hover:underline text-primary truncate flex-1">{{ biz.email || biz.business_email || '—' }}</a>
						</div>
						<div class="flex items-center gap-2">
							<span class="opacity-60 text-sm">📞</span>
							<span>{{ biz.phone || biz.business_phone || '—' }}</span>
						</div>
						<div v-if="biz.website" class="flex items-center gap-2">
							<span class="opacity-60 text-sm">🌐</span>
							<a :href="biz.website" target="_blank" class="hover:underline text-primary truncate flex-1">{{ biz.website }}</a>
						</div>

						<hr class="opacity-10" />

						<!-- Subscription & Created At -->
						<div class="grid grid-cols-2 gap-2 bg-secondary/20 p-2.5 rounded-xl border border-border/40">
							<div>
								<p class="text-[9px] uppercase opacity-55 font-bold">Subscription</p>
								<p class="font-semibold text-text text-[11px]">{{ biz.subscription_plan || 'FREE' }} ({{ biz.subscription_status || 'TRIAL' }})</p>
							</div>
							<div>
								<p class="text-[9px] uppercase opacity-55 font-bold">Registered</p>
								<p class="font-semibold text-text text-[11px]">{{ formatDate(biz.created_at) }}</p>
							</div>
						</div>

						<!-- Legal IDs -->
						<div class="grid grid-cols-3 gap-2 text-[10px] opacity-90 pt-1">
							<div>
								<span class="block text-[8px] uppercase opacity-50 font-bold">Reg No</span>
								<span class="font-mono font-medium truncate block" :title="biz.registration_number">{{ biz.registration_number || '—' }}</span>
							</div>
							<div>
								<span class="block text-[8px] uppercase opacity-50 font-bold">Tax ID</span>
								<span class="font-mono font-medium truncate block" :title="biz.tax_id">{{ biz.tax_id || '—' }}</span>
							</div>
							<div>
								<span class="block text-[8px] uppercase opacity-50 font-bold">PAN</span>
								<span class="font-mono font-medium truncate block" :title="biz.pan_number">{{ biz.pan_number || '—' }}</span>
							</div>
						</div>

						<hr class="opacity-10" />

						<!-- Address details -->
						<div class="bg-secondary/10 p-3 rounded-xl border border-border/20">
							<p class="text-[9px] uppercase opacity-55 font-bold mb-1">HQ Address</p>
							<div v-if="biz.address && typeof biz.address === 'object'" class="leading-normal opacity-95 text-[11px]">
								<p class="font-semibold text-text">{{ biz.address.address_line_1 }}<span v-if="biz.address.address_line_2">, {{ biz.address.address_line_2 }}</span></p>
								<p>{{ biz.address.city }}, {{ biz.address.state }} - {{ biz.address.zip_code }}</p>
								<p class="text-[10px] opacity-60 mt-0.5">Landmark: {{ biz.address.landmark || '—' }}</p>
								<p class="text-[10px] opacity-70 font-bold">{{ biz.address.country }}</p>
							</div>
							<div v-else class="opacity-50 italic">No address provided</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-2 pt-3 border-t" style="border-color: rgb(var(--color-border))">
					<div class="flex gap-2">
						<!-- Approve / Approved Button -->
						<button v-if="isApproved(biz)" disabled
							class="flex-1 py-1.5 text-xs rounded-lg font-semibold bg-green-150 text-green-700 cursor-not-allowed border border-green-200/50">
							✓ Approved
						</button>
						<button v-else @click="approveBiz(biz)"
							class="flex-1 py-1.5 text-xs rounded-lg font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
							style="background-color: rgb(var(--color-primary))">
							✓ Approve
						</button>

						<!-- Suspend / Suspended Button -->
						<button v-if="isSuspended(biz)" disabled
							class="flex-1 py-1.5 text-xs rounded-lg font-semibold bg-red-100 text-red-700 cursor-not-allowed">
							⏸ Suspended
						</button>
						<button v-else @click="suspendBiz(biz)"
							class="flex-1 py-1.5 text-xs rounded-lg font-semibold border"
							style="color: rgb(var(--color-text)); border-color: rgb(var(--color-border))">
							⏸ Suspend
						</button>
					</div>
					<button @click="viewProducts(biz)"
						class="w-full py-1.5 text-xs rounded-lg font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
						style="background-color: rgb(var(--color-primary))">
						📦 View Products
					</button>
				</div>
			</div>
		</div>

		<!-- Create Business Modal -->
		<div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
			<div class="rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<h2 class="text-xl font-bold mb-4">Create New Business</h2>
				
				<!-- Tabs Nav -->
				<div class="flex border-b mb-6" style="border-color: rgb(var(--color-border))">
					<button @click="activeTab = 'general'" 
						class="flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-200"
						:style="activeTab === 'general' ? 'border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary))' : 'border-color: transparent; opacity: 0.6'">
						General Info
					</button>
					<button @click="activeTab = 'branding'" 
						class="flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-200"
						:style="activeTab === 'branding' ? 'border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary))' : 'border-color: transparent; opacity: 0.6'">
						Branding & Legal
					</button>
					<button @click="activeTab = 'address'" 
						class="flex-1 pb-3 text-sm font-semibold border-b-2 transition-all duration-200"
						:style="activeTab === 'address' ? 'border-color: rgb(var(--color-primary)); color: rgb(var(--color-primary))' : 'border-color: transparent; opacity: 0.6'">
						Primary Address
					</button>
				</div>

				<!-- Tab Content -->
				<div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
					<!-- General Info Tab -->
					<div v-show="activeTab === 'general'" class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Business Name *</label>
								<input v-model="createForm.business_name" placeholder="e.g. Admin Shop" maxlength="100"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Business Type *</label>
								<select v-model="createForm.business_type"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))">
									<option value="ECOMMERCE">Ecommerce</option>
									<option value="RETAIL">Retail</option>
									<option value="SERVICES">Services</option>
									<option value="OTHER">Other</option>
								</select>
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Email Address *</label>
								<input v-model="createForm.email" placeholder="e.g. admin_shop@yopmail.com" type="email"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Phone Number *</label>
								<input v-model="createForm.phone" placeholder="e.g. 9555282779" maxlength="10"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Website URL</label>
								<input v-model="createForm.website" placeholder="e.g. https://www.adminshop.com"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Slug *</label>
								<input v-model="createForm.slug" placeholder="e.g. admin-shop"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div>
							<label class="block text-xs font-semibold mb-1 opacity-70">Owner Email Address *</label>
							<input v-model="createForm.owner_email" placeholder="e.g. owner@example.com" type="email"
								class="w-full px-4 py-2 rounded-lg text-sm"
								style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
						</div>
					</div>

					<!-- Branding & Legal Tab -->
					<div v-show="activeTab === 'branding'" class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Registration Number</label>
								<input v-model="createForm.registration_number" placeholder="REG12345678"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Tax ID / GSTIN</label>
								<input v-model="createForm.tax_id" placeholder="TAX98765432"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">PAN Number</label>
								<input v-model="createForm.pan_number" placeholder="ABCDE1234F"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Logo Image URL</label>
								<input v-model="createForm.logo_url" placeholder="https://example.com/logo.png"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Banner Image URL</label>
								<input v-model="createForm.banner_url" placeholder="https://example.com/banner.png"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Primary Theme Color</label>
								<div class="flex gap-2">
									<input type="color" v-model="createForm.primary_color" class="w-10 h-9 p-0.5 border rounded cursor-pointer" />
									<input v-model="createForm.primary_color" placeholder="#FF0000"
										class="flex-1 px-4 py-2 rounded-lg text-sm"
										style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
								</div>
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Secondary Theme Color</label>
								<div class="flex gap-2">
									<input type="color" v-model="createForm.secondary_color" class="w-10 h-9 p-0.5 border rounded cursor-pointer" />
									<input v-model="createForm.secondary_color" placeholder="#00FF00"
										class="flex-1 px-4 py-2 rounded-lg text-sm"
										style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
								</div>
							</div>
						</div>
					</div>

					<!-- Address Tab -->
					<div v-show="activeTab === 'address'" class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Address Line 1 *</label>
								<input v-model="createForm.address.address_line_1" placeholder="123 Admin Street"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Address Line 2</label>
								<input v-model="createForm.address.address_line_2" placeholder="Suite 400"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">City *</label>
								<input v-model="createForm.address.city" placeholder="Mumbai"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">State *</label>
								<input v-model="createForm.address.state" placeholder="Maharashtra"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">ZIP Code *</label>
								<input v-model="createForm.address.zip_code" placeholder="400001"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Country *</label>
								<input v-model="createForm.address.country" placeholder="India"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Landmark</label>
								<input v-model="createForm.address.landmark" placeholder="Near Central Park"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
							<div>
								<label class="block text-xs font-semibold mb-1 opacity-70">Address Label</label>
								<input v-model="createForm.address.label" placeholder="Headquarters"
									class="w-full px-4 py-2 rounded-lg text-sm"
									style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))" />
							</div>
						</div>
						
						<!-- Address Type & Config Switches -->
						<div class="bg-opacity-5 rounded-lg p-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs" style="background-color: rgb(var(--color-background))">
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" v-model="createForm.address.is_default" class="rounded text-primary" />
								<span>Is Default</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" v-model="createForm.address.is_billing" class="rounded text-primary" />
								<span>Is Billing</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" v-model="createForm.address.is_home" class="rounded text-primary" />
								<span>Is Home</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" v-model="createForm.address.is_work" class="rounded text-primary" />
								<span>Is Work</span>
							</label>
						</div>
					</div>
				</div>

				<!-- Actions Footer -->
				<div class="flex gap-3 mt-6 pt-4 border-t" style="border-color: rgb(var(--color-border))">
					<button @click="showCreateModal = false" class="flex-1 py-2 rounded-lg text-sm border"
						style="border-color: rgb(var(--color-border))">Cancel</button>
					<button @click="confirmCreate" :disabled="creating"
						class="flex-1 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
						style="background-color: rgb(var(--color-primary))">
						{{ creating ? 'Creating...' : 'Create Business' }}
					</button>
				</div>
			</div>
		</div>

		<!-- View Products Modal -->
		<div v-if="showProductsModal"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
			<div class="rounded-2xl p-6 w-full max-w-4xl shadow-xl flex flex-col justify-between max-h-[85vh] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
				<div class="flex items-center justify-between mb-4 pb-2 border-b border-border">
					<h2 class="text-xl font-bold text-text">Products of {{ selectedBiz?.business_name ||
						selectedBiz?.name }}</h2>
					<button @click="showProductsModal = false"
						class="text-text opacity-70 hover:opacity-100 text-lg">✕</button>
				</div>

				<div class="overflow-y-auto flex-1 mb-4 pr-1">
					<v-progress-circular v-if="loadingBizProducts" indeterminate color="primary"
						class="d-flex mx-auto my-16" />
					<div v-else-if="bizProducts.length === 0" class="text-center py-16 opacity-50 text-text">
						No products found for this business.
					</div>
					<div v-else class="overflow-x-auto rounded-xl border border-border/50">
						<table class="w-full text-sm">
							<thead style="background-color: rgb(var(--color-background))">
								<tr>
									<th class="px-4 py-3 text-left font-semibold opacity-70">ID</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Name</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Price</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Stock</th>
									<th class="px-4 py-3 text-left font-semibold opacity-70">Status</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="prod in bizProducts" :key="prod?.id || prod?.product_id" class="border-t" style="border-color: rgb(var(--color-border))">
									<td class="px-4 py-3 font-mono text-xs opacity-60">{{ prod?.id || prod?.product_id }}</td>
									<td class="px-4 py-3 font-medium">{{ prod?.product_name || prod?.name || '—' }}</td>
									<td class="px-4 py-3 text-indigo-600">₹{{ (prod?.selling_price || prod?.product_mrp ||
										prod?.price)?.toLocaleString('en-IN') || '0.00' }}</td>
									<td class="px-4 py-3">
										<span class="px-2 py-0.5 rounded-full text-xs font-semibold"
											:class="(prod?.low_stock_threshold !== undefined ? prod?.low_stock_threshold : (prod?.stock_quantity ?? 0)) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-750'">
											{{ prod?.low_stock_threshold !== undefined ? prod?.low_stock_threshold :
												(prod?.stock_quantity ?? 0) }} units
										</span>
									</td>
									<td class="px-4 py-3">
										<span class="px-2 py-0.5 rounded-full text-xs font-semibold"
											:class="prod?.is_active ? 'bg-primary/10 text-primary' : 'bg-secondary text-text opacity-50'">
											{{ prod?.is_active ? 'Active' : 'Inactive' }}
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- Pagination Controls -->
				<div v-if="bizProductsMeta.total_pages > 1"
					class="flex justify-between items-center pt-4 border-t border-border">
					<button :disabled="bizProductsPage === 1" @click="changeBizProductsPage(bizProductsPage - 1)"
						class="px-4 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50"
						style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
						Previous
					</button>
					<span class="text-sm text-text opacity-75">Page {{ bizProductsPage }} of {{
						bizProductsMeta.total_pages }}</span>
					<button :disabled="bizProductsPage === bizProductsMeta.total_pages"
						@click="changeBizProductsPage(bizProductsPage + 1)"
						class="px-4 py-1.5 rounded-lg border text-sm font-medium disabled:opacity-50"
						style="border-color: rgb(var(--color-border)); color: rgb(var(--color-text))">
						Next
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toast } from 'vue3-toastify'

definePageMeta({
	title: 'Business Management',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['ADMIN'],
})

const loading = ref(false)
const creating = ref(false)
const businesses = ref([])
const showCreateModal = ref(false)
const activeTab = ref('general')

const getInitialForm = () => ({
  business_name: '',
  business_type: 'ECOMMERCE',
  email: '',
  phone: '',
  website: '',
  slug: '',
  registration_number: '',
  tax_id: '',
  pan_number: '',
  logo_url: '',
  banner_url: '',
  primary_color: '#FF0000',
  secondary_color: '#00FF00',
  owner_email: '',
  description: '',
  address: {
    address_line_1: '',
    address_line_2: '',
    country: 'India',
    state: '',
    city: '',
    zip_code: '',
    landmark: '',
    is_default: true,
    is_billing: true,
    is_home: false,
    is_work: true,
    label: 'Headquarters'
  }
})

const createForm = ref(getInitialForm())

// View products state
const showProductsModal = ref(false)
const selectedBiz = ref(null)
const bizProducts = ref([])
const bizProductsPage = ref(1)
const bizProductsMeta = ref({ total_items: 0, total_pages: 0, current_page: 1, limit: 10 })
const loadingBizProducts = ref(false)

const viewProducts = async (biz) => {
	console.log("Business", biz)
	selectedBiz.value = biz
	bizProductsPage.value = 1
	showProductsModal.value = true
	await loadBizProducts()
}

const loadBizProducts = async () => {
	if (!selectedBiz.value) return
	loadingBizProducts.value = true
	try {
		const { getAdminBusinessProducts } = useBusinessProducts()
		const res = await getAdminBusinessProducts(selectedBiz.value?.business_id || selectedBiz.value?.id, {
			page: bizProductsPage.value,
			limit: 10,
		})

		const rawItems = res?.data?.items || (Array.isArray(res?.data) ? res.data : [])
		bizProducts.value = rawItems.filter(p => p !== null && p !== undefined)
		
		const limit = res?.data?.limit || res?.limit || 10
		const total = res?.data?.total || res?.total || bizProducts.value.length
		const totalPages = res?.data?.total_pages || res?.total_pages || Math.ceil(total / limit)
		
		bizProductsMeta.value = res?.meta || {
			total_items: total,
			total_pages: totalPages || 1,
			current_page: bizProductsPage.value,
			limit: limit,
		}
	} catch {
		bizProducts.value = []
	} finally {
		loadingBizProducts.value = false
	}
}

const changeBizProductsPage = async (newPage) => {
	bizProductsPage.value = newPage
	await loadBizProducts()
}

const isApproved = (biz) => {
	if (!biz) return false
	const status = typeof biz.status === 'string' ? biz.status.toLowerCase() : ''
	return status === 'approved' || status === 'active' || biz.is_active === true
}

const isSuspended = (biz) => {
	if (!biz) return false
	const status = typeof biz.status === 'string' ? biz.status.toLowerCase() : ''
	return status === 'suspended'
}

const bizStatusClass = (status) => {
	if (status === true || status === 'approved' || status === 'active') return 'bg-green-100 text-green-700'
	if (status === 'suspended') return 'bg-red-100 text-red-700'
	return 'bg-yellow-100 text-yellow-700'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'

const loadBusinesses = async () => {
	loading.value = true
	try {
		const { getBusinesses } = useAdminUsers()
		const res = await getBusinesses()
		businesses.value = res?.data?.items || res?.data || res || []
	} catch {
		businesses.value = []
	} finally {
		loading.value = false
	}
}

const approveBiz = async (biz) => {
	try {
		const { approveBusiness } = useAdminUsers()
		await approveBusiness(biz.id)
		loadBusinesses()
	} catch {
		loadBusinesses()
	}
}

const suspendBiz = async (biz) => {
	try {
		const { suspendBusiness } = useAdminUsers()
		await suspendBusiness(biz.id)
		loadBusinesses()
	} catch {
		loadBusinesses()
	}
}

const confirmCreate = async () => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	
	if (!createForm.value.business_name?.trim()) {
		activeTab.value = 'general'
		return toast.error('Business name is required')
	}
	if (!createForm.value.email?.trim() || !emailRegex.test(createForm.value.email)) {
		activeTab.value = 'general'
		return toast.error('Valid email is required')
	}
	if (!createForm.value.phone?.trim()) {
		activeTab.value = 'general'
		return toast.error('Phone number is required')
	}
	if (!createForm.value.slug?.trim()) {
		activeTab.value = 'general'
		return toast.error('Slug is required')
	}
	if (!createForm.value.owner_email?.trim() || !emailRegex.test(createForm.value.owner_email)) {
		activeTab.value = 'general'
		return toast.error('Valid owner email is required')
	}
	
	// Address validation
	if (!createForm.value.address.address_line_1?.trim()) {
		activeTab.value = 'address'
		return toast.error('Address Line 1 is required')
	}
	if (!createForm.value.address.city?.trim()) {
		activeTab.value = 'address'
		return toast.error('City is required')
	}
	if (!createForm.value.address.state?.trim()) {
		activeTab.value = 'address'
		return toast.error('State is required')
	}
	if (!createForm.value.address.zip_code?.trim()) {
		activeTab.value = 'address'
		return toast.error('ZIP code is required')
	}
	if (!createForm.value.address.country?.trim()) {
		activeTab.value = 'address'
		return toast.error('Country is required')
	}

	creating.value = true
	try {
		const { createBusiness } = useAdminUsers()
		
		const payload = {
			business_name: createForm.value.business_name.trim(),
			business_type: createForm.value.business_type,
			email: createForm.value.email.trim(),
			phone: createForm.value.phone.trim(),
			website: createForm.value.website?.trim() || null,
			slug: createForm.value.slug.trim(),
			registration_number: createForm.value.registration_number?.trim() || null,
			tax_id: createForm.value.tax_id?.trim() || null,
			pan_number: createForm.value.pan_number?.trim() || null,
			logo_url: createForm.value.logo_url?.trim() || null,
			banner_url: createForm.value.banner_url?.trim() || null,
			primary_color: createForm.value.primary_color,
			secondary_color: createForm.value.secondary_color,
			owner_email: createForm.value.owner_email.trim(),
			address: {
				address_line_1: createForm.value.address.address_line_1.trim(),
				address_line_2: createForm.value.address.address_line_2?.trim() || null,
				country: createForm.value.address.country.trim(),
				state: createForm.value.address.state.trim(),
				city: createForm.value.address.city.trim(),
				zip_code: createForm.value.address.zip_code.trim(),
				landmark: createForm.value.address.landmark?.trim() || null,
				is_default: !!createForm.value.address.is_default,
				is_billing: !!createForm.value.address.is_billing,
				is_home: !!createForm.value.address.is_home,
				is_work: !!createForm.value.address.is_work,
				label: createForm.value.address.label?.trim() || 'Headquarters'
			}
		}

		await createBusiness(payload)
		toast.success('Business created successfully!')
		showCreateModal.value = false
		createForm.value = getInitialForm()
		activeTab.value = 'general'
		loadBusinesses()
	} catch (err) {
		console.error('Failed to create business:', err)
		toast.error(err?.data?.message || err?.message || 'Failed to create business')
	} finally {
		creating.value = false
	}
}

onMounted(loadBusinesses)
</script>
