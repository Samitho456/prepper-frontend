<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import MealPlanCalendar from '@/components/MealPlanCalendar.vue'
const date = new Date()

function getWeek(date) {
  var target = new Date(date.valueOf())
  var dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  var firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7))
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000)
}

const dateArray = ref([])

// Update dateArray to contain the dates for the current week
function updateDateArray() {
  const currentDay = date.getDay()
  const currentDate = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  for (let i = 0; i < 7; i++) {
    const dayOffset = i - ((currentDay + 6) % 7)
    const newDate = new Date(currentYear, currentMonth, currentDate + dayOffset)
    dateArray.value[i] = formatDate(newDate)
  }
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Format a date object into a structured date representation
function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const formatedDate = {
    year: year,
    month: month,
    day: day,
    dateString: `${year}-${month}-${day}`,
  }
  return formatedDate
}

// meal plans data for the week
const mealplans = ref([])

// temporary meals array
let meals = []

// Generate a grocery list based on the meals planned for the week
function generateGroceryList() {
  let groceryList = []
  meals.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      if (ingredient.id in groceryList) {
        groceryList[ingredient.id].quantity += ingredient.quantity
      } else {
        groceryList.push({
          id: ingredient.id,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        })
      }
    })
  })
  console.log('Grocery List:', groceryList)
}

// Fetch meal plans for the current week
function GetMealPlans() {
  try {
    axios
      .get(`/api/MealPlans/week?weekStart=${dateArray.value[0]?.dateString || ''}`)
      .then((response) => {
        mealplans.value = response.data
        mealplans.value.forEach((meal) => {
          meals.push(meal.recipe)
          console.log('Meal recipe:', meal.recipe)
        })
      })
  } catch (error) {
    console.error('Error fetching meal plans:', error)
  }
}

onMounted(() => {
  updateDateArray()
  GetMealPlans()
})
</script>

<template>
  <div class="meal-planner-view">
    <!-- Month, year and Week -->
    <div class="month-year-week-container">
      <div class="month-year-container">
        <p>{{ monthNames[new Date().getMonth()] }} {{ new Date().getFullYear() }}</p>
      </div>
      <div class="week-number-display">Week: {{ getWeek(new Date()) }}</div>
      <!-- Button to generate grocery list -->
      <button @click="generateGroceryList" class="action-button grocery-button">
        Generate Grocery List
      </button>
    </div>
    <!-- Meal Plan Calendar Component -->
    <MealPlanCalendar :meals="mealplans" :dates="dateArray" />
  </div>
</template>

<style scoped>
.month-year-week-container {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}

.month-year-container {
  color: var(--font-color);
  font:
    400 22px / 28px 'Google Sans',
    Roboto,
    Arial,
    sans-serif;
  letter-spacing: 0;
  white-space: nowrap;
  margin-left: 5px;
}

.week-number-display {
  font-weight: bold;
  background-color: var(--secondary-color);
  color: var(--font-color);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.00625rem;
  line-height: 1rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-left: 8px;
  padding-inline: 4px;
  line-height: 20px;
  border-radius: 4px;
}

.grocery-button {
  margin-left: auto;
}
</style>
