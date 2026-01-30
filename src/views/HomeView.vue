<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useIngredientStore } from '@/stores/ingredients'

const inventoryItems = ref([])
const ingredientStore = useIngredientStore()
const isLoading = ref(false)

const ingredients = computed(() => ingredientStore.allIngredients)

const expiringItems = computed(() => {
  const now = new Date()
  const cutoff = new Date(now.getTime() + 48 * 60 * 60 * 1000)
  const ingredientMap = new Map(
    ingredients.value.map((ingredient) => [ingredient.id, ingredient.name]),
  )

  return inventoryItems.value
    .filter((item) => item.ingredientId && item.expirationDate)
    .map((item) => {
      const expiresAt = new Date(item.expirationDate)
      return {
        ...item,
        name: ingredientMap.get(item.ingredientId) || 'Unknown ingredient',
        expiresAt,
      }
    })
    .filter((item) => item.expiresAt >= now && item.expiresAt <= cutoff)
    .sort((a, b) => a.expiresAt - b.expiresAt)
})

const expiringCount = computed(() => expiringItems.value.length)

function formatExpiry(date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  isLoading.value = true
  try {
    const [inventoryResponse] = await Promise.all([
      axios.get('/api/InventoryItems'),
      ingredientStore.fetchIngredients(),
    ])
    inventoryItems.value = Array.isArray(inventoryResponse.data) ? inventoryResponse.data : []
  } catch (error) {
    console.error('Error fetching inventory data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="home-view">
    <h1>Welcome to Prepper</h1>

    <div class="notification-card">
      <header class="notification-header">
        <h2>Expiring Soon</h2>
        <span class="badge">{{ expiringCount }}</span>
      </header>

      <p class="notification-subtitle">Ingredients expiring within 48 hours</p>

      <div v-if="isLoading" class="notification-loading">Checking inventory...</div>
      <div v-else-if="expiringItems.length === 0" class="notification-empty">
        Nothing expiring soon. You’re all set.
      </div>
      <ul v-else class="notification-list">
        <li v-for="item in expiringItems" :key="item.id" class="notification-item">
          <div>
            <strong>{{ item.name }}</strong>
            <div class="notification-meta">Qty: {{ item.quantity }} {{ item.unit }}</div>
          </div>
          <div class="notification-expiry">{{ formatExpiry(item.expiresAt) }}</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.home-view {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  margin: 0;
  color: var(--font-color);
}

.notification-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.badge {
  background: #f97316;
  color: #fff;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
}

.notification-subtitle {
  margin: 4px 0 16px 0;
  color: var(--secondary-font-color);
}

.notification-loading,
.notification-empty {
  color: var(--secondary-font-color);
  font-weight: 600;
}

.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: #fff7ed;
}

.notification-meta {
  color: #9a3412;
  font-size: 0.9rem;
}

.notification-expiry {
  font-weight: 600;
  color: #c2410c;
}
</style>
