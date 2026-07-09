<template>
  <div class="space-y-6">
    <div class="flex flex-wrap justify-between items-center gap-4 bg-card/60 backdrop-blur-2xl border border-white/20 shadow-md rounded-[1.5rem] p-6">
      <div>
        <h2 class="text-xl font-bold text-text flex items-center gap-2">
          <Icon name="mdi:devices" class="text-primary w-6 h-6" /> Active Devices
        </h2>
        <p class="text-xs text-text opacity-60 mt-1">Review where you've logged in and manage your sessions.</p>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-card/60 border border-white/10 rounded-[2rem]">
      <div class="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
    </div>

    <div v-else-if="Object.keys(sessions).length === 0" class="text-center py-20 bg-card/60 backdrop-blur-xl border border-white/20 shadow-sm rounded-[2rem]">
      <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 flex items-center justify-center mx-auto mb-4 shadow-inner border border-white/10">
        <Icon name="mdi:history" class="w-10 h-10 text-primary opacity-60" />
      </div>
      <h3 class="text-2xl font-bold text-text mb-2">No Sessions Found</h3>
      <p class="text-text opacity-50 text-sm max-w-xs mx-auto">There are no recent sessions recorded for your account.</p>
    </div>

    <div v-else class="space-y-8">
      <div v-for="(groupSessions, dateLabel) in sessions" :key="dateLabel" class="space-y-4">
        <h3 class="text-sm font-bold uppercase tracking-widest text-text opacity-50 ml-2">
          {{ dateLabel }}
        </h3>
        
        <div class="grid grid-cols-1 gap-4">
          <div v-for="session in groupSessions" :key="session.id" 
               class="backdrop-blur-xl border shadow-sm rounded-[1.5rem] p-6 relative group hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500"
               :class="session.is_active ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)] bg-gradient-to-br from-card/80 to-emerald-500/10' : 'bg-card/60 border-white/20'">
        
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          
          <div class="flex items-start gap-4">
            <div class="mt-1 w-14 h-14 rounded-2xl bg-gradient-to-tr flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500"
                 :class="session.is_active ? 'from-green-500/20 to-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'from-indigo-500/10 to-cyan-500/10 text-primary border border-white/10'">
              <Icon :name="getDeviceIcon(session.device)" class="w-7 h-7" />
            </div>
            
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <h3 class="font-bold text-text">{{ getBrowserName(session.device) }}</h3>
                <span v-if="session.is_active" class="flex items-center gap-1.5 text-[9px] font-black tracking-widest bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Current Session
                </span>
              </div>
              
              <div class="text-sm text-text flex flex-col gap-1 mt-2">
                <p class="flex items-center gap-2 opacity-70"><Icon name="mdi:map-marker-outline" class="w-4 h-4" /> {{ session.location || 'Unknown location' }}</p>
                <p class="flex items-center gap-2 opacity-70"><Icon name="mdi:clock-time-four-outline" class="w-4 h-4" /> Logged in: <span class="font-medium opacity-100">{{ formatDate(session.login_time) }}</span></p>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-start sm:items-end p-4 rounded-xl shrink-0 transition-all duration-500 group-hover:shadow-inner"
               :class="session.is_active ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-background/40 border border-border/50 group-hover:border-primary/30 group-hover:bg-primary/5'">
            <span class="text-[10px] font-bold uppercase tracking-widest text-text opacity-50 mb-1">Duration</span>
            <span class="text-lg font-extrabold" :class="session.is_active ? 'text-emerald-500' : 'text-primary'">
              {{ session.duration || 'Unknown' }}
            </span>
          </div>
          
        </div>
      </div>
    </div>
  </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const loading = ref(true)
const sessions = ref({})

const fetchSessions = async () => {
  try {
    const res = await api('/api/user/sessions')
    sessions.value = res.data || {}
  } catch (error) {
    console.error("Failed to fetch sessions", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSessions()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown time'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

const getBrowserName = (userAgent) => {
  if (!userAgent) return 'Unknown Device'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('SamsungBrowser')) return 'Samsung Internet'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  if (userAgent.includes('Trident') || userAgent.includes('MSIE')) return 'Internet Explorer'
  if (userAgent.includes('Edge') || userAgent.includes('Edg')) return 'Microsoft Edge'
  if (userAgent.includes('Chrome')) return 'Google Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  return 'Unknown Browser'
}

const getDeviceIcon = (userAgent) => {
  if (!userAgent) return 'mdi:help-network-outline'
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    return 'mdi:cellphone'
  }
  if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
    return 'mdi:tablet'
  }
  return 'mdi:laptop'
}
</script>
