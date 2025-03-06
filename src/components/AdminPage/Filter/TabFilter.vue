<template>
	<v-slide-x-reverse-transition>
		<div
			v-if="isOpen"
			class="fixed top-40 right-20 h-auto w-96 bg-white border-l rounded-lg border-gray-200 shadow-lg py-4 px-2 z-50"
		>
			<v-row>
				<v-col cols="12" md="4" class="rounded-r-lg border-r-2">
					<!-- Custom Vertical Tabs without v-list -->
					<div class="flex flex-col">
						<button
							@click="tab = 0"
							:class="{
								'bg-white text-teal-500': tab === 0,
								'bg-white-200 text-black-800': tab !== 0,
								'cursor-pointer': true,
								'hover:bg-white hover:text-teal-500': tab !== 0,
								'px-8 py-2 rounded-t-sm': true,
							}"
						>
							Tab 1
						</button>

						<button
							@click="tab = 1"
							:class="{
								'bg-white text-teal-500': tab === 1,
								'bg-white-200 text-black-800': tab !== 1,
								'cursor-pointer': true,
								'hover:bg-white hover:text-teal-500': tab !== 1,
								'px-8 py-2': true,
							}"
						>
							Tab 2
						</button>

						<button
							@click="tab = 2"
							:class="{
								'bg-white text-teal-500': tab === 2,
								'bg-white-200 text-black-800': tab !== 2,
								'cursor-pointer': true,
								'hover:bg-white hover:text-teal-500': tab !== 2,
								'px-8 py-2 rounded-b-sm': true,
							}"
						>
							Tab 3
						</button>
					</div>
				</v-col>

				<!-- Tab Content -->
				<v-col cols="12" md="8">
					<div v-show="tab === 0" class="flex gap-4">
						<v-text-field
							type="date"
							label="Start Date"
							v-model="form.start_date"
							clearable
							class="tab-1"
							variant="outlined"
						/>
						<v-text-field
							type="date"
							clearable
							label="End Date"
							v-model="form.end_date"
							class="tab-1"
							variant="outlined"
						/>
					</div>
					<div v-show="tab === 1">
						<v-select
							label="Type"
							v-model="form.type"
							:items="typeOptions"
							clearable
							variant="outlined"
						/>
					</div>
					<div v-show="tab === 2">
						<v-select
							label="Executive"
							v-model="form.exicutive_id"
							clearable
							:items="executiveOptions"
							variant="outlined"
						/>
					</div>
				</v-col>
			</v-row>

			<!-- Actions -->
			<v-row>
				<v-col cols="12" class="flex justify-center gap-4">
					<button
						class="hover:bg-blue-400 hover:text-white px-4 py-1 rounded-lg bg-blue-300 text-white"
						@click="applyFilter"
					>
						Apply
					</button>
					<button
						class="hover:bg-red-400 hover:text-white px-4 py-1 rounded-lg bg-red-300 text-white"
						@click="dialog = false"
					>
						Close
					</button>
				</v-col>
			</v-row>
		</div>
	</v-slide-x-reverse-transition>
</template>

<script setup>
const tab = ref(0) // active tab index
const form = ref({
	start_date: '',
	end_date: '',
	type: '',
	exicutive_id: '',
})
const props = defineProps({
	isOpen: Boolean,
})

const emit = defineEmits(['updateFilters'])

const startDate = ref(null)
const endDate = ref(null)
const projectName = ref('')
const groupLeaderName = ref('')
const teamLeaderName = ref('')
const technicianName = ref('')

const typeOptions = ref(['Full-Time', 'Part-Time', 'Contract', 'Internship'])
const executiveOptions = ref(['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Davis'])

const updateFilter = () => {
	emit('updateFilters', {
		startDate: startDate.value,
		endDate: endDate.value,
		projectName: projectName.value,
		groupLeaderName: groupLeaderName.value,
		teamLeaderName: teamLeaderName.value,
		technicianName: technicianName.value,
	})
}

const applyFilter = () => {
	// Apply your filter logic here
	console.log(form.value)
	dialog.value = false // Close modal after applying the filter
}
</script>

<style scoped>
.v-list-item--active {
	background-color: #eeeeee;
	font-weight: bold;
}

.v-list-item {
	cursor: pointer;
}

.v-list-item-title {
	padding: 10px;
}

.tab-1 {
	width: 200px !important;
}

.v-list-item--variant-text {
	background-color: white !important;
}
</style>
