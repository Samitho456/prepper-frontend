<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import IngredientInput from '@/components/IngredientInput.vue'
import InstructionList from '@/components/InstructionList.vue'
import axios from 'axios'

defineOptions({
  name: 'AddRecipeView',
})

const toast = useToast()
const router = useRouter()

const recipe = ref({
  title: '',
  description: '',
  servings: null,
  prepTime: null,
  mealType: 'dinner',
  ingredients: [],
  instructions: [],
})

const isSubmitting = ref(false)
const fileInput = ref(null)

function handleJsonUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result)
      // Map JSON data to recipe object
      if (jsonData.title) recipe.value.title = jsonData.title
      if (jsonData.description) recipe.value.description = jsonData.description
      if (jsonData.servings) recipe.value.servings = jsonData.servings
      if (jsonData.prepTime) recipe.value.prepTime = jsonData.prepTime
      if (jsonData.preparationTimeMinutes) recipe.value.prepTime = jsonData.preparationTimeMinutes
      if (jsonData.mealType) recipe.value.mealType = jsonData.mealType
      if (Array.isArray(jsonData.ingredients)) {
        recipe.value.ingredients = jsonData.ingredients.map((ing) => ({
          ingredient: ing.name || ing.ingredient || '',
          quantity: ing.quantity || '',
          unit: ing.unit || '',
          ingredientId: ing.ingredientId || 0,
        }))
      }
      if (Array.isArray(jsonData.instructions)) {
        recipe.value.instructions = jsonData.instructions.map((inst) => ({
          instructionText: inst.instructionText || inst,
        }))
      }
      toast.success('Recipe data loaded successfully!')
    } catch (error) {
      console.error('Error parsing JSON:', error)
      toast.error('Invalid JSON file. Please check the format.')
    }
  }
  reader.readAsText(file)
  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function addRecipe() {
  // Prevent multiple submissions
  if (isSubmitting.value) return
  isSubmitting.value = true

  // Transform the recipe data to match the API format
  const apiRecipe = {
    id: 0,
    title: String(recipe.value.title).trim(),
    description: String(recipe.value.description).trim(),
    servings: recipe.value.servings,
    preparationTimeMinutes: recipe.value.prepTime,
    mealType: recipe.value.mealType,
    ingredients: recipe.value.ingredients.map((ing) => ({
      id: 0,
      recipeId: 0,
      ingredientId: ing.ingredientId || 0,
      name: ing.ingredient,
      quantity: ing.quantity,
      unit: ing.unit,
    })),
    instructions: recipe.value.instructions.map((inst, index) => ({
      id: 0,
      stepNumber: index + 1,
      recipeId: 0,
      instructionText: inst.instructionText,
    })),
  }

  // Call the API to add the recipe
  axios
    .post('/api/Fullrecipes', apiRecipe)
    .then(() => {
      toast.success('Recipe added successfully!')
      router.push({ name: 'recipes' })
    })
    .catch((error) => {
      console.error('Error adding recipe:', error)
      toast.error('Failed to add recipe. Please try again.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>

<template>
  <h1>Add Recipe</h1>
  <!-- File Input (hidden) -->
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    style="display: none"
    @change="handleJsonUpload"
  />
  <!-- Form to add a new recipe -->
  <form class="add-recipe-form" @submit.prevent="addRecipe">
    <!-- Upload JSON Button -->
    <div class="form-row">
      <button type="button" @click="triggerFileUpload" class="secondary-button">
        Upload Recipe from JSON
      </button>
    </div>

    <!-- Recipe Title Input -->
    <div class="form-row">
      <label for="title">Recipe Title:</label>
      <input
        class="input-field"
        type="text"
        id="title"
        name="title"
        required
        placeholder="Spaghetti bolognese"
        v-model="recipe.title"
      />
    </div>

    <!-- Description Input -->
    <div class="form-row">
      <label for="description">Description:</label>
      <textarea
        class="input-field"
        id="description"
        name="description"
        required
        placeholder="A classic Italian pasta dish with rich meat sauce"
        v-model="recipe.description"
      ></textarea>
    </div>

    <!-- Servings Input -->
    <div class="form-row">
      <label for="servings">Servings:</label>
      <input
        class="input-field"
        type="number"
        id="servings"
        name="servings"
        required
        placeholder="4"
        v-model.number="recipe.servings"
      />
    </div>

    <!-- Preparation Time Input -->
    <div class="form-row">
      <label for="prep-time">Preparation Time (minutes):</label>
      <input
        class="input-field"
        type="number"
        id="prep-time"
        name="prep-time"
        required
        placeholder="30"
        v-model.number="recipe.prepTime"
      />
    </div>

    <!-- Meal Type Selection -->
    <div class="form-row">
      <label for="meal-type">Meal Type:</label>
      <select id="meal-type" name="meal-type" required v-model="recipe.mealType">
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
        <option value="dessert">Dessert</option>
      </select>
    </div>

    <!-- Ingredient Input Component -->
    <div class="form-row">
      <IngredientInput v-model="recipe.ingredients" />
    </div>

    <!-- Instruction List Component -->
    <div class="form-row">
      <InstructionList v-model="recipe.instructions" />
    </div>

    <div class="form-row">
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Submitting...' : 'Add Recipe' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
h1 {
  font-family: 'Nunito', sans-serif;
  color: #2d3748;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 32px;
  font-size: 28px;
  font-weight: 700;
}

.add-recipe-form {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto 40px;
  gap: 20px;
  padding: 24px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.add-recipe-form label {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
  font-size: 14px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row label {
  color: #2d3748;
}

.form-row input,
.form-row textarea,
.form-row select {
  font-family: 'Open Sans', sans-serif;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  color: #2d3748;
  background-color: #f7fafc;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-row input:focus,
.form-row textarea:focus,
.form-row select:focus {
  outline: none;
  border-color: #3a8f9f;
  box-shadow: 0 0 0 3px rgba(58, 143, 159, 0.1);
}

.form-row textarea {
  resize: vertical;
  min-height: 100px;
}

.form-row button {
  align-self: flex-start;
  padding: 12px 24px;
  background-color: #3a8f9f;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  transition:
    background-color 0.2s,
    transform 0.1s;
}

.form-row button:hover:not(:disabled) {
  background-color: #2f7a8a;
  transform: translateY(-2px);
}

.form-row button:active:not(:disabled) {
  transform: translateY(0);
}

.form-row button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-button {
  background-color: #7fcd91 !important;
}

.secondary-button:hover:not(:disabled) {
  background-color: #6ab97a !important;
}
</style>
