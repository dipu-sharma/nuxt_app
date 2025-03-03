<template>
  <div class="text-center">
    <h2 class="text-center font-bold pt-5">Doss Page</h2>
    <div>
      <GridsLight />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Admin",
  description: "Learn more about our company",
  layout: "admin", // Use the 'admin' layout created above
  middleware: ["auth-role"],
  role: ["admin"],
});
</script>
