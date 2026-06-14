<template>
	<form @submit.prevent="handleSubmit" class="employee-form">
		<div class="form-grid">
			<!-- Profile Image -->
			<div class="form-section full-width">
				<h4 class="section-title">Profile Image</h4>
				<ImageUploader
					v-model="formData.profile_image"
					:multiple="false"
					:max-size="2 * 1024 * 1024"
					preview-width="150px"
					preview-height="150px"
				/>
			</div>

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
						placeholder="employee@example.com"
						:required="true"
						:rules="[rules.required, rules.email]"
					/>

					<FormField
						v-model="formData.phone"
						type="tel"
						label="Phone Number"
						placeholder="+1 (555) 000-0000"
						:required="true"
						:rules="[rules.required, rules.phone]"
					/>
				</div>

				<FormField
					v-model="formData.date_of_birth"
					type="date"
					label="Date of Birth"
					placeholder="Select date"
				/>
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
						v-model="formData.department"
						type="select"
						label="Department"
						placeholder="Select department"
						:required="true"
						:options="departmentOptions"
						:rules="[rules.required]"
					/>
				</div>

				<div class="form-row">
					<FormField
						v-model="formData.designation"
						label="Designation"
						placeholder="e.g., Senior Developer"
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
						placeholder="0.00"
						prefix="$"
						helper-text="Enter monthly salary amount"
					/>

					<FormField
						v-model="formData.payment_type"
						type="select"
						label="Payment Type"
						:options="paymentTypeOptions"
					/>
				</div>
			</div>

			<!-- Address Information -->
			<div class="form-section full-width">
				<h4 class="section-title">Address Information</h4>
				<label>
					<input type="checkbox" v-model="updateAddress" />
					Update Address
				</label>
				<div v-if="updateAddress">
					<FormField
						v-model="formData.address"
						type="textarea"
						label="Street Address"
						placeholder="Enter street address"
						:rows="3"
					/>

					<div class="form-row">
						<FormField
							v-model="formData.city"
							label="City"
							placeholder="Enter city"
						/>

						<FormField
							v-model="formData.state"
							label="State/Province"
							placeholder="Enter state"
						/>
					</div>

					<div class="form-row">
						<FormField
							v-model="formData.postal_code"
							label="Postal Code"
							placeholder="Enter postal code"
						/>

						<FormField
							v-model="formData.country"
							label="Country"
							placeholder="Enter country"
						/>
					</div>
				</div>
			</div>

			<!-- Notes -->
			<div class="form-section full-width">
				<FormField
					v-model="formData.notes"
					type="textarea"
					label="Notes"
					placeholder="Add any additional notes..."
					:rows="4"
					:max-length="500"
				/>
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
				<span>{{ saving ? 'Saving...' : (editMode ? 'Update Employee' : 'Create Employee') }}</span>
			</button>
		</div>
	</form>
</template>

<script setup>
import FormField from '@/components/Shared/FormField.vue'
import ImageUploader from '@/components/Shared/ImageUploader.vue'
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

// Form data
const formData = ref({
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	date_of_birth: '',
	role: '',
	department: '',
	designation: '',
	salary: '',
	payment_type: 'Monthly',
	status: 'Active',
	address: '',
	city: '',
	state: '',
	postal_code: '',
	country: '',
	notes: '',
	profile_image: null
})

// Options
const roleOptions = [
     {value: 'BUSINESS_MEMBER', label: 'Member'},
	{ value: 'MANAGER', label: 'Manager' },
	{ value: 'TEAM_LEAD', label: 'Team Lead' },
	{ value: 'SENIOR_EMPLOYEE', label: 'Senior Employee' },
	{ value: 'EMPLOYEE', label: 'Employee' },
	{ value: 'INTERN', label: 'Intern' },
	{ value: 'CONTRACTOR', label: 'Contractor' }
]

const departmentOptions = [
	{ value: 'Sales', label: 'Sales' },
	{ value: 'E-Commerce', label: 'E-Commerce' },
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

const statusOptions = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' },
	{ value: 'On Leave', label: 'On Leave' },
	{ value: 'Terminated', label: 'Terminated' }
]

const paymentTypeOptions = [
	{ value: 'Monthly', label: 'Monthly' },
	{ value: 'Hourly', label: 'Hourly' },
	{ value: 'Contract', label: 'Contract' }
]

// Validation rules
const rules = {
	required: (value) => !!value || 'This field is required',
	email: (value) => {
		const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return !value || pattern.test(value) || 'Please enter a valid email address'
	},
	phone: (value) => {
		const pattern = /^[\d\s\-\+\(\)]+$/
		return !value || pattern.test(value) || 'Please enter a valid phone number'
	}
}

// Methods
const handleSubmit = async () => {
	saving.value = true

	try {
		const payload = { ...formData.value }

		if (!updateAddress.value) {
			delete payload.address
			delete payload.city
			delete payload.state
			delete payload.postal_code
			delete payload.country
		}

		// Remove null/undefined values
		Object.keys(payload).forEach(key => {
			if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
				delete payload[key]
			}
		})

		let employeeId = editMode.value ? props.employee.id : null;

		if (editMode.value) {
			await updateEmployee(employeeId, payload)
            toast.success('Employee updated successfully.')
		} else {
			const response = await createEmployee(payload)
            if(response.data){
                employeeId = response.data.id
            }
			toast.success('Employee created successfully.')
		}

		if (formData.value.profile_image && formData.value.profile_image instanceof File) {
			if (employeeId) {
				console.warn("Image upload is not implemented in the API yet.")
			}
		}

		emit('submit')
	} catch (error) {
		console.error('Error saving employee:', error)
	} finally {
		saving.value = false
	}
}

const loadEmployeeData = () => {
	if (props.employee) {
		editMode.value = true
		updateAddress.value = false // Reset checkbox
		Object.keys(formData.value).forEach(key => {
			if (props.employee[key] !== undefined) {
				formData.value[key] = props.employee[key]
			}
		})

		if (props.employee.image_url) {
			formData.value.profile_image = props.employee.image_url
		}
	} else {
        editMode.value = false
		updateAddress.value = true // Enable for new employees
        Object.keys(formData.value).forEach(key => {
            formData.value[key] = ''
        })
        formData.value.payment_type = 'Monthly'
        formData.value.status = 'Active'
        formData.value.profile_image = null
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
