<script setup>
import { ref, computed, watch } from 'vue'

// Define states and their corresponding cities
const states = ref([
  { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
  { name: 'Texas', cities: ['Houston', 'Austin', 'Dallas'] },
  { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa'] },
])

const selectedState = ref('')
const selectedCity = ref('')
const availableCities = ref([])

const firstName = ref('John')
const lastName = ref('Doe')

// Computed property to combine first and last name
const fullName = computed(() => `${firstName.value} ${lastName.value}`)

// Computed property with getter and setter
const uppercaseName = computed({
  get: () => fullName.value.toUpperCase(),
  set: (newValue) => {
    const names = newValue.split(' ')
    if (names.length >= 2) {
      firstName.value = names[0]
      lastName.value = names[1]
    }
  }
})

// Watch for changes in the selected state
watch(selectedState, (newState) => {
  const state = states.value.find((s) => s.name === newState)
  if (state) {
    availableCities.value = state.cities
    selectedCity.value = state.cities[0] // Automatically choose the first city
  } else {
    availableCities.value = []
    selectedCity.value = ''
  }
})
</script>

<template>
  <div>
    <p>
      Select a state:
      <select v-model="selectedState">
        <option value="">-- Choose a State --</option>
        <option v-for="state in states" :key="state.name" :value="state.name">
          {{ state.name }}
        </option>
      </select>
    </p>
    
    <p v-if="availableCities.length">
      Select a city:
      <select v-model="selectedCity">
        <option v-for="city in availableCities" :key="city" :value="city">
          {{ city }}
        </option>
      </select>
    </p>
  </div>
  <div>
    <p>First Name: <input v-model="firstName" /></p>
    <p>Last Name: <input v-model="lastName" /></p>
    <p>Full Name: {{ fullName }}</p>
    <p>Uppercase Name: <input v-model="uppercaseName" /></p>
  </div>
</template>
