<template>
	<v-form ref="">
		<div class="space-y-1 md:col-span-2">
			<label class="block text-sm font-medium text-gray-700">
				Product <span class="text-red-500">*</span>
			</label>
			<v-autocomplete
				density="comfortable"
				variant="outlined"
				v-model="payload.product_id"
				:items="products"
				item-title="product_name"
				item-value="product_id"
				placeholder="Select a product"
				:rules="[required]"
			/>
		</div>

		<div class="space-y-1">
			<label class="block text-sm font-medium text-gray-700">
				Quantity <span class="text-red-500">*</span>
			</label>
			<v-text-field
				density="comfortable"
				variant="outlined"
				type="number"
				v-model="payload.quantity"
				placeholder="0.00"
				:rules="[required, positive]"
				clearable
			/>
		</div>
		<div class="space-y-1">
			<label class="block text-sm font-medium text-gray-700">
				Purchase Price <span class="text-red-500">*</span>
			</label>
			<v-text-field
				density="comfortable"
				variant="outlined"
				type="number"
				v-model="payload.purchase_price"
				placeholder="0.00"
				prefix="$"
				:rules="[required, positive]"
				clearable
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
			/>
		</div>
		<div class="space-y-1">
			<label class="block text-sm font-medium text-gray-700">Discount (%)</label>
			<v-text-field
				density="comfortable"
				variant="outlined"
				type="number"
				v-model="payload.discount_percent"
				placeholder="0.00"
				suffix="%"
				clearable
			/>
		</div>
		<div class="space-y-1">
			<label class="block text-sm font-medium text-gray-700">Batch Number</label>
			<v-text-field
				density="comfortable"
				variant="outlined"
				v-model="payload.batch_no"
				placeholder="Enter batch number"
				clearable
			/>
		</div>
	</v-form>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
	products: {
		type: Array,
		default: () => [],
	},
})

const emit = defineEmits(['update:modelValue'])

const payload = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
})

const required = (value) => !!value || 'This field is required'
const positive = (value) => value > 0 || 'Must be a positive number'
</script>
