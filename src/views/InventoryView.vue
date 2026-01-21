<script setup>
import { ref, onMounted } from 'vue'
import InventoryLocationSection from '@/components/InventoryLocationSection.vue'
import axios from 'axios'

const inventoryItems = ref([])
const locations = ref([])
const recipes = ref([])
const ingredients = ref([])

const addForm = ref(false)

function fetchInventory() {
  // Placeholder for future data fetching logic
  // inventoryItems.value = [
  //   {
  //     id: 1,
  //     quantity: 5,
  //     unit: 'kg',
  //     expiration_date: '2026-12-31',
  //     user_id: 1,
  //     ingredient_id: 1,
  //     recipe_id: null,
  //     location_id: 1,
  //     created_at: '2024-01-01',
  //   },
  //   {
  //     id: 2,
  //     quantity: 2,
  //     unit: 'portions',
  //     expiration_date: '2025-06-30',
  //     user_id: 1,
  //     ingredient_id: null,
  //     recipe_id: 1,
  //     location_id: 2,
  //     created_at: '2024-02-15',
  //   },
  // ]

  axios
    .get('/api/InventoryItems')
    .then((response) => {
      inventoryItems.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching inventory items:', error)
    })
}

function fetchLocations() {
  // Placeholder for future data fetching logic
  // locations.value = [
  //   { id: 1, name: 'Pantry', created_at: '2024-01-01' },
  //   { id: 2, name: 'Fridge', created_at: '2024-01-02' },
  // ]
  axios
    .get('/api/locations')
    .then((response) => {
      locations.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching locations:', error)
    })
}

function fetchRecipes() {
  // Placeholder for future data fetching logic
  recipes.value = [
    {
      id: 1,
      title: 'Spaghetti Bolognese',
      description: 'A classic Italian dish.',
      servings: 4,
      meal_type: 'Dinner',
      preparation_time: 60,
      created_at: '2024-01-10',
    },
    {
      id: 2,
      title: 'Caesar Salad',
      description: 'A fresh salad with Caesar dressing.',
      servings: 2,
      meal_type: 'Lunch',
      preparation_time: 20,
      created_at: '2024-01-15',
    },
  ]
}

function fetchIngredients() {
  // Placeholder for future data fetching logic
  ingredients.value = [
    { id: 1, name: 'Tomato', created_at: '2024-01-05' },
    { id: 2, name: 'Lettuce', created_at: '2024-01-07' },
  ]
}

function addLocation() {
  // Placeholder for future add location logic
  console.log('Adding new location')
  addForm.value = false
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
    <InventoryLocationSection
      v-for="location in locations"
      :key="location.id"
      :location="location"
      :inventoryItems="inventoryItems.filter((item) => item.locationId === location.id)"
    />

    <div v-if="addForm">
      <h3>Add New Location</h3>
      <input type="text" placeholder="Location Name" />
      <button @click="addLocation">Save</button>
      <button @click="addForm = false">Cancel</button>
    </div>

    <button v-if="!addForm" class="action-button" @click="addForm = true">Add Location</button>
  </section>
</template>
