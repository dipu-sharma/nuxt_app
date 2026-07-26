<template>
  <div class="py-2 px-4 w-full font-sans">
    <div v-if="status === 'CANCELED'" class="flex flex-row items-center justify-center gap-3 p-4 bg-red-50/50 rounded-2xl border border-red-100">
      <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <Icon name="mdi:close-circle" class="w-6 h-6 text-red-500" />
      </div>
      <div>
        <h3 class="text-md font-bold text-red-600 mb-0.5">Order Cancelled</h3>
        <p class="text-xs text-red-500/70">This order has been cancelled and will not be delivered.</p>
      </div>
    </div>

    <div v-else class="relative w-full pt-10 pb-6">
      <!-- Steps Container -->
      <div class="relative flex justify-between items-center w-full">
        
        <!-- Background Track Line -->
        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gray-200 rounded-full z-0"></div>
        
        <!-- Active Progress Line -->
        <div 
          class="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-primary rounded-full z-0 transition-all duration-1000 ease-in-out"
          :style="{ width: progressWidth }"
        ></div>

        <!-- Nodes -->
        <div 
          v-for="(step, index) in timelineSteps" 
          :key="step.status"
          class="relative z-10 flex flex-col items-center"
        >
          <!-- Label Text (Above) -->
          <div 
            class="absolute -top-7 text-[10px] md:text-[11px] font-bold whitespace-nowrap transition-colors duration-300"
            :class="[step.isCompleted || step.isActive ? 'text-primary' : 'text-gray-400']"
          >
            {{ step.title }}
          </div>

          <!-- Circle Node -->
          <div 
            class="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center transition-all duration-500 relative bg-white"
            :class="[
              step.isCompleted ? 'border-primary bg-primary border-[2px]' : 
              step.isActive ? 'border-primary border-[3px]' : 
              'border-gray-300 border-[2px]'
            ]"
          >
            <!-- Check Icon for completed -->
            <Icon v-if="step.isCompleted" name="mdi:check-bold" class="w-3 h-3 md:w-4 md:h-4 text-white" />
            
            <!-- Inner dot or active indicator -->
            <div v-else-if="step.isActive" class="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></div>
            
            <!-- Pulse ring for active -->
            <div v-if="step.isActive" class="absolute inset-[-4px] rounded-full border border-primary animate-ping opacity-40"></div>
          </div>
          
          <!-- Optional Timestamp below (if we have history) -->
          <div v-if="step.timestamp" class="absolute top-8 text-[9px] md:text-[10px] text-gray-400 whitespace-nowrap">
             {{ formatDate(step.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
  history: {
    type: Array,
    default: () => [],
  }
})

// Define the logical flow of statuses matching a typical 5-step horizontal flow
const flow = [
  { status: 'PENDING', title: 'Placed' },
  { status: 'ACCEPTED', title: 'Confirmed' },
  { status: 'PICKED', title: 'Packed' },
  { status: 'SHIPPED', title: 'Shipped' },
  { status: 'DELIVERED', title: 'Arrived' },
]

// Map intermediate statuses to standard ones for tracker display
const normalizedStatus = computed(() => {
  if (props.status === 'RECEIVED') return 'DELIVERED'
  if (props.status === 'ONWAY') return 'SHIPPED' // Map ONWAY to SHIPPED step
  return props.status
})

const currentStepIndex = computed(() => {
  return flow.findIndex(s => s.status === normalizedStatus.value)
})

const timelineSteps = computed(() => {
  return flow.map((step, index) => {
    // Find history entry for this status if available
    const historyEntry = props.history?.find(h => {
        if (h.status === step.status) return true;
        if (step.status === 'SHIPPED' && h.status === 'ONWAY') return true;
        if (step.status === 'DELIVERED' && h.status === 'RECEIVED') return true;
        return false;
    })
    
    // An item is completed if we passed it in the flow, OR if it has a history entry
    const isCompleted = index < currentStepIndex.value || (index === currentStepIndex.value && normalizedStatus.value === 'DELIVERED')
    const isActive = index === currentStepIndex.value && normalizedStatus.value !== 'DELIVERED'

    return {
      ...step,
      isCompleted,
      isActive,
      timestamp: historyEntry?.timestamp || null
    }
  })
})

const progressWidth = computed(() => {
  if (currentStepIndex.value < 0) return '0%'
  if (normalizedStatus.value === 'DELIVERED') return '100%'
  
  // Calculate percentage based on active index
  // Max steps = flow.length - 1
  const maxSteps = flow.length - 1
  const percentage = (currentStepIndex.value / maxSteps) * 100
  return `${percentage}%`
})

const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('MMM D')
}
</script>

<style scoped>
</style>
