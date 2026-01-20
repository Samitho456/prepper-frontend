<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import IngredientItem from '../components/IngredientItem.vue'
import { RingLoader } from 'vue3-spinner'

defineOptions({
  name: 'IngredientsView',
})

const unitLongFormMap = {
  g: 'grams',
  gram: 'grams',
  grams: 'grams',
  kg: 'kilograms',
  kilogram: 'kilograms',
  kilograms: 'kilograms',
  ml: 'milliliters',
  milliliter: 'milliliters',
  milliliters: 'milliliters',
  l: 'liters',
  liter: 'liters',
  liters: 'liters',
  dl: 'deciliters',
  deciliter: 'deciliters',
  deciliters: 'deciliters',
  tbsp: 'tablespoons',
  tablespoon: 'tablespoons',
  tablespoons: 'tablespoons',
  tsp: 'teaspoons',
  teaspoon: 'teaspoons',
  teaspoons: 'teaspoons',
  pc: 'piece',
  pcs: 'piece',
  piece: 'piece',
  pieces: 'piece',
  slice: 'slice',
  slices: 'slice',
}

const normalizeUnit = (unit) => {
  if (!unit) return unit
  const normalized = unitLongFormMap[unit.trim().toLowerCase()]
  return normalized || unit
}

const defaultUnits = [
  'grams',
  'kilograms',
  'milliliters',
  'liters',
  'deciliters',
  'tablespoons',
  'teaspoons',
  'piece',
  'slice',
]

const state = ref({
  ingredients: [],
  loading: true,
  expandedItems: {},
  editingProfile: null,
  editingData: {},
  savingProfile: null,
  addingProfile: null,
  newProfileData: {},
  availableUnits: [...defaultUnits],
  // Edit profile unit search
  unitSearchEdit: '',
  showUnitDropdownEdit: false,
  filteredUnitsEdit: [...defaultUnits],
  // Add profile unit search
  unitSearchAdd: '',
  showUnitDropdownAdd: false,
  filteredUnitsAdd: [...defaultUnits],
})

const extractUniqueUnits = (ingredients) => {
  const units = new Set()

  // Extract all unique baseUnit values from nutritional profiles
  ingredients.forEach((ingredient) => {
    ingredient.nutritionalProfiles.forEach((profile) => {
      if (profile.baseUnit) {
        units.add(normalizeUnit(profile.baseUnit))
      }
    })
  })

  // Convert to array and sort, then add default units if not already present
  const uniqueUnits = Array.from(units).sort()
  defaultUnits.forEach((unit) => {
    if (!uniqueUnits.includes(unit)) {
      uniqueUnits.push(unit)
    }
  })

  return uniqueUnits.sort()
}

onMounted(() => {
  document.title = 'Prepper - Ingredients'
  axios
    .get('api/Ingredients/GetNutritionalProfiles')
    .then((response) => {
      console.log('Fetched ingredients:', response.data)
      const normalizedIngredients = response.data.map((ingredient) => ({
        ...ingredient,
        nutritionalProfiles: ingredient.nutritionalProfiles.map((profile) => ({
          ...profile,
          baseUnit: normalizeUnit(profile.baseUnit),
        })),
      }))

      state.value.ingredients = normalizedIngredients

      // Extract unique units from the database
      const uniqueUnits = extractUniqueUnits(normalizedIngredients)
      state.value.availableUnits = uniqueUnits
      state.value.filteredUnitsEdit = [...uniqueUnits]
      state.value.filteredUnitsAdd = [...uniqueUnits]

      state.value.loading = false
    })
    .catch((error) => {
      console.error('Error fetching ingredients:', error)
      state.value.loading = false
    })
})

const toggleExpand = (ingredientId) => {
  state.value.expandedItems[ingredientId] = !state.value.expandedItems[ingredientId]
}

const isExpanded = (ingredientId) => {
  return state.value.expandedItems[ingredientId] || false
}

const startEdit = (profile) => {
  state.value.editingProfile = profile.id
  state.value.editingData = { ...profile, baseUnit: normalizeUnit(profile.baseUnit) }
}

const cancelEdit = () => {
  state.value.editingProfile = null
  state.value.editingData = {}
}

const saveProfile = async () => {
  const profileId = state.value.editingProfile
  state.value.savingProfile = profileId

  try {
    const normalizedData = {
      ...state.value.editingData,
      baseUnit: normalizeUnit(state.value.editingData.baseUnit),
    }

    const response = await axios.put(`/api/NutritionalProfiles/${profileId}`, normalizedData)
    console.log('Profile updated:', response.data)

    // Update the local state with the response
    const ingredientIndex = state.value.ingredients.findIndex((ing) =>
      ing.nutritionalProfiles.some((p) => p.id === profileId),
    )
    if (ingredientIndex !== -1) {
      const profileIndex = state.value.ingredients[ingredientIndex].nutritionalProfiles.findIndex(
        (p) => p.id === profileId,
      )
      if (profileIndex !== -1) {
        const updatedProfile = {
          ...response.data,
          baseUnit: normalizeUnit(response.data.baseUnit),
        }

        state.value.ingredients[ingredientIndex].nutritionalProfiles[profileIndex] = updatedProfile
      }
    }

    state.value.editingProfile = null
    state.value.editingData = {}
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    state.value.savingProfile = null
  }
}

const startAddProfile = (ingredientId) => {
  state.value.addingProfile = ingredientId
  state.value.newProfileData = {
    ingredientId: ingredientId,
    unitAmount: 100,
    baseUnit: 'grams',
    kcal: null,
    kj: null,
    fatTotal: null,
    fatSaturated: null,
    carbohydrateTotal: null,
    carbohydrateSugars: null,
    fiber: null,
    protein: null,
    salt: null,
  }
}

const cancelAddProfile = () => {
  state.value.addingProfile = null
  state.value.newProfileData = {}
}

const saveNewProfile = async () => {
  const ingredientId = state.value.addingProfile

  try {
    const normalizedData = {
      ...state.value.newProfileData,
      baseUnit: normalizeUnit(state.value.newProfileData.baseUnit),
    }

    const response = await axios.post(`/api/NutritionalProfiles`, normalizedData)
    console.log('Profile created:', response.data)

    // Add the new profile to the ingredient
    const ingredientIndex = state.value.ingredients.findIndex((ing) => ing.id === ingredientId)
    if (ingredientIndex !== -1) {
      const savedProfile = {
        ...response.data,
        baseUnit: normalizeUnit(response.data.baseUnit),
      }

      state.value.ingredients[ingredientIndex].nutritionalProfiles.push(savedProfile)
      // Expand the ingredient to show the new profile
      state.value.expandedItems[ingredientId] = true
    }

    state.value.addingProfile = null
    state.value.newProfileData = {}
  } catch (error) {
    console.error('Error creating profile:', error)
    alert('Failed to create profile. Please try again.')
  }
}

const addNewUnit = (unitName) => {
  const trimmedUnit = normalizeUnit(unitName.trim())
  if (trimmedUnit && !state.value.availableUnits.includes(trimmedUnit)) {
    state.value.availableUnits.push(trimmedUnit)
    return trimmedUnit
  }
  return null
}

const filterUnitsEdit = () => {
  const search = state.value.unitSearchEdit.toLowerCase().trim()
  if (!search) {
    state.value.filteredUnitsEdit = [...state.value.availableUnits]
    state.value.showUnitDropdownEdit = false
    return
  }

  state.value.filteredUnitsEdit = state.value.availableUnits.filter((unit) =>
    unit.toLowerCase().includes(search),
  )
  state.value.showUnitDropdownEdit = true
}

const filterUnitsAdd = () => {
  const search = state.value.unitSearchAdd.toLowerCase().trim()
  if (!search) {
    state.value.filteredUnitsAdd = [...state.value.availableUnits]
    state.value.showUnitDropdownAdd = false
    return
  }

  state.value.filteredUnitsAdd = state.value.availableUnits.filter((unit) =>
    unit.toLowerCase().includes(search),
  )
  state.value.showUnitDropdownAdd = true
}

const selectUnitEdit = (unit) => {
  const normalizedUnit = normalizeUnit(unit)
  state.value.editingData.baseUnit = normalizedUnit
  state.value.unitSearchEdit = normalizedUnit
  state.value.showUnitDropdownEdit = false
}

const selectUnitAdd = (unit) => {
  const normalizedUnit = normalizeUnit(unit)
  state.value.newProfileData.baseUnit = normalizedUnit
  state.value.unitSearchAdd = normalizedUnit
  state.value.showUnitDropdownAdd = false
}

const addNewUnitFromSearchEdit = () => {
  const search = state.value.unitSearchEdit.trim()
  const normalizedSearch = normalizeUnit(search)
  if (normalizedSearch && !state.value.availableUnits.includes(normalizedSearch)) {
    const newUnit = addNewUnit(normalizedSearch)
    if (newUnit) {
      state.value.editingData.baseUnit = newUnit
      state.value.unitSearchEdit = newUnit
      state.value.showUnitDropdownEdit = false
      state.value.filteredUnitsEdit = [...state.value.availableUnits]
    }
  } else if (normalizedSearch && state.value.availableUnits.includes(normalizedSearch)) {
    selectUnitEdit(normalizedSearch)
  }
}

const addNewUnitFromSearchAdd = () => {
  const search = state.value.unitSearchAdd.trim()
  const normalizedSearch = normalizeUnit(search)
  if (normalizedSearch && !state.value.availableUnits.includes(normalizedSearch)) {
    const newUnit = addNewUnit(normalizedSearch)
    if (newUnit) {
      state.value.newProfileData.baseUnit = newUnit
      state.value.unitSearchAdd = newUnit
      state.value.showUnitDropdownAdd = false
      state.value.filteredUnitsAdd = [...state.value.availableUnits]
    }
  } else if (normalizedSearch && state.value.availableUnits.includes(normalizedSearch)) {
    selectUnitAdd(normalizedSearch)
  }
}
</script>

<template>
  <section class="ingredients-view" v-if="!state.loading">
    <header class="view-header">
      <h1>Ingredients</h1>
      <p class="subtitle">Manage your ingredients and their nutritional information</p>
    </header>

    <div v-if="state.loading" class="loading-state">
      <p>Loading ingredients...</p>
    </div>

    <div v-else-if="state.ingredients.length > 0" class="ingredients-list">
      <IngredientItem
        v-for="ingredient in state.ingredients"
        :key="ingredient.id"
        :ingredient="ingredient"
        :is-expanded="isExpanded(ingredient.id)"
        :editing-profile="state.editingProfile"
        :editing-data="state.editingData"
        :saving-profile="state.savingProfile"
        :adding-profile="state.addingProfile"
        :new-profile-data="state.newProfileData"
        :available-units="state.availableUnits"
        :unit-search-edit="state.unitSearchEdit"
        :show-unit-dropdown-edit="state.showUnitDropdownEdit"
        :filtered-units-edit="state.filteredUnitsEdit"
        :unit-search-add="state.unitSearchAdd"
        :show-unit-dropdown-add="state.showUnitDropdownAdd"
        :filtered-units-add="state.filteredUnitsAdd"
        @toggle-expand="toggleExpand(ingredient.id)"
        @start-edit="startEdit"
        @cancel-edit="cancelEdit"
        @save-profile="saveProfile"
        @start-add-profile="startAddProfile(ingredient.id)"
        @cancel-add-profile="cancelAddProfile"
        @save-new-profile="saveNewProfile"
        @update:unitSearchEdit="state.unitSearchEdit = $event"
        @update:showUnitDropdownEdit="state.showUnitDropdownEdit = $event"
        @update:filteredUnitsEdit="state.filteredUnitsEdit = $event"
        @update:editingData="state.editingData = $event"
        @update:unitSearchAdd="state.unitSearchAdd = $event"
        @update:showUnitDropdownAdd="state.showUnitDropdownAdd = $event"
        @update:filteredUnitsAdd="state.filteredUnitsAdd = $event"
        @update:newProfileData="state.newProfileData = $event"
        @filter-units-edit="filterUnitsEdit"
        @filter-units-add="filterUnitsAdd"
        @add-new-unit="(unit) => addNewUnit(unit)"
      />
    </div>

    <div v-else class="empty-state">
      <p>No ingredients found</p>
    </div>
  </section>

  <div v-else class="loading-spinner">
    <RingLoader color="#3a8f9f" size="100px" />
  </div>
</template>

<style scoped>
.ingredients-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  margin-bottom: 2rem;
}

.view-header h1 {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
  font-weight: 600;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  color: #a0aec0;
  font-size: 0.95rem;
}

/* List Layout */
.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #374151;
  border-radius: 8px;
  overflow: hidden;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ingredients-view {
    padding: 1rem;
  }

  .view-header h1 {
    font-size: 1.5rem;
  }
}
</style>
