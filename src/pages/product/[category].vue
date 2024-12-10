<template>
  <div>
    <h1 class="text-center font-bold">{{ category }} Products</h1>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
    <div class="col-span-12 md:col-span-2 bg-white ml-2 mr-2 shadow-lg rounded-md">
      <h2 class="text-center">{{ category }}</h2>
    </div>
    <div class="col-span-12 md:col-span-10 bg-white ml-2 mr-2 shadow-lg rounded-md">
      <h2 class="text-center">{{ category }} Product</h2>
    </div>
  </div>
  <div class="text-center justify-center mt-5">
    <Watch />
    <WatchCompute />
    <Onmounted />
    <!-- Base input fields -->
    <BaseInput v-model="event.title" label="Title" type="text" />
    <BaseInput v-model="event.first_name" label="First Name" type="text" />
    <BaseInput v-model="event.last_name" label="Last Name" type="text" />
    <v-text-field v-model="mobileNumber" label="Mobile" class="w-2/6" type="tel" inputmode="numeric" maxlength="10"
      :rules="[isRequiredRule, isMobileRule]" required />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { isMobile, isRequired } from '~/utils/common/validation';

const route = useRoute();
const category = route.params.category;
const event = ref({
  title: '',
  first_name: '',
  last_name: ''
});
const mobileNumber = ref('');

const isMobileRule = (value) => {
  const result = isMobile(value);
  return result.valid || result.error;
};

const isRequiredRule = (value) => {
  const result = isRequired(value);
  return result.valid || result.error;
};

</script>