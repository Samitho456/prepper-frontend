<script setup>
defineOptions({
  name: 'AddRecipeView',
})

function addRecipe() {
  // Logic to add the recipe goes here
  alert('Recipe added!')
}
</script>

<template>
  <h1>Add Recipe</h1>
  <form class="add-recipe-form" @submit.prevent="addRecipe">
    <label for="title">Recipe Title:</label>
    <input type="text" id="title" name="title" required />

    <label for="description">Description:</label>
    <textarea id="description" name="description" required></textarea>

    <label for="servings">Servings:</label>
    <input type="number" id="servings" name="servings" required />

    <label for="prep-time">Preparation Time (minutes):</label>
    <input type="number" id="prep-time" name="prep-time" required />

    <label for="meal-type">Meal Type:</label>
    <select id="meal-type" name="meal-type" required>
      <option value="breakfast">Breakfast</option>
      <option value="lunch">Lunch</option>
      <option value="dinner">Dinner</option>
      <option value="snack">Snack</option>
      <option value="dessert">Dessert</option>
    </select>

    <div>
      <label for="ingredients">Ingredients (one per line):</label>
      <input type="text" id="ingredients" name="ingredients" required />
      <input type="number" id="quantity" name="quantity" required />
      <input type="text" id="unit" name="unit" required />
      <button>Add Ingredient</button>
    </div>

    <button type="submit">Add Recipe</button>
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
  max-width: 400px;
  margin: 0 auto;
  gap: 12px;
}
.add-recipe-form label {
  font-weight: bold;
  color: white;
}
.add-recipe-form input,
.add-recipe-form textarea,
.add-recipe-form select {
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.add-recipe-form button {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
