<template>
    <div>
        <Navbar />
        <main class="pt-20">
            <slot />
        </main>
        <AutoLogOut />
    </div>
</template>

<script setup>

</script>

<style scoped>
.default-main {
    align-items: center !important;
    justify-content: center !important;
}
</style>