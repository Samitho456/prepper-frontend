<script setup>
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

function addMeal(date) {
  // Placeholder for adding meal functionality
  console.log('Add meal for date:', date)
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
      <div>
        <button @click="addMeal(dateItem)">Add Meal</button>
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
}

.calendar-days-header {
  background-color: #4b5563;
  border-bottom: gray 1px solid;
  grid-column: 1 / -1;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  gap: 10px;
}

.calendar-day-header {
  color: white;
  padding: 10px;
}

.calendar-date-header {
  color: white;
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.calendar-date-header div {
  background-color: #6b7280;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.meal-container {
  border: 1px solid #ccc;
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>
