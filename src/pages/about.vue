<template>
    <v-app>
        <v-main>
            <v-container>
                <v-btn color="primary">About Page Hello, Vuetify!</v-btn>

                <v-autocomplete v-model="values" :items="items.text" density="comfortable"
                    label="Comfortable"></v-autocomplete>
                <h4>{{ child_payload.first_name }}</h4>
                <h4>{{ child_payload.last_name }}</h4>

                <div>
                    <Child :getPayload="getChildPayload" />
                </div>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Child from '~/components/Child.vue';

export default {
    components: {
        Child
    },
    data() {
        return {
            items: [
                { text: 'California Ram is a king of Ayodhya...', value: 'california' },
                { text: 'Colorado', value: 'colorado' },
                { text: 'Florida', value: 'florida' },
                { text: 'Georgia', value: 'georgia' },
                { text: 'Texas', value: 'texas' },
                { text: 'Wyoming', value: 'wyoming' }
            ],
            child_payload: {
                first_name: '',
                last_name: ''
            }
        };
    },
    methods: {
        getChildPayload(payload) {
            this.child_payload.first_name = payload.first_name;
            this.child_payload.last_name = payload.last_name;
        }
    },
    created() {
        console.log(this.items);  // Check if items are correctly defined
    }
};
</script>

<style scoped>
.wrapped-item {
    white-space: normal;
    word-wrap: break-word;
}
</style>
