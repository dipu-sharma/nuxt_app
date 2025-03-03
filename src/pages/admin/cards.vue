<template>
	<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Cards</h2>

	<!-- Big section cards -->
	<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Big section cards</h4>
	<div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
		<p class="text-sm text-gray-600 dark:text-gray-400">Large, full-width sections go here</p>
	</div>

	<!-- Responsive cards -->
	<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Responsive cards</h4>
	<div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
		<!-- Card -->
		<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<div
				class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
					></path>
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Total clients</p>
				<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">6389</p>
			</div>
		</div>
		<!-- Card -->
		<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<div class="p-3 mr-4 text-green-500 bg-green-100 rounded-full dark:text-green-100 dark:bg-green-500">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
						clip-rule="evenodd"
					></path>
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Account balance</p>
				<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">$46,760.89</p>
			</div>
		</div>
		<!-- Card -->
		<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<div class="p-3 mr-4 text-blue-500 bg-blue-100 rounded-full dark:text-blue-100 dark:bg-blue-500">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
					></path>
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">New sales</p>
				<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">376</p>
			</div>
		</div>
		<!-- Card -->
		<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<div class="p-3 mr-4 text-teal-500 bg-teal-100 rounded-full dark:text-teal-100 dark:bg-teal-500">
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
						clip-rule="evenodd"
					></path>
				</svg>
			</div>
			<div>
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Pending contacts</p>
				<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">35</p>
			</div>
		</div>
	</div>

	<!-- Cards with title -->
	<h4 class="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">Cards with title</h4>
	<div class="grid gap-6 mb-8 md:grid-cols-2">
		<div class="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
			<h4 class="mb-4 font-semibold text-gray-600 dark:text-gray-300">Revenue</h4>
			<p class="text-gray-600 dark:text-gray-400">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis numquam quod?
				Totam exercitationem quos hic ipsam at qui cum numquam, sed amet ratione! Ratione, nihil dolorum.
			</p>
		</div>
		<div class="min-w-0 p-4 text-white bg-purple-600 rounded-lg shadow-xs">
			<h4 class="mb-4 font-semibold">Colored card</h4>
			<p>
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis numquam quod?
				Totam exercitationem quos hic ipsam at qui cum numquam, sed amet ratione! Ratione, nihil dolorum.
			</p>
		</div>
		<div>
			<button
				@click="openModal"
				class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
			>
				Open Modal
			</button>
		</div>
		<div
			v-show="isModalOpen"
			class="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
		>
			<!-- Modal -->
			<div
				v-show="isModalOpen"
				@click.away="closeModal"
				@keydown.escape="closeModal"
				class="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
				role="dialog"
				id="modal"
			>
				<!-- Remove header if you don't want a close icon. Use modal body to place modal tile. -->
				<header class="flex justify-end">
					<button
						class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded hover:text-gray-700 dark:hover:text-gray-200"
						aria-label="close"
						@click="closeModal"
					>
						<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"
							></path>
						</svg>
					</button>
				</header>
				<!-- Modal body -->
				<div class="mt-4 mb-6">
					<!-- Modal title -->
					<p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">Modal header</p>
					<!-- Modal description -->
					<p class="text-sm text-gray-700 dark:text-gray-400">
						Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis, tempora perferendis fuga
						ipsa atque cupiditate, id reprehenderit odio quaerat quidem autem omnis fugiat saepe enim
						et expedita culpa, harum nam.
					</p>
				</div>
				<footer class="flex flex-col items-center justify-end space-y-4 sm:flex-row sm:space-y-0">
					<button
						@click="closeModal"
						class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
					>
						Accept
					</button>
					<button
						@click="closeModal"
						class="w-full px-5 py-3 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:w-auto sm:px-4 sm:py-2 dark:border-gray-500 focus:outline-none focus:shadow-outline-gray"
					>
						Cancel
					</button>
				</footer>
			</div>
		</div>
	</div>
</template>

<script setup>
import { input_date } from '~/utils/common/dateValidation'
definePageMeta({
	title: 'Admin',
	description: 'Learn more about our company',
	layout: 'admin',
	middleware: ['auth-role'],
	role: ['admin'],
})

const isModalOpen = ref(false)

const openModal = () => {
	console.log('Date______________________modal_____________________', input_date())

	isModalOpen.value = true
}

const closeModal = () => {
	isModalOpen.value = false
}
</script>
