<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { toast } from 'vue3-toastify'

const props = defineProps<{ productId: string | number }>()
const emit = defineEmits(['uploaded'])
const api = useApi()

const isUploading = ref(false)
const uploadedUrl = ref<string | null>(null)

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  const formData = new FormData()
  formData.append('file', file) // The key MUST be 'file'

  isUploading.value = true
  try {
    const response = await api(`/api/business/products/${props.productId}/images`, {
      method: 'POST',
      body: formData,
      // Nuxt's $fetch automatically sets the correct Content-Type 
      // boundary for FormData. DO NOT set Content-Type manually.
    })

    uploadedUrl.value = (response as any).data.url
    toast.success('Image uploaded successfully!')
    emit('uploaded', (response as any).data)
  } catch (error) {
    console.error('Upload failed:', error)
    toast.error('Image upload failed')
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="upload-container p-4 rounded-xl mt-4" style="border: 1px dashed rgb(var(--color-border)); background-color: rgb(var(--color-background))">
    <label class="block text-sm font-medium mb-2">Upload Product Image</label>
    <div class="flex items-center gap-4">
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/webp" 
        @change="handleFileUpload"
        :disabled="isUploading"
        class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 transition-opacity"
      />
      <div v-if="isUploading" class="text-sm opacity-60">Uploading...</div>
    </div>
    <div v-if="uploadedUrl" class="mt-4">
      <img :src="uploadedUrl" alt="Uploaded preview" class="w-32 h-32 object-cover rounded-lg shadow-sm" />
    </div>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: rgb(var(--color-primary));
}
</style>
