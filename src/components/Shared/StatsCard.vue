<template>
	<GlassCard
		:variant="variant"
		:hoverable="hoverable"
		:clickable="clickable"
		@click="$emit('click', $event)"
	>
		<div class="stats-card" :class="{ 'has-icon': icon || $slots.icon }">
			<div class="stats-content">
				<div class="stats-header">
					<h3 class="stats-title">{{ title }}</h3>
					<slot name="action"></slot>
				</div>

				<div class="stats-value-container">
					<div class="stats-value" :style="{ color: valueColor }">
						<span v-if="prefix" class="value-prefix">{{ prefix }}</span>
						<span class="value-number">{{ formattedValue }}</span>
						<span v-if="suffix" class="value-suffix">{{ suffix }}</span>
					</div>

					<div v-if="trend !== null" class="stats-trend" :class="trendClass">
						<Icon :name="trendIcon" class="trend-icon" />
						<span>{{ Math.abs(trend) }}{{ trendSuffix }}</span>
					</div>
				</div>

				<div v-if="subtitle || $slots.subtitle" class="stats-subtitle">
					<slot name="subtitle">{{ subtitle }}</slot>
				</div>
			</div>

			<div v-if="icon || $slots.icon" class="stats-icon-container" :style="iconStyle">
				<slot name="icon">
					<Icon :name="icon" class="stats-icon" />
				</slot>
			</div>
		</div>
	</GlassCard>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeIntegration } from '@/composables/useThemeIntegration'
import GlassCard from './GlassCard.vue'

const props = defineProps({
	title: {
		type: String,
		required: true
	},
	value: {
		type: [Number, String],
		required: true
	},
	subtitle: {
		type: String,
		default: ''
	},
	icon: {
		type: String,
		default: ''
	},
	iconColor: {
		type: String,
		default: ''
	},
	prefix: {
		type: String,
		default: ''
	},
	suffix: {
		type: String,
		default: ''
	},
	trend: {
		type: Number,
		default: null
	},
	trendSuffix: {
		type: String,
		default: '%'
	},
	format: {
		type: String,
		default: 'number',
		validator: (value) => ['number', 'currency', 'percentage', 'none'].includes(value)
	},
	variant: {
		type: String,
		default: 'default'
	},
	hoverable: {
		type: Boolean,
		default: false
	},
	clickable: {
		type: Boolean,
		default: false
	},
	loading: {
		type: Boolean,
		default: false
	}
})

defineEmits(['click'])

const { getRGBColor, isGlassmorphism } = useThemeIntegration()

const formattedValue = computed(() => {
	if (props.loading) return '...'

	const numValue = typeof props.value === 'number' ? props.value : parseFloat(props.value)

	if (isNaN(numValue)) return props.value

	switch (props.format) {
		case 'currency':
			return new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 0,
				maximumFractionDigits: 2
			}).format(numValue)

		case 'percentage':
			return `${numValue.toFixed(1)}`

		case 'number':
			if (numValue >= 1000000) {
				return `${(numValue / 1000000).toFixed(1)}M`
			}
			if (numValue >= 1000) {
				return `${(numValue / 1000).toFixed(1)}K`
			}
			return new Intl.NumberFormat('en-US').format(numValue)

		case 'none':
		default:
			return props.value
	}
})

const valueColor = computed(() => {
	if (props.trend === null) return getRGBColor('text')

	if (props.trend > 0) return '#10B981' // green
	if (props.trend < 0) return '#EF4444' // red
	return getRGBColor('text')
})

const trendClass = computed(() => {
	if (props.trend > 0) return 'trend-positive'
	if (props.trend < 0) return 'trend-negative'
	return 'trend-neutral'
})

const trendIcon = computed(() => {
	if (props.trend > 0) return 'mdi:trending-up'
	if (props.trend < 0) return 'mdi:trending-down'
	return 'mdi:minus'
})

const iconStyle = computed(() => {
	const color = props.iconColor || getRGBColor('primary')

	if (isGlassmorphism.value) {
		return {
			backgroundColor: `${color}33`,
			color: color
		}
	}

	return {
		backgroundColor: `${color}15`,
		color: color
	}
})
</script>

<style scoped>
.stats-card {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
}

.stats-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.stats-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.5rem;
}

.stats-title {
	font-size: 0.875rem;
	font-weight: 500;
	color: rgb(var(--color-text) / 0.7);
	margin: 0;
	line-height: 1.4;
}

.stats-value-container {
	display: flex;
	align-items: baseline;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.stats-value {
	display: flex;
	align-items: baseline;
	gap: 0.25rem;
	font-size: 2rem;
	font-weight: 700;
	line-height: 1;
}

.value-prefix,
.value-suffix {
	font-size: 1.25rem;
	font-weight: 600;
	opacity: 0.8;
}

.stats-trend {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.25rem 0.5rem;
	border-radius: 0.375rem;
	font-size: 0.8125rem;
	font-weight: 600;
}

.trend-positive {
	background-color: #D1FAE5;
	color: #059669;
}

.trend-negative {
	background-color: #FEE2E2;
	color: #DC2626;
}

.trend-neutral {
	background-color: rgb(var(--color-secondary));
	color: rgb(var(--color-text));
}

.trend-icon {
	font-size: 1rem;
}

.stats-subtitle {
	font-size: 0.8125rem;
	color: rgb(var(--color-text) / 0.6);
	line-height: 1.4;
}

.stats-icon-container {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 4rem;
	height: 4rem;
	border-radius: 0.75rem;
	flex-shrink: 0;
}

.stats-icon {
	font-size: 2rem;
}

/* Responsive */
@media (max-width: 640px) {
	.stats-card.has-icon {
		flex-direction: column-reverse;
		align-items: center;
		text-align: center;
	}

	.stats-icon-container {
		width: 3.5rem;
		height: 3.5rem;
	}

	.stats-icon {
		font-size: 1.75rem;
	}

	.stats-value {
		font-size: 1.75rem;
	}

	.stats-header {
		flex-direction: column;
		align-items: center;
	}
}

/* Loading animation */
@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

.stats-card:has(.stats-value:contains('...')) {
	animation: pulse 2s ease-in-out infinite;
}
</style>
