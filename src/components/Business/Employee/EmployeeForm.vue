<template>
	<form @submit.prevent="handleSubmit" class="employee-form">
		<div class="form-grid">
			<!-- Personal Information -->
			<div class="form-section full-width">
				<h4 class="section-title">Personal Information</h4>
				<div class="form-row">
					<FormField
						v-model="formData.first_name"
						label="First Name"
						placeholder="Enter first name"
						:required="true"
						:rules="[rules.required]"
					/>
					<FormField
						v-model="formData.last_name"
						label="Last Name"
						placeholder="Enter last name"
						:required="true"
						:rules="[rules.required]"
					/>
				</div>
				<div class="form-row">
					<FormField
						v-model="formData.email"
						type="email"
						label="Email Address"
						placeholder="member@example.com"
						:required="true"
						:rules="[rules.required, rules.email]"
					/>
				</div>
				<div class="form-row">
					<FormField
						v-model="formData.dob"
						type="date"
						label="Date of Birth"
						placeholder="Select date"
					/>
				</div>
			</div>

			<!-- Employment Details -->
			<div class="form-section full-width">
				<h4 class="section-title">Employment Details</h4>
				<div class="form-row">
					<FormField
						v-model="formData.role"
						type="select"
						label="Role"
						placeholder="Select role"
						:required="true"
						:options="roleOptions"
						:rules="[rules.required]"
					/>
					<FormField
						v-model="formData.status"
						type="select"
						label="Status"
						:required="true"
						:options="statusOptions"
						:rules="[rules.required]"
					/>
				</div>
			</div>

			<!-- Salary Information -->
			<div class="form-section full-width">
				<h4 class="section-title">Salary Information</h4>
				<div class="form-row">
					<FormField
						v-model="formData.salary"
						type="number"
						label="Monthly Salary"
						placeholder="0"
						prefix="₹"
					/>
					<FormField
						v-model="formData.payment_type"
						type="select"
						label="Payment Type"
						:options="paymentTypeOptions"
					/>
				</div>
			</div>

		</div>

		<!-- Form Actions -->
		<div class="form-actions">
			<button
				type="button"
				@click="$emit('cancel')"
				class="btn btn-secondary"
				:disabled="saving"
			>
				Cancel
			</button>
			<button
				type="submit"
				class="btn btn-primary"
				:disabled="saving"
			>
				<Icon v-if="saving" name="mdi:loading" class="spin" />
				<span>{{ saving ? 'Saving...' : (editMode ? 'Update Member' : 'Create Member') }}</span>
			</button>
		</div>
	</form>
</template>

<script setup>
import FormField from '@/components/Shared/FormField.vue'
import { useEmployees } from '~/composables/useEmployees'
import { toast } from 'vue3-toastify'

const props = defineProps({
	employee: {
		type: Object,
		default: null
	}
})

const emit = defineEmits(['submit', 'cancel'])
const { createEmployee, updateEmployee } = useEmployees()

const saving = ref(false)
const editMode = ref(false)
const updateAddress = ref(false)

const formData = ref({
	first_name: '',
	middle_name: '',
	last_name: '',
	email: '',
	phone: '',
	dob: '',
	aadhar_number: '',
	pan_no: '',
	role: 'BUSINESS_MEMBER',
	salary: '',
	payment_type: '',
	status: 'Active',
	address_line_1: '',
	address_line_2: '',
	city: '',
	state: '',
	country: 'India',
	zip_code: '',
})

const roleOptions = [
	{ value: 'business_member', label: 'Member' },
	{ value: 'manager', label: 'Manager' },
	{ value: 'team_lead', label: 'Team Lead' },
	{ value: 'senior_employee', label: 'Senior Member' },
	{ value: 'employee', label: 'Member' },
	{ value: 'intern', label: 'Intern' },
	{ value: 'contractor', label: 'Contractor' }
]

const statusOptions = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' }
]

const paymentTypeOptions = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'hourly', label: 'Hourly' },
	{ value: 'contract', label: 'Contract' }
]

const rules = {
	required: (value) => !!value || 'This field is required',
	email: (value) => {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return !value || pattern.test(value) || 'Please enter a valid email address'
	},
}

const handleSubmit = async () => {
	saving.value = true
	try {
		const payload = {
			first_name: formData.value.first_name,
			last_name: formData.value.last_name,
			email: formData.value.email,
			role: formData.value.role,
			salary: formData.value.salary ? Number(formData.value.salary) : null,
			payment_type: formData.value.payment_type || null,
			dob: formData.value.dob || null,
		}

		if (editMode.value) {
			await updateEmployee(props.employee.id, payload)
			toast.success('Member updated successfully.')
		} else {
			await createEmployee(payload)
			toast.success('Member created successfully.')
		}

		emit('submit')
	} catch (error) {
		console.error('Error saving member:', error)
		toast.error(error?.response?.data?.message || 'Failed to save member')
	} finally {
		saving.value = false
	}
}

const loadEmployeeData = () => {
	if (props.employee) {
		editMode.value = true
		updateAddress.value = false

		const emp = props.employee
		const user = emp

		formData.value = {
			first_name: user.first_name || '',
			middle_name: user.middle_name || '',
			last_name: user.last_name || '',
			email: user.email || '',
			phone: user.phone || '',
			dob: user.dob || '',
			aadhar_number: user.aadhar_number || '',
			pan_no: user.pan_no || '',
			role: emp.role || 'business_member',
			salary: emp.salary || '',
			payment_type: emp.payment_type || '',
			status: emp.is_active ? 'Active' : 'Inactive',
			address_line_1: emp.address?.[0]?.address_line_1 || '',
			address_line_2: emp.address?.[0]?.address_line_2 || '',
			city: emp.address?.[0]?.city || '',
			state: emp.address?.[0]?.state || '',
			country: emp.address?.[0]?.country || 'India',
			zip_code: emp.address?.[0]?.zip_code || '',
		}
	} else {
		editMode.value = false
		updateAddress.value = true
		formData.value = {
			first_name: '',
			middle_name: '',
			last_name: '',
			email: '',
			phone: '',
			dob: '',
			aadhar_number: '',
			pan_no: '',
			role: 'business_member',
			salary: '',
			payment_type: '',
			status: 'Active',
			address_line_1: '',
			address_line_2: '',
			city: '',
			state: '',
			country: 'India',
			zip_code: '',
		}
	}
}

watch(() => props.employee, loadEmployeeData, { immediate: true })

onMounted(() => {
	loadEmployeeData()
})
</script>

<style scoped>
.employee-form {
	width: 100%;
}

.form-grid {
	display: grid;
	gap: 2rem;
}

.form-section {
	display: grid;
	gap: 1rem;
}

.form-section.full-width {
	grid-column: 1 / -1;
}

.section-title {
	font-size: 1.125rem;
	font-weight: 600;
	color: rgb(var(--color-text));
	margin: 0 0 1rem 0;
	padding-bottom: 0.5rem;
	border-bottom: 2px solid rgb(var(--color-border));
}

.form-row {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 1rem;
}

.update-address-toggle {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: rgb(var(--color-text));
	cursor: pointer;
	margin-bottom: 1rem;
}

.form-actions {
	display: flex;
	justify-content: flex-end;
	gap: 1rem;
	padding-top: 2rem;
	border-top: 1px solid rgb(var(--color-border));
	margin-top: 2rem;
}

.btn {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.75rem 1.5rem;
	border: none;
	border-radius: 0.5rem;
	font-weight: 500;
	font-size: 0.9375rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.btn-primary {
	background-color: rgb(var(--color-primary));
	color: white;
}

.btn-primary:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(var(--color-primary) / 0.3);
}

.btn-secondary {
	background-color: rgb(var(--color-secondary));
	color: rgb(var(--color-text));
	border: 1px solid rgb(var(--color-border));
}

.btn-secondary:hover:not(:disabled) {
	background-color: rgb(var(--color-border));
}

.spin {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
	.form-row {
		grid-template-columns: 1fr;
	}

	.form-actions {
		flex-direction: column-reverse;
	}

	.btn {
		width: 100%;
		justify-content: center;
	}
}
</style>
