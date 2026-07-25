import { ref } from 'vue'
import { toast } from 'vue3-toastify'

export const usePincode = () => {
  const loadingPincode = ref(false)

  const fetchCityState = async (pincode: string) => {
    // Only fetch if it's exactly 6 digits
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return null
    }

    loadingPincode.value = true
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
      const data = await response.json()

      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffice = data[0].PostOffice[0]
        return {
          city: postOffice.District || postOffice.Block || postOffice.Region || '',
          state: postOffice.State || '',
          address_line1: postOffice.Name || '',
          address_line2: postOffice.Block || postOffice.Division || postOffice.Circle || ''
        }
      } else {
        toast.warning('Invalid pincode or details not found.')
        return null
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error)
      toast.error('Failed to fetch pincode details.')
      return null
    } finally {
      loadingPincode.value = false
    }
  }

  return {
    loadingPincode,
    fetchCityState
  }
}
