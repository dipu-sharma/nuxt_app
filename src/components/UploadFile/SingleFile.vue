<template>
    <div class="previewComponent">
        <div>
            <input class="fileInput" type="file" @change="handleFileChange" />
            <button class="submitButton">
                {{ props.details.type === 'image' ? 'Upload Image' : props.details.type === 'pdf' ? 'Upload Pdf' :
                    'Upload Excel' }}
            </button>
        </div>
        <div class="imgPreview">
            <!-- <img v-if="imagePreviewUrl" :src="imagePreviewUrl" /> -->
            <div class="errorText">{{ errorMessage }}</div>
        </div>
    </div>
</template>

<script setup>
import { validateFile } from '~/utils/common/validation';
const file = ref(null)
const imagePreviewUrl = ref('')
const errorMessage = ref('')
const emit = defineEmits({})
const props = defineProps({
    details: {}
});
const handleFileChange = (e) => {
    const reader = new FileReader();
    const selectedFile = e.target.files[0];

    const { valid, error } = validateFile(selectedFile, props.details.extension, props.details.type, props.details.size);
    if (!valid) {
        errorMessage.value = error;
        file.value = null;
        imagePreviewUrl.value = '';
        return;
    }

    reader.onloadend = () => {
        file.value = selectedFile;
        imagePreviewUrl.value = reader.result;
        errorMessage.value = '';

        emit('file-uploaded', {
            file: selectedFile,
            previewUrl: props.details.type === 'image' ? imagePreviewUrl.value : '',
            type: props.details.type,
        });
    };

    if (props.details.type === 'image') {
        reader.readAsDataURL(selectedFile)
    } else {
        reader.readAsArrayBuffer(selectedFile)
    }
};
</script>

<style scoped>
.previewComponent {
    text-align: center;
    position: relative;
    overflow: hidden;
    display: inline-block;
}

.previewComponent input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
}

.fileInput {
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
.fileInput:focus,
.fileInput:hover {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    background-color: #fff;
}

.submitButton {
    /* border: 2px solid gray; */
    color: rgb(255, 255, 255);
    background-color: rgb(31, 137, 163);
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 20px;
    font-weight: bold;
}

.imgPreview img {
    width: 200px;
    height: 200px;
}

.errorText {
    color: red;
    font-size: 14px;
    margin-top: 10px;
}
</style>