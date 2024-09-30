<template>
	<div class="rr-my-6">
		<!-- Search Bar -->
		<v-text-field v-if="!no_search" autocomplete="one-time-code" clearable single-line hide-details
			variant="outlined" v-model="SearchItem" placeholder="Search" density="comfortable"
			prepend-inner-icon="mdi-magnify" class="rr-mb-6 !rr-rounded-lg rr-bg-white" />

		<!-- Server-side Table -->
		<v-data-table hover :items="items" item-key="index" :headers="header" :loading="isLoading" :search="SearchItem"
			density="comfortable" class="!rr-rounded-lg" v-model="SelectedItems" :show-select="showSelect"
			:item-value="selectableKey" @update:options="ChangePage" :items-length="items_length"
			item-selectable="selectable" :items-per-page="itemsPerPage" :items-per-page-options="itemsPerPageOptions"
			:header-props="{ class: 'rr-bg-[#FBAB33] rr-table-header rr-text-white !rr-font-semibold' }">

			<template v-slot:item.system_status_table="{ item }">
				<span :class="getStatusClass(item.system_status_table)">
					{{ item.system_status_table }}
				</span>
			</template>

			<!-- System Status Code Start -->
			<template v-slot:item.system_status="{ item }">
				<span :class="getStatusClass(item.system_status)">
					{{ item.system_status }}
				</span>
			</template>
			<template v-slot:item.milestone_status="{ item }">
				<span :class="getStatusClass(item.milestone_status)">
					{{ item.milestone_status }}
				</span>
			</template>
			<template v-slot:item.image_list="{ item }">
				<div v-if="item.image_list.length">
					<v-img v-for="(image, index) in item.image_list" :key="index" :src="image" max-width="100"
						max-height="100" class="mx-2" />
				</div>
			</template>
			<!-- System Status Code End -->

			<!-- Employee Log history Redirection -->

			<template v-slot:item.link_log="{ item }">
				<span class="rr-text-[#FBAB33] rr-cursor-pointer" @click="logHistory(item)">
					{{ item.link_log }}
				</span>
			</template>

			<template v-slot:[`item.link`]="{ item }">
				<div class="rr-flex rr-justify-center rr-items-center">
					<div v-if="action_edit && item.is_kickoff_done === false" @click="emit('edit:item', item)"
						class="rr-text-orange-500 hover:rr-bg-orange-100 hover:rr-text-orange-800 focus:rr-outline-none rr-font-medium rr-rounded-full rr-text-sm rr-p-2.5 rr-text-center rr-inline-flex rr-items-center rr-cursor-pointer">
						<Icon name="lucide:edit" class="rr-w-4 rr-h-4" />
					</div>

					<div v-if="action_delete"
						@click="ConfirmDelete(Object.keys(item).includes('_id') ? item._id : item)"
						class="rr-text-red-500 hover:rr-bg-red-100 hover:rr-text-red-800 focus:rr-outline-none rr-font-medium rr-rounded-full rr-text-sm rr-p-2.5 rr-text-center rr-inline-flex rr-items-center rr-cursor-pointer">
						<Icon name="lucide:trash-2" class="rr-w-4 rr-h-4" />
					</div>

					<div v-if="action_view" @click="MoveToNewPage(item.link, item.index)"
						class="rr-text-blue-500 hover:rr-bg-blue-100 hover:rr-text-blue-800 focus:rr-outline-none rr-font-medium rr-rounded-full rr-text-sm rr-p-2.5 rr-text-center rr-inline-flex rr-items-center rr-cursor-pointer">
						<Icon name="lucide:eye" class="rr-w-4 rr-h-4" />
					</div>
				</div>
			</template>
		</v-data-table>

		<DialogDelete v-model="DeleteDialog" @confirm:delete="SendDeleteEvent" />
	</div>
</template>

<script setup>
import { useClipboard, usePermission } from '@vueuse/core'

const props = defineProps({
	items: { type: Array, default: Array },
	items_length: { type: Number, default: 2000 },
	header: { type: Array, required: true, default: Array },
	// Action buttons (View, Edit, Delete)
	action_view: { type: Boolean, default: false },
	action_edit: { type: Boolean, default: false },
	action_delete: { type: Boolean, default: false },
	// link_log: { type: Boolean, default: false },
	// Loading State
	isLoading: { type: Boolean, default: false },
	// Items Per Page options
	itemsPerPageOptions: {
		type: Array,
		default: [
			{ value: 5, title: '5' },
			{ value: 10, title: '10' },
			{ value: 50, title: '50' },
			{ value: 100, title: '100' },
			{ value: 200, title: '200' },
			{ value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
		],
	},
	itemsPerPage: { type: Number, default: 10 },
	// For Selection
	showSelect: { type: Boolean, default: false },
	selectableKey: { type: String, default: '_id' },
	no_search: { type: Boolean, default: false },
})
const SearchItem = ref('')
const ItemToDelete = ref(null)
const DeleteDialog = ref(false)
const SelectedItems = ref([])
const emit = defineEmits(['change:page', 'delete:item', 'edit:item', 'update:selected-items', 'view:page'])

// For Selection
watch(SelectedItems, (newVal) => {
	emit('update:selected-items', newVal)
})

// Change page when clicked on view button
const MoveToNewPage = async (Link, index) => {
	if (Link == '' || Link == undefined) {
		emit('view:page', props.items[index - 1])
	} else {
		navigateTo(Link)
	}
	// localStorage.setItem(
	// 	'page-history',
	// 	JSON.stringify({
	// 		URL: this.$route.path,
	// 		search: this.search || '',
	// 		page: this.currentPage.page,
	// 		itemsPerPage: this.currentPage.itemsPerPage,
	// 	}),
	// )
}

// When clicked on pagination change page
const ChangePage = async (pagination) => {
	emit('change:page', pagination)
}
// Delete related functions
const ConfirmDelete = (item_id) => {
	ItemToDelete.value = item_id
	DeleteDialog.value = true
}
const SendDeleteEvent = () => {
	DeleteDialog.value = false
	emit('delete:item', ItemToDelete.value)
}
const CopyToClipboard = async (itemToCopy) => {
	const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' })
	console.log('🚀 ~ CopyToClipboard ~ permissionStatus:', permissionStatus)
	const clipboardAccess = usePermission('clipboard-write')
	if (clipboardAccess) {
		const { copy, isSupported } = useClipboard()
		console.log('🚀 ~ CopyToClipboard ~ isSupported:', isSupported)
		// copy(itemToCopy)
		navigator.clipboard.writeText(itemToCopy)
		push.success('Copied')
	}
}
const MaskPassword = (password) => {
	return '*'.repeat(password.length)
}

const getStatusClass = (status) => {
	switch (status) {
		case 'Yet to be started':
			return 'rr-text-blue-500 font-semibold'
		case 'YET TO BE STARTED':
			return 'rr-text-blue-500 font-semibold'
		case 'Planning Done':
			return 'rr-text-yellow-500 font-semibold'
		case 'PLANNING DONE':
			return 'rr-text-yellow-500 font-semibold'
		case 'Kick Off Done':
			return 'rr-text-teal-500 font-semibold'
		case 'KICK OFF DONE':
			return 'rr-text-teal-500 font-semibold'
		case 'In Progress':
			return 'rr-text-orange-500 font-semibold'
		case 'IN PROGRESS':
			return 'rr-text-orange-500 font-semibold'
		case 'Completed':
			return 'rr-text-green-500 font-semibold'
		case 'COMPLETED':
			return 'rr-text-green-500 font-semibold'
		case 'Delayed':
			return 'rr-text-red-500 font-semibold'
		case 'DELAYED':
			return 'rr-text-red-500 font-semibold'
		default:
			return ''
	}
}

// Employee Log history Redirection PENDING

const logHistory = async (item) => {
	await navigateTo(`/users/employee/${item._id}`)
}
</script>

<style scoped></style>
