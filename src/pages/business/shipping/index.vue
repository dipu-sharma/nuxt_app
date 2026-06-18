<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Shipping Zones</h1>
          <p class="text-sm opacity-60 mt-1">Configure geographic shipping zones and rates for your business</p>
        </div>
        <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Add Shipping Zone</v-btn>
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <v-row v-else>
        <v-col v-for="zone in zones" :key="zone.id" cols="12">
          <v-card rounded="xl" class="pa-5" style="border: 1px solid rgb(var(--color-border))">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="font-bold text-lg flex items-center gap-2">
                  <Icon name="mdi:map-marker-radius-outline" class="text-blue-600 w-5 h-5" />
                  {{ zone.name }}
                </h3>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="text-xs font-semibold opacity-60">Regions:</span>
                  <v-chip v-for="c in zone.countries" :key="c" size="x-small" color="primary" variant="flat">{{ c }}</v-chip>
                  <span v-if="!zone.countries?.length" class="text-xs opacity-50">Rest of the World</span>
                </div>
              </div>
              <v-btn icon size="x-small" variant="text" color="error" @click="confirmDelete(zone)">
                <Icon name="mdi:trash-can-outline" class="w-5 h-5" />
              </v-btn>
            </div>

            <!-- Nested Shipping Methods -->
            <div class="mt-4 pt-3 border-t" style="border-color: rgb(var(--color-border))">
              <h4 class="text-sm font-semibold mb-2">Configured Shipping Methods & Rates</h4>
              <div v-if="!zone.methods?.length" class="text-xs opacity-50">No shipping methods configured in this zone.</div>
              <div v-else class="space-y-3">
                <div v-for="method in zone.methods" :key="method.id" 
                  class="flex items-center justify-between p-3 rounded-lg text-sm"
                  style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border))">
                  <div>
                    <p class="font-semibold">{{ method.name }} ({{ method.type }})</p>
                    <div class="text-xs opacity-60 mt-1">
                      <span v-for="rate in method.rates" :key="rate.id" class="mr-3">
                        🏷️ {{ rate.name }}: <strong style="color: rgb(var(--color-primary))">₹{{ rate.rate }}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col v-if="!loading && !zones.length" cols="12">
          <div class="text-center py-16 text-slate-400">
            <Icon name="mdi:truck-outline" class="w-16 h-16 mx-auto mb-3" />
            <p>No shipping zones configured yet.</p>
          </div>
        </v-col>
      </v-row>

      <!-- Create Dialog -->
      <v-dialog v-model="dialog" max-width="560">
        <v-card rounded="xl" class="pa-6">
          <h2 class="text-xl font-bold mb-4">Add Shipping Zone</h2>
          <v-form @submit.prevent="save">
            <v-text-field v-model="form.name" label="Zone Name (e.g. Domestic)" variant="outlined" rounded="lg" class="mb-3"
              :rules="[v => !!v || 'Required']" />
            
            <v-text-field v-model="form.countries" label="Countries (comma separated, e.g. IN, US)" variant="outlined" rounded="lg" class="mb-3"
              hint="Leave empty for rest of the world" persistent-hint />

            <v-text-field v-model="form.states" label="States (comma separated, e.g. MH, DL, CA)" variant="outlined" rounded="lg" class="mb-3" />

            <v-text-field v-model="form.zip_codes" label="Zip Codes (comma separated)" variant="outlined" rounded="lg" class="mb-4" />

            <div class="p-4 rounded-xl mb-4" style="background-color: rgb(var(--color-background)); border: 1px solid rgb(var(--color-border))">
              <h3 class="text-sm font-bold mb-3">Default Shipping Method</h3>
              
              <v-text-field v-model="form.methodName" label="Method Name" variant="outlined" rounded="lg" class="mb-3" />
              
              <v-select v-model="form.methodType" :items="['standard', 'express', 'overnight']" label="Method Type" variant="outlined" rounded="lg" class="mb-3" />
              
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="form.rateName" label="Rate Label (e.g., Flat Rate)" variant="outlined" rounded="lg" />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model.number="form.rate" label="Price (₹)" type="number" prefix="₹" variant="outlined" rounded="lg" />
                </v-col>
              </v-row>
            </div>

            <div class="flex gap-3 justify-end mt-4">
              <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" :loading="saving">Create Zone</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="380">
        <v-card rounded="xl" class="pa-6 text-center">
          <Icon name="mdi:map-marker-remove-outline" class="w-14 h-14 text-red-500 mx-auto mb-3" />
          <h3 class="font-bold text-lg mb-2">Delete Shipping Zone?</h3>
          <p class="text-slate-500 mb-5">Are you sure you want to delete zone <strong>{{ deletingItem?.name }}</strong>?</p>
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
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useShipping } from '~/composables/useShipping'

definePageMeta({ title: 'Shipping Zones', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const deletingItem = ref(null)
const zones = ref([])

const form = ref({
  name: '',
  countries: '',
  states: '',
  zip_codes: '',
  methodName: 'Standard Shipping',
  methodType: 'standard',
  rateName: 'Flat Rate',
  rate: 100
})

const fetch = async () => {
  loading.value = true
  try {
    const { getShippingZones } = useShipping()
    const res = await getShippingZones()
    zones.value = res?.data?.items || res?.data || []
  } catch {
    toast.error('Failed to load shipping zones')
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  form.value = {
    name: '',
    countries: '',
    states: '',
    zip_codes: '',
    methodName: 'Standard Shipping',
    methodType: 'standard',
    rateName: 'Flat Rate',
    rate: 100
  }
  dialog.value = true
}

const save = async () => {
  if (!form.value.name) return toast.error('Zone Name is required')
  saving.value = true
  try {
    const { createShippingZone } = useShipping()
    
    const parseCSV = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : []
    
    const payload = {
      name: form.value.name,
      countries: parseCSV(form.value.countries),
      states: parseCSV(form.value.states),
      zip_codes: parseCSV(form.value.zip_codes),
      methods: [
        {
          name: form.value.methodName,
          type: form.value.methodType,
          rates: [
            {
              name: form.value.rateName,
              rate: Number(form.value.rate)
            }
          ]
        }
      ]
    }
    
    await createShippingZone(payload)
    toast.success('Shipping zone created successfully')
    dialog.value = false
    fetch()
  } catch {
    toast.error('Failed to save shipping zone')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  deletingItem.value = item
  deleteDialog.value = true
}

const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteShippingZone } = useShipping()
    await deleteShippingZone(deletingItem.value.id)
    toast.success('Shipping zone deleted')
    deleteDialog.value = false
    fetch()
  } catch {
    toast.error('Failed to delete shipping zone')
  } finally {
    deleting.value = false
  }
}

onMounted(fetch)
</script>
