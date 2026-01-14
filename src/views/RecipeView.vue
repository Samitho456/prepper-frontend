<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

defineOptions({
  name: 'RecipeView',
})

let recipeData = ref({
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
})

onMounted(async () => {
  try {
    const response = await axios.get('/api/recipes/1') // Replace '1' with dynamic ID as needed
    recipeData.value = response.data
    console.log('Fetched recipe data:', response.data)
  } catch (error) {
    console.error('Error fetching recipe data:', error)
  }
})
</script>

<template>
  <h1>Recipe View</h1>
  <div v-if="recipeData.id">
    <h2>{{ recipeData.title }}</h2>
    <p>{{ recipeData.description }}</p>
    <h3>Ingredients:</h3>
    <ul>
      <li v-for="ingredient in recipeData.ingredients" :key="ingredient.name">
        {{ ingredient.quantity }} {{ ingredient.unit }} {{ ingredient.name }}
      </li>
    </ul>
    <h3>Instructions:</h3>
    <ol>
      <li v-for="instruction in recipeData.instructions" :key="instruction.step">
        {{ instruction.instructionText }}
      </li>
    </ol>
    <h3>Nutrition per Serving:</h3>
    <ul v-if="recipeData.nutritionPrServing">
      <li>Calories: {{ recipeData.nutritionPrServing.calories }}</li>
      <li>Protein: {{ recipeData.nutritionPrServing.protein }}</li>
      <li>Fat: {{ recipeData.nutritionPrServing.fat }}</li>
      <li>Carbohydrates: {{ recipeData.nutritionPrServing.carbohydrates }}</li>
    </ul>
  </div>
  <div v-else>
    <p>Loading recipe data...</p>
  </div>
</template>

<style scoped></style>
