<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MealPlanCalendar from '@/components/MealPlanCalendar.vue'
import { RingLoader } from 'vue3-spinner'
const date = new Date()

const isLoading = ref(false)
const recipes = ref([])
const dateArray = ref([])
// meal plans data for the week
const mealplans = ref([])
const router = useRouter()

// temporary meals array
let meals = []

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

// Get the week number for a given date
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

// Generate a grocery list based on the meals planned for the week
function generateGroceryList() {
  const groceryList = []
  const itemMap = new Map()

  meals.forEach((meal) => {
    if (!meal?.ingredients) {
      return
    }

    meal.ingredients.forEach((ingredient) => {
      const key = ingredient.id ?? `${ingredient.name}-${ingredient.unit ?? ''}`
      const existingItem = itemMap.get(key)
      const quantityNumber = Number(ingredient.quantity)
      const isNumeric = !Number.isNaN(quantityNumber)

      if (existingItem) {
        if (existingItem.isNumeric && isNumeric) {
          existingItem.quantity += quantityNumber
        } else {
          existingItem.isNumeric = false
          existingItem.quantityText = `${existingItem.quantityText}, ${ingredient.quantity}`
        }
      } else {
        itemMap.set(key, {
          id: ingredient.id ?? key,
          name: ingredient.name,
          quantity: isNumeric ? quantityNumber : 0,
          quantityText: isNumeric ? '' : String(ingredient.quantity ?? ''),
          unit: ingredient.unit ?? '',
          category: ingredient.category ?? 'Other',
          isNumeric,
        })
      }
    })
  })

  itemMap.forEach((item) => {
    const quantityText = item.isNumeric
      ? `${item.quantity}${item.unit ? ` ${item.unit}` : ''}`
      : item.quantityText || '1'

    groceryList.push({
      id: item.id,
      name: item.name,
      quantity: quantityText,
      category: item.category,
      completed: false,
    })
  })

  localStorage.setItem('shoppingListItems', JSON.stringify(groceryList))
  router.push('/ShoppingList')
}

// Fetch meal plans for the current week
async function GetMealPlans() {
  try {
    const response = await axios.get(
      `/api/MealPlans/week?weekStart=${dateArray.value[0]?.dateString || ''}`,

      `/api/MealPlans/week?weekStart=${dateArray.value[0]?.dateString || ''}`,
    )
    mealplans.value = response.data
    mealplans.value.forEach((meal) => {
      meals.push(meal.recipe)
    })
  } catch (error) {
    console.error('Error fetching meal plans:', error)
  }
}

// fetch recipes
async function fetchRecipes() {
  try {
    const response = await axios.get('/api/recipes')
    recipes.value = response.data
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
}

// Handle newly added meal
async function handleMealAdded(newMeal) {
  try {
    // Fetch the complete recipe with nutritional info
    const response = await axios.get(`/api/fullrecipes/${newMeal.recipeId}`)
    newMeal.recipe = response.data
    mealplans.value.push(newMeal)
    meals.push(response.data)
  } catch (error) {
    console.error('Error fetching recipe details:', error)
    // Fallback: use recipe from recipes list
    const recipe = recipes.value.find((r) => r.id === newMeal.recipeId)
    if (recipe) {
      newMeal.recipe = recipe
      mealplans.value.push(newMeal)
      meals.push(recipe)
    }
  }
}

onMounted(async () => {
  isLoading.value = true
  updateDateArray()
  await fetchRecipes()
  await GetMealPlans()
  isLoading.value = false
})
</script>

<template>
  <div class="meal-planner-view" v-if="!isLoading">
    <!-- Month, year and Week -->
    <div class="month-year-week-container">
      <div class="month-year-container">
        <p>{{ monthNames[new Date().getMonth()] }} {{ new Date().getFullYear() }}</p>
      </div>
      <div class="week-number-display">Week: {{ getWeek(new Date()) }}</div>
      <!-- Button to generate grocery list -->
      <button @click="generateGroceryList" class="action-button grocery-button">
        Get Grocery List
      </button>
    </div>
    <!-- Meal Plan Calendar Component -->
    <MealPlanCalendar
      :meals="mealplans"
      :dates="dateArray"
      :recipes="recipes"
      @meal-added="handleMealAdded"
    />
  </div>
  <div v-else class="loading-spinner">
    <RingLoader :loading="isLoading" color="#3a8f9f" size="100px" />
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
