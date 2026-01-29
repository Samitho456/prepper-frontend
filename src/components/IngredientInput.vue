<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const ingredients = ref(props.modelValue)

// Watch for external changes to modelValue
import { watch } from 'vue'
watch(
  () => props.modelValue,
  (newVal) => {
    ingredients.value = newVal
  },
)

// Update parent when ingredients change
watch(
  ingredients,
  (newVal) => {
    emit('update:modelValue', newVal)
  },
  { deep: true },
)

const ingredient = ref('')
const quantity = ref(null)
const unit = ref('grams')

// Ingredient database selection
const availableIngredients = ref([])
const filteredIngredients = ref([])
const showIngredientDropdown = ref(false)
const selectedIngredientFromDB = ref(null)

// Editing state for inline ingredient edits
const editingIndex = ref(-1)
const editedIngredient = ref({ ingredient: '', quantity: null, unit: 'grams' })

// Get ingredients from database
onMounted(async () => {
  try {
    const response = await axios.get('/api/ingredients')
    availableIngredients.value = response.data
  } catch (error) {
    console.error('Error fetching ingredients:', error)
  }
})

function filterIngredients() {
  const search = ingredient.value.toLowerCase().trim()
  if (!search) {
    filteredIngredients.value = []
    showIngredientDropdown.value = false
    return
  }

  filteredIngredients.value = availableIngredients.value.filter((ing) =>
    ing.name.toLowerCase().includes(search),
  )
  showIngredientDropdown.value = true
}

function selectIngredientFromDB(dbIngredient) {
  selectedIngredientFromDB.value = dbIngredient
  ingredient.value = dbIngredient.name
  showIngredientDropdown.value = false
  filteredIngredients.value = []
}

function addIngredient(ing, qty, u) {
  const newIngredient = {
    ingredient: String(ing).trim(),
    quantity: qty,
    unit: u,
    ingredientId: selectedIngredientFromDB.value?.id || null,
    isNewIngredient: !selectedIngredientFromDB.value,
  }
  ingredients.value.push(newIngredient)
  ingredient.value = ''
  quantity.value = null
  unit.value = 'grams'
  selectedIngredientFromDB.value = null
  showIngredientDropdown.value = false
  filteredIngredients.value = []
}

function editIngredient(index) {
  const ing = ingredients.value[index]
  editedIngredient.value.ingredient = ing.ingredient
  editedIngredient.value.quantity = ing.quantity
  editedIngredient.value.unit = ing.unit
  editingIndex.value = index
}

function saveEditedIngredient(index) {
  const e = editedIngredient.value
  if (!e.ingredient || String(e.ingredient).trim() === '' || !e.quantity) return
  ingredients.value[index] = {
    ingredient: String(e.ingredient).trim(),
    quantity: e.quantity,
    unit: e.unit,
  }
  editingIndex.value = -1
  editedIngredient.value = { ingredient: '', quantity: null, unit: 'grams' }
}

function cancelEdit() {
  editingIndex.value = -1
  editedIngredient.value = { ingredient: '', quantity: null, unit: 'grams' }
}

function removeIngredient(index) {
  ingredients.value.splice(index, 1)
}
</script>

<template>
  <div class="ingredient-section">
    <label for="ingredients">Ingredients:</label>
    <div v-for="(item, index) in ingredients" :key="index">
      <div class="ingredient-item">
        <template v-if="editingIndex === index">
          <input v-model="editedIngredient.ingredient" type="text" placeholder="e.g. Spaghetti" />
          <input v-model.number="editedIngredient.quantity" type="number" placeholder="e.g. 200" />
          <select v-model="editedIngredient.unit">
            <option value="grams">g</option>
            <option value="kilograms">kg</option>
            <option value="milliliters">ml</option>
            <option value="deciliters">dl</option>
            <option value="liter">l</option>
            <option value="tablespoons">tbsp</option>
            <option value="teaspoons">tsp</option>
            <option value="pieces">pieces</option>
          </select>
          <button type="button" class="edit-btn" @click="saveEditedIngredient(index)">Save</button>
          <button type="button" class="remove-ingredient-btn" @click="cancelEdit">Cancel</button>
        </template>
        <template v-else>
          <p class="added-ingredients">
            {{ item.ingredient }} - {{ item.quantity }} {{ item.unit }}
          </p>
          <button type="button" class="remove-ingredient-btn" @click="removeIngredient(index)">
            x
          </button>
          <button type="button" class="edit-btn" @click="editIngredient(index)">edit</button>
        </template>
      </div>
    </div>
    <div class="ingredient-row">
      <div class="ingredient-input-wrapper">
        <input
          v-model="ingredient"
          type="text"
          id="ingredient"
          placeholder="Search or add new ingredient (e.g. Spaghetti)"
          @input="filterIngredients"
          @focus="filterIngredients"
          autocomplete="off"
          style="width: 330px"
        />
        <div
          v-if="showIngredientDropdown && filteredIngredients.length > 0"
          class="ingredient-dropdown"
        >
          <div
            v-for="dbIng in filteredIngredients"
            :key="dbIng.id"
            class="ingredient-dropdown-item"
            @click="selectIngredientFromDB(dbIng)"
          >
            {{ dbIng.name }}
          </div>
        </div>
        <div
          v-if="showIngredientDropdown && filteredIngredients.length === 0 && ingredient.trim()"
          class="ingredient-dropdown"
        >
          <div class="ingredient-dropdown-item new-ingredient">
            Add "{{ ingredient }}" as new ingredient
          </div>
        </div>
      </div>
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
        v-if="selectedIngredientFromDB"
        :disabled="!ingredient || ingredient.trim() === '' || !quantity || quantity <= 0"
        @click="addIngredient(ingredient, quantity, unit)"
      >
        Use Ingredient
      </button>
      <button
        type="button"
        v-else
        :disabled="!ingredient || ingredient.trim() === '' || !quantity || quantity <= 0"
        @click="addIngredient(ingredient, quantity, unit)"
      >
        Add New Ingredient
      </button>
    </div>
  </div>
</template>

<style scoped>
.ingredient-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ingredient-section label {
  color: var(--font-color);
  font-weight: bold;
}

.ingredient-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.added-ingredients {
  color: var(--font-color);
  margin: 0;
}

.ingredient-row {
  display: flex;
  gap: 8px;
}

.ingredient-input-wrapper {
  position: relative;
}

.ingredient-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ingredient-dropdown-item {
  padding: 10px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;
}

.ingredient-dropdown-item:hover {
  background-color: #f0f0f0;
}

.ingredient-dropdown-item.new-ingredient {
  color: #28a745;
  font-weight: 500;
  border-top: 1px solid #e0e0e0;
}

.remove-ingredient-btn {
  padding: 4px 8px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.remove-ingredient-btn:hover {
  background-color: #c82333;
}

.edit-btn {
  padding: 4px 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0056b3;
}

input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 11px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
