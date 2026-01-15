<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'IngredientView',
})

const state = ref({
  ingredients: [],
})

onMounted(() => {
  document.title = 'Prepper - Ingredient'
  axios
    .get('api/Ingredients/GetNutritionalProfiles')
    .then((response) => {
      console.log('Fetched ingredients:', response.data)
      state.value.ingredients = response.data
    })
    .catch((error) => {
      console.error('Error fetching ingredients:', error)
    })
})
</script>

<template>
  <h1>Ingredient View</h1>
  <div class="ingredients-list" v-if="state.ingredients.length > 0">
    <ul>
      <li v-for="ingredient in state.ingredients" :key="ingredient.id">
        {{ ingredient.name }} - Calories: {{ ingredient.nutritionalProfile.kcal }} kcal, Protein: {{ ingredient.nutritionalProfile.protein }} g, Fat: {{ ingredient.nutritionalProfile.fatTotal }} g, Carbohydrates: {{ ingredient.nutritionalProfile.carbohydrateTotal }} g
      </li>
    </ul>
</template>

<style scoped></style>
