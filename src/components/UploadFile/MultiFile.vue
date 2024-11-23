<template>
    <div class="multifile-upload">
        <div class="multiple-files">
            <input class="multifilesInput" type="file" multiple @change="handleImageChange" />
            <button class="submitButton" type="submit">Upload Images</button>
        </div>

        <div class="imgPreviews">
            <!-- <div v-for="(file, index) in files" :key="index" class="imgPreview">
                <div v-if="file.preview">
                    <img :src="file.preview" />
                    <button class="removeButton" @click="removeImage(index)">✖</button>
                </div>
                <div v-else class="previewText">
                    No preview available
                </div>
            </div> -->
        </div>
        <p v-if="errorMessage" class="errorText">{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { validateFile } from '~/utils/common/validation';
const emit = defineEmits({})
const files = ref([])
const selectedFiles = Array // Array of files with their previews
const errorMessage = ref('')
const allowedExtensions = ['png', 'jpeg', 'jpg']

const handleSubmit = (e) => {
    e.preventDefault()
    if (files.value.length > 0) {
        console.log('Uploading files:', files.value)
    } else {
        console.log('No files to upload')
    }
}

// Function to handle image changes
const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = []

    errorMessage.value = ''

    selectedFiles.forEach((file) => {
        const { valid, error } = validateFile(file, allowedExtensions, 'image')
        if (valid) {
            const reader = new FileReader()
            reader.onloadend = () => {
                validFiles.push({
                    file,
                    preview: reader.result,
                })
                files.value = [...files.value, ...validFiles]
                emit('files-uploaded', { files: files.value })

            }
            reader.readAsDataURL(file)
        } else {
            errorMessage.value = error
        }
    })
}

const removeImage = (index) => {
    files.value.splice(index, 1)
    selectedFiles.value.splice(index, 1)
}
</script>

<style scoped>
.multifile-upload {
    text-align: center;
    position: relative;
    overflow: hidden;
    display: inline-block;
}

.multifile-upload input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
}

.multifilesInput {
    padding: 10px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 100%;
    max-width: 300px;
    background-color: #f9f9f9;
    cursor: pointer;
}

/* Focus and hover effects */
.multifilesInput:focus,
.multifilesInput:hover {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    background-color: #fff;
}

.imgPreviews {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
}

.imgPreview {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.submitButton {
    /* border: 2px solid gray; */
    color: rgb(255, 255, 255);
    background-color: rgb(94, 97, 233);
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
}

.imgPreview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}

.previewText {
    font-size: 12px;
    color: #ccc;
    text-align: center;
}

.errorText {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}

.removeButton {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
}

/* Remove button hover effect */
.removeButton:hover {
    background: #ff1a1a;
}
</style>
