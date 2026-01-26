<template>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="purchaseOrder.supplier_name"
              label="Supplier Name"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="purchaseOrder.order_date"
              label="Order Date"
              type="date"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="my-4"></v-divider>
        <v-row v-for="(item, index) in purchaseOrder.items" :key="index">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="item.item_name"
              label="Item Name"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="item.quantity"
              label="Quantity"
              type="number"
              :rules="[rules.required, rules.number]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="item.unit_price"
              label="Unit Price"
              type="number"
              :rules="[rules.required, rules.number]"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2" class="flex items-center">
            <v-btn icon @click="removeItem(index)" color="red">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-btn @click="addItem" color="primary" class="mt-4">Add Item</v-btn>
      </v-container>
    </v-form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    initialData: {
      type: Object,
      default: () => ({
        supplier_name: '',
        order_date: new Date().toISOString().substr(0, 10),
        items: [{ item_name: '', quantity: 1, unit_price: 0 }],
      }),
    },
  });
  
  const purchaseOrder = ref({ ...props.initialData });
  
  const rules = {
    required: value => !!value || 'Required.',
    number: value => !isNaN(Number(value)) || 'Must be a number.',
  };
  
  const form = ref(null);
  
  const addItem = () => {
    purchaseOrder.value.items.push({ item_name: '', quantity: 1, unit_price: 0 });
  };
  
  const removeItem = (index) => {
    purchaseOrder.value.items.splice(index, 1);
  };
  
  const submit = async () => {
    const { valid } = await form.value.validate();
    if (valid) {
      return purchaseOrder.value;
    }
    return null;
  };

  defineExpose({
    submit,
  });
  </script>
  