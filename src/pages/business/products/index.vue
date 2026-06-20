<template>
  <div class="p-6 bg-background text-text font-sans">
    
    <!-- Premium Header Section -->
    <div class="mb-8 border-b border-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 class="text-3xl font-light tracking-tight text-text mb-2">
          My Product Catalog
        </h1>
        <p class="text-text opacity-70 text-sm font-medium tracking-wide">
          Manage, upload, and update your business product catalog.
        </p>
      </div>
      
      <div class="flex flex-wrap gap-3">
        <v-btn color="primary" variant="outlined" rounded="pill" size="large" @click="exportCsv"
          class="px-8 text-none tracking-widest font-medium border-border">
          <template #prepend>
            <Icon name="mdi:download-outline" class="w-4 h-4 mr-0.5" />
          </template>
          EXPORT CSV
        </v-btn>
        <v-btn color="primary" variant="flat" rounded="pill" size="large" @click="openCreate"
          class="px-8 text-none tracking-widest font-medium text-white shadow-md hover:-translate-y-0.5 transition-transform" elevation="0">
          ADD PRODUCT
        </v-btn>
      </div>
    </div>

    <!-- Search & Catalog Card -->
    <div class="bg-card rounded-[2.5rem] p-6 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] mb-8 flex gap-4 items-center">
      <div class="relative flex-1">
        <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40 w-5 h-5" />
        <input v-model="search" @input="debouncedSearch" @keyup.enter="loadProducts" placeholder="Search catalog..."
          class="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
      </div>
      
      <v-btn color="primary" rounded="pill" size="large" @click="loadProducts"
        class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
        SEARCH
      </v-btn>
    </div>

    <!-- Products Table View -->
    <div class="bg-card rounded-[2.5rem] p-6 sm:p-8 border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
      
      <div class="overflow-x-auto rounded-[1.5rem] border border-border/50">
        <div v-if="loading" class="p-12 text-center">
          <v-progress-circular indeterminate color="primary" :size="36" :width="2" class="opacity-50" />
        </div>
        
        <div v-else-if="products.length === 0" class="p-16 text-center">
          <div class="w-20 h-20 mx-auto mb-6 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="mdi:package-variant" class="w-8 h-8 text-text opacity-30" />
          </div>
          <p class="text-text opacity-50 text-sm font-medium mb-6">No products found in your inventory.</p>
          <v-btn color="primary" rounded="pill" size="large" @click="openCreate" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
            Add First Product
          </v-btn>
        </div>

        <v-data-table v-else :headers="headers" :items="products" :loading="loading" items-per-page="-1"
          class="custom-data-table" hover>
          
          <template #item.product="{ item }">
            <div class="flex items-center gap-3 py-2">
              <div class="w-12 h-12 rounded-xl border overflow-hidden bg-secondary flex-shrink-0 flex items-center justify-center p-0.5 border-border">
                <img v-if="item.images?.[0]?.url || item.images?.[0]?.image_url" :src="item.images[0].url || item.images[0].image_url"
                  class="w-full h-full object-cover rounded-lg mix-blend-multiply dark:mix-blend-normal" />
                <Icon v-else name="mdi:package-variant-closed" class="w-6 h-6 text-text opacity-30" />
              </div>
              <div>
                <p class="font-semibold text-text leading-snug">{{ item.product_name || item.name }}</p>
                <p class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest mt-0.5">ID: {{ item.id }}</p>
              </div>
            </div>
          </template>

          <template #item.category="{ item }">
            <span class="text-text opacity-70 text-sm font-semibold">{{ item.category?.name || item.category_name || '—' }}</span>
          </template>

          <template #item.price="{ item }">
            <span class="font-semibold text-sm text-text">₹{{ (item.selling_price || item.product_mrp || item.price)?.toLocaleString('en-IN') }}</span>
          </template>

          <template #item.stock="{ item }">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="(item.low_stock_threshold !== undefined ? item.low_stock_threshold : (item.stock_quantity ?? 0)) > 0 
                ? 'bg-primary/10 text-primary' 
                : 'bg-red-500/10 text-red-550'">
              {{ item.low_stock_threshold !== undefined ? item.low_stock_threshold : (item.stock_quantity ?? '0') }} units
            </span>
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
              <v-btn icon size="small" variant="text" class="hover:text-primary text-text opacity-70" @click="openDetailsDialog(item)">
                <Icon name="mdi:eye-outline" class="w-4 h-4" />
              </v-btn>
              <v-btn icon size="small" variant="text" class="hover:text-primary text-text opacity-70" @click="openEdit(item)">
                <Icon name="mdi:pencil-outline" class="w-4 h-4" />
              </v-btn>
              <v-btn icon size="small" variant="text" color="error" class="hover:text-red-600 text-text opacity-70" @click="deleteProduct(item)">
                <Icon name="mdi:trash-can-outline" class="w-4 h-4" />
              </v-btn>
            </div>
          </template>

          <template #bottom>
            <!-- Hide default navigation since we support cursor pagination -->
          </template>

        </v-data-table>
      </div>

      <!-- Pagination Load More -->
      <div v-if="hasMore" class="p-6 text-center border-t border-border mt-4">
        <v-btn color="primary" rounded="pill" size="large" :loading="loadingMore" @click="loadMore"
          class="px-10 text-none tracking-widest font-medium text-white shadow-sm" elevation="0">
          LOAD MORE
        </v-btn>
      </div>

    </div>

    <!-- Product Modal overlay using v-dialog -->
    <v-dialog v-model="showModal" max-width="680" transition="dialog-bottom-transition">
      <v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden" style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
        <div class="px-8 py-8 md:px-10 md:py-10">
          <h2 class="text-3xl font-light tracking-tight text-text mb-6 pb-2 border-b border-border" style="border-color: rgb(var(--color-border))">
            {{ editingProduct ? 'Edit Catalog Product' : 'Add Catalog Product' }}
          </h2>
          
          <form @submit.prevent="saveProduct">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mb-6 text-sm">
              <div class="md:col-span-2">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product Name *</label>
                <input v-model="form.name" placeholder="Enter Product Name" required
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div class="md:col-span-2">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Description</label>
                <textarea v-model="form.description" rows="3" placeholder="Detailed product specifications..."
                  class="w-full px-5 py-3.5 bg-background border border-border rounded-[1.5rem] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm"></textarea>
              </div>

              <div class="md:col-span-2">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Short Description</label>
                <input v-model="form.short_description" placeholder="Brief subtitle summary"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Brand Name</label>
                <input v-model="form.brand_name" placeholder="Brand Name"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Category Name *</label>
                <div class="relative">
                  <select v-model="form.category_id" required
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="" disabled>Select Category</option>
                    <option v-for="cat in categoriesList" :key="cat.id" :value="cat.category_id">
                      {{ cat.name }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Regular Selling Price *</label>
                <input v-model="form.price" type="number" step="0.01" placeholder="0.00" required
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Discount Percent (%)</label>
                <input v-model="form.discount_percent" type="number" step="0.1" placeholder="0"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Cost Price</label>
                <input v-model="form.cost_price" type="number" step="0.01" placeholder="0.00"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Tax Percent (%)</label>
                <input v-model="form.product_tax" type="number" step="0.1" placeholder="0"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Inventory Stock Quantity *</label>
                <input v-model="form.stock_quantity" type="number" placeholder="10" required
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">SKU Code</label>
                <input v-model="form.sku" placeholder="SKU-Code"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">HSN No</label>
                <input v-model="form.hsn_no" placeholder="HSN No"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Batch No</label>
                <input v-model="form.batch_no" placeholder="Batch No"
                  class="w-full px-5 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm" />
              </div>

              <!-- Size Select -->
              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Size dimensions</label>
                <div class="relative">
                  <select v-model="form.size" 
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="">Select Size</option>
                    <option v-for="opt in sizeOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Color Select -->
              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Color attributes</label>
                <div class="relative">
                  <select v-model="form.color" 
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="">Select Color</option>
                    <option v-for="opt in colorOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Catalog Type Select -->
              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product Catalog Type</label>
                <div class="relative">
                  <select v-model="form.product_type" 
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="">Select Catalog Type</option>
                    <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                      {{ opt.title }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Unit Type Select -->
              <div>
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Product Unit type</label>
                <div class="relative">
                  <select v-model="form.product_unit" 
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="">Select Unit Type</option>
                    <option v-for="opt in unitOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Packing Details Select -->
              <div class="md:col-span-2">
                <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-2">Packing Details</label>
                <div class="relative">
                  <select v-model="form.product_packing" 
                    class="w-full pl-5 pr-10 py-3 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-text transition-all shadow-sm appearance-none cursor-pointer">
                    <option value="">Select Packing Details</option>
                    <option v-for="opt in packingOptions" :key="opt" :value="opt">
                      {{ opt }}
                    </option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text opacity-40">
                    <Icon name="mdi:chevron-down" class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Checks -->
              <div class="md:col-span-2 flex flex-wrap items-center gap-6 py-2 border-t border-border mt-2" style="border-color: rgb(var(--color-border))">
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_active" id="is_active" class="w-4 h-4 rounded accent-primary focus:ring-primary" />
                  <label for="is_active" class="text-sm font-semibold">Active Status</label>
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" v-model="form.is_featured" id="is_featured" class="w-4 h-4 rounded accent-primary focus:ring-primary" />
                  <label for="is_featured" class="text-sm font-semibold">Featured Showcase</label>
                </div>
              </div>
            </div>

            <!-- Image Upload Block if editing -->
            <div v-if="editingProduct" class="mb-6 p-6 bg-card border border-border rounded-[2rem] shadow-inner" style="border-color: rgb(var(--color-border))">
              <label class="text-[10px] text-text opacity-50 font-bold uppercase tracking-widest block mb-4">Upload Catalog Images</label>
              <ProductImageUpload :productId="editingProduct.id" @uploaded="onImageUploaded" />
            </div>

            <!-- Form Actions -->
            <div class="flex gap-4 pt-6 border-t border-border" style="border-color: rgb(var(--color-border))">
              <v-btn variant="text" size="large" class="flex-1 text-none tracking-widest font-medium text-text opacity-60 rounded-full" @click="showModal = false">
                Cancel
              </v-btn>
              <v-btn color="primary" variant="flat" rounded="pill" size="large" class="flex-1 text-none tracking-widest font-medium text-white shadow-sm" :disabled="saving" type="submit">
                {{ saving ? 'SAVING...' : (editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT') }}
              </v-btn>
            </div>
          </form>
        </div>
      </v-card>
    </v-dialog>

    <!-- Product Details Dialog -->
    <v-dialog v-model="showDetailsDialog" max-width="720" transition="dialog-bottom-transition">
      <v-card class="rounded-[2.5rem] bg-card border-0 shadow-2xl overflow-hidden" style="background-color: rgb(var(--color-card)); color: rgb(var(--color-text))">
        <div class="px-8 py-8 md:px-10 md:py-10">
          
          <div class="flex justify-between items-start mb-6 pb-2 border-b border-border" style="border-color: rgb(var(--color-border))">
            <div>
              <span class="text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                Product Details
              </span>
              <h2 class="text-3xl font-light tracking-tight text-text mt-2">
                {{ selectedProduct?.name || selectedProduct?.product_name }}
              </h2>
            </div>
            <v-btn icon variant="text" class="text-text opacity-70 hover:opacity-100" @click="showDetailsDialog = false">
              <Icon name="mdi:close" class="w-5 h-5" />
            </v-btn>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 mb-6 text-sm">
            
            <!-- General Section -->
            <div class="space-y-4 md:col-span-2">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                General Information
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Slug</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.slug || '—' }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Brand Name</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.brand_name || '—' }}</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Short Description</span>
                  <span class="text-text">{{ selectedProduct?.short_description || '—' }}</span>
                </div>
                <div class="sm:col-span-2">
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Description</span>
                  <span class="text-text whitespace-pre-line">{{ selectedProduct?.description || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- Pricing Section -->
            <div class="space-y-4">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                Pricing & Taxes
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">MRP Price</span>
                  <span class="font-semibold text-text">₹{{ selectedProduct?.product_mrp?.toLocaleString('en-IN') || '0.00' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Cost Price</span>
                  <span class="font-semibold text-text">₹{{ selectedProduct?.product_cost_price?.toLocaleString('en-IN') || '—' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Discount Percent</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.discount_percent ? `${selectedProduct.discount_percent}%` : '—' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Selling Price</span>
                  <span class="font-semibold text-primary">₹{{ selectedProduct?.selling_price?.toLocaleString('en-IN') || '0.00' }}</span>
                </div>
                <div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Product Tax</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.product_tax ? `${selectedProduct.product_tax}%` : '0%' }}</span>
                </div>
              </div>
            </div>

            <!-- Inventory & Attributes Section -->
            <div class="space-y-4">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                Inventory & Specifications
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">SKU Code</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.product_sku || '—' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">HSN Code</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.hsn_no || '—' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Batch Number</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.batch_no || '—' }}</span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Size / Color</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.size || '—' }} / {{ selectedProduct?.color || '—' }}
                  </span>
                </div>
                <div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Packing / Unit</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.product_packing || '—' }} / {{ selectedProduct?.product_unit || '—' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Lifecycle & Dates Section -->
            <div class="space-y-4">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                Lifecycle & Dates
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Manufacturing Date</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.mfg_date ? new Date(selectedProduct.mfg_date).toLocaleDateString() : '—' }}
                  </span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Expiry Date</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.exp_date ? new Date(selectedProduct.exp_date).toLocaleDateString() : '—' }}
                  </span>
                </div>
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Low Stock Limit</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.low_stock_threshold !== undefined ? selectedProduct.low_stock_threshold : '10' }} units
                  </span>
                </div>
                <div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Catalog Type</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.product_type || '—' }}</span>
                </div>
              </div>
            </div>

            <!-- Ratings & Reviews Section -->
            <div class="space-y-4">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                Ratings & Reviews
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between border-b border-border/30 pb-1.5" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Average Rating</span>
                  <span class="font-semibold text-text flex items-center gap-1">
                    <Icon name="mdi:star" class="w-4 h-4 text-amber-500" />
                    {{ selectedProduct?.average_rating !== undefined && selectedProduct?.average_rating !== null ? Number(selectedProduct.average_rating).toFixed(1) : '0.0' }} / 5.0
                  </span>
                </div>
                <div class="flex justify-between pb-1" style="border-color: rgb(var(--color-border))">
                  <span class="text-text opacity-60">Total Reviews</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.reviews_count !== undefined && selectedProduct?.reviews_count !== null ? selectedProduct.reviews_count : '0' }} reviews
                  </span>
                </div>
              </div>
            </div>

            <!-- Extra attributes and dates -->
            <div class="space-y-4 md:col-span-2">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                System Details
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Product ID</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.product_id || '—' }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Business ID</span>
                  <span class="font-semibold text-text">{{ selectedProduct?.business_id || '—' }}</span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Active Status</span>
                  <span class="font-semibold text-text" :class="selectedProduct?.is_active ? 'text-green-600 dark:text-green-400' : 'text-text opacity-60'">
                    {{ selectedProduct?.is_active ? 'Active (Visible in Catalog)' : 'Inactive (Hidden)' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Featured Showcase</span>
                  <span class="font-semibold text-text" :class="selectedProduct?.is_featured ? 'text-primary' : 'text-text opacity-60'">
                    {{ selectedProduct?.is_featured ? 'Featured on Showcase' : 'Standard catalog item' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Created At</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.created_at ? new Date(selectedProduct.created_at).toLocaleString() : '—' }}
                  </span>
                </div>
                <div>
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Last Updated At</span>
                  <span class="font-semibold text-text">
                    {{ selectedProduct?.updated_at ? new Date(selectedProduct.updated_at).toLocaleString() : '—' }}
                  </span>
                </div>
                <div v-if="selectedProduct?.deleted_at">
                  <span class="text-[10px] text-text opacity-50 uppercase font-bold tracking-wider block">Deleted At</span>
                  <span class="font-semibold text-red-500">
                    {{ new Date(selectedProduct.deleted_at).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Image Gallery Section -->
            <div v-if="selectedProduct?.images && selectedProduct.images.length > 0" class="space-y-4 md:col-span-2">
              <h3 class="font-bold text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-1">
                Product Images Gallery
              </h3>
              <div class="flex flex-wrap gap-3">
                <div v-for="(img, idx) in selectedProduct.images" :key="idx" 
                  class="w-24 h-24 rounded-xl border border-border bg-secondary flex items-center justify-center p-1 overflow-hidden shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  <img :src="img.image_url || img.url || img.file_url" class="w-full h-full object-cover rounded-lg" />
                </div>
              </div>
            </div>

          </div>

          <div class="flex justify-end pt-4 border-t border-border" style="border-color: rgb(var(--color-border))">
            <v-btn color="primary" rounded="pill" size="large" class="px-8 text-none tracking-widest font-medium text-white shadow-sm" @click="showDetailsDialog = false">
              Close
            </v-btn>
          </div>

        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify'
import { ProductPayloadSchema } from '@/utils/schemas'
import ProductImageUpload from '@/components/ProductImageUpload.vue'
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  title: 'Products',
  middleware: ['auth-role'],
  layout: 'admin',
  role: ['BUSINESS_OWNER', 'BUSINESS_MEMBER'],
})

const loading = ref(false)
const loadingMore = ref(false)
const saving = ref(false)
const products = ref([])
const search = ref('')
const cursor = ref(null)
const hasMore = ref(false)
const showModal = ref(false)
const editingProduct = ref(null)

const showDetailsDialog = ref(false)
const selectedProduct = ref(null)

const openDetailsDialog = (product) => {
  selectedProduct.value = { ...product }
  showDetailsDialog.value = true
}

const packingOptions = ref([
  'Box',
  'Packet',
  'Bottle',
  'Can',
  'Carton',
  'Strip',
  'Tube',
  'Pcs',
  'Jar',
  'Bag',
  'Roll',
  'Drum'
])

const unitOptions = ref([
  'PCS',
  'KG',
  'GM',
  'LTR',
  'ML',
  'BOX',
  'PACKET',
  'DOZEN',
  'MTR',
  'FT'
])

const sizeOptions = ref([
  'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size',
  '4', '5', '6', '7', '8', '9', '10', '11', '12'
])

const colorOptions = ref([
  'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White', 
  'Gray', 'Orange', 'Purple', 'Pink', 'Brown', 'Navy', 
  'Beige', 'Multicolor'
])

const typeOptions = ref([
  { title: 'Fashion', value: 'FASHION' },
  { title: 'Electronics', value: 'ELECTRONICS' },
  { title: 'Grocery', value: 'GROCERY' },
  { title: 'Home', value: 'HOME' },
  { title: 'Beauty', value: 'BEAUTY' },
  { title: 'Other', value: 'OTHER' }
])

const defaultForm = { 
  name: '', description: '', short_description: '', brand_name: '',
  price: '', cost_price: '', discount_percent: '', 
  stock_quantity: 0, sku: '', hsn_no: '', size: '', color: '', batch_no: '', 
  product_tax: '', product_packing: '', product_type: '', product_unit: '',
  category_id: '', is_active: true, is_featured: false 
}
const form = ref({ ...defaultForm })

const headers = [
  { title: 'Product Catalog Item', key: 'product', sortable: true },
  { title: 'Category', key: 'category', sortable: true },
  { title: 'Price', key: 'price', sortable: true },
  { title: 'Stock status', key: 'stock', sortable: true },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

const debouncedSearch = useDebounceFn(() => { loadProducts() }, 400)

const loadProducts = async () => {
  loading.value = true
  try {
    const { getProducts } = useBusinessProducts()
    const params = { limit: 20 }
    if (search.value) params.search = search.value

    const res = await getProducts(params)
    products.value = res?.data?.items || res?.data || []
    cursor.value = res?.data?.next_cursor || null
    hasMore.value = !!res?.data?.has_more
  } catch (error) {
    console.error(error)
    toast.error('Failed to fetch product catalog list')
    products.value = []
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const { getProducts } = useBusinessProducts()
    const params = { limit: 20, cursor: cursor.value }
    if (search.value) params.search = search.value

    const res = await getProducts(params)
    const newItems = res?.data?.items || res?.data || []
    products.value.push(...newItems)
    cursor.value = res?.data?.next_cursor || null
    hasMore.value = !!res?.data?.has_more
  } catch (error) {
    console.error('Failed to load more products', error)
  } finally {
    loadingMore.value = false
  }
}

const openCreate = () => {
  editingProduct.value = null
  form.value = { ...defaultForm }
  showModal.value = true
}

const openEdit = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name || product.product_name || '',
    description: product.description || '',
    short_description: product.short_description || '',
    brand_name: product.brand_name || '',
    price: product.price || product.product_mrp || product.selling_price || '',
    cost_price: product.product_cost_price || '',
    discount_percent: product.discount_percent || '',
    stock_quantity: product.stock_quantity || product.stock || product.low_stock_threshold || 10,
    sku: product.sku || product.product_sku || '',
    hsn_no: product.hsn_no || '',
    size: product.size || '',
    color: product.color || '',
    batch_no: product.batch_no || '',
    product_tax: product.product_tax || '',
    product_packing: product.product_packing || '',
    product_type: product.product_type || '',
    product_unit: product.product_unit || '',
    category_id: product.category?.category_id || product.category_id || '',
    is_active: product.is_active !== undefined ? product.is_active : true,
    is_featured: product.is_featured || false
  }
  showModal.value = true
}

const onImageUploaded = () => {
  loadProducts() // Refresh to show new image in list
}

const saveProduct = async () => {
  saving.value = true
  try {
    const slug = form.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const payload = {
      product_name: form.value.name,
      slug: slug,
      brand_name: form.value.brand_name || null,
      description: form.value.description || null,
      short_description: form.value.short_description || null,
      product_cost_price: form.value.cost_price ? Number(form.value.cost_price) : null,
      product_mrp: Number(form.value.price),
      discount_percent: form.value.discount_percent ? Number(form.value.discount_percent) : null,
      product_sku: form.value.sku || null,
      hsn_no: form.value.hsn_no || null,
      size: form.value.size || null,
      color: form.value.color || null,
      batch_no: form.value.batch_no || null,
      product_tax: form.value.product_tax ? Number(form.value.product_tax) : 0,
      product_packing: form.value.product_packing || null,
      product_type: form.value.product_type || null,
      product_unit: form.value.product_unit || null,
      category_id: form.value.category_id,
      is_active: form.value.is_active,
      is_featured: form.value.is_featured,
      low_stock_threshold: form.value.stock_quantity ? Number(form.value.stock_quantity) : 10,
    }
    
    const parsed = ProductPayloadSchema.safeParse(payload)
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message)
      saving.value = false
      return
    }
    
    const { createProduct, updateProduct } = useBusinessProducts()
    
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.product_id || editingProduct.value.id, parsed.data)
      toast.success('Product updated successfully!')
    } else {
      await createProduct(parsed.data)
      toast.success('Product created successfully!')
    }
    showModal.value = false
    loadProducts()
  } catch (error) {
    console.error(error)
    toast.error('Failed to save product')
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (product) => {
  if (!confirm(`Are you sure you want to delete "${product.name || product.product_name}"?`)) return
  try {
    const { deleteProduct: doDelete } = useBusinessProducts()
    await doDelete(product.product_id || product.id)
    toast.success('Product deleted successfully!')
    loadProducts()
  } catch (error) {
    console.error(error)
    toast.error('Failed to delete product')
  }
}

const exportCsv = async () => {
  try {
    const { exportCsv: doExport } = useBusinessProducts()
    await doExport()
    toast.success('CSV export initiated successfully!')
  } catch {
    toast.error('Export failed')
  }
}

const categoriesList = ref([])

const loadCategories = async () => {
  try {
    const { getCategories } = useCategories()
    const res = await getCategories({ limit: 100 })
    categoriesList.value = res?.data?.items || res?.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

onMounted(() => {
  loadProducts()
  loadCategories()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e7e5e4;
  border-radius: 9999px;
}
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
</style>
