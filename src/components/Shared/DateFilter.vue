<template>
    <div class="date-filter-container">
      <div class="filter-item">
            <v-select
                v-model="selectedRange"
                :items="dateRanges"
                label="Date Range"
                variant="outlined"
                color="blue"
                @update:modelValue="onRangeChange"
            ></v-select>
        </div>
        <div class="filter-item">
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
        </div>
        <div class="filter-item">
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
        </div>
    </div>
  </template>
  
  <script setup>
  
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
    const now = new Date(); // Get current time for consistency
    const startOfDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };
    const endOfDay = (date) => {
        const d = new Date(date);
        d.setHours(23, 59, 59, 999);
        return d;
    };

    switch (range) {
        case 'today':
            startDate.value = startOfDay(now);
            endDate.value = endOfDay(now);
            break;
        case 'yesterday':
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            startDate.value = startOfDay(yesterday);
            endDate.value = endOfDay(yesterday);
            break;
        case 'last7':
            const sevenDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
            startDate.value = startOfDay(sevenDaysAgo);
            endDate.value = endOfDay(now); // End of today
            break;
        case 'last30':
            const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
            startDate.value = startOfDay(thirtyDaysAgo);
            endDate.value = endOfDay(now); // End of today
            break;
        case 'thisMonth':
            startDate.value = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
            endDate.value = endOfDay(now); // End of today
            break;
        case 'lastMonth':
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            startDate.value = startOfDay(firstDayOfLastMonth);
            endDate.value = endOfDay(lastDayOfLastMonth);
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
  