<template>
	<SharedDataTable
		:headers="headers"
		:items="employees"
		:item-key="'id'"
		:searchable="true"
		search-placeholder="Search employees by name, email, or department..."
		:selectable="true"
		:paginate="true"
		:items-per-page-prop="perPage"
		:page-sizes="[10, 25, 50, 100]"
		:loading="loading"
		:server-side="true"
		:total-items="totalItems"
		@search="handleSearch"
		@sort="handleSort"
		@select="handleSelect"
		@row-click="handleRowClick"
		@page-change="handlePageChange"
		@page-size-change="handlePageSizeChange"
		@action="handleAction"
	>
		<!-- Header Actions Slot -->
		<template #header-actions>
			<button @click="$emit('add-employee')" class="btn btn-primary">
				<Icon name="mdi:plus" />
				<span>Add Employee</span>
			</button>
		</template>

		<!-- Bulk Actions Slot -->
		<template #bulk-actions="{ selected }">
			<button @click="handleBulkStatusChange(selected, 'Active')" class="btn btn-success">
				<Icon name="mdi:check-circle" />
				<span>Activate</span>
			</button>
			<button @click="handleBulkStatusChange(selected, 'Inactive')" class="btn btn-warning">
				<Icon name="mdi:pause-circle" />
				<span>Deactivate</span>
			</button>
			<button @click="handleBulkDelete(selected)" class="btn btn-danger">
				<Icon name="mdi:delete" />
				<span>Delete</span>
			</button>
			<SharedExportButton
				:data="selected"
				:headers="headers"
				filename="selected_employees"
				format="excel"
				variant="secondary"
			/>
		</template>

		<!-- Custom Cell Templates -->
		<template #item.employee_id="{ value }">
			<span class="employee-id">{{ value }}</span>
		</template>

		<template #item.full_name="{ item }">
			<div class="employee-info">
				<div v-if="item.image_url" class="employee-avatar">
					<img :src="item.image_url" :alt="item.full_name" />
				</div>
				<div v-else class="employee-avatar avatar-placeholder">
					{{ getInitials(item.first_name, item.last_name) }}
				</div>
				<div class="employee-details">
					<div class="employee-name">{{ item.full_name || `${item.first_name} ${item.last_name}` }}</div>
					<div class="employee-email">{{ item.email || item.username }}</div>
				</div>
			</div>
		</template>

		<template #item.role="{ value }">
			<SharedStatusBadge :status="getRoleBadgeStatus(value)" :label="value" size="small" />
		</template>

		<template #item.department="{ value }">
			<span class="department-tag">{{ value }}</span>
		</template>

		<template #item.status="{ value }">
			<SharedStatusBadge
				:status="value === 'Active' ? 'active' : value === 'Inactive' ? 'inactive' : 'pending'"
				:label="value"
				size="small"
			/>
		</template>

		<template #item.joined_at="{ value }">
			<span class="date-text">{{ formatDate(value) }}</span>
		</template>

		<template #item.salary="{ value }">
			<span class="salary-text">${{ formatNumber(value) }}</span>
		</template>

		<template #item.phone="{ value }">
			<span class="phone-text">{{ value }}</span>
		</template>

		<!-- Actions Column -->
		<template #item.actions="{ item }">
			<div class="action-buttons">
				<button
					@click.stop="handleView(item)"
					class="btn-action btn-info"
					title="View Details"
				>
					<Icon name="mdi:eye" />
				</button>
				<button
					@click.stop="handleEdit(item)"
					class="btn-action btn-primary"
					title="Edit"
				>
					<Icon name="mdi:pencil" />
				</button>
				<button
					@click.stop="handleDelete(item)"
					class="btn-action btn-danger"
					title="Delete"
				>
					<Icon name="mdi:delete" />
				</button>
			</div>
		</template>

		<!-- Empty State -->
		<template #empty>
			<div class="empty-state">
				<Icon name="mdi:account-off-outline" class="empty-icon" />
				<p>No employees found</p>
				<button @click="$emit('add-employee')" class="btn btn-primary">
					<Icon name="mdi:plus" />
					<span>Add Your First Employee</span>
				</button>
			</div>
		</template>
	</SharedDataTable>
</template>

<script setup>

const emit = defineEmits([
	'add-employee',
	'edit-employee',
	'view-employee',
	'delete-employee',
	'bulk-delete',
	'bulk-update',
	'search',
	'sort',
	'page-change',
	'page-size-change',
])

defineProps({
	employees: {
		type: Array,
		default: () => [],
	},
	loading: {
		type: Boolean,
		default: false,
	},
	totalItems: {
		type: Number,
		default: 0,
	},
	perPage: {
		type: Number,
		default: 10,
	},
})


// Table headers
const headers = [
	{ key: 'employee_id', label: 'Employee ID', sortable: true },
	{ key: 'full_name', label: 'Name', sortable: true },
	{ key: 'role', label: 'Role', sortable: true },
	{ key: 'department', label: 'Department', sortable: true },
	{ key: 'phone', label: 'Phone', sortable: false },
	{ key: 'joined_at', label: 'Join Date', sortable: true },
	{ key: 'salary', label: 'Salary', sortable: true },
	{ key: 'status', label: 'Status', sortable: true },
	{ key: 'actions', label: 'Actions', sortable: false }
]

// Methods
const handleSearch = (query) => {
	emit('search', query)
}

const handleSort = (sortInfo) => {
	emit('sort', sortInfo)
}

const handleSelect = (selected) => {
	// Handle selection if needed
	console.log('Selected employees:', selected)
}

const handleRowClick = (item) => {
	emit('view-employee', item)
}

const handlePageChange = (page) => {
	emit('page-change', page)
}

const handlePageSizeChange = (size) => {
	emit('page-size-change', size)
}

const handleAction = ({ action, item }) => {
	if (action === 'edit') {
		handleEdit(item)
	} else if (action === 'delete') {
		handleDelete(item)
	}
}

const handleView = (employee) => {
	emit('view-employee', employee)
}

const handleEdit = (employee) => {
	emit('edit-employee', employee)
}

const handleDelete = (employee) => {
	emit('delete-employee', employee)
}

const handleBulkDelete = (employees) => {
	emit('bulk-delete', employees)
}

const handleBulkStatusChange = (employees, status) => {
	const employeeIds = employees.map(emp => emp.id)
	emit('bulk-update', { employeeIds, updates: { status } })
}

// Utility functions
const getInitials = (firstName, lastName) => {
	const first = firstName ? firstName.charAt(0) : ''
	const last = lastName ? lastName.charAt(0) : ''
	return `${first}${last}`.toUpperCase()
}

const getRoleBadgeStatus = (role) => {
	const roleMap = {
		'Manager': 'success',
		'Team Lead': 'info',
		'Senior Employee': 'default',
		'Employee': 'default',
		'Intern': 'warning',
		'Contractor': 'default'
	}
	return roleMap[role] || 'default'
}

const formatDate = (dateString) => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})
}

const formatNumber = (value) => {
	if (!value) return '0'
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(value)
}
</script>

<style scoped>
.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.625rem 1rem;
	border: none;
	border-radius: 0.5rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-primary {
	background-color: rgb(var(--color-primary));
	color: white;
}

.btn-success {
	background-color: #10B981;
	color: white;
}

.btn-warning {
	background-color: #F59E0B;
	color: white;
}

.btn-danger {
	background-color: #EF4444;
	color: white;
}

.btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.employee-id {
	font-family: monospace;
	font-weight: 600;
	color: rgb(var(--color-primary));
}

.employee-info {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.employee-avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
}

.employee-avatar img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.avatar-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-accent)));
	color: white;
	font-weight: 600;
	font-size: 0.875rem;
}

.employee-details {
	display: flex;
	flex-direction: column;
	gap: 0.125rem;
}

.employee-name {
	font-weight: 500;
	color: rgb(var(--color-text));
}

.employee-email {
	font-size: 0.8125rem;
	color: rgb(var(--color-text) / 0.6);
}

.department-tag {
	display: inline-block;
	padding: 0.25rem 0.75rem;
	background-color: rgb(var(--color-secondary));
	color: rgb(var(--color-text));
	border-radius: 0.375rem;
	font-size: 0.8125rem;
	font-weight: 500;
}

.date-text {
	color: rgb(var(--color-text) / 0.8);
	font-size: 0.875rem;
}

.salary-text {
	font-weight: 600;
	color: #10B981;
}

.phone-text {
	font-family: monospace;
	font-size: 0.875rem;
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
}

.btn-action {
	padding: 0.5rem;
	border: none;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: all 0.2s ease;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.btn-action:hover {
	transform: scale(1.1);
}

.btn-info {
	background-color: #3B82F6;
	color: white;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 3rem;
}

.empty-icon {
	font-size: 4rem;
	color: rgb(var(--color-text) / 0.3);
}

.empty-state p {
	font-size: 1.125rem;
	color: rgb(var(--color-text) / 0.6);
	margin: 0;
}
</style>
