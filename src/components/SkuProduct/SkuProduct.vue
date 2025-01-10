<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">SKU Barcode Generator</h1>

    <!-- Product Name Input -->
    <div class="mb-2">
      <label for="productName" class="block font-medium">Product Name</label>
      <input
        id="productName"
        v-model="productName"
        type="text"
        class="border rounded px-2 py-1 w-full"
        placeholder="Enter product name" />
    </div>

    <!-- Product Category Dropdown -->
    <div class="mb-2">
      <label for="category" class="block font-medium">Product Category</label>
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

    <!-- Product Subcategory Dropdown -->
    <div class="mb-2">
      <label for="subCategory" class="block font-medium"
        >Product Subcategory</label
      >
      <select
        id="subCategory"
        v-model="subCategory"
        class="border rounded px-2 py-1 w-full">
        <option value="" disabled>Select subcategory</option>
        <option v-for="sub in subCategories" :key="sub" :value="sub">
          {{ sub }}
        </option>
      </select>
    </div>

    <!-- Product Type Dropdown -->
    <div class="mb-2">
      <label for="type" class="block font-medium">Product Type</label>
      <select id="type" v-model="type" class="border rounded px-2 py-1 w-full">
        <option value="" disabled>Select type</option>
        <option v-for="typ in types" :key="typ" :value="typ">
          {{ typ }}
        </option>
      </select>
    </div>

    <!-- Product Code Input -->
    <div class="mb-2">
      <label for="productCode" class="block font-medium">Product Code</label>
      <input
        id="productCode"
        v-model="productCode"
        type="text"
        class="border rounded px-2 py-1 w-full"
        placeholder="Enter product code" />
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

    <!-- Print Button -->
    <div v-if="skuCode" class="mt-4">
      <button
        @click="printBarcode"
        class="bg-green-500 text-white px-4 py-2 rounded">
        Print Barcode
      </button>
    </div>
  </div>
</template>

<script setup>
import JsBarcode from "jsbarcode";
// Dropdown options
const categories = ref(["Electronics", "Apparel", "Furniture"]);
const subCategories = ref(["Phone", "Shirt", "Chair"]);
const types = ref(["Smartphone", "T-shirt", "Office Chair"]);
const shapes = ref(["Round", "Square", "Rectangle"]);

// Product details
const productName = ref("");
const productCode = ref("");
const category = ref("");
const subCategory = ref("");
const type = ref("");
const shape = ref("");
const skuCode = ref("");

// Reference for barcode SVG
const barcodeSvg = ref(null);

// Function to generate SKU and barcode
async function generateSkuAndBarcode() {
  if (
    !productName.value ||
    !category.value ||
    !subCategory.value ||
    !type.value ||
    !productCode.value
  ) {
    alert("Please fill all fields.");
    return;
  }

  // Generate SKU code
  skuCode.value = `${category.value}-${subCategory.value}-${type.value}-${productCode.value}`;

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

// Function to print the barcode
function printBarcode() {
  const printWindow = window.open("", "_blank", "width=800,height=600");

  // Adjust A4 size paper dimensions (in mm)
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm

  printWindow.document.write("<html><head><style>");
  // CSS to scale content to A4 paper size
  printWindow.document.write(`
    body {
      margin: 0;
      padding: 0;
      width: ${pageWidth}mm;
      height: ${pageHeight}mm;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
    }
    .barcode-container {
      width: 48%; /* 4 columns -> 100%/4 = 25% for 4 items in a row with padding/margin */
      height: 2%; /* Adjust as needed */
      margin-bottom: 10mm; /* Space between rows */
      text-align: center;
    }
    .barcode-wrapper {
      width: 100%;
      height: auto;
      margin: 2mm 0;
    }
    .barcode-wrapper svg {
      max-width: 100%; /* Ensure barcode fits inside container */
    }
    h1 {
      font-size: 12pt;
      margin-bottom: 2mm;
    }
  `);
  printWindow.document.write("</style></head><body>");

  // Create a container for 4 barcodes per row (you can modify the number of iterations)
  const barcodeCount = 8; // For example, printing 8 barcodes (2 rows of 4)
  for (let i = 0; i < barcodeCount; i++) {
    printWindow.document.write("<div class='barcode-container'>");
    printWindow.document.write("<div class='barcode-wrapper'>");
    printWindow.document.write("<h1>Generated Barcode</h1>");
    printWindow.document.write(barcodeSvg.value.outerHTML); // Barcode SVG
    printWindow.document.write("</div>");
    printWindow.document.write("</div>");
  }

  printWindow.document.write("</body></html>");

  // Trigger the print dialog once content is loaded
  printWindow.document.close();
  printWindow.print();
}
</script>

<style scoped>
/* Custom styling if required */
</style>
