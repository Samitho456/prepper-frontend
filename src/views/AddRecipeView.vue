<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'AddRecipeView',
})

const ingredients = ref([
  { ingredient: 'Spaghetti', quantity: 200, unit: 'grams' },
  { ingredient: 'Tomato Sauce', quantity: 150, unit: 'milliliters' },
])

const instructions = ref([
  { step: 1, instructionText: 'Cook spaghetti according to package instructions.' },
  { step: 2, instructionText: 'Heat the tomato sauce in a pan.' },
])

const ingredient = ref('')
const quantity = ref(null)
const unit = ref('grams')
const newInstruction = ref('')

function addRecipe() {
  // Logic to add the recipe goes here
  alert('Recipe added!')
}
function addIngredient(ing, qty, u) {
  const newIngredient = { ingredient: String(ing).trim(), quantity: qty, unit: u }
  ingredients.value.push(newIngredient)
  ingredient.value = ''
  quantity.value = null
  unit.value = 'grams'
}

function removeIngredient(index) {
  ingredients.value.splice(index, 1)
}

function addInstruction(stepText) {
  const newInstruction = {
    step: instructions.value.length + 1,
    instructionText: String(stepText).trim(),
  }
  instructions.value.push(newInstruction)
  newInstruction.value = ''
}

function removeInstruction(index) {
  instructions.value.splice(index, 1)
}
</script>

<template>
  <h1>Add Recipe</h1>
  <!-- Form to add a new recipe -->
  <form class="add-recipe-form" @submit.prevent="addRecipe">
    <!-- Recipe Title Input -->
    <div class="form-row">
      <label for="title">Recipe Title:</label>
      <input type="text" id="title" name="title" required placeholder="Spaghetti bolognese" />
    </div>

    <!-- Description Input -->
    <div class="form-row">
      <label for="description">Description:</label>
      <textarea
        id="description"
        name="description"
        required
        placeholder="A classic Italian pasta dish with rich meat sauce"
      ></textarea>
    </div>

    <!-- Servings Input -->
    <div class="form-row">
      <label for="servings">Servings:</label>
      <input type="number" id="servings" name="servings" required placeholder="4" />
    </div>

    <!-- Preparation Time Input -->
    <div class="form-row">
      <label for="prep-time">Preparation Time (minutes):</label>
      <input type="number" id="prep-time" name="prep-time" required placeholder="30" />
    </div>

    <!-- Meal Type Selection -->
    <div class="form-row">
      <label for="meal-type">Meal Type:</label>
      <select id="meal-type" name="meal-type" required>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
        <option value="dessert">Dessert</option>
      </select>
    </div>

    <!-- Ingredient Input Fields -->
    <div class="form-row">
      <label for="ingredients">Ingredients:</label>
      <div v-for="item in ingredients" :key="item.ingredient">
        <div class="ingredient-item">
          <p class="added-ingredients">
            {{ item.ingredient }} - {{ item.quantity }} {{ item.unit }}
          </p>
          <button
            class="remove-ingredient-btn"
            @click="removeIngredient(ingredients.indexOf(item))"
          >
            x
          </button>
        </div>
      </div>
      <div class="ingredient-row">
        <input v-model="ingredient" type="text" id="ingredient" placeholder="e.g. Spaghetti" />
        <input v-model.number="quantity" type="number" id="quantity" placeholder="e.g. 200" />
        <select v-model="unit" name="unit" id="unit">
          <option value="grams" selected>g</option>
          <option value="kilograms">kg</option>
          <option value="milliliters">ml</option>
          <option value="deciliters">dl</option>
          <option value="liter">l</option>
          <option value="tablespoons">tbsp</option>
          <option value="teaspoons">tsp</option>
          <option value="pieces">pieces</option>
        </select>
        <button
          type="button"
          :disabled="!ingredient || ingredient.trim() === '' || !quantity || quantity <= 0"
          @click="addIngredient(ingredient, quantity, unit)"
        >
          Add Ingredient
        </button>
      </div>
    </div>

    <div class="form-row">
      <label for="instructions">Instructions:</label>
      <div v-for="item in instructions" :key="item.step">
        <div class="ingredient-item">
          <p class="added-ingredients">Step {{ item.step }}: {{ item.instructionText }}</p>
          <button
            class="remove-ingredient-btn"
            @click="removeInstruction(instructions.indexOf(item))"
          >
            x
          </button>
        </div>
      </div>
      <div>
        <input
          v-model="newInstruction"
          type="text"
          id="instruction"
          placeholder="e.g. Cook spaghetti according to package instructions."
        />
        <button
          type="button"
          :disabled="!newInstruction || newInstruction.trim() === ''"
          @click="addInstruction(newInstruction)"
        >
          Add Instruction
        </button>
      </div>
    </div>

    <div class="form-row">
      <button type="submit">Add Recipe</button>
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

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.added-ingredients {
  color: white;
  margin: 0;
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

.remove-ingredient-btn {
  padding: 4px 8px;
  background-color: #dc3545 !important;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.remove-ingredient-btn:hover {
  background-color: #c82333;
}

.form-row .ingredient-row {
  display: flex;
  gap: 8px;
}
</style>
