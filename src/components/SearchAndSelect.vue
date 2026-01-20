<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'SearchAndSelect',
})

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Search item',
  },
})

const searchQuery = ref('')
const filteredItems = ref([...(props.items || [])])
const showDropdown = ref(false)

function filterItems() {
  if (!searchQuery.value) {
    filteredItems.value = props.items
    showDropdown.value = false
    return
  }
  filteredItems.value = props.items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  showDropdown.value = true
}

function handleSelectItem(item) {
  searchQuery.value = item.title
  showDropdown.value = false
}
</script>

<template>
  <input
    type="text"
    :placeholder="props.placeholder"
    v-model="searchQuery"
    @input="filterItems"
    @focus="showDropdown = true"
  />
  <div v-if="showDropdown" class="dropdown">
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="dropdown-item"
      @click="handleSelectItem(item)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<style scoped>
input {
  padding: var(--button-border-radius);
  border: 1px solid var(--border-color);
  border-radius: var(--button-border-radius);
  width: 100%;
  box-sizing: border-box;
  margin-right: 10px;
}

.dropdown {
  border: 1px solid var(--border-color);
  max-height: 150px;
  overflow-y: auto;
  background-color: var(--content-card-bg);
  z-index: 1000;
}

.dropdown-item {
  padding: 4px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--primary-color);
  color: var(--secondary-font-colo);
}
</style>
