<template>
  <v-slide-x-reverse-transition>
    <div v-if="isOpen" class="fixed top-20 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg p-6 z-50">
      <h3 class="font-semibold text-lg mb-4">Filters</h3>

      <!-- Vuetify Date Inputs -->
      <v-date-input
        clearable
        v-model="startDate"
        variant="outlined"
        label="Start Date"
        color="blue"
        prepend-icon=""
        @update:modelValue="updateFilter"
      />
      <v-date-input
        clearable
        v-model="endDate"
        variant="outlined"
        label="End Date"
        color="blue"
        prepend-icon=""
        @update:modelValue="updateFilter"
      />

      <!-- Vuetify Autocomplete Inputs -->
      <v-autocomplete
        clearable
        v-model="projectName"
        label="Project Name"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="outlined"
        @update:modelValue="updateFilter"
      />
      <v-autocomplete
        clearable
        v-model="groupLeaderName"
        label="Group Leader Name"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="outlined"
        @update:modelValue="updateFilter"
      />
      <v-autocomplete
        clearable
        v-model="teamLeaderName"
        label="Team Leader Name"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="outlined"
        @update:modelValue="updateFilter"
      />
      <v-autocomplete
        clearable
        v-model="technicianName"
        label="Technician Name"
        :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
        variant="outlined"
        @update:modelValue="updateFilter"
      />
    </div>
  </v-slide-x-reverse-transition>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['updateFilters'])
const startDate = ref(null);
const endDate = ref(null);
const projectName = ref('');
const groupLeaderName = ref('');
const teamLeaderName = ref('');
const technicianName = ref('');
const updateFilter = () => {
  emit('updateFilters', {
    startDate: startDate.value,
    endDate: endDate.value,
    projectName: projectName.value,
    groupLeaderName: groupLeaderName.value,
    teamLeaderName: teamLeaderName.value,
    technicianName: technicianName.value
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
