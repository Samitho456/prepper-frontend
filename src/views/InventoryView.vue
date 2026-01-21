<script setup>
import { ref, onMounted } from 'vue'

const locations = ref([
  {
    id: 1,
    name: 'Pantry',
    user_id: 1,
  },
  {
    id: 2,
    name: 'Fridge',
    user_id: 1,
  },
  {
    id: 3,
    name: 'Freezer',
    user_id: 1,
  },
])

const Inventory = ref([
  {
    id: 1,
    quantity: 2,
    base_unit: 'kg',
    user_id: 1,
    ingredient_id: 1,
    recipe_id: null,
    location_id: 1,
  },
  {
    id: 2,
    quantity: 1,
    base_unit: 'liters',
    user_id: 1,
    ingredient_id: 2,
    recipe_id: null,
    location_id: 1,
  },
  {
    id: 3,
    quantity: 5,
    base_unit: 'cans',
    user_id: 1,
    ingredient_id: 3,
    recipe_id: null,
    location_id: 1,
  },
  {
    id: 4,
    quantity: 3,
    base_unit: 'portions',
    user_id: 1,
    ingredient_id: null,
    recipe_id: 1,
    location_id: 2,
  },
  {
    id: 5,
    quantity: 4,
    base_unit: 'portions',
    user_id: 1,
    ingredient_id: null,
    recipe_id: 2,
    location_id: 3,
  },
])

function fetchInventory() {
  // Placeholder for future data fetching logic
  console.log('Fetching inventory data...')
}

function fetchLocations() {
  // Placeholder for future data fetching logic
  console.log('Fetching locations data...')
}

function fetchRecipes() {
  // Placeholder for future data fetching logic
  console.log('Fetching recipes data...')
}

function fetchIngredients() {
  // Placeholder for future data fetching logic
  console.log('Fetching ingredients data...')
}

onMounted(() => {
  fetchInventory()
  fetchLocations()
  fetchRecipes()
  fetchIngredients()
})
</script>

<template>
  <section>
    <div v-for="location in locations" :key="location.id" class="border-b border-gray-300 py-2">
      <div>{{ location.name }}</div>
      <div v-for="item in Inventory.filter((i) => i.location_id === location.id)" :key="item.id">
        <div>
          <span v-if="item.ingredient_id">Ingredient ID: {{ item.ingredient_id }}</span>
          <span v-else>Recipe ID: {{ item.recipe_id }}</span>
          - Quantity: {{ item.quantity }} {{ item.base_unit }}
        </div>
      </div>
    </div>
  </section>
</template>
