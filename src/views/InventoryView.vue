<script setup>
const Inventory = [
  { id: 1, name: 'Rice', quantity: '2 kg' },
  { id: 2, name: 'Beans', quantity: '1 kg' },
  { id: 3, name: 'Canned Tomatoes', quantity: '5 cans' },
]
</script>

<template>
  <section>
    <h2>Owned Items</h2>
    <div v-for="item in Inventory" :key="item.id">
      <h3>{{ item.name }}</h3>
      <p>Quantity: {{ item.quantity }}</p>
    </div>
  </section>
</template>

<style scoped></style>
