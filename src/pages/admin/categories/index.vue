<template>
  <div class="p-6" style="color: rgb(var(--color-text))">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Category Management</h1>
        <p class="text-slate-500 text-sm mt-1">{{ total }} categories total</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi:plus" rounded="lg" @click="openCreate">Add Category</v-btn>
    </div>

    <v-card rounded="xl">
      <div class="pa-4 flex gap-3">
        <v-text-field v-model="search" label="Search categories..." prepend-inner-icon="mdi:magnify"
          variant="outlined" rounded="lg" density="compact" hide-details class="max-w-xs"
          @update:model-value="debouncedFetch" />
      </div>
      <v-data-table :headers="headers" :items="categories" :loading="loading" items-per-page="10"
        class="rounded-xl" hover>
        <template #item.name="{ item }">
          <span class="font-semibold">{{ item.name }}</span>
        </template>
        <template #item.is_active="{ item }">
          <v-chip :color="item.is_active ? 'success' : 'default'" size="small" variant="flat">
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </v-chip>
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

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card rounded="xl" class="pa-6">
        <h2 class="text-xl font-bold mb-4">{{ editing ? 'Edit' : 'Create' }} Category</h2>
        <v-form ref="form" @submit.prevent="save">
          <v-text-field v-model="form.name" label="Category Name" variant="outlined" rounded="lg"
            :rules="[v => !!v || 'Required']" class="mb-3" />
          <v-text-field v-model="form.slug" label="Slug" variant="outlined" rounded="lg" class="mb-3"
            hint="Auto-generated from name" />
          <v-textarea v-model="form.description" label="Description" variant="outlined" rounded="lg" rows="3" class="mb-3" />
          <v-switch v-model="form.is_active" label="Active" color="primary" class="mb-4" />
          <div class="flex gap-3 justify-end">
            <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" type="submit" :loading="saving">{{ editing ? 'Update' : 'Create' }}</v-btn>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card rounded="xl" class="pa-6 text-center">
        <Icon name="mdi:alert-circle-outline" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-bold mb-2">Delete Category?</h3>
        <p class="text-slate-500 mb-6">This will permanently delete <strong>{{ deletingItem?.name }}</strong>. This action cannot be undone.</p>
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

definePageMeta({ title: 'Category Management', middleware: ['auth-role'], layout: 'admin' })

const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editing = ref(null)
const deletingItem = ref(null)
const categories = ref([])
const total = ref(0)
const search = ref('')
const form = ref({ name: '', slug: '', description: '', is_active: true })

const headers = [
  { title: '#', key: 'index', width: 60 },
  { title: 'Name', key: 'name' },
  { title: 'Slug', key: 'slug' },
  { title: 'Products', key: 'product_count' },
  { title: 'Status', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

let debounceTimer = null
const debouncedFetch = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(fetch, 400) }

const fetch = async () => {
  loading.value = true
  try {
    const { getAdminCategories } = useCategories()
    const res = await getAdminCategories({ search: search.value })
    categories.value = (res?.data?.items || res?.data || []).map((c, i) => ({ ...c, index: i + 1 }))
    total.value = res?.data?.total || categories.value.length
  } catch { toast.error('Failed to load categories') }
  finally { loading.value = false }
}

const openCreate = () => {
  editing.value = null
  form.value = { name: '', slug: '', description: '', is_active: true }
  dialog.value = true
}

const openEdit = (item) => {
  editing.value = item
  form.value = { name: item.name, slug: item.slug, description: item.description, is_active: item.is_active }
  dialog.value = true
}

watch(() => form.value.name, (val) => {
  if (!editing.value) form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

const save = async () => {
  saving.value = true
  try {
    const { createCategory, updateCategory } = useCategories()
    if (editing.value) {
      await updateCategory(editing.value.id, form.value)
      toast.success('Category updated!')
    } else {
      await createCategory(form.value)
      toast.success('Category created!')
    }
    dialog.value = false
    fetch()
  } catch { toast.error('Failed to save category') }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }

const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteCategory } = useCategories()
    await deleteCategory(deletingItem.value.id)
    toast.success('Category deleted!')
    deleteDialog.value = false
    fetch()
  } catch { toast.error('Failed to delete category') }
  finally { deleting.value = false }
}

onMounted(fetch)
</script>
