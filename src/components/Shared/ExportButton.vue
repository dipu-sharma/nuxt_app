<template>
	<button
		:class="buttonClasses"
		:style="buttonStyle"
		:disabled="disabled || isExporting"
		@click="handleExport"
	>
		<Icon v-if="isExporting" name="mdi:loading" class="icon spin" />
		<Icon v-else :name="icon" class="icon" />
		<!-- <span>{{ isExporting ? exportingText : buttonText }}</span> -->
	</button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeIntegration } from '@/composables/useThemeIntegration'
import * as XLSX from 'xlsx'

const props = defineProps({
	data: {
		type: Array,
		required: true
	},
	filename: {
		type: String,
		default: 'export'
	},
	format: {
		type: String,
		default: 'excel',
		validator: (value) => ['excel', 'csv', 'json'].includes(value)
	},
	headers: {
		type: Array,
		default: () => []
	},
	variant: {
		type: String,
		default: 'primary',
		validator: (value) => ['primary', 'secondary', 'glass'].includes(value)
	},
	disabled: {
		type: Boolean,
		default: false
	},
	icon: {
		type: String,
		default: 'mdi:download'
	}
})

const emit = defineEmits(['export', 'error'])

const { isGlassmorphism, getRGBColor } = useThemeIntegration()

const isExporting = ref(false)

const buttonText = computed(() => {
	const formatText = {
		excel: 'Export to Excel',
		csv: 'Export to CSV',
		json: 'Export to JSON'
	}
	return formatText[props.format]
})

const exportingText = computed(() => {
	return 'Exporting...'
})

const buttonClasses = computed(() => {
	const classes = ['export-button']

	if (props.variant === 'glass' || isGlassmorphism.value) {
		classes.push('btn-glass')
	} else {
		classes.push(`btn-${props.variant}`)
	}

	if (props.disabled || isExporting.value) {
		classes.push('btn-disabled')
	}

	return classes
})

const buttonStyle = computed(() => {
	if (props.variant === 'glass' || isGlassmorphism.value) {
		return {
			backgroundColor: 'rgba(102, 126, 234, 0.2)',
			borderColor: 'rgba(102, 126, 234, 0.3)',
			color: getRGBColor('primary'),
			backdropFilter: 'blur(10px)'
		}
	}

	if (props.variant === 'primary') {
		return {
			backgroundColor: getRGBColor('primary'),
			borderColor: getRGBColor('primary'),
			color: 'white'
		}
	}

	return {
		backgroundColor: getRGBColor('secondary'),
		borderColor: getRGBColor('border'),
		color: getRGBColor('text')
	}
})

const handleExport = async () => {
	if (props.disabled || isExporting.value || !props.data || props.data.length === 0) {
		return
	}

	isExporting.value = true

	try {
		switch (props.format) {
			case 'excel':
				await exportToExcel()
				break
			case 'csv':
				await exportToCSV()
				break
			case 'json':
				await exportToJSON()
				break
		}

		emit('export', { format: props.format, filename: props.filename })
	} catch (error) {
		console.error('Export error:', error)
		emit('error', error)
	} finally {
		isExporting.value = false
	}
}

const prepareData = () => {
	if (props.headers && props.headers.length > 0) {
		return props.data.map(item => {
			const row = {}
			props.headers.forEach(header => {
				row[header.label || header.key] = item[header.key]
			})
			return row
		})
	}
	return props.data
}

const exportToExcel = () => {
	const data = prepareData()
	const worksheet = XLSX.utils.json_to_sheet(data)
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

	// Auto-size columns
	const maxWidth = 50
	const colWidths = []
	const range = XLSX.utils.decode_range(worksheet['!ref'])

	for (let C = range.s.c; C <= range.e.c; ++C) {
		let maxLen = 10
		for (let R = range.s.r; R <= range.e.r; ++R) {
			const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
			if (!worksheet[cellAddress]) continue
			const cellValue = worksheet[cellAddress].v
			const cellLen = cellValue ? String(cellValue).length : 10
			if (cellLen > maxLen) maxLen = cellLen
		}
		colWidths.push({ wch: Math.min(maxLen + 2, maxWidth) })
	}
	worksheet['!cols'] = colWidths

	XLSX.writeFile(workbook, `${props.filename}.xlsx`)
}

const exportToCSV = () => {
	const data = prepareData()
	const worksheet = XLSX.utils.json_to_sheet(data)
	const csv = XLSX.utils.sheet_to_csv(worksheet)

	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = `${props.filename}.csv`
	link.click()
}

const exportToJSON = () => {
	const data = prepareData()
	const json = JSON.stringify(data, null, 2)

	const blob = new Blob([json], { type: 'application/json' })
	const link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = `${props.filename}.json`
	link.click()
}
</script>

<style scoped>
.export-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 1.25rem;
	border: 1px solid;
	border-radius: 0.5rem;
	font-weight: 500;
	font-size: 0.9375rem;
	cursor: pointer;
	transition: all 0.3s ease;
	white-space: nowrap;
}

.export-button:hover:not(.btn-disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.export-button:active:not(.btn-disabled) {
	transform: translateY(0);
}

.btn-disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-glass {
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
}

.icon {
	font-size: 1.25rem;
}

.spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

@media (max-width: 768px) {
	.export-button {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.icon {
		font-size: 1.125rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.export-button,
	.spin {
		transition: none;
		animation: none;
		transform: none !important;
	}
}
</style>
