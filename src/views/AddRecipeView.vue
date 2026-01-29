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
  <!-- Form to add a new recipe -->
  <form class="add-recipe-form" @submit.prevent="addRecipe">
    <!-- Recipe Title Input -->
    <div class="form-row">
      <label for="title">Recipe Title:</label>
      <input
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
  color: white;
  text-align: center;
  margin-top: 20px;
}

.add-recipe-form {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 20px auto;
  gap: 12px;
  padding: 16px;
}

.add-recipe-form label {
  font-weight: bold;
  margin-bottom: 4px;
  color: white;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-row label {
  color: white;
}

.form-row input,
.form-row textarea,
.form-row select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.form-row button {
  align-self: flex-start;
  padding: 11px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.form-row button:hover {
  background-color: #218838;
}
</style>
