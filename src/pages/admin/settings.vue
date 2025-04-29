<template>
	<div class="mt-5">
		<h1 class="text-center font-bold">Admin Settings Page</h1>
		<!-- <a href="http://localhost:3002/verify?id=xyzedfs&verify=true">Click Me</a> -->
		<v-btn class="" @click="handleResponse">Click Me</v-btn>
	</div>
</template>

<script setup>
definePageMeta({
	title: 'Settings',
	description: 'Learn more about our company',
	middleware: ['auth-role'],
	role: ['admin'],
	layout: 'admin',
})

const allItems = ref([])

const response = ref([
	{
		_id: '681060ac6e59e006950e03f7',
		vendor_id: '67cab0d4db484adf17f72a39',
		status: 'COMPANY_NEGOTIATION',
		total_amount: 3124,
		items: [
			{
				_id: '680f88a5e4a072130755862b',
				item: 'LG Monitor',
				specification: 'spe.',
				quantity: 10,
				location: 'mumbai',
				delivery_date: '2025-05-22T00:00:00',
				unit_price: 150,
				gst: 18,
				total_price: 1770,
			},
		],
		remark: null,
		implementation_services: [
			{
				_id: '681060ac6e59e006950e03f6',
				item: 'Setup & Implementation',
				specification: 'On-site setup and implementation',
				quantity: 1,
				warranty: '6',
				total_price: 2000,
			},
		],
		created_at: '2025-04-29T05:16:28.129000',
		updated_at: '2025-04-29T08:41:58.921000',
		procurement_id: '680f88a5e4a072130755862f',
		procurement_data: {
			procurement_title: 'Unite core procurement',
		},
		procurement_details: {
			_id: '680f88a5e4a072130755862f',
			procurement_title: 'Unite core procurement',
			procurement_type: 'RFQ',
			procurement_status: 'LIVE',
			scheduled_time: '2025-04-28T19:25:30',
			end_time: '2025-05-30T15:14:14',
			procurment_item_contract_type: 'IS',
			category_type_list: [
				{
					_id: '680f88a5e4a0721307558629',
					industry_type: '67c7fcd04add435ca90011b4',
					category_list: [
						{
							_id: '680f88a5e4a072130755862a',
							category_type: 'Service',
							subcategory_list: [
								{
									_id: '67c7fcd04add435ca90011b2',
									subcategory_name: 'CMS',
								},
							],
						},
					],
				},
			],
			item_list: [
				{
					_id: '680f88a5e4a072130755862b',
					item: 'LG Monitor',
					specification: 'spe.',
					quantity: 10,
				},
			],
			vendors_list: [
				{
					id: '67d7e8ba12b420c398f221f7',
					vendor: '67cab0d4db484adf17f72a39',
					vendor_fname: 'shreyash',
					vendor_lname: 'patil',
					vendor_email: 'vendor@example.com',
					vendor_mobile_number: '830633037',
				},
				{
					id: '680c8901711f0e55f69904e9',
					vendor: '680c88b6711f0e55f69904e7',
					vendor_fname: 'dinesh',
					vendor_lname: 'patil',
					vendor_email: 'dinesh.pal@example.com',
					vendor_mobile_number: '830633037',
				},
			],
			terms_and_conditions_list: [
				{
					_id: '680f88a5e4a072130755862c',
					term_and_condition: 'terms',
				},
			],
			sow_list: [
				{
					_id: '680f88a5e4a072130755862d',
					sow: 'sow',
				},
			],
			payment_terms_list: [
				{
					_id: '680f88a5e4a072130755862e',
					delivery_invoice: 50000,
					advanced: 20000,
					after_implementation: 30000,
					period_type: 'credit',
					selected_days: 25,
				},
			],
			procurement_created_by: [
				{
					company_id: '67c82493e277979d43a089e1',
					company_name: 'Codecraft Solutions',
					user_name: 'Shreyash Patil',
					user_contact: '8830633037',
				},
			],
			company: '67c82493e277979d43a089e1',
		},
	},
	{
		_id: '68106d8ab84dd9ba2efc8a37',
		procurement_id: '680f88a5e4a072130755862f',
		vendor_id: '680c88b6711f0e55f69904e7',
		status: 'SUBMIT',
		total_amount: 2000,
		items: [
			{
				_id: '680f88a5e4a072130755862b',
				item: 'LG Monitor',
				specification: 'spe.',
				quantity: 10,
				location: 'Navi mumbai',
				delivery_date: '2025-05-23T00:00:00',
				unit_price: 160,
				gst: 18,
				total_price: 1888,
			},
		],
		remark: null,
		implementation_services: [
			{
				_id: '68106d8ab84dd9ba2efc8a36',
				item: 'Setup & Implementation',
				specification: 'On-site setup and implementation',
				quantity: 1,
				warranty: '8',
				total_price: 1000,
			},
		],
		created_at: '2025-04-29T06:11:22.201000',
		updated_at: '2025-04-29T06:11:22.201000',
		procurement_details: {
			_id: '680f88a5e4a072130755862f',
			procurement_title: 'Unite core procurement',
			procurement_type: 'RFQ',
			procurement_status: 'LIVE',
			scheduled_time: '2025-04-28T19:25:30',
			end_time: '2025-05-30T15:14:14',
			procurment_item_contract_type: 'IS',
			category_type_list: [
				{
					_id: '680f88a5e4a0721307558629',
					industry_type: '67c7fcd04add435ca90011b4',
					category_list: [
						{
							_id: '680f88a5e4a072130755862a',
							category_type: 'Service',
							subcategory_list: [
								{
									_id: '67c7fcd04add435ca90011b2',
									subcategory_name: 'CMS',
								},
							],
						},
					],
				},
			],
			item_list: [
				{
					_id: '680f88a5e4a072130755862b',
					item: 'LG Monitor',
					specification: 'spe.',
					quantity: 10,
				},
			],
			vendors_list: [
				{
					id: '67d7e8ba12b420c398f221f7',
					vendor: '67cab0d4db484adf17f72a39',
					vendor_fname: 'shreyash',
					vendor_lname: 'patil',
					vendor_email: 'vendor@example.com',
					vendor_mobile_number: '830633037',
				},
				{
					id: '680c8901711f0e55f69904e9',
					vendor: '680c88b6711f0e55f69904e7',
					vendor_fname: 'dinesh',
					vendor_lname: 'patil',
					vendor_email: 'dinesh.pal@example.com',
					vendor_mobile_number: '830633037',
				},
			],
			terms_and_conditions_list: [
				{
					_id: '680f88a5e4a072130755862c',
					term_and_condition: 'terms',
				},
			],
			sow_list: [
				{
					_id: '680f88a5e4a072130755862d',
					sow: 'sow',
				},
			],
			payment_terms_list: [
				{
					_id: '680f88a5e4a072130755862e',
					delivery_invoice: 50000,
					advanced: 20000,
					after_implementation: 30000,
					period_type: 'credit',
					selected_days: 25,
				},
			],
			procurement_created_by: [
				{
					company_id: '67c82493e277979d43a089e1',
					company_name: 'Codecraft Solutions',
					user_name: 'Shreyash Patil',
					user_contact: '8830633037',
				},
			],
			company: '67c82493e277979d43a089e1',
		},
	},
])

const handleResponse = () => {
	const seen = new Set()
	allItems.value = response.value.flatMap((quote) => [...quote.items, ...quote.implementation_services])
	console.log('Response:__________________________________', allItems?.value)
	const uniqueItems = allItems.value.filter((item) => {
		// Handle cases where unit_price might be undefined (like in services)
		const price = item.unit_price ?? 0
		const key = `${item.item}_${price}`
		const duplicate = seen.has(key)
		seen.add(key)
		return !duplicate
	})

	console.log('Unique Items:______________________________', uniqueItems)
	console.log('Transformed Response:____________________', transformResponse(uniqueItems))
}

const transformResponse = (response) => {
	const result = []
	const itemsMap = new Map()
	let implementationServicePrice = null
	response.forEach((item) => {
		if (item.item === 'Setup & Implementation') {
			implementationServicePrice = item.total_price
		} else {
			if (!itemsMap.has(item.item)) {
				itemsMap.set(item.item, {
					name: `${item.item}-${item.quantity} Unit`,
					unitPrice: {},
					totalPrice: {},
					id: itemsMap.size + 1,
				})
			}
			const existingItem = itemsMap.get(item.item)
			const key = Object.keys(existingItem.unitPrice).length + 1
			existingItem.unitPrice[key] = item.unit_price
			existingItem.totalPrice[key] = item.total_price
		}
	})
	itemsMap.forEach((item) => {
		const transformedItem = {
			id: item.id,
			name: item.name,
			unitPrice: item.unitPrice,
			implementationService: {},
			totalAmount: item.totalPrice,
		}
		if (implementationServicePrice !== null) {
			for (const key in item.unitPrice) {
				transformedItem.implementationService[key] = implementationServicePrice
			}
		}

		result.push(transformedItem)
	})

	return result
}
</script>
