<template>
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-bold mb-4">Image to PDF Creator</h1>

		<!-- Image Upload -->
		<div class="mb-4">
			<label for="image-upload" class="block text-sm font-medium text-gray-700">Upload Images</label>
			<input
				id="image-upload"
				type="file"
				multiple
				accept="image/*"
				@change="handleImageUpload"
				class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
			/>
		</div>

		<!-- PDF Canvas -->
		<div v-if="images.length" class="relative mb-4 border-2 border-dashed border-gray-400" ref="canvas" style="aspect-ratio: 1 / 1.414; width: 100%; max-width: 600px;">
			<div v-for="image in images" :key="image.id" :id="'image-' + image.id" class="absolute touch-none" :style="{ transform: `translate(${image.x}px, ${image.y}px)`, width: `${image.width}px`, height: `${image.height}px` }">
				<img :src="image.src" class="w-full h-full" />
				<div class="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full cursor-pointer" @click="removeImage(image.id)">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
				</div>
			</div>
		</div>

		<!-- PDF Generation Button -->
		<div v-if="images.length">
			<button
				@click="generatePdf"
				:disabled="isGenerating"
				class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
			>
				{{ isGenerating ? 'Generating...' : 'Generate PDF' }}
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import interact from 'interactjs'
import jsPDF from 'jspdf'

const images = ref([])
const isGenerating = ref(false)
const canvas = ref(null)
let imageCounter = 0

const handleImageUpload = (event) => {
	const files = event.target.files
	for (let i = 0; i < files.length; i++) {
		const file = files[i]
		if (file.type.startsWith('image/')) {
			const reader = new FileReader()
			reader.onload = async (e) => {
				images.value.push({
					id: imageCounter++,
					src: e.target.result,
					x: 0,
					y: 0,
					width: 150, // Initial width
					height: 100, // Initial height
				})
				await nextTick()
				initInteract()
			}
			reader.readAsDataURL(file)
		}
	}
}

const removeImage = (id) => {
	images.value = images.value.filter((image) => image.id !== id)
}

const initInteract = () => {
	interact('.touch-none')
		.draggable({
			listeners: {
				move(event) {
					const target = event.target
					const image = images.value.find((img) => 'image-' + img.id === target.id)
					if (image) {
						image.x += event.dx
						image.y += event.dy
					}
				},
			},
			modifiers: [
				interact.modifiers.restrictRect({
					restriction: 'parent',
					endOnly: true,
				}),
			],
		})
		.resizable({
			edges: { left: true, right: true, bottom: true, top: true },
			listeners: {
				move(event) {
					const target = event.target
					const image = images.value.find((img) => 'image-' + img.id === target.id)
					if (image) {
						image.width = event.rect.width
						image.height = event.rect.height
						image.x += event.deltaRect.left
						image.y += event.deltaRect.top
					}
				},
			},
			modifiers: [
				interact.modifiers.restrictEdges({
					outer: 'parent',
				}),
				interact.modifiers.restrictSize({
					min: { width: 50, height: 50 },
				}),
			],
		})
}

onMounted(() => {
	if (images.value.length > 0) {
		initInteract()
	}
})

const generatePdf = async () => {
	if (isGenerating.value) return
	isGenerating.value = true

	const doc = new jsPDF('p', 'mm', 'a4') // A4 size in mm
	const a4Width = 210
	const a4Height = 297
	const canvasEl = canvas.value

	if (!canvasEl) {
		isGenerating.value = false
		return
	}

	const canvasWidth = canvasEl.offsetWidth
	const canvasHeight = canvasEl.offsetHeight

	const imagePromises = images.value.map((image) => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = image.src
			img.onload = () => {
				const scaleX = a4Width / canvasWidth
				const scaleY = a4Height / canvasHeight

				const pdfImgX = image.x * scaleX
				const pdfImgY = image.y * scaleY
				const pdfImgWidth = image.width * scaleX
				const pdfImgHeight = image.height * scaleY

				doc.addImage(image.src, 'JPEG', pdfImgX, pdfImgY, pdfImgWidth, pdfImgHeight)
				resolve()
			}
			img.onerror = reject
		})
	})

	try {
		await Promise.all(imagePromises)
		doc.save('custom-layout.pdf')
	} catch (error) {
		console.error('Error generating PDF:', error)
	} finally {
		isGenerating.value = false
	}
}
</script>

<style>
.touch-none {
	touch-action: none;
	box-sizing: border-box;
	border: 1px solid #4299e1;
}
</style>