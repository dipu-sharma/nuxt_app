<template>
	<v-dialog v-model="isOpen" persistent :max-width="maxWidth" :content-class="isChat ? 'chat-dialog' : ''">
		<v-card class="p-4">
			<v-card-title>
				<div class="flex justify-between items-center">
					<div
						class="w-full"
						:class="{
							'justify-start items-start': title_align === 'left',
							'justify-center items-center': title_align === 'center',
							'justify-end items-end': title_align === 'right',
						}"
					>
						<span class="text-xl font-bold text-[#299D91]">{{ title }}</span>
					</div>
					<span class="text-2xl cursor-pointer" @click="closeDialog">&times;</span>
				</div>
			</v-card-title>

			<v-card-text>
				<v-form ref="form">
					<slot name="content"> Default content goes here... </slot>
				</v-form>
			</v-card-text>

			<v-card-actions v-if="showYesNoButton" class="justify-center m-auto">
				<v-spacer />
				<div class="flex justify-center">
					<button
						@click="createData('no')"
						type="button"
						class="bg-gray-100 text-black py-2 px-4 rounded"
					>
						NO
					</button>
				</div>
				<div class="flex justify-center p-2">
					<button
						type="submit"
						@click="createData('yes')"
						class="text-white py-2 px-4 rounded bg-[#299D91]"
					>
						Yes
					</button>
				</div>
			</v-card-actions>
			<v-card-actions v-if="showButton" class="justify-center">
				<v-spacer />
				<div class="flex justify-center">
					<button @click="closeDialog" type="button" class="bg-gray-100 text-black py-2 px-4 rounded">
						Cancel
					</button>
				</div>
				<div class="flex justify-center p-2">
					<button
						type="submit"
						@click="submit"
						:class="{
							'bg-red-600': buttonText.toLowerCase() === 'delete',
							'bg-[#299D91]': buttonText.toLowerCase() !== 'delete',
							'text-white py-2 px-4 rounded': true,
						}"
					>
						{{ buttonText }}
					</button>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script setup>
const form = ref(null)

const props = defineProps({
	modelValue: Boolean,
	title: { type: String, default: 'Confirm Action' },
	buttonText: { type: String, default: 'OK' },
	maxWidth: { type: String, default: '500px' },
	showButton: { type: Boolean, default: true },
	showYesNoButton: { type: Boolean, default: false },
	isChat: { type: Boolean, default: false },
	title_align: { type: String, default: 'center' },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'yes', 'no'])

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
})

const closeDialog = () => {
	emit('update:modelValue', false)
}
const createData = (value) => {
	console.log('value', value)
	if (value == 'yes') {
		emit('yes')
	} else {
		emit('no')
	}
}

const submit = async () => {
	if (!form.value) {
		console.error('Form reference is undefined in Dialog.vue')
		return
	}

	const { valid } = await form.value.validate()

	if (valid) {
		emit('confirm')
	} else {
		emit('update:modelValue', true)
	}
}
</script>

<style>
.chat-dialog {
	position: fixed !important;
	right: 20px;
	bottom: 20px;
}
</style>
