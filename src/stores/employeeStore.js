import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import employeeApi from '@/api/employeeApi'
import { toast } from 'vue3-toastify'

export const useEmployeeStore = defineStore('employee', () => {
	const api = employeeApi()

	// State
	const employees = ref([])
	const currentEmployee = ref(null)
	const loading = ref(false)
	const saving = ref(false)
	const deleting = ref(false)

	// Pagination
	const currentPage = ref(1)
	const perPage = ref(10)
	const totalEmployees = ref(0)
	const totalPages = ref(0)

	// Filters
	const searchQuery = ref('')
	const selectedDepartment = ref('')
	const selectedRole = ref('')
	const selectedStatus = ref('')
	const sortBy = ref('created_at')
	const sortOrder = ref('desc')

	// Statistics
	const stats = ref({
		total: 0,
		active: 0,
		inactive: 0,
		by_department: {},
		by_role: {}
	})

	// Computed
	const hasEmployees = computed(() => employees.value.length > 0)

	const activeFilters = computed(() => {
		const filters = {}
		if (searchQuery.value) filters.search = searchQuery.value
		if (selectedDepartment.value) filters.department = selectedDepartment.value
		if (selectedRole.value) filters.role = selectedRole.value
		if (selectedStatus.value) filters.status = selectedStatus.value
		return filters
	})

	const queryParams = computed(() => ({
		page: currentPage.value,
		per_page: perPage.value,
		search: searchQuery.value,
		department: selectedDepartment.value,
		role: selectedRole.value,
		status: selectedStatus.value,
		sort_by: sortBy.value,
		sort_order: sortOrder.value,
		is_paginate: true
	}))

	// Actions
	async function fetchEmployees(params = {}) {
		loading.value = true
		try {
			const mergedParams = { ...queryParams.value, ...params }
			const response = await api.get_employee_list(mergedParams)

			if (response && response.data) {
				employees.value = response.data.data || response.data
				totalEmployees.value = response.data.total || 0
				currentPage.value = response.data.current_page || 1
				totalPages.value = response.data.last_page || 1
				perPage.value = response.data.per_page || 10
			}

			return response
		} catch (error) {
			console.error('Error fetching employees:', error)
			toast.error('Failed to load employees')
			throw error
		} finally {
			loading.value = false
		}
	}

	async function fetchEmployee(employeeId) {
		loading.value = true
		try {
			const response = await api.get_employee(employeeId)
			currentEmployee.value = response.data
			return response
		} catch (error) {
			console.error('Error fetching employee:', error)
			toast.error('Failed to load employee details')
			throw error
		} finally {
			loading.value = false
		}
	}

	async function createEmployee(employeeData) {
		saving.value = true
		try {
			const response = await api.create_employee(employeeData)

			if (response && response.data) {
				// Add to list if on first page
				if (currentPage.value === 1) {
					employees.value.unshift(response.data)
					if (employees.value.length > perPage.value) {
						employees.value.pop()
					}
				}
				totalEmployees.value++

				toast.success('Employee created successfully')
				return response
			}
		} catch (error) {
			console.error('Error creating employee:', error)
			toast.error(error.response?.data?.message || 'Failed to create employee')
			throw error
		} finally {
			saving.value = false
		}
	}

	async function updateEmployee(employeeId, employeeData) {
		saving.value = true
		try {
			const response = await api.update_employee(employeeId, employeeData)

			if (response && response.data) {
				// Update in list
				const index = employees.value.findIndex(emp => emp.id === employeeId)
				if (index !== -1) {
					employees.value[index] = response.data
				}

				// Update current employee if viewing
				if (currentEmployee.value && currentEmployee.value.id === employeeId) {
					currentEmployee.value = response.data
				}

				toast.success('Employee updated successfully')
				return response
			}
		} catch (error) {
			console.error('Error updating employee:', error)
			toast.error(error.response?.data?.message || 'Failed to update employee')
			throw error
		} finally {
			saving.value = false
		}
	}

	async function deleteEmployee(employeeId) {
		deleting.value = true
		try {
			await api.delete_employee(employeeId)

			// Remove from list
			employees.value = employees.value.filter(emp => emp.id !== employeeId)
			totalEmployees.value--

			// Refresh if page becomes empty and not on first page
			if (employees.value.length === 0 && currentPage.value > 1) {
				currentPage.value--
				await fetchEmployees()
			}

			toast.success('Employee deleted successfully')
		} catch (error) {
			console.error('Error deleting employee:', error)
			toast.error(error.response?.data?.message || 'Failed to delete employee')
			throw error
		} finally {
			deleting.value = false
		}
	}

	async function bulkDeleteEmployees(employeeIds) {
		deleting.value = true
		try {
			await api.bulk_delete_employees(employeeIds)

			// Remove from list
			employees.value = employees.value.filter(
				emp => !employeeIds.includes(emp.id)
			)
			totalEmployees.value -= employeeIds.length

			// Refresh if page becomes empty
			if (employees.value.length === 0) {
				await fetchEmployees()
			}

			toast.success(`${employeeIds.length} employees deleted successfully`)
		} catch (error) {
			console.error('Error bulk deleting employees:', error)
			toast.error(error.response?.data?.message || 'Failed to delete employees')
			throw error
		} finally {
			deleting.value = false
		}
	}

	async function bulkUpdateEmployees(employeeIds, updates) {
		saving.value = true
		try {
			await api.bulk_update_employees(employeeIds, updates)

			// Refresh list to get updated data
			await fetchEmployees()

			toast.success(`${employeeIds.length} employees updated successfully`)
		} catch (error) {
			console.error('Error bulk updating employees:', error)
			toast.error(error.response?.data?.message || 'Failed to update employees')
			throw error
		} finally {
			saving.value = false
		}
	}

	async function uploadEmployeeImage(employeeId, file) {
		try {
			const response = await api.upload_employee_image(employeeId, file)

			if (response && response.data) {
				// Update employee image in list
				const index = employees.value.findIndex(emp => emp.id === employeeId)
				if (index !== -1 && response.data.image_url) {
					employees.value[index].image_url = response.data.image_url
				}

				// Update current employee if viewing
				if (currentEmployee.value && currentEmployee.value.id === employeeId) {
					currentEmployee.value.image_url = response.data.image_url
				}

				toast.success('Image uploaded successfully')
				return response
			}
		} catch (error) {
			console.error('Error uploading image:', error)
			toast.error('Failed to upload image')
			throw error
		}
	}

	async function deleteEmployeeImage(employeeId) {
		try {
			await api.delete_employee_image(employeeId)

			// Update employee in list
			const index = employees.value.findIndex(emp => emp.id === employeeId)
			if (index !== -1) {
				employees.value[index].image_url = null
			}

			// Update current employee if viewing
			if (currentEmployee.value && currentEmployee.value.id === employeeId) {
				currentEmployee.value.image_url = null
			}

			toast.success('Image deleted successfully')
		} catch (error) {
			console.error('Error deleting image:', error)
			toast.error('Failed to delete image')
			throw error
		}
	}

	async function fetchStats() {
		try {
			const response = await api.get_employee_stats()
			if (response && response.data) {
				stats.value = response.data
			}
			return response
		} catch (error) {
			console.error('Error fetching stats:', error)
			// Don't show error toast for stats, it's not critical
		}
	}

	async function exportEmployees(filters = {}) {
		try {
			const response = await api.export_employees(filters)

			// Create download link
			const url = window.URL.createObjectURL(new Blob([response]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', `employees_${Date.now()}.xlsx`)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			toast.success('Employees exported successfully')
		} catch (error) {
			console.error('Error exporting employees:', error)
			toast.error('Failed to export employees')
			throw error
		}
	}

	// Utility functions
	function setPage(page) {
		currentPage.value = page
	}

	function setPerPage(size) {
		perPage.value = size
		currentPage.value = 1
	}

	function setSearch(query) {
		searchQuery.value = query
		currentPage.value = 1
	}

	function setDepartmentFilter(department) {
		selectedDepartment.value = department
		currentPage.value = 1
	}

	function setRoleFilter(role) {
		selectedRole.value = role
		currentPage.value = 1
	}

	function setStatusFilter(status) {
		selectedStatus.value = status
		currentPage.value = 1
	}

	function setSort(field, order = 'asc') {
		sortBy.value = field
		sortOrder.value = order
		currentPage.value = 1
	}

	function clearFilters() {
		searchQuery.value = ''
		selectedDepartment.value = ''
		selectedRole.value = ''
		selectedStatus.value = ''
		currentPage.value = 1
	}

	function resetState() {
		employees.value = []
		currentEmployee.value = null
		currentPage.value = 1
		clearFilters()
	}

	return {
		// State
		employees,
		currentEmployee,
		loading,
		saving,
		deleting,
		currentPage,
		perPage,
		totalEmployees,
		totalPages,
		searchQuery,
		selectedDepartment,
		selectedRole,
		selectedStatus,
		sortBy,
		sortOrder,
		stats,

		// Computed
		hasEmployees,
		activeFilters,
		queryParams,

		// Actions
		fetchEmployees,
		fetchEmployee,
		createEmployee,
		updateEmployee,
		deleteEmployee,
		bulkDeleteEmployees,
		bulkUpdateEmployees,
		uploadEmployeeImage,
		deleteEmployeeImage,
		fetchStats,
		exportEmployees,

		// Utility
		setPage,
		setPerPage,
		setSearch,
		setDepartmentFilter,
		setRoleFilter,
		setStatusFilter,
		setSort,
		clearFilters,
		resetState
	}
})
