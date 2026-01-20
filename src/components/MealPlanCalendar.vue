<script setup>
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

function consumeMeal(mealId) {
  // Placeholder for marking meal as consumed functionality
  console.log('Mark meal as consumed:', mealId)
}

async function removeMeal(mealId) {
  try {
    await axios.delete(`/api/mealplans/${mealId}`)
    emit('meal-removed', mealId)
    console.log('Removed meal with ID:', mealId)
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
            <button @click="consumeMeal(meal.id)" class="action-button">Mark as consumed</button>
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

.action-button-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>
