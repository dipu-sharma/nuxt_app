<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Coupon Management</h1>
        <p class="text-slate-500 text-sm mt-1">{{ total }} coupons total</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Create Coupon</v-btn>
    </div>

    <v-card rounded="xl">
      <v-data-table :headers="headers" :items="coupons" :loading="loading" hover class="rounded-xl">
        <template #item.code="{ item }">
          <v-chip color="primary" variant="outlined" size="small" label>{{ item.code }}</v-chip>
        </template>
        <template #item.discount_value="{ item }">
          <span class="font-semibold text-green-600">
            {{ item.discount_type === 'percentage' ? `${item.discount_value}%` : `₹${item.discount_value}` }}
          </span>
        </template>
        <template #item.expires_at="{ item }">
          <span :class="isExpired(item.expires_at) ? 'text-red-500' : 'text-slate-600'">
            {{ item.expires_at ? formatDate(item.expires_at) : 'Never' }}
          </span>
        </template>
        <template #item.is_active="{ item }">
          <v-chip :color="item.is_active && !isExpired(item.expires_at) ? 'success' : 'error'" size="small" variant="flat">
            {{ item.is_active && !isExpired(item.expires_at) ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" variant="text" @click="openEdit(item)"><Icon name="mdi:pencil-outline" /></v-btn>
          <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)"><Icon name="mdi:trash-can-outline" /></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="540">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Create' }} Coupon</h2>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="form.code" label="Coupon Code" variant="outlined" rounded="lg"
                :rules="[v => !!v || 'Required']" hint="E.g. SAVE20, FESTIVE50"
                @input="form.code = form.code.toUpperCase()" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="form.discount_type" :items="['percentage', 'fixed']" label="Discount Type"
                variant="outlined" rounded="lg" :rules="[v => !!v || 'Required']" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.discount_value" label="Discount Value" type="number"
                variant="outlined" rounded="lg" :prefix="form.discount_type === 'fixed' ? '₹' : ''"
                :suffix="form.discount_type === 'percentage' ? '%' : ''"
                :rules="[v => v > 0 || 'Must be greater than 0']" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.min_order_amount" label="Min Order Amount (₹)" type="number"
                variant="outlined" rounded="lg" prefix="₹" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model.number="form.max_uses" label="Max Uses" type="number"
                variant="outlined" rounded="lg" hint="Leave empty for unlimited" />
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="form.expires_at" label="Expiry Date" type="datetime-local"
                variant="outlined" rounded="lg" />
            </v-col>
            <v-col cols="12">
              <v-switch v-model="form.is_active" label="Active" color="primary" />
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
        <Icon name="mdi:ticket-percent-outline" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-bold mb-2">Delete Coupon?</h3>
        <p class="text-slate-500 mb-6">Delete coupon <strong>{{ deletingItem?.code }}</strong>? This cannot be undone.</p>
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

definePageMeta({ title: 'Coupon Management', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const coupons = ref([])
const total = ref(0)

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Discount', key: 'discount_value' },
  { title: 'Min Order', key: 'min_order_amount' },
  { title: 'Uses', key: 'used_count' },
  { title: 'Expires', key: 'expires_at' },
  { title: 'Status', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const defaultForm = () => ({
  code: '', discount_type: 'percentage', discount_value: 10,
  min_order_amount: 0, max_uses: null, expires_at: '', is_active: true
})
const form = ref(defaultForm())

const formatDate = (d) => dayjs(d).format('DD MMM YYYY')
const isExpired = (d) => d && dayjs(d).isBefore(dayjs())

const fetch = async () => {
  loading.value = true
  try {
    const { getCoupons } = useCoupons()
    const res = await getCoupons()
    coupons.value = res?.data?.items || res?.data || []
    total.value = coupons.value.length
  } catch { toast.error('Failed to load coupons') }
  finally { loading.value = false }
}

const openCreate = () => { editing.value = null; form.value = defaultForm(); dialog.value = true }
const openEdit = (item) => { editing.value = item; form.value = { ...item }; dialog.value = true }

const save = async () => {
  saving.value = true
  try {
    const { createCoupon, updateCoupon } = useCoupons()
    if (editing.value) { await updateCoupon(editing.value.id, form.value); toast.success('Coupon updated!') }
    else { await createCoupon(form.value); toast.success('Coupon created!') }
    dialog.value = false; fetch()
  } catch { toast.error('Failed to save coupon') }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }
const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteCoupon } = useCoupons()
    await deleteCoupon(deletingItem.value.id)
    toast.success('Coupon deleted!'); deleteDialog.value = false; fetch()
  } catch { toast.error('Failed to delete coupon') }
  finally { deleting.value = false }
}

onMounted(fetch)
</script>
