<template>
	<div class="employees-page">
		<!-- Page Header -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">Employee Management</h1>
				<p class="page-subtitle">Manage your team and track employee information</p>
			</div>
			<div class="header-actions">
				<ExportButton
					:data="employeeStore.employees"
					:headers="tableHeaders"
					filename="all_employees"
					format="excel"
				/>
				<button @click="openAddDialog" class="btn btn-primary">
					<Icon name="mdi:plus" />
					<span>Add Employee</span>
				</button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="stats-grid">
			<StatsCard
				title="Total Employees"
				:value="stats.total || 0"
				icon="mdi:account-group"
				icon-color="#3B82F6"
				:trend="12"
				subtitle="Active workforce"
			/>
			<StatsCard
				title="Active Employees"
				:value="stats.active || 0"
				icon="mdi:account-check"
				icon-color="#10B981"
				:trend="5"
				subtitle="Currently working"
			/>
			<StatsCard
				title="Inactive Employees"
				:value="stats.inactive || 0"
				icon="mdi:account-off"
				icon-color="#EF4444"
				:trend="-2"
				subtitle="On leave or terminated"
			/>
			<StatsCard
				title="New This Month"
				:value="stats.new_this_month || 0"
				icon="mdi:account-plus"
				icon-color="#F59E0B"
				subtitle="Recent hires"
			/>
		</div>

		<!-- Filters -->
		<GlassCard class="filters-card">
			<div class="filters-container">
				<div class="filter-row">
					<FormField
						v-model="filters.department"
						type="select"
						label="Department"
						placeholder="All Departments"
						:options="departmentOptions"
						@change="applyFilters"
					/>

					<FormField
						v-model="filters.role"
						type="select"
						label="Role"
						placeholder="All Roles"
						:options="roleOptions"
						@change="applyFilters"
					/>

					<FormField
						v-model="filters.status"
						type="select"
						label="Status"
						placeholder="All Statuses"
						:options="statusOptions"
						@change="applyFilters"
					/>

					<button @click="clearFilters" class="btn btn-secondary clear-btn">
						<Icon name="mdi:filter-remove" />
						<span>Clear Filters</span>
					</button>
				</div>
			</div>
		</GlassCard>

		<!-- Employee Table -->
		<EmployeeTable
			@add-employee="openAddDialog"
			@edit-employee="openEditDialog"
			@view-employee="openViewDialog"
			@delete-employee="handleDelete"
			@bulk-delete="handleBulkDelete"
			@bulk-update="handleBulkUpdate"
		/>

		<!-- Add/Edit Dialog -->
		<Dialog
			v-model="showFormDialog"
			:title="editingEmployee ? 'Edit Employee' : 'Add New Employee'"
			maxWidth="900px"
			:show-button="false"
		>
			<template #content>
				<EmployeeForm
					:employee="editingEmployee"
					@submit="handleFormSubmit"
					@cancel="closeFormDialog"
				/>
			</template>
		</Dialog>

		<!-- View Dialog -->
		<Dialog v-model="showViewDialog" title="Employee Details" maxWidth="700px" :show-button="false">
			<template #content>
				<div v-if="viewingEmployee" class="employee-details">
					<div class="detail-header">
						<div v-if="viewingEmployee.image_url" class="detail-avatar">
							<img :src="viewingEmployee.image_url" :alt="viewingEmployee.full_name" />
						</div>
						<div v-else class="detail-avatar avatar-placeholder">
							{{ getInitials(viewingEmployee.first_name, viewingEmployee.last_name) }}
						</div>
						<div class="detail-info">
							<h3>{{ viewingEmployee.full_name || `${viewingEmployee.first_name} ${viewingEmployee.last_name}` }}</h3>
							<p>{{ viewingEmployee.designation || viewingEmployee.role }}</p>
							<StatusBadge :status="viewingEmployee.status.toLowerCase()" :label="viewingEmployee.status" />
						</div>
					</div>

					<div class="detail-grid">
						<div class="detail-item">
							<span class="detail-label">Employee ID:</span>
							<span class="detail-value">{{ viewingEmployee.employee_id }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Email:</span>
							<span class="detail-value">{{ viewingEmployee.email }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Phone:</span>
							<span class="detail-value">{{ viewingEmployee.phone }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Department:</span>
							<span class="detail-value">{{ viewingEmployee.department }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Role:</span>
							<span class="detail-value">{{ viewingEmployee.role }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Join Date:</span>
							<span class="detail-value">{{ formatDate(viewingEmployee.join_date) }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Salary:</span>
							<span class="detail-value">${{ formatNumber(viewingEmployee.salary) }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">Payment Type:</span>
							<span class="detail-value">{{ viewingEmployee.payment_type }}</span>
						</div>
					</div>

					<div v-if="viewingEmployee.address" class="detail-section">
						<h4>Address</h4>
						<p>{{ viewingEmployee.address }}</p>
						<p v-if="viewingEmployee.city || viewingEmployee.state">
							{{ viewingEmployee.city }}{{ viewingEmployee.city && viewingEmployee.state ? ', ' : '' }}{{ viewingEmployee.state }} {{ viewingEmployee.postal_code }}
						</p>
						<p v-if="viewingEmployee.country">{{ viewingEmployee.country }}</p>
					</div>

					<div v-if="viewingEmployee.notes" class="detail-section">
						<h4>Notes</h4>
						<p>{{ viewingEmployee.notes }}</p>
					</div>

					<div class="detail-actions">
						<button @click="editFromView" class="btn btn-primary">
							<Icon name="mdi:pencil" />
							<span>Edit Employee</span>
						</button>
						<button @click="handleDelete(viewingEmployee)" class="btn btn-danger">
							<Icon name="mdi:delete" />
							<span>Delete Employee</span>
						</button>
					</div>
				</div>
			</template>
		</Dialog>

		<!-- Delete Confirmation Dialog -->
		<Dialog
			v-model="showDeleteDialog"
			title="Delete Employee?"
			maxWidth="400px"
			buttonText="Delete"
			@confirm="confirmDelete"
		>
			<template #content>
				<div class="confirm-dialog">
					<Icon name="mdi:alert-circle-outline" class="confirm-icon" />
					<p>Are you sure you want to delete this employee? This action cannot be undone.</p>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEmployeeStore } from '@/stores/employeeStore'
import EmployeeTable from '@/components/Business/Employee/EmployeeTable.vue'
import EmployeeForm from '@/components/Business/Employee/EmployeeForm.vue'
import GlassCard from '@/components/Shared/GlassCard.vue'
import StatsCard from '@/components/Shared/StatsCard.vue'
import FormField from '@/components/Shared/FormField.vue'
import StatusBadge from '@/components/Shared/StatusBadge.vue'
import ExportButton from '@/components/Shared/ExportButton.vue'

definePageMeta({
	middleware: 'auth-role',
	layout: 'admin'
})

const employeeStore = useEmployeeStore()

// State
const showFormDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const editingEmployee = ref(null)
const viewingEmployee = ref(null)
const deletingEmployee = ref(null)

const filters = ref({
	department: '',
	role: '',
	status: ''
})

// Computed
const stats = computed(() => employeeStore.stats)

const tableHeaders = [
	{ key: 'employee_id', label: 'Employee ID' },
	{ key: 'full_name', label: 'Name' },
	{ key: 'email', label: 'Email' },
	{ key: 'phone', label: 'Phone' },
	{ key: 'role', label: 'Role' },
	{ key: 'department', label: 'Department' },
	{ key: 'join_date', label: 'Join Date' },
	{ key: 'salary', label: 'Salary' },
	{ key: 'status', label: 'Status' }
]

// Options
const departmentOptions = [
	{ value: '', label: 'All Departments' },
	{ value: 'Sales', label: 'Sales' },
	{ value: 'Marketing', label: 'Marketing' },
	{ value: 'Engineering', label: 'Engineering' },
	{ value: 'Design', label: 'Design' },
	{ value: 'Product', label: 'Product' },
	{ value: 'HR', label: 'Human Resources' },
	{ value: 'Finance', label: 'Finance' },
	{ value: 'Operations', label: 'Operations' },
	{ value: 'Customer Support', label: 'Customer Support' },
	{ value: 'IT', label: 'Information Technology' }
]

const roleOptions = [
	{ value: '', label: 'All Roles' },
	{ value: 'Manager', label: 'Manager' },
	{ value: 'Team Lead', label: 'Team Lead' },
	{ value: 'Senior Employee', label: 'Senior Employee' },
	{ value: 'Employee', label: 'Employee' },
	{ value: 'Intern', label: 'Intern' },
	{ value: 'Contractor', label: 'Contractor' }
]

const statusOptions = [
	{ value: '', label: 'All Statuses' },
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' },
	{ value: 'On Leave', label: 'On Leave' },
	{ value: 'Terminated', label: 'Terminated' }
]

// Methods
const loadData = async () => {
	await Promise.all([
		employeeStore.fetchEmployees(),
		employeeStore.fetchStats()
	])
}

const openAddDialog = () => {
	editingEmployee.value = null
	showFormDialog.value = true
}

const openEditDialog = (employee) => {
	editingEmployee.value = employee
	showFormDialog.value = true
}

const openViewDialog = (employee) => {
	viewingEmployee.value = employee
	showViewDialog.value = true
}

const closeFormDialog = () => {
	showFormDialog.value = false
	editingEmployee.value = null
}

const handleFormSubmit = async () => {
	closeFormDialog()
	await loadData()
}

const handleDelete = (employee) => {
	deletingEmployee.value = employee
	showDeleteDialog.value = true
}

const confirmDelete = async () => {
	if (deletingEmployee.value) {
		await employeeStore.deleteEmployee(deletingEmployee.value.id)
		showDeleteDialog.value = false
		showViewDialog.value = false
		deletingEmployee.value = null
		await loadData()
	}
}

const handleBulkDelete = async (employees) => {
	if (confirm(`Delete ${employees.length} employees?`)) {
		const employeeIds = employees.map(emp => emp.id)
		await employeeStore.bulkDeleteEmployees(employeeIds)
		await loadData()
	}
}

const handleBulkUpdate = async (employeeIds, updates) => {
	await employeeStore.bulkUpdateEmployees(employeeIds, updates)
	await loadData()
}

const editFromView = () => {
	editingEmployee.value = viewingEmployee.value
	showViewDialog.value = false
	showFormDialog.value = true
}

const applyFilters = () => {
	employeeStore.setDepartmentFilter(filters.value.department)
	employeeStore.setRoleFilter(filters.value.role)
	employeeStore.setStatusFilter(filters.value.status)
	employeeStore.fetchEmployees()
}

const clearFilters = () => {
	filters.value = {
		department: '',
		role: '',
		status: ''
	}
	employeeStore.clearFilters()
	employeeStore.fetchEmployees()
}

// Utility functions
const getInitials = (firstName, lastName) => {
	const first = firstName ? firstName.charAt(0) : ''
	const last = lastName ? lastName.charAt(0) : ''
	return `${first}${last}`.toUpperCase()
}

const formatDate = (dateString) => {
	if (!dateString) return '-'
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
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

// Lifecycle
onMounted(() => {
	loadData()
})
</script>

<style scoped>
.employees-page {
	padding: 2rem;
	max-width: 1600px;
	margin: 0 auto;
}

.page-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 2rem;
	gap: 2rem;
}

.header-content {
	flex: 1;
}

.page-title {
	font-size: 2rem;
	font-weight: 700;
	color: rgb(var(--color-text));
	margin: 0 0 0.5rem 0;
}

.page-subtitle {
	font-size: 1rem;
	color: rgb(var(--color-text) / 0.6);
	margin: 0;
}

.header-actions {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
}

.filters-card {
	margin-bottom: 2rem;
}

.filters-container {
	padding: 1rem;
}

.filter-row {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1rem;
	align-items: end;
}

.clear-btn {
	height: fit-content;
}

.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.25rem;
	border: none;
	border-radius: 0.5rem;
	font-weight: 500;
	font-size: 0.9375rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-primary {
	background-color: rgb(var(--color-primary));
	color: white;
}

.btn-secondary {
	background-color: rgb(var(--color-secondary));
	color: rgb(var(--color-text));
	border: 1px solid rgb(var(--color-border));
}

.btn-danger {
	background-color: #EF4444;
	color: white;
}

.btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.dialog-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
}

.dialog-header h2 {
	margin: 0;
	font-size: 1.5rem;
	color: rgb(var(--color-text));
}

.btn-close {
	padding: 0.5rem;
	background: transparent;
	border: none;
	cursor: pointer;
	border-radius: 0.375rem;
	transition: background-color 0.3s ease;
}

.btn-close:hover {
	background-color: rgba(var(--color-text) / 0.1);
}

.employee-details {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.detail-header {
	display: flex;
	align-items: center;
	gap: 1.5rem;
	padding-bottom: 2rem;
	border-bottom: 1px solid rgb(var(--color-border));
}

.detail-avatar {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	overflow: hidden;
}

.detail-avatar img {
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
	font-weight: 700;
	font-size: 1.5rem;
}

.detail-info h3 {
	margin: 0 0 0.5rem 0;
	font-size: 1.5rem;
	color: rgb(var(--color-text));
}

.detail-info p {
	margin: 0 0 0.75rem 0;
	color: rgb(var(--color-text) / 0.7);
}

.detail-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1.5rem;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.detail-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: rgb(var(--color-text) / 0.6);
}

.detail-value {
	font-size: 1rem;
	color: rgb(var(--color-text));
	font-weight: 500;
}

.detail-section {
	padding-top: 1.5rem;
	border-top: 1px solid rgb(var(--color-border));
}

.detail-section h4 {
	margin: 0 0 1rem 0;
	font-size: 1.125rem;
	color: rgb(var(--color-text));
}

.detail-section p {
	margin: 0.5rem 0;
	color: rgb(var(--color-text) / 0.8);
	line-height: 1.6;
}

.detail-actions {
	display: flex;
	gap: 1rem;
	padding-top: 1.5rem;
	border-top: 1px solid rgb(var(--color-border));
}

.confirm-dialog {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	text-align: center;
	padding: 2rem;
}

.confirm-icon {
	font-size: 4rem;
	color: #EF4444;
}

.confirm-dialog h3 {
	margin: 0;
	font-size: 1.5rem;
	color: rgb(var(--color-text));
}

.confirm-dialog p {
	margin: 0;
	color: rgb(var(--color-text) / 0.7);
}

.confirm-actions {
	display: flex;
	gap: 1rem;
	margin-top: 1rem;
}

.spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
	.employees-page {
		padding: 1rem;
	}

	.page-header {
		flex-direction: column;
	}

	.header-actions {
		width: 100%;
	}

	.stats-grid {
		grid-template-columns: 1fr;
	}

	.filter-row {
		grid-template-columns: 1fr;
	}

	.detail-header {
		flex-direction: column;
		text-align: center;
	}

	.detail-grid {
		grid-template-columns: 1fr;
	}

	.detail-actions {
		flex-direction: column;
	}

	.confirm-actions {
		flex-direction: column-reverse;
		width: 100%;
	}

	.btn {
		width: 100%;
		justify-content: center;
	}
}
</style>
