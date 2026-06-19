<template>
  <div class="p-6 bg-background text-text font-sans">
    
    <!-- Premium Header Section -->
    <div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-light tracking-tight text-text mb-2">
          User Management
        </h1>
        <p class="text-text opacity-70 text-sm font-medium tracking-wide">
          Manage registered customer profiles and business accounts.
        </p>
      </div>
    </div>

    <!-- Filters Section Card -->
    <div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] mb-8 flex flex-wrap gap-4 items-center">
      <!-- Search -->
      <div class="relative flex-1 min-w-[240px]">
        <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
        <input v-model="search" @input="debouncedSearch" @keyup.enter="loadUsers" type="text" placeholder="Search by email..."
          class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
      </div>

      <!-- Role Select dropdown -->
      <div class="relative w-full sm:w-56">
        <select v-model="filterRole" @change="loadUsers"
          class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer text-text">
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="BUSINESS_OWNER">Business Owner</option>
          <option value="BUSINESS_MEMBER">Business Member</option>
          <option value="USER">Customer</option>
        </select>
        <Icon name="mdi:chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-text opacity-40 pointer-events-none w-5 h-5" />
      </div>

      <!-- Search button -->
      <v-btn color="primary" rounded="pill" size="large" @click="loadUsers"
        class="px-8 text-none tracking-widest font-medium text-white shadow-sm w-full sm:w-auto" elevation="0">
        SEARCH
      </v-btn>
    </div>

    <!-- Main Users Table Card -->
    <div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
      
      <div class="overflow-x-auto rounded-[1.5rem] border border-border/50">
        <div v-if="loading" class="p-12 text-center">
          <v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
        </div>
        <div v-else-if="users.length === 0" class="p-12 text-center text-text opacity-50 text-sm font-medium">
          No users found matching your search.
        </div>
        
        <v-data-table v-else :headers="headers" :items="users" :loading="loading" items-per-page="10"
          class="custom-data-table" hover>
          
          <template #item.index="{ index }">
            <span class="opacity-50 font-medium text-xs">{{ index + 1 }}</span>
          </template>
          
          <template #item.user="{ item }">
            <div class="flex items-center gap-3 py-2">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-text font-bold bg-secondary">
                {{ (item.username || item.email_id || 'U')[0].toUpperCase() }}
              </div>
              <div>
                <p class="font-semibold text-text leading-snug">{{ item.username || 'Anonymous' }}</p>
                <p class="text-xs text-text opacity-50 font-medium">{{ item.email_id }}</p>
              </div>
            </div>
          </template>
          
          <template #item.user_type="{ item }">
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest" :class="roleClass(item.user_type)">
              {{ item.user_type?.replace('_', ' ') }}
            </span>
          </template>
          
          <template #item.mobile_number="{ item }">
            <span class="opacity-70 text-sm font-medium">{{ item.mobile_number || '—' }}</span>
          </template>
          
          <template #item.is_active="{ item }">
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              :class="item.is_active 
                ? 'bg-primary/10 text-primary' 
                : 'bg-red-500/10 text-red-550'">
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </span>
          </template>
          
          <template #item.created_at="{ item }">
            <span class="opacity-70 text-xs font-semibold uppercase tracking-wider">{{ formatDate(item.created_at) }}</span>
          </template>
          
          <template #item.actions="{ item }">
            <div class="py-1">
              <v-btn v-if="item.user_type === 'USER'" color="primary" variant="tonal" rounded="pill" size="small"
                class="text-none font-semibold px-4 tracking-wide shadow-sm" @click="promoteUser(item)">
                Promote
              </v-btn>
              <span v-else class="text-xs text-text opacity-40">—</span>
            </div>
          </template>
          
        </v-data-table>
      </div>

    </div>

    <!-- Promote Modal -->
    <v-dialog v-model="showPromoteModal" max-width="500" transition="dialog-bottom-transition">
      <v-card class="rounded-[2.5rem] bg-background border-0 shadow-2xl overflow-hidden">
        <div class="px-8 py-8 md:px-10 md:py-10">
          <h2 class="text-3xl font-light tracking-tight text-text mb-4">
            Promote Account
          </h2>
          <p class="text-text opacity-70 text-sm font-medium mb-6">
            Promoting user <strong class="text-text font-bold">{{ selectedUser?.email_id }}</strong> to Business Owner.
          </p>
          
          <div class="space-y-4 mb-8">
            <div>
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Name *</label>
              <input v-model="promoteForm.business_name" placeholder="Enter Business Name" required
                class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
            </div>

            <div>
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Email</label>
              <input v-model="promoteForm.business_email" placeholder="Enter Business Email"
                class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
            </div>

            <div>
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Business Phone</label>
              <input v-model="promoteForm.business_phone" placeholder="Enter Business Phone"
                class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
            </div>
          </div>

          <div class="flex gap-4 pt-4 border-t border-border">
            <v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="showPromoteModal = false">
              Cancel
            </v-btn>
            <v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" :disabled="promoting" @click="confirmPromote">
              {{ promoting ? 'PROMOTING...' : 'CONFIRM' }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  title: 'User Management',
  middleware: ['auth-role'],
  layout: 'admin',
  role: ['ADMIN'],
})

const loading = ref(false)
const promoting = ref(false)
const users = ref([])
const search = ref('')
const filterRole = ref('')
const showPromoteModal = ref(false)
const selectedUser = ref(null)
const promoteForm = ref({ business_name: '', business_email: '', business_phone: '' })

const headers = [
  { title: '#', key: 'index', width: 65, sortable: false },
  { title: 'User Account', key: 'user', sortable: true },
  { title: 'System Role', key: 'user_type', sortable: true },
  { title: 'Mobile', key: 'mobile_number', sortable: false },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Joined', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const roleClass = (role) => {
  const map = {
    ADMIN: 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    BUSINESS_OWNER: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    BUSINESS_MEMBER: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    USER: 'bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-400',
  }
  return map[role] || 'bg-stone-50 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : '—'

const debouncedSearch = useDebounceFn(() => { loadUsers() }, 400)

const loadUsers = async () => {
  loading.value = true
  try {
    const { getUserList } = useAdminUsers()
    const payload = {}
    if (search.value) payload.search = search.value
    if (filterRole.value) payload.user_type = filterRole.value
    const res = await getUserList(payload)
    users.value = res?.data?.items || res?.data || res || []
  } catch {
    toast.error('Failed to load users list')
  } finally {
    loading.value = false
  }
}

const promoteUser = (user) => {
  selectedUser.value = user
  promoteForm.value = { business_name: '', business_email: user.email_id, business_phone: user.mobile_number || '' }
  showPromoteModal.value = true
}

const confirmPromote = async () => {
  if (!promoteForm.value.business_name) return toast.error('Business name is required')
  promoting.value = true
  try {
    const { updateVendorDetails } = useAdminUsers()
    await updateVendorDetails({
      user_id: selectedUser.value.id,
      ...promoteForm.value,
    })
    toast.success('User promoted to Business Owner successfully!')
    showPromoteModal.value = false
    loadUsers()
  } catch {
    toast.error('Failed to promote user')
  } finally {
    promoting.value = false
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.custom-data-table {
  background: transparent !important;
}
:deep(.v-data-table-header__content) {
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  color: #a8a29e !important;
}
</style>
