<script setup>
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

const dateArray = new Array(7)
const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function updateDateArray() {
  const currentDay = date.getDay()
  const currentDate = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  for (let i = 0; i < 7; i++) {
    const dayOffset = i - ((currentDay + 6) % 7)
    const newDate = new Date(currentYear, currentMonth, currentDate + dayOffset)
    dateArray[i] = newDate
  }
}
updateDateArray()
const mealplans = [
  {
    id: 1,
    date: '2026-01-08',
    meal_type: 'Dinner',
    recipe_id: 3,
    user_id: 1,
    is_comsumed: false,
  },
  {
    id: 2,
    date: '2026-01-09',
    meal_type: 'Lunch',
    recipe_id: 5,
    user_id: 1,
    is_comsumed: false,
  },
  {
    id: 3,
    date: '2026-01-10',
    meal_type: 'Breakfast',
    recipe_id: 2,
    user_id: 1,
    is_comsumed: false,
  },
  {
    id: 4,
    date: '2026-01-08',
    meal_type: 'Dinner',
    recipe_id: 4,
    user_id: 1,
    is_comsumed: false,
  },
]
function formatDate(Date) {
  const yyyy = Date.getFullYear()
  const mm = String(Date.getMonth() + 1).padStart(2, '0')
  const dd = String(Date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function GetMealPlans() {
  fetch('/api/MealPlan?sortBy=date&ascending=true')
    .then((response) => response.json())
    .then((json) => console.log(json))
}

GetMealPlans()
</script>

<template>
  <div class="meal-planner-view">
    <h1>Meal Planner</h1>
    <p>This is where the meal planning functionality will be implemented.</p>
    <p>Current Week Is {{ getWeek(date) }}</p>
    <div class="calendar">
      <div class="calendar-subgrid" v-for="(dayDate, idx) in dateArray" :key="formatDate(dayDate)">
        <!-- calendar day header -->
        <div>{{ weekDayNames[idx] }} {{ dayDate.getDate() }}/{{ dayDate.getMonth() + 1 }}</div>

        <!-- meals for the day -->
        <div v-for="meal in mealplans.filter((m) => m.date === formatDate(dayDate))" :key="meal.id">
          meal_type: {{ meal.meal_type }} - Recipe {{ meal.recipe_id }}
        </div>

        <!-- add meal button -->
        <button class="add-new-recipe-button">Add Meal</button>
      </div>
    </div>
    <div class="meals" v-for="mealplan in mealplans" :key="mealplan.id">
      <div class="daygrid"></div>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.calendar div {
  background-color: #f1f1f1;
  border: 1px solid black;
  padding: 10px;
  font-size: 30px;
  text-align: center;
}
.calendar-subgrid {
  background-color: #d1d1d1;
  border: 1px solid black;
  padding: 10px;
  font-size: 20px;
  text-align: center;
}

.add-new-recipe-button {
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}
</style>
