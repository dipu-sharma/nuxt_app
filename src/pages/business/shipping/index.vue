<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Shipping Methods</h1>
        <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Add Method</v-btn>
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <v-row v-else>
        <v-col v-for="method in methods" :key="method.id" cols="12" sm="6">
          <v-card rounded="xl" class="pa-5">
            <div class="flex justify-between items-start mb-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Icon name="mdi:truck-fast-outline" class="w-5 h-5 text-blue-600" />
              </div>
              <div class="flex gap-1">
                <v-btn icon size="x-small" variant="text" @click="openEdit(method)"><Icon name="mdi:pencil-outline" /></v-btn>
                <v-btn icon size="x-small" variant="text" color="error" @click="confirmDelete(method)"><Icon name="mdi:trash-can-outline" /></v-btn>
              </div>
            </div>
            <h3 class="font-bold">{{ method.name }}</h3>
            <p class="text-slate-500 text-sm mt-1">{{ method.description }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-indigo-600 font-bold text-lg">
                {{ method.price === 0 ? 'Free' : `₹${method.price?.toLocaleString('en-IN')}` }}
              </span>
              <v-chip :color="method.is_active ? 'success' : 'default'" size="small">
                {{ method.is_active ? 'Active' : 'Inactive' }}
              </v-chip>
            </div>
            <p class="text-xs text-slate-400 mt-2">Estimated: {{ method.estimated_days }} day(s)</p>
          </v-card>
        </v-col>
        <v-col v-if="!loading && !methods.length" cols="12">
          <div class="text-center py-16 text-slate-400">
            <Icon name="mdi:truck-outline" class="w-16 h-16 mx-auto mb-3" />
            <p>No shipping methods configured.</p>
          </div>
        </v-col>
      </v-row>

      <!-- Dialog -->
      <v-dialog v-model="dialog" max-width="480">
        <v-card rounded="xl" class="pa-6">
          <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Add' }} Shipping Method</h2>
          <v-form @submit.prevent="save">
            <v-text-field v-model="form.name" label="Name" variant="outlined" rounded="lg" class="mb-3"
              :rules="[v => !!v || 'Required']" />
            <v-textarea v-model="form.description" label="Description" variant="outlined" rounded="lg" rows="2" class="mb-3" />
            <v-row>
              <v-col cols="6">
                <v-text-field v-model.number="form.price" label="Price (₹)" type="number"
                  prefix="₹" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="6">
                <v-text-field v-model.number="form.estimated_days" label="Est. Days" type="number"
                  variant="outlined" rounded="lg" />
              </v-col>
            </v-row>
            <v-switch v-model="form.is_active" label="Active" color="primary" class="mb-3" />
            <div class="flex gap-3 justify-end">
              <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" :loading="saving">{{ editing ? 'Update' : 'Create' }}</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="380">
        <v-card rounded="xl" class="pa-6 text-center">
          <Icon name="mdi:truck-remove-outline" class="w-14 h-14 text-red-500 mx-auto mb-3" />
          <h3 class="font-bold text-lg mb-2">Delete Shipping Method?</h3>
          <p class="text-slate-500 mb-5">Delete <strong>{{ deletingItem?.name }}</strong>?</p>
          <div class="flex gap-3 justify-center">
            <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" :loading="deleting" @click="doDelete">Delete</v-btn>
          </div>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
definePageMeta({ title: 'Shipping Methods', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const methods = ref([])
const form = ref({ name: '', description: '', price: 0, estimated_days: 3, is_active: true })

const fetch = async () => {
  loading.value = true
  try {
    const { getShippingMethods } = useShipping()
    const res = await getShippingMethods()
    methods.value = res?.data?.items || res?.data || []
  } catch { toast.error('Failed to load shipping methods') }
  finally { loading.value = false }
}

const openCreate = () => { editing.value = null; form.value = { name: '', description: '', price: 0, estimated_days: 3, is_active: true }; dialog.value = true }
const openEdit = (item) => { editing.value = item; form.value = { ...item }; dialog.value = true }

const save = async () => {
  saving.value = true
  try {
    const { createShippingMethod, updateShippingMethod } = useShipping()
    if (editing.value) { await updateShippingMethod(editing.value.id, form.value); toast.success('Updated!') }
    else { await createShippingMethod(form.value); toast.success('Created!') }
    dialog.value = false; fetch()
  } catch { toast.error('Failed to save') }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }
const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteShippingMethod } = useShipping()
    await deleteShippingMethod(deletingItem.value.id)
    toast.success('Deleted!'); deleteDialog.value = false; fetch()
  } catch { toast.error('Failed to delete') }
  finally { deleting.value = false }
}

onMounted(fetch)
</script>
