<template>
  <div class="px-5">
    <h1 class="pt-10">User Page</h1>
    <UploadFileInput @update:inputValue="handleInputValue" @update:file="handleFile" />
    <!-- <ButtonTimePicker v-model="selectedTime" button-label="Pick a Time" /> -->

    <v-container>
      <v-time-picker v-model="time" label="Select Time"></v-time-picker>
      <v-btn @click="setTimeToNow">Set to Current Time</v-btn>
      <v-btn @click="clearTime">Clear Time</v-btn>
      <p>Selected Time: {{ time }}</p>
    </v-container>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'User',
  description: 'Learn more about our company',
  middleware: ['auth-role'],
  role: ['user', 'admin']
})
const time = ref(null)
const setTimeToNow = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  time.value = `${hours}:${minutes}`
}

const clearTime = () => {
  time.value = null
}
const handleInputValue = (value) => {
  console.log('Input value:', value)
}

const handleFile = (file) => {
  console.log('File:', file)
}
</script>