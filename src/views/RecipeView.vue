<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { RingLoader } from 'vue3-spinner'

// Import SVG icons
import restaurantIcon from '@/assets/restaurant_651586.svg'
import alarmClockIcon from '@/assets/alarm-clock_1255451.svg'
import knifeForkIcon from '@/assets/knife-fork_15451582.svg'

const route = useRoute()

defineOptions({
  name: 'RecipeView',
})

const state = ref({
  recipe: {
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
  },
  isLoading: true,
})

const sampleRecipe = {
  id: 2,
  title: 'Chicken noodle stir fry',
  description: 'Simple tasty wok recipe',
  servings: 3,
  preparationTimeMinutes: 45,
  mealType: 'Dinner',
  createdAt: '2026-01-11T02:12:53.283301+00:00',
  ingredients: [
    {
      id: 18,
      recipeId: 2,
      ingredientId: 18,
      name: 'Chicken breast skinless',
      quantity: 400,
      unit: 'g',
      createdAt: '2026-01-11T02:19:02.04554+00:00',
    },
    {
      id: 19,
      recipeId: 2,
      ingredientId: 19,
      name: 'Salt',
      quantity: 0.5,
      unit: 'tsp',
      createdAt: '2026-01-11T02:21:17.114451+00:00',
    },
    {
      id: 20,
      recipeId: 2,
      ingredientId: 20,
      name: 'Black pepper',
      quantity: 0.5,
      unit: 'tsp',
      createdAt: '2026-01-11T02:23:04.354754+00:00',
    },
    {
      id: 21,
      recipeId: 2,
      ingredientId: 21,
      name: 'Paprika',
      quantity: 0.5,
      unit: 'tsp',
      createdAt: '2026-01-11T02:23:30.517642+00:00',
    },
    {
      id: 22,
      recipeId: 2,
      ingredientId: 22,
      name: 'Garlic',
      quantity: 1,
      unit: 'tbsp',
      createdAt: '2026-01-11T02:24:14.32593+00:00',
    },
    {
      id: 23,
      recipeId: 2,
      ingredientId: 23,
      name: 'Carrot',
      quantity: 70,
      unit: 'g',
      createdAt: '2026-01-11T02:25:35.103462+00:00',
    },
  ],
  instructions: [
    {
      id: 0,
      createdAt: '2026-01-11T02:14:55.892359+00:00',
      recipeId: 0,
      stepNumber: 1,
      instructionText:
        'Cook 75 g of raw noodles in lightly salted water according to the package instructions (typically 8–10 minutes).\nDrain the water and set the noodles aside.',
    },
    {
      id: 0,
      createdAt: '2026-01-11T02:15:26.394772+00:00',
      recipeId: 0,
      stepNumber: 2,
      instructionText:
        'In a bowl: mix 400g chicken pieces with:\n2 tsp sesame oil\n1/2 tsp salt\n1/2 tsp black pepper\n1/2 tsp paprika\nLet marinate for 5–10 minutes while you prepare the rest.',
    },
    {
      id: 0,
      createdAt: '2026-01-11T02:16:05.971212+00:00',
      recipeId: 0,
      stepNumber: 3,
      instructionText:
        'Heat a large frying pan or wok over medium-high heat.\nAdd the marinated chicken and cook for 6–8 minutes, until browned and cooked through.',
    },
    {
      id: 0,
      createdAt: '2026-01-11T02:16:47.501182+00:00',
      recipeId: 0,
      stepNumber: 4,
      instructionText:
        'When the chicken is almost done, add:\n1 tbsp minced garlic\n0.6 dl sliced ​​spring onions\nSauté for 1–2 minutes, until fragrant and the spring onions are soft.',
    },
    {
      id: 0,
      createdAt: '2026-01-11T02:17:05.852445+00:00',
      recipeId: 0,
      stepNumber: 5,
      instructionText:
        'Add:\n1 small sliced ​​onion\n1.2 dl grated carrots\nRoast for another 2–3 minutes until vegetables are tender.',
    },
    {
      id: 0,
      createdAt: '2026-01-11T02:17:25.276728+00:00',
      recipeId: 0,
      stepNumber: 6,
      instructionText:
        'Add the cooked noodles and:\n3 tablespoons soy sauce\n1 tablespoon hot sauce\n2 teaspoons honey\n1 tablespoon brown sugar\nStir everything together well and let it heat through for 1–2 minutes so the flavors can blend.',
    },
  ],
  nutritionalProfilePerServing: {
    id: 0,
    createdAt: '0001-01-01T00:00:00+00:00',
    ingredientId: 0,
    unitAmount: 0,
    baseUnit: null,
    kcal: 440,
    kj: null,
    fatTotal: 5.2,
    fatSaturated: 1.2,
    carbohydrateTotal: null,
    carbohydrateSugars: null,
    fiber: null,
    protein: 92,
    salt: null,
  },
}

onMounted(async () => {
  try {
    const id = route.params.id
    // const response = await axios.get(`/api/Fullrecipes/${id}`)
    state.value.recipe = sampleRecipe
    console.log('Fetched recipe data:', state.value.recipe)
    state.value.isLoading = false
  } catch (error) {
    console.error('Error fetching recipe data:', error)
  }
})
</script>

<template>
  <section v-if="!state.isLoading">
    <h1>{{ state.recipe.title }}</h1>
    <p>{{ state.recipe.description }}</p>

    <div class="img-np-box">
      <div v-if="state.recipe.img">
        <img :src="state.recipe.img" :alt="state.recipe.title" />
      </div>
      <div v-else>
        <img src="/placeholder.png" alt="placeholder image" />
      </div>

      <div class="time-type-box">
        <h3>Details</h3>
        <span class="detail-item">
          <img :src="restaurantIcon" alt="Servings" class="detail-icon" />
          <span class="detail-text">Servings: {{ state.recipe.servings }}</span>
        </span>
        <span class="detail-item">
          <img :src="alarmClockIcon" alt="Prep Time" class="detail-icon" />
          <span class="detail-text">Prep Time: {{ state.recipe.preparationTimeMinutes }} mins</span>
        </span>
        <span class="detail-item">
          <img :src="knifeForkIcon" alt="Meal Type" class="detail-icon" />
          <span class="detail-text">Meal Type: {{ state.recipe.mealType }}</span>
        </span>
      </div>

      <div class="nutritionalprofile-box">
        <h3>Nutritional Information (per serving)</h3>
        <ul>
          <li>Calories: {{ state.recipe.nutritionalProfilePerServing.kcal }}</li>
          <li>Protein: {{ state.recipe.nutritionalProfilePerServing.protein }}g</li>
          <li>Fat: {{ state.recipe.nutritionalProfilePerServing.fatTotal }}g</li>
          <li>Carbohydrates: {{ state.recipe.nutritionalProfilePerServing.carbohydrateTotal }}g</li>
        </ul>
      </div>
    </div>

    <div class="ingredient-instruction-container">
      <div class="ingredient-box">
        <h3>Ingredients</h3>
        <ul>
          <li v-for="(ingredient, index) in state.recipe.ingredients" :key="index">
            {{ ingredient.name }} - {{ ingredient.quantity }} {{ ingredient.unit }}
          </li>
        </ul>
      </div>

      <div class="instruction-box">
        <h3>Instructions</h3>
        <ol>
          <li v-for="(instruction, index) in state.recipe.instructions" :key="index">
            {{ instruction.instructionText }}
          </li>
        </ol>
      </div>
    </div>
  </section>
  <div v-else class="loading-spinner">
    <RingLoader />
  </div>
</template>

<style scoped>
section {
  margin: 20px;
  color: black;
}

h1 {
  color: white;
  text-align: left;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* Grid Layout for Image, Details, and Nutrition */
.img-np-box {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.img-np-box > div {
  display: flex;
  flex-direction: column;
}

.img-np-box img {
  height: 350px;
  width: 100%;
  object-fit: cover;
  border-radius: 15px;
}

.time-type-box {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.time-type-box h3 {
  margin: 0 0 20px 0;
  text-align: center;
  font-size: 24px;
}

.time-type-box span {
  font-size: 1.3em;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  white-space: nowrap;
  margin-bottom: 30px;
}

.detail-icon {
  max-width: 36px;

  .detail-text {
    display: inline-block;
    transform: translateY(-5px);
  }
  max-height: 36px;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.detail-item p {
  margin-bottom: 10px;
}

.detail-item,
.nutritionalprofile-box {
  background-color: white;
  border-radius: 15px;
  padding: 15px;
}

.nutritionalprofile-box h3 {
  margin-top: 0;
}

.nutritionalprofile-box ul {
  list-style-type: none;
  padding: 0;
}

/* Grid Layout for Ingredients and Instructions */
.ingredient-instruction-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}

.ingredient-box {
  padding: 15px;
  background-color: #76cca1;
  border-radius: 15px;
}

.ingredient-box h3 {
  margin-top: 0;
}

.instruction-box {
  padding: 15px;
  background-color: white;
  border-radius: 15px;
}

.instruction-box h3 {
  margin-top: 0;
}

.instruction-box li {
  margin-bottom: 10px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .img-np-box {
    grid-template-columns: 1fr 1fr;
  }

  .img-np-box > div:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .img-np-box {
    grid-template-columns: 1fr;
  }

  .ingredient-instruction-container {
    grid-template-columns: 1fr;
  }

  .img-np-box img {
    height: 250px;
  }
}
</style>
