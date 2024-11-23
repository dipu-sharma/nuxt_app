<template>
  <div class="pt-20">
    <p>Count: {{ counter.count }}</p>
    <button @click="counter.increment">Increment</button>
    <button @click="counter.decrement">Decrement</button>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Contact',
  description: 'Learn more about our company',
  layout: 'default'
})
import { useCounterStore } from '~/stores/counterStore';

const counter = useCounterStore();
</script>