<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Branch Management</h1>
      <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Add Branch</v-btn>
    </div>

    <!-- Business Selector (Admins only) -->
    <div v-if="isAdmin && businessesList.length" class="mb-6 max-w-md">
      <label class="text-[10px] opacity-60 font-bold uppercase tracking-wider block mb-2">Filter by Business Context</label>
      <div class="relative">
        <select v-model="selectedBusinessId"
          class="w-full pl-5 pr-10 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all appearance-none cursor-pointer shadow-sm"
          style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border)); color: rgb(var(--color-text))">
          <option v-for="biz in businessesList" :key="biz.id" :value="biz.business_id || biz.id">
            {{ biz.business_name || biz.name }} ({{ biz.business_email || biz.email || 'No email' }})
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none opacity-50">
          <Icon name="mdi:chevron-down" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <v-row>
      <v-col v-for="branch in branches" :key="branch.branch_id || branch.id" cols="12" sm="6" lg="4">
        <v-card rounded="xl" class="pa-5 h-full flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start mb-3">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Icon name="mdi:store-outline" class="w-5 h-5 text-indigo-600" />
              </div>
              <div class="flex gap-1">
                <v-btn icon size="x-small" variant="text" @click="openEdit(branch)"><Icon name="mdi:pencil-outline" /></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="confirmDelete(branch)"><Icon name="mdi:trash-can-outline" /></v-btn>
              </div>
            </div>
            <h3 class="font-bold text-base mb-1">{{ branch.branch_name || branch.name }}</h3>
            
            <div v-if="branch.address && typeof branch.address === 'object'" class="text-slate-500 text-sm leading-relaxed mb-3">
              <p class="font-medium text-slate-700 dark:text-slate-200">{{ branch.address.address_line_1 }}<span v-if="branch.address.address_line_2">, {{ branch.address.address_line_2 }}</span></p>
              <p>{{ branch.address.city }}, {{ branch.address.state }} - {{ branch.address.zip_code }}</p>
              <p v-if="branch.address.landmark" class="text-xs opacity-75">Landmark: {{ branch.address.landmark }}</p>
              <p class="text-xs opacity-80 font-bold uppercase mt-0.5">{{ branch.address.country }}</p>
              <p v-if="branch.address.latitude !== null && branch.address.longitude !== null" class="text-[10px] font-mono opacity-50 mt-1">📍 Lat: {{ branch.address.latitude }}, Lng: {{ branch.address.longitude }}</p>
            </div>
            <p v-else-if="branch.location" class="text-slate-500 text-sm mb-3">{{ branch.location }}</p>
            <p v-else-if="branch.address" class="text-slate-500 text-sm mb-3">{{ branch.address }}</p>
            <p v-else class="text-slate-400 italic text-sm mb-3">No address provided</p>
            
            <p class="text-slate-500 text-sm mt-1">📞 {{ branch.phone || '—' }}</p>
            <p class="text-slate-500 text-sm">✉ {{ branch.email || '—' }}</p>
          </div>
          <div class="mt-4">
            <v-chip :color="branch.is_active ? 'success' : 'default'" size="small">
              {{ branch.is_active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
      <v-col v-if="!loading && !branches.length" cols="12">
        <div class="text-center py-16 text-slate-400">
          <Icon name="mdi:store-off-outline" class="w-16 h-16 mx-auto mb-3" />
          <p>No branches yet. Add your first branch.</p>
        </div>
      </v-col>
    </v-row>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="640">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Branch</h2>
        <v-form @submit.prevent="save">
          <div class="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar mb-4">
            <v-row>
              <v-col cols="12"><v-text-field v-model="form.name" label="Branch Name *" variant="outlined" rounded="lg" :rules="[isRequired, noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.branch_code" label="Branch Code" variant="outlined" rounded="lg" :rules="[noLeadingSpace]" maxlength="20" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.postal_code" label="Postal Code *" variant="outlined" rounded="lg" :rules="[isRequired, isPincode]" maxlength="6" @input="form.postal_code = filterDigits(form.postal_code, 6)" /></v-col>
              <v-col cols="12"><v-text-field v-model="form.address" label="Address Line 1 *" variant="outlined" rounded="lg" :rules="[isRequired, noLeadingSpace]" maxlength="255" /></v-col>
              <v-col cols="12"><v-text-field v-model="form.address_line_2" label="Address Line 2" variant="outlined" rounded="lg" :rules="[noLeadingSpace]" maxlength="255" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.landmark" label="Landmark" variant="outlined" rounded="lg" :rules="[noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.city" label="City *" variant="outlined" rounded="lg" :rules="[isRequired, noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.state" label="State *" variant="outlined" rounded="lg" :rules="[isRequired, noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.country" label="Country *" variant="outlined" rounded="lg" :rules="[isRequired, noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.latitude" label="Latitude" type="number" step="any" variant="outlined" rounded="lg" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.longitude" label="Longitude" type="number" step="any" variant="outlined" rounded="lg" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.phone" label="Phone" variant="outlined" rounded="lg" :rules="[isPhone]" maxlength="10" @input="form.phone = filterDigits(form.phone, 10)" /></v-col>
              <v-col cols="6"><v-text-field v-model="form.email" label="Email" variant="outlined" rounded="lg" :rules="[isValidEmail, noLeadingSpace]" maxlength="100" /></v-col>
              <v-col cols="12"><v-text-field v-model="form.label" label="Address Label" variant="outlined" rounded="lg" :rules="[noLeadingSpace]" maxlength="50" /></v-col>
              
              <v-col cols="12" class="py-0">
                <p class="text-xs font-bold opacity-60 uppercase mb-2">Address Type Options</p>
                <div class="grid grid-cols-2 gap-2 mb-2 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200/50">
                  <v-checkbox v-model="form.is_default" label="Is Default" density="compact" hide-details />
                  <v-checkbox v-model="form.is_billing" label="Is Billing" density="compact" hide-details />
                  <v-checkbox v-model="form.is_home" label="Is Home" density="compact" hide-details />
                  <v-checkbox v-model="form.is_work" label="Is Work" density="compact" hide-details />
                  <v-checkbox v-model="form.is_other" label="Is Other" density="compact" hide-details />
                </div>
              </v-col>
              
              <v-col cols="12" class="pt-0"><v-switch v-model="form.is_active" label="Active" color="primary" hide-details /></v-col>
            </v-row>
          </div>
          <div class="flex gap-3 justify-end pt-3 border-t">
            <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">{{ editing ? 'Update' : 'Create' }}</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="380">
      <v-card rounded="xl" class="pa-6 text-center">
        <Icon name="mdi:alert-circle-outline" class="w-14 h-14 text-red-500 mx-auto mb-3" />
        <h3 class="font-bold text-lg mb-2">Delete Branch?</h3>
        <p class="text-slate-500 mb-5">Delete <strong>{{ deletingItem?.name }}</strong>?</p>
        <div class="flex gap-3 justify-center">
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" :loading="deleting" @click="doDelete">Delete</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { useAuthStore } from '~/stores/auth'
import { computed, ref, onMounted, watch } from 'vue'
import { useValidation } from '~/composables/useValidation'
import { noLeadingSpace, isPhone, isPincode, filterDigits } from '~/utils/validations'

definePageMeta({ title: 'Branch Management', middleware: ['auth-role'], layout: 'admin', role: ['ADMIN', 'BUSINESS_OWNER', 'BUSINESS_MEMBER'] })

const { required: isRequired, validEmail: isValidEmail } = useValidation()

const authStore = useAuthStore()
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const branches = ref([])

const getInitialForm = () => ({
  name: '',
  branch_code: '',
  phone: '',
  email: '',
  is_active: true,
  // Address fields:
  address: '',
  address_line_2: '',
  landmark: '',
  city: '',
  state: '',
  country: 'India',
  postal_code: '',
  latitude: '',
  longitude: '',
  is_default: false,
  is_billing: false,
  is_home: false,
  is_work: true,
  is_other: false,
  label: 'Branch Address'
})

const form = ref(getInitialForm())

// Business selector state for ADMIN
const isAdmin = computed(() => authStore.role === 'ADMIN')
const businessesList = ref([])
const selectedBusinessId = ref(null)

const fetch = async () => {
  if (!selectedBusinessId.value) {
    branches.value = []
    return
  }
  loading.value = true
  try {
    const { getBranches } = useBranches()
    const params = { business_id: selectedBusinessId.value }
    const res = await getBranches(params)
    const resData = res?.data?.items || res?.data?.data || res?.data || []
    branches.value = Array.isArray(resData) ? resData : (Array.isArray(res?.data) ? res.data : [])
  } catch (e) {
    console.error(e)
    toast.error('Failed to load branches')
  } finally {
    loading.value = false
  }
}

watch(selectedBusinessId, () => {
  fetch()
})

const openCreate = () => {
  editing.value = null
  form.value = getInitialForm()
  dialog.value = true
}

const openEdit = (item) => {
  editing.value = item
  const addressObj = item.address && typeof item.address === 'object' ? item.address : {}
  const addressStr = item.address && typeof item.address === 'string' ? item.address : (addressObj.address_line_1 || '')
  form.value = {
    name: item.branch_name || item.name || '',
    branch_code: item.branch_code || '',
    postal_code: addressObj.zip_code || addressObj.postal_code || item.postal_code || '',
    address: addressStr || item.location || '',
    address_line_2: addressObj.address_line_2 || '',
    landmark: addressObj.landmark || '',
    city: addressObj.city || item.city || '',
    state: addressObj.state || item.state || '',
    country: addressObj.country || 'India',
    latitude: addressObj.latitude !== undefined && addressObj.latitude !== null ? String(addressObj.latitude) : '',
    longitude: addressObj.longitude !== undefined && addressObj.longitude !== null ? String(addressObj.longitude) : '',
    phone: item.phone || item.contact_number || '',
    email: item.email || '',
    is_active: item.is_active !== undefined ? item.is_active : true,
    is_default: addressObj.is_default !== undefined ? !!addressObj.is_default : false,
    is_billing: addressObj.is_billing !== undefined ? !!addressObj.is_billing : false,
    is_home: addressObj.is_home !== undefined ? !!addressObj.is_home : false,
    is_work: addressObj.is_work !== undefined ? !!addressObj.is_work : true,
    is_other: addressObj.is_other !== undefined ? !!addressObj.is_other : false,
    label: addressObj.label || 'Branch Address'
  }
  dialog.value = true
}

const save = async () => {
  if (!selectedBusinessId.value) {
    return toast.error('No business context selected')
  }
  saving.value = true
  try {
    const { createBranch, updateBranch } = useBranches()

    const payload = {
      branch_name: form.value.name.trim(),
      branch_code: form.value.branch_code?.trim() || null,
      phone: form.value.phone?.trim() || null,
      email: form.value.email?.trim() || null,
      is_active: !!form.value.is_active,
      address: {
        address_line_1: form.value.address.trim(),
        address_line_2: form.value.address_line_2?.trim() || null,
        landmark: form.value.landmark?.trim() || null,
        city: form.value.city.trim(),
        state: form.value.state.trim(),
        country: form.value.country?.trim() || 'India',
        zip_code: form.value.postal_code.trim(),
        latitude: form.value.latitude && String(form.value.latitude).trim() !== '' ? parseFloat(form.value.latitude) : null,
        longitude: form.value.longitude && String(form.value.longitude).trim() !== '' ? parseFloat(form.value.longitude) : null,
        is_default: !!form.value.is_default,
        is_billing: !!form.value.is_billing,
        is_home: !!form.value.is_home,
        is_work: !!form.value.is_work,
        is_other: !!form.value.is_other,
        label: form.value.label?.trim() || 'Branch Address'
      }
    }

    if (editing.value?.address?.address_id) {
      payload.address.address_id = editing.value.address.address_id
    }

    if (editing.value) {
      await updateBranch(editing.value.branch_id || editing.value.id, payload, selectedBusinessId.value)
      toast.success('Branch updated!')
    } else {
      await createBranch(payload, selectedBusinessId.value)
      toast.success('Branch created!')
    }
    dialog.value = false; fetch()
  } catch (e) {
    console.error(e)
    toast.error('Failed to save branch')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }
const doDelete = async () => {
  if (!selectedBusinessId.value) return
  deleting.value = true
  try {
    const { deleteBranch } = useBranches()
    await deleteBranch(deletingItem.value.id, selectedBusinessId.value)
    toast.success('Branch deleted!'); deleteDialog.value = false; fetch()
  } catch { toast.error('Failed to delete branch') }
  finally { deleting.value = false }
}

onMounted(async () => {
  if (isAdmin.value) {
    try {
      const { getBusinesses } = useAdminUsers()
      const res = await getBusinesses()
      businessesList.value = res?.data?.items || res?.data || res || []
      if (businessesList.value.length > 0) {
        selectedBusinessId.value = businessesList.value[0]?.business_id || businessesList.value[0]?.id
      }
    } catch (e) {
      console.error('Failed to pre-fetch businesses for Admin selector:', e)
    }
  } else {
    selectedBusinessId.value = authStore.user?.business_id || authStore.user?.business?.id
  }
  fetch()
})
</script>
