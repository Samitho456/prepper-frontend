<script setup>
import { ref, onMounted } from 'vue'
import AddMealCard from './AddMealCard.vue'
import axios from 'axios'
defineOptions({
  name: 'MealPlanCalendar',
})

const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Other']

const props = defineProps({
  meals: {
    type: Array,
    required: true,
  },
  dates: {
    type: Array,
    required: true,
  },
  recipes: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['meal-added', 'meal-removed'])

const defaultLocationId = ref(null)
const locations = ref([])
const leftoverConfig = ref({})
const activeLeftoverMeal = ref(null)

async function ensureDefaultLocation() {
  if (defaultLocationId.value) {
    return defaultLocationId.value
  }

  try {
    const response = await axios.get('/api/locations')
    const location = Array.isArray(response.data) ? response.data[0] : null
    defaultLocationId.value = location?.id || 1
  } catch (error) {
    console.error('Error fetching locations:', error)
    defaultLocationId.value = 1
  }

  return defaultLocationId.value
}

function getLeftoverConfig(meal) {
  const mealId = meal.id
  if (!leftoverConfig.value[mealId]) {
    leftoverConfig.value[mealId] = {
      servings: meal.recipe?.servings || 1,
      expirationDays: 3,
      locationId: defaultLocationId.value,
    }
  }

  return leftoverConfig.value[mealId]
}

function openLeftoverPopup(meal) {
  getLeftoverConfig(meal)
  activeLeftoverMeal.value = meal
}

function closeLeftoverPopup() {
  activeLeftoverMeal.value = null
}

async function confirmLeftovers() {
  if (!activeLeftoverMeal.value) {
    return
  }

  await markAsCooked(activeLeftoverMeal.value)
  closeLeftoverPopup()
}

async function markAsCooked(meal) {
  try {
    const locationId = await ensureDefaultLocation()
    const config = getLeftoverConfig(meal)
    const recipeId = meal.recipe?.id || meal.recipeId
    const servings = Number(config.servings) || 1
    const expirationDays = Number(config.expirationDays)
    const expirationDate = Number.isFinite(expirationDays)
      ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : null

    await axios.post('/api/inventoryItems', {
      ingredientId: null,
      recipeId,
      quantity: servings,
      unit: 'servings',
      expirationDate,
      locationId: config.locationId || locationId,
      userId: 1,
    })
  } catch (error) {
    console.error('Error creating leftover inventory item:', error)
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/locations')
    locations.value = Array.isArray(response.data) ? response.data : []
    if (!defaultLocationId.value && locations.value.length > 0) {
      defaultLocationId.value = locations.value[0].id
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  }
})

async function removeMeal(mealId) {
  try {
    await axios.delete(`/api/mealplans/${mealId}`)
    emit('meal-removed', mealId)
  } catch (error) {
    console.error('Error removing meal:', error)
  }
}
</script>

<template>
  <!-- Calendar -->
  <div class="calendar">
    <div v-for="(dateItem, idx) in dates" :key="idx">
      <!-- Weekday and Date -->
      <div class="calendar-days-header">
        <div class="calendar-day-header">{{ weekDayNames[idx] }}</div>
        <div class="calendar-date-header">
          <div>
            {{ dateItem.day }}
          </div>
        </div>
      </div>

      <div v-for="category in mealCategories" :key="category" class="category-box">
        <div class="meal-category">
          {{ category }}
        </div>
        <!-- Meals for the day -->
        <div
          v-for="meal in props.meals.filter(
            (m) =>
              m.date === dateItem.dateString && m.mealType.toLowerCase() === category.toLowerCase(),
          )"
          :key="meal.id"
          class="meal-container"
        >
          <div class="meal-field">
            <span>{{ meal.recipe.title }}</span>
            <p v-if="meal.recipe.nutritionalProfilePerServing?.kcal">
              {{ meal.recipe.nutritionalProfilePerServing.kcal }} kcal
            </p>
            <p v-else>unknown kcal</p>
            <button @click="openLeftoverPopup(meal)" class="action-button">Mark as Cooked</button>
            <button @click="removeMeal(meal.id)" class="cancel-button">Remove</button>
          </div>
        </div>
      </div>
      <!-- Add Meal Button -->
      <AddMealCard
        :recipes="props.recipes"
        :Date="dateItem.dateString"
        @meal-added="emit('meal-added', $event)"
      />
    </div>
  </div>

  <div v-if="activeLeftoverMeal" class="leftover-modal" role="dialog" aria-modal="true">
    <div class="leftover-card">
      <header class="leftover-header">
        <h3>Leftover Details</h3>
        <button type="button" class="close-btn" @click="closeLeftoverPopup">Close</button>
      </header>
      <p class="leftover-subtitle">{{ activeLeftoverMeal.recipe?.title }}</p>
      <div class="leftover-settings">
        <label>
          Leftovers (servings)
          <input
            type="number"
            min="1"
            v-model.number="getLeftoverConfig(activeLeftoverMeal).servings"
          />
        </label>
        <label>
          Expire in (days)
          <input
            type="number"
            min="0"
            v-model.number="getLeftoverConfig(activeLeftoverMeal).expirationDays"
          />
        </label>
        <label>
          Location
          <select v-model.number="getLeftoverConfig(activeLeftoverMeal).locationId">
            <option v-for="location in locations" :key="location.id" :value="location.id">
              {{ location.name }}
            </option>
          </select>
        </label>
      </div>
      <div class="leftover-actions">
        <button type="button" class="cancel-button" @click="closeLeftoverPopup">Cancel</button>
        <button type="button" class="action-button" @click="confirmLeftovers">
          Save Leftovers
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.calendar-days-header {
  background-color: var(--content-card-bg);
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.calendar-day-header {
  color: var(--font-color);
}

.calendar-date-header {
  color: var(--font-color);
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.calendar-date-header div {
  background-color: var(--content-card-content-bg);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 18px;
  font-weight: bold;
  color: var(--font-color);
}

.meal-category {
  background-color: var(--secondary-color);
  color: var(--font-color);
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  font-weight: bold;
  margin-top: 10px;
  margin: 10px 5px 5px 5px;
  padding: 5px;
  text-align: center;
}

.meal-container {
  border: 1px solid var(--border-color);
  margin: 5px;
  padding: 10px;
  border-radius: var(--container-border-radius);
  background-color: var(--content-card-bg);
}

.leftover-modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.leftover-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: min(520px, 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

.leftover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.leftover-subtitle {
  margin: 0;
  color: var(--secondary-font-color);
  font-weight: 600;
}

.leftover-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.leftover-settings label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--secondary-font-color);
  font-weight: 600;
}

.leftover-settings input,
.leftover-settings select {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 0.95rem;
  background: #fff;
}

.leftover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.close-btn {
  border: none;
  background: #e2e8f0;
  color: #334155;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn:hover {
  background: #cbd5f5;
}

.action-button-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>
