<script setup>
import { RouterLink } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'
defineOptions({
  name: 'RecipeOverviewView',
})

const sampleRecipe = {
  id: 1,
  title: 'Spaghetti Bolognese',
  description: 'A classic Italian pasta dish with rich meat sauce.',
  servings: 4,
  preparationTimeMinutes: 30,
  mealType: 'Dinner',
  ingredients: [
    {
      name: 'Spaghetti',
      quantity: '400',
      unit: 'g',
    },
    {
      name: 'Ground Beef',
      quantity: '250',
      unit: 'g',
    },
    {
      name: 'Tomato Sauce',
      quantity: '1',
      unit: 'cup',
    },
  ],
  instructions: [
    {
      step: 1,
      instructionText: 'Cook spaghetti according to package instructions.',
    },
    {
      step: 2,
      instructionText: 'In a separate pan, brown the ground beef.',
    },
    {
      step: 3,
      instructionText: 'Add tomato sauce to the beef and simmer for 15 minutes.',
    },
  ],
  nutritionPrServing: {
    calories: 450,
    protein: '25g',
    fat: '15g',
    carbohydrates: '50g',
  },
}
</script>

<template>
  <h1>Recipe Overview</h1>
  <div class="control-bar">
    <input type="text" name="searchbar" id="searchbar" placeholder="Search Recipes..." />
    <RouterLink to="/AddRecipe">
      <button class="add-new-recipe-button">Add New Recipe</button>
    </RouterLink>
    <select name="filter-recipes" id="filter-recipes">
      <option value="all">All Recipes</option>
      <option value="breakfast">Breakfast</option>
      <option value="lunch">Lunch</option>
      <option value="dinner">Dinner</option>
      <option value="snack">Snack</option>
    </select>
  </div>
  <RecipeCard :recipe="sampleRecipe" />
</template>

<style scoped>
h1 {
  color: white;
  text-align: center;
  margin-top: 20px;
}

.control-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}

.add-new-recipe-button {
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}

select {
  padding: 5px;
  font-size: 16px;
}

input[type='text'] {
  padding: 5px;
  font-size: 16px;
  width: 200px;
}
</style>
