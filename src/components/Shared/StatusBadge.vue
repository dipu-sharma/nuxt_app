<template>
	<span :class="badgeClasses" :style="badgeStyle">
		<Icon v-if="icon" :name="icon" class="badge-icon" />
		<slot>{{ label }}</slot>
	</span>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeIntegration } from '@/composables/useThemeIntegration'

const props = defineProps({
	status: {
		type: String,
		default: 'default',
		validator: (value) => [
			'default', 'success', 'warning', 'error', 'info',
			'active', 'inactive', 'pending', 'completed', 'cancelled'
		].includes(value)
	},
	label: {
		type: String,
		default: ''
	},
	icon: {
		type: String,
		default: ''
	},
	variant: {
		type: String,
		default: 'filled',
		validator: (value) => ['filled', 'outlined', 'glass'].includes(value)
	},
	size: {
		type: String,
		default: 'medium',
		validator: (value) => ['small', 'medium', 'large'].includes(value)
	},
	rounded: {
		type: Boolean,
		default: true
	}
})

const { isGlassmorphism } = useThemeIntegration()

const statusColors = {
	default: { bg: '#9CA3AF', text: '#FFFFFF' },
	success: { bg: '#10B981', text: '#FFFFFF' },
	warning: { bg: '#F59E0B', text: '#FFFFFF' },
	error: { bg: '#EF4444', text: '#FFFFFF' },
	info: { bg: '#3B82F6', text: '#FFFFFF' },
	active: { bg: '#10B981', text: '#FFFFFF' },
	inactive: { bg: '#6B7280', text: '#FFFFFF' },
	pending: { bg: '#F59E0B', text: '#FFFFFF' },
	completed: { bg: '#10B981', text: '#FFFFFF' },
	cancelled: { bg: '#EF4444', text: '#FFFFFF' }
}

const badgeClasses = computed(() => {
	const classes = ['status-badge']

	// Variant
	if (props.variant === 'glass' || isGlassmorphism.value) {
		classes.push('badge-glass')
	} else {
		classes.push(`badge-${props.variant}`)
	}

	// Size
	classes.push(`badge-${props.size}`)

	// Rounded
	if (props.rounded) {
		classes.push('badge-rounded')
	}

	// Status class
	classes.push(`status-${props.status}`)

	return classes
})

const badgeStyle = computed(() => {
	const colors = statusColors[props.status] || statusColors.default

	if (props.variant === 'filled') {
		return {
			backgroundColor: colors.bg,
			color: colors.text
		}
	}

	if (props.variant === 'outlined') {
		return {
			borderColor: colors.bg,
			color: colors.bg
		}
	}

	// Glass variant
	return {
		backgroundColor: `${colors.bg}33`, // 20% opacity
		borderColor: `${colors.bg}66`, // 40% opacity
		color: colors.bg,
		backdropFilter: 'blur(8px)'
	}
})
</script>

<style scoped>
.status-badge {
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;
	font-weight: 500;
	white-space: nowrap;
	transition: all 0.3s ease;
}

.badge-filled {
	border: none;
}

.badge-outlined {
	background-color: transparent;
	border: 1.5px solid;
}

.badge-glass {
	border: 1px solid;
	backdrop-filter: blur(8px);
	-webkit-backdrop-filter: blur(8px);
}

.badge-small {
	padding: 0.25rem 0.5rem;
	font-size: 0.75rem;
}

.badge-medium {
	padding: 0.375rem 0.75rem;
	font-size: 0.875rem;
}

.badge-large {
	padding: 0.5rem 1rem;
	font-size: 1rem;
}

.badge-rounded {
	border-radius: 9999px;
}

.badge-icon {
	font-size: 1em;
}

.status-badge:hover {
	transform: scale(1.05);
}

@media (prefers-reduced-motion: reduce) {
	.status-badge {
		transition: none;
		transform: none !important;
	}
}
</style>
