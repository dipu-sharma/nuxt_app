<template>
	<div class="image-uploader" :class="{ 'is-glass': isGlassmorphism }">
		<!-- Upload Area -->
		<div
			v-if="!modelValue || (multiple && (!modelValue || modelValue.length === 0))"
			class="upload-area"
			:class="{ 'is-dragging': isDragging }"
			:style="uploadAreaStyle"
			@click="triggerFileInput"
			@dragover.prevent="handleDragOver"
			@dragleave.prevent="handleDragLeave"
			@drop.prevent="handleDrop"
		>
			<Icon name="mdi:cloud-upload" class="upload-icon" />
			<p class="upload-text">
				<span class="upload-action">Click to upload</span> or drag and drop
			</p>
			<p class="upload-hint">{{ accept || 'PNG, JPG or GIF' }} (max {{ maxSizeMB }}MB)</p>
		</div>

		<!-- Image Preview (Single) -->
		<div v-else-if="!multiple && modelValue" class="preview-container">
			<div class="image-preview" :style="previewStyle">
				<img :src="getPreviewUrl(modelValue)" alt="Preview" class="preview-image" />
				<div class="preview-overlay">
					<button @click.stop="removeImage" class="btn-remove" title="Remove">
						<Icon name="mdi:delete" />
					</button>
					<button @click.stop="triggerFileInput" class="btn-change" title="Change">
						<Icon name="mdi:pencil" />
					</button>
				</div>
			</div>
		</div>

		<!-- Multiple Images Preview -->
		<div v-else-if="multiple && modelValue && modelValue.length > 0" class="preview-grid">
			<div
				v-for="(image, index) in modelValue"
				:key="index"
				class="image-preview"
				:style="previewStyle"
			>
				<img :src="getPreviewUrl(image)" alt="Preview" class="preview-image" />
				<div class="preview-overlay">
					<button @click.stop="removeImageAt(index)" class="btn-remove" title="Remove">
						<Icon name="mdi:delete" />
					</button>
					<button
						v-if="index > 0"
						@click.stop="moveImage(index, 'left')"
						class="btn-move"
						title="Move left"
					>
						<Icon name="mdi:chevron-left" />
					</button>
					<button
						v-if="index < modelValue.length - 1"
						@click.stop="moveImage(index, 'right')"
						class="btn-move"
						title="Move right"
					>
						<Icon name="mdi:chevron-right" />
					</button>
				</div>
				<span v-if="index === 0" class="primary-badge">Primary</span>
			</div>

			<!-- Add More Button -->
			<div
				v-if="!maxFiles || modelValue.length < maxFiles"
				class="add-more-box"
				:style="uploadAreaStyle"
				@click="triggerFileInput"
			>
				<Icon name="mdi:plus" class="add-icon" />
				<span>Add More</span>
			</div>
		</div>

		<!-- Hidden File Input -->
		<input
			ref="fileInput"
			type="file"
			:accept="accept"
			:multiple="multiple"
			class="file-input-hidden"
			@change="handleFileSelect"
		/>

		<!-- Error Message -->
		<div v-if="errorMessage" class="error-message">
			<Icon name="mdi:alert-circle" class="error-icon" />
			{{ errorMessage }}
		</div>

		<!-- Upload Progress -->
		<div v-if="isUploading" class="upload-progress">
			<div class="progress-bar">
				<div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
			</div>
			<span class="progress-text">{{ uploadProgress }}%</span>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeIntegration } from '@/composables/useThemeIntegration'

const props = defineProps({
	modelValue: {
		type: [String, Array, File, Object],
		default: null
	},
	multiple: {
		type: Boolean,
		default: false
	},
	accept: {
		type: String,
		default: 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
	},
	maxSize: {
		type: Number,
		default: 5 * 1024 * 1024 // 5MB
	},
	maxFiles: {
		type: Number,
		default: 5
	},
	compress: {
		type: Boolean,
		default: true
	},
	previewWidth: {
		type: String,
		default: '200px'
	},
	previewHeight: {
		type: String,
		default: '200px'
	}
})

const emit = defineEmits(['update:modelValue', 'upload', 'error'])

const { isGlassmorphism, getRGBColor } = useThemeIntegration()

// State
const fileInput = ref(null)
const isDragging = ref(false)
const errorMessage = ref('')
const isUploading = ref(false)
const uploadProgress = ref(0)

// Computed
const maxSizeMB = computed(() => {
	return (props.maxSize / (1024 * 1024)).toFixed(0)
})

const uploadAreaStyle = computed(() => {
	if (isGlassmorphism.value) {
		return {
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
			borderColor: 'rgba(255, 255, 255, 0.2)',
			backdropFilter: 'blur(10px)'
		}
	}
	return {
		backgroundColor: getRGBColor('secondary'),
		borderColor: getRGBColor('border')
	}
})

const previewStyle = computed(() => ({
	width: props.previewWidth,
	height: props.previewHeight
}))

// Methods
const triggerFileInput = () => {
	errorMessage.value = ''
	fileInput.value?.click()
}

const handleFileSelect = (event) => {
	const files = Array.from(event.target.files)
	processFiles(files)
	event.target.value = '' // Reset input
}

const handleDragOver = () => {
	isDragging.value = true
}

const handleDragLeave = () => {
	isDragging.value = false
}

const handleDrop = (event) => {
	isDragging.value = false
	const files = Array.from(event.dataTransfer.files)
	processFiles(files)
}

const processFiles = async (files) => {
	errorMessage.value = ''

	// Validate files
	const validFiles = []
	for (const file of files) {
		// Check file type
		if (props.accept && !props.accept.split(',').some(type => file.type.match(type.trim()))) {
			errorMessage.value = `Invalid file type: ${file.name}`
			continue
		}

		// Check file size
		if (file.size > props.maxSize) {
			errorMessage.value = `File too large: ${file.name} (max ${maxSizeMB.value}MB)`
			continue
		}

		validFiles.push(file)
	}

	if (validFiles.length === 0) return

	// Check max files limit
	if (props.multiple) {
		const currentCount = Array.isArray(props.modelValue) ? props.modelValue.length : 0
		const totalCount = currentCount + validFiles.length
		if (props.maxFiles && totalCount > props.maxFiles) {
			errorMessage.value = `Maximum ${props.maxFiles} files allowed`
			return
		}
	}

	// Process files
	try {
		if (props.compress) {
			isUploading.value = true
			const compressedFiles = await compressImages(validFiles)
			updateValue(compressedFiles)
		} else {
			updateValue(validFiles)
		}

		emit('upload', validFiles)
	} catch (error) {
		errorMessage.value = 'Error processing images'
		emit('error', error)
	} finally {
		isUploading.value = false
		uploadProgress.value = 0
	}
}

const compressImages = async (files) => {
	const compressed = []
	for (let i = 0; i < files.length; i++) {
		uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
		const compressedFile = await compressImage(files[i])
		compressed.push(compressedFile)
	}
	return compressed
}

const compressImage = (file) => {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const img = new Image()
			img.onload = () => {
				const canvas = document.createElement('canvas')
				const MAX_WIDTH = 1920
				const MAX_HEIGHT = 1080

				let width = img.width
				let height = img.height

				if (width > height) {
					if (width > MAX_WIDTH) {
						height *= MAX_WIDTH / width
						width = MAX_WIDTH
					}
				} else {
					if (height > MAX_HEIGHT) {
						width *= MAX_HEIGHT / height
						height = MAX_HEIGHT
					}
				}

				canvas.width = width
				canvas.height = height

				const ctx = canvas.getContext('2d')
				ctx.drawImage(img, 0, 0, width, height)

				canvas.toBlob(
					(blob) => {
						const compressedFile = new File([blob], file.name, {
							type: file.type,
							lastModified: Date.now()
						})
						resolve(compressedFile)
					},
					file.type,
					0.8
				)
			}
			img.src = e.target.result
		}
		reader.readAsDataURL(file)
	})
}

const updateValue = (files) => {
	if (props.multiple) {
		const current = Array.isArray(props.modelValue) ? props.modelValue : []
		emit('update:modelValue', [...current, ...files])
	} else {
		emit('update:modelValue', files[0])
	}
}

const removeImage = () => {
	emit('update:modelValue', null)
}

const removeImageAt = (index) => {
	const images = [...props.modelValue]
	images.splice(index, 1)
	emit('update:modelValue', images.length > 0 ? images : null)
}

const moveImage = (index, direction) => {
	const images = [...props.modelValue]
	const newIndex = direction === 'left' ? index - 1 : index + 1

	if (newIndex >= 0 && newIndex < images.length) {
		const temp = images[index]
		images[index] = images[newIndex]
		images[newIndex] = temp
		emit('update:modelValue', images)
	}
}

const getPreviewUrl = (file) => {
	if (typeof file === 'string') {
		return file
	}
	if (file instanceof File) {
		return URL.createObjectURL(file)
	}
	if (file && file.url) {
		return file.url
	}
	return ''
}
</script>

<style scoped>
.image-uploader {
	width: 100%;
}

.upload-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 3rem 2rem;
	border: 2px dashed;
	border-radius: 0.75rem;
	cursor: pointer;
	transition: all 0.3s ease;
}

.upload-area:hover,
.upload-area.is-dragging {
	border-color: rgb(var(--color-primary));
	background-color: rgba(var(--color-primary) / 0.05);
	transform: scale(1.02);
}

.upload-icon {
	font-size: 3rem;
	color: rgb(var(--color-primary));
	margin-bottom: 1rem;
}

.upload-text {
	font-size: 1rem;
	color: rgb(var(--color-text));
	margin: 0;
}

.upload-action {
	color: rgb(var(--color-primary));
	font-weight: 600;
}

.upload-hint {
	font-size: 0.875rem;
	color: rgb(var(--color-text) / 0.6);
	margin: 0.5rem 0 0;
}

.preview-container {
	display: flex;
	justify-content: center;
}

.preview-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
}

.image-preview {
	position: relative;
	border-radius: 0.75rem;
	overflow: hidden;
	border: 2px solid rgb(var(--color-border));
	background-color: rgb(var(--color-secondary));
}

.preview-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}

.preview-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	opacity: 0;
	transition: opacity 0.3s ease;
}

.image-preview:hover .preview-overlay {
	opacity: 1;
}

.btn-remove,
.btn-change,
.btn-move {
	padding: 0.5rem;
	background: rgba(255, 255, 255, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: 0.375rem;
	color: white;
	cursor: pointer;
	transition: all 0.3s ease;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.btn-remove:hover {
	background: #EF4444;
	border-color: #EF4444;
}

.btn-change:hover,
.btn-move:hover {
	background: rgb(var(--color-primary));
	border-color: rgb(var(--color-primary));
}

.primary-badge {
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	padding: 0.25rem 0.5rem;
	background: rgb(var(--color-primary));
	color: white;
	font-size: 0.75rem;
	font-weight: 600;
	border-radius: 0.25rem;
}

.add-more-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 2px dashed;
	border-radius: 0.75rem;
	cursor: pointer;
	transition: all 0.3s ease;
	min-height: 200px;
}

.add-more-box:hover {
	border-color: rgb(var(--color-primary));
	background-color: rgba(var(--color-primary) / 0.05);
}

.add-icon {
	font-size: 2rem;
	color: rgb(var(--color-primary));
	margin-bottom: 0.5rem;
}

.file-input-hidden {
	display: none;
}

.error-message {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	margin-top: 0.75rem;
	padding: 0.75rem;
	background-color: #FEE2E2;
	color: #DC2626;
	border-radius: 0.5rem;
	font-size: 0.875rem;
}

.error-icon {
	font-size: 1.25rem;
}

.upload-progress {
	margin-top: 1rem;
	display: flex;
	align-items: center;
	gap: 1rem;
}

.progress-bar {
	flex: 1;
	height: 0.5rem;
	background-color: rgb(var(--color-secondary));
	border-radius: 9999px;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background-color: rgb(var(--color-primary));
	transition: width 0.3s ease;
}

.progress-text {
	font-size: 0.875rem;
	font-weight: 600;
	color: rgb(var(--color-text));
	min-width: 3rem;
	text-align: right;
}

@media (max-width: 768px) {
	.preview-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}

	.upload-area {
		padding: 2rem 1rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.upload-area,
	.preview-overlay,
	.btn-remove,
	.btn-change,
	.btn-move,
	.add-more-box {
		transition: none;
		transform: none !important;
	}
}
</style>
