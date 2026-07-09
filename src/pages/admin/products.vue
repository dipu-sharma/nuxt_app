<template>
	<div class="p-6 bg-background text-text font-sans">
		
		<!-- Premium Header Section -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6" style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-text mb-2">
					Product Management
				</h1>
				<p class="text-text opacity-70 text-sm font-medium tracking-wide">
					View, manage, and update the global product directory catalog.
				</p>
			</div>
			
			<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="openCreateDialog"
				class="px-8 text-none tracking-widest font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform" elevation="0">
				<template #prepend>
					<Icon name="mdi:plus" class="w-4 h-4 mr-0.5" />
				</template>
				ADD PRODUCT
			</v-btn>
		</div>

		<!-- Search & Action Card -->
		<div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] mb-8 flex gap-4 items-center" style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
			<div class="relative flex-1">
				<Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
				<input v-model="search" @input="debouncedSearch" placeholder="Search catalog by name or brand..."
					class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
			</div>
			
			<v-btn color="primary" rounded="pill" size="large" @click="fetchData"
				class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
				SEARCH
			</v-btn>
		</div>

		<!-- Products Table View -->
		<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden" style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
			
			<div class="overflow-x-auto rounded-[1.5rem] border border-border/50" style="border-color: rgb(var(--color-border))">
				<div v-if="loading" class="p-12 text-center">
					<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
				</div>
				
				<div v-else-if="products.length === 0" class="p-16 text-center">
					<div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center" style="background-color: rgb(var(--color-secondary))">
						<Icon name="mdi:package-variant" class="w-8 h-8 text-text opacity-30" />
					</div>
					<p class="text-text opacity-50 text-sm font-medium mb-6">No products found in the catalog.</p>
					<v-btn color="primary" rounded="pill" size="large" @click="openCreateDialog" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
						Add First Product
					</v-btn>
				</div>

				<v-data-table v-else :headers="headers" :items="products" :loading="loading" items-per-page="-1"
					class="custom-data-table" hover>
					
					<template #item.product="{ item }">
						<div class="flex items-center gap-3 py-2">
							<div class="w-12 h-12 rounded-xl border overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center p-0.5 border-border" style="background-color: rgb(var(--color-secondary)); border-color: rgb(var(--color-border))">
								<img v-if="(item.raw || item).images?.[0]?.url || (item.raw || item).images?.[0]?.image_url" :src="(item.raw || item).images[0].url || (item.raw || item).images[0].image_url"
									class="w-full h-full object-cover rounded-lg mix-blend-multiply dark:mix-blend-normal" />
								<Icon v-else name="mdi:package-variant-closed" class="w-6 h-6 text-text opacity-30" />
							</div>
							<div>
								<p class="font-semibold text-text leading-snug">{{ (item.raw || item).name }}</p>
								<div class="flex items-center gap-2 mt-0.5">
									<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">ID: {{ (item.raw || item).id }}</p>
									<span v-if="(item.raw || item).brand_name" class="text-[10px] bg-secondary text-text opacity-70 px-1.5 py-0.2 rounded font-medium" style="background-color: rgb(var(--color-secondary))">
										{{ (item.raw || item).brand_name }}
									</span>
								</div>
							</div>
						</div>
					</template>

					<template #item.category="{ item }">
						<span class="text-text opacity-70 text-sm font-semibold">
							{{ getCategoryName((item.raw || item).category_id) }}
						</span>
					</template>

					<template #item.product_mrp="{ item }">
						<span class="text-text opacity-75 text-sm font-medium">₹{{ (item.raw || item).product_mrp?.toLocaleString('en-IN') || '—' }}</span>
					</template>

					<template #item.selling_price="{ item }">
						<span class="font-semibold text-sm text-text">₹{{ (item.raw || item).selling_price?.toLocaleString('en-IN') || '—' }}</span>
					</template>

					<template #item.product_cost_price="{ item }">
						<span class="text-text opacity-75 text-sm">₹{{ (item.raw || item).product_cost_price?.toLocaleString('en-IN') || '—' }}</span>
					</template>

					<template #item.total_available_quantity="{ item }">
						<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
							:class="(item.raw || item).total_available_quantity > ((item.raw || item).low_stock_threshold || 10) 
								? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
								: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'">
							{{ (item.raw || item).total_available_quantity || 0 }} units
						</span>
					</template>

					<template #item.low_stock_threshold="{ item }">
						<span class="text-text opacity-75 text-sm">{{ (item.raw || item).low_stock_threshold !== undefined ? (item.raw || item).low_stock_threshold : 10 }} units</span>
					</template>

					<template #item.packing_unit="{ item }">
						<span class="text-text opacity-75 text-sm">
							{{ (item.raw || item).product_packing || '—' }} / {{ (item.raw || item).product_unit || '—' }}
						</span>
					</template>

					<template #item.hsn_batch="{ item }">
						<span class="text-text opacity-75 text-sm">
							{{ (item.raw || item).hsn_no || '—' }} / {{ (item.raw || item).batch_no || '—' }}
						</span>
					</template>

					<template #item.size_color="{ item }">
						<span class="text-text opacity-75 text-sm">
							{{ (item.raw || item).size || '—' }} / {{ (item.raw || item).color || '—' }}
						</span>
					</template>

					<template #item.status="{ item }">
						<div class="flex flex-wrap gap-1">
							<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
								:class="(item.raw || item).is_active 
									? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' 
									: 'bg-secondary text-text opacity-50'"
								:style="!(item.raw || item).is_active ? { backgroundColor: 'rgb(var(--color-secondary))' } : {}">
								{{ (item.raw || item).is_active ? 'Active' : 'Inactive' }}
							</span>
							<span v-if="(item.raw || item).is_featured" class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-105 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
								Featured
							</span>
						</div>
					</template>

					<template #item.actions="{ item }">
						<div class="flex justify-end gap-1">
							<v-btn icon size="small" variant="text" class="hover:text-primary text-text opacity-70" @click="openDetailsDialog(item.raw || item)">
								<Icon name="mdi:eye-outline" class="w-4 h-4" />
							</v-btn>
							<v-btn icon size="small" variant="text" class="hover:text-primary text-text opacity-70" @click="openEditDialog(item.raw || item)">
								<Icon name="mdi:pencil-outline" class="w-4 h-4" />
							</v-btn>
							<v-btn icon size="small" variant="text" color="error" class="hover:text-red-650 text-text opacity-70" @click="confirmDeleteProduct(item.raw || item)">
								<Icon name="mdi:trash-can-outline" class="w-4 h-4" />
							</v-btn>
						</div>
					</template>

					<template #bottom>
						<!-- Hide default navigation -->
					</template>

				</v-data-table>
			</div>

			<!-- Pagination Control -->
			<div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-border" style="border-color: rgb(var(--color-border))">
				<div class="text-xs font-bold uppercase tracking-widest text-text opacity-50">
					Showing {{ (page - 1) * itemsPerPage + 1 }} to {{ Math.min(page * itemsPerPage, totalItems) }} of {{ totalItems }} items
				</div>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<span class="text-xs font-semibold text-text opacity-70">Rows per page:</span>
						<select :value="itemsPerPage" @change="updateItemsPerPage(Number($event.target.value))" 
							class="px-3 py-1 bg-background border border-border rounded-full text-xs font-semibold text-text focus:outline-none focus:border-primary">
							<option :value="5">5</option>
							<option :value="10">10</option>
							<option :value="20">20</option>
							<option :value="50">50</option>
						</select>
					</div>
					<v-pagination v-model="page" :length="totalPages" :total-visible="5" density="compact" active-color="primary" />
				</div>
			</div>
		</div>

		<!-- Create/Edit Product Dialog -->
		<v-dialog v-model="showEditProductDialog" max-width="680" transition="dialog-bottom-transition">
			<v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden" style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
				<div class="px-8 py-8 md:px-10 md:py-10">
					<h2 class="text-3xl font-semibold tracking-tight text-text mb-6 pb-2 border-b border-border" style="border-color: rgb(var(--color-border))">
						{{ editingProduct ? 'Edit Product Details' : 'Add New Product' }}
					</h2>
					
					<form @submit.prevent="saveProduct">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
							
							<!-- Product Name -->
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product Name *</label>
								<input v-model="productData.name" placeholder="Enter Product Name" required 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Description -->
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Description</label>
								<textarea v-model="productData.description" placeholder="Provide details about the product..." rows="3"
									class="w-full px-5 py-3 bg-background border border-border rounded-[1.5rem] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm"></textarea>
							</div>

							<!-- Short Description -->
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Short Description</label>
								<input v-model="productData.short_description" placeholder="Brief subtitle summary" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Brand Name -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Brand Name</label>
								<input v-model="productData.brand_name" placeholder="Brand Name" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Category Select -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Category *</label>
								<div class="relative">
									<select v-model="productData.category_id" required 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="" disabled>Select Category</option>
										<option v-for="cat in categoriesList" :key="cat.id" :value="cat.category_id">
											{{ cat.name }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- MRP Price -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">MRP Price *</label>
								<input v-model.number="productData.price" type="number" step="0.01" placeholder="0.00" required 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Cost Price -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Cost Price</label>
								<input v-model.number="productData.cost_price" type="number" step="0.01" placeholder="0.00" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Discount Percent -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Discount Percent (%)</label>
								<input v-model.number="productData.discount_percent" type="number" step="0.1" placeholder="0" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Stock Quantity / Threshold -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Stock / Threshold *</label>
								<input v-model.number="productData.quantity" type="number" placeholder="Enter stock count" required 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- SKU Code -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">SKU Code</label>
								<input v-model="productData.sku" placeholder="SKU Code" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- HSN No -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">HSN No</label>
								<input v-model="productData.hsn_no" placeholder="HSN No" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Batch No -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Batch No</label>
								<input v-model="productData.batch_no" placeholder="Batch No" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Tax Percent -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Tax Percent (%)</label>
								<input v-model.number="productData.product_tax" type="number" step="0.1" placeholder="0" 
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<!-- Packing details Select -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Packing Details</label>
								<div class="relative">
									<select v-model="productData.product_packing" 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="">Select Packing Details</option>
										<option v-for="opt in packingOptions" :key="opt" :value="opt">
											{{ opt }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- Unit type Select -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Unit Type</label>
								<div class="relative">
									<select v-model="productData.product_unit" 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="">Select Unit Type</option>
										<option v-for="opt in unitOptions" :key="opt" :value="opt">
											{{ opt }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- Size Select -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Size/Dimensions</label>
								<div class="relative">
									<select v-model="productData.size" 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="">Select Size</option>
										<option v-for="opt in sizeOptions" :key="opt" :value="opt">
											{{ opt }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- Color Select -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Color attributes</label>
								<div class="relative">
									<select v-model="productData.color" 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="">Select Color</option>
										<option v-for="opt in colorOptions" :key="opt" :value="opt">
											{{ opt }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- Product Catalog Type Select -->
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product Catalog Type</label>
								<div class="relative">
									<select v-model="productData.product_type" 
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
										<option value="">Select Catalog Type</option>
										<option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
											{{ opt.title }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<!-- Checks -->
							<div class="md:col-span-2 flex flex-wrap items-center gap-6 py-2 border-t border-border mt-2" style="border-color: rgb(var(--color-border))">
								<div class="flex items-center gap-2">
									<input type="checkbox" v-model="productData.is_active" id="is_active" class="w-4 h-4 rounded accent-primary focus:ring-primary" />
									<label for="is_active" class="text-sm font-semibold">Active Status</label>
								</div>
								<div class="flex items-center gap-2">
									<input type="checkbox" v-model="productData.is_featured" id="is_featured" class="w-4 h-4 rounded accent-primary focus:ring-primary" />
									<label for="is_featured" class="text-sm font-semibold">Featured Showcase</label>
								</div>
							</div>
						</div>

						<!-- Form Actions -->
						<div class="flex gap-4 pt-6 border-t border-border" style="border-color: rgb(var(--color-border))">
							<v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="closeModal">
								Cancel
							</v-btn>
							<v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" type="submit">
								{{ editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT' }}
							</v-btn>
						</div>
					</form>
				</div>
			</v-card>
		</v-dialog>

		<!-- Product Details Dialog -->
		<v-dialog v-model="showDetailsDialog" max-width="720" transition="dialog-bottom-transition">
			<v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden" style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
				<div class="px-8 py-8 md:px-10 md:py-10">
					
					<div class="flex justify-between items-start mb-6 pb-2 border-b border-border" style="border-color: rgb(var(--color-border))">
						<div>
							<span class="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
								Product Details
							</span>
							<h2 class="text-3xl font-semibold tracking-tight text-text mt-2">
								{{ selectedProduct?.name || selectedProduct?.product_name }}
							</h2>
						</div>
						<v-btn icon variant="text" class="text-text opacity-70 hover:opacity-100" @click="showDetailsDialog = false">
							<Icon name="mdi:close" class="w-5 h-5" />
						</v-btn>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mb-6 text-sm">
						
						<!-- General Section -->
						<div class="space-y-4 md:col-span-2">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								General Information
							</h3>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Slug</span>
									<span class="font-semibold text-text">{{ selectedProduct?.slug || '—' }}</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Brand Name</span>
									<span class="font-semibold text-text">{{ selectedProduct?.brand_name || '—' }}</span>
								</div>
								<div class="sm:col-span-2">
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Short Description</span>
									<span class="text-text">{{ selectedProduct?.short_description || '—' }}</span>
								</div>
								<div class="sm:col-span-2">
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Description</span>
									<span class="text-text whitespace-pre-line">{{ selectedProduct?.description || '—' }}</span>
								</div>
							</div>
						</div>

						<!-- Pricing Section -->
						<div class="space-y-4">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								Pricing & Taxes
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">MRP Price</span>
									<span class="font-semibold text-text">₹{{ selectedProduct?.product_mrp?.toLocaleString('en-IN') || '0.00' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Cost Price</span>
									<span class="font-semibold text-text">₹{{ selectedProduct?.product_cost_price?.toLocaleString('en-IN') || '—' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Discount Percent</span>
									<span class="font-semibold text-text">{{ selectedProduct?.discount_percent ? `${selectedProduct.discount_percent}%` : '—' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Selling Price</span>
									<span class="font-semibold text-primary">₹{{ selectedProduct?.selling_price?.toLocaleString('en-IN') || '0.00' }}</span>
								</div>
								<div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Product Tax</span>
									<span class="font-semibold text-text">{{ selectedProduct?.product_tax ? `${selectedProduct.product_tax}%` : '0%' }}</span>
								</div>
							</div>
						</div>

						<!-- Inventory & Attributes Section -->
						<div class="space-y-4">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								Inventory & Specifications
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">SKU Code</span>
									<span class="font-semibold text-text">{{ selectedProduct?.product_sku || '—' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">HSN Code</span>
									<span class="font-semibold text-text">{{ selectedProduct?.hsn_no || '—' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Batch Number</span>
									<span class="font-semibold text-text">{{ selectedProduct?.batch_no || '—' }}</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Size / Color</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.size || '—' }} / {{ selectedProduct?.color || '—' }}
									</span>
								</div>
								<div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Packing / Unit</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.product_packing || '—' }} / {{ selectedProduct?.product_unit || '—' }}
									</span>
								</div>
							</div>
						</div>

						<!-- Lifecyle & Dates Section -->
						<div class="space-y-4">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								Lifecycle & Dates
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Manufacturing Date</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.mfg_date ? new Date(selectedProduct.mfg_date).toLocaleDateString() : '—' }}
									</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Expiry Date</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.exp_date ? new Date(selectedProduct.exp_date).toLocaleDateString() : '—' }}
									</span>
								</div>
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Low Stock Limit</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.low_stock_threshold !== undefined ? selectedProduct.low_stock_threshold : '10' }} units
									</span>
								</div>
								<div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Catalog Type</span>
									<span class="font-semibold text-text">{{ selectedProduct?.product_type || '—' }}</span>
								</div>
							</div>
						</div>

						<!-- Ratings & Reviews Section -->
						<div class="space-y-4">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								Ratings & Reviews
							</h3>
							<div class="space-y-3">
								<div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Average Rating</span>
									<span class="font-semibold text-text flex items-center gap-1">
										<Icon name="mdi:star" class="w-4 h-4 text-amber-500" />
										{{ selectedProduct?.average_rating !== undefined && selectedProduct?.average_rating !== null ? Number(selectedProduct.average_rating).toFixed(1) : '0.0' }} / 5.0
									</span>
								</div>
								<div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
									<span class="text-text opacity-60">Total Reviews</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.reviews_count !== undefined && selectedProduct?.reviews_count !== null ? selectedProduct.reviews_count : '0' }} reviews
									</span>
								</div>
							</div>
						</div>

						<!-- Extra attributes and dates -->
						<div class="space-y-4 md:col-span-2">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								System Details
							</h3>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Product ID</span>
									<span class="font-semibold text-text">{{ selectedProduct?.product_id || '—' }}</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Business ID</span>
									<span class="font-semibold text-text">{{ selectedProduct?.business_id || '—' }}</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Active Status</span>
									<span class="font-semibold text-text" :class="selectedProduct?.is_active ? 'text-green-600 dark:text-green-400' : 'text-text opacity-60'">
										{{ selectedProduct?.is_active ? 'Active (Visible in Catalog)' : 'Inactive (Hidden)' }}
									</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Featured Showcase</span>
									<span class="font-semibold text-text" :class="selectedProduct?.is_featured ? 'text-primary' : 'text-text opacity-60'">
										{{ selectedProduct?.is_featured ? 'Featured on Showcase' : 'Standard catalog item' }}
									</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Created At</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.created_at ? new Date(selectedProduct.created_at).toLocaleString() : '—' }}
									</span>
								</div>
								<div>
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Last Updated At</span>
									<span class="font-semibold text-text">
										{{ selectedProduct?.updated_at ? new Date(selectedProduct.updated_at).toLocaleString() : '—' }}
									</span>
								</div>
								<div v-if="selectedProduct?.deleted_at">
									<span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Deleted At</span>
									<span class="font-semibold text-red-500">
										{{ new Date(selectedProduct.deleted_at).toLocaleString() }}
									</span>
								</div>
							</div>
						</div>

						<!-- Image Gallery Section -->
						<div v-if="selectedProduct?.images && selectedProduct.images.length > 0" class="space-y-4 md:col-span-2">
							<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
								Product Images Gallery
							</h3>
							<div class="flex flex-wrap gap-3">
								<div v-for="(img, idx) in selectedProduct.images" :key="idx" 
									class="w-24 h-24 rounded-xl border border-border bg-secondary flex items-center justify-center p-1 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
									<img :src="img.image_url || img.url || img.file_url" class="w-full h-full object-cover rounded-lg" />
								</div>
							</div>
						</div>

					</div>

					<div class="flex justify-end pt-4 border-t border-border" style="border-color: rgb(var(--color-border))">
						<v-btn color="primary" rounded="pill" size="large" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" @click="showDetailsDialog = false">
							Close
						</v-btn>
					</div>

				</div>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProducts } from '~/composables/useProducts'
import { toast } from 'vue3-toastify'
import { useFilterStore } from '~/stores/filterStore'
import { useDebounceFn } from '@vueuse/core'

const filterStore = useFilterStore();

definePageMeta({
	title: 'Products',
	layout: 'admin',
	middleware: ['auth-role'],
})

const { fetchBusinessProducts, createProduct, updateProduct, deleteProduct } = useProducts()

const products = ref([])
const loading = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const search = ref('')

const showEditProductDialog = ref(false)
const editingProduct = ref(null)

const showDetailsDialog = ref(false)
const selectedProduct = ref(null)

const productData = ref({
	name: '',
	description: '',
	short_description: '',
	brand_name: '',
	price: '',
	cost_price: '',
	discount_percent: '',
	quantity: '',
	category_id: '',
	sku: '',
	hsn_no: '',
	size: '',
	color: '',
	batch_no: '',
	product_tax: '',
	product_packing: '',
	product_type: '',
	product_unit: '',
	is_active: true,
	is_featured: false,
})

const packingOptions = ref([
	'Box',
	'Packet',
	'Bottle',
	'Can',
	'Carton',
	'Strip',
	'Tube',
	'Pcs',
	'Jar',
	'Bag',
	'Roll',
	'Drum'
])

const unitOptions = ref([
	'PCS',
	'KG',
	'GM',
	'LTR',
	'ML',
	'BOX',
	'PACKET',
	'DOZEN',
	'MTR',
	'FT'
])

const sizeOptions = ref([
	'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size',
	'4', '5', '6', '7', '8', '9', '10', '11', '12'
])

const colorOptions = ref([
	'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 
	'Gray', 'Orange', 'Purple', 'Pink', 'Brown', 'Navy', 
	'Beige', 'Multicolor'
])

const typeOptions = ref([
	{ title: 'Fashion', value: 'FASHION' },
	{ title: 'Electronics', value: 'ELECTRONICS' },
	{ title: 'Grocery', value: 'GROCERY' },
	{ title: 'Home', value: 'HOME' },
	{ title: 'Beauty', value: 'BEAUTY' },
	{ title: 'Other', value: 'OTHER' }
])

const categoriesList = ref([])
const loadCategories = async () => {
	try {
		const { getCategories } = useCategories()
		const res = await getCategories({ limit: 100 })
		categoriesList.value = res?.data?.items || res?.data || []
	} catch (error) {
		console.error('Failed to load categories:', error)
	}
}

const getCategoryName = (categoryId) => {
	const category = categoriesList.value.find(c => c.category_id === categoryId)
	return category ? category.name : '—'
}

const headers = [
	{ title: 'Product Catalog Item', key: 'product', sortable: true },
	{ title: 'Category', key: 'category', sortable: true },
	{ title: 'MRP', key: 'product_mrp', sortable: true },
	{ title: 'Selling Price', key: 'selling_price', sortable: true },
	{ title: 'Cost Price', key: 'product_cost_price', sortable: true },
	{ title: 'Available Stock', key: 'total_available_quantity', sortable: true },
	{ title: 'Low Stock Limit', key: 'low_stock_threshold', sortable: true },
	{ title: 'Packing / Unit', key: 'packing_unit', sortable: false },
	{ title: 'HSN / Batch', key: 'hsn_batch', sortable: false },
	{ title: 'Size / Color', key: 'size_color', sortable: false },
	{ title: 'Status', key: 'status', sortable: true },
	{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const totalPages = computed(() => {
	const total = totalItems.value || 0
	const perPage = itemsPerPage.value || 10
	return Math.ceil(total / perPage)
})

const debouncedSearch = useDebounceFn(() => {
	page.value = 1
	fetchData()
}, 450)

const fetchData = async () => {
	loading.value = true
	try {
		const params = {
			page: page.value,
			per_page: itemsPerPage.value,
			is_paginate: true,
		}
		if (search.value) {
			params.search = search.value
		}
		const response = await fetchBusinessProducts(params)
		const list = response?.data?.items || response?.data || []
		products.value = list.map(p => ({
			...p,
			name: p.product_name || p.name || '',
			price: p.selling_price || p.product_mrp || p.price || 0,
			quantity: p.low_stock_threshold !== undefined ? p.low_stock_threshold : (p.stock_quantity ?? p.stock ?? p.quantity ?? 0)
		}))
		totalItems.value = response?.data?.total || list.length
		page.value = response?.data?.page || 1
		itemsPerPage.value = response?.data?.per_page || 10
	} catch (error) {
		console.error(error)
		toast.error('Failed to fetch products')
		products.value = []
		totalItems.value = 0
	} finally {
		loading.value = false
	}
}

watch(() => [filterStore.startDate, filterStore.endDate], () => {
	fetchData();
});

const openCreateDialog = () => {
	editingProduct.value = null
	productData.value = {
		name: '',
		description: '',
		short_description: '',
		brand_name: '',
		price: '',
		cost_price: '',
		discount_percent: '',
		quantity: '',
		category_id: '',
		sku: '',
		hsn_no: '',
		size: '',
		color: '',
		batch_no: '',
		product_tax: '',
		product_packing: '',
		product_type: '',
		product_unit: '',
		is_active: true,
		is_featured: false,
	}
	showEditProductDialog.value = true
}

const openDetailsDialog = (product) => {
	selectedProduct.value = { ...product }
	showDetailsDialog.value = true
}

const openEditDialog = (product) => {
	editingProduct.value = { ...product }
	productData.value = { 
		name: product.product_name || product.name || '',
		description: product.description || '',
		short_description: product.short_description || '',
		brand_name: product.brand_name || '',
		price: product.product_mrp || product.price || product.selling_price || '',
		cost_price: product.product_cost_price || '',
		discount_percent: product.discount_percent || '',
		quantity: product.low_stock_threshold !== undefined ? product.low_stock_threshold : (product.stock_quantity ?? product.stock ?? 0),
		category_id: product.category?.category_id || product.category_id || '',
		sku: product.product_sku || product.sku || '',
		hsn_no: product.hsn_no || '',
		size: product.size || '',
		color: product.color || '',
		batch_no: product.batch_no || '',
		product_tax: product.product_tax || '',
		product_packing: product.product_packing || '',
		product_type: product.product_type || '',
		product_unit: product.product_unit || '',
		is_active: product.is_active !== undefined ? product.is_active : true,
		is_featured: product.is_featured || false,
	}
	showEditProductDialog.value = true
}

const closeModal = () => {
	showEditProductDialog.value = false
}

const saveProduct = async () => {
	if (!productData.value.name || !productData.value.price || productData.value.quantity === undefined || !productData.value.category_id) {
		toast.error("Please fill all required fields")
		return
	}

	try {
		const slug = productData.value.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '')

		const payload = {
			product_name: productData.value.name,
			slug: slug,
			brand_name: productData.value.brand_name || null,
			description: productData.value.description || null,
			short_description: productData.value.short_description || null,
			product_cost_price: productData.value.cost_price ? Number(productData.value.cost_price) : null,
			product_mrp: Number(productData.value.price),
			discount_percent: productData.value.discount_percent ? Number(productData.value.discount_percent) : null,
			product_sku: productData.value.sku || null,
			hsn_no: productData.value.hsn_no || null,
			size: productData.value.size || null,
			color: productData.value.color || null,
			batch_no: productData.value.batch_no || null,
			product_tax: productData.value.product_tax ? Number(productData.value.product_tax) : 0,
			product_packing: productData.value.product_packing || null,
			product_type: productData.value.product_type || null,
			product_unit: productData.value.product_unit || null,
			category_id: productData.value.category_id,
			is_active: productData.value.is_active,
			is_featured: productData.value.is_featured,
			low_stock_threshold: Number(productData.value.quantity)
		}

		const parsed = ProductPayloadSchema.safeParse(payload)
		if (!parsed.success) {
			toast.error(parsed.error.errors[0].message)
			return
		}

		if (editingProduct.value) {
			await updateProduct(editingProduct.value.product_id || editingProduct.value.id, parsed.data)
			toast.success('Product updated successfully')
		} else {
			await createProduct(parsed.data)
			toast.success('Product created successfully')
		}
		closeModal()
		fetchData()
	} catch (error) {
		toast.error(error.response?.data?.message)
	}
}

const confirmDeleteProduct = async (item) => {
	if (!confirm(`Are you sure you want to delete ${item.name}?`)) return
	try {
		await deleteProduct(item.product_id || item.id)
		toast.success('Product deleted successfully')
		fetchData()
	} catch (error) {
		console.error(error)
		toast.error('Failed to delete product')
	}
}

const updatePage = (newPage) => {
	page.value = newPage
	fetchData()
}

const updateItemsPerPage = (newItemsPerPage) => {
	itemsPerPage.value = newItemsPerPage
	page.value = 1;
	fetchData()
}

onMounted(() => {
	fetchData()
	loadCategories()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background: #e7e5e4;
	border-radius: 9999px;
}
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