<template>
	<div class="p-6 bg-background text-text font-sans min-height: 100vh">

		<!-- Premium Header Section -->
		<div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6"
			style="border-color: rgb(var(--color-border))">
			<div>
				<h1 class="text-3xl font-light tracking-tight text-text mb-2">
					Inventory Management
				</h1>
				<p class="text-text opacity-70 text-sm font-medium tracking-wide">
					Manage suppliers, track purchase orders, and perform manual stock adjustments.
				</p>
			</div>
		</div>

		<!-- Elegant Tabs Section -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div class="flex gap-1 p-1.5 rounded-[1.5rem] bg-card border border-border w-fit shadow-sm flex-wrap"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
					class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:opacity-100"
					:class="activeTab === tab.key ? 'shadow-md hover:scale-102' : 'opacity-60'"
					:style="activeTab === tab.key
						? 'background-color: rgb(var(--color-primary)); color: white'
						: 'color: rgb(var(--color-text))'">
					{{ tab.label }}
				</button>
			</div>

			<div v-if="['orders','transfers','levels','audit'].includes(activeTab)" class="flex items-center gap-3">
				<span class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">Filter by Branch</span>
				<div class="relative">
					<select v-model="selectedBranchFilterId" @change="onBranchFilterChange"
						class="appearance-none pl-4 pr-10 py-2.5 bg-card border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text shadow-sm cursor-pointer min-w-[200px]"
						style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
						<option value="">All Branches</option>
						<option v-for="b in branchesList" :key="b.id" :value="b.branch_id || b.id">
							{{ b.name || b.branch_name || `Branch #${b.id}` }}
						</option>
					</select>
					<Icon name="mdi:chevron-down"
						class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
				</div>
			</div>
		</div>

		<!-- ─── SUPPLIERS TAB ───────────────────────────────────────────────── -->
		<div v-if="activeTab === 'suppliers'" class="space-y-6">
			<div class="flex justify-between items-center mb-2">
				<h2 class="text-xl font-light tracking-tight">Registered Suppliers</h2>
				<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="openSupplierModal"
					class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
					<template #prepend>
						<Icon name="mdi:plus" class="w-4 h-4 mr-0.5" />
					</template>
					ADD SUPPLIER
				</v-btn>
			</div>

			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div v-if="loadingSuppliers" class="p-12 text-center">
					<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
				</div>
				<div v-else-if="suppliers.length === 0" class="p-16 text-center">
					<div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
						style="background-color: rgb(var(--color-secondary))">
						<Icon name="mdi:account-badge-outline" class="w-8 h-8 text-text opacity-30" />
					</div>
					<p class="text-text opacity-50 text-sm font-medium mb-6">No suppliers registered in the database.</p>
					<v-btn color="primary" rounded="pill" size="large" @click="openSupplierModal"
						class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
						Add First Supplier
					</v-btn>
				</div>
				<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50"
					style="border-color: rgb(var(--color-border))">
					<table class="w-full text-sm">
						<thead style="background-color: rgb(var(--color-background))">
							<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60 font-sans">
								<th class="px-6 py-4 text-left">Supplier Name</th>
								<th class="px-6 py-4 text-left">Contact Person</th>
								<th class="px-6 py-4 text-left">Email Address</th>
								<th class="px-6 py-4 text-left">Phone</th>
								<th class="px-6 py-4 text-left">Address</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="s in suppliers" :key="s.id"
								class="border-t hover:bg-secondary/20 transition-colors"
								style="border-color: rgb(var(--color-border))">
								<td class="px-6 py-4 font-semibold text-text">{{ s.name }}</td>
								<td class="px-6 py-4 text-text opacity-85 font-medium">{{ s.contact_person || '—' }}</td>
								<td class="px-6 py-4 text-text opacity-70">{{ s.email || '—' }}</td>
								<td class="px-6 py-4 text-text opacity-70 font-mono">{{ s.phone || '—' }}</td>
								<td class="px-6 py-4 text-text opacity-70 truncate max-w-xs">{{ s.address || '—' }}</td>
								<td class="px-6 py-4 text-right">
									<v-btn size="small" variant="text" color="primary" @click="openEditSupplierModal(s)" class="mr-1">Edit</v-btn>
									<v-btn size="small" variant="text" color="error" @click="deleteSupplierAction(s)">Delete</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- ─── PURCHASE ORDERS TAB ─────────────────────────────────────────── -->
		<div v-if="activeTab === 'orders'" class="space-y-6">
			<div class="flex justify-between items-center mb-2">
				<h2 class="text-xl font-light tracking-tight">Purchase Orders</h2>
				<v-btn color="primary" variant="flat" rounded="pill" size="large" @click="openPOModal"
					class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
					<template #prepend>
						<Icon name="mdi:plus" class="w-4 h-4 mr-0.5" />
					</template>
					CREATE NEW PO
				</v-btn>
			</div>

			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div v-if="loadingPO" class="p-12 text-center">
					<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
				</div>
				<div v-else-if="purchaseOrders.length === 0" class="p-16 text-center">
					<div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
						style="background-color: rgb(var(--color-secondary))">
						<Icon name="mdi:file-document-outline" class="w-8 h-8 text-text opacity-30" />
					</div>
					<p class="text-text opacity-50 text-sm font-medium mb-6">No purchase orders registered.</p>
					<v-btn color="primary" rounded="pill" size="large" @click="openPOModal"
						class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
						Create First PO
					</v-btn>
				</div>
				<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50"
					style="border-color: rgb(var(--color-border))">
					<table class="w-full text-sm">
						<thead style="background-color: rgb(var(--color-background))">
							<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
								<th class="px-6 py-4 text-left">PO Code</th>
								<th class="px-6 py-4 text-left">Supplier</th>
								<th class="px-6 py-4 text-left">Branch</th>
								<th class="px-6 py-4 text-left">Total Value</th>
								<th class="px-6 py-4 text-left">Status</th>
								<th class="px-6 py-4 text-left">Order Date</th>
								<th class="px-6 py-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="po in purchaseOrders" :key="po.id"
								class="border-t hover:bg-secondary/20 transition-colors"
								style="border-color: rgb(var(--color-border))">
								<td class="px-6 py-4 font-mono font-bold text-xs opacity-75">{{ po.po_id || po.id }}</td>
								<td class="px-6 py-4 text-text opacity-85 font-medium">{{ po.supplier?.name || `Supplier #${po.supplier_id}` }}</td>
								<td class="px-6 py-4 text-text opacity-75 font-semibold">Branch #{{ po.branch_id || '—' }}</td>
								<td class="px-6 py-4 font-semibold text-primary">₹{{ po.total_amount?.toLocaleString('en-IN') || '—' }}</td>
								<td class="px-6 py-4">
									<span :class="poStatusClass(po.status)"
										class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
										{{ po.status || 'pending' }}
									</span>
								</td>
								<td class="px-6 py-4 text-text opacity-70 font-mono text-xs">{{ formatDate(po.created_at || po.order_date) }}</td>
								<td class="px-6 py-4 text-right">
									<v-btn size="small" variant="text" color="primary" @click="viewPO(po)" class="mr-1">View</v-btn>
									<v-btn size="small" variant="text" color="secondary" @click="editPO(po)" class="mr-1">Edit</v-btn>
									<v-btn size="small" variant="text" color="error" @click="deletePO(po)">Delete</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- ─── STOCK ADJUSTMENT TAB ────────────────────────────────────────── -->
		<div v-if="activeTab === 'stock'" class="space-y-6">
			<h2 class="text-xl font-light tracking-tight">Manual Stock Adjustment</h2>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Product Selector Panel -->
				<div class="lg:col-span-2 bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-4">
						1. Select Product Catalog Item
					</h3>

					<div class="relative mb-6">
						<Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
						<input v-model="productSearch" @input="debouncedProductSearch"
							placeholder="Type name or brand to search products..."
							class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
					</div>

					<div v-if="searchingProducts" class="p-8 text-center">
						<v-progress-circular indeterminate color="primary" :size="28" :width="2" class="opacity-50" />
					</div>

					<div v-else-if="foundProducts.length === 0" class="p-8 text-center text-text opacity-50 text-sm">
						{{ productSearch ? 'No matching products found.' : 'Search for a product above to view details and adjust inventory.' }}
					</div>

					<div v-else class="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
						<div v-for="prod in foundProducts" :key="prod.id" @click="selectProduct(prod)"
							class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all duration-300"
							:class="selectedProd?.id === prod.id ? 'border-primary bg-primary/5' : 'border-border bg-background'">
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 rounded-lg border bg-secondary flex items-center justify-center p-0.5 border-border">
									<img v-if="prod.images?.[0]?.url || prod.images?.[0]?.image_url"
										:src="prod.images[0].url || prod.images[0].image_url"
										class="w-full h-full object-cover rounded" />
									<Icon v-else name="mdi:package-variant-closed" class="w-5 h-5 text-text opacity-30" />
								</div>
								<div>
									<h4 class="font-semibold text-sm">{{ prod.product_name || prod.name }}</h4>
									<div class="flex items-center gap-2 mt-0.5 text-[10px]">
										<span class="text-text opacity-50 font-bold">UUID: {{ prod.product_id }}</span>
										<span class="text-text opacity-40">|</span>
										<span class="text-text opacity-50 font-bold uppercase tracking-wider">SKU: {{ prod.product_sku || '—' }}</span>
									</div>
								</div>
							</div>
							<div class="text-right">
								<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
									:class="(prod.stock_quantity ?? prod.low_stock_threshold ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-755'">
									{{ prod.stock_quantity ?? prod.low_stock_threshold ?? 0 }} units
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Adjustment Values Form Panel -->
				<div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<div>
						<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-4">
							2. Apply Stock Values
						</h3>

						<div class="space-y-5 text-sm">
							<div v-if="selectedProd" class="p-4 bg-secondary/30 rounded-2xl border border-border/50 mb-2">
								<span class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest">Selected Item</span>
								<h4 class="font-semibold text-text mt-1 truncate">{{ selectedProd.product_name || selectedProd.name }}</h4>
								<div class="flex justify-between items-center mt-3 text-xs">
									<span class="text-text opacity-70">Current Stock:</span>
									<span class="font-bold text-text">{{ selectedProd.stock_quantity ?? selectedProd.low_stock_threshold ?? 0 }} units</span>
								</div>
							</div>

							<!-- Branch Selection -->
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Branch *</label>
								<div class="relative">
									<select v-model="stockForm.branch_id" required
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
										<option value="">Smart Deduction (auto)</option>
										<option v-for="branch in branchesList" :key="branch.id" :value="branch.branch_id || branch.id">
											{{ branch.name || branch.branch_name || `Branch #${branch.id}` }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Adjustment Mode *</label>
								<div class="relative">
									<select v-model="stockForm.adjustment_type"
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
										<option value="add">Add Stock quantity</option>
										<option value="remove">Remove Stock quantity</option>
										<option value="set">Set Exact Stock value</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>

							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Quantity *</label>
								<input v-model.number="stockForm.quantity" type="number" placeholder="Enter stock amount" required min="1" max="1000000"
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>

							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Reason for Adjustment</label>
								<input v-model="stockForm.reason" placeholder="e.g. Found during warehouse audit" maxlength="255" pattern="[^\s].*" title="Cannot start with a space"
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>
						</div>
					</div>

					<div class="pt-6">
						<v-btn color="primary" variant="flat" rounded="pill" block size="large" :loading="adjusting" @click="submitStockAdjust"
							class="text-none tracking-widest font-semibold text-white shadow-sm" elevation="0">
							APPLY ADJUSTMENT
						</v-btn>
					</div>
				</div>
			</div>
		</div>

		<!-- ─── STOCK TRANSFERS TAB ─────────────────────────────────────────── -->
		<div v-if="activeTab === 'transfers'" class="space-y-6">
			<h2 class="text-xl font-light tracking-tight">Stock Transfers</h2>

			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<!-- Transfer Form -->
				<div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-5">New Transfer</h3>
					<div class="space-y-4 text-sm">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product ID *</label>
							<input v-model="transferForm.product_id" placeholder="e.g. prod_Abc123"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">From Branch *</label>
							<div class="relative">
								<select v-model="transferForm.from_branch_id"
									class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
									<option value="" disabled>Select Source Branch</option>
									<option v-for="b in branchesList" :key="b.id" :value="b.branch_id || b.id">
										{{ b.name || b.branch_name || `Branch #${b.id}` }}
									</option>
								</select>
								<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
									<Icon name="mdi:chevron-down" class="w-5 h-5" />
								</div>
							</div>
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">To Branch *</label>
							<div class="relative">
								<select v-model="transferForm.to_branch_id"
									class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
									<option value="" disabled>Select Destination Branch</option>
									<option v-for="b in branchesList" :key="b.id" :value="b.branch_id || b.id">
										{{ b.name || b.branch_name || `Branch #${b.id}` }}
									</option>
								</select>
								<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
									<Icon name="mdi:chevron-down" class="w-5 h-5" />
								</div>
							</div>
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Quantity *</label>
							<input v-model.number="transferForm.quantity" type="number" placeholder="e.g. 30" min="1"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Notes</label>
							<input v-model="transferForm.notes" placeholder="e.g. Restocking Delhi branch" maxlength="255"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<v-btn color="primary" variant="flat" rounded="pill" block size="large"
							:loading="submittingTransfer" @click="submitTransfer"
							class="text-none tracking-widest font-semibold text-white shadow-sm mt-2" elevation="0">
							<template #prepend>
								<Icon name="mdi:swap-horizontal" class="w-4 h-4" />
							</template>
							TRANSFER STOCK
						</v-btn>
					</div>
				</div>

				<!-- Transfer History -->
				<div class="lg:col-span-2 bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<div class="flex justify-between items-center border-b border-border/50 pb-2 mb-4">
						<h3 class="font-bold text-xs uppercase tracking-widest text-primary">Transfer History</h3>
						<v-btn size="small" variant="text" color="primary" @click="loadTransfers">
							<Icon name="mdi:refresh" class="w-4 h-4" />
						</v-btn>
					</div>
					<div v-if="loadingTransfers" class="p-12 text-center">
						<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
					</div>
					<div v-else-if="transfers.length === 0" class="p-10 text-center text-text opacity-50 text-sm">
						No stock transfers recorded yet.
					</div>
					<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50" style="border-color: rgb(var(--color-border))">
						<table class="w-full text-sm">
							<thead style="background-color: rgb(var(--color-background))">
								<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
									<th class="px-4 py-3 text-left">Transfer ID</th>
									<th class="px-4 py-3 text-left">Product</th>
									<th class="px-4 py-3 text-left">From → To</th>
									<th class="px-4 py-3 text-left">Qty</th>
									<th class="px-4 py-3 text-left">Status</th>
									<th class="px-4 py-3 text-left">Date</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="t in transfers" :key="t.id" class="border-t hover:bg-secondary/20 transition-colors"
									style="border-color: rgb(var(--color-border))">
									<td class="px-4 py-3 font-mono text-xs opacity-75">{{ t.transfer_id || t.id }}</td>
									<td class="px-4 py-3 font-medium">Product #{{ t.product_id }}</td>
									<td class="px-4 py-3 text-text opacity-70 text-xs">
										<span class="font-semibold">Branch #{{ t.from_branch_id }}</span>
										<Icon name="mdi:arrow-right" class="inline w-3 h-3 mx-1 opacity-50" />
										<span class="font-semibold">Branch #{{ t.to_branch_id }}</span>
									</td>
									<td class="px-4 py-3 font-bold text-primary">{{ t.quantity }}</td>
									<td class="px-4 py-3">
										<span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">
											{{ t.status }}
										</span>
									</td>
									<td class="px-4 py-3 text-xs opacity-70 font-mono">{{ formatDate(t.created_at) }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- ─── STOCK LEVELS TAB ────────────────────────────────────────────── -->
		<div v-if="activeTab === 'levels'" class="space-y-6">
			<div class="flex justify-between items-center mb-2">
				<h2 class="text-xl font-light tracking-tight">Stock Levels</h2>
				<div class="flex gap-3">
					<v-btn size="small" variant="outlined" color="warning" rounded="pill" @click="loadLowStock"
						:loading="loadingLowStock" class="text-none font-semibold">
						<template #prepend><Icon name="mdi:alert-outline" class="w-4 h-4" /></template>
						Low Stock Only
					</v-btn>
					<v-btn size="small" variant="outlined" color="primary" rounded="pill" @click="loadStockLevels"
						:loading="loadingLevels" class="text-none font-semibold">
						<template #prepend><Icon name="mdi:refresh" class="w-4 h-4" /></template>
						All Stock
					</v-btn>
				</div>
			</div>

			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div v-if="loadingLevels || loadingLowStock" class="p-12 text-center">
					<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
				</div>
				<div v-else-if="stockLevels.length === 0" class="p-16 text-center">
					<div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
						style="background-color: rgb(var(--color-secondary))">
						<Icon name="mdi:warehouse" class="w-8 h-8 text-text opacity-30" />
					</div>
					<p class="text-text opacity-50 text-sm font-medium">No stock data available. Click "All Stock" to load.</p>
				</div>
				<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50" style="border-color: rgb(var(--color-border))">
					<table class="w-full text-sm">
						<thead style="background-color: rgb(var(--color-background))">
							<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
								<th class="px-6 py-4 text-left">Product</th>
								<th class="px-6 py-4 text-left">Branch</th>
								<th class="px-6 py-4 text-right">Total Qty</th>
								<th class="px-6 py-4 text-right">Reserved</th>
								<th class="px-6 py-4 text-right">Available</th>
								<th class="px-6 py-4 text-right">Threshold</th>
								<th class="px-6 py-4 text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, idx) in stockLevels" :key="idx"
								class="border-t hover:bg-secondary/20 transition-colors"
								style="border-color: rgb(var(--color-border))">
								<td class="px-6 py-4">
									<div class="font-semibold text-text">{{ item.product_name }}</div>
									<div class="text-[10px] font-mono opacity-50 mt-0.5">{{ item.product_public_id }}</div>
								</td>
								<td class="px-6 py-4 text-text opacity-75 font-medium">{{ item.branch_name || `Branch #${item.branch_id}` }}</td>
								<td class="px-6 py-4 text-right font-bold text-text">{{ item.quantity }}</td>
								<td class="px-6 py-4 text-right text-text opacity-60">{{ item.reserved_quantity }}</td>
								<td class="px-6 py-4 text-right font-bold" :class="item.is_low_stock ? 'text-red-500' : 'text-green-600'">
									{{ item.available_quantity }}
								</td>
								<td class="px-6 py-4 text-right text-text opacity-50">{{ item.low_stock_threshold }}</td>
								<td class="px-6 py-4 text-center">
									<span v-if="item.is_low_stock"
										class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest">
										⚠ Low Stock
									</span>
									<span v-else
										class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-widest">
										✓ OK
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- ─── VALUATION TAB ───────────────────────────────────────────────── -->
		<div v-if="activeTab === 'valuation'" class="space-y-6">
			<div class="flex justify-between items-center mb-2">
				<h2 class="text-xl font-light tracking-tight">Inventory Valuation</h2>
				<v-btn size="small" variant="outlined" color="primary" rounded="pill" @click="loadValuation"
					:loading="loadingValuation" class="text-none font-semibold">
					<template #prepend><Icon name="mdi:refresh" class="w-4 h-4" /></template>
					Refresh
				</v-btn>
			</div>

			<div v-if="loadingValuation" class="p-12 text-center">
				<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
			</div>
			<div v-else-if="valuation">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
					<div class="bg-card rounded-[2rem] p-6 border border-border shadow-sm"
						style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
						<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-2">Total Stock Value (Cost)</p>
						<p class="text-3xl font-black text-primary">₹{{ valuation.total_stock_value_at_cost?.toLocaleString('en-IN') }}</p>
					</div>
					<div class="bg-card rounded-[2rem] p-6 border border-border shadow-sm"
						style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
						<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-2">Total Stock Value (Selling)</p>
						<p class="text-3xl font-black text-text">₹{{ valuation.total_stock_value_at_selling?.toLocaleString('en-IN') }}</p>
					</div>
					<div class="bg-card rounded-[2rem] p-6 border border-border shadow-sm"
						style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
						<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-2">Potential Profit</p>
						<p class="text-3xl font-black text-green-600">₹{{ valuation.total_potential_profit?.toLocaleString('en-IN') }}</p>
					</div>
				</div>
				<div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]"
					style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
					<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-4">
						Product Breakdown ({{ valuation.total_items }} items)
					</h3>
					<div class="overflow-x-auto rounded-[1.5rem] border border-border/50">
						<table class="w-full text-sm">
							<thead style="background-color: rgb(var(--color-background))">
								<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
									<th class="px-5 py-3 text-left">Product</th>
									<th class="px-5 py-3 text-right">Qty</th>
									<th class="px-5 py-3 text-right">Cost Price</th>
									<th class="px-5 py-3 text-right">Selling Price</th>
									<th class="px-5 py-3 text-right">Value at Cost</th>
									<th class="px-5 py-3 text-right">Potential Profit</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in valuation.items" :key="item.product_id"
									class="border-t hover:bg-secondary/20" style="border-color: rgb(var(--color-border))">
									<td class="px-5 py-3">
										<div class="font-semibold">{{ item.product_name }}</div>
										<div class="text-[10px] font-mono opacity-50">{{ item.product_public_id }}</div>
									</td>
									<td class="px-5 py-3 text-right font-bold">{{ item.total_quantity }}</td>
									<td class="px-5 py-3 text-right opacity-70">₹{{ item.cost_price?.toLocaleString('en-IN') }}</td>
									<td class="px-5 py-3 text-right opacity-70">₹{{ item.selling_price?.toLocaleString('en-IN') }}</td>
									<td class="px-5 py-3 text-right font-semibold text-primary">₹{{ item.stock_value_at_cost?.toLocaleString('en-IN') }}</td>
									<td class="px-5 py-3 text-right font-semibold text-green-600">₹{{ item.potential_profit?.toLocaleString('en-IN') }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<p class="text-[10px] text-text opacity-40 mt-4 text-right">Generated: {{ valuation.generated_at ? new Date(valuation.generated_at).toLocaleString() : '—' }}</p>
				</div>
			</div>
			<div v-else class="p-16 text-center text-text opacity-50 text-sm">
				Click Refresh to load the valuation report.
			</div>
		</div>

		<!-- ─── AUDIT TRAIL TAB ─────────────────────────────────────────────── -->
		<div v-if="activeTab === 'audit'" class="space-y-6">
			<div class="flex flex-col sm:flex-row justify-between gap-4 mb-2">
				<h2 class="text-xl font-light tracking-tight">Adjustment Audit Trail</h2>
				<div class="flex gap-3 flex-wrap">
					<div class="relative">
						<select v-model="auditTypeFilter" @change="loadAudit"
							class="appearance-none pl-4 pr-10 py-2 bg-card border border-border rounded-xl text-sm font-medium focus:outline-none text-text cursor-pointer"
							style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
							<option value="">All Types</option>
							<option v-for="t in adjustmentTypes" :key="t" :value="t">{{ t }}</option>
						</select>
						<Icon name="mdi:chevron-down"
							class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
					</div>
					<v-btn size="small" variant="outlined" color="primary" rounded="pill" @click="loadAudit"
						:loading="loadingAudit" class="text-none font-semibold">
						<template #prepend><Icon name="mdi:refresh" class="w-4 h-4" /></template>
						Refresh
					</v-btn>
				</div>
			</div>

			<div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden"
				style="background-color: rgb(var(--color-card)); border-color: rgb(var(--color-border))">
				<div v-if="loadingAudit" class="p-12 text-center">
					<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
				</div>
				<div v-else-if="auditItems.length === 0" class="p-16 text-center">
					<div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center"
						style="background-color: rgb(var(--color-secondary))">
						<Icon name="mdi:history" class="w-8 h-8 text-text opacity-30" />
					</div>
					<p class="text-text opacity-50 text-sm font-medium">No adjustment records found.</p>
				</div>
				<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50" style="border-color: rgb(var(--color-border))">
					<table class="w-full text-sm">
						<thead style="background-color: rgb(var(--color-background))">
							<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
								<th class="px-5 py-4 text-left">Type</th>
								<th class="px-5 py-4 text-left">Product</th>
								<th class="px-5 py-4 text-left">Branch</th>
								<th class="px-5 py-4 text-right">Δ Qty</th>
								<th class="px-5 py-4 text-right">Before → After</th>
								<th class="px-5 py-4 text-left">Reason / Reference</th>
								<th class="px-5 py-4 text-left">Date</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="a in auditItems" :key="a.id"
								class="border-t hover:bg-secondary/20 transition-colors"
								style="border-color: rgb(var(--color-border))">
								<td class="px-5 py-4">
									<span :class="auditTypeBadge(a.adjustment_type)"
										class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
										{{ a.adjustment_type?.replace(/_/g, ' ') }}
									</span>
								</td>
								<td class="px-5 py-4 font-mono text-xs opacity-60">#{{ a.product_id }}</td>
								<td class="px-5 py-4 text-text opacity-70">Branch #{{ a.branch_id }}</td>
								<td class="px-5 py-4 text-right font-bold"
									:class="a.quantity_change > 0 ? 'text-green-600' : 'text-red-500'">
									{{ a.quantity_change > 0 ? '+' : '' }}{{ a.quantity_change }}
								</td>
								<td class="px-5 py-4 text-right text-xs opacity-60 font-mono">{{ a.quantity_before }} → {{ a.quantity_after }}</td>
								<td class="px-5 py-4 text-text opacity-70 max-w-xs truncate text-xs">
									<span v-if="a.reference_id" class="font-mono text-primary mr-1">{{ a.reference_id }}</span>
									{{ a.reason || '—' }}
								</td>
								<td class="px-5 py-4 text-xs opacity-60 font-mono whitespace-nowrap">{{ formatDate(a.created_at) }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- ─── SUPPLIER MODAL ───────────────────────────────────────────────── -->
		<v-dialog v-model="showSupplierModal" max-width="480" transition="dialog-bottom-transition">
			<v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden"
				style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
				<div class="px-8 py-8 md:px-10 md:py-10">
					<h2 class="text-3xl font-light tracking-tight text-text mb-6 pb-2 border-b border-border"
						style="border-color: rgb(var(--color-border))">
						{{ editingSupplierId ? 'Edit Supplier' : 'Add Supplier' }}
					</h2>

					<form @submit.prevent="saveSupplier" class="space-y-4">
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Supplier Name *</label>
							<input v-model="supplierForm.name" placeholder="e.g. Supplier ABC Ltd" required maxlength="100" pattern="[^\s].*" title="Cannot start with a space"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Contact Person</label>
							<input v-model="supplierForm.contact_person" placeholder="e.g. Jane Doe" maxlength="100" pattern="[^\s].*" title="Cannot start with a space"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Email Address</label>
							<input v-model="supplierForm.email" placeholder="e.g. contact@supplierabc.com" type="email" maxlength="100" pattern="[^\s].*" title="Cannot start with a space"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Phone Number</label>
							<input v-model="supplierForm.phone" placeholder="e.g. 9876543210" maxlength="10" pattern="\d{10}" title="Phone number must be exactly 10 digits"
								@input="supplierForm.phone = filterDigits(supplierForm.phone, 10)"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div>
							<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Address</label>
							<input v-model="supplierForm.address" placeholder="e.g. 123 Supplier Street, New Delhi" maxlength="255" pattern="[^\s].*" title="Cannot start with a space"
								class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
						</div>
						<div class="flex gap-4 pt-6 border-t border-border" style="border-color: rgb(var(--color-border))">
							<v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="showSupplierModal = false">
								Cancel
							</v-btn>
							<v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" :loading="savingSupplier" type="submit">
								{{ editingSupplierId ? 'UPDATE SUPPLIER' : 'SAVE SUPPLIER' }}
							</v-btn>
						</div>
					</form>
				</div>
			</v-card>
		</v-dialog>

		<!-- ─── PURCHASE ORDER MODAL ─────────────────────────────────────────── -->
		<v-dialog v-model="showPOModal" max-width="680" transition="dialog-bottom-transition">
			<v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden"
				style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
				<div class="px-8 py-8 md:px-10 md:py-10">
					<h2 class="text-3xl font-light tracking-tight text-text mb-6 pb-2 border-b border-border"
						style="border-color: rgb(var(--color-border))">
						{{ editingPOId ? 'Edit Purchase Order' : 'Create Purchase Order' }}
					</h2>

					<form @submit.prevent="savePurchaseOrder" class="space-y-4 text-sm">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Supplier *</label>
								<div class="relative">
									<select v-model="poForm.supplier_id" required
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
										<option value="" disabled>Select Supplier</option>
										<option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Receiving Branch *</label>
								<div class="relative">
									<select v-model="poForm.branch_id" required
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
										<option v-for="b in branchesList" :key="b.id" :value="b.branch_id || b.id">
											{{ b.name || b.branch_name || `Branch #${b.id}` }}
										</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Order Date</label>
								<input v-model="poForm.order_date" type="date" required
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>
							<div>
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Expected Delivery</label>
								<input v-model="poForm.expected_delivery_date" type="date" required
									class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
							</div>
							<div class="md:col-span-2">
								<label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Delivery Status *</label>
								<div class="relative">
									<select v-model="poForm.status" required
										class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer">
										<option value="PENDING">PENDING</option>
										<option value="ORDERED">ORDERED</option>
										<option value="DELIVERED">DELIVERED</option>
										<option value="COMPLETED">COMPLETED</option>
										<option value="CANCELLED">CANCELLED</option>
									</select>
									<div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
										<Icon name="mdi:chevron-down" class="w-5 h-5" />
									</div>
								</div>
								<p v-if="['DELIVERED','COMPLETED'].includes(poForm.status)"
									class="text-[10px] text-amber-600 mt-1.5 ml-2 font-semibold">
									⚠ Setting status to {{ poForm.status }} will trigger a stock update.
								</p>
							</div>
						</div>

						<div class="border-t border-border pt-4 mt-4" style="border-color: rgb(var(--color-border))">
							<div class="flex justify-between items-center mb-4">
								<h3 class="font-bold text-xs uppercase tracking-widest text-primary">PO Items List</h3>
								<v-btn color="primary" variant="outlined" rounded="pill" size="small" @click="addPOItemLine" class="text-none font-semibold">
									+ Add Item
								</v-btn>
							</div>
							<div class="space-y-4 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2 mb-2">
								<div v-for="(item, idx) in poForm.items" :key="idx"
									class="flex gap-3 items-end bg-secondary/20 p-3 rounded-2xl border border-border/50">
									<div class="flex-1">
										<label class="text-[9px] text-text opacity-50 font-bold uppercase tracking-widest block mb-1">Product *</label>
										<div class="relative">
											<select v-model="item.product_id" required
												class="w-full pl-3 pr-8 py-2 bg-background border border-border rounded-full text-xs focus:outline-none text-text appearance-none cursor-pointer">
												<option value="" disabled>Select Product</option>
												<option v-for="p in allProductsList" :key="p.id" :value="p.id">{{ p.product_name || p.name }}</option>
											</select>
											<div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text opacity-40">
												<Icon name="mdi:chevron-down" class="w-4 h-4" />
											</div>
										</div>
									</div>
									<div class="w-24">
										<label class="text-[9px] text-text opacity-50 font-bold uppercase tracking-widest block mb-1">Qty *</label>
										<input v-model.number="item.quantity" type="number" step="0.1" required placeholder="0" min="0.1" max="1000000"
											class="w-full px-3 py-2 bg-background border border-border rounded-full text-xs focus:outline-none text-text transition-all" />
									</div>
									<div class="w-28">
										<label class="text-[9px] text-text opacity-50 font-bold uppercase tracking-widest block mb-1">Cost Per Unit *</label>
										<input v-model.number="item.cost_per_unit" type="number" step="0.01" required placeholder="0.00" min="0" max="10000000"
											class="w-full px-3 py-2 bg-background border border-border rounded-full text-xs focus:outline-none text-text transition-all" />
									</div>
									<v-btn icon size="small" variant="text" color="error" :disabled="poForm.items.length === 1" @click="removePOItemLine(idx)" class="mb-1 flex-shrink-0">
										<Icon name="mdi:trash-can-outline" class="w-4 h-4" />
									</v-btn>
								</div>
							</div>
						</div>

						<div class="flex gap-4 pt-6 border-t border-border" style="border-color: rgb(var(--color-border))">
							<v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="showPOModal = false">Cancel</v-btn>
							<v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" :loading="savingPO" type="submit">
								{{ editingPOId ? 'UPDATE PO' : 'CREATE PO' }}
							</v-btn>
						</div>
					</form>
				</div>
			</v-card>
		</v-dialog>

		<!-- ─── PURCHASE ORDER DETAILS MODAL ────────────────────────────────── -->
		<v-dialog v-model="showPODetailsModal" max-width="700" transition="dialog-bottom-transition">
			<v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden"
				style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
				<div class="px-8 py-8 md:px-10 md:py-10">
					<div class="flex justify-between items-start mb-6 pb-2 border-b border-border" style="border-color: rgb(var(--color-border))">
						<div>
							<h2 class="text-3xl font-light tracking-tight text-text">
								Purchase Order <span class="font-bold text-primary">#{{ selectedPO?.po_id || selectedPO?.id }}</span>
							</h2>
							<p class="text-text opacity-70 mt-1">Status: <span class="font-bold uppercase">{{ selectedPO?.status }}</span></p>
						</div>
						<v-btn icon variant="text" @click="showPODetailsModal = false">
							<Icon name="mdi:close" class="w-6 h-6" />
						</v-btn>
					</div>

					<div v-if="loadingPODetails" class="p-12 text-center">
						<v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
					</div>
					<div v-else>
						<div class="grid grid-cols-2 gap-4 mb-6 text-sm">
							<div class="p-4 bg-secondary/20 rounded-2xl border border-border/50">
								<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-1">Supplier</p>
								<p class="font-semibold">{{ selectedPO?.supplier?.name || `Supplier #${selectedPO?.supplier_id}` }}</p>
							</div>
							<div class="p-4 bg-secondary/20 rounded-2xl border border-border/50">
								<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-1">Branch</p>
								<p class="font-semibold">Branch #{{ selectedPO?.branch_id }}</p>
							</div>
							<div class="p-4 bg-secondary/20 rounded-2xl border border-border/50">
								<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-1">Order Date</p>
								<p class="font-semibold">{{ new Date(selectedPO?.order_date || selectedPO?.created_at).toLocaleString() }}</p>
							</div>
							<div class="p-4 bg-secondary/20 rounded-2xl border border-border/50">
								<p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mb-1">Expected Delivery</p>
								<p class="font-semibold">{{ selectedPO?.expected_delivery_date ? new Date(selectedPO.expected_delivery_date).toLocaleString() : '—' }}</p>
							</div>
						</div>

						<h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2 mb-4">Order Items</h3>

						<div v-if="selectedPOItems.length === 0" class="text-center py-6 text-text opacity-50 text-sm">No items found in this order.</div>
						<div v-else class="overflow-x-auto rounded-[1.5rem] border border-border/50 mb-6">
							<table class="w-full text-sm">
								<thead style="background-color: rgb(var(--color-background))">
									<tr class="text-[10px] text-text font-bold uppercase tracking-widest opacity-60">
										<th class="px-4 py-3 text-left">Product ID</th>
										<th class="px-4 py-3 text-left">Quantity</th>
										<th class="px-4 py-3 text-left">Cost/Unit</th>
										<th class="px-4 py-3 text-right">Total</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="item in selectedPOItems" :key="item.id" class="border-t hover:bg-secondary/20" style="border-color: rgb(var(--color-border))">
										<td class="px-4 py-3 font-medium text-text">{{ item.product_name || `Product #${item.product_id}` }}</td>
										<td class="px-4 py-3 text-text">{{ item.quantity }}</td>
										<td class="px-4 py-3 text-text">₹{{ item.cost_per_unit?.toLocaleString('en-IN') || '0' }}</td>
										<td class="px-4 py-3 font-semibold text-right text-primary">₹{{ (item.quantity * item.cost_per_unit).toLocaleString('en-IN') }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="flex justify-end pr-4 text-lg">
							<p class="font-bold text-text opacity-70 mr-4">Total Amount:</p>
							<p class="font-black text-primary">₹{{ selectedPO?.total_amount?.toLocaleString('en-IN') || '0' }}</p>
						</div>
					</div>
				</div>
			</v-card>
		</v-dialog>

	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useInventory } from '~/composables/useInventory'
import { useBusinessProducts } from '~/composables/useBusinessProducts'
import { useBranches } from '~/composables/useBranches'
import { useAuthStore } from '~/stores/auth'
import { toast } from 'vue3-toastify'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
	title: 'Inventory',
	middleware: ['auth-role'],
	layout: 'admin',
	role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const tabs = [
	{ key: 'suppliers', label: 'Suppliers' },
	{ key: 'orders', label: 'Purchase Orders' },
	{ key: 'stock', label: 'Stock Adjustment' },
	{ key: 'transfers', label: 'Stock Transfers' },
	{ key: 'levels', label: 'Stock Levels' },
	{ key: 'valuation', label: 'Valuation' },
	{ key: 'audit', label: 'Audit Trail' },
]
const activeTab = ref('suppliers')

// ─── Data Refs ────────────────────────────────────────────────────────────────
const suppliers = ref([])
const purchaseOrders = ref([])
const branchesList = ref([])
const allProductsList = ref([])
const transfers = ref([])
const stockLevels = ref([])
const valuation = ref(null)
const auditItems = ref([])

// ─── Loading States ───────────────────────────────────────────────────────────
const loadingSuppliers = ref(false)
const loadingPO = ref(false)
const adjusting = ref(false)
const savingSupplier = ref(false)
const savingPO = ref(false)
const loadingTransfers = ref(false)
const submittingTransfer = ref(false)
const loadingLevels = ref(false)
const loadingLowStock = ref(false)
const loadingValuation = ref(false)
const loadingAudit = ref(false)

// ─── Modal / Selection State ──────────────────────────────────────────────────
const showSupplierModal = ref(false)
const editingSupplierId = ref(null)
const showPOModal = ref(false)
const editingPOId = ref(null)
const showPODetailsModal = ref(false)
const selectedPO = ref(null)
const selectedPOItems = ref([])
const loadingPODetails = ref(false)

// ─── Forms ────────────────────────────────────────────────────────────────────
const supplierForm = ref({ name: '', email: '', phone: '', contact_person: '', address: '' })
const poForm = ref({
	supplier_id: '',
	branch_id: 1,
	order_date: '',
	expected_delivery_date: '',
	status: 'DELIVERED',
	items: [{ product_id: '', quantity: '', cost_per_unit: '' }]
})
const stockForm = ref({ product_id: '', branch_id: '', adjustment_type: 'add', quantity: '', reason: '' })
const transferForm = ref({ product_id: '', from_branch_id: '', to_branch_id: '', quantity: '', notes: '' })

// ─── Product Search ───────────────────────────────────────────────────────────
const productSearch = ref('')
const searchingProducts = ref(false)
const foundProducts = ref([])
const selectedProd = ref(null)

// ─── Filters ──────────────────────────────────────────────────────────────────
const selectedBranchFilterId = ref('')
const auditTypeFilter = ref('')
const adjustmentTypes = [
	'PURCHASE_ORDER', 'MANUAL', 'ORDER_DEDUCTION', 'ORDER_CANCELLATION_RESTORE',
	'TRANSFER_IN', 'TRANSFER_OUT', 'DAMAGE', 'RETURN'
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—'
const filterDigits = (val, max) => String(val || '').replace(/\D/g, '').slice(0, max)

const poStatusClass = (status) => {
	const map = {
		PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400',
		ORDERED: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
		DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
		COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
		CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
	}
	return map[status] || 'bg-gray-100 text-gray-700'
}

const auditTypeBadge = (type) => {
	const map = {
		PURCHASE_ORDER: 'bg-blue-100 text-blue-700',
		MANUAL: 'bg-purple-100 text-purple-700',
		ORDER_DEDUCTION: 'bg-orange-100 text-orange-700',
		ORDER_CANCELLATION_RESTORE: 'bg-teal-100 text-teal-700',
		TRANSFER_IN: 'bg-green-100 text-green-700',
		TRANSFER_OUT: 'bg-sky-100 text-sky-700',
		DAMAGE: 'bg-red-100 text-red-700',
		RETURN: 'bg-indigo-100 text-indigo-700',
	}
	return map[type] || 'bg-gray-100 text-gray-700'
}

const onBranchFilterChange = () => {
	if (activeTab.value === 'orders') loadPO()
	if (activeTab.value === 'transfers') loadTransfers()
	if (activeTab.value === 'levels') loadStockLevels()
	if (activeTab.value === 'audit') loadAudit()
}

// ─── Suppliers ────────────────────────────────────────────────────────────────
const loadSuppliers = async () => {
	loadingSuppliers.value = true
	try {
		const { getSuppliers } = useInventory()
		const res = await getSuppliers()
		suppliers.value = res?.data?.items || res?.data || []
	} catch (error) {
		console.error(error)
		toast.error('Failed to load suppliers')
	} finally {
		loadingSuppliers.value = false
	}
}

const openSupplierModal = () => {
	editingSupplierId.value = null
	supplierForm.value = { name: '', email: '', phone: '', contact_person: '', address: '' }
	showSupplierModal.value = true
}

const openEditSupplierModal = (s) => {
	editingSupplierId.value = s.supplier_id || s.id
	supplierForm.value = {
		name: s.name || '',
		email: s.email || '',
		phone: s.phone || '',
		contact_person: s.contact_person || '',
		address: s.address || ''
	}
	showSupplierModal.value = true
}

const saveSupplier = async () => {
	if (!supplierForm.value.name) return toast.error('Supplier name is required')
	savingSupplier.value = true
	try {
		const { createSupplier, updateSupplier } = useInventory()
		const payload = {
			name: supplierForm.value.name,
			email: supplierForm.value.email || null,
			phone: supplierForm.value.phone || null,
			contact_person: supplierForm.value.contact_person || null,
			address: supplierForm.value.address || null
		}
		if (editingSupplierId.value) {
			await updateSupplier(editingSupplierId.value, payload)
			toast.success('Supplier updated successfully')
		} else {
			await createSupplier(payload)
			toast.success('Supplier added successfully')
		}
		showSupplierModal.value = false
		loadSuppliers()
	} catch (error) {
		console.error(error)
		toast.error(editingSupplierId.value ? 'Failed to update supplier' : 'Failed to add supplier')
	} finally {
		savingSupplier.value = false
	}
}

const deleteSupplierAction = async (s) => {
	if (!confirm(`Delete supplier "${s.name}"? This cannot be undone.`)) return
	try {
		const { deleteSupplier } = useInventory()
		await deleteSupplier(s.supplier_id || s.id)
		toast.success('Supplier deleted successfully')
		loadSuppliers()
	} catch (e) {
		console.error(e)
		toast.error('Failed to delete supplier')
	}
}

// ─── Purchase Orders ──────────────────────────────────────────────────────────
const loadPO = async () => {
	loadingPO.value = true
	try {
		const { getPurchaseOrders } = useInventory()
		const params = {}
		if (selectedBranchFilterId.value) params.branch_id = selectedBranchFilterId.value
		const res = await getPurchaseOrders(params)
		purchaseOrders.value = res?.data?.items || res?.data || []
	} catch (error) {
		console.error(error)
		toast.error('Failed to load purchase orders')
	} finally {
		loadingPO.value = false
	}
}

const loadBranches = async () => {
	try {
		const { getBranches } = useBranches()
		const authStore = useAuthStore()
		const params = {}
		const businessId = authStore.user?.business_id || authStore.user?.business?.id
		if (businessId) params.business_id = businessId
		const res = await getBranches(params)
		const resData = res?.data?.data || res?.data?.items || res?.data || []
		branchesList.value = Array.isArray(resData) ? resData : (Array.isArray(res?.data) ? res.data : [])
		if (branchesList.value.length === 0) {
			branchesList.value = [{ id: 1, name: 'Main Branch' }]
		}
	} catch (e) {
		console.error(e)
		branchesList.value = [{ id: 1, name: 'Main Branch' }]
	}
}

const loadAllProducts = async () => {
	try {
		const { getProducts } = useBusinessProducts()
		const res = await getProducts({ limit: 100 })
		allProductsList.value = res?.data?.items || res?.data || []
	} catch (e) {
		console.error(e)
	}
}

const openPOModal = () => {
	editingPOId.value = null
	const now = new Date()
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
	const defaultOrderDate = now.toISOString().slice(0, 10)
	const deliveryDate = new Date(Date.now() + 5*24*60*60*1000)
	deliveryDate.setMinutes(deliveryDate.getMinutes() - deliveryDate.getTimezoneOffset())
	const defaultDeliveryDate = deliveryDate.toISOString().slice(0, 10)
	poForm.value = {
		supplier_id: '',
		branch_id: branchesList.value[0]?.branch_id || branchesList.value[0]?.id || 1,
		order_date: defaultOrderDate,
		expected_delivery_date: defaultDeliveryDate,
		status: 'DELIVERED',
		items: [{ product_id: '', quantity: '', cost_per_unit: '' }]
	}
	showPOModal.value = true
}

const editPO = async (po) => {
	editingPOId.value = po.po_id || po.id
	const formatForInput = (dateString) => {
		if (!dateString) return ''
		const d = new Date(dateString)
		d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
		return d.toISOString().slice(0, 10)
	}
	poForm.value = {
		supplier_id: po.supplier_id,
		branch_id: po.branch_id || branchesList.value[0]?.branch_id || branchesList.value[0]?.id || 1,
		order_date: formatForInput(po.order_date || po.created_at),
		expected_delivery_date: formatForInput(po.expected_delivery_date),
		status: po.status,
		items: po.items?.length ? po.items.map(i => ({
			product_id: i.product_id,
			quantity: i.quantity,
			cost_per_unit: i.cost_per_unit
		})) : [{ product_id: '', quantity: '', cost_per_unit: '' }]
	}
	showPOModal.value = true
	if (!po.items || po.items.length === 0) {
		try {
			const { getPurchaseOrder } = useInventory()
			const res = await getPurchaseOrder(po.po_id || po.id)
			if (res?.data?.items?.length) {
				poForm.value.items = res.data.items.map(i => ({
					product_id: i.product_id,
					quantity: i.quantity,
					cost_per_unit: i.cost_per_unit
				}))
			}
		} catch (e) {
			console.error('Failed to load PO details for editing', e)
		}
	}
}

const deletePO = async (po) => {
	if (!confirm(`Are you sure you want to delete Purchase Order #${po.po_id || po.id}?`)) return
	try {
		const { deletePurchaseOrder } = useInventory()
		await deletePurchaseOrder(po.po_id || po.id)
		toast.success('Purchase order deleted!')
		loadPO()
	} catch (e) {
		console.error(e)
		toast.error('Failed to delete purchase order')
	}
}

const addPOItemLine = () => poForm.value.items.push({ product_id: '', quantity: '', cost_per_unit: '' })
const removePOItemLine = (idx) => { if (poForm.value.items.length > 1) poForm.value.items.splice(idx, 1) }

const viewPO = async (po) => {
	selectedPO.value = po
	selectedPOItems.value = po.items || []
	showPODetailsModal.value = true
	if (!po.items || po.items.length === 0) {
		loadingPODetails.value = true
		try {
			const { getPurchaseOrder } = useInventory()
			const res = await getPurchaseOrder(po.po_id || po.id)
			if (res?.data) {
				selectedPO.value = res.data
				selectedPOItems.value = res.data.items || res.data.purchase_order_items || []
			}
		} catch (e) {
			console.error('Failed to load PO details', e)
		} finally {
			loadingPODetails.value = false
		}
	}
}

const savePurchaseOrder = async () => {
	if (!poForm.value.supplier_id) return toast.error('Please select a supplier')
	if (poForm.value.items.some(item => !item.product_id || !item.quantity || !item.cost_per_unit)) {
		return toast.error('Please fill all item fields with valid values')
	}
	savingPO.value = true
	try {
		const { createPurchaseOrder, updatePurchaseOrder } = useInventory()
		const utcOrderDate = new Date(poForm.value.order_date).toISOString()
		const utcDeliveryDate = new Date(poForm.value.expected_delivery_date).toISOString()
		const payload = {
			supplier_id: Number(poForm.value.supplier_id),
			branch_id: Number(poForm.value.branch_id),
			order_date: utcOrderDate,
			expected_delivery_date: utcDeliveryDate,
			status: poForm.value.status,
			items: poForm.value.items.map(item => ({
				product_id: Number(item.product_id),
				quantity: Number(item.quantity),
				cost_per_unit: Number(item.cost_per_unit)
			}))
		}
		if (editingPOId.value) {
			await updatePurchaseOrder(editingPOId.value, payload)
			toast.success('Purchase Order updated successfully!')
		} else {
			await createPurchaseOrder(payload)
			toast.success('Purchase Order created successfully!')
		}
		showPOModal.value = false
		loadPO()
	} catch (e) {
		console.error(e)
		toast.error(editingPOId.value ? 'Failed to update purchase order' : 'Failed to create purchase order')
	} finally {
		savingPO.value = false
	}
}

// ─── Stock Adjustment ─────────────────────────────────────────────────────────
const selectProduct = (prod) => {
	selectedProd.value = prod
	stockForm.value.product_id = prod.product_id || prod.id
}

const debouncedProductSearch = useDebounceFn(async () => {
	if (!productSearch.value) {
		foundProducts.value = []
		return
	}
	searchingProducts.value = true
	try {
		const { getProducts } = useBusinessProducts()
		const res = await getProducts({ search: productSearch.value, limit: 15 })
		const itemsList = res?.data?.items || res?.data || []
		foundProducts.value = Array.isArray(itemsList) ? itemsList : []
	} catch (error) {
		console.error(error)
		foundProducts.value = []
	} finally {
		searchingProducts.value = false
	}
}, 400)

const submitStockAdjust = async () => {
	if (!stockForm.value.product_id || stockForm.value.quantity === '' || stockForm.value.quantity === undefined) {
		return toast.error('Please select a product and enter quantity')
	}
	adjusting.value = true
	try {
		const { adjustStock } = useInventory()
		const qty = Number(stockForm.value.quantity)
		const finalQty = stockForm.value.adjustment_type === 'remove' ? -Math.abs(qty) : qty
		await adjustStock({
			product_id: stockForm.value.product_id,
			branch_id: stockForm.value.branch_id || null,
			quantity: finalQty,
			reason: stockForm.value.reason || null
		})
		toast.success('Stock adjusted successfully')
		if (selectedProd.value) {
			if (stockForm.value.adjustment_type === 'add') {
				selectedProd.value.stock_quantity = (selectedProd.value.stock_quantity || 0) + qty
			} else if (stockForm.value.adjustment_type === 'remove') {
				selectedProd.value.stock_quantity = Math.max(0, (selectedProd.value.stock_quantity || 0) - qty)
			} else if (stockForm.value.adjustment_type === 'set') {
				selectedProd.value.stock_quantity = qty
			}
		}
		stockForm.value = { product_id: '', branch_id: '', adjustment_type: 'add', quantity: '', reason: '' }
		selectedProd.value = null
		productSearch.value = ''
		foundProducts.value = []
	} catch (error) {
		console.error(error)
		toast.error('Stock adjustment failed')
	} finally {
		adjusting.value = false
	}
}

// ─── Stock Transfers ──────────────────────────────────────────────────────────
const loadTransfers = async () => {
	loadingTransfers.value = true
	try {
		const { getStockTransfers } = useInventory()
		const params = {}
		if (selectedBranchFilterId.value) params.branch_id = selectedBranchFilterId.value
		const res = await getStockTransfers(params)
		transfers.value = res?.data?.items || res?.data || []
	} catch (e) {
		console.error(e)
		toast.error('Failed to load stock transfers')
	} finally {
		loadingTransfers.value = false
	}
}

const submitTransfer = async () => {
	if (!transferForm.value.product_id || !transferForm.value.from_branch_id || !transferForm.value.to_branch_id || !transferForm.value.quantity) {
		return toast.error('Please fill all required transfer fields')
	}
	if (transferForm.value.from_branch_id === transferForm.value.to_branch_id) {
		return toast.error('Source and destination branches must be different')
	}
	submittingTransfer.value = true
	try {
		const { createStockTransfer } = useInventory()
		await createStockTransfer({
			product_id: transferForm.value.product_id,
			from_branch_id: transferForm.value.from_branch_id,
			to_branch_id: transferForm.value.to_branch_id,
			quantity: Number(transferForm.value.quantity),
			notes: transferForm.value.notes || null
		})
		toast.success('Stock transferred successfully!')
		transferForm.value = { product_id: '', from_branch_id: '', to_branch_id: '', quantity: '', notes: '' }
		loadTransfers()
	} catch (e) {
		console.error(e)
		toast.error('Stock transfer failed')
	} finally {
		submittingTransfer.value = false
	}
}

// ─── Stock Levels ─────────────────────────────────────────────────────────────
const loadStockLevels = async () => {
	loadingLevels.value = true
	try {
		const { getStockLevels } = useInventory()
		const params = {}
		if (selectedBranchFilterId.value) params.branch_id = selectedBranchFilterId.value
		const res = await getStockLevels(params)
		stockLevels.value = res?.data || []
	} catch (e) {
		console.error(e)
		toast.error('Failed to load stock levels')
	} finally {
		loadingLevels.value = false
	}
}

const loadLowStock = async () => {
	loadingLowStock.value = true
	try {
		const { getLowStock } = useInventory()
		const params = {}
		if (selectedBranchFilterId.value) params.branch_id = selectedBranchFilterId.value
		const res = await getLowStock(params)
		stockLevels.value = res?.data || []
	} catch (e) {
		console.error(e)
		toast.error('Failed to load low stock data')
	} finally {
		loadingLowStock.value = false
	}
}

// ─── Valuation ────────────────────────────────────────────────────────────────
const loadValuation = async () => {
	loadingValuation.value = true
	try {
		const { getInventoryValuation } = useInventory()
		const res = await getInventoryValuation()
		valuation.value = res?.data || null
	} catch (e) {
		console.error(e)
		toast.error('Failed to load valuation report')
	} finally {
		loadingValuation.value = false
	}
}

// ─── Audit Trail ──────────────────────────────────────────────────────────────
const loadAudit = async () => {
	loadingAudit.value = true
	try {
		const { getAdjustments } = useInventory()
		const params = {}
		if (selectedBranchFilterId.value) params.branch_id = selectedBranchFilterId.value
		if (auditTypeFilter.value) params.adjustment_type = auditTypeFilter.value
		const res = await getAdjustments(params)
		auditItems.value = res?.data?.items || res?.data || []
	} catch (e) {
		console.error(e)
		toast.error('Failed to load audit trail')
	} finally {
		loadingAudit.value = false
	}
}

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(activeTab, (tab) => {
	if (tab === 'suppliers') loadSuppliers()
	if (tab === 'orders') loadPO()
	if (tab === 'transfers') loadTransfers()
	if (tab === 'levels') loadStockLevels()
	if (tab === 'valuation') loadValuation()
	if (tab === 'audit') loadAudit()
})

// ─── Mount ────────────────────────────────────────────────────────────────────
onMounted(() => {
	loadSuppliers()
	loadBranches()
	loadAllProducts()
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
</style>
