<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-text opacity-60 text-base font-medium tracking-wide">{{ total }} invoices total</p>
    </div>

    <v-card rounded="xl">
        <v-data-table :headers="headers" :items="invoices" :loading="loading" hover class="rounded-xl">
          <template #item.invoice_number="{ item }">
            <span class="font-semibold text-indigo-600">#{{ item.invoice_number || item.id }}</span>
          </template>
          <template #item.amount="{ item }">
            <span class="font-bold">₹{{ item.amount?.toLocaleString('en-IN') }}</span>
          </template>
          <template #item.status="{ item }">
            <v-chip :color="statusColor(item.status)" size="small" variant="flat">{{ item.status }}</v-chip>
          </template>
          <template #item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
        </v-data-table>
      </v-card>
    </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import dayjs from 'dayjs'

definePageMeta({ title: 'My Invoices', middleware: ['auth-role'], layout: 'user' })

const loading = ref(false)
const invoices = ref([])
const total = ref(0)

const headers = [
  { title: 'Invoice #', key: 'invoice_number' },
  { title: 'Title', key: 'title' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Created', key: 'created_at' },
]

const statusColor = (s) => ({
  draft: 'default', sent: 'info', paid: 'success', overdue: 'error', cancelled: 'warning'
}[s?.toLowerCase()] || 'default')

const formatDate = (d) => d ? dayjs(d).format('DD MMM YYYY') : '-'

const fetch = async () => {
  loading.value = true
  try {
    const { getInvoices } = useInvoices()
    const res = await getInvoices()
    invoices.value = res?.data?.items || res?.data || []
    total.value = invoices.value.length
  } catch { toast.error('Failed to load invoices') }
  finally { loading.value = false }
}

onMounted(fetch)
</script>

