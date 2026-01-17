import useApiCall from '@/composables/useApiCall'

export default () => {
	const { apiCall } = useApiCall()

	return {
		/**
		 * Get list of employees with optional filters
		 * @param {Object} queryParams - Query parameters (page, per_page, search, department, role, status, sort_by)
		 * @returns {Promise} Employee list with pagination
		 */
		get_employee_list(queryParams = {}) {
			return apiCall('GET', '/business/employees', { params: queryParams })
		},

		/**
		 * Get single employee by ID
		 * @param {String|Number} employeeId - Employee ID
		 * @returns {Promise} Employee details
		 */
		get_employee(employeeId) {
			return apiCall('GET', `/business/employees/${employeeId}`)
		},

		/**
		 * Create new employee
		 * @param {Object} payload - Employee data
		 * @returns {Promise} Created employee
		 */
		create_employee(payload) {
			return apiCall('POST', '/business/employees', { data: payload })
		},

		/**
		 * Update existing employee
		 * @param {String|Number} employeeId - Employee ID
		 * @param {Object} payload - Updated employee data
		 * @returns {Promise} Updated employee
		 */
		update_employee(employeeId, payload) {
			return apiCall('PUT', `/business/employees/${employeeId}`, { data: payload })
		},

		/**
		 * Delete employee
		 * @param {String|Number} employeeId - Employee ID
		 * @returns {Promise} Deletion confirmation
		 */
		delete_employee(employeeId) {
			return apiCall('DELETE', `/business/employees/${employeeId}`)
		},

		/**
		 * Bulk delete employees
		 * @param {Array} employeeIds - Array of employee IDs
		 * @returns {Promise} Bulk deletion confirmation
		 */
		bulk_delete_employees(employeeIds) {
			return apiCall('POST', '/business/employees/bulk-delete', {
				data: { employee_ids: employeeIds }
			})
		},

		/**
		 * Bulk update employees
		 * @param {Array} employeeIds - Array of employee IDs
		 * @param {Object} updates - Fields to update
		 * @returns {Promise} Bulk update confirmation
		 */
		bulk_update_employees(employeeIds, updates) {
			return apiCall('POST', '/business/employees/bulk-update', {
				data: {
					employee_ids: employeeIds,
					updates
				}
			})
		},

		/**
		 * Upload employee profile image
		 * @param {String|Number} employeeId - Employee ID
		 * @param {File} file - Image file
		 * @returns {Promise} Upload confirmation with image URL
		 */
		upload_employee_image(employeeId, file) {
			const formData = new FormData()
			formData.append('image', file)

			return apiCall('POST', `/business/employees/${employeeId}/image`, {
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
		},

		/**
		 * Delete employee profile image
		 * @param {String|Number} employeeId - Employee ID
		 * @returns {Promise} Deletion confirmation
		 */
		delete_employee_image(employeeId) {
			return apiCall('DELETE', `/business/employees/${employeeId}/image`)
		},

		/**
		 * Get employee statistics
		 * @returns {Promise} Employee stats (total, by department, by role, etc.)
		 */
		get_employee_stats() {
			return apiCall('GET', '/business/employees/stats')
		},

		/**
		 * Export employees to Excel
		 * @param {Object} filters - Export filters
		 * @returns {Promise} File download
		 */
		export_employees(filters = {}) {
			return apiCall('GET', '/business/employees/export', {
				params: filters,
				responseType: 'blob'
			})
		}
	}
}
