<template>
  <div class="p-6 bg-background text-text font-sans">
    
    <!-- Premium Header Section -->
    <div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-text mb-2">
          Category Management
        </h1>
        <p class="text-text opacity-70 text-sm font-medium tracking-wide">
          Organize and structure the product catalog taxonomy.
        </p>
      </div>
      
      <v-btn color="primary" prepend-icon="mdi:plus" rounded="pill" size="large"
        class="px-8 text-none tracking-widest font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform" elevation="0"
        @click="openCreate">
        ADD CATEGORY
      </v-btn>
    </div>

    <!-- Main Category Table Card -->
    <div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
      
      <!-- Filters Area -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div class="relative w-full sm:w-80">
          <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
          <input v-model="search" @input="debouncedFetch" type="text" placeholder="Search categories..." 
            class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text" />
        </div>
        <span class="text-xs font-bold uppercase tracking-widest text-text opacity-50">
          {{ total }} categories total
        </span>
      </div>

      <!-- Data Table wrapper -->
      <div class="overflow-x-auto rounded-[1.5rem] border border-border/50">
        <v-data-table :headers="headers" :items="visibleCategories" :loading="loading" items-per-page="10"
          class="custom-data-table" hover>
          
          <template #item.name="{ item }">
            <div :style="{ paddingLeft: `${(item.level || 0) * 24}px` }" class="flex items-center gap-2 py-2">
              <!-- Expand/Collapse Button -->
              <button v-if="item.children?.length" 
                class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary text-text opacity-70 transition-colors"
                @click.stop="toggleExpand(item.id)">
                <Icon :name="expandedIds.has(item.id) ? 'mdi:chevron-down' : 'mdi:chevron-right'" class="w-5 h-5" />
              </button>
              <div v-else class="w-8"></div> <!-- Alignment spacer -->
              
              <Icon :name="item.children?.length ? 'mdi:folder-outline' : 'mdi:subdirectory-arrow-right'" 
                class="w-4 h-4 text-text opacity-50" />
              <span class="font-medium text-text ml-1">{{ item.name }}</span>
            </div>
          </template>
          
          <template #item.is_active="{ item }">
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              :class="item.is_active 
                ? 'bg-primary/10 text-primary' 
                : 'bg-secondary text-text opacity-50'">
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </span>
          </template>
          
          <template #item.actions="{ item }">
            <div class="flex justify-end gap-1">
              <v-btn icon size="small" variant="text" class="hover:text-primary transition-colors text-text opacity-70" @click="openEdit(item)">
                <Icon name="mdi:pencil-outline" class="w-4 h-4" />
              </v-btn>
              <v-btn icon size="small" variant="text" color="error" class="hover:text-red-600 transition-colors text-text opacity-70" @click="confirmDelete(item)">
                <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
              </v-btn>
            </div>
          </template>
          
        </v-data-table>
      </div>

    </div>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="540" transition="dialog-bottom-transition">
      <v-card class="rounded-[2.5rem] bg-background border-0 shadow-2xl overflow-hidden">
        <div class="px-8 py-8 md:px-10 md:py-10">
          <h2 class="text-3xl font-semibold tracking-tight text-text mb-6">
            {{ editing ? 'Edit Category' : 'Create Category' }}
          </h2>
          
          <v-form ref="formRef" @submit.prevent="save">
            <!-- Category Name -->
            <div class="mb-4">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Category Name *</label>
              <input v-model="form.name" placeholder="Category Name" required
                class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
            </div>

            <!-- Slug -->
            <div class="mb-4">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Slug</label>
              <input v-model="form.slug" placeholder="Auto-generated from name"
                class="w-full px-5 py-3 bg-card border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
            </div>

            <!-- Parent Category (Autocomplete) -->
            <div class="mb-4">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Parent Category (Optional)</label>
              <v-autocomplete v-model="form.parent_id" :items="categories" item-title="displayName" item-value="id"
                variant="outlined" rounded="pill" color="primary" class="custom-autocomplete" clearable density="compact" hide-details />
            </div>

            <!-- Description -->
            <div class="mb-6">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Description</label>
              <textarea v-model="form.description" placeholder="Describe the category..." rows="3"
                class="w-full px-5 py-3 bg-card border border-border rounded-[1.5rem] text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text resize-none transition-all shadow-sm"></textarea>
            </div>

            <!-- Active Status Switch -->
            <v-switch v-model="form.is_active" label="Active" color="primary" hide-details class="mb-8" />

            <!-- Form Actions -->
            <div class="flex gap-4 pt-4 border-t border-border">
              <v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="dialog = false">
                Cancel
              </v-btn>
              <v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" :loading="saving" type="submit">
                {{ editing ? 'SAVE CHANGES' : 'CREATE CATEGORY' }}
              </v-btn>
            </div>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="440">
      <v-card class="rounded-[2.5rem] bg-background border-0 shadow-2xl p-8 text-center">
        <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mx-auto mb-6 text-red-500">
          <Icon name="mdi:alert-circle-outline" class="w-8 h-8" />
        </div>
        
        <h3 class="text-2xl font-light tracking-tight text-text mb-3">Delete Category?</h3>
        <p class="text-text opacity-75 text-sm mb-8 leading-relaxed">
          Are you sure you want to permanently delete <strong>{{ deletingItem?.name }}</strong>?<br /> This action is irreversible.
        </p>
        
        <div class="flex gap-4 pt-4 border-t border-border">
          <v-btn variant="outlined" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium border-border text-text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium" :loading="deleting" @click="doDelete">
            DELETE
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { CategoryPayloadSchema } from '@/utils/schemas'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({ title: 'Category Management', middleware: ['auth-role'], layout: 'admin', role: ['ADMIN'] })

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
const form = ref({ name: '', slug: '', description: '', is_active: true, parent_id: null })
const formRef = ref(null)

const expandedIds = ref(new Set())

const toggleExpand = (id) => {
  const newSet = new Set(expandedIds.value)
  if (newSet.has(id)) newSet.delete(id)
  else newSet.add(id)
  expandedIds.value = newSet
}

const visibleCategories = computed(() => {
  const visible = []
  const hiddenAncestors = new Set()
  
  for (const cat of categories.value) {
    if (cat.parent_id === null) {
      visible.push(cat)
      if (!expandedIds.value.has(cat.id)) {
        hiddenAncestors.add(cat.id)
      }
    } else {
      if (hiddenAncestors.has(cat.parent_id)) {
        hiddenAncestors.add(cat.id)
      } else {
        visible.push(cat)
        if (!expandedIds.value.has(cat.id)) {
          hiddenAncestors.add(cat.id)
        }
      }
    }
  }
  return visible
})

const headers = [
  { title: '#', key: 'index', width: 65, sortable: false },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const debouncedFetch = useDebounceFn(() => { fetch() }, 400)

const flattenCategories = (items) => {
  let flat = []
  for (const item of items) {
    flat.push(item)
    if (item.children && item.children.length > 0) {
      flat = flat.concat(flattenCategories(item.children))
    }
  }
  return flat
}

const fetch = async () => {
  loading.value = true
  try {
    const { getAdminCategories } = useCategories()
    const res = await getAdminCategories({ search: search.value })
    const rawItems = res?.data?.items || res?.data || []
    
    const flatItems = flattenCategories(rawItems)
    categories.value = flatItems.map((c, i) => ({ 
      ...c, 
      index: i + 1,
      displayName: c.level > 0 ? `${'— '.repeat(c.level)}${c.name}` : c.name
    }))
    
    total.value = res?.data?.total || categories.value.length
  } catch { toast.error('Failed to load categories') }
  finally { loading.value = false }
}

const openCreate = () => {
  editing.value = null
  form.value = { name: '', slug: '', description: '', is_active: true, parent_id: null }
  dialog.value = true
}

const openEdit = (item) => {
  editing.value = item
  form.value = { name: item.name, slug: item.slug, description: item.description, is_active: item.is_active, parent_id: item.parent_id || null }
  dialog.value = true
}

watch(() => form.value?.name, (val) => {
  if (!editing.value && val) form.value.slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
})

const save = async () => {
  saving.value = true
  try {
    const payload = {
      name: form.value?.name || '',
      description: form.value?.description || '',
      parent_id: form.value?.parent_id || null
    }
    
    const parsed = CategoryPayloadSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message)
      saving.value = false
      return
    }

    const { createCategory, updateCategory } = useCategories()
    if (editing.value) {
      await updateCategory(editing.value.id, { ...parsed.data, is_active: form.value.is_active, slug: form.value.slug })
      toast.success('Category updated successfully!')
    } else {
      await createCategory({ ...parsed.data, is_active: form.value.is_active, slug: form.value.slug })
      toast.success('Category created successfully!')
    }
    dialog.value = false
    fetch()
  } catch (err) { 
    console.error(err)
    toast.error('Failed to save category') 
  }
  finally { saving.value = false }
}

const confirmDelete = (item) => { deletingItem.value = item; deleteDialog.value = true }

const doDelete = async () => {
  deleting.value = true
  try {
    const { deleteCategory } = useCategories()
    await deleteCategory(deletingItem.value.id)
    toast.success('Category deleted successfully!')
    deleteDialog.value = false
    fetch()
  } catch { toast.error('Failed to delete category') }
  finally { deleting.value = false }
}

onMounted(fetch)
</script>

<style scoped>
.custom-data-table {
  background: transparent !important;
}
:deep(.v-data-table-header__content) {
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 10px !important;
  letter-spacing: 0.1em !important;
  color: #a8a29e !important;
}
:deep(.custom-autocomplete .v-field) {
  border-radius: 9999px !important;
  background-color: rgb(var(--color-card)) !important;
  color: rgb(var(--color-text)) !important;
  border: 1px solid rgb(var(--color-border)) !important;
}
</style>
