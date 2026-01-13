<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})
defineOptions({
  name: 'RecipeCard',
})
</script>

<template>
  <div class="recipe-card">
    <div v-if="recipe.image"><img :src="recipe.image" :alt="recipe.title" /></div>
    <div v-else><img src="/placeholder.png" alt="placeholder" /></div>
    <h2>{{ recipe.title }}</h2>
    <h3>{{ recipe.mealType }}</h3>

    <div class="icon-container">
      <span>Servings: {{ recipe.servings }}</span>
      <span>Prep Time: {{ recipe.preparationTimeMinutes }} mins</span>
      <span>Kcal: {{ recipe.nutritionPrServing.calories }}</span>
      <span>Protein: {{ recipe.nutritionPrServing.protein }}</span>
    </div>
    <p>{{ recipe.description }}</p>
  </div>
</template>

<style scoped>
.recipe-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  max-width: 300px;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.1);
  margin: 16px;
  background-color: white;
}
.recipe-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
.recipe-card h2 {
  margin: 12px 0 8px 0;
  font-size: 1.5em;
}
.recipe-card h3 {
  margin: 0 0 12px 0;
  font-size: 1.2em;
  color: #666;
}
.icon-container {
  display: flex;
  gap: 10px;
  font-size: 0.9em;
  color: #333;
  margin-bottom: 12px;
}
.recipe-card p {
  font-size: 1em;
  color: #444;
}
</style>
