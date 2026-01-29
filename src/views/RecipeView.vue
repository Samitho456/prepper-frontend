<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { RingLoader } from 'vue3-spinner'

// Import SVG icons
import restaurantIcon from '@/assets/restaurant_651586.svg'
import alarmClockIcon from '@/assets/alarm-clock_1255451.svg'
import knifeForkIcon from '@/assets/knife-fork_15451582.svg'

const route = useRoute()
const router = useRouter()

defineOptions({
  name: 'RecipeView',
})

const editRecipe = () => {
  router.push({ name: 'AddRecipeView', params: { id: state.value.recipe.id } })
}

const state = ref({
  recipe: {
    id: 0,
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    nutritionPrServing: {
      calories: 0,
      protein: 0,
      fat: 0,
      carbohydrates: 0,
    },
  },
  isLoading: true,
})

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await axios.get(`/api/Fullrecipes/${id}`)
    state.value.recipe = response.data
    state.value.isLoading = false
  } catch (error) {
    console.error('Error fetching recipe data:', error)
  }
})
</script>

<template>
  <section v-if="!state.isLoading">
    <div class="recipe-header">
      <h1>{{ state.recipe.title }}</h1>
      <button class="edit-btn" @click="editRecipe">Edit Recipe</button>
    </div>
    <p>{{ state.recipe.description }}</p>

    <div class="img-np-box">
      <div v-if="state.recipe.img">
        <img :src="state.recipe.img" :alt="state.recipe.title" />
      </div>
      <div v-else>
        <img src="/placeholder.png" alt="placeholder image" />
      </div>

      <div class="time-type-box content-card">
        <h3>Details</h3>
        <span class="detail-item">
          <img :src="restaurantIcon" alt="Servings" class="detail-icon" />
          <span class="detail-text">Servings: {{ state.recipe.servings }}</span>
        </span>
        <span class="detail-item">
          <img :src="alarmClockIcon" alt="Prep Time" class="detail-icon" />
          <span class="detail-text">Prep Time: {{ state.recipe.preparationTimeMinutes }} mins</span>
        </span>
        <span class="detail-item">
          <img :src="knifeForkIcon" alt="Meal Type" class="detail-icon" />
          <span class="detail-text">Meal Type: {{ state.recipe.mealType }}</span>
        </span>
      </div>

      <div class="nutritionalprofile-box content-card">
        <h3>Nutritional Information (per serving)</h3>
        <div
          v-if="state.recipe.nutritionalProfilePerServing?.hasIncompleteData"
          class="nutrition-warning"
        >
          ⚠️ Some values may be inaccurate due to missing ingredient nutritional data
        </div>
        <ul>
          <li>
            Calories: {{ Math.round(state.recipe.nutritionalProfilePerServing.kcal) }} kcal
            <span
              v-if="state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('Kcal')"
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li v-if="state.recipe.nutritionalProfilePerServing.kj">
            Energy: {{ Math.round(state.recipe.nutritionalProfilePerServing.kj) }} kJ
            <span
              v-if="state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('Kj')"
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li>
            Protein: {{ Math.round(state.recipe.nutritionalProfilePerServing.protein * 10) / 10 }}g
            <span
              v-if="state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('Protein')"
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li>
            Fat (Total):
            {{ Math.round(state.recipe.nutritionalProfilePerServing.fatTotal * 10) / 10 }}g
            <span
              v-if="
                state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('FatTotal')
              "
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li v-if="state.recipe.nutritionalProfilePerServing.fatSaturated">
            Fat (Saturated):
            {{ Math.round(state.recipe.nutritionalProfilePerServing.fatSaturated * 10) / 10 }}g
            <span
              v-if="
                state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('FatSaturated')
              "
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li>
            Carbohydrates (Total):
            {{ Math.round(state.recipe.nutritionalProfilePerServing.carbohydrateTotal * 10) / 10 }}g
            <span
              v-if="
                state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes(
                  'CarbohydrateTotal',
                )
              "
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li v-if="state.recipe.nutritionalProfilePerServing.carbohydrateSugars">
            Carbohydrates (Sugars):
            {{
              Math.round(state.recipe.nutritionalProfilePerServing.carbohydrateSugars * 10) / 10
            }}g
            <span
              v-if="
                state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes(
                  'CarbohydrateSugars',
                )
              "
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li v-if="state.recipe.nutritionalProfilePerServing.fiber">
            Fiber: {{ Math.round(state.recipe.nutritionalProfilePerServing.fiber * 10) / 10 }}g
            <span
              v-if="state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('Fiber')"
              class="inaccurate-badge"
              >*</span
            >
          </li>
          <li v-if="state.recipe.nutritionalProfilePerServing.salt">
            Salt: {{ Math.round(state.recipe.nutritionalProfilePerServing.salt * 10) / 10 }}g
            <span
              v-if="state.recipe.nutritionalProfilePerServing.inaccurateFields?.includes('Salt')"
              class="inaccurate-badge"
              >*</span
            >
          </li>
        </ul>
        <div
          v-if="state.recipe.nutritionalProfilePerServing?.inaccurateFields?.length > 0"
          class="inaccurate-legend"
        >
          * = May be inaccurate
        </div>
      </div>
    </div>

    <div class="ingredient-instruction-container">
      <div class="ingredient-box">
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in state.recipe.ingredients" :key="index">
            {{ ingredient.name }} - {{ ingredient.quantity }} {{ ingredient.unit }}
          </li>
        </ul>
      </div>

      <div class="instruction-box content-card">
        <h3>Instructions</h3>
        <ol>
          <li v-for="(instruction, index) in state.recipe.instructions" :key="index">
            {{ instruction.instructionText }}
          </li>
        </ol>
      </div>
    </div>
  </section>
  <div v-else class="loading-spinner">
    <RingLoader color="#3a8f9f" size="100px" />
  </div>
</template>

<style scoped>
section {
  margin: 20px;
  color: black;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

h1 {
  color: black;
  text-align: left;
  margin: 0;
}

.edit-btn {
  background-color: #3a8f9f;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  white-space: nowrap;
}

.edit-btn:hover {
  background-color: #2f7a8a;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.15),
    0 4px 6px -2px rgba(0, 0, 0, 0.1);
}

.edit-btn:active {
  transform: scale(0.98);
}

/* Grid Layout for Image, Details, and Nutrition */
.img-np-box {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.img-np-box > div {
  display: flex;
  flex-direction: column;
}

.img-np-box img {
  height: 350px;
  width: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.time-type-box {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.time-type-box h3 {
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 24px;
}

.time-type-box span {
  font-size: 1.3em;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  white-space: nowrap;
  margin-bottom: 30px;
}

.detail-icon {
  max-width: 36px;

  .detail-text {
    display: inline-block;
    transform: translateY(-5px);
  }
  max-height: 36px;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.detail-item p {
  margin-bottom: 10px;
}

.detail-item,
.nutritionalprofile-box {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
}

.nutritionalprofile-box h3 {
  margin-top: 0;
}

.nutritionalprofile-box ul {
  list-style-type: none;
  padding: 0;
}

.nutrition-warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 0.9em;
  border-left: 4px solid #ffc107;
}

.inaccurate-badge {
  color: #ff9800;
  font-weight: bold;
  margin-left: 4px;
}

.inaccurate-legend {
  margin-top: 10px;
  font-size: 0.85em;
  color: #666;
  font-style: italic;
}

/* Grid Layout for Ingredients and Instructions */
.ingredient-instruction-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}

.ingredient-box {
  padding: 15px;
  background-color: #76cca1;
  border-radius: 15px;
}

.ingredient-box h3 {
  margin-top: 0;
}

.instruction-box {
  padding: 15px;
  background-color: white;
  border-radius: 15px;
}

.instruction-box h3 {
  margin-top: 0;
}

.instruction-box li {
  margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .img-np-box {
    grid-template-columns: 1fr 1fr;
  }

  .img-np-box > div:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .img-np-box {
    grid-template-columns: 1fr;
  }

  .ingredient-instruction-container {
    grid-template-columns: 1fr;
  }

  .img-np-box img {
    height: 250px;
  }
}
</style>
