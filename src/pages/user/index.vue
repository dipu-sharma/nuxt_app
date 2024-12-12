<template>
  <div class="px-5">
    <h1 class="pt-10">User Page</h1>
    <UploadFileInput @update:inputValue="handleInputValue" @update:file="handleFile" />
  </div>
</template>

<script setup>
definePageMeta({
  title: 'User',
  description: 'Learn more about our company',
  middleware: ['auth-role'],
  role: ['user', 'admin']
})

const handleInputValue = (value) => {
  console.log('Input value:', value)
}

const handleFile = (file) => {
  console.log('File:', file)
}
</script>