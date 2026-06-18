<script setup lang="ts">
const config = useRuntimeConfig();
const token = useCookie('auth_token');

const { data: response, pending, error } = await useFetch('/api/categories/tree', {
  baseURL: config.public.API_BASE_URL || 'http://localhost:8000',
  headers: {
    Authorization: token.value ? `Bearer ${token.value}` : ''
  }
});

// Extract the actual tree from your ResponseModel
const categories = computed(() => (response.value as any)?.data || []);
</script>

<template>
  <nav v-if="!pending && !error" class="category-menu">
    <ul class="flex gap-4 p-4" style="background-color: rgb(var(--color-card)); border-bottom: 1px solid rgb(var(--color-border))">
      <li v-for="category in categories" :key="category.id" class="relative group">
        <NuxtLink :to="`/category/${category.slug}`" class="hover:text-primary transition-colors font-medium">
          {{ category.name }}
        </NuxtLink>
        
        <!-- Render Children if they exist -->
        <ul v-if="category.children?.length" class="absolute left-0 mt-2 hidden group-hover:block w-48 p-2 rounded-lg shadow-lg z-20" style="background-color: rgb(var(--color-card)); border: 1px solid rgb(var(--color-border))">
          <li v-for="child in category.children" :key="child.id" class="py-1 px-2 hover:bg-gray-100 rounded transition-colors">
            <NuxtLink :to="`/category/${child.slug}`" class="block text-sm">
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  <div v-else-if="pending" class="p-4 text-sm opacity-60">
    Loading categories...
  </div>
</template>

<style scoped>
.text-primary {
  color: rgb(var(--color-primary));
}
</style>
