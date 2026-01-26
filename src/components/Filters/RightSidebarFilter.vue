<template>
    <v-navigation-drawer
      v-model="isFilterSidebarOpen"
      location="right"
      temporary
      width="400"
      class="p-4"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Filter Options</h2>
        <v-btn icon @click="closeFilterSidebar">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <SharedDateFilter @update:filter="handleDateFilter" />
      <!-- Add other filters here as needed -->
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useFilterStore } from '~/stores/filterStore';
  
  const filterStore = useFilterStore();
  
  const isFilterSidebarOpen = computed({
    get: () => filterStore.isFilterSidebarOpen,
    set: (value) => {
      if (!value) {
        filterStore.closeFilterSidebar();
      }
    },
  });
  
  const closeFilterSidebar = () => {
    filterStore.closeFilterSidebar();
  };
  
  const handleDateFilter = (dateRange) => {
    filterStore.setDateRange(dateRange.startDate, dateRange.endDate);
  };
  </script>
  