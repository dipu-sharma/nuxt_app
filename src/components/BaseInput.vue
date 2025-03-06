<template>
	<div class="text-center">
		<label>
			{{ label }}
			<input
				:placeholder="label"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
				class="field py-1 text-center rounded-md focus:outline-none"
			/>
		</label>
	</div>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: '',
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
	},
}
</script>

<style scoped>
label {
	font-weight: 500;
	color: red;
	text-align: left;
	justify-content: start;
}
</style>
