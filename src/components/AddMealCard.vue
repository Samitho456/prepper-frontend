<script setup>
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { ref } from 'vue'

const toast = useToast()

defineOptions({
  name: 'AddMealCard',
})

const props = defineProps({
  recipes: {
    type: Array,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['meal-added'])

const editmode = ref(false)
const formData = ref({
  date: props.Date,
  recipeId: null,
  mealType: '',
})

async function submitForm() {
  try {
    const data = {
      isConsumed: false,
      userId: 1,
      recipeId: formData.value.recipeId,
      mealType: formData.value.mealType,
      date: formData.value.date,
    }

    const response = await axios.post('/api/mealplans', data)

    emit('meal-added', response.data)
    toast.success('Meal added successfully!')
    formData.value.recipeId = null
    formData.value.mealType = ''
    editmode.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to add meal.')
  }
}
</script>

<template>
  <div class="add-meal-container">
    <button v-if="!editmode" class="action-button" @click="editmode = !editmode">Add Meal</button>
    <form v-else @submit.prevent="submitForm">
      <label for="meal-select">Add Meal:</label>
      <select name="recipes" id="recipe-select" class="meal-select" v-model="formData.recipeId">
        <option v-for="recipe in recipes" :key="recipe.id" :value="recipe.id">
          {{ recipe.title }}
        </option>
      </select>
      <select name="meal-type" id="meal-select" class="meal-select" v-model="formData.mealType">
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit" class="action-button">Add Meal</button>
      <button type="button" class="cancel-button" @click="editmode = !editmode">Cancel</button>
    </form>
  </div>
</template>

<style scoped>
div {
  border: 1px solid var(--border-color);
  padding: 10px;
  margin: 5px 0;
  border-radius: var(--container-border-radius);
  background-color: var(--content-card-bg);
}
.meal-select {
  padding: var(--button-border-radius);
  border: 1px solid var(--border-color);
  border-radius: var(--button-border-radius);
  width: 100%;
  box-sizing: border-box;
  margin-right: 10px;
}
</style>
