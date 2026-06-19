<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Tax Configuration</h1>
          <p class="text-slate-500 text-sm mt-1">Configure and manage tax rates for your business</p>
        </div>
        <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="dialog = true">Add Tax Rate</v-btn>
      </div>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <div v-else>
        <!-- Tax Rates Table -->
        <div class="rounded-xl shadow overflow-hidden" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
          <table class="w-full text-sm">
            <thead style="background-color: rgb(var(--color-background))">
              <tr>
                <th class="px-4 py-3 text-left font-semibold opacity-70">Tax Name</th>
                <th class="px-4 py-3 text-left font-semibold opacity-70">Rate (%)</th>
                <th class="px-4 py-3 text-left font-semibold opacity-70">Default</th>
                <th class="px-4 py-3 text-left font-semibold opacity-70">ID</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rate in taxRates" :key="rate.id" class="border-t" style="border-color: rgb(var(--color-border))">
                <td class="px-4 py-3 font-medium">{{ rate.name }}</td>
                <td class="px-4 py-3 font-semibold text-indigo-600">{{ rate.rate }}%</td>
                <td class="px-4 py-3">
                  <v-chip v-if="rate.is_default" color="success" size="x-small" variant="flat">Default</v-chip>
                  <span v-else class="text-xs opacity-40">—</span>
                </td>
                <td class="px-4 py-3 opacity-60 font-mono">{{ rate.id }}</td>
              </tr>
              <tr v-if="taxRates.length === 0">
                <td colspan="4" class="text-center py-8 opacity-50">No tax rates configured yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Tax Rate Dialog -->
      <v-dialog v-model="dialog" max-width="460">
        <v-card rounded="xl" class="pa-6">
          <h2 class="text-xl font-bold mb-4">Add Tax Rate</h2>
          <v-form @submit.prevent="save">
            <v-text-field v-model="form.name" label="Tax Name (e.g. GST, VAT)" variant="outlined" rounded="lg" class="mb-3"
              :rules="[v => !!v || 'Required']" />
            
            <v-text-field v-model.number="form.rate" label="Rate (%)" type="number" step="0.01" variant="outlined" rounded="lg" suffix="%" class="mb-3"
              :rules="[v => v >= 0 || 'Cannot be negative']" />

            <v-switch v-model="form.is_default" label="Set as Default Tax Rate" color="primary" class="mb-4" />

            <div class="flex gap-3 justify-end">
              <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" :loading="saving">Create Tax Rate</v-btn>
            </div>
          </v-form>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { toast } from 'vue3-toastify'
import { useTax } from '~/composables/useTax'

definePageMeta({ title: 'Tax Configuration', middleware: ['auth-role'], layout: 'admin', role: ['BUSINESS_OWNER'] })

const loading = ref(false)
const saving = ref(false)
const dialog = ref(false)
const taxRates = ref([])
const form = ref({ name: '', rate: 18, is_default: false })

const fetchRates = async () => {
  loading.value = true
  try {
    const { getTaxRates } = useTax()
    const res = await getTaxRates()
    taxRates.value = res?.data?.items || res?.data || []
  } catch {
    toast.error('Failed to load tax rates')
  } finally {
    loading.value = false
  }
}

const save = async () => {
  if (!form.value.name || form.value.rate === '') return toast.error('Name and rate are required')
  saving.value = true
  try {
    const { createTaxRate } = useTax()
    await createTaxRate({
      name: form.value.name,
      rate: Number(form.value.rate),
      is_default: form.value.is_default
    })
    toast.success('Tax rate created successfully')
    dialog.value = false
    form.value = { name: '', rate: 18, is_default: false }
    fetchRates()
  } catch {
    toast.error('Failed to create tax rate')
  } finally {
    saving.value = false
  }
}

onMounted(fetchRates)
</script>
