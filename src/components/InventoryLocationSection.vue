<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Vuefeather from 'vue-feather'

defineOptions({
  name: 'InventoryLocationSection',
})

// State variables
const selectedItem = ref(null) // Currently selected item
const itemToEdit = ref(null) // Currently edited item
const showAddItemForm = ref(false) // State for add item form
const showMoreActions = ref(null) // State for showing more actions
const showLocationPopup = ref(false) // State for showing location popup
const selectedLocationId = ref(null) // Currently selected location ID (popup)
const showPopupAlert = ref(false) // State for showing popup alert
const newItemType = ref({
  type: '',
  id: null,
}) // 'ingredient' or 'recipe'

const newItem = ref({
  id: 0,
  quantity: null,
  unit: '',
  expirationDate: '',
  expiresIn: null,
  userId: 1,
  ingredientId: null,
  recipeId: null,
  locationId: null,
  createdAt: '',
}) // New Item being added

const editItemType = ref({
  type: '',
  id: null,
}) // 'ingredient' or 'recipe' for edited item

const editItem = ref({
  id: null,
  quantity: null,
  unit: '',
  expirationDate: '',
  userId: null,
  ingredientId: null,
  recipeId: null,
  locationId: null,
  createdAt: '',
}) // Currently Item being edited

const locationToEdit = ref(null) // Currently location To edited
const editLocation = ref({
  id: null,
  name: '',
  created_at: '',
}) // Currently location being edited

// Emit events to parent component
const emits = defineEmits(['location-updated', 'item-added', 'item-updated', 'item-deleted'])

// Emits update event to parent component to update location
function updateLocation(location) {
  emits('location-updated', location)
  locationToEdit.value = null
}

function updateExpirationDate() {
  if (editItem.value.expiresIn !== null) {
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + parseInt(editItem.value.expiresIn))
    editItem.value.expirationDate = currentDate.toISOString().split('T')[0]
  } else {
    editItem.value.expirationDate = ''
  }
}

function updateExpiresIn() {
  if (editItem.value.expirationDate) {
    const currentDate = new Date()
    const expirationDate = new Date(editItem.value.expirationDate)
    const timeDiff = expirationDate.getTime() - currentDate.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    editItem.value.expiresIn = daysDiff
  } else {
    editItem.value.expiresIn = null
  }
}

function updateLocationOnItem() {
  newItem.value.locationId = selectedLocationId.value
  showLocationPopup.value = false
  addItemToLocation()
}

// Add a new item to the location
function addItemToLocation() {
  if (newItemType.value.type === 'ingredient') {
    newItem.value.ingredientId = newItemType.value.id
    newItem.value.recipeId = null
  } else if (newItemType.value.type === 'recipe') {
    newItem.value.recipeId = newItemType.value.id
    newItem.value.ingredientId = null
  } else {
    console.error('Invalid item type selected')
    return
  }
  if (!newItem.value.locationId && !props.locationId) {
    showLocationPopup.value = true
    return
  }

  const payload = {
    ingredientId: newItem.value.ingredientId,
    recipeId: newItem.value.recipeId,
    quantity: newItem.value.quantity,
    unit: newItem.value.unit,
    expirationDate: newItem.value.expirationDate || null,
    locationId: props.locationId || newItem.value.locationId,
    userId: newItem.value.userId,
  }

  axios
    .post('/api/inventoryItems', payload)
    .then((response) => {
      emits('item-added', response.data)
      showAddItemForm.value = false
      newItemType.value = { type: '', id: null }
      newItem.value.quantity = 0
      newItem.value.unit = ''
      newItem.value.expirationDate = ''
    })
    .catch((error) => {
      console.error('Error adding item:', error)
    })
}

// Update an existing item
function updateItem(item) {
  axios
    .put(`/api/inventoryItems/${item.id}`, { ...editItem.value })
    .then((response) => {
      emits('item-updated', response.data)
    })
    .catch((error) => {
      console.error('Error updating item:', error)
    })
  itemToEdit.value = null
}

// Delete an item
function deleteItem() {
  axios
    .delete(`/api/inventoryItems/${editItem.value.id}`)
    .then((response) => {
      emits('item-deleted', response.data)
    })
    .catch((error) => {
      console.error('Error deleting item:', error)
    })
  showPopupAlert.value = false
}

// Handle clicks outside the dropdown menu
function handleClickOutside(event) {
  const moreActionsMenu = document.querySelector('.more-actions-menu')
  const moreButton = event.target.closest('.more-button')

  if (!moreButton && moreActionsMenu && !moreActionsMenu.contains(event.target)) {
    showMoreActions.value = null
  }
}

// Set up and clean up event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
  locationId: {
    type: Number,
    required: true,
  },
  inventoryItems: {
    type: Array,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  recipes: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <!-- Sections location and its items -->
  <div class="inventory-section">
    <table>
      <!-- Header showing titles -->
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Expiration Date</th>
          <th>Expires In</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterating over inventory items -->
        <tr v-for="item in inventoryItems" :key="item.id">
          <!-- Show dropdowns for ingredient/recipe selection when editing-->
          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <select v-model="editItemType.type">
              <option disabled selected value="">Select Type</option>
              <option value="ingredient">Ingredient</option>
              <option value="recipe">Recipe</option>
            </select>
            <select v-model.number="editItemType.id">
              <option disabled selected :value="null">Select Item</option>
              <template v-if="editItemType.type === 'ingredient'">
                <option
                  v-for="ingredient in ingredients"
                  :key="ingredient.id"
                  :value="ingredient.id"
                >
                  {{ ingredient.name }}
                </option>
              </template>
              <template v-if="editItemType.type === 'recipe'">
                <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
                  {{ recipe.title }}
                </option>
              </template>
            </select>
          </td>
          <!-- Show name of item -->
          <td v-else>
            <span v-if="item.ingredientId">
              {{
                ingredients.find((ing) => ing.id === item.ingredientId)?.name || item.ingredientId
              }}</span
            >
            <span v-else>{{
              recipes.find((rec) => rec.id === item.recipeId)?.title || item.recipeId
            }}</span>
          </td>

          <!-- Show input for quantity when editing -->
          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <input
              type="number"
              v-model="editItem.quantity"
              placeholder="Quantity"
              min="0"
              step="any"
            />
          </td>
          <!-- Show quantity of item -->
          <td v-else>{{ item.quantity }}</td>

          <!-- Show input for unit when editing -->
          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <input type="text" v-model="editItem.unit" placeholder="Unit" />
          </td>
          <!-- Show unit of item -->
          <td v-else>{{ item.unit }}</td>

          <!-- Show input for expiration date when editing -->
          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <input type="date" v-model="editItem.expirationDate" @input="updateExpiresIn" />
          </td>
          <!-- Show expiration date of item -->
          <td v-else>{{ item.expirationDate || 'unknown' }}</td>

          <!-- Show input for days when editing -->
          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <input type="number" v-model="editItem.expiresIn" @input="updateExpirationDate" />
          </td>
          <!-- Show days until expiration -->
          <td v-else>
            <span v-if="item.expirationDate">
              {{
                Math.ceil(
                  (new Date(item.expirationDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              }}
              days
            </span>
            <span v-else>N/A</span>

            <!-- Action buttons for save/cancel when editing -->
          </td>

          <td v-if="itemToEdit && itemToEdit.id === item.id">
            <button @click.prevent="updateItem(item)">Save</button>
            <button
              @click="((itemToEdit = null), (showPopupAlert = false), (showLocationPopup = false))"
            >
              Cancel
            </button>
          </td>
          <!-- More actions button when not editing -->
          <td v-else>
            <button
              @click="showMoreActions = showMoreActions === item.id ? false : item.id"
              class="more-button"
            >
              <vuefeather type="more-vertical" size="18" />
            </button>
            <div v-if="showMoreActions === item.id" class="more-actions-menu">
              <button
                @click="
                  ((itemToEdit = item),
                  (editItem = { ...item }),
                  (showMoreActions = false),
                  (editItemType.type = item.ingredientId ? 'ingredient' : 'recipe'),
                  (editItemType.id = item.ingredientId || item.recipeId))
                "
              >
                Edit
              </button>
              <button
                @click="
                  ((showPopupAlert = true),
                  (editItem = { ...item }),
                  (showMoreActions = false),
                  (editItemType.type = item.ingredientId ? 'ingredient' : 'recipe'),
                  (editItemType.id = item.ingredientId || item.recipeId))
                "
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
        <!-- Add item form toggle -->
        <tr v-if="!showAddItemForm">
          <td colspan="6">
            <button @click="showAddItemForm = true">Add Item</button>
          </td>
        </tr>
        <!-- Add item form -->
        <tr v-else>
          <td>
            <div class="item-select-container">
              <select v-model="newItemType.type" class="type-select">
                <option disabled selected value="">Select Type</option>
                <option value="ingredient">Ingredient</option>
                <option value="recipe">Recipe</option>
              </select>
              <select v-model.number="newItemType.id" class="item-select">
                <option disabled selected :value="null">Select Item</option>
                <template v-if="newItemType.type === 'ingredient'">
                  <option
                    v-for="ingredient in ingredients"
                    :key="ingredient.id"
                    :value="ingredient.id"
                    @select="newItemType.type = 'ingredient'"
                  >
                    {{ ingredient.name }}
                  </option>
                </template>
                <template v-if="newItemType.type === 'recipe'">
                  <option
                    v-for="recipe in recipes"
                    :key="recipe.id"
                    :value="recipe.id"
                    @select="newItemType.type = 'recipe'"
                  >
                    {{ recipe.title }}
                  </option>
                </template>
              </select>
            </div>
          </td>
          <td>
            <input
              type="number"
              v-model="newItem.quantity"
              placeholder="Quantity"
              min="0"
              step="any"
            />
          </td>
          <td>
            <input type="text" v-model="newItem.unit" placeholder="Unit" />
          </td>
          <td>
            <input type="date" v-model="newItem.expirationDate" @input="updateExpiresIn" />
          </td>
          <td>
            <input type="number" v-model="newItem.expiresIn" @input="updateExpirationDate" />
          </td>
          <td>
            <button @click.prevent="addItemToLocation">Add</button>
            <button
              @click="
                (((showAddItemForm = false),
                (newItem.quantity = 0),
                (newItem.unit = ''),
                (newItemType = { type: '', id: null }),
                (newItem.id = null),
                (newItem.expirationDate = '')),
                (showPopupAlert = false),
                (showLocationPopup = false))
              "
            >
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Popup 'Select location to add item to' -->
  <div class="popup-alert" v-if="showLocationPopup">
    <p>You are not under a valid location.</p>
    <p>Please select a location to add item to.</p>
    <select name="location-select" id="location-select" v-model="selectedLocationId">
      <option v-for="location in locations" :key="location.id" :value="location.id">
        {{ location.name }}
      </option>
    </select>
    <button @click="updateLocationOnItem" class="action-button">Confirm</button>
  </div>

  <!-- Popup 'Are you sure you want to delete this item?' -->
  <div class="popup-alert" v-if="showPopupAlert">
    <div>
      {{ editItem.quantity }} - {{ editItem.unit }}
      <span v-if="editItemType.type === 'ingredient'">
        {{ ingredients.find((ing) => ing.id === editItemType.id)?.name || editItemType.id }}</span
      >
      <span v-else>{{
        recipes.find((rec) => rec.id === editItemType.id)?.title || editItemType.id
      }}</span>
      <p>Expiring on {{ editItem.expirationDate || 'N/A' }}</p>
    </div>
    <p>Are you sure you want to delete this item?</p>
    <button @click="showPopupAlert = false" class="action-button">Cancel</button>
    <button @click="deleteItem" class="cancel-button">Delete</button>
  </div>
</template>

<style scoped>
.inventory-section {
  margin-bottom: 40px;
  background-color: var(--content-card-bg);
  border-radius: var(--container-border-radius);
  padding: 20px;
}

table {
  border-radius: var(--container-border-radius);
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th,
td {
  border-bottom: 1px solid #ddd;
  padding: 8px;
}
th {
  text-align: left;
}

.more-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.more-actions-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.more-actions-menu button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.more-actions-menu button:hover {
  background-color: #f5f5f5;
}

.item-select-container {
  display: flex;
  gap: 8px;
}

.type-select,
.item-select {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.type-select {
  max-width: 120px;
}
.item-select {
  width: 100px;
}

.location-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}
.location-popup p {
  margin-bottom: 10px;
}

.popup-alert {
  width: 300px;
  height: 200px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--content-card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--container-border-radius);
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 2000;
}

.popup-alert select {
  width: 100%;
  margin-bottom: 10px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.popup-alert div {
  margin-bottom: 10px;
}
.popup-alert button {
  margin-right: 10px;
}
</style>
