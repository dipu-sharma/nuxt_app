<template>
    <v-container class="pa-2">
        <v-btn @click="dialog = true" color="primary" class="text-white">
            {{ formattedTime || buttonLabel }}
        </v-btn>

        <v-dialog v-model="dialog" max-width="290">
            <v-text-field density="compact" variant="outlined" v-model.trim="payload.visit_time" :active="menu2"
                :focus="menu2" label="Visit Time" prepend-inner-icon="mdi-clock-time-four-outline" readonly
                placeholder="Enter Time" @click="menu2 = true" :disabled="!payload.visit_date">
                <v-menu v-model="menu2" :close-on-content-click="false" activator="parent"
                    transition="scale-transition">
                    <v-time-picker :format="24" :min="isToday(payload.visit_date) ? currentTime : undefined"
                        :allowed-minutes="allowedStep" v-if="menu2" v-model="payload.visit_time" full-width
                        color="blue-lighten-1"></v-time-picker>
                </v-menu>
            </v-text-field>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
const menu2 = ref(false)
const props = defineProps({
    modelValue: {
        type: String,
        default: '12:00 AM',
    },
    buttonLabel: {
        type: String,
        default: 'Select Time',
    }
})

const emits = defineEmits(['update:modelValue'])
const payload = ref({
    visit_time: ''
})
const dialog = ref(false)
const time = ref(props.modelValue)

const formattedTime = computed(() => {
    return time.value ? time.value : ''
})

const cancel = () => {
    dialog.value = false
}

const confirm = () => {
    emits('update:modelValue', time.value)
    dialog.value = false
}
</script>

<style scoped></style>
