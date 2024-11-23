<template>
    <v-container class="d-flex justify-center align-center fill-height" fluid>
        <v-card class="px-4 py-4 shadow-lg" width="400">
            <v-card-title class="text-center">
                <h2 class="text-h5 font-bold text-gray-900">Register your account</h2>
            </v-card-title>
            <v-form class="p-4">
                <v-text-field label="Email ID" v-model="payload.email_id" type="email" required outlined
                    class="no-focus scoped-field" hide-details variant="outlined" bg-color="white"></v-text-field>

                <p class="text-center my-4">Or</p>

                <v-text-field label="Mobile No" v-model="payload.mobile_no" type="text" required outlined
                    class="no-focus" variant="outlined" hide-details bg-color="white"></v-text-field>

                <v-text-field label="Password" v-model="payload.password" :type="showPassword ? 'text' : 'password'"
                    required outlined class="no-focus mt-4" append-inner-icon="mdi-eye"
                    @click:append-inner="togglePasswordVisibility" variant="outlined" bg-color="white"></v-text-field>

                <v-text-field label="Confirm Password" hide-details v-model="payload.confirm_password"
                    :type="showConfirmPassword ? 'text' : 'password'" required outlined class="no-focus"
                    append-inner-icon="mdi-eye" @click:append-inner="toggleConfirmPasswordVisibility" variant="outlined"
                    bg-color="white"></v-text-field>

                <v-select clearable v-model="payload.user_type" :items="user_type_list" hide-details
                    :rules="[v => !!v || 'Item is required']" label="Select User Type" required bg-color="white"
                    variant="outlined" class="no-focus mt-4"></v-select>

                <v-btn rounded="xl" variant="text" @click.prevent="handleRegister" block class="bg-primary mt-4">
                    Sign-Up
                </v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>

<script setup>
definePageMeta({
    title: 'Login',
    description: 'Learn more about our company',
    layout: 'default'
})
const user_type_list = ref([
    'Admin',
    'User',
    'Vendor'
])

const payload = ref({
    email_id: "",
    mobile_no: "",
    password: "",
    confirm_password: "",
    user_type: ''
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
};

const handleRegister = () => {
    // Handle form submission logic here
};
</script>

<style scoped>
.scoped-field v-input {
    font-size: 16px;
    color: #ff6f00;
}
</style>
