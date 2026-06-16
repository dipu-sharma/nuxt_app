<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-2">Tax Configuration</h1>
      <p class="text-slate-500 text-sm mb-8">Configure tax rates applied to all orders.</p>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="d-flex mx-auto my-16" />

      <v-card v-else rounded="xl" class="pa-6">
        <v-form ref="taxForm" @submit.prevent="save">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.tax_rate" label="Tax Rate (%)" type="number"
                variant="outlined" rounded="lg" suffix="%" :rules="[v => v >= 0 || 'Cannot be negative']"
                hint="e.g. 18 for 18% GST" persistent-hint />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.tax_name" label="Tax Name" variant="outlined" rounded="lg"
                hint="e.g. GST, VAT, Sales Tax" persistent-hint />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.tax_number" label="Tax Number / GSTIN" variant="outlined" rounded="lg" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.tax_type" :items="['inclusive', 'exclusive']" label="Tax Type"
                variant="outlined" rounded="lg" hint="Inclusive = included in price, Exclusive = added on top" persistent-hint />
            </v-col>
            <v-col cols="12">
              <v-switch v-model="form.tax_enabled" label="Enable Taxes" color="primary" />
            </v-col>
          </v-row>

          <!-- Tax Preview -->
          <v-card v-if="form.tax_enabled" variant="tonal" color="primary" rounded="xl" class="pa-4 mb-6">
            <h3 class="font-semibold mb-3 text-sm">Preview for ₹1,000 order</h3>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between"><span>Subtotal</span><span>₹1,000</span></div>
              <div class="flex justify-between text-indigo-700">
                <span>{{ form.tax_name || 'Tax' }} ({{ form.tax_rate }}%)</span>
                <span>{{ form.tax_type === 'inclusive' ? 'Included' : `+₹${(1000 * form.tax_rate / 100).toFixed(0)}` }}</span>
              </div>
              <div class="flex justify-between font-bold border-t pt-1 mt-1">
                <span>Total</span>
                <span>₹{{ form.tax_type === 'inclusive' ? '1,000' : (1000 + 1000 * form.tax_rate / 100).toLocaleString('en-IN') }}</span>
              </div>
            </div>
          </v-card>

          <div class="flex gap-3 justify-end">
            <v-btn variant="outlined" @click="loadConfig">Reset</v-btn>
            <v-btn color="primary" size="large" rounded="lg" type="submit" :loading="saving">
              <Icon name="mdi:content-save-outline" class="mr-2" /> Save Configuration
            </v-btn>
          </div>
        </v-form>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
definePageMeta({ title: 'Tax Configuration', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const saving = ref(false)
const form = ref({ tax_rate: 18, tax_name: 'GST', tax_number: '', tax_type: 'exclusive', tax_enabled: true })

const loadConfig = async () => {
  loading.value = true
  try {
    const { getTaxConfig } = useTax()
    const res = await getTaxConfig()
    if (res?.data) Object.assign(form.value, res.data)
  } catch { /* Use defaults if no config exists */ }
  finally { loading.value = false }
}

const save = async () => {
  saving.value = true
  try {
    const { updateTaxConfig } = useTax()
    await updateTaxConfig(form.value)
    toast.success('Tax configuration saved!')
  } catch { toast.error('Failed to save tax configuration') }
  finally { saving.value = false }
}

onMounted(loadConfig)
</script>
