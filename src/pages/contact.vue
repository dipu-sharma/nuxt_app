<template>
    <div class="pt-20">
      <p>Count: {{ counter.count }}</p>
      <button @click="counter.increment">Increment</button>
      <button @click="counter.decrement">Decrement</button>
    </div>
  </template>
  
  <script setup>
  import { useCounterStore } from '~/stores/counterStore';
  
  const counter = useCounterStore();
  </script>
  