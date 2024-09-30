<template>
    <div class="previewComponent">
        <form @submit.prevent="handleSubmit">
            <input class="fileInput" type="file" @change="handleImageChange" />
            <button class="submitButton" type="submit">Upload Image</button>
        </form>
        <div class="imgPreview">
            <img v-if="imagePreviewUrl" :src="imagePreviewUrl" />
            <div v-else class="previewText">Please select an Image for Preview</div>
        </div>
    </div>
</template>

<script setup>
// Reactive variables to store file and preview URL
const file = ref(null)
const imagePreviewUrl = ref('')

// Function to handle the form submission
const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Handle file uploading logic here
    console.log('Uploading file:', file.value)
}

// Function to handle the image change
const handleImageChange = (e) => {
    const reader = new FileReader()
    const selectedFile = e.target.files[0]

    if (selectedFile) {
        reader.onloadend = () => {
            file.value = selectedFile
            imagePreviewUrl.value = reader.result
        }
        reader.readAsDataURL(selectedFile)
    }
}
</script>

<style scoped>
.previewComponent {
    text-align: center;
}

.imgPreview img {
    width: 200px;
    height: 200px;
}

.previewText {
    font-size: 16px;
    color: #ccc;
}
</style>