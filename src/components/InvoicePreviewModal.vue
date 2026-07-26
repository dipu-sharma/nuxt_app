<template>
  <v-dialog v-model="isOpen" max-width="1000" transition="dialog-bottom-transition">
    <v-card class="rounded-[1.5rem] overflow-hidden border-0 shadow-2xl bg-white">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 class="text-xl font-bold tracking-tight text-gray-800">Invoice Preview</h2>
        <button @click="isOpen = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50">
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>
      </div>

      <div class="p-6 md:p-8">
        <!-- Controls Header -->
        <div class="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center gap-3">
              <label class="font-semibold text-sm text-gray-700">Template Style:</label>
              <select
                v-model="template"
                class="border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer min-w-[150px] max-w-[200px] truncate"
              >
                <option v-for="t in templates" :key="t.name" :value="t.name">
                  {{ t.name }}
                </option>
              </select>
            </div>

            <div class="flex items-center gap-3">
              <label class="font-semibold text-sm text-gray-700">Brand Color:</label>
              <div class="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer">
                <input
                  type="color"
                  v-model="primaryColor"
                  class="absolute -inset-2 w-14 h-14 cursor-pointer"
                />
              </div>
              <span class="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded border">{{ primaryColor.toUpperCase() }}</span>
            </div>
          </div>
          
          <v-btn 
            color="primary" 
            prepend-icon="mdi-download" 
            @click="emit('download')"
            class="text-none tracking-wide font-medium shadow-md hover:shadow-lg transition-all"
            rounded="lg"
            size="large"
          >
            Download PDF
          </v-btn>
        </div>

        <!-- Live HTML Preview IFrame -->
        <div class="border border-gray-200 rounded-xl shadow-inner bg-gray-100 overflow-hidden relative flex flex-col" style="height: 65vh; min-height: 500px;">
          <!-- Top Browser-like bar -->
          <div class="h-8 bg-gray-200/50 border-b border-gray-200 flex items-center px-4 gap-2">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
            <div class="mx-auto bg-white/50 px-4 py-0.5 rounded text-[10px] text-gray-500 font-mono tracking-widest hidden sm:block">
              LIVE PREVIEW
            </div>
          </div>
          
          <iframe
            v-if="!loadingHtml && htmlContent"
            :srcdoc="htmlContent"
            title="Live Invoice Preview"
            class="w-full h-full flex-1 border-0 bg-white"
          />
          
          <div v-if="loadingHtml" class="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <v-progress-circular indeterminate color="primary" size="48" width="3"></v-progress-circular>
            <p class="mt-4 text-sm font-medium text-gray-500 animate-pulse">Generating preview...</p>
          </div>
          
          <div v-else-if="!htmlContent && !loadingHtml" class="absolute inset-0 flex items-center justify-center text-gray-400">
             Failed to load invoice preview.
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  invoiceId: {
    type: [String, Number],
    default: null
  },
  templates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'download'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const template = ref('MODERN')
const primaryColor = ref('#299D91') // Default primary
const htmlContent = ref('')
const loadingHtml = ref(false)

const api = useApi()

// When templates load or change, set defaults
watch(() => props.templates, (newTemplates) => {
    if (newTemplates && newTemplates.length > 0) {
        const found = newTemplates.find(t => t.name === template.value)
        if (!found) {
            template.value = newTemplates[0].name
        }
        
        const currentTpl = newTemplates.find(t => t.name === template.value)
        if (currentTpl && currentTpl.default_primary_color) {
            primaryColor.value = currentTpl.default_primary_color
        }
    }
}, { immediate: true })

// Also watch template selection to update color
watch(template, (newTplName) => {
    const currentTpl = props.templates.find(t => t.name === newTplName)
    if (currentTpl && currentTpl.default_primary_color) {
        primaryColor.value = currentTpl.default_primary_color
    }
})

// Debounce helper to prevent spamming the API when dragging the color picker
let debounceTimer
const fetchHtmlPreview = async () => {
    if (!props.invoiceId || !isOpen.value) return
    
    loadingHtml.value = true
    try {
        // We use responseType text because it's HTML
        const res = await api(`/api/user/invoice/${props.invoiceId}/html?template_name=${template.value}&primary_color=${encodeURIComponent(primaryColor.value)}`, {
            method: 'GET',
            responseType: 'text'
        })
        htmlContent.value = res
    } catch (err) {
        console.error('Failed to load invoice HTML preview:', err)
        htmlContent.value = ''
    } finally {
        loadingHtml.value = false
    }
}

// Watch for changes that should trigger a re-fetch
watch([() => props.invoiceId, template, primaryColor, isOpen], ([newId, newTpl, newColor, newOpen]) => {
    if (newOpen && newId) {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            fetchHtmlPreview()
        }, 300) // 300ms debounce
    }
}, { immediate: true })

</script>
