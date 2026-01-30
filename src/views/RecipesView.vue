<script setup>
import { RouterLink } from 'vue-router'
import RecipeCard from '@/components/RecipeCard.vue'
import { computed, onMounted } from 'vue'
import { useRecipeStore } from '@/stores/recipes'

defineOptions({
  name: 'RecipeOverviewView',
})

const recipeStore = useRecipeStore()

// Use computed to reactively get recipes from store
const recipes = computed(() => recipeStore.allRecipes)
const isLoading = computed(() => recipeStore.isLoading)

onMounted(async () => {
  document.title = 'Prepper - Recipes'
  try {
    await recipeStore.fetchRecipes()
  } catch (error) {
    console.error('Error fetching recipes:', error)
  }
})
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
  <div class="recipes-grid" v-if="!isLoading && recipes.length > 0">
    <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
  </div>
  <div v-else-if="isLoading">
    <p>Loading recipes...</p>
  </div>
  <div v-else>
    <p>No recipes found</p>
  </div>
  <!-- <RecipeCard :recipe="sampleRecipe" /> -->
</template>

<style scoped>
h1 {
  color: black;
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

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>
