<template>
	<div class="gridLight">
		<div v-for="(row, rowIndex) in data" :key="rowIndex" class="flex gap-5">
			<div v-for="(call, callIndex) in row" :key="callIndex">
				<div
					@click="changeValue(rowIndex, callIndex)"
					:class="
						selectedCell.has(`${rowIndex}-${callIndex}`) ? 'w-20 h-20 lighton' : 'w-20 h-20 lightoff'
					"
				></div>
			</div>
		</div>
	</div>
</template>

<script setup>
import cloneDeep from 'lodash/cloneDeep'
const selectedCell = ref(new Map())
const data = ref([
	[1, 1, 1],
	[1, 1, 1],
	[1, 1, 1],
])

const changeValue = (rowIndex, callIndex) => {
	const newSelectedCell = cloneDeep(selectedCell.value)
	const key = `${rowIndex}-${callIndex}`
	if (newSelectedCell.get(key) || !data.value[rowIndex][callIndex]) {
		newSelectedCell.delete(key)
	} else {
		newSelectedCell.set(key, true)
	}
	selectedCell.value = newSelectedCell
	const lightSelected = data.value.flat().reduce((acc, val) => acc + val, 0)
	if (lightSelected === selectedCell.value.size) {
		console.log('All lights are on')
		startRollback()
	}
}

const startRollback = () => {
	const interval = setInterval(() => {
		if (selectedCell.value.size === 0) {
			clearInterval(interval)
			return
		}

		const lastKey = Array.from(selectedCell.value.keys()).pop()
		const newStack = cloneDeep(selectedCell.value)
		newStack.delete(lastKey)
		selectedCell.value = newStack
		console.log('Removing selected cell:', lastKey)
	}, 3000)
}
</script>
<style scoped>
.gridLight {
	height: 70vw;
	width: 70vw;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.lightoff {
	background: radial-gradient(circle, rgba(231, 62, 62, 0.7) 10%, rgba(150, 30, 30, 0.4) 80%);
	border-radius: 50%;
	transition: all 0.6s ease;
	box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.3), 0 6px 15px rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(5px);
}

.lighton {
	background: radial-gradient(circle, rgba(182, 32, 219, 0.7) 10%, rgba(120, 20, 160, 0.4) 80%);
	transform: scale(1);
	border-radius: 50%;
	transition: all 0.6s ease;
	box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.3);
	backdrop-filter: blur(8px);
}
</style>
