<template>
	<div class="form-field" :class="fieldClasses">
		<label v-if="label" :for="fieldId" class="field-label">
			{{ label }}
			<span v-if="required" class="required-indicator">*</span>
		</label>

		<!-- Text Input -->
		<input
			v-if="type === 'text' || type === 'email' || type === 'password' || type === 'number' || type === 'tel'"
			:id="fieldId"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:class="inputClasses"
			:style="inputStyle"
			@input="handleInput"
			@blur="handleBlur"
			@focus="handleFocus"
		/>

		<!-- Textarea -->
		<textarea
			v-else-if="type === 'textarea'"
			:id="fieldId"
			:value="modelValue"
			:placeholder="placeholder"
			:disabled="disabled"
			:readonly="readonly"
			:rows="rows"
			:class="inputClasses"
			:style="inputStyle"
			@input="handleInput"
			@blur="handleBlur"
			@focus="handleFocus"
		></textarea>

		<!-- Select -->
		<select
			v-else-if="type === 'select'"
			:id="fieldId"
			:value="modelValue"
			:disabled="disabled"
			:class="inputClasses"
			:style="inputStyle"
			@change="handleInput"
			@blur="handleBlur"
			@focus="handleFocus"
		>
			<option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value"
			>
				{{ option.label }}
			</option>
		</select>

		<!-- Date Input -->
		<input
			v-else-if="type === 'date'"
			:id="fieldId"
			type="date"
			:value="modelValue"
			:disabled="disabled"
			:readonly="readonly"
			:class="inputClasses"
			:style="inputStyle"
			@input="handleInput"
			@blur="handleBlur"
			@focus="handleFocus"
		/>

		<!-- File Input -->
		<input
			v-else-if="type === 'file'"
			:id="fieldId"
			type="file"
			:accept="accept"
			:multiple="multiple"
			:disabled="disabled"
			:class="inputClasses"
			@change="handleFileInput"
		/>

		<!-- Helper Text -->
		<div v-if="helperText && !errorMessage" class="helper-text">
			{{ helperText }}
		</div>

		<!-- Error Message -->
		<div v-if="errorMessage" class="error-message">
			<Icon name="mdi:alert-circle" class="error-icon" />
			{{ errorMessage }}
		</div>

		<!-- Character Counter -->
		<div v-if="maxLength && type === 'textarea'" class="character-counter">
			{{ characterCount }} / {{ maxLength }}
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeIntegration } from '@/composables/useThemeIntegration'

const props = defineProps({
	modelValue: {
		type: [String, Number, Array],
		default: ''
	},
	type: {
		type: String,
		default: 'text',
		validator: (value) => [
			'text', 'email', 'password', 'number', 'tel',
			'textarea', 'select', 'date', 'file'
		].includes(value)
	},
	label: {
		type: String,
		default: ''
	},
	placeholder: {
		type: String,
		default: ''
	},
	helperText: {
		type: String,
		default: ''
	},
	required: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	readonly: {
		type: Boolean,
		default: false
	},
	rules: {
		type: Array,
		default: () => []
	},
	options: {
		type: Array,
		default: () => []
	},
	rows: {
		type: Number,
		default: 4
	},
	maxLength: {
		type: Number,
		default: null
	},
	accept: {
		type: String,
		default: ''
	},
	multiple: {
		type: Boolean,
		default: false
	},
	variant: {
		type: String,
		default: 'outlined',
		validator: (value) => ['outlined', 'filled', 'glass'].includes(value)
	}
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change'])

const { isGlassmorphism, getRGBColor, getRGBAColor } = useThemeIntegration()

// State
const fieldId = ref(`field-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)
const isTouched = ref(false)
const errorMessage = ref('')

// Computed
const characterCount = computed(() => {
	return String(props.modelValue || '').length
})

const fieldClasses = computed(() => {
	const classes = ['form-field']

	if (props.disabled) classes.push('disabled')
	if (isFocused.value) classes.push('focused')
	if (errorMessage.value) classes.push('has-error')
	if (props.required) classes.push('required')

	return classes
})

const inputClasses = computed(() => {
	const classes = ['field-input']

	if (props.variant === 'glass' || isGlassmorphism.value) {
		classes.push('glass-input')
	} else {
		classes.push(`input-${props.variant}`)
	}

	if (errorMessage.value) classes.push('input-error')

	return classes
})

const inputStyle = computed(() => {
	const baseStyle = {
		color: getRGBColor('text')
	}

	if (props.variant === 'glass' || isGlassmorphism.value) {
		return {
			...baseStyle,
			backgroundColor: 'rgba(255, 255, 255, 0.1)',
			borderColor: errorMessage.value ? '#EF4444' : 'rgba(255, 255, 255, 0.2)',
			backdropFilter: 'blur(8px)'
		}
	}

	if (props.variant === 'filled') {
		return {
			...baseStyle,
			backgroundColor: getRGBAColor('secondary', 0.5),
			borderColor: errorMessage.value ? '#EF4444' : 'transparent'
		}
	}

	// outlined variant
	return {
		...baseStyle,
		backgroundColor: getRGBColor('card'),
		borderColor: errorMessage.value ? '#EF4444' : getRGBColor('border')
	}
})

// Methods
const handleInput = (event) => {
	const value = event.target.value
	emit('update:modelValue', value)
	emit('change', value)

	if (isTouched.value) {
		validate(value)
	}
}

const handleFileInput = (event) => {
	const files = props.multiple ? Array.from(event.target.files) : event.target.files[0]
	emit('update:modelValue', files)
	emit('change', files)
}

const handleBlur = (event) => {
	isFocused.value = false
	isTouched.value = true
	validate(props.modelValue)
	emit('blur', event)
}

const handleFocus = (event) => {
	isFocused.value = true
	emit('focus', event)
}

const validate = (value) => {
	errorMessage.value = ''

	// Required validation
	if (props.required && !value) {
		errorMessage.value = `${props.label || 'This field'} is required`
		return false
	}

	// Custom rules validation
	for (const rule of props.rules) {
		const result = rule(value)
		if (result !== true) {
			errorMessage.value = result
			return false
		}
	}

	// Email validation
	if (props.type === 'email' && value) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(value)) {
			errorMessage.value = 'Please enter a valid email address'
			return false
		}
	}

	// Max length validation
	if (props.maxLength && value && value.length > props.maxLength) {
		errorMessage.value = `Maximum ${props.maxLength} characters allowed`
		return false
	}

	return true
}

// Watch for external validation
watch(() => props.modelValue, (newValue) => {
	if (isTouched.value) {
		validate(newValue)
	}
})

// Expose validate method
defineExpose({
	validate: () => validate(props.modelValue),
	reset: () => {
		isTouched.value = false
		errorMessage.value = ''
	}
})
</script>

<style scoped>
.form-field {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

.field-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: rgb(var(--color-text));
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.required-indicator {
	color: #EF4444;
	font-weight: 600;
}

.field-input {
	width: 100%;
	padding: 0.75rem;
	border-radius: 0.5rem;
	border: 1px solid;
	font-size: 0.9375rem;
	font-family: inherit;
	transition: all 0.3s ease;
}

.field-input:focus {
	outline: none;
	border-color: rgb(var(--color-primary));
	box-shadow: 0 0 0 3px rgba(var(--color-primary) / 0.1);
}

.field-input:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	background-color: rgba(var(--color-secondary) / 0.5);
}

.field-input:readonly {
	background-color: rgba(var(--color-secondary) / 0.3);
	cursor: default;
}

.input-outlined {
	background-color: transparent;
}

.input-filled {
	border-bottom-width: 2px;
	border-radius: 0.5rem 0.5rem 0 0;
}

.input-error {
	border-color: #EF4444 !important;
}

.input-error:focus {
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

textarea.field-input {
	resize: vertical;
	min-height: 100px;
}

select.field-input {
	cursor: pointer;
}

.helper-text {
	font-size: 0.8125rem;
	color: rgb(var(--color-text) / 0.7);
}

.error-message {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	font-size: 0.8125rem;
	color: #EF4444;
}

.error-icon {
	font-size: 1rem;
}

.character-counter {
	font-size: 0.75rem;
	color: rgb(var(--color-text) / 0.6);
	text-align: right;
}

.form-field.has-error .field-label {
	color: #EF4444;
}

.form-field.disabled {
	opacity: 0.7;
}

/* Glass variant specific styles */
.glass-input {
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

.glass-input:focus {
	background-color: rgba(255, 255, 255, 0.15) !important;
	border-color: rgba(102, 126, 234, 0.5) !important;
}

/* Responsive */
@media (max-width: 768px) {
	.field-input {
		padding: 0.625rem;
		font-size: 0.875rem;
	}
}

/* Dark mode adjustments */
.dark-mode .field-input {
	color: rgb(var(--color-text));
}

.dark-mode .glass-input {
	background-color: rgba(0, 0, 0, 0.2);
	border-color: rgba(255, 255, 255, 0.1);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	.field-input {
		transition: none;
	}
}
</style>
