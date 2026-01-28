<template>
	<div class="data-table-wrapper" :class="themeClasses">
		<!-- Search and Actions Bar -->
		<div v-if="searchable || $slots.actions" class="table-header" :style="headerStyle">
			<div v-if="searchable" class="search-container">
				<input
					v-model="searchQuery"
					type="text"
					:placeholder="searchPlaceholder"
					class="search-input"
					:style="inputStyle"
					@input="handleSearch"
				/>
				<Icon name="mdi:magnify" class="search-icon" />
			</div>

			<div v-if="$slots.actions" class="actions-container">
				<slot name="actions"></slot>
			</div>
		</div>

		<!-- Bulk Actions Bar -->
		<div v-if="selectable && selectedItems.length > 0" class="bulk-actions-bar" :style="bulkActionsStyle">
			<span class="selected-count">{{ selectedItems.length }} selected</span>
			<slot name="bulk-actions" :selected="selectedItems">
				<button @click="clearSelection" class="btn-clear">Clear</button>
			</slot>
		</div>

		<!-- Table -->
		<GlassCard :variant="isGlassmorphism ? 'glass' : 'default'" padding="none">
			<div class="table-container">
				<table class="data-table">
					<thead>
						<tr>
							<th v-if="selectable" class="checkbox-cell">
								<input
									type="checkbox"
									:checked="isAllSelected"
									:indeterminate="isSomeSelected"
									@change="toggleSelectAll"
								/>
							</th>
							<th
								v-for="header in headers"
								:key="header.key"
								:class="{ sortable: header.sortable !== false }"
								@click="header.sortable !== false ? handleSort(header.key) : null"
							>
								<div class="header-content">
									<span>{{ header.label }}</span>
									<Icon
										v-if="header.sortable !== false"
										:name="getSortIcon(header.key)"
										class="sort-icon"
									/>
								</div>
							</th>
							<th v-if="$slots.actions || actions.length > 0" class="actions-cell">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr v-if="loading">
							<td :colspan="totalColumns" class="loading-cell">
								<div class="loading-spinner">
									<Icon name="mdi:loading" class="spin" />
									<span>Loading...</span>
								</div>
							</td>
						</tr>
						<tr v-else-if="paginatedItems.length === 0">
							<td :colspan="totalColumns" class="empty-cell">
								<slot name="empty">
									<div class="empty-state">
										<Icon name="mdi:database-off-outline" class="empty-icon" />
										<p>No data available</p>
									</div>
								</slot>
							</td>
						</tr>
						<tr
							v-else
							v-for="(item, index) in paginatedItems"
							:key="item[itemKey] || index"
							:class="{ selected: isSelected(item) }"
							@click="handleRowClick(item)"
						>
							<td v-if="selectable" class="checkbox-cell">
								<input
									type="checkbox"
									:checked="isSelected(item)"
									@change="toggleSelect(item)"
									@click.stop
								/>
							</td>
							<td v-for="header in headers" :key="header.key">
								<slot :name="`item.${header.key}`" :item="item" :value="item[header.key]">
									{{ item[header.key] }}
								</slot>
							</td>
							<td v-if="$slots.actions || actions.length > 0" class="actions-cell">
								<slot name="actions" :item="item">
									<div class="action-buttons">
										<button
											v-for="action in actions"
											:key="action.name"
											@click.stop="handleAction(action.name, item)"
											:class="`btn-action btn-${action.color || 'primary'}`"
											:title="action.label"
										>
											<Icon :name="action.icon" />
										</button>
									</div>
								</slot>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div v-if="paginate && !loading" class="pagination-container" :style="paginationStyle">
				<div class="items-per-page">
					<label>Rows per page:</label>
					<select v-model.number="itemsPerPage" @change="handlePageSizeChange">
						<option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
					</select>
				</div>

				<div class="pagination-info">
					{{ paginationInfo }}
				</div>

				<div class="pagination-buttons">
					<button
						@click="goToFirstPage"
						:disabled="currentPage === 1"
						class="btn-page"
						title="First page"
					>
						<Icon name="mdi:chevron-double-left" />
					</button>
					<button
						@click="goToPreviousPage"
						:disabled="currentPage === 1"
						class="btn-page"
						title="Previous page"
					>
						<Icon name="mdi:chevron-left" />
					</button>
					<span class="page-number">{{ currentPage }} / {{ totalPages }}</span>
					<button
						@click="goToNextPage"
						:disabled="currentPage === totalPages"
						class="btn-page"
						title="Next page"
					>
						<Icon name="mdi:chevron-right" />
					</button>
					<button
						@click="goToLastPage"
						:disabled="currentPage === totalPages"
						class="btn-page"
						title="Last page"
					>
						<Icon name="mdi:chevron-double-right" />
					</button>
				</div>
			</div>
		</GlassCard>
	</div>
</template>

<script setup>
import { useThemeIntegration } from '@/composables/useThemeIntegration'
import GlassCard from './GlassCard.vue'

const props = defineProps({
	headers: {
		type: Array,
		required: true
	},
	items: {
		type: Array,
		required: true
	},
	itemKey: {
		type: String,
		default: 'id'
	},
	searchable: {
		type: Boolean,
		default: true
	},
	searchPlaceholder: {
		type: String,
		default: 'Search...'
	},
	selectable: {
		type: Boolean,
		default: false
	},
	paginate: {
		type: Boolean,
		default: true
	},
	itemsPerPageProp: {
		type: Number,
		default: 10
	},
	pageSizes: {
		type: Array,
		default: () => [5, 10, 25, 50, 100]
	},
	loading: {
		type: Boolean,
		default: false
	},
	actions: {
		type: Array,
		default: () => []
	},
	serverSide: {
		type: Boolean,
		default: false
	},
	totalItems: {
		type: Number,
		default: 0
	}
})

const emit = defineEmits([
	'search',
	'sort',
	'select',
	'action',
	'row-click',
	'page-change',
	'page-size-change'
])

const { isGlassmorphism, getRGBColor, themeClasses } = useThemeIntegration()

// State
const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)
const itemsPerPage = ref(props.itemsPerPageProp)
const selectedItems = ref([])

// Computed
const totalColumns = computed(() => {
	let count = props.headers.length
	if (props.selectable) count++
	if (props.actions.length > 0) count++
	return count
})

const filteredItems = computed(() => {
	if (props.serverSide) return props.items

	if (!searchQuery.value) return props.items

	const query = searchQuery.value.toLowerCase()
	return props.items.filter(item => {
		return props.headers.some(header => {
			const value = item[header.key]
			return value && String(value).toLowerCase().includes(query)
		})
	})
})

const sortedItems = computed(() => {
	if (props.serverSide || !sortKey.value) return filteredItems.value

	const items = [...filteredItems.value]
	items.sort((a, b) => {
		const aVal = a[sortKey.value]
		const bVal = b[sortKey.value]

		if (aVal === bVal) return 0

		let comparison = 0
		if (typeof aVal === 'number' && typeof bVal === 'number') {
			comparison = aVal - bVal
		} else {
			comparison = String(aVal).localeCompare(String(bVal))
		}

		return sortOrder.value === 'asc' ? comparison : -comparison
	})

	return items
})

const totalPages = computed(() => {
	const total = props.serverSide ? props.totalItems : sortedItems.value.length
	return Math.ceil(total / itemsPerPage.value) || 1
})

const paginatedItems = computed(() => {
	if (!props.paginate || props.serverSide) return sortedItems.value

	const start = (currentPage.value - 1) * itemsPerPage.value
	const end = start + itemsPerPage.value
	return sortedItems.value.slice(start, end)
})

const paginationInfo = computed(() => {
	const total = props.serverSide ? props.totalItems : sortedItems.value.length
	const start = (currentPage.value - 1) * itemsPerPage.value + 1
	const end = Math.min(start + itemsPerPage.value - 1, total)
	return `${start}-${end} of ${total}`
})

const isAllSelected = computed(() => {
	return paginatedItems.value.length > 0 &&
		paginatedItems.value.every(item => isSelected(item))
})

const isSomeSelected = computed(() => {
	return selectedItems.value.length > 0 && !isAllSelected.value
})

// Styles
const headerStyle = computed(() => ({
	backgroundColor: isGlassmorphism.value ? 'rgba(255, 255, 255, 0.05)' : getRGBColor('secondary'),
	borderColor: getRGBColor('border')
}))

const inputStyle = computed(() => ({
	backgroundColor: isGlassmorphism.value ? 'rgba(255, 255, 255, 0.1)' : getRGBColor('card'),
	borderColor: getRGBColor('border'),
	color: getRGBColor('text')
}))

const bulkActionsStyle = computed(() => ({
	backgroundColor: isGlassmorphism.value ? 'rgba(102, 126, 234, 0.2)' : getRGBColor('primary'),
	color: isGlassmorphism.value ? getRGBColor('text') : 'rgb(255, 255, 255)'
}))

const paginationStyle = computed(() => ({
	backgroundColor: isGlassmorphism.value ? 'rgba(255, 255, 255, 0.05)' : getRGBColor('secondary'),
	borderColor: getRGBColor('border')
}))

// Methods
const handleSearch = () => {
	currentPage.value = 1
	emit('search', searchQuery.value)
}

const handleSort = (key) => {
	if (sortKey.value === key) {
		sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
	} else {
		sortKey.value = key
		sortOrder.value = 'asc'
	}
	emit('sort', { key: sortKey.value, order: sortOrder.value })
}

const getSortIcon = (key) => {
	if (sortKey.value !== key) return 'mdi:unfold-more-horizontal'
	return sortOrder.value === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'
}

const isSelected = (item) => {
	return selectedItems.value.some(selected => selected[props.itemKey] === item[props.itemKey])
}

const toggleSelect = (item) => {
	const index = selectedItems.value.findIndex(
		selected => selected[props.itemKey] === item[props.itemKey]
	)

	if (index > -1) {
		selectedItems.value.splice(index, 1)
	} else {
		selectedItems.value.push(item)
	}

	emit('select', selectedItems.value)
}

const toggleSelectAll = () => {
	if (isAllSelected.value) {
		selectedItems.value = []
	} else {
		selectedItems.value = [...paginatedItems.value]
	}
	emit('select', selectedItems.value)
}

const clearSelection = () => {
	selectedItems.value = []
	emit('select', selectedItems.value)
}

const handleAction = (actionName, item) => {
	emit('action', { action: actionName, item })
}

const handleRowClick = (item) => {
	emit('row-click', item)
}

const goToFirstPage = () => {
	currentPage.value = 1
	emit('page-change', currentPage.value)
}

const goToPreviousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--
		emit('page-change', currentPage.value)
	}
}

const goToNextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++
		emit('page-change', currentPage.value)
	}
}

const goToLastPage = () => {
	currentPage.value = totalPages.value
	emit('page-change', currentPage.value)
}

const handlePageSizeChange = () => {
	currentPage.value = 1
	emit('page-size-change', itemsPerPage.value)
}

// Watch for items changes
watch(() => props.items, () => {
	if (currentPage.value > totalPages.value) {
		currentPage.value = totalPages.value || 1
	}
})
</script>

<style scoped>
.data-table-wrapper {
	width: 100%;
}

.table-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	border-radius: 0.75rem 0.75rem 0 0;
	border: 1px solid;
	margin-bottom: -1px;
}

.search-container {
	position: relative;
	flex: 1;
	max-width: 400px;
}

.search-input {
	width: 100%;
	padding: 0.625rem 0.75rem 0.625rem 2.5rem;
	border: 1px solid;
	border-radius: 0.5rem;
	font-size: 0.875rem;
	transition: all 0.3s ease;
}

.search-input:focus {
	outline: none;
	border-color: rgb(var(--color-primary));
	box-shadow: 0 0 0 3px rgba(var(--color-primary) / 0.1);
}

.search-icon {
	position: absolute;
	left: 0.75rem;
	top: 50%;
	transform: translateY(-50%);
	color: rgb(var(--color-text) / 0.5);
	font-size: 1.25rem;
}

.actions-container {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

.bulk-actions-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.75rem 1rem;
	border-radius: 0.5rem;
	margin-bottom: 1rem;
	gap: 1rem;
}

.selected-count {
	font-weight: 600;
}

.btn-clear {
	padding: 0.5rem 1rem;
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 0.375rem;
	color: inherit;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-clear:hover {
	background: rgba(255, 255, 255, 0.3);
}

.table-container {
	overflow-x: auto;
}

.data-table {
	width: 100%;
	border-collapse: collapse;
}

.data-table thead {
	background-color: rgba(var(--color-secondary) / 0.5);
	border-bottom: 2px solid rgb(var(--color-border));
}

.data-table th {
	padding: 1rem;
	text-align: left;
	font-weight: 600;
	font-size: 0.875rem;
	color: rgb(var(--color-text));
	white-space: nowrap;
}

.data-table th.sortable {
	cursor: pointer;
	user-select: none;
}

.data-table th.sortable:hover {
	background-color: rgba(var(--color-primary) / 0.1);
}

.header-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.sort-icon {
	font-size: 1rem;
	opacity: 0.5;
}

.data-table tbody tr {
	border-bottom: 1px solid rgb(var(--color-border) / 0.5);
	transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
	background-color: rgba(var(--color-primary) / 0.05);
}

.data-table tbody tr.selected {
	background-color: rgba(var(--color-primary) / 0.1);
}

.data-table td {
	padding: 1rem;
	color: rgb(var(--color-text));
}

.checkbox-cell {
	width: 50px;
	text-align: center;
}

.actions-cell {
	width: 120px;
	text-align: center;
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
}

.btn-action {
	padding: 0.375rem 0.75rem;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.btn-action:hover {
	transform: scale(1.05);
}

.btn-primary {
	background-color: rgb(var(--color-primary));
	color: white;
}

.btn-danger {
	background-color: #EF4444;
	color: white;
}

.loading-cell,
.empty-cell {
	text-align: center;
	padding: 3rem;
}

.loading-spinner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	color: rgb(var(--color-text) / 0.6);
}

.spin {
	animation: spin 1s linear infinite;
	font-size: 2rem;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	color: rgb(var(--color-text) / 0.6);
}

.empty-icon {
	font-size: 3rem;
}

.pagination-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;
	border-top: 1px solid;
	gap: 1rem;
	flex-wrap: wrap;
}

.items-per-page {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
}

.items-per-page select {
	padding: 0.375rem 0.5rem;
	border: 1px solid rgb(var(--color-border));
	border-radius: 0.375rem;
	background-color: rgb(var(--color-card));
	color: rgb(var(--color-text));
	cursor: pointer;
}

.pagination-info {
	font-size: 0.875rem;
	color: rgb(var(--color-text) / 0.8);
}

.pagination-buttons {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.btn-page {
	padding: 0.375rem 0.5rem;
	border: 1px solid rgb(var(--color-border));
	border-radius: 0.375rem;
	background-color: rgb(var(--color-card));
	color: rgb(var(--color-text));
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
}

.btn-page:hover:not(:disabled) {
	background-color: rgb(var(--color-primary));
	color: white;
	border-color: rgb(var(--color-primary));
}

.btn-page:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.page-number {
	padding: 0 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
}

@media (max-width: 768px) {
	.table-header {
		flex-direction: column;
		align-items: stretch;
	}

	.search-container {
		max-width: none;
	}

	.pagination-container {
		flex-direction: column;
		gap: 1rem;
	}

	.data-table {
		font-size: 0.875rem;
	}

	.data-table th,
	.data-table td {
		padding: 0.75rem 0.5rem;
	}
}
</style>
