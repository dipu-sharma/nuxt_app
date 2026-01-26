<template>
    <div class="date-filter-container">
      <v-row>
        <v-col cols="12" md="4">
            <v-select
                v-model="selectedRange"
                :items="dateRanges"
                label="Date Range"
                variant="outlined"
                color="blue"
                @update:modelValue="onRangeChange"
            ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            clearable
            v-model="startDate"
            variant="outlined"
            label="Start Date"
            color="blue"
            prepend-icon=""
            @update:modelValue="updateFilter"
            :disabled="selectedRange !== 'custom'"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-date-input
            clearable
            v-model="endDate"
            variant="outlined"
            label="End Date"
            color="blue"
            prepend-icon=""
            @update:modelValue="updateFilter"
            :disabled="selectedRange !== 'custom'"
          />
        </v-col>
      </v-row>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    initialStartDate: {
      type: [Date, String],
      default: null,
    },
    initialEndDate: {
      type: [Date, String],
      default: null,
    },
  });
  
  const emit = defineEmits(['update:filter']);
  
  const startDate = ref(props.initialStartDate);
  const endDate = ref(props.initialEndDate);
  const selectedRange = ref('custom');

  const dateRanges = [
    { title: 'Today', value: 'today' },
    { title: 'Yesterday', value: 'yesterday' },
    { title: 'Last 7 Days', value: 'last7' },
    { title: 'Last 30 Days', value: 'last30' },
    { title: 'This Month', value: 'thisMonth' },
    { title: 'Last Month', value: 'lastMonth' },
    { title: 'Custom', value: 'custom' },
  ];
  
  const onRangeChange = (range) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (range) {
        case 'today':
            startDate.value = today;
            endDate.value = new Date();
            break;
        case 'yesterday':
            startDate.value = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            endDate.value = new Date(today.getTime() - 1);
            break;
        case 'last7':
            startDate.value = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
            endDate.value = new Date();
            break;
        case 'last30':
            startDate.value = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
            endDate.value = new Date();
            break;
        case 'thisMonth':
            startDate.value = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate.value = new Date();
            break;
        case 'lastMonth':
            startDate.value = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate.value = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'custom':
            startDate.value = null;
            endDate.value = null;
            break;
    }
    updateFilter();
  };

  const updateFilter = () => {
    emit('update:filter', {
      startDate: startDate.value,
      endDate: endDate.value,
    });
  };
  
  watch(() => [props.initialStartDate, props.initialEndDate], ([newStart, newEnd]) => {
    startDate.value = newStart;
    endDate.value = newEnd;
  });
  </script>
  
  <style scoped>
  .date-filter-container {
    padding: 1rem;
  }
  </style>
  