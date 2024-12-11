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

            <v-card-actions>
                <v-spacer />
                <v-btn type="button" @click="cancelDialog">Cancel</v-btn>
                <v-btn color="primary" @click="submit">{{ props.button_text }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        default: 'Dialog Title'
    },
    button_text: {
        type: String,
        default: 'Save'
    }
})

const emits = defineEmits(['update', 'submit', 'cancel'])

const isDialogOpen = ref(false)

watch(
    () => props?.modelValue,
    (newVal) => {
        isDialogOpen.value = newVal
    },
    { immediate: true }
)

function closeDialog() {
    isDialogOpen.value = false
    emits('update', false)
}

function submit() {
    emits('submit')
}
function cancelDialog() {
    emits('cancel')
}
</script>

<style scoped>
.v-card {
    min-height: 200px;
}
</style>
