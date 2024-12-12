<template>
    <div class="relative">
        <input type="text"
            class="pl-2 py-2 px-8 pr-10 text-sm text-gray-700 border-2 border-green-500 outline-green-500 focus:outline-2 rounded-lg"
            placeholder="Enter text" v-model="inputValue" @input="handleInput" />
        <label class="absolute ml-4 top-1/2 left-40 -translate-y-1/2 cursor-pointer">
            <input type="file" @change="handleFileChange" style="display: none" />
            <span class="mdi mdi-tray-arrow-up"></span>
        </label>
        <p class="text-green-500 text-sm ">{{ file?.name }}</p>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:inputValue', 'update:file'])
const inputValue = ref('');

const file = ref(null)

const handleInput = () => {
    emit('update:inputValue', inputValue.value)
}

const handleFileChange = (event) => {
    file.value = event.target.files[0]
    emit('update:file', file.value)
}
</script>

<style scoped>
.input-group {
    display: flex;
    align-items: center;
}

.input-group-text {
    cursor: pointer;
}
</style>