<script setup>
import { onMounted, ref, watch } from 'vue'
defineOptions({
  name: 'MealPlanCalendar',
})

const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const props = defineProps({
  meals: {
    type: Array,
    required: true,
  },
  dates: {
    type: Array,
    required: true,
  },
})

let recipes = [
  { id: 1, title: 'Spaghetti Bolognese', nutritionalProfilePerServing: { kcal: 400 } },
  { id: 2, title: 'Chicken Salad', nutritionalProfilePerServing: { kcal: 250 } },
  { id: 3, title: 'Vegetable Stir Fry', nutritionalProfilePerServing: { kcal: 300 } },
  { id: 4, title: 'Beef Tacos', nutritionalProfilePerServing: { kcal: 500 } },
  { id: 5, title: 'Grilled Salmon', nutritionalProfilePerServing: { kcal: 450 } },
]

let ingredients = [
  { id: 1, name: 'Tomato', quantity: '2 pcs' },
  { id: 2, name: 'Lettuce', quantity: '100 g' },
  { id: 3, name: 'Chicken Breast', quantity: '200 g' },
  { id: 4, name: 'Beef Mince', quantity: '250 g' },
  { id: 5, name: 'Salmon Fillet', quantity: '150 g' },
]

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

const editMode = ref(null) // Store the dateString of the date in edit mode
const formData = ref({ food: '', quantity: '', unit: '', mealType: '' })

watch(
  () => formData.value.food,
  (foodKey) => {
    if (!foodKey) {
      return
    }

    const [kind, idStr] = foodKey.split('-')
    const id = Number(idStr)
    const isRecipe = kind === 'recipe'

    if (isRecipe) {
      const selected = recipes.find((item) => item.id === id)
      if (!selected) return
      if (!formData.value.quantity) formData.value.quantity = 1
      if (!formData.value.unit) formData.value.unit = 'portion'
    } else {
      const selected = ingredients.find((item) => item.id === id)
      if (!selected) return
      if (formData.value.quantity === 1) formData.value.quantity = ''
      if (formData.value.unit === 'portion') formData.value.unit = ''
    }
  },
)

onMounted(() => {
  // Initialization logic if needed
  recipes.forEach((r) => (r.isRecipe = true))
  ingredients.forEach((i) => (i.isRecipe = false))
})

function addMeal(date) {
  const { food, quantity, unit, mealType } = formData.value
  // Placeholder for adding meal functionality
  console.log('Added', food, quantity, unit, mealType, 'for date:', date)
  // Reset form
  formData.value = { food: '', quantity: '', unit: '', mealType: '' }
  editMode.value = null
}

function consumeMeal(mealId) {
  // Placeholder for marking meal as consumed functionality
  console.log('Mark meal as consumed:', mealId)
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
      <!-- Meals for the day -->
      <div
        v-for="meal in props.meals.filter((m) => m.date === dateItem.dateString)"
        :key="meal.id"
        class="meal-container"
      >
        <div class="meal-field">
          {{ meal.mealType }}: {{ meal.recipe.title }}
          <p v-if="meal.recipe.nutritionalProfilePerServing.kcal">
            {{ meal.recipe.nutritionalProfilePerServing.kcal }} kcal
          </p>
          <p v-else>unknown kcal</p>
          <button @click="consumeMeal(meal.id)">Is consumed</button>
        </div>
      </div>
      <!-- Add Meal Button -->
      <div class="action-button-container">
        <button
          v-if="editMode !== dateItem.dateString"
          @click="editMode = dateItem.dateString"
          class="action-button"
        >
          Add Meal
        </button>
        <div v-else>
          <select v-model="formData.food" name="food" id="food">
            <option value="">Select food</option>
            <option
              v-for="food in recipes.concat(ingredients)"
              :key="food.id"
              :value="food.isRecipe ? `recipe-${food.id}` : `ingredient-${food.id}`"
            >
              {{ food.title || food.name }}
            </option>
          </select>
          <input
            v-model="formData.quantity"
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Quantity"
          />
          <input v-model="formData.unit" type="text" name="unit" id="unit" placeholder="Unit" />
          <select v-model="formData.mealType" name="mealType" id="mealType">
            <option value="">Select meal type</option>
            <option v-for="type in mealTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <button @click="addMeal(dateItem.dateString)" class="action-button">+</button>
          <button @click="editMode = null" class="action-button">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: #333;
}

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

.meal-container {
  border: 1px solid #ccc;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.action-button-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>
