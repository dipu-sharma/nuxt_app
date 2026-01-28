<template>
	<div
		:class="cardClasses"
		:style="cardStyles"
		@click="handleClick"
	>
		<slot name="header">
			<div v-if="title" class="glass-card-header">
				<h3 class="glass-card-title">{{ title }}</h3>
				<div v-if="$slots.actions" class="glass-card-actions">
					<slot name="actions"></slot>
				</div>
			</div>
		</slot>

		<div class="glass-card-content">
			<slot></slot>
		</div>

		<slot name="footer">
			<div v-if="$slots.footer" class="glass-card-footer">
				<slot name="footer"></slot>
			</div>
		</slot>
	</div>
</template>

<script setup>

import { useThemeIntegration } from '@/composables/useThemeIntegration'

const props = defineProps({
	variant: {
		type: String,
		default: 'default',
		validator: (value) => ['default', 'elevated', 'outlined', 'glass', 'flat'].includes(value)
	},
	hoverable: {
		type: Boolean,
		default: false
	},
	clickable: {
		type: Boolean,
		default: false
	},
	padding: {
		type: String,
		default: 'normal',
		validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
	},
	rounded: {
		type: String,
		default: 'normal',
		validator: (value) => ['none', 'small', 'normal', 'large', 'full'].includes(value)
	},
	title: {
		type: String,
		default: ''
	},
	shadow: {
		type: String,
		default: 'normal',
		validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
	}
})

const emit = defineEmits(['click'])

const { isGlassmorphism, getCardStyle, themeClasses } = useThemeIntegration()

// Compute card classes
const cardClasses = computed(() => {
	const classes = ['glass-card-component', themeClasses.value]

	// Variant classes
	if (props.variant === 'glass' || isGlassmorphism.value) {
		classes.push('glass-card')
	} else {
		classes.push(`card-${props.variant}`)
	}

	// Interaction classes
	if (props.hoverable) classes.push('hoverable')
	if (props.clickable) classes.push('clickable')

	// Padding classes
	const paddingMap = {
		none: 'p-0',
		small: 'p-3',
		normal: 'p-6',
		large: 'p-8'
	}
	classes.push(paddingMap[props.padding])

	// Rounded classes
	const roundedMap = {
		none: 'rounded-none',
		small: 'rounded-lg',
		normal: 'rounded-xl',
		large: 'rounded-2xl',
		full: 'rounded-3xl'
	}
	classes.push(roundedMap[props.rounded])

	// Shadow classes
	const shadowMap = {
		none: 'shadow-none',
		small: 'shadow-sm',
		normal: 'shadow-lg',
		large: 'shadow-2xl'
	}
	if (props.variant !== 'glass' && !isGlassmorphism.value) {
		classes.push(shadowMap[props.shadow])
	}

	return classes
})

// Compute card styles
const cardStyles = computed(() => {
	if (props.variant === 'glass' || isGlassmorphism.value) {
		return getCardStyle()
	}

	// Default styles for non-glass variants
	return {
		backgroundColor: 'rgb(var(--color-card))',
		borderColor: 'rgb(var(--color-border))',
		color: 'rgb(var(--color-text))'
	}
})

const handleClick = (event) => {
	if (props.clickable) {
		emit('click', event)
	}
}
</script>

<style scoped>
.glass-card-component {
	position: relative;
	transition: all 0.3s ease;
	border-width: 1px;
	border-style: solid;
}

/* Default card variant */
.card-default {
	background-color: rgb(var(--color-card));
	border-color: rgb(var(--color-border));
}

/* Elevated card variant */
.card-elevated {
	background-color: rgb(var(--color-card));
	border-color: transparent;
}

/* Outlined card variant */
.card-outlined {
	background-color: transparent;
	border-color: rgb(var(--color-border));
	border-width: 2px;
}

/* Flat card variant */
.card-flat {
	background-color: rgb(var(--color-card));
	border-color: transparent;
	box-shadow: none !important;
}

/* Hoverable effect */
.hoverable:hover {
	transform: translateY(-4px);
	box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.2);
}

/* Glass card hover effect */
.glass-card.hoverable:hover {
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.3);
	box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.3);
}

/* Clickable cursor */
.clickable {
	cursor: pointer;
}

.clickable:active {
	transform: scale(0.98);
}

/* Card header */
.glass-card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
	padding-bottom: 1rem;
	border-bottom: 1px solid rgba(var(--color-border) / 0.2);
}

.glass-card-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: rgb(var(--color-text));
	margin: 0;
}

.glass-card-actions {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}

/* Card content */
.glass-card-content {
	flex: 1;
}

/* Card footer */
.glass-card-footer {
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(var(--color-border) / 0.2);
}

/* Dark theme adjustments */
.dark-mode .glass-card-header,
.dark-mode .glass-card-footer {
	border-color: rgba(var(--color-border) / 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.glass-card-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.75rem;
	}

	.glass-card-actions {
		width: 100%;
		justify-content: flex-end;
	}
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
	.glass-card-component,
	.hoverable,
	.clickable {
		transition: none;
		transform: none !important;
	}
}
</style>
