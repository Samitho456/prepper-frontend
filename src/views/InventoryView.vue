<script setup>
import { ref, onMounted, computed } from 'vue'
import InventoryLocationSection from '@/components/InventoryLocationSection.vue'
import axios from 'axios'
import { RingLoader } from 'vue3-spinner'
import { useLocationStore } from '@/stores/counter'
import { useRecipeStore } from '@/stores/recipes'
import { useIngredientStore } from '@/stores/ingredients'
import { RouterLink } from 'vue-router'

// State variables
const isLoading = ref(false) // Loading state
const activeTab = ref(0) // Currently active tab
const inventoryItems = ref([]) // Inventory items data
const locationStore = useLocationStore() // Locations store
const recipeStore = useRecipeStore() // Recipes store
const ingredientStore = useIngredientStore() // Ingredients store
const addForm = ref(false) // State for add location form
const addFormLocationName = ref('') // New location name input
const searchQuery = ref('') // Search filter

// Get data from stores
const recipes = computed(() => recipeStore.allRecipes)
const ingredients = computed(() => ingredientStore.allIngredients)

// Fetch inventory items from the API
async function fetchInventory() {
  await axios
    .get('/api/InventoryItems')
    .then((response) => {
      inventoryItems.value = response.data
    })
    .catch((error) => {
      console.error('Error fetching inventory items:', error)
    })
}

// Fetch locations from the API
async function fetchLocations() {
  await axios
    .get('/api/locations')
    .then((response) => {
      locationStore.setLocations(response.data)
    })
    .catch((error) => {
      console.error('Error fetching locations:', error)
    })
}

// Fetch recipes from the API
async function fetchRecipes() {
  await recipeStore.fetchRecipes()
}

// Fetch ingredients from the API
async function fetchIngredients() {
  await ingredientStore.fetchIngredients()
}

// Updates Existing Inventory List with New Item
function handleItemAdded(newItem) {
  inventoryItems.value.push(newItem)
}

// Updates Existing Inventory List with Updated Item
function handleItemUpdated(updatedItem) {
  inventoryItems.value = inventoryItems.value.map((item) =>
    item.id === updatedItem.id ? updatedItem : item,
  )
}

// Removes Deleted Item from Existing Inventory List
function handleItemDeleted(deletedItem) {
  inventoryItems.value = inventoryItems.value.filter((item) => item.id !== deletedItem.id)
}

function generateInventoryItems() {
  if (activeTab.value === 0) {
    return filterInventoryItems(inventoryItems.value) // Show all items
  }

  const filteredItems = inventoryItems.value.filter((item) => item.locationId === activeTab.value)
  return filterInventoryItems(filteredItems)
}

function filterInventoryItems(items) {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return items
  }

  return items.filter((item) => getItemDisplayName(item).includes(query))
}

function getItemDisplayName(item) {
  if (item.ingredientId) {
    const ingredient = ingredients.value.find((ing) => ing.id === item.ingredientId)
    return (ingredient?.name || String(item.ingredientId)).toLowerCase()
  }

  if (item.recipeId) {
    const recipe = recipes.value.find((rec) => rec.id === item.recipeId)
    return (recipe?.title || String(item.recipeId)).toLowerCase()
  }

  return (item.name || '').toLowerCase()
}

// On component mount, fetch all necessary data
onMounted(async () => {
  isLoading.value = true
  await fetchInventory()
  await fetchLocations()
  await fetchRecipes()
  await fetchIngredients()
  isLoading.value = false
})
</script>

<template>
  <section v-if="!isLoading">
    <div class="list-header">
      <div>
        <button class="tab" :class="{ active: activeTab === 0 }" @click="activeTab = 0">All</button>
      </div>
      <div v-for="location in locationStore.locations" :key="location.id">
        <button
          class="tab"
          :class="{ active: activeTab === location.id }"
          @click="activeTab = location.id"
        >
          {{ location.name }}
        </button>
      </div>
      <button class="tab">
        <RouterLink :to="`/ManageLocations`">Manage Locations</RouterLink>
      </button>
    </div>
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search inventory..."
        aria-label="Search inventory"
      />
    </div>
    <InventoryLocationSection
      :locations="locationStore.locations"
      :location-id="activeTab"
      :inventoryItems="generateInventoryItems()"
      :ingredients="ingredients"
      :recipes="recipes"
      @item-added="handleItemAdded"
      @item-updated="handleItemUpdated"
      @item-deleted="handleItemDeleted"
    />

    <!-- Shows form to add a new location -->
    <form v-if="addForm" @submit.prevent="addLocation()">
      <h3>Add New Location</h3>
      <input type="text" placeholder="Location Name" v-model="addFormLocationName" />
      <button type="submit">Add Location</button>
      <button type="button" @click="((addForm = false), (addFormLocationName = ''))">Cancel</button>
    </form>
  </section>
  <div v-else class="loading-spinner">
    <RingLoader :loading="isLoading" color="#3a8f9f" size="100px" />
  </div>
</template>

<style scoped>
section {
  padding: 30px;
}

.list-header {
  padding: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: min(420px, 100%);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

.tab {
  background-color: transparent;
  padding: 10px 20px;
  border: none;
  color: var(--secondary-font-color);
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.active {
  color: var(--font-color);
  border-bottom: 3px solid var(--tertiary-color);
}

.tab a {
  text-decoration: none;
  color: inherit;
}
</style>
