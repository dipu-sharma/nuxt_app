<template>
	<div>
		<h1 class="text-center font-bold">{{ category }} Products</h1>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
		<div class="col-span-12 md:col-span-2 bg-white ml-2 mr-2 shadow-lg rounded-md">
			<h2 class="text-center">{{ category }}</h2>
		</div>
		<div class="col-span-12 md:col-span-10 bg-white ml-2 mr-2 shadow-lg rounded-md">
			<h2 class="text-center">{{ category }} Product</h2>
		</div>
	</div>
	<div class="text-center justify-center mt-5">
		<Watch />
		<WatchCompute />
		<Onmounted />
		<!-- Base input fields -->
		<BaseInput v-model="payload.title" label="Title" type="text" />
		<BaseInput v-model="payload.first_name" label="First Name" type="text" />
		<BaseInput v-model="payload.last_name" label="Last Name" type="text" />
		<v-text-field
			v-model="mobileNumber"
			label="Mobile"
			class="w-2/6"
			type="tel"
			inputmode="numeric"
			maxlength="10"
			@input="filterMobileNumber"
			:rules="[isRequiredRule, isMobileRule]"
			required
		/>
	</div>
</template>

<script setup>
import { isMobile, isRequired } from '~/utils/common/validation'
const route = useRoute()
const category = route.params.category
const payload = ref({
	title: '',
	first_name: '',
	last_name: '',
})
const mobileNumber = ref('')

const isMobileRule = (value) => {
	const result = isMobile(value)
	return result.valid || result.error
}

const isRequiredRule = (value) => {
	const result = isRequired(value)
	return result.valid || result.error
}

const filterMobileNumber = (event) => {
	const target = event.target
	mobileNumber.value = target.value.replace(/[^0-9]/g, '').slice(0, 10)
}
</script>

<style scoped></style>
