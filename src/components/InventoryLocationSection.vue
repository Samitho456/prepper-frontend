<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'InventoryLocationSection',
})

const itemToEdit = ref(null)

function UpdateItem(item) {
  // Placeholder for future update logic
  console.log('Updating item:', item)
  itemToEdit.value = null
}

function deleteItem(item) {
  // Placeholder for future delete logic
  console.log('Deleting item:', item)
}

defineProps({
  location: {
    type: Object,
    required: true,
  },
  inventoryItems: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div>
    <h2>{{ location.name }}</h2>
    <button>Edit location</button>
    <ul>
      <li v-for="item in inventoryItems" :key="item.id">
        <div v-if="itemToEdit == item">
          <input type="number" v-model="item.quantity" placeholder="Quantity" />
          <input type="text" v-model="item.unit" placeholder="Unit" />
          <button @click="UpdateItem(item)">Save</button>
          <button @click="itemToEdit = null">Cancel</button>
        </div>
        <div v-else>
          <span v-if="item.ingredient_id">Ingredient ID: {{ item.ingredient_id }}</span>
          <span v-else>Recipe ID: {{ item.recipe_id }}</span>
          - Quantity: {{ item.quantity }} {{ item.unit }}
          <button @click="itemToEdit = item">Edit Item</button>
          <button @click="deleteItem(item)">Delete Item</button>
        </div>
      </li>
      <li>
        <button>Add Item</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h2 {
  font-size: 1.5em;
  margin-bottom: 0.5em;
  background-color: #f0f0f0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 0.25em;
}
</style>
