<template>
  <v-form ref="form">
    <div class="bw-flex bw-gap-4 bw-block bw-mb-2">
      <div class="bw-w-full sm:bw-w-full">
        <label class="bw-block bw-mb-2">Delivery / Invoice</label>
        <v-text-field
          density="compact"
          variant="outlined"
          :rules="[required]"
          v-model="paymentTerms.deliveryInvoice"
          placeholder="Enter first name"
          required
          clearable
        />
      </div>
    </div>

    <div class="bw-flex bw-gap-4 bw-block bw-mb-2">
      <div class="bw-w-full sm:bw-w-full">
        <label class="bw-block bw-mb-2">Advance</label>
        <v-text-field
          density="compact"
          variant="outlined"
          :rules="[required]"
          v-model="paymentTerms.advance"
          placeholder="Enter advance"
          required
          clearable
        />
      </div>
    </div>

    <div class="bw-flex bw-gap-4 bw-block bw-mb-2">
      <div class="bw-w-full sm:bw-w-full">
        <label class="bw-block bw-mb-2">After Implementation</label>
        <v-text-field
          density="compact"
          variant="outlined"
          :rules="[required]"
          v-model="paymentTerms.afterImplementation"
          placeholder="Enter implementation details"
          required
          clearable
        />
      </div>
    </div>

    <div class="bw-flex bw-gap-4 bw-block bw-mb-2">
      <div class="bw-w-full sm:bw-w-1/2">
        <div class="bw-flex bw-gap-2 bw-items-center">
          <input
            v-model="paymentTerms.selected_period"
            value="credit"
            type="radio"
          />
          <label class="bw-block">Credit Period</label>
        </div>
        <v-autocomplete
          density="compact"
          variant="outlined"
          :rules="[required]"
          v-model="paymentTerms.credit_period"
          :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
          placeholder="Select Days"
          required
          :disabled="paymentTerms.selected_period == 'within'"
          clearable
        />
      </div>
      <div class="bw-w-full sm:bw-w-1/2">
        <div class="bw-flex bw-gap-2 bw-items-center">
          <input
            v-model="paymentTerms.selected_period"
            value="within"
            type="radio"
          />
          <label class="bw-block">Within Period</label>
        </div>
        <v-autocomplete
          density="compact"
          variant="outlined"
          :rules="[required]"
          v-model="paymentTerms.within_period"
          :items="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
          placeholder="Select Days"
          required
          :disabled="paymentTerms.selected_period == 'credit'"
          clearable
        />
      </div>
    </div>
  </v-form>
</template>

<script setup>
const props = defineProps({
  modelValue: Object,
});
const emit = defineEmits(["update:modelValue"]);
const paymentTerms = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<style scoped></style>
