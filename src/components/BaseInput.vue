<template>
    <div>
        <label class="px-2 text-black font-semibold">{{ label }}</label>
        <input 
        :placeholder="label" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="field py-1 text-center rounded-md" />
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Number],
            default: ''
        }
    }
}
</script>