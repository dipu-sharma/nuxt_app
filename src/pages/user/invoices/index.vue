<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-text opacity-60 text-base font-medium tracking-wide">{{ total }} invoices total</p>
    </div>

    <v-card rounded="xl">
        <v-data-table :headers="headers" :items="invoices" :loading="loading" hover class="rounded-xl">
          <template #item.invoice_id="{ item }">
            <span class="font-semibold text-indigo-600">#{{ item.invoice_id || item.id }}</span>
          </template>
          <template #item.total_amount="{ item }">
            <span class="font-bold">₹{{ item.total_amount?.toLocaleString('en-IN') }}</span>
          </template>
          <template #item.payment_status="{ item }">
            <v-chip :color="statusColor(item.payment_status)" size="small" variant="flat" class="text-uppercase">{{ item.payment_status }}</v-chip>
          </template>
          <template #item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
          <template #item.actions="{ item }">
            <div class="flex items-center gap-2">
              <v-btn 
                icon="mdi-eye" 
                size="small" 
                color="primary" 
                variant="tonal"
                title="Live Preview"
                @click="openPreview(item)"
              ></v-btn>
              <v-btn 
                icon="mdi-download" 
                size="small" 
                color="success" 
                variant="tonal"
                title="Download PDF"
                :loading="downloadingId === item.id"
                @click="handleDownloadPDF(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card>

      <InvoicePreviewModal
        v-model="previewOpen"
        :invoice-id="selectedInvoiceId"
        :templates="invoiceTemplates"
        @download="handleModalDownload"
      />
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
  { title: 'Invoice #', key: 'invoice_id' },
  { title: 'Amount', key: 'total_amount' },
  { title: 'Status', key: 'payment_status' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const statusColor = (s) => ({
  draft: 'default', sent: 'info', paid: 'success', overdue: 'error', cancelled: 'warning'
}[s?.toLowerCase()] || 'default')

const formatDate = (d) => d ? dayjs(d).format('DD MMM YYYY') : '-'

const { getInvoices, getInvoiceTemplates, downloadInvoicePDF } = useInvoices()

const fetch = async () => {
  loading.value = true
  try {
    const res = await getInvoices()
    invoices.value = res?.data?.items || res?.data || []
    total.value = invoices.value.length

    // Also fetch templates
    const templatesRes = await getInvoiceTemplates()
    invoiceTemplates.value = templatesRes?.data || []
  } catch (err) { 
    toast.error('Failed to load invoices') 
    console.error(err)
  } finally { 
    loading.value = false 
  }
}

// Modal State
const previewOpen = ref(false)
const selectedInvoiceId = ref(null)
const invoiceTemplates = ref([])
const downloadingId = ref(null)

const openPreview = (invoice) => {
  selectedInvoiceId.value = invoice.id
  previewOpen.value = true
}

const handleDownloadPDF = async (invoice) => {
  const invoiceId = invoice.id || invoice.invoice_id
  if (!invoiceId) return
  
  downloadingId.value = invoiceId
  try {
    const blob = await downloadInvoicePDF(invoiceId)
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Invoice_${invoice.invoice_number || invoiceId}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    
    toast.success('Invoice downloaded successfully')
  } catch (err) {
    console.error("PDF Download Error:", err)
    toast.error("Failed to download PDF")
  } finally {
    downloadingId.value = null
  }
}

const handleModalDownload = () => {
  if (selectedInvoiceId.value) {
    const invoice = invoices.value.find(i => i.id === selectedInvoiceId.value)
    if (invoice) {
        handleDownloadPDF(invoice)
    }
  }
}

onMounted(fetch)
</script>

