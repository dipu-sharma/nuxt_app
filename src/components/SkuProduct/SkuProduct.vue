<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">SKU Barcode Generator</h1>

    <!-- Dropdown for Category -->
    <div class="mb-2">
      <label for="category" class="block font-medium">Category</label>
      <select
        id="category"
        v-model="category"
        class="border rounded px-2 py-1 w-full">
        <option value="" disabled>Select category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
    </div>

    <!-- Dropdown for Type -->
    <div class="mb-2">
      <label for="type" class="block font-medium">Type</label>
      <select id="type" v-model="type" class="border rounded px-2 py-1 w-full">
        <option value="" disabled>Select type</option>
        <option v-for="typ in types" :key="typ" :value="typ">{{ typ }}</option>
      </select>
    </div>

    <!-- Dropdown for Shape -->
    <div class="mb-2">
      <label for="shape" class="block font-medium">Shape</label>
      <select
        id="shape"
        v-model="shape"
        class="border rounded px-2 py-1 w-full">
        <option value="" disabled>Select shape</option>
        <option v-for="shp in shapes" :key="shp" :value="shp">{{ shp }}</option>
      </select>
    </div>

    <!-- Generate SKU Button -->
    <button
      @click="generateSkuAndBarcode"
      class="bg-blue-500 text-white px-4 py-2 rounded mt-4">
      Generate SKU and Barcode
    </button>

    <!-- Display SKU -->
    <div v-if="skuCode" class="mt-4">
      <h2 class="text-lg font-bold">Generated SKU:</h2>
      <p class="text-green-600 font-mono">{{ skuCode }}</p>
    </div>

    <!-- Display Barcode -->
    <div v-if="skuCode" class="mt-4">
      <h2 class="text-lg font-bold">Generated Barcode:</h2>
      <svg
        ref="barcodeSvg"
        :class="[{ 'w-48 h-32': !skuCode, 'w-72 h-40': skuCode }]"></svg>
    </div>
  </div>
</template>

<script setup>
import JsBarcode from "jsbarcode";

// Dropdown options
const categories = ref(["Electronics", "Apparel", "Furniture"]);
const types = ref(["Phone", "Shirt", "Chair"]);
const shapes = ref(["Round", "Square", "Rectangle"]);

// Selected values
const category = ref("");
const type = ref("");
const shape = ref("");
const skuCode = ref("");

// Reference for barcode SVG
const barcodeSvg = ref(null);

// Function to generate SKU and barcode
async function generateSkuAndBarcode() {
  if (!category.value || !type.value || !shape.value) {
    alert("Please select all fields.");
    return;
  }

  // Generate SKU code
  skuCode.value = [category.value, type.value, shape.value]
    .map((item) => item.toUpperCase())
    .join("-");

  // Ensure the SVG element is ready before using JsBarcode
  await nextTick();
  if (barcodeSvg.value) {
    JsBarcode(barcodeSvg.value, skuCode.value, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 50,
      displayValue: true,
    });
  } else {
    console.error("Barcode SVG element is not available.");
  }
}

// Re-generate barcode if SKU changes
watch(skuCode, async (newSku) => {
  if (newSku) {
    await nextTick();
    if (barcodeSvg.value) {
      JsBarcode(barcodeSvg.value, newSku, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
      });
    } else {
      console.error("Barcode SVG element is not available.");
    }
  }
});
</script>

<style scoped>
/* Custom styling if required */
</style>
