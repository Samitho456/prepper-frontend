<script setup>
import { onMounted, ref, computed } from 'vue'
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
  router.push({ name: 'addrecipe', query: { id: state.value.recipe.id } })
}

const scaleFactor = ref(1)
const isCookingMode = ref(false)
const currentStepIndex = ref(0)

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

const baseServings = computed(() => Number(state.value.recipe.servings) || 1)

const scaledIngredients = computed(() => {
  return state.value.recipe.ingredients.map((ingredient) => ({
    ...ingredient,
    scaledQuantity: (ingredient.quantity * scaleFactor.value).toFixed(2),
  }))
})

const scaledServings = computed(() => {
  return Math.max(1, Math.round(baseServings.value * scaleFactor.value))
})

const servingsValue = computed({
  get() {
    return scaledServings.value
  },
  set(value) {
    setServings(value)
  },
})

const scaledNutrition = computed(() => {
  const profile = state.value.recipe.nutritionalProfilePerServing || {}
  const servings = scaledServings.value

  return {
    kcal: (profile.kcal || 0) * servings,
    kj: (profile.kj || 0) * servings,
    protein: (profile.protein || 0) * servings,
    fatTotal: (profile.fatTotal || 0) * servings,
    fatSaturated: (profile.fatSaturated || 0) * servings,
    carbohydrateTotal: (profile.carbohydrateTotal || 0) * servings,
    carbohydrateSugars: (profile.carbohydrateSugars || 0) * servings,
    fiber: (profile.fiber || 0) * servings,
    salt: (profile.salt || 0) * servings,
  }
})

function setServings(value) {
  const base = baseServings.value || 1
  const next = Math.max(1, Number(value) || 1)
  scaleFactor.value = next / base
}

function adjustServings(delta) {
  setServings(scaledServings.value + delta)
}

function openCookingMode(startIndex = 0) {
  currentStepIndex.value = Math.min(
    Math.max(0, startIndex),
    state.value.recipe.instructions.length - 1,
  )
  isCookingMode.value = true
}

function closeCookingMode() {
  isCookingMode.value = false
}

function nextStep() {
  if (currentStepIndex.value < state.value.recipe.instructions.length - 1) {
    currentStepIndex.value += 1
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value -= 1
  }
}

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
          <div class="servings-control">
            <span class="detail-text">Servings:</span>
            <div class="scale-input-group">
              <button @click="adjustServings(-1)" class="scale-btn">−</button>
              <input
                v-model.number="servingsValue"
                class="scale-input"
                type="number"
                min="1"
                step="1"
              />
              <button @click="adjustServings(1)" class="scale-btn">+</button>
            </div>
          </div>
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
        <div class="nutrition-total">
          <h4>Total ({{ scaledServings }} servings)</h4>
          <ul>
            <li>Calories: {{ Math.round(scaledNutrition.kcal) }} kcal</li>
            <li v-if="scaledNutrition.kj">Energy: {{ Math.round(scaledNutrition.kj) }} kJ</li>
            <li>Protein: {{ Math.round(scaledNutrition.protein * 10) / 10 }}g</li>
            <li>Fat (Total): {{ Math.round(scaledNutrition.fatTotal * 10) / 10 }}g</li>
            <li v-if="scaledNutrition.fatSaturated">
              Fat (Saturated): {{ Math.round(scaledNutrition.fatSaturated * 10) / 10 }}g
            </li>
            <li>
              Carbohydrates (Total):
              {{ Math.round(scaledNutrition.carbohydrateTotal * 10) / 10 }}g
            </li>
            <li v-if="scaledNutrition.carbohydrateSugars">
              Carbohydrates (Sugars):
              {{ Math.round(scaledNutrition.carbohydrateSugars * 10) / 10 }}g
            </li>
            <li v-if="scaledNutrition.fiber">
              Fiber: {{ Math.round(scaledNutrition.fiber * 10) / 10 }}g
            </li>
            <li v-if="scaledNutrition.salt">
              Salt: {{ Math.round(scaledNutrition.salt * 10) / 10 }}g
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="ingredient-instruction-container">
      <div class="ingredient-box">
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in scaledIngredients" :key="index">
            {{ ingredient.name }} - {{ ingredient.scaledQuantity }} {{ ingredient.unit }}
          </li>
        </ul>
      </div>

      <div class="instruction-box content-card">
        <div class="instruction-header">
          <h3>Instructions</h3>
          <button class="cooking-mode-btn" type="button" @click="openCookingMode()">
            Cooking Mode
          </button>
        </div>
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

  <div v-if="isCookingMode" class="cooking-mode" role="dialog" aria-modal="true">
    <div class="cooking-mode-card">
      <header class="cooking-mode-header">
        <h2>Cooking Mode</h2>
        <button class="close-btn" type="button" @click="closeCookingMode">Close</button>
      </header>
      <div class="cooking-step">
        <div class="step-counter">
          Step {{ currentStepIndex + 1 }} of {{ state.recipe.instructions.length }}
        </div>
        <p class="step-text">
          {{ state.recipe.instructions[currentStepIndex]?.instructionText }}
        </p>
      </div>
      <div class="cooking-controls">
        <button
          class="nav-btn"
          type="button"
          @click="previousStep"
          :disabled="currentStepIndex === 0"
        >
          Previous
        </button>
        <button
          class="nav-btn primary"
          type="button"
          @click="nextStep"
          :disabled="currentStepIndex >= state.recipe.instructions.length - 1"
        >
          Next
        </button>
      </div>
    </div>
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

.servings-control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.servings-amount {
  font-weight: 700;
  font-size: 1.2em;
  color: #3a8f9f;
  min-width: 30px;
  text-align: center;
}

.scale-control {
  margin: 20px 0;
  padding: 16px;
  background: linear-gradient(135deg, #f5f9fc 0%, #f0f7fb 100%);
  border-radius: 12px;
  border: 1px solid rgba(58, 143, 159, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.scale-control label {
  display: block;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 0.9em;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scale-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 2px;
  border-radius: 10px;
  border: 1px solid rgba(58, 143, 159, 0.1);
  width: fit-content;
}

.scale-btn {
  background-color: #3a8f9f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.scale-btn:hover {
  background-color: #2f7a8a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(58, 143, 159, 0.25);
}

.scale-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(58, 143, 159, 0.15);
}

.scale-input {
  width: 60px;
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  background-color: white;
  color: #3a8f9f;
  transition: all 0.25s ease;
}

.scale-input:focus {
  outline: none;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(58, 143, 159, 0.15);
}

.scale-input::placeholder {
  color: #aaa;
}

.scale-multiplier {
  font-weight: 700;
  color: #3a8f9f;
  font-size: 1em;
  margin: 0 2px;
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

.nutrition-total {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.nutrition-total h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #2c3e50;
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

.instruction-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.cooking-mode-btn {
  border: none;
  background: #3a8f9f;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.cooking-mode-btn:hover {
  background: #2f7a8a;
}

.cooking-mode {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 20, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.cooking-mode-card {
  background: #fff;
  border-radius: 24px;
  width: min(900px, 100%);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

.cooking-mode-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.close-btn {
  border: none;
  background: #e2e8f0;
  color: #334155;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.close-btn:hover {
  background: #cbd5f5;
}

.cooking-step {
  display: grid;
  gap: 16px;
}

.step-counter {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.step-text {
  font-size: 2.2rem;
  line-height: 1.3;
  font-weight: 600;
  color: #0f172a;
}

.cooking-controls {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.nav-btn {
  flex: 1;
  border: none;
  background: #e2e8f0;
  color: #1e293b;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.nav-btn.primary {
  background: #3a8f9f;
  color: #fff;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
