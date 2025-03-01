<template>
  <div>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
    <div ref="observer" v-if="loading" class="loading">Loading...</div>
  </div>
</template>

<script setup>
import axios from "axios";

const items = ref([]);
const page = ref(1);
const loading = ref(false);
const observer = ref(null);

const loadMoreItems = async () => {
  loading.value = true;
  try {
    const response = await axios.get(
      `https://api.example.com/items?page=${page.value}`
    );
    items.value.push(...response.data);
    page.value++;
  } catch (error) {
    console.error("Error loading items:", error);
  } finally {
    loading.value = false;
  }
};

const observe = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadMoreItems();
    }
  });
};

onMounted(() => {
  observer.value = new IntersectionObserver(observe, { threshold: 1.0 });
  observer.value.observe(document.querySelector(".loading"));
});

watch(page, (newPage, oldPage) => {
  if (newPage !== oldPage) {
    loadMoreItems();
  }
});
</script>

<style>
.loading {
  text-align: center;
  padding: 20px;
}
</style>
