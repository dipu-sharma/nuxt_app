import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    isFilterSidebarOpen: false,
    startDate: null,
    endDate: null,
  }),
  actions: {
    toggleFilterSidebar() {
      this.isFilterSidebarOpen = !this.isFilterSidebarOpen;
    },
    openFilterSidebar() {
      this.isFilterSidebarOpen = true;
    },
    closeFilterSidebar() {
      this.isFilterSidebarOpen = false;
    },
    setDateRange(startDate, endDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    },
  },
});
