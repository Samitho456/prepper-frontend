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
    </div>
    <p>{{ recipe.description }}</p>
    <RouterLink :to="'/Recipe/' + recipe.id">
      <button>View Recipe</button>
    </RouterLink>
  </div>
</template>

<style scoped>
.recipe-card {
  border: none;
  border-radius: 12px;
  padding: 0;
  max-width: 300px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  margin: 0;
  background-color: white;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.recipe-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  transform: translateY(-4px);
}

.recipe-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.recipe-card h2 {
  margin: 16px 16px 4px 16px;
  font-size: 1.4em;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.recipe-card h3 {
  margin: 4px 16px 12px 16px;
  font-size: 0.95em;
  font-weight: 500;
  color: #348b9f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.icon-container {
  display: flex;
  gap: 12px;
  font-size: 0.85em;
  color: #666;
  margin: 0 16px 12px 16px;
  padding: 8px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.icon-container span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.recipe-card p {
  font-size: 0.95em;
  color: #555;
  margin: 12px 16px;
  line-height: 1.5;
  flex-grow: 1;
}

.recipe-card button {
  background-color: #348b9f;
  color: white;
  border: none;
  padding: 12px 16px;
  margin: 0 16px 16px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95em;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.recipe-card button:hover {
  background-color: #2a7a8d;
  box-shadow: 0 4px 12px rgba(52, 139, 159, 0.3);
}

.recipe-card button:active {
  transform: scale(0.98);
}
</style>
