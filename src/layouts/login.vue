<template>
	<div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
		<!-- Background decorative elements (Subtle Light) -->
		<div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
		<div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]"></div>
		
		<main class="w-full max-w-6xl z-10">
			<slot />
		</main>
	</div>
</template>

<script setup>
import '~/assets/css/glassmorphism.css'
</script>

<style scoped>
/* Clean light theme background */
</style>
