<template>
  <div class="relative group flex-shrink-0 w-max">
    <div
      class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-card bg-secondary/50 flex items-center justify-center overflow-hidden shadow-xl cursor-pointer transition-transform duration-200 hover:scale-105"
      @click="triggerFileInput"
    >
      <img
        v-if="profileImageUrl"
        :src="profileImageUrl"
        alt="Profile Picture"
        class="w-full h-full object-cover"
      />
      <Icon v-else :name="placeholderIcon" class="text-primary w-8 h-8 sm:w-10 sm:h-10" />

      <!-- Hover Overlay for Upload -->
      <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Icon v-if="loading" name="mdi:loading" class="w-6 h-6 text-white animate-spin" />
        <Icon v-else name="mdi:camera-plus" class="w-6 h-6 text-white" />
      </div>
    </div>
    
    <!-- Delete Button -->
    <button
      v-if="profileImageUrl && !loading"
      @click.stop="deleteImage"
      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100"
      title="Remove profile picture"
    >
      <Icon name="mdi:close" class="w-3.5 h-3.5" />
    </button>

    <!-- Hidden File Input -->
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      accept="image/*"
      @change="onFileChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useProfile } from '~/composables/useProfile'

const props = defineProps({
  placeholderIcon: {
    type: String,
    default: 'mdi:account-outline'
  }
})

const fileInput = ref(null)
const profileImageUrl = ref(null)
const loading = ref(false)
const hasExistingPicture = ref(false)

const { getProfilePicture, uploadProfilePicture, updateProfilePicture, deleteProfilePicture } = useProfile()

const triggerFileInput = () => {
  if (loading.value) return
  fileInput.value?.click()
}

const loadProfilePicture = async () => {
  loading.value = true
  try {
    const res = await getProfilePicture()
    if (res?.data?.url) {
      profileImageUrl.value = res.data.url
      hasExistingPicture.value = true
    } else {
      profileImageUrl.value = null
      hasExistingPicture.value = false
    }
  } catch (error) {
    if (error?.response?.status !== 404) {
      console.error('Failed to load profile picture', error)
    }
    profileImageUrl.value = null
    hasExistingPicture.value = false
  } finally {
    loading.value = false
  }
}

const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Basic validation
  if (!file.type.startsWith('image/')) {
    toast.error('Please select a valid image file.')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size exceeds 5MB limit.')
    return
  }

  loading.value = true
  try {
    if (hasExistingPicture.value) {
      const res = await updateProfilePicture(file)
      toast.success(res?.data?.message || 'Profile picture updated successfully.')
    } else {
      const res = await uploadProfilePicture(file)
      toast.success(res?.data?.message || 'Profile picture uploaded successfully.')
    }
    await loadProfilePicture() // Reload to get updated URL
  } catch (error) {
    toast.error(error?.data?.detail || 'Failed to save profile picture.')
  } finally {
    loading.value = false
    // Reset input
    if (fileInput.value) fileInput.value.value = ''
  }
}

const deleteImage = async () => {
  if (loading.value) return
  if (!confirm('Are you sure you want to remove your profile picture?')) return

  loading.value = true
  try {
    const res = await deleteProfilePicture()
    toast.success(res?.data?.message || 'Profile picture removed successfully.')
    profileImageUrl.value = null
    hasExistingPicture.value = false
  } catch (error) {
    toast.error(error?.data?.detail || 'Failed to delete profile picture.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfilePicture()
})
</script>
