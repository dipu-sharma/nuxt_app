<template>
  <v-dialog v-model="isDialogOpen" max-width="600px" persistent>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>{{ props.title }}</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text>
        <!-- Slot for custom form or content -->
        <slot name="content"></slot>
      </v-card-text>

      <v-divider />

      <div class="flex justify-end gap-2" v-if="!props.is_button_disabled">
        <button
          @click="closeDialog"
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          color="primary"
          @click="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          {{ props.button_text }}
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: "Dialog Title",
  },
  button_text: {
    type: String,
    default: "Save",
  },
  is_button_disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update", "submit", "cancel"]);

const isDialogOpen = ref(false);

watch(
  () => props?.modelValue,
  (newVal) => {
    isDialogOpen.value = newVal;
  },
  { immediate: true }
);

function closeDialog() {
  isDialogOpen.value = false;
  emits("update", false);
}

function submit() {
  emits("submit");
}
function cancelDialog() {
  emits("cancel");
}
</script>

<style scoped>
.v-card {
  min-height: 200px;
}
</style>
