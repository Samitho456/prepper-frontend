<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

defineOptions({
  name: 'ShoppingListView',
})

const showCompleted = ref(true)
const filterAgainstInventory = ref(true)
const isInventoryLoading = ref(false)
const inventoryItems = ref([])
const ingredients = ref([])
const nextId = ref(6)
const newItem = ref({
  name: '',
  quantity: '',
  category: 'Other',
})
const items = ref([
  { id: 1, name: 'Chicken breast', quantity: '1 kg', category: 'Protein', completed: false },
  { id: 2, name: 'Bell peppers', quantity: '3 pcs', category: 'Produce', completed: false },
  { id: 3, name: 'Tomato paste', quantity: '1 can', category: 'Pantry', completed: true },
  { id: 4, name: 'Greek yogurt', quantity: '500 g', category: 'Dairy', completed: false },
  { id: 5, name: 'Olive oil', quantity: '1 bottle', category: 'Pantry', completed: false },
])

const filteredItems = computed(() => {
  let list = showCompleted.value ? items.value : items.value.filter((item) => !item.completed)
  if (filterAgainstInventory.value) {
    list = list.filter((item) => !isItemInInventory(item))
  }
  return list
})

const inventoryIngredientIdSet = computed(
  () =>
    new Set(
      inventoryItems.value
        .filter((item) => item.ingredientId)
        .map((item) => String(item.ingredientId)),
    ),
)

const inventoryNameSet = computed(() => {
  const names = new Set()
  const ingredientMap = new Map(
    ingredients.value.map((ingredient) => [ingredient.id, ingredient.name]),
  )

  inventoryItems.value.forEach((item) => {
    if (item.ingredientId) {
      const ingredientName = ingredientMap.get(item.ingredientId)
      if (ingredientName) {
        names.add(normalizeName(ingredientName))
      }
    }

    if (item.name) {
      names.add(normalizeName(item.name))
    }
  })

  return names
})

const inventoryQuantityByIngredient = computed(() => {
  const quantityMap = new Map()

  inventoryItems.value.forEach((item) => {
    if (!item.ingredientId) {
      return
    }

    const quantity = Number(item.quantity)
    if (Number.isNaN(quantity)) {
      return
    }

    const unit = normalizeUnit(item.unit)
    const unitDef = getUnitDefinition(unit)
    if (!unitDef) {
      const key = `${item.ingredientId}|${unit}`
      quantityMap.set(key, (quantityMap.get(key) || 0) + quantity)
      return
    }

    const key = `${item.ingredientId}|${unitDef.family}`
    const baseAmount = quantity * unitDef.factor
    quantityMap.set(key, (quantityMap.get(key) || 0) + baseAmount)
  })

  return quantityMap
})

const inventoryQuantityByName = computed(() => {
  const quantityMap = new Map()
  const ingredientMap = new Map(
    ingredients.value.map((ingredient) => [ingredient.id, ingredient.name]),
  )

  inventoryItems.value.forEach((item) => {
    let name = ''
    if (item.ingredientId) {
      name = ingredientMap.get(item.ingredientId) || ''
    }

    if (!name && item.name) {
      name = item.name
    }

    if (!name) {
      return
    }

    const quantity = Number(item.quantity)
    if (Number.isNaN(quantity)) {
      return
    }

    const unit = normalizeUnit(item.unit)
    const unitDef = getUnitDefinition(unit)
    if (!unitDef) {
      const key = `${normalizeName(name)}|${unit}`
      quantityMap.set(key, (quantityMap.get(key) || 0) + quantity)
      return
    }

    const key = `${normalizeName(name)}|${unitDef.family}`
    const baseAmount = quantity * unitDef.factor
    quantityMap.set(key, (quantityMap.get(key) || 0) + baseAmount)
  })

  return quantityMap
})

const groupedItems = computed(() => {
  const groups = new Map()
  filteredItems.value.forEach((item) => {
    const category = item.category || 'Other'
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category).push(item)
  })

  return Array.from(groups.entries()).map(([category, groupItems]) => ({
    category,
    items: groupItems,
  }))
})

const remainingCount = computed(() => items.value.filter((item) => !item.completed).length)

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function normalizeUnit(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function getUnitDefinition(unit) {
  const normalized = normalizeUnit(unit)
  if (!normalized) {
    return null
  }

  if (['g', 'gram', 'grams'].includes(normalized)) {
    return { family: 'weight', factor: 1, label: 'g' }
  }
  if (['kg', 'kgs', 'kilogram', 'kilograms'].includes(normalized)) {
    return { family: 'weight', factor: 1000, label: 'g' }
  }
  if (['mg', 'milligram', 'milligrams'].includes(normalized)) {
    return { family: 'weight', factor: 0.001, label: 'g' }
  }
  if (['ml', 'milliliter', 'milliliters'].includes(normalized)) {
    return { family: 'volume', factor: 1, label: 'ml' }
  }
  if (['l', 'liter', 'litre', 'liters', 'litres'].includes(normalized)) {
    return { family: 'volume', factor: 1000, label: 'ml' }
  }
  if (['pcs', 'pc', 'piece', 'pieces', 'stk'].includes(normalized)) {
    return { family: 'count', factor: 1, label: 'pcs' }
  }

  return null
}

function parseQuantityText(value) {
  const text = String(value || '').trim()
  if (!text) {
    return { amount: null, unit: '' }
  }

  const match = text.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/)
  if (!match) {
    return { amount: null, unit: '' }
  }

  const amount = Number(match[1].replace(',', '.'))
  if (Number.isNaN(amount)) {
    return { amount: null, unit: '' }
  }

  return { amount, unit: normalizeUnit(match[2]) }
}

function hasSufficientInventory(item) {
  const { amount, unit } = parseQuantityText(item.quantity)

  if (amount === null) {
    const itemName = normalizeName(item.name)
    if (itemName && inventoryNameSet.value.has(itemName)) {
      return true
    }

    if (item.ingredientId && inventoryIngredientIdSet.value.has(String(item.ingredientId))) {
      return true
    }

    if (item.id && inventoryIngredientIdSet.value.has(String(item.id))) {
      return true
    }

    return false
  }

  const unitKey = normalizeUnit(unit)
  const unitDef = getUnitDefinition(unitKey)
  const ingredientId = item.ingredientId || item.id

  if (!unitDef) {
    if (ingredientId) {
      const ingredientKey = `${ingredientId}|${unitKey}`
      const available = inventoryQuantityByIngredient.value.get(ingredientKey) || 0
      return available >= amount
    }

    const nameKey = `${normalizeName(item.name)}|${unitKey}`
    const available = inventoryQuantityByName.value.get(nameKey) || 0
    return available >= amount
  }

  const requiredBase = amount * unitDef.factor
  if (ingredientId) {
    const ingredientKey = `${ingredientId}|${unitDef.family}`
    const available = inventoryQuantityByIngredient.value.get(ingredientKey) || 0
    return available >= requiredBase
  }

  const nameKey = `${normalizeName(item.name)}|${unitDef.family}`
  const available = inventoryQuantityByName.value.get(nameKey) || 0
  return available >= requiredBase
}

function isItemInInventory(item) {
  return hasSufficientInventory(item)
}

function addItem() {
  const name = newItem.value.name.trim()
  const quantity = newItem.value.quantity.trim()
  const category = newItem.value.category.trim() || 'Other'

  if (!name) {
    return
  }

  items.value.unshift({
    id: nextId.value,
    name,
    quantity: quantity || '1',
    category,
    completed: false,
  })

  nextId.value += 1
  newItem.value.name = ''
  newItem.value.quantity = ''
  newItem.value.category = category
}

function removeItem(itemId) {
  items.value = items.value.filter((item) => item.id !== itemId)
}

async function fetchInventoryData() {
  isInventoryLoading.value = true
  try {
    const [inventoryResponse, ingredientResponse] = await Promise.all([
      axios.get('/api/InventoryItems'),
      axios.get('/api/ingredients'),
    ])
    inventoryItems.value = Array.isArray(inventoryResponse.data) ? inventoryResponse.data : []
    ingredients.value = Array.isArray(ingredientResponse.data) ? ingredientResponse.data : []
  } catch (error) {
    console.error('Error fetching inventory data:', error)
  } finally {
    isInventoryLoading.value = false
  }
}

onMounted(async () => {
  document.title = 'Prepper - Shopping List'

  const storedItems = localStorage.getItem('shoppingListItems')
  if (storedItems) {
    try {
      const parsed = JSON.parse(storedItems)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = parsed.map((item, index) => ({
          id: item.id ?? index + 1,
          name: item.name ?? 'Item',
          quantity: item.quantity ?? '1',
          category: item.category ?? 'Other',
          completed: Boolean(item.completed),
        }))
        items.value = normalized
        const maxId = normalized.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
        nextId.value = maxId + 1
      }
    } catch {
      // Ignore invalid storage data
    }
  }

  await fetchInventoryData()
})
</script>

<template>
  <section class="shopping-view">
    <header class="shopping-header">
      <div>
        <h1>Shopping List</h1>
        <p class="subtitle">Track what you need to buy for upcoming meals.</p>
      </div>
      <div class="summary">
        <span class="badge">{{ remainingCount }} remaining</span>
        <label class="toggle">
          <input type="checkbox" v-model="showCompleted" />
          <span>Show completed</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="filterAgainstInventory" :disabled="isInventoryLoading" />
          <span>Hide items in inventory</span>
        </label>
        <span v-if="isInventoryLoading" class="inventory-status">Checking inventory...</span>
      </div>
    </header>

    <form class="add-form" @submit.prevent="addItem">
      <div class="field">
        <label for="item-name">Item</label>
        <input
          id="item-name"
          type="text"
          v-model="newItem.name"
          placeholder="e.g. Jasmine rice"
          required
        />
      </div>
      <div class="field">
        <label for="item-quantity">Quantity</label>
        <input
          id="item-quantity"
          type="text"
          v-model="newItem.quantity"
          placeholder="e.g. 2 bags"
        />
      </div>
      <div class="field">
        <label for="item-category">Category</label>
        <input
          id="item-category"
          type="text"
          v-model="newItem.category"
          placeholder="e.g. Pantry"
        />
      </div>
      <button class="add-button" type="submit">Add item</button>
    </form>

    <div v-if="groupedItems.length === 0" class="empty-state">
      <h2>All done 🎉</h2>
      <p>Your shopping list is empty.</p>
    </div>

    <div v-else class="groups">
      <article v-for="group in groupedItems" :key="group.category" class="group">
        <h2>{{ group.category }}</h2>
        <ul>
          <li v-for="item in group.items" :key="item.id" :class="{ completed: item.completed }">
            <div class="item">
              <label class="item-main">
                <input type="checkbox" v-model="item.completed" />
                <span class="name">{{ item.name }}</span>
                <span class="quantity">{{ item.quantity }}</span>
              </label>
              <button class="remove-button" type="button" @click="removeItem(item.id)">
                Remove
              </button>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.shopping-view {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.shopping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

h1 {
  margin: 0 0 6px 0;
  color: var(--font-color);
}

.subtitle {
  margin: 0;
  color: var(--secondary-font-color);
}

.summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.add-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  align-items: end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--secondary-font-color);
  font-weight: 600;
}

.field input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
}

.add-button {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: var(--primary-color);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.add-button:hover {
  background: #348b9f;
}

.badge {
  background: var(--tertiary-color);
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 600;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--secondary-font-color);
  font-weight: 600;
}

.inventory-status {
  font-size: 0.9rem;
  color: var(--secondary-font-color);
}

.groups {
  display: grid;
  gap: 20px;
}

.group {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.group h2 {
  margin: 0 0 12px 0;
  color: var(--font-color);
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f7fafb;
}

.item-main {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.name {
  font-weight: 600;
  color: var(--font-color);
}

.quantity {
  color: var(--secondary-font-color);
  font-size: 0.95rem;
}

.remove-button {
  background: transparent;
  border: 1px solid #e2e8f0;
  color: var(--secondary-font-color);
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.remove-button:hover {
  border-color: #f87171;
  color: #ef4444;
}

.completed .name,
.completed .quantity {
  text-decoration: line-through;
  color: #94a3b8;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.empty-state h2 {
  margin-bottom: 10px;
}
</style>
