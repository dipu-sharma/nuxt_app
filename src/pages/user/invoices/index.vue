<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">My Invoices</h1>
          <p class="text-slate-500 text-sm mt-1">{{ total }} invoices total</p>
        </div>
        <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">New Invoice</v-btn>
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
          <template #item.actions="{ item }">
            <v-btn icon size="small" variant="text" @click="openEdit(item)">
              <Icon name="mdi:pencil-outline" />
            </v-btn>
            <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
              <Icon name="mdi:trash-can-outline" />
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="540">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'New' }} Invoice</h2>
        <v-form @submit.prevent="save">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.title" label="Invoice Title" variant="outlined" rounded="lg"
                :rules="[isRequired]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.amount" label="Amount (₹)" type="number"
                variant="outlined" rounded="lg" prefix="₹" :rules="[isPositive]" />
            </v-col>
            <v-col cols="12">
              <v-select v-model="form.status" :items="['draft','sent','paid','overdue','cancelled']"
                label="Status" variant="outlined" rounded="lg" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="form.due_date" label="Due Date" type="date" variant="outlined" rounded="lg" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="form.notes" label="Notes" variant="outlined" rounded="lg" rows="3" />
            </v-col>
          </v-row>
          <div class="flex gap-3 justify-end mt-2">
            <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">{{ editing ? 'Update' : 'Create' }}</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl" class="pa-6 text-center">
        <Icon name="mdi:receipt-text-remove" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="font-bold text-lg mb-2">Delete Invoice?</h3>
        <p class="text-slate-500 mb-5">This invoice will be permanently deleted.</p>
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
import dayjs from 'dayjs'

definePageMeta({ title: 'My Invoices', middleware: ['auth-role'], layout: 'default' })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const invoices = ref([])
const total = ref(0)

const form = ref({ title: '', amount: 0, status: 'draft', due_date: '', notes: '' })

const headers = [
  { title: 'Invoice #', key: 'invoice_number' },
  { title: 'Title', key: 'title' },
  { title: 'Amount', key: 'amount' },
  { title: 'Status', key: 'status' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
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

const openCreate = () => {
  editing.value = null
  form.value = { title: '', amount: 0, status: 'draft', due_date: '', notes: '' }
  dialog.value = true
}

const openEdit = (item) => {
  editing.value = item
  form.value = { title: item.title, amount: item.amount, status: item.status, due_date: item.due_date, notes: item.notes }
  dialog.value = true
}

const save = async () => {
  saving.value = true
  try {
    const { createInvoice, updateInvoice } = useInvoices()
    if (editing.value) { await updateInvoice(editing.value.id, form.value); toast.success('Invoice updated!') }
    else { await createInvoice(form.value); toast.success('Invoice created!') }
    dialog.value = false; fetch()
  } catch { toast.error('Failed to save invoice') }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }
const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteInvoice } = useInvoices()
    await deleteInvoice(deletingItem.value.id)
    toast.success('Invoice deleted!'); deleteDialog.value = false; fetch()
  } catch { toast.error('Failed to delete invoice') }
  finally { deleting.value = false }
}

onMounted(fetch)
</script>
