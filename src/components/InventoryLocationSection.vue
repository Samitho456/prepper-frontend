<script setup>
import { ref } from 'vue'
import axios from 'axios'
defineOptions({
  name: 'InventoryLocationSection',
})

const itemToEdit = ref(null)
const showAddItemForm = ref(false)
const newItemQuantity = ref(0)
const newItemUnit = ref('')

const editItem = ref({
  id: null,
  quantity: null,
  unit: '',
  expiration_date: '',
  user_id: null,
  ingredient_id: null,
  recipe_id: null,
  location_id: null,
  created_at: '',
})

const locationToEdit = ref(null)
const editLocation = ref({
  id: null,
  name: '',
  created_at: '',
})

const emits = defineEmits(['location-updated', 'item-added', 'item-updated', 'item-deleted'])

function updateLocation(location) {
  const data = { ...editLocation.value }
  // Placeholder for future update location logic
  axios
    .put(`/api/locations/${location.id}`, data)
    .then((response) => {
      emits('location-updated', response.data)
    })
    .catch((error) => {
      console.error('Error updating location:', error)
    })
  locationToEdit.value = null
}

function addItemToLocation(location, item) {
  // Placeholder for future add item logic
  const data = { ...item }
  data.location_id = location.id
  axios
    .post('/api/inventoryItems', data)
    .then((response) => {
      emits('item-added', response.data)
      showAddItemForm.value = false
      newItemQuantity.value = 0
      newItemUnit.value = ''
    })
    .catch((error) => {
      console.error('Error adding item:', error)
    })
}

function updateItem(item) {
  // Placeholder for future update logic
  const data = { ...editItem.value }
  axios
    .put(`/api/inventoryItems/${item.id}`, data)
    .then((response) => {
      emits('item-updated', response.data)
    })
    .catch((error) => {
      console.error('Error updating item:', error)
    })
  itemToEdit.value = null
}

function deleteItem(item) {
  // Placeholder for future delete logic
  axios
    .delete(`/api/inventoryItems/${item.id}`)
    .then(() => {
      emits('item-deleted', item)
    })
    .catch((error) => {
      console.error('Error deleting item:', error)
    })
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
    <div v-if="locationToEdit != location">
      <h2>{{ location.name }}</h2>
      <button @click="((locationToEdit = location), (editLocation = { ...location }))">
        Edit location
      </button>
    </div>
    <div v-else>
      <form @submit.prevent="updateLocation(location)">
        <input type="text" v-model="editLocation.name" required />
        <button type="submit">Save</button>
        <button @click="locationToEdit = null">Cancel</button>
      </form>
    </div>
    <ul>
      <li v-for="item in inventoryItems" :key="item.id">
        <form v-if="itemToEdit == item" @submit.prevent="updateItem(item)">
          <input type="number" v-model="editItem.quantity" placeholder="Quantity" required />
          <input type="text" v-model="editItem.unit" placeholder="Unit" required />
          <button type="submit">Save</button>
          <button @click="itemToEdit = null">Cancel</button>
        </form>
        <div v-else>
          <span v-if="item.ingredientId">Ingredient ID: {{ item.ingredientId }}</span>
          <span v-else>Recipe ID: {{ item.recipeId }}</span>
          - Quantity: {{ item.quantity }} {{ item.unit }}
          <button @click="((itemToEdit = item), (editItem = { ...item }))">Edit Item</button>
          <button @click.prevent="deleteItem(item)">Delete Item</button>
        </div>
      </li>
      <li>
        <button v-if="!showAddItemForm" @click="showAddItemForm = true">Add Item</button>
        <form
          v-else
          @submit.prevent="
            addItemToLocation(location, { quantity: newItemQuantity, unit: newItemUnit })
          "
        >
          <input type="number" placeholder="Quantity" v-model="newItemQuantity" required />
          <input type="text" placeholder="Unit" v-model="newItemUnit" required />
          <button type="submit">Add</button>
          <button @click="((showAddItemForm = false), (newItemQuantity = 0), (newItemUnit = ''))">
            Cancel
          </button>
        </form>
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
