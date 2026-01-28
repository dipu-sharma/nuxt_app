import useApiCall from '@/composables/useApiCall'

export default function useUpdateApi() {
  const { callApi } = useApiCall()

  const updateUser = async (payload) => {
    return callApi('put', '/user/me', payload, null, true)
  }

  const bulkUpdateEmployees = async (employeeIds, updates) => {
    const payload = { ids: employeeIds, updates: updates }
    return callApi('put', '/business/members/bulk-update', payload, null, true)
  }

  // Assuming admin can be updated via the same endpoint as user
  const updateAdmin = async (payload) => {
    return callApi('put', '/user/me', payload, null, true)
  }

  return {
    updateUser,
    bulkUpdateEmployees,
    updateAdmin
  }
}
