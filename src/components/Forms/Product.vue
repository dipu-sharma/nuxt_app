<template>
	<div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
		<!-- Product Information Section -->
		<div class="mb-8">
			<h3 class="text-xl font-semibold text-indigo-700 mb-2">Product Information</h3>
			<div class="h-1 bg-gradient-to-r from-indigo-500 to-indigo-100 rounded-full"></div>
		</div>

		<!-- Product Name and Brand -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">
					Product Name <span class="text-red-500">*</span>
				</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					:rules="[required]"
					v-model="payload.product_name"
					placeholder="Enter product name"
					required
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Brand Name</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.brand_name"
					placeholder="Enter brand name"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Product SKU and HSN -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Product SKU</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.product_sku"
					placeholder="Enter SKU code"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">HSN Code</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.hsn_no"
					placeholder="Enter HSN code"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Pricing Section -->
		<div class="mb-8">
			<h3 class="text-xl font-semibold text-indigo-700 mb-2">Pricing Details</h3>
			<div class="h-1 bg-gradient-to-r from-indigo-500 to-indigo-100 rounded-full"></div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Cost Price</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.product_cost_price"
					placeholder="0.00"
					prefix="$"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">MRP</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.product_mrp"
					placeholder="0.00"
					prefix="$"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Selling Price</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.selling_price"
					placeholder="0.00"
					prefix="$"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Discount and Tax -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Discount (%)</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.discount"
					placeholder="0.00"
					suffix="%"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Tax (%)</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.product_tax"
					placeholder="0.00"
					suffix="%"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Inventory Section -->
		<div class="mb-8">
			<h3 class="text-xl font-semibold text-indigo-700 mb-2">Inventory Details</h3>
			<div class="h-1 bg-gradient-to-r from-indigo-500 to-indigo-100 rounded-full"></div>
		</div>

		<!-- Quantity and Unit -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Available Quantity</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="number"
					v-model="payload.product_qty"
					placeholder="0.00"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Unit of Measurement</label>
				<v-autocomplete
					density="comfortable"
					variant="outlined"
					v-model="payload.product_unit"
					:items="productUnits"
					placeholder="Select unit"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Product Category</label>
				<v-autocomplete
					density="comfortable"
					variant="outlined"
					v-model="payload.product_type"
					:items="productTypes"
					placeholder="Select category"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Product Attributes Section -->
		<div class="mb-8">
			<h3 class="text-xl font-semibold text-indigo-700 mb-2">Product Attributes</h3>
			<div class="h-1 bg-gradient-to-r from-indigo-500 to-indigo-100 rounded-full"></div>
		</div>

		<!-- Size and Color -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Size</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.size"
					placeholder="Enter size"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Color</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.color"
					placeholder="Enter color"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Dates Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Manufacturing Date</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="date"
					v-model="payload.mfg_date"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Expiry Date</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					type="date"
					v-model="payload.exp_date"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Batch and Packing -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Batch Number</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.batch_no"
					placeholder="Enter batch number"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Packing Information</label>
				<v-text-field
					density="comfortable"
					variant="outlined"
					v-model="payload.product_packing"
					placeholder="Enter packing info"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>

		<!-- Description -->
		<div class="grid grid-cols-1 gap-6 mb-6">
			<div class="space-y-1">
				<label class="block text-sm font-medium text-gray-700">Description</label>
				<v-textarea
					density="comfortable"
					variant="outlined"
					v-model="payload.description"
					placeholder="Enter product description"
					rows="3"
					clearable
					class="[&_.v-field__outline]:!border-gray-300 hover:[&_.v-field__outline]:!border-indigo-300 [&_.v-field--active_.v-field__outline]:!border-indigo-500 [&_.v-field--focused_.v-field__outline]:!border-indigo-500"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: Object,
})

const emit = defineEmits(['update:modelValue'])

const payload = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
})

const required = (value) => !!value || 'This field is required'

// Product units options
const productUnits = [
	{ title: 'Pieces', value: 'PCS' },
	{ title: 'Kilograms', value: 'KG' },
	{ title: 'Grams', value: 'G' },
	{ title: 'Liters', value: 'L' },
	{ title: 'Milliliters', value: 'ML' },
	{ title: 'Meters', value: 'M' },
	{ title: 'Centimeters', value: 'CM' },
]

// Product category options
const productTypes = [
	{ title: 'Fashion', value: 'FASHION' },
	{ title: 'Electronics', value: 'ELECTRONICS' },
	{ title: 'Grocery', value: 'GROCERY' },
	{ title: 'Home', value: 'HOME' },
	{ title: 'Beauty', value: 'BEAUTY' },
	{ title: 'Other', value: 'OTHER' },
]
</script>
