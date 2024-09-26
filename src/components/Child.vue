<template>
    <h1>Child Component</h1>
    <v-btn color="secondary" v-on:click="getPayload(payload)">Send Payload</v-btn>
</template>

<script>
export default {
    name: "User",

    data() {
        return {
            payload: {
                first_name: "Dipu",
                last_name: "Sharma"
            }
        }
    },
    props: {
        getPayload: Function
    }
}
</script>

<style scoped>
h1 {
    color: blue;
}
</style>
