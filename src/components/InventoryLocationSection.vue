<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Vuefeather from 'vue-feather'
import DeletePopupAlert from '@/components/DeletePopupAlert.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

defineOptions({
  name: 'InventoryLocationSection',
})

// State variables
const selectedItem = ref(null) // Currently selected item
const showAddItemForm = ref(false) // State for add item form
const showMoreActions = ref(null) // State for showing more actions
const showPopupAlert = ref(false) // State for showing popup alert

const editItemType = ref({
  type: '',
  id: null,
}) // 'ingredient' or 'recipe' for edited item

const editItem = ref({
  id: null,
  quantity: null,
  unit: '',
  expirationDate: '',
  expiresIn: null,
  userId: null,
  ingredientId: null,
  recipeId: null,
  locationId: null,
  createdAt: '',
}) // Currently Item being edited

// Emit events to parent component
const emits = defineEmits(['item-added', 'item-updated', 'item-deleted'])

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

function startEditing(item) {
  selectedItem.value = item
  editItem.value = { ...item }
  editItemType.value.type = item.ingredientId ? 'ingredient' : 'recipe'
  editItemType.value.id = item.ingredientId || item.recipeId
  showMoreActions.value = false
  // If location is not set and we're in a specific location view, set it as default
  if (!editItem.value.locationId && props.locationId) {
    editItem.value.locationId = props.locationId
  }
  updateExpiresIn()
}

function validateAddItem() {
  if (!editItemType.value.type || !editItemType.value.id) {
    return { status: false, message: 'Please select an ingredient or recipe.' }
  }
  if (!editItem.value.quantity || editItem.value.quantity <= 0) {
    return { status: false, message: 'Please enter a valid quantity.' }
  }
  if (!editItem.value.unit) {
    return { status: false, message: 'Please enter a unit.' }
  }
  if (!editItem.value.locationId) {
    return { status: false, message: 'Please select a location.' }
  }
  return { status: true }
}

// Add a new item to the location
function addItemToLocation() {
  const validation = validateAddItem()
  if (!validation.status) {
    toast.error(validation.message)
    return
  }

  if (editItemType.value.type === 'ingredient') {
    editItem.value.ingredientId = editItemType.value.id
    editItem.value.recipeId = null
  } else if (editItemType.value.type === 'recipe') {
    editItem.value.recipeId = editItemType.value.id
    editItem.value.ingredientId = null
  }

  const payload = {
    ingredientId: editItem.value.ingredientId,
    recipeId: editItem.value.recipeId,
    quantity: editItem.value.quantity,
    unit: editItem.value.unit,
    expirationDate: editItem.value.expirationDate || null,
    locationId: props.locationId || editItem.value.locationId,
    userId: 1,
  }

  axios
    .post('/api/inventoryItems', payload)
    .then((response) => {
      emits('item-added', response.data)
      showAddItemForm.value = false
      resetEditItem()
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
  resetEditItem()
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

function resetEditItem() {
  selectedItem.value = null
  editItem.value = {
    id: null,
    quantity: null,
    unit: '',
    expirationDate: '',
    expiresIn: null,
    userId: null,
    ingredientId: null,
    recipeId: null,
    locationId: null,
    createdAt: '',
  }
  editItemType.value = { type: '', id: null }
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
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Iterating over inventory items -->
        <tr v-for="item in inventoryItems" :key="item.id">
          <!-- Show dropdowns for ingredient/recipe selection when editing-->
          <td v-if="selectedItem && selectedItem.id === item.id">
            <div class="item-select-container">
              <select v-model="editItemType.type" class="type-select">
                <option disabled selected value="">Select Type</option>
                <option value="ingredient">Ingredient</option>
                <option value="recipe">Recipe</option>
              </select>
              <select v-model.number="editItemType.id" class="item-select">
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
            </div>
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
          <td v-if="selectedItem && selectedItem.id === item.id">
            <input
              class="input-field"
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
          <td v-if="selectedItem && selectedItem.id === item.id">
            <input type="text" class="input-field" v-model="editItem.unit" placeholder="Unit" />
          </td>
          <!-- Show unit of item -->
          <td v-else>{{ item.unit }}</td>

          <!-- Show input for expiration date when editing -->
          <td v-if="selectedItem && selectedItem.id === item.id">
            <input
              type="date"
              class="input-field"
              v-model="editItem.expirationDate"
              @input="updateExpiresIn"
            />
          </td>
          <!-- Show expiration date of item -->
          <td v-else>{{ item.expirationDate || 'unknown' }}</td>

          <!-- Show input for days when editing -->
          <td v-if="selectedItem && selectedItem.id === item.id">
            <input
              type="number"
              class="input-field"
              v-model="editItem.expiresIn"
              @input="updateExpirationDate"
            />
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
          </td>

          <!-- Show location selector when editing -->
          <td v-if="selectedItem && selectedItem.id === item.id">
            <select v-model.number="editItem.locationId" class="input-field">
              <option :value="null">Select Location</option>
              <option v-for="location in locations" :key="location.id" :value="location.id">
                {{ location.name }}
              </option>
            </select>
          </td>
          <!-- Show location name when viewing -->
          <td v-else>
            {{ locations.find((loc) => loc.id === item.locationId)?.name || 'Unknown' }}
          </td>

          <!-- Action buttons for save/cancel when editing -->

          <td v-if="selectedItem && selectedItem.id === item.id">
            <button class="action-button" @click.prevent="updateItem(item)">Save</button>
            <button
              class="cancel-button"
              @click="((selectedItem = null), (showPopupAlert = false))"
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
              <button @click="startEditing(item)">Edit</button>
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
          <td colspan="7">
            <button class="action-button" @click="((showAddItemForm = true), resetEditItem())">
              Add Item
            </button>
          </td>
        </tr>
        <!-- Add item form -->
        <tr v-else>
          <td>
            <div class="item-select-container">
              <select v-model="editItemType.type" class="type-select">
                <option disabled selected value="">Select Type</option>
                <option value="ingredient">Ingredient</option>
                <option value="recipe">Recipe</option>
              </select>
              <select v-model.number="editItemType.id" class="item-select">
                <option disabled selected :value="null">Select Item</option>
                <template v-if="editItemType.type === 'ingredient'">
                  <option
                    v-for="ingredient in ingredients"
                    :key="ingredient.id"
                    :value="ingredient.id"
                    @select="editItemType.type = 'ingredient'"
                  >
                    {{ ingredient.name }}
                  </option>
                </template>
                <template v-if="editItemType.type === 'recipe'">
                  <option
                    v-for="recipe in recipes"
                    :key="recipe.id"
                    :value="recipe.id"
                    @select="editItemType.type = 'recipe'"
                  >
                    {{ recipe.title }}
                  </option>
                </template>
              </select>
            </div>
          </td>
          <td>
            <input
              class="input-field"
              type="number"
              v-model="editItem.quantity"
              placeholder="Quantity"
              min="0"
              step="any"
            />
          </td>
          <td>
            <input class="input-field" type="text" v-model="editItem.unit" placeholder="Unit" />
          </td>
          <td>
            <input
              class="input-field"
              type="date"
              v-model="editItem.expirationDate"
              @input="updateExpiresIn"
            />
          </td>
          <td>
            <input
              class="input-field"
              type="number"
              v-model="editItem.expiresIn"
              @input="updateExpirationDate"
            />
          </td>
          <td>
            <select v-model.number="editItem.locationId" class="input-field">
              <option :value="props.locationId || null">
                {{ props.locationId ? 'Current Location' : 'Select Location' }}
              </option>
              <option v-for="location in locations" :key="location.id" :value="location.id">
                {{ location.name }}
              </option>
            </select>
          </td>
          <td>
            <button @click.prevent="addItemToLocation" class="action-button">Add</button>
            <button @click="((showAddItemForm = false), resetEditItem())" class="cancel-button">
              Cancel
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Popup 'Are you sure you want to delete this item?' -->
  <delete-popup-alert
    v-if="showPopupAlert"
    title="Delete Item"
    message="Are you sure you want to delete this item?"
    :item-to-delete="editItem"
    @confirm="deleteItem"
    @cancel="showPopupAlert = false"
  />
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
</style>
