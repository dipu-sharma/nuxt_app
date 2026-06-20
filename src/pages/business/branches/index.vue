<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Branch Management</h1>
      <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Add Branch</v-btn>
    </div>
    <v-row>
      <v-col v-for="branch in branches" :key="branch.id" cols="12" sm="6" lg="4">
        <v-card rounded="xl" class="pa-5 h-full">
          <div class="flex justify-between items-start mb-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Icon name="mdi:store-outline" class="w-5 h-5 text-indigo-600" />
            </div>
            <div class="flex gap-1">
              <v-btn icon size="x-small" variant="text" @click="openEdit(branch)"><Icon name="mdi:pencil-outline" /></v-btn>
              <v-btn icon size="x-small" variant="text" color="error" @click="confirmDelete(branch)"><Icon name="mdi:trash-can-outline" /></v-btn>
            </div>
          </div>
          <h3 class="font-bold text-base mb-1">{{ branch.name || branch.branch_name }}</h3>
          <p class="text-slate-500 text-sm">{{ branch.address || branch.location }}</p>
          <p class="text-slate-500 text-sm">{{ branch.city || '' }}{{ branch.state ? ', ' + branch.state : '' }}</p>
          <p class="text-slate-500 text-sm mt-1">📞 {{ branch.phone }}</p>
          <v-chip :color="branch.is_active ? 'success' : 'default'" size="small" class="mt-3">
            {{ branch.is_active ? 'Active' : 'Inactive' }}
          </v-chip>
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
    <v-dialog v-model="dialog" max-width="520">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Branch</h2>
        <v-form @submit.prevent="save">
          <v-row>
            <v-col cols="12"><v-text-field v-model="form.name" label="Branch Name" variant="outlined" rounded="lg" :rules="[v => !!v || 'Required']" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.branch_code" label="Branch Code" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.postal_code" label="Postal Code" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="12"><v-text-field v-model="form.address" label="Address" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.city" label="City" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.state" label="State" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.phone" label="Phone" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="6"><v-text-field v-model="form.email" label="Email" variant="outlined" rounded="lg" /></v-col>
            <v-col cols="12"><v-switch v-model="form.is_active" label="Active" color="primary" /></v-col>
          </v-row>
          <div class="flex gap-3 justify-end">
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

definePageMeta({ title: 'Branch Management', middleware: ['auth-role'], layout: 'admin', role: ['BUSINESS_OWNER'] })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const branches = ref([])
const form = ref({ name: '', branch_code: '', postal_code: '', address: '', city: '', state: '', phone: '', email: '', is_active: true })

const fetch = async () => {
  loading.value = true
  try {
    const { getBranches } = useBranches()
    const authStore = useAuthStore()
    const params = {}
    const businessId = authStore.user?.business_id || authStore.user?.business?.id
    if (businessId) {
      params.business_id = businessId
    }
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

const openCreate = () => { editing.value = null; form.value = { name: '', branch_code: '', postal_code: '', address: '', city: '', state: '', phone: '', email: '', is_active: true }; dialog.value = true }
const openEdit = (item) => {
  editing.value = item
  const addressObj = item.address && typeof item.address === 'object' ? item.address : {}
  const addressStr = item.address && typeof item.address === 'string' ? item.address : (addressObj.address_line1 || '')
  form.value = {
    name: item.name || item.branch_name || '',
    branch_code: item.branch_code || '',
    postal_code: addressObj.postal_code || item.postal_code || '',
    address: addressStr || item.location || '',
    city: addressObj.city || item.city || '',
    state: addressObj.state || item.state || '',
    phone: item.phone || item.contact_number || '',
    email: item.email || '',
    is_active: item.is_active !== undefined ? item.is_active : true
  }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    const { createBranch, updateBranch } = useBranches()
    const authStore = useAuthStore()
    const businessId = authStore.user?.business_id || authStore.user?.business?.id

    const payload = {
      branch_name: form.value.name,
      branch_code: form.value.branch_code || `BR-${form.value.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`,
      contact_number: form.value.phone || null,
      address: {
        address_line1: form.value.address || '',
        city: form.value.city || '',
        state: form.value.state || '',
        country: 'India',
        postal_code: form.value.postal_code || '277001',
        address_type: 'OFFICE'
      }
    }

    if (businessId) {
      payload.business_id = businessId
    }

    if (editing.value) {
      await updateBranch(editing.value.id, payload)
      toast.success('Branch updated!')
    } else {
      await createBranch(payload)
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
  deleting.value = true
  try {
    const { deleteBranch } = useBranches()
    await deleteBranch(deletingItem.value.id)
    toast.success('Branch deleted!'); deleteDialog.value = false; fetch()
  } catch { toast.error('Failed to delete branch') }
  finally { deleting.value = false }
}
onMounted(fetch)
</script>
